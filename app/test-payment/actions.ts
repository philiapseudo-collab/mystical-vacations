'use server';

import { redirect } from 'next/navigation';
import { PesaPalProvider } from '@/lib/payments/pesapal';
import { prisma } from '@/lib/prisma';

/**
 * Server Action: Initiate Test Payment
 * 
 * Creates a test payment of 10 KES using PesaPal
 * Redirects to PesaPal checkout page on success
 */
export async function initiateTestPayment(): Promise<
  | { success: false; error: string }
  | never // Never returns on success - redirects instead
> {
  let redirectUrl: string;
  let orderTrackingId: string;

  try {
    // Check if PesaPal credentials are configured
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    
    if (!consumerKey || !consumerSecret) {
      const errorMsg = 'PesaPal credentials are not configured. Please set PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET environment variables in your Vercel project settings.';
      console.error('❌ Test Payment Error:', errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }

    // Create PesaPal provider instance
    const pesapal = new PesaPalProvider();

    // Generate test reference
    const testReference = `TEST-${Date.now()}`;

    // Prepare test order
    const testOrder = {
      amount: 10,
      currency: 'KES',
      email: 'test@mysticalvacationsea.com',
      phone: '0700000000',
      description: 'System Test - 10 Bob',
      reference: testReference,
    };

    // Initiate payment
    const result = await pesapal.initiatePaymentSimple(testOrder);

    // Store values for logging before redirect
    redirectUrl = result.redirectUrl;
    orderTrackingId = result.orderTrackingId;

    // Create Order record in database with PENDING status
    // This allows us to track abandoned checkouts
    // Wrap in try-catch so payment can still proceed if DB fails
    try {
      await prisma.order.create({
        data: {
          id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          amount: testOrder.amount,
          currency: testOrder.currency,
          status: 'PENDING',
          pesapalOrderTrackingId: orderTrackingId,
          customerEmail: testOrder.email,
          customerPhone: testOrder.phone,
          description: testOrder.description,
          reference: testReference,
        },
      });
    } catch (dbError) {
      // Log DB error but don't fail payment initiation
      console.warn('⚠️ Could not save order to database (payment will still proceed):', dbError);
    }

    // Log the order tracking ID for debugging
    console.log('✅ Test Payment Initiated:', {
      orderTrackingId: result.orderTrackingId,
      redirectUrl: result.redirectUrl,
      reference: testReference,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to initiate test payment: Unknown error occurred';

    console.error('❌ Test Payment Error:', errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }

  // Call redirect() AFTER the try/catch block
  // This prevents Next.js from treating the redirect as an error
  redirect(redirectUrl);
}

