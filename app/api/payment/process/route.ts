import { NextResponse } from 'next/server';
import type { IAPIResponse, IBooking } from '@/types';
import { PesaPalProvider } from '@/lib/payments/pesapal';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/payment/process
 * Process payment using PesaPal V3 Integration
 * 
 * Request body:
 * {
 *   bookingReference: string;
 *   paymentMethod: string; // e.g., "MPESA", "CARD", "VISA"
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      bookingReference,
      paymentMethod,
    } = body;

    // Validate required fields
    if (!bookingReference) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'MISSING_BOOKING_REFERENCE',
          message: 'Booking reference is required',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Step 1: Fetch the Booking from the Database to get the real amount and user details
    // Do not trust the amount sent from the frontend
    const bookingRecord = await prisma.booking.findUnique({
      where: { bookingReference },
    });

    if (!bookingRecord) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'BOOKING_NOT_FOUND',
          message: `Booking with reference ${bookingReference} not found`,
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Convert Prisma record to IBooking format
    const booking: IBooking = {
      id: bookingRecord.id,
      bookingReference: bookingRecord.bookingReference,
      items: bookingRecord.items as unknown as IBooking['items'],
      guestDetails: bookingRecord.guestDetails as unknown as IBooking['guestDetails'],
      priceBreakdown: bookingRecord.priceBreakdown as unknown as IBooking['priceBreakdown'],
      status: bookingRecord.status as IBooking['status'],
      createdAt: bookingRecord.createdAt.toISOString(),
      updatedAt: bookingRecord.updatedAt.toISOString(),
      paymentStatus: bookingRecord.paymentStatus as IBooking['paymentStatus'],
    };

    // Extract user details from booking.guestDetails (trust the database, not the client)
    const { firstName, lastName, email, phone } = booking.guestDetails;

    // Validate that required guest details exist
    if (!firstName || !lastName || !email || !phone) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'MISSING_GUEST_DETAILS',
          message: 'Booking is missing required guest details (firstName, lastName, email, or phone). Please update the booking first.',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Step 2: Create a Payment record in the DB with status PENDING
    // Get the real amount from the booking (do not trust frontend)
    const paymentAmount = booking.priceBreakdown.total;
    const paymentCurrency = booking.priceBreakdown.currency || 'KES';

    const paymentRecord = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: paymentAmount,
        currency: paymentCurrency,
        status: 'PENDING',
        provider: 'PESAPAL',
        merchantReference: bookingReference,
        paymentMethod: paymentMethod || null, // Store payment method for analytics
      },
    });

    // Step 3: Call PesaPalProvider.initiatePayment (which internally calls submitOrder to PesaPal)
    const pesapalProvider = new PesaPalProvider();
    
    const { redirectUrl, trackingId } = await pesapalProvider.initiatePayment(
      booking,
      {
        email,
        phone,
        firstName,
        lastName,
      }
    );

    // Step 4: Update the Payment record with the returned trackingId
    // Critical: This links our internal Payment record to PesaPal's orderTrackingId
    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: {
        trackingId,
      },
    });

    // Step 5: Return redirectUrl and trackingId to the frontend
    const response: IAPIResponse<{ redirectUrl: string; trackingId: string }> = {
      success: true,
      data: {
        redirectUrl,
        trackingId,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Payment processing error:', error);
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

