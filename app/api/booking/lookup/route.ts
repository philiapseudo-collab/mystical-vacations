import { NextResponse } from 'next/server';
import type { IAPIResponse } from '@/types';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/booking/lookup
 * Secure lookup endpoint that verifies email before returning booking access
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, email } = body;

    // Validate input
    if (!reference || !email) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Booking reference and email are required',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Find booking by reference (case-insensitive)
    // Try exact match first (most common case)
    let booking = await prisma.booking.findUnique({
      where: { bookingReference: reference },
    });

    // If not found, try case-insensitive search
    if (!booking) {
      // Fetch all bookings and filter case-insensitively
      // Note: This is not ideal for large datasets, but booking references are unique
      // and the dataset should be manageable. For production, consider adding a
      // case-insensitive index or using raw SQL.
      const allBookings = await prisma.booking.findMany({
        take: 1000, // Reasonable limit for lookup
      });
      booking = allBookings.find(
        (b) => b.bookingReference.toLowerCase() === reference.toLowerCase()
      ) || null;
    }

    if (!booking) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Booking not found or email does not match.',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Security check: Verify email matches (case-insensitive)
    const guestDetails = booking.guestDetails as any;
    const storedEmail = guestDetails?.email;

    if (!storedEmail || storedEmail.toLowerCase() !== email.toLowerCase()) {
      // Return generic error to prevent email enumeration
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Booking not found or email does not match.',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Success: Return redirect URL
    const response: IAPIResponse<{ redirectUrl: string }> = {
      success: true,
      data: {
        redirectUrl: `/book/confirm?ref=${encodeURIComponent(booking.bookingReference)}`,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Booking lookup error:', error);
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'LOOKUP_ERROR',
        message: error instanceof Error ? error.message : 'Failed to lookup booking',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

