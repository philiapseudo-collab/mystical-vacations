/**
 * Payment Provider Factory
 * Returns the appropriate payment provider based on service name
 */

import { PesaPalProvider } from './pesapal';
import { FlutterwaveProvider } from './flutterwave';
import type { IPaymentProvider } from './types';

export type PaymentProviderName = 'pesapal' | 'flutterwave';

/**
 * Get payment provider instance
 * @param serviceName - The name of the payment provider ('pesapal' or 'flutterwave')
 * @returns IPaymentProvider instance
 * @throws Error if service name is invalid
 */
export function getPaymentProvider(serviceName: PaymentProviderName): IPaymentProvider {
  switch (serviceName) {
    case 'pesapal':
      return new PesaPalProvider();
    case 'flutterwave':
      return new FlutterwaveProvider();
    default:
      throw new Error(`Unknown payment provider: ${serviceName}`);
  }
}

/**
 * Get all available payment providers
 * Useful for UI rendering
 */
export function getAllPaymentProviders(): IPaymentProvider[] {
  return [
    new PesaPalProvider(),
    new FlutterwaveProvider(),
  ];
}

/**
 * Check if a payment provider name is valid
 */
export function isValidPaymentProvider(name: string): name is PaymentProviderName {
  return name === 'pesapal' || name === 'flutterwave';
}

