import { NextResponse } from 'next/server';
import { PesaPalProvider } from '@/lib/payments/pesapal';
import { prisma } from '@/lib/prisma';
import { sendBookingReceipt } from '@/lib/mail';
import type { IPesaPalTransactionStatusResponse } from '@/types';

/**
 * Extract IPN parameters from request (supports both GET and POST)
 */
async function extractIPNParams(request: Request): Promise<{
  orderTrackingId: string | null;
  orderMerchantReference: string | null;
  orderNotificationType: string | null;
}> {
  const url = new URL(request.url);
  
  // Try GET query parameters first
  const trackingId = url.searchParams.get('OrderTrackingId');
  const merchantRef = url.searchParams.get('OrderMerchantReference');
  const notificationType = url.searchParams.get('OrderNotificationType');

  if (trackingId || merchantRef) {
    return {
      orderTrackingId: trackingId,
      orderMerchantReference: merchantRef,
      orderNotificationType: notificationType,
    };
  }

  // Fallback to POST body
  try {
    const body = await request.json();
    return {
      orderTrackingId: body.OrderTrackingId || body.orderTrackingId || null,
      orderMerchantReference: body.OrderMerchantReference || body.orderMerchantReference || null,
      orderNotificationType: body.OrderNotificationType || body.orderNotificationType || 'IPNCHANGE',
    };
  } catch {
    return {
      orderTrackingId: null,
      orderMerchantReference: null,
      orderNotificationType: null,
    };
  }
}

/**
 * Map PesaPal status code to our Payment status
 */
function mapPesaPalStatusToPaymentStatus(statusCode: string): 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED' {
  if (statusCode === '1') {
    return 'COMPLETED';
  } else if (statusCode === '2') {
    return 'PENDING';
  } else if (statusCode === '3' || statusCode === '4') {
    return 'FAILED';
  } else if (statusCode === '5') {
    return 'REFUNDED';
  }
  return 'FAILED'; // Default to FAILED for unknown status codes
}

/**
 * Update Booking status based on Payment status
 */
async function updateBookingStatus(
  bookingId: string,
  paymentStatus: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED'
): Promise<void> {
  if (paymentStatus === 'COMPLETED') {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'confirmed',
        paymentStatus: 'paid',
      },
    });
  } else if (paymentStatus === 'FAILED') {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'cancelled',
        paymentStatus: 'failed',
      },
    });
  } else if (paymentStatus === 'REFUNDED') {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'cancelled',
        paymentStatus: 'refunded',
      },
    });
  }
  // PENDING: No change to Booking status
}

/**
 * POST /api/payments/ipn/pesapal
 * PesaPal Instant Payment Notification (IPN) Endpoint
 * 
 * Receives payment status updates from PesaPal when payment status changes.
 * Verifies status with PesaPal API and updates database records.
 */
export async function POST(request: Request) {
  let orderTrackingId: string | null = null;
  let orderMerchantReference: string | null = null;
  let orderNotificationType: string = 'IPNCHANGE';

  try {
    // Step 1: Extract parameters from request (supports both GET and POST)
    const params = await extractIPNParams(request);
    orderTrackingId = params.orderTrackingId;
    orderMerchantReference = params.orderMerchantReference;
    orderNotificationType = params.orderNotificationType || 'IPNCHANGE';

    // Validate required fields
    if (!orderTrackingId && !orderMerchantReference) {
      console.error('PesaPal IPN: Missing OrderTrackingId and OrderMerchantReference');
      return NextResponse.json(
        {
          orderNotificationType,
          orderTrackingId: orderTrackingId || '',
          orderMerchantReference: orderMerchantReference || '',
          status: 200,
        },
        { status: 200 }
      );
    }

    // Step 2: Find Payment record
    // Priority: trackingId first, then fallback to merchantReference with PENDING status
    let paymentRecord = null;

    if (orderTrackingId) {
      paymentRecord = await prisma.payment.findUnique({
        where: { trackingId: orderTrackingId },
        include: { booking: true },
      });
    }

    if (!paymentRecord && orderMerchantReference) {
      paymentRecord = await prisma.payment.findFirst({
        where: {
          merchantReference: orderMerchantReference,
          status: 'PENDING',
        },
        include: { booking: true },
      });
    }

    if (!paymentRecord) {
      console.error('PesaPal IPN: Payment record not found', {
        orderTrackingId,
        orderMerchantReference,
      });
      // Return 200 to stop PesaPal from retrying (permanent error)
      return NextResponse.json(
        {
          orderNotificationType,
          orderTrackingId: orderTrackingId || '',
          orderMerchantReference: orderMerchantReference || '',
          status: 200,
        },
        { status: 200 }
      );
    }

    // Step 3: Verify status by calling PesaPal API (do not trust the request)
    const pesapalProvider = new PesaPalProvider();
    const trackingIdToVerify = orderTrackingId || paymentRecord.trackingId;

    if (!trackingIdToVerify) {
      console.error('PesaPal IPN: No trackingId available for verification');
      return NextResponse.json(
        {
          orderNotificationType,
          orderTrackingId: orderTrackingId || '',
          orderMerchantReference: orderMerchantReference || '',
          status: 200,
        },
        { status: 200 }
      );
    }

    // Call PesaPal API to get authoritative status
    const transactionStatus: IPesaPalTransactionStatusResponse = await pesapalProvider.getTransactionStatus(
      trackingIdToVerify
    );

    // Step 4: Map PesaPal status to our database status
    const paymentStatus = mapPesaPalStatusToPaymentStatus(transactionStatus.status_code);

    // Step 5: Update Payment record
    const updateData: {
      status: string;
      paymentMethod?: string;
      paymentAccount?: string;
    } = {
      status: paymentStatus,
    };

    // Always update payment method and account if provided (vital audit data)
    if (transactionStatus.payment_method_description) {
      updateData.paymentMethod = transactionStatus.payment_method_description;
    }
    if (transactionStatus.payment_account) {
      updateData.paymentAccount = transactionStatus.payment_account;
    }

    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: updateData,
    });

    // Step 6: Update Booking status based on Payment status
    await updateBookingStatus(paymentRecord.bookingId, paymentStatus);

    // Step 6.5: Send booking receipt email if payment is COMPLETED
    if (paymentStatus === 'COMPLETED') {
      try {
        await sendBookingReceipt(paymentRecord.bookingId);
        // Log successful email send using booking relation already included
        const guestDetails = paymentRecord.booking.guestDetails as { email?: string };
        console.log(`Receipt sent to ${guestDetails.email}`);
      } catch (emailError) {
        console.error('Failed to send receipt:', emailError);
        // Do NOT throw. We still want to return 200 to PesaPal.
        // Email failure should not break the IPN flow.
      }
    }

    console.log('PesaPal IPN: Successfully processed', {
      orderTrackingId: trackingIdToVerify,
      paymentStatus,
      bookingId: paymentRecord.bookingId,
    });

    // Step 7: Return PesaPal-required response format
    return NextResponse.json(
      {
        orderNotificationType,
        orderTrackingId: trackingIdToVerify,
        orderMerchantReference: paymentRecord.merchantReference,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PesaPal IPN Error:', error);

    // Scenario A: Network/API failure - return 500 so PesaPal retries
    if (error instanceof Error && (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('timeout') ||
      error.message.includes('PesaPal')
    )) {
      console.error('PesaPal IPN: Transient error (network/API), returning 500 for retry');
      return NextResponse.json(
        {
          orderNotificationType,
          orderTrackingId: orderTrackingId || '',
          orderMerchantReference: orderMerchantReference || '',
          status: 500,
        },
        { status: 500 }
      );
    }

    // Scenario B: Logic/data error - return 200 to stop retries
    return NextResponse.json(
      {
        orderNotificationType,
        orderTrackingId: orderTrackingId || '',
        orderMerchantReference: orderMerchantReference || '',
        status: 200,
      },
      { status: 200 }
    );
  }
}

/**
 * GET /api/payments/ipn/pesapal
 * PesaPal IPN Endpoint (GET support)
 * 
 * PesaPal V3 may send GET requests with query parameters
 */
export async function GET(request: Request) {
  // Reuse the POST handler logic
  return POST(request);
}

