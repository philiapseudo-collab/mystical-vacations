'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PriceBreakdownWidget from '@/components/PriceBreakdownWidget';
import PaymentMethodSelector from '@/components/booking/PaymentMethodSelector';
import { packages } from '@/data/packages';
import { generateBookingReference } from '@/utils/formatters';
import type { PaymentProviderName } from '@/lib/payments';

export default function BookPaymentPage() {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [pkg, setPkg] = useState<any>(null);

  // Guest info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');

  // Payment info
  const [selectedProvider, setSelectedProvider] = useState<PaymentProviderName | null>(null);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('bookingDetails');
    if (!stored) {
      router.push('/packages');
      return;
    }
    const details = JSON.parse(stored);
    setBookingDetails(details);
    const foundPkg = packages.find((p) => p.id === details.packageId);
    setPkg(foundPkg);
  }, [router]);

  if (!bookingDetails || !pkg) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvider) {
      alert('Please select a payment gateway');
      return;
    }

    setProcessing(true);

    try {
      // Generate booking reference
      const bookingReference = generateBookingReference();

      // Prepare payment request
      const paymentRequest = {
        amount: pkg.price.total,
        currency: pkg.price.currency,
        customerEmail: email,
        customerPhone: phone,
        customerName: `${firstName} ${lastName}`,
        bookingReference,
        provider: selectedProvider,
        guestDetails: { firstName, lastName, email, phone, nationality },
      };

      // Call payment API
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      });

      const data = await response.json();

      if (data.success && data.data.success) {
        // Store confirmation details
        sessionStorage.setItem('bookingConfirmation', JSON.stringify({
          ...bookingDetails,
          guestDetails: { firstName, lastName, email, phone, nationality },
          bookingReference,
          paymentProvider: selectedProvider,
          transactionId: data.data.transactionId,
          paymentStatus: data.data.paymentStatus,
        }));

        // If payment URL is provided, redirect to payment gateway
        if (data.data.paymentUrl) {
          // Redirect to payment gateway
          window.location.href = data.data.paymentUrl;
        } else {
          // If no redirect needed, go to confirmation
          router.push('/book/confirm');
        }
      } else {
        // Handle API error response
        const errorMessage = data.error?.message || data.message || 'Payment processing failed. Please try again.';
        alert(errorMessage);
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Handle network errors or thrown exceptions
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred while processing payment. Please try again.';
      alert(errorMessage);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/packages" className="text-slate-600 hover:text-gold">Packages</Link>
            <span className="text-slate-400">→</span>
            <Link href="/book/review" className="text-slate-600 hover:text-gold">Review Booking</Link>
            <span className="text-slate-400">→</span>
            <span className="text-gold font-semibold">Payment</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-400">Confirmation</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-serif font-bold text-navy mb-6">Guest Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-navy mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-navy mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-navy mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                    placeholder="+254 XXX XXX XXX"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="nationality" className="block text-sm font-semibold text-navy mb-2">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    id="nationality"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-serif font-bold text-navy mb-6">Payment Method</h2>
              
              {/* Payment Gateway Selector */}
              <PaymentMethodSelector
                selectedProvider={selectedProvider}
                onProviderSelect={setSelectedProvider}
              />

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="mt-1" required />
                    <span className="text-sm text-slate-700">
                      I agree to the <a href="#" className="text-gold hover:underline">Terms & Conditions</a> and{' '}
                      <a href="#" className="text-gold hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <div className="flex gap-4 mt-6">
                  <Link href="/book/review" className="flex-1">
                    <button type="button" className="btn-outline w-full">
                      ← Back
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={processing || !selectedProvider}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Complete Payment →'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Column - Price Breakdown */}
          <div className="lg:col-span-1">
            <PriceBreakdownWidget priceBreakdown={pkg.price} itemCount={bookingDetails.guests} />
          </div>
        </div>
      </div>
    </div>
  );
}

