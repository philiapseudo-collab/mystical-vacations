import { NextResponse } from 'next/server';
import type { IAPIResponse, ISGRTicket } from '@/types';

// Mock ticket store (would be database in production)
// Note: This is shared with the booking route in-memory
const sgrTickets: ISGRTicket[] = [];

/**
 * GET /api/sgr/ticket/:ticketNumber
 * Retrieve ticket by ticket number
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketNumber: string }> }
) {
  const { ticketNumber } = await params;
  const ticket = sgrTickets.find((t) => t.ticketNumber === ticketNumber);

  if (!ticket) {
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

  const response: IAPIResponse<ISGRTicket> = {
    success: true,
    data: ticket,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}

