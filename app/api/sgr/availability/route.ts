import { NextResponse } from 'next/server';
import type { IAPIResponse } from '@/types';

/**
 * GET /api/sgr/availability
 * Check seat availability (mock)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const routeId = searchParams.get('routeId');
  const date = searchParams.get('date');
  const classType = searchParams.get('class');

  // Mock availability
  const availableSeats = Math.floor(Math.random() * 50) + 10;

  const response: IAPIResponse<{ availableSeats: number; route: string; date: string }> = {
    success: true,
    data: {
      availableSeats,
      route: routeId || 'Unknown',
      date: date || new Date().toISOString().split('T')[0],
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}

