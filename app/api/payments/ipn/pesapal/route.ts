import { NextResponse } from 'next/server';

/**
 * POST /api/payments/ipn/pesapal
 * PesaPal Instant Payment Notification (IPN) Endpoint
 * 
 * This endpoint receives payment notifications from PesaPal
 * when a payment status changes (completed, failed, etc.)
 * 
 * PesaPal will POST to this URL with the following structure:
 * {
 *   "OrderNotificationType": "IPN",
 *   "OrderTrackingId": "abc123...",
 *   "OrderMerchantReference": "ORDER-123",
 *   "OrderStatus": "COMPLETED" | "FAILED" | "INVALID",
 *   ...other fields
 * }
 * 
 * For now, we just log the incoming data and return 200 OK
 * to satisfy PesaPal's handshake requirement.
 * 
 * TODO: Add database update logic to update booking payment status
 */
export async function POST(request: Request) {
  try {
    // Get the raw body for logging
    const body = await request.json();
    
    // Log the IPN data for debugging
    console.log('PesaPal IPN Received:', {
      timestamp: new Date().toISOString(),
      orderTrackingId: body.OrderTrackingId,
      orderMerchantReference: body.OrderMerchantReference,
      orderStatus: body.OrderStatus,
      orderNotificationType: body.OrderNotificationType,
      fullBody: body,
    });

    // Validate required fields
    if (!body.OrderTrackingId) {
      console.error('PesaPal IPN: Missing OrderTrackingId');
      return NextResponse.json(
        { message: 'Missing OrderTrackingId' },
        { status: 400 }
      );
    }

    // TODO: Verify IPN authenticity using PesaPal's IPN verification endpoint
    // POST to: https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus
    // with the OrderTrackingId to verify the status matches

    // TODO: Update database with payment status
    // Example:
    // await updateBookingPaymentStatus({
    //   transactionId: body.OrderTrackingId,
    //   status: body.OrderStatus,
    //   merchantReference: body.OrderMerchantReference,
    // });

    // Return 200 OK to acknowledge receipt
    // PesaPal requires this to stop retrying
    return NextResponse.json(
      { 
        message: 'IPN received successfully',
        orderTrackingId: body.OrderTrackingId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PesaPal IPN Error:', error);
    
    // Still return 200 to prevent PesaPal from retrying
    // Log the error for investigation
    return NextResponse.json(
      { 
        message: 'IPN received but processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    );
  }
}

/**
 * GET /api/payments/ipn/pesapal
 * Health check endpoint for IPN URL
 */
export async function GET() {
  return NextResponse.json(
    { 
      message: 'PesaPal IPN endpoint is active',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

