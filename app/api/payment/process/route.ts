import { NextResponse } from 'next/server';
import type { IAPIResponse } from '@/types';
import { getPaymentProvider, isValidPaymentProvider } from '@/lib/payments';
import type { IPaymentInitiateRequest, IPaymentInitiateResponse } from '@/lib/payments';

/**
 * POST /api/payment/process
 * Process payment using selected payment provider (PesaPal or Flutterwave)
 * 
 * Request body:
 * {
 *   amount: number;
 *   currency: string;
 *   customerEmail: string;
 *   customerPhone: string;
 *   customerName: string;
 *   bookingReference: string;
 *   provider: 'pesapal' | 'flutterwave';
 *   metadata?: Record<string, any>;
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      currency,
      customerEmail,
      customerPhone,
      customerName,
      bookingReference,
      provider,
      metadata,
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'INVALID_AMOUNT',
          message: 'Invalid payment amount',
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

    if (!customerEmail || !customerPhone || !customerName || !bookingReference) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Missing required fields: customerEmail, customerPhone, customerName, bookingReference',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Get the payment provider instance
    const paymentProvider = getPaymentProvider(provider);

    // Prepare payment initiation request
    const paymentRequest: IPaymentInitiateRequest = {
      amount,
      currency: currency || 'USD',
      customerEmail,
      customerPhone,
      customerName,
      bookingReference,
      metadata,
    };

    // Initiate payment with the selected provider
    const paymentResult: IPaymentInitiateResponse = await paymentProvider.initiatePayment(paymentRequest);

    if (!paymentResult.success) {
      const response: IAPIResponse<never> = {
        success: false,
        error: {
          code: 'PAYMENT_INITIATION_FAILED',
          message: paymentResult.message || 'Failed to initiate payment',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 500 });
    }

    // Return successful response
    const response: IAPIResponse<IPaymentInitiateResponse> = {
      success: true,
      data: paymentResult,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Payment processing error:', error);
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

