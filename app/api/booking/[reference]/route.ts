import { NextResponse } from 'next/server';
import type { IAPIResponse, IBooking } from '@/types';

// In-memory store for demo (would be database in production)
// Note: This is a simplified implementation. In a real app, you'd use a database.
const bookings: IBooking[] = [];

/**
 * GET /api/booking/:reference
 * Get booking by reference
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference } = await params;
  const booking = bookings.find((b) => b.bookingReference === reference);

  if (!booking) {
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

  const response: IAPIResponse<IBooking> = {
    success: true,
    data: booking,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}

