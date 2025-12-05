/**
 * Payment Provider Factory
 * Returns the PesaPal payment provider
 */

import { PesaPalProvider } from './pesapal';
import type { IPaymentProvider } from './types';

// Re-export types for convenience
export type {
  IPaymentProvider,
  IPaymentInitiateRequest,
  IPaymentInitiateResponse,
  IPaymentVerifyRequest,
  IPaymentVerifyResponse,
} from './types';

export type PaymentProviderName = 'pesapal';

/**
 * Get payment provider instance (always returns PesaPal)
 * @returns IPaymentProvider instance
 */
export function getPaymentProvider(): IPaymentProvider {
  return new PesaPalProvider();
}

/**
 * Get all available payment providers
 * Useful for UI rendering
 */
export function getAllPaymentProviders(): IPaymentProvider[] {
  return [
    new PesaPalProvider(),
  ];
}

/**
 * Check if a payment provider name is valid
 */
export function isValidPaymentProvider(name: string): name is PaymentProviderName {
  return name === 'pesapal';
}

