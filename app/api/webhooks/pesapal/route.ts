import { NextResponse } from 'next/server';
import { PesaPalProvider } from '@/lib/payments/pesapal';
import { getPrismaClient } from '@/lib/prisma-safe';

/**
 * PesaPal Webhook Handler (IPN Receiver)
 * 
 * POST /api/webhooks/pesapal
 * 
 * Receives Instant Payment Notifications (IPN) from PesaPal when payment status changes.
 * 
 * PesaPal v3 IPN Payload Structure:
 * {
 *   "OrderTrackingId": "abc123...",
 *   "OrderNotificationType": "IPNCHANGE",
 *   ...other fields
 * }
 * 
 * Security: We verify the payment status by calling PesaPal's API directly
 * instead of trusting the webhook payload blindly.
 */
export async function POST(request: Request) {
  let orderTrackingId: string | undefined;
  let orderNotificationType: string | undefined;

  try {
    // Extract payload
    const body = await request.json();
    orderTrackingId = body.OrderTrackingId;
    orderNotificationType = body.OrderNotificationType;

    // Log incoming webhook for debugging
    console.log('📥 PesaPal Webhook Received:', {
      timestamp: new Date().toISOString(),
      orderTrackingId,
      orderNotificationType,
      fullPayload: body,
    });

    // Validate required fields
    if (!orderTrackingId) {
      console.error('❌ PesaPal Webhook: Missing OrderTrackingId');
      // Return 200 OK - we acknowledge the notification even if data is invalid
      // This prevents PesaPal from retrying invalid notifications
      return NextResponse.json(
        { 
          message: 'Webhook received but OrderTrackingId is missing',
          received: true,
        },
        { status: 200 }
      );
    }

    // Create PesaPal provider instance
    // Note: Token caching is handled globally inside the provider class
    const pesapal = new PesaPalProvider();

    // Verify payment status with PesaPal API
    // This is CRITICAL: We don't trust the webhook data, we verify it
    console.log(`🔍 Verifying payment status for OrderTrackingId: ${orderTrackingId}`);
    
    const verificationResult = await pesapal.verifyPayment({
      transactionId: orderTrackingId,
      provider: 'pesapal',
    });

    // Log the verification result
    console.log('✅ Payment Verification Result:', {
      orderTrackingId,
      paymentStatus: verificationResult.paymentStatus,
      success: verificationResult.success,
      amount: verificationResult.amount,
      currency: verificationResult.currency,
      message: verificationResult.message,
    });

    // Log status change (important for debugging disputes)
    const status = verificationResult.paymentStatus.toUpperCase();
    console.log(`📊 Payment Status: ${status} for OrderTrackingId: ${orderTrackingId}`);

    // Handle different payment statuses and update database
    const paymentStatus = verificationResult.paymentStatus.toUpperCase();
    
    // At this point, orderTrackingId is guaranteed to be a string (validated above)
    const trackingId: string = orderTrackingId;
    
    // Helper function to create or update order
    const prisma = getPrismaClient();
    const createOrUpdateOrder = async (status: string, trackingId: string) => {
      if (!prisma) {
        console.warn('⚠️ Prisma not available - skipping database update');
        return;
      }
      
      try {
        // Try to find existing order first
        const existingOrder = await prisma.order.findUnique({
          where: { pesapalOrderTrackingId: trackingId },
        });

        if (existingOrder) {
          // Update existing order
          await prisma.order.update({
            where: { pesapalOrderTrackingId: trackingId },
            data: { status },
          });
          console.log(`✅ Database updated: Order status changed to ${status}`);
        } else {
          // Create new order if it doesn't exist (e.g., DB was down during payment initiation)
          // Ensure we have required fields before creating
          const amount = verificationResult.amount ?? 0;
          if (amount === 0) {
            console.warn(`⚠️ Cannot create order without amount for OrderTrackingId: ${trackingId}`);
            return;
          }
          
          await prisma.order.create({
            data: {
              id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
              amount: amount,
              currency: verificationResult.currency || 'KES',
              status,
              pesapalOrderTrackingId: trackingId,
              customerEmail: '', // Not available from webhook
              customerPhone: '', // Not available from webhook
              description: verificationResult.message || `Payment ${status.toLowerCase()}`,
              reference: trackingId,
            },
          });
          console.log(`✅ Database created: New order with status ${status}`);
        }
      } catch (dbError) {
        console.error(`❌ Database operation failed for status ${status}:`, dbError);
        // Don't throw - we still want to return 200 to PesaPal
      }
    };
    
    if (verificationResult.paymentStatus === 'completed') {
      // Payment is confirmed as completed
      console.log('💰 PAYMENT SUCCESS:', {
        orderTrackingId: trackingId,
        amount: verificationResult.amount,
        currency: verificationResult.currency,
        timestamp: new Date().toISOString(),
      });

      await createOrUpdateOrder('COMPLETED', trackingId);
    } else if (verificationResult.paymentStatus === 'pending') {
      console.log('⏳ Payment Status: PENDING', {
        orderTrackingId: trackingId,
        message: verificationResult.message,
      });
      
      await createOrUpdateOrder('PENDING', trackingId);
    } else if (verificationResult.paymentStatus === 'failed') {
      console.log('❌ Payment Status: FAILED', {
        orderTrackingId: trackingId,
        message: verificationResult.message,
      });
      
      await createOrUpdateOrder('FAILED', trackingId);
    } else if (verificationResult.paymentStatus === 'cancelled') {
      console.log('🚫 Payment Status: CANCELLED', {
        orderTrackingId: trackingId,
        message: verificationResult.message,
      });
      
      await createOrUpdateOrder('CANCELLED', trackingId);
    }

    // Return 200 OK to acknowledge receipt
    // We always return 200 if the code ran without crashing
    // This tells PesaPal we received and processed the notification
    return NextResponse.json(
      {
        message: 'Webhook processed successfully',
        orderTrackingId: trackingId,
        paymentStatus: verificationResult.paymentStatus,
        verified: true,
      },
      { status: 200 }
    );

  } catch (error) {
    // Determine error type
    const isNetworkError = 
      error instanceof TypeError && 
      (error.message.includes('fetch') || error.message.includes('network'));
    
    const isServerError = 
      error instanceof Error && 
      (error.message.includes('PesaPal') || error.message.includes('Auth Failed'));

    // Log the error
    console.error('❌ PesaPal Webhook Error:', {
      timestamp: new Date().toISOString(),
      orderTrackingId,
      orderNotificationType,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      isNetworkError,
      isServerError,
    });

    // Network/Server Errors: Return 500 so PesaPal retries later
    if (isNetworkError || isServerError) {
      console.error('🔄 Returning 500 - PesaPal will retry this notification');
      return NextResponse.json(
        {
          message: 'Webhook processing failed - server error',
          orderTrackingId,
          error: error instanceof Error ? error.message : 'Unknown error',
          willRetry: true,
        },
        { status: 500 }
      );
    }

    // Logic/Data Errors: Return 200 OK
    // We acknowledge the notification even if processing failed
    // This prevents PesaPal from retrying failed payment notifications
    console.log('✅ Returning 200 - Acknowledging notification (no retry)');
    return NextResponse.json(
      {
        message: 'Webhook received but processing encountered an error',
        orderTrackingId,
        error: error instanceof Error ? error.message : 'Unknown error',
        received: true,
      },
      { status: 200 }
    );
  }
}

