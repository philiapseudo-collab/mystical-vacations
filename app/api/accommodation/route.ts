import { NextResponse } from 'next/server';
import { accommodations } from '@/data/accommodation';
import type { IAPIResponse, IAccommodation } from '@/types';

/**
 * GET /api/accommodation
 * Get all accommodations with optional filters
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const type = searchParams.get('type');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  let filtered = [...accommodations];

  if (country) {
    filtered = filtered.filter((acc) => acc.location.country === country);
  }

  if (type) {
    filtered = filtered.filter((acc) => acc.type === type);
  }

  if (minPrice) {
    filtered = filtered.filter((acc) => acc.pricePerNight >= parseInt(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((acc) => acc.pricePerNight <= parseInt(maxPrice));
  }

  const response: IAPIResponse<IAccommodation[]> = {
    success: true,
    data: filtered,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}

