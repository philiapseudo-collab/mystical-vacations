import { NextResponse } from 'next/server';
import type { IAPIResponse, IBooking, IBookingItem, IPriceBreakdown } from '@/types';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/booking/create
 * Create a new booking
 */
export async function POST(request: Request) {
  try {
    const bookingData = await request.json();

    // Create booking in database
    const bookingRecord = await prisma.booking.create({
      data: {
        bookingReference: bookingData.bookingReference,
        items: bookingData.items as unknown as any,
        guestDetails: bookingData.guestDetails as unknown as any,
        priceBreakdown: bookingData.priceBreakdown as unknown as any,
        status: 'pending',
        paymentStatus: 'pending',
      },
    });

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

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Booking creation error:', error);
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'BOOKING_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create booking',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

