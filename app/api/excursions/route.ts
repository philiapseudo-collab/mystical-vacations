import { NextResponse } from 'next/server';
import { excursions } from '@/data/excursions';
import type { IAPIResponse, IExcursion } from '@/types';

/**
 * GET /api/excursions
 * Get all excursions with optional filters
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const location = searchParams.get('location');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  let filtered = [...excursions];

  if (category && category !== 'all') {
    filtered = filtered.filter((exc) => exc.category === category);
  }

  if (location) {
    filtered = filtered.filter((exc) =>
      exc.location.city.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (minPrice) {
    filtered = filtered.filter((exc) => exc.price >= parseInt(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((exc) => exc.price <= parseInt(maxPrice));
  }

  const response: IAPIResponse<IExcursion[]> = {
    success: true,
    data: filtered,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}

