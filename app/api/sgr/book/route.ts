/**
 * SGR (Standard Gauge Railway) Mock Implementation with M-Pesa Abstraction
 * 
 * This module simulates the complex integration between:
 * 1. User payment via standard gateway (card/international)
 * 2. Backend conversion and payment to SGR via M-Pesa
 * 3. SGR ticket generation and confirmation
 * 
 * In production, this would integrate with:
 * - Kenya Railways SGR booking API
 * - M-Pesa Daraja API for B2B payments
 * - Ticket verification systems
 */

import { NextResponse } from 'next/server';
import type { IAPIResponse, ISGRBookingRequest, ISGRBookingResponse, ISGRTicket } from '@/types';

// Mock ticket store (would be database in production)
const sgrTickets: ISGRTicket[] = [];

/**
 * Generate mock QR code (base64 encoded placeholder)
 */
function generateMockQRCode(data: string): string {
  // In production, this would generate actual QR code
  return `data:image/svg+xml;base64,${Buffer.from(`QR-${data}`).toString('base64')}`;
}

/**
 * Simulate M-Pesa B2B payment to SGR operator
 * 
 * This abstracts the complexity of:
 * 1. Converting user payment token to M-Pesa payment
 * 2. Initiating B2B payment to Kenya Railways
 * 3. Handling M-Pesa callbacks and confirmations
 */
async function processMPesaPaymentToSGR(
  amount: number,
  paymentToken: string
): Promise<{ success: boolean; mpesaTransactionId?: string; error?: string }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock M-Pesa B2B payment
  const mpesaTransactionId = `MPESA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log(`[SGR-MPESA] Processing B2B payment: ${amount} KES`);
  console.log(`[SGR-MPESA] Payment token: ${paymentToken}`);
  console.log(`[SGR-MPESA] M-Pesa Transaction ID: ${mpesaTransactionId}`);

  // Simulate 95% success rate
  if (Math.random() > 0.05) {
    return {
      success: true,
      mpesaTransactionId,
    };
  } else {
    return {
      success: false,
      error: 'M-Pesa payment to SGR operator failed',
    };
  }
}

/**
 * Generate SGR ticket after successful payment
 */
function generateSGRTicket(
  routeId: string,
  passengerIndex: number,
  classType: 'Economy' | 'First Class',
  departureDate: string,
  passengerName: string,
  bookingReference: string
): ISGRTicket {
  const trainNumber = `SGR-${Math.floor(Math.random() * 900) + 100}`;
  const seatNumber = `${classType === 'First Class' ? 'F' : 'E'}${Math.floor(Math.random() * 100) + 1}`;

  // Mock departure/arrival times based on route
  const departure = new Date(departureDate);
  departure.setHours(8, 0, 0);
  const arrival = new Date(departure);
  arrival.setHours(13, 30, 0); // 5.5 hours later

  const ticket: ISGRTicket = {
    ticketNumber: `TICKET-${Date.now()}-${passengerIndex}`,
    route: routeId,
    trainNumber,
    class: classType,
    seatNumber,
    departureTime: departure.toISOString(),
    arrivalTime: arrival.toISOString(),
    passengerName,
    qrCode: generateMockQRCode(`${trainNumber}-${seatNumber}-${bookingReference}`),
    bookingReference,
  };

  return ticket;
}

/**
 * POST /api/sgr/book
 * Book SGR tickets with M-Pesa abstraction
 * 
 * Flow:
 * 1. Receive booking request with payment token (from user's card payment)
 * 2. Process M-Pesa B2B payment to SGR operator
 * 3. Generate SGR tickets upon successful payment
 * 4. Return tickets to user
 */
export async function POST(request: Request) {
  const bookingRequest: ISGRBookingRequest = await request.json();

  // Validate request
  if (!bookingRequest.routeId || !bookingRequest.passengers || !bookingRequest.paymentToken) {
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Missing required booking parameters',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 400 });
  }

  // Calculate total amount (mock pricing: Economy 3500 KES, First 10000 KES)
  const pricePerTicket = bookingRequest.class === 'First Class' ? 10000 : 3500;
  const totalAmount = pricePerTicket * bookingRequest.passengers;

  console.log(`[SGR] New booking request: ${bookingRequest.passengers} passengers, ${bookingRequest.class}`);
  console.log(`[SGR] Total amount: ${totalAmount} KES`);

  try {
    // Step 1: Process M-Pesa payment to SGR operator
    const mpesaResult = await processMPesaPaymentToSGR(totalAmount, bookingRequest.paymentToken);

    if (!mpesaResult.success) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'PAYMENT_FAILED',
          message: mpesaResult.error || 'Payment to SGR operator failed',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 402 });
    }

    // Step 2: Generate tickets
    const tickets: ISGRTicket[] = [];
    const bookingReference = `SGR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    for (let i = 0; i < bookingRequest.passengers; i++) {
      const ticket = generateSGRTicket(
        bookingRequest.routeId,
        i,
        bookingRequest.class,
        bookingRequest.departureDate,
        `Passenger ${i + 1}`, // In production, would use actual passenger names
        bookingReference
      );
      tickets.push(ticket);
      sgrTickets.push(ticket);
    }

    console.log(`[SGR] Successfully generated ${tickets.length} tickets`);
    console.log(`[SGR] Booking reference: ${bookingReference}`);

    // Step 3: Return success response
    const bookingResponse: ISGRBookingResponse = {
      success: true,
      tickets,
      mpesaTransactionId: mpesaResult.mpesaTransactionId,
      message: 'SGR tickets booked successfully',
    };

    const response: IAPIResponse<ISGRBookingResponse> = {
      success: true,
      data: bookingResponse,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('[SGR] Booking error:', error);
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'BOOKING_ERROR',
        message: 'An error occurred while booking SGR tickets',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

