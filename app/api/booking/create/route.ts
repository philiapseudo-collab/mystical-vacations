import { NextResponse } from 'next/server';
import type { IAPIResponse, IBooking } from '@/types';

// In-memory store for demo (would be database in production)
const bookings: IBooking[] = [];

/**
 * POST /api/booking/create
 * Create a new booking
 */
export async function POST(request: Request) {
  const bookingData = await request.json();

  const booking: IBooking = {
    id: `booking-${Date.now()}`,
    bookingReference: bookingData.bookingReference,
    items: bookingData.items,
    guestDetails: bookingData.guestDetails,
    priceBreakdown: bookingData.priceBreakdown,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentStatus: 'pending',
  };

  bookings.push(booking);

  const response: IAPIResponse<IBooking> = {
    success: true,
    data: booking,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 201 });
}

