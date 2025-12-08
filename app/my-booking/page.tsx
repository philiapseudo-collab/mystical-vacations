'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/ui/Toast';
import type { IAPIResponse } from '@/types';

export default function MyBookingPage() {
  const router = useRouter();
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/booking/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference: reference.trim(),
          email: email.trim(),
        }),
      });

      const data: IAPIResponse<{ redirectUrl: string }> = await response.json();

      if (data.success && data.data?.redirectUrl) {
        // Redirect to confirmation page
        router.push(data.data.redirectUrl);
      } else {
        // Show error
        const errorMessage = data.error?.message || 'Booking not found or email does not match.';
        setError(errorMessage);
        setShowToast(true);
      }
    } catch (err) {
      console.error('Lookup error:', err);
      setError('An error occurred. Please try again.');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-navy text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Manage Your <span className="text-gold">Journey</span>
            </h1>
            <p className="text-xl text-slate-300">
              Find your booking and access your travel details
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-xl p-8 md:p-12"
          >
            <h2 className="text-2xl font-serif font-bold text-navy mb-6 text-center">
              Find Your Booking
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Booking Reference Input */}
              <div>
                <label htmlFor="reference" className="block text-sm font-semibold text-navy mb-2">
                  Booking Reference
                </label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g., MV-8293"
                  required
                  className="input w-full"
                  disabled={loading}
                />
                <p className="mt-1 text-sm text-slate-500">
                  Enter your booking reference (found in your confirmation email)
                </p>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="input w-full"
                  disabled={loading}
                />
                <p className="mt-1 text-sm text-slate-500">
                  Enter the email address used for this booking
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-navy"></div>
                    Finding Booking...
                  </span>
                ) : (
                  'Find Booking'
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-600 text-center">
                Need help?{' '}
                <Link href="/contact" className="text-gold hover:underline font-semibold">
                  Contact our support team
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

