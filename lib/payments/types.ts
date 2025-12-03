/**
 * Payment Provider Interface
 * Defines the contract that all payment providers must implement
 */

export interface IPaymentInitiateRequest {
  amount: number;
  currency: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  bookingReference: string;
  metadata?: Record<string, any>;
}

export interface IPaymentInitiateResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string; // For redirect-based flows
  paymentStatus: 'pending' | 'initiated' | 'failed';
  message: string;
  provider: 'pesapal' | 'flutterwave';
}

export interface IPaymentVerifyRequest {
  transactionId: string;
  provider: 'pesapal' | 'flutterwave';
}

export interface IPaymentVerifyResponse {
  success: boolean;
  paymentStatus: 'completed' | 'pending' | 'failed' | 'cancelled';
  transactionId: string;
  amount?: number;
  currency?: string;
  message: string;
}

/**
 * Payment Provider Interface
 * All payment providers must implement this interface
 */
export interface IPaymentProvider {
  /**
   * Provider name
   */
  readonly name: 'pesapal' | 'flutterwave';

  /**
   * Display name for UI
   */
  readonly displayName: string;

  /**
   * Initiate a payment transaction
   */
  initiatePayment(request: IPaymentInitiateRequest): Promise<IPaymentInitiateResponse>;

  /**
   * Verify/check payment status
   */
  verifyPayment(request: IPaymentVerifyRequest): Promise<IPaymentVerifyResponse>;
}

