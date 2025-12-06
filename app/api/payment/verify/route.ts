import { NextResponse } from 'next/server';
import type { IAPIResponse } from '@/types';
import { getPaymentProvider } from '@/lib/payments';
import type { IPaymentVerifyRequest, IPaymentVerifyResponse } from '@/lib/payments';
import { getPrismaClient } from '@/lib/prisma-safe';

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
    // Step 1: Query database first (fast path) - gracefully handle DB errors
    const prisma = getPrismaClient();
    let dbOrder = null;
    if (prisma) {
      try {
        dbOrder = await prisma.order.findUnique({
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
      } catch (dbError) {
        // Database unavailable or query failed - log and continue with PesaPal API verification
        console.warn('⚠️ Database query failed, proceeding with PesaPal API verification:', dbError instanceof Error ? dbError.message : 'Unknown error');
        // Continue to verify with PesaPal API below
      }
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

    // Step 4: Create or update database with the latest status from API
    if (prisma) {
      try {
        if (dbOrder) {
          // Update existing order
          await prisma.order.update({
            where: { pesapalOrderTrackingId: transactionId },
            data: {
              status: verifyResult.paymentStatus.toUpperCase(),
            },
          });
        } else {
          // Create new order if it doesn't exist (e.g., if DB was unavailable during payment initiation)
          await prisma.order.create({
            data: {
              id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
              amount: verifyResult.amount ?? 0,
              currency: verifyResult.currency || 'KES',
              status: verifyResult.paymentStatus.toUpperCase(),
              pesapalOrderTrackingId: transactionId,
              customerEmail: '', // Not available from verify endpoint
              customerPhone: '', // Not available from verify endpoint
              description: verifyResult.message || 'Payment verified',
              reference: transactionId,
            },
          });
        }
        console.log('✅ Database updated with payment status:', verifyResult.paymentStatus);
      } catch (dbError) {
        console.error('❌ Database update failed during verification:', dbError);
        // Continue - don't fail the verification if DB update fails
        // Payment verification from PesaPal API is still valid
      }
    } else {
      console.warn('⚠️ Prisma not available - skipping database update');
    }

    // Map to the expected response format
    const paymentResponse = {
      success: verifyResult.success,
      transactionId: verifyResult.transactionId,
      paymentStatus: verifyResult.paymentStatus,
      amount: verifyResult.amount ?? 0,
      currency: verifyResult.currency || 'KES',
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

