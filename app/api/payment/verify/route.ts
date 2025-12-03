import { NextResponse } from 'next/server';
import type { IAPIResponse } from '@/types';
import { getPaymentProvider, isValidPaymentProvider } from '@/lib/payments';
import type { IPaymentVerifyRequest, IPaymentVerifyResponse } from '@/lib/payments';

/**
 * POST /api/payment/verify
 * Verify payment status using the appropriate payment provider
 * 
 * Request body:
 * {
 *   transactionId: string;
 *   provider: 'pesapal' | 'flutterwave';
 * }
 */
export async function POST(request: Request) {
  try {
    const { transactionId, provider } = await request.json();

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

    if (!provider || !isValidPaymentProvider(provider)) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'INVALID_PROVIDER',
          message: 'Invalid payment provider. Must be "pesapal" or "flutterwave"',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Get the payment provider instance
    const paymentProvider = getPaymentProvider(provider);

    // Prepare verification request
    const verifyRequest: IPaymentVerifyRequest = {
      transactionId,
      provider,
    };

    // Verify payment with the selected provider
    const verifyResult: IPaymentVerifyResponse = await paymentProvider.verifyPayment(verifyRequest);

    // Map to the expected response format
    const paymentResponse = {
      success: verifyResult.success,
      transactionId: verifyResult.transactionId,
      paymentStatus: verifyResult.paymentStatus,
      amount: verifyResult.amount,
      currency: verifyResult.currency,
      message: verifyResult.message,
    };

    const response: IAPIResponse<typeof paymentResponse> = {
      success: true,
      data: paymentResponse,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Payment verification error:', error);
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

