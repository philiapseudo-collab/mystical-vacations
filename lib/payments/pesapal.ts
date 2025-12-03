/**
 * PesaPal Payment Provider Implementation
 * The Local Standard - Native & Trusted M-Pesa Experience
 * 
 * API Documentation: https://developer.pesapal.com/api3/getting-started
 */

import type {
  IPaymentProvider,
  IPaymentInitiateRequest,
  IPaymentInitiateResponse,
  IPaymentVerifyRequest,
  IPaymentVerifyResponse,
} from './types';

interface PesaPalAccessTokenResponse {
  token: string;
  expiryDate: string;
}

interface PesaPalSubmitOrderResponse {
  orderTrackingId: string;
  redirectUrl: string;
  status: string;
  message: string;
}

interface PesaPalTransactionStatusResponse {
  order_tracking_id: string;
  payment_method_description: string;
  amount: number;
  currency: string;
  payment_status_description: string;
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: string;
  merchant_reference: string;
}

export class PesaPalProvider implements IPaymentProvider {
  readonly name = 'pesapal' as const;
  readonly displayName = 'PesaPal';

  /**
   * Get PesaPal base URL based on environment
   */
  private getBaseUrl(): string {
    const env = process.env.PESAPAL_ENV || 'sandbox';
    return env === 'production'
      ? 'https://pay.pesapal.com/v3'
      : 'https://cybqa.pesapal.com/pesapalv3';
  }

  /**
   * Get access token from PesaPal
   * POST /api/Auth/RequestToken
   */
  private async getAccessToken(): Promise<string> {
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error('PesaPal Auth Failed: Consumer Key and Secret must be set in environment variables');
    }

    const baseUrl = this.getBaseUrl();
    const authUrl = `${baseUrl}/api/Auth/RequestToken`;

    try {
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          consumer_key: consumerKey,
          consumer_secret: consumerSecret,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PesaPal Auth Failed: ${response.status} - ${errorText}`);
      }

      const data: PesaPalAccessTokenResponse = await response.json();

      if (!data.token) {
        throw new Error('PesaPal Auth Failed: Invalid response - token not found');
      }

      return data.token;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`PesaPal Auth Failed: ${error.message}`);
      }
      throw new Error('PesaPal Auth Failed: Unknown error occurred');
    }
  }

  /**
   * Initiate payment with PesaPal
   * Merchant Fees: ~3.5% (Card) / ~2.9% - 3.5% (M-Pesa)
   * Settlement: T+2 Days (Bank) or Real-time to Openfloat
   * 
   * POST /api/Transactions/SubmitOrderRequest
   */
  async initiatePayment(
    request: IPaymentInitiateRequest
  ): Promise<IPaymentInitiateResponse> {
    try {
      // Get access token first
      const accessToken = await this.getAccessToken();

      // Get callback URL
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const callbackUrl = `${appUrl}/book/payment/callback`;

      // Get IPN ID from environment
      const ipnId = process.env.PESAPAL_IPN_ID;

      // Generate unique order ID
      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Prepare request payload according to PesaPal API 3.0
      const payload = {
        id: orderId,
        currency: request.currency,
        amount: request.amount,
        description: `Payment for booking: ${request.bookingReference}`,
        callback_url: callbackUrl,
        redirect_mode: 'PARENT_WINDOW', // or 'NEW_WINDOW'
        notification_id: ipnId || '', // Optional but recommended
        billing_address: {
          email_address: request.customerEmail,
          phone_number: request.customerPhone,
          country_code: 'KE', // Default to Kenya, can be made dynamic
          first_name: request.customerName.split(' ')[0] || request.customerName,
          middle_name: '',
          last_name: request.customerName.split(' ').slice(1).join(' ') || '',
          line_1: '',
          line_2: '',
          city: '',
          state: '',
          postal_code: '',
          zip_code: '',
        },
      };

      const baseUrl = this.getBaseUrl();
      const submitUrl = `${baseUrl}/api/Transactions/SubmitOrderRequest`;

      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PesaPal Payment Initiation Failed: ${response.status} - ${errorText}`);
      }

      const data: PesaPalSubmitOrderResponse = await response.json();

      if (!data.orderTrackingId || !data.redirectUrl) {
        throw new Error('PesaPal Payment Initiation Failed: Invalid response - missing orderTrackingId or redirectUrl');
      }

      return {
        success: true,
        transactionId: data.orderTrackingId,
        paymentUrl: data.redirectUrl,
        paymentStatus: 'initiated',
        message: 'Payment initiated with PesaPal. You will be redirected to complete payment.',
        provider: 'pesapal',
      };
    } catch (error) {
      // Throw error instead of returning error response
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to initiate PesaPal payment: Unknown error occurred');
    }
  }

  /**
   * Verify payment status with PesaPal
   * GET /api/Transactions/GetTransactionStatus?orderTrackingId={orderTrackingId}
   */
  async verifyPayment(
    request: IPaymentVerifyRequest
  ): Promise<IPaymentVerifyResponse> {
    try {
      // Get access token
      const accessToken = await this.getAccessToken();

      const baseUrl = this.getBaseUrl();
      const verifyUrl = `${baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${request.transactionId}`;

      const response = await fetch(verifyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PesaPal Verification Failed: ${response.status} - ${errorText}`);
      }

      const data: PesaPalTransactionStatusResponse = await response.json();

      // Map PesaPal status to our payment status
      const statusCode = data.status_code;
      let paymentStatus: 'completed' | 'pending' | 'failed' | 'cancelled' = 'pending';

      if (statusCode === '1') {
        paymentStatus = 'completed';
      } else if (statusCode === '2') {
        paymentStatus = 'pending';
      } else if (statusCode === '3' || statusCode === '4') {
        paymentStatus = 'failed';
      } else if (statusCode === '5') {
        paymentStatus = 'cancelled';
      }

      return {
        success: paymentStatus === 'completed',
        paymentStatus,
        transactionId: data.order_tracking_id || request.transactionId,
        amount: data.amount,
        currency: data.currency,
        message: data.message || data.payment_status_description || 'Payment verification completed',
      };
    } catch (error) {
      // Throw error instead of returning error response
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to verify PesaPal payment: Unknown error occurred');
    }
  }
}

