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

/**
 * Simple PesaPal Order Interface
 * Simplified input for payment initiation
 */
export interface PesaPalOrder {
  amount: number;
  email: string;
  phone: string;
  description: string;
  reference: string;
  callbackUrl?: string;
  currency?: string; // Defaults to 'KES' if not provided
  customerName?: string; // Optional, will be derived from email if not provided
}

/**
 * PesaPal Payment Initiation Response
 * Returns the redirect URL and order tracking ID for database storage
 */
export interface PesaPalPaymentResponse {
  redirectUrl: string;
  orderTrackingId: string;
}

interface PesaPalAccessTokenResponse {
  token: string;
  expiryDate: string;
}

/**
 * Token Cache (In-Memory Singleton)
 * Helps with Vercel serverless warm starts
 */
interface TokenCache {
  token: string | null;
  expiryTime: number; // Unix timestamp in milliseconds
}

let tokenCache: TokenCache = {
  token: null,
  expiryTime: 0,
};

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
   * Get access token from PesaPal with caching
   * POST /api/Auth/RequestToken
   * 
   * Uses in-memory cache to reduce API calls during Vercel warm starts
   */
  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    
    // Check if we have a valid cached token
    if (tokenCache.token && tokenCache.expiryTime > now) {
      return tokenCache.token;
    }

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

      // Cache the token
      // PesaPal tokens typically expire in 1 hour, but we'll set expiry to 55 minutes for safety
      // If expiryDate is provided, parse it; otherwise use 55 minutes from now
      let expiryTime: number;
      if (data.expiryDate) {
        expiryTime = new Date(data.expiryDate).getTime();
      } else {
        // Default to 55 minutes from now (3300 seconds)
        expiryTime = now + (55 * 60 * 1000);
      }

      tokenCache = {
        token: data.token,
        expiryTime: expiryTime,
      };

      return data.token;
    } catch (error) {
      // Clear cache on error
      tokenCache = { token: null, expiryTime: 0 };
      
      if (error instanceof Error) {
        throw new Error(`PesaPal Auth Failed: ${error.message}`);
      }
      throw new Error('PesaPal Auth Failed: Unknown error occurred');
    }
  }

  /**
   * Simple payment initiation with PesaPal
   * Returns redirect URL and order tracking ID for database storage
   * 
   * @param order - Simple PesaPal order object
   * @returns Object with redirectUrl and orderTrackingId
   * @throws Error if PesaPal API fails or credentials are invalid
   */
  async initiatePaymentSimple(order: PesaPalOrder): Promise<PesaPalPaymentResponse> {
    try {
      // Get access token (with caching)
      const accessToken = await this.getAccessToken();

      // Get callback URL (use provided or default)
      const callbackUrl = order.callbackUrl || 
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/book/payment/callback`;

      // Get IPN ID from environment
      const ipnId = process.env.PESAPAL_IPN_ID;

      // Generate unique order ID
      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Derive customer name from email if not provided
      const customerName = order.customerName || order.email.split('@')[0] || 'Customer';
      const nameParts = customerName.split(' ');
      const firstName = nameParts[0] || customerName;
      const lastName = nameParts.slice(1).join(' ') || '';

      // Prepare request payload according to PesaPal API 3.0 (JSON format)
      const payload = {
        id: orderId,
        currency: order.currency || 'KES',
        amount: order.amount,
        description: order.description,
        callback_url: callbackUrl,
        redirect_mode: 'PARENT_WINDOW',
        notification_id: ipnId || '',
        billing_address: {
          email_address: order.email,
          phone_number: order.phone,
          country_code: 'KE', // Default to Kenya
          first_name: firstName,
          middle_name: '',
          last_name: lastName,
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
        redirectUrl: data.redirectUrl,
        orderTrackingId: data.orderTrackingId,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to initiate PesaPal payment: Unknown error occurred');
    }
  }

  /**
   * Initiate payment with PesaPal (IPaymentProvider interface implementation)
   * Merchant Fees: ~3.5% (Card) / ~2.9% - 3.5% (M-Pesa)
   * Settlement: T+2 Days (Bank) or Real-time to Openfloat
   * 
   * POST /api/Transactions/SubmitOrderRequest
   */
  async initiatePayment(
    request: IPaymentInitiateRequest
  ): Promise<IPaymentInitiateResponse> {
    try {
      // Convert IPaymentInitiateRequest to PesaPalOrder format
      const order: PesaPalOrder = {
        amount: request.amount,
        email: request.customerEmail,
        phone: request.customerPhone,
        description: `Payment for booking: ${request.bookingReference}`,
        reference: request.bookingReference,
        currency: request.currency || 'KES',
        customerName: request.customerName,
      };

      // Use the simple method internally
      const result = await this.initiatePaymentSimple(order);

      // Return in IPaymentInitiateResponse format for interface compatibility
      return {
        success: true,
        transactionId: result.orderTrackingId,
        paymentUrl: result.redirectUrl,
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

