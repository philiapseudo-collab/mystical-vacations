import { Resend } from 'resend';
import React from 'react';
import BookingReceipt from '@/components/email/BookingReceipt';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/utils/formatters';
import type { IBookingItem } from '@/types';

// Lazy initialization of Resend SDK to avoid build-time errors
// Only initialize when actually needed (at runtime)
let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

/**
 * Extract travel date from booking items
 * Uses the earliest dateFrom, checkIn, or date from all items
 */
function extractTravelDate(items: IBookingItem[]): string {
  const dates: string[] = [];

  items.forEach((item) => {
    if (item.dateFrom) {
      dates.push(item.dateFrom);
    }
    // For accommodation, dateFrom might be checkIn
    // For excursion/transport, we'd need to check the details, but dateFrom should cover it
  });

  if (dates.length === 0) {
    return 'TBD'; // To Be Determined
  }

  // Sort dates and return the earliest
  dates.sort();
  return formatDate(dates[0], 'long');
}

/**
 * Send booking receipt email to customer
 * @param bookingId - The booking ID (UUID) from the database
 */
export async function sendBookingReceipt(bookingId: string): Promise<void> {
  try {
    // Step 1: Fetch the Booking from Prisma
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error(`Booking not found: ${bookingId}`);
    }

    // Step 2: Parse guestDetails to get email and name
    const guestDetails = booking.guestDetails as {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      nationality?: string;
    };

    if (!guestDetails.email) {
      throw new Error(`No email found for booking: ${bookingId}`);
    }

    const customerName = `${guestDetails.firstName} ${guestDetails.lastName}`;

    // Step 3: Extract item names from booking.items
    // Cast through unknown first since Prisma JSON fields are JsonValue
    const items = booking.items as unknown as IBookingItem[];
    const itemNames = items.map((item) => item.itemName);

    // Step 4: Determine travel date (earliest dateFrom)
    const travelDate = extractTravelDate(items);

    // Step 5: Get amount and currency from priceBreakdown
    const priceBreakdown = booking.priceBreakdown as {
      total: number;
      currency: 'USD' | 'KES' | 'TZS';
    };

    // Step 6: Build the confirmation link
    const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL}/book/confirm?ref=${encodeURIComponent(booking.bookingReference)}`;

    // Step 7: Prepare email props
    const emailProps = {
      reference: booking.bookingReference,
      customerName,
      amount: priceBreakdown.total,
      currency: priceBreakdown.currency || 'KES',
      tripDate: travelDate,
      items: itemNames,
      link: confirmationLink,
    };

    // Step 8: Send email via Resend
    // Resend accepts React components directly - pass JSX with props
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: 'reservations@mysticalvacationsea.com',
      to: [guestDetails.email],
      subject: `Booking Confirmed: ${booking.bookingReference}`,
      react: React.createElement(BookingReceipt, emailProps),
    });

    if (error) {
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log('Booking receipt email sent successfully', {
      bookingId,
      email: guestDetails.email,
      resendId: data?.id,
    });
  } catch (error) {
    console.error('Failed to send booking receipt email:', error);
    throw error; // Re-throw to allow caller to handle
  }
}

