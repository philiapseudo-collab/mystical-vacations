import { NextResponse } from 'next/server';
import type { IAPIResponse } from '@/types';
import { getPaymentProvider } from '@/lib/payments';
import type { IPaymentVerifyRequest, IPaymentVerifyResponse } from '@/lib/payments';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/payment/verify
 * Verify payment status using PesaPal
 * 
 * Request body:
 * {
 *   transactionId: string;
 * }
 */
export async function POST(request: Request) {
  try {
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

    // Hybrid Approach: Check database first, then API if needed
    // Step 1: Query database first (fast path)
    const dbOrder = await prisma.order.findUnique({
      where: { pesapalOrderTrackingId: transactionId },
    });

    // Step 2: If DB says COMPLETED or FAILED, return immediately (fast)
    if (dbOrder && (dbOrder.status === 'COMPLETED' || dbOrder.status === 'FAILED')) {
      const paymentResponse = {
        success: dbOrder.status === 'COMPLETED',
        transactionId: dbOrder.pesapalOrderTrackingId,
        paymentStatus: dbOrder.status.toLowerCase() as 'completed' | 'failed',
        amount: dbOrder.amount,
        currency: dbOrder.currency,
        message: `Payment status: ${dbOrder.status}`,
      };

      const response: IAPIResponse<typeof paymentResponse> = {
        success: true,
        data: paymentResponse,
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(response);
    }

    // Step 3: If DB says PENDING (or not found), call PesaPal API (fallback)
    // This handles cases where webhook failed or payment status changed
    const paymentProvider = getPaymentProvider();

    const verifyRequest: IPaymentVerifyRequest = {
      transactionId,
      provider: 'pesapal',
    };

    // Verify payment with the selected provider
    const verifyResult: IPaymentVerifyResponse = await paymentProvider.verifyPayment(verifyRequest);

    // Step 4: Update database with the latest status from API
    if (dbOrder) {
      try {
        await prisma.order.update({
          where: { pesapalOrderTrackingId: transactionId },
          data: {
            status: verifyResult.paymentStatus.toUpperCase(),
            updatedAt: new Date(),
          },
        });
      } catch (dbError) {
        console.error('❌ Database update failed during verification:', dbError);
        // Continue - don't fail the verification if DB update fails
      }
    }

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

