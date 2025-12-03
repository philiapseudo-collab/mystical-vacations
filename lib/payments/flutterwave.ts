/**
 * Flutterwave Payment Provider Implementation
 * The Modern Challenger - World Class Developer API
 * 
 * API Documentation: https://developer.flutterwave.com/docs
 */

import type {
  IPaymentProvider,
  IPaymentInitiateRequest,
  IPaymentInitiateResponse,
  IPaymentVerifyRequest,
  IPaymentVerifyResponse,
} from './types';

interface FlutterwavePaymentResponse {
  status: string;
  message: string;
  data: {
    link: string;
    tx_ref: string;
  };
}

interface FlutterwaveVerifyResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    card: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      token: string;
      expiry: string;
    };
    created_at: string;
    account_id: number;
    customer: {
      id: number;
      phone_number: string;
      name: string;
      email: string;
      created_at: string;
    };
    status: string;
  };
}

export class FlutterwaveProvider implements IPaymentProvider {
  readonly name = 'flutterwave' as const;
  readonly displayName = 'Flutterwave';

  /**
   * Get Flutterwave secret key from environment
   */
  private getSecretKey(): string {
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Flutterwave Auth Failed: Secret Key must be set in environment variables');
    }
    return secretKey;
  }

  /**
   * Initiate payment with Flutterwave
   * Merchant Fees: 3.2% (Local Card) / 2.9% (M-Pesa)
   * Settlement: T+1 Day (Local) / T+5 (Int'l)
   * Superior recurring billing support
   * 
   * POST https://api.flutterwave.com/v3/payments
   */
  async initiatePayment(
    request: IPaymentInitiateRequest
  ): Promise<IPaymentInitiateResponse> {
    try {
      const secretKey = this.getSecretKey();

      // Get callback URL
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const redirectUrl = `${appUrl}/book/payment/callback`;

      // Generate unique transaction reference
      const txRef = `FLW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Prepare request payload according to Flutterwave v3 API
      const payload = {
        tx_ref: txRef,
        amount: request.amount,
        currency: request.currency,
        redirect_url: redirectUrl,
        payment_options: 'card,mpesa,mobilemoney', // Enable multiple payment methods
        customer: {
          email: request.customerEmail,
          phone_number: request.customerPhone,
          name: request.customerName,
        },
        customizations: {
          title: 'Mystical Vacations',
          description: `Payment for booking: ${request.bookingReference}`,
          logo: `${appUrl}/logo.png`, // Optional: Add your logo URL
        },
        meta: {
          booking_reference: request.bookingReference,
          ...request.metadata,
        },
      };

      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Flutterwave Payment Initiation Failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data: FlutterwavePaymentResponse = await response.json();

      if (data.status !== 'success' || !data.data?.link) {
        throw new Error(`Flutterwave Payment Initiation Failed: ${data.message || 'Invalid response'}`);
      }

      return {
        success: true,
        transactionId: data.data.tx_ref,
        paymentUrl: data.data.link,
        paymentStatus: 'initiated',
        message: 'Payment initiated with Flutterwave. You will be redirected to complete payment.',
        provider: 'flutterwave',
      };
    } catch (error) {
      // Throw error instead of returning error response
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to initiate Flutterwave payment: Unknown error occurred');
    }
  }

  /**
   * Verify payment status with Flutterwave
   * GET https://api.flutterwave.com/v3/transactions/{id}/verify
   * Note: Flutterwave uses transaction ID (tx_ref) for verification
   */
  async verifyPayment(
    request: IPaymentVerifyRequest
  ): Promise<IPaymentVerifyResponse> {
    try {
      const secretKey = this.getSecretKey();

      // Flutterwave verification endpoint expects the transaction ID
      const verifyUrl = `https://api.flutterwave.com/v3/transactions/${request.transactionId}/verify`;

      const response = await fetch(verifyUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Flutterwave Verification Failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data: FlutterwaveVerifyResponse = await response.json();

      if (data.status !== 'success' || !data.data) {
        throw new Error(`Flutterwave Verification Failed: ${data.message || 'Invalid response'}`);
      }

      // Map Flutterwave status to our payment status
      const flutterwaveStatus = data.data.status.toLowerCase();
      let paymentStatus: 'completed' | 'pending' | 'failed' | 'cancelled' = 'pending';

      if (flutterwaveStatus === 'successful' || flutterwaveStatus === 'success') {
        paymentStatus = 'completed';
      } else if (flutterwaveStatus === 'pending' || flutterwaveStatus === 'processing') {
        paymentStatus = 'pending';
      } else if (flutterwaveStatus === 'failed' || flutterwaveStatus === 'error') {
        paymentStatus = 'failed';
      } else if (flutterwaveStatus === 'cancelled') {
        paymentStatus = 'cancelled';
      }

      return {
        success: paymentStatus === 'completed',
        paymentStatus,
        transactionId: data.data.tx_ref || request.transactionId,
        amount: data.data.amount,
        currency: data.data.currency,
        message: data.message || `Payment status: ${data.data.status}`,
      };
    } catch (error) {
      // Throw error instead of returning error response
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to verify Flutterwave payment: Unknown error occurred');
    }
  }
}

