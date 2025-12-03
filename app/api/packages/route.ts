import { NextResponse } from 'next/server';
import { packages } from '@/data/packages';
import type { IAPIResponse, IPackage } from '@/types';

/**
 * GET /api/packages
 * Get all packages with optional filters
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const country = searchParams.get('country');
    const minDuration = searchParams.get('minDuration');
    const maxDuration = searchParams.get('maxDuration');

    let filtered = [...packages];

    if (featured === 'true') {
      filtered = filtered.filter((pkg) => pkg.featured);
    }

    if (country) {
      filtered = filtered.filter((pkg) =>
        pkg.locations.some((loc) => loc.country === country)
      );
    }

    if (minDuration) {
      filtered = filtered.filter((pkg) => pkg.duration >= parseInt(minDuration));
    }

    if (maxDuration) {
      filtered = filtered.filter((pkg) => pkg.duration <= parseInt(maxDuration));
    }

    const response: IAPIResponse<IPackage[]> = {
      success: true,
      data: filtered,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/packages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch packages',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

