import { NextResponse } from 'next/server';
import type { IAPIResponse, ISGRTicket } from '@/types';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/sgr/ticket/:ticketNumber
 * Retrieve ticket by ticket number
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketNumber: string }> }
) {
  try {
    const { ticketNumber } = await params;
    const ticketRecord = await prisma.sGRTicket.findUnique({
      where: { ticketNumber },
    });

    if (!ticketRecord) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Ticket not found',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Convert Prisma record to ISGRTicket format
    const ticket: ISGRTicket = {
      ticketNumber: ticketRecord.ticketNumber,
      route: ticketRecord.route,
      trainNumber: ticketRecord.trainNumber,
      class: ticketRecord.class as ISGRTicket['class'],
      seatNumber: ticketRecord.seatNumber,
      departureTime: ticketRecord.departureTime,
      arrivalTime: ticketRecord.arrivalTime,
      passengerName: ticketRecord.passengerName,
      qrCode: ticketRecord.qrCode,
      bookingReference: ticketRecord.bookingReference,
    };

    const response: IAPIResponse<ISGRTicket> = {
      success: true,
      data: ticket,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Ticket retrieval error:', error);
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'TICKET_ERROR',
        message: error instanceof Error ? error.message : 'Failed to retrieve ticket',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

