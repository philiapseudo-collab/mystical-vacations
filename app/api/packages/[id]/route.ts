import { NextResponse } from 'next/server';
import { packages } from '@/data/packages';
import type { IAPIResponse, IPackage } from '@/types';

/**
 * GET /api/packages/:id
 * Get a specific package by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pkg = packages.find((p) => p.id === id);

  if (!pkg) {
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Package not found',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 404 });
  }

  const response: IAPIResponse<IPackage> = {
    success: true,
    data: pkg,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}

