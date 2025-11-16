import { NextResponse } from 'next/server';
import { transportRoutes } from '@/data/transport';
import type { IAPIResponse, ITransportSearchResponse } from '@/types';

/**
 * GET /api/transport/search
 * Search for transport routes
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const mode = searchParams.get('mode');

  let filtered = [...transportRoutes];

  if (origin && destination) {
    filtered = filtered.filter((route) => {
      const firstSeg = route.segments[0];
      const lastSeg = route.segments[route.segments.length - 1];
      return (
        firstSeg.departureLocation.city.toLowerCase().includes(origin.toLowerCase()) &&
        lastSeg.arrivalLocation.city.toLowerCase().includes(destination.toLowerCase())
      );
    });
  }

  if (mode) {
    filtered = filtered.filter((route) =>
      route.segments.some((seg) => seg.mode === mode)
    );
  }

  const searchResponse: ITransportSearchResponse = {
    routes: filtered,
    searchId: `search-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  const response: IAPIResponse<ITransportSearchResponse> = {
    success: true,
    data: searchResponse,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}

