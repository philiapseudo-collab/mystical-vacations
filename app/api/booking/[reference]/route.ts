import { NextResponse } from 'next/server';
import type { IAPIResponse, IBooking, IBookingItem, IPriceBreakdown } from '@/types';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/booking/:reference
 * Get booking by reference
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params;
    const bookingRecord = await prisma.booking.findUnique({
      where: { bookingReference: reference },
    });

    if (!bookingRecord) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Booking not found',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Convert Prisma record to IBooking format
    const booking: IBooking = {
      id: bookingRecord.id,
      bookingReference: bookingRecord.bookingReference,
      items: bookingRecord.items as unknown as IBookingItem[],
      guestDetails: bookingRecord.guestDetails as unknown as IBooking['guestDetails'],
      priceBreakdown: bookingRecord.priceBreakdown as unknown as IPriceBreakdown,
      status: bookingRecord.status as IBooking['status'],
      createdAt: bookingRecord.createdAt.toISOString(),
      updatedAt: bookingRecord.updatedAt.toISOString(),
      paymentStatus: bookingRecord.paymentStatus as IBooking['paymentStatus'],
    };

    const response: IAPIResponse<IBooking> = {
      success: true,
      data: booking,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Booking retrieval error:', error);
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'BOOKING_ERROR',
        message: error instanceof Error ? error.message : 'Failed to retrieve booking',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

