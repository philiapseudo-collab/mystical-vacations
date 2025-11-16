import { NextResponse } from 'next/server';
import type { IAPIResponse, IPaymentResponse } from '@/types';

/**
 * POST /api/payment/verify
 * Verify payment status
 */
export async function POST(request: Request) {
  const { transactionId } = await request.json();

  if (!transactionId) {
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'MISSING_TRANSACTION_ID',
        message: 'Transaction ID is required',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 400 });
  }

  // Mock verification
  const paymentResponse: IPaymentResponse = {
    success: true,
    transactionId,
    paymentStatus: 'completed',
  };

  const response: IAPIResponse<IPaymentResponse> = {
    success: true,
    data: paymentResponse,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}

