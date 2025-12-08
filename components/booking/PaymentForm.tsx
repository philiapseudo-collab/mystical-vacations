'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PaymentFormProps {
  bookingReference: string;
  onSuccess: (redirectUrl: string, trackingId: string) => void;
  onError: (message: string) => void;
  onSubmit?: (paymentMethod: string) => Promise<void>;
}

type PaymentMethod = 'MPESA' | 'CARD';

export default function PaymentForm({ bookingReference, onSuccess, onError, onSubmit }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('MPESA');
  const [processing, setProcessing] = useState(false);
  const [showRedirectOverlay, setShowRedirectOverlay] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingReference) {
      onError('Booking reference is required');
      return;
    }

    setProcessing(true);

    try {
      // If custom onSubmit handler is provided, use it (for updating booking first)
      if (onSubmit) {
        try {
          await onSubmit(selectedMethod);
          // Note: onSubmit handler should manage its own redirect/overlay
          return;
        } catch (error) {
          // Re-throw to be caught by outer catch block
          throw error;
        }
      }

      // Otherwise, use default flow
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingReference,
          paymentMethod: selectedMethod,
        }),
      });

      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error?.message || 'Failed to initiate payment');
      }

      const { redirectUrl, trackingId } = data.data;

      if (!redirectUrl) {
        throw new Error('No redirect URL received from payment provider');
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(redirectUrl, trackingId);
      } else {
        // Show redirect overlay
        setShowRedirectOverlay(true);

        // Wait a moment for user to see the message, then redirect
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1500);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setProcessing(false);
      setShowRedirectOverlay(false);
      onError(error instanceof Error ? error.message : 'Could not initiate payment. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <h3 className="text-lg font-semibold text-navy mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* M-Pesa Option */}
            <motion.button
              type="button"
              onClick={() => setSelectedMethod('MPESA')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedMethod === 'MPESA'
                  ? 'border-gold bg-gold/10 shadow-md'
                  : 'border-slate-200 hover:border-gold/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'MPESA'
                      ? 'border-gold bg-gold'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedMethod === 'MPESA' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <h4 className="font-semibold text-navy text-lg">M-Pesa</h4>
              </div>
              <div className="text-sm text-slate-600 space-y-1 ml-8">
                <p>✓ Native M-Pesa Experience</p>
                <p>✓ Trusted Local Standard</p>
                <p className="text-xs text-slate-500 mt-2">Fees: ~2.9-3.5%</p>
              </div>
            </motion.button>

            {/* Card Option */}
            <motion.button
              type="button"
              onClick={() => setSelectedMethod('CARD')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedMethod === 'CARD'
                  ? 'border-gold bg-gold/10 shadow-md'
                  : 'border-slate-200 hover:border-gold/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'CARD'
                      ? 'border-gold bg-gold'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedMethod === 'CARD' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <h4 className="font-semibold text-navy text-lg">Card Payment</h4>
              </div>
              <div className="text-sm text-slate-600 space-y-1 ml-8">
                <p>✓ Visa & Mastercard</p>
                <p>✓ Secure Payment Gateway</p>
                <p className="text-xs text-slate-500 mt-2">Fees: ~3.5%</p>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" className="mt-1" required />
            <span className="text-sm text-slate-700">
              I agree to the{' '}
              <a href="/legal/terms" target="_blank" className="text-gold hover:underline">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/legal/privacy" target="_blank" className="text-gold hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={processing}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : 'Complete Payment →'}
        </button>
      </form>

      {/* Redirect Overlay */}
      {showRedirectOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-navy/95 z-50 flex items-center justify-center"
        >
          <div className="text-center text-white">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold mx-auto"></div>
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">
              Redirecting to Secure Payment...
            </h2>
            <p className="text-lg text-slate-300">
              You will be redirected to PesaPal to complete your payment securely.
            </p>
            <p className="text-sm text-slate-400 mt-4">
              Please do not close this window.
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}

