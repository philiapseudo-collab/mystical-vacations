'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PriceBreakdownWidget from '@/components/PriceBreakdownWidget';
import { packages } from '@/data/packages';
import { generateBookingReference } from '@/utils/formatters';

function BookPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [pkg, setPkg] = useState<any>(null);

  // Guest info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Load from sessionStorage first (full data including specialRequests)
    const stored = sessionStorage.getItem('bookingDetails');
    const baseDetails = stored ? JSON.parse(stored) : {};

    // Get URL params (critical fields only)
    const packageIdFromUrl = searchParams?.get('packageId');
    const guestsFromUrl = searchParams?.get('guests');
    const dateFromUrl = searchParams?.get('dateFrom');

    // Merge: sessionStorage base + URL params override
    const details = {
      ...baseDetails,
      packageId: packageIdFromUrl || baseDetails.packageId,
      guests: guestsFromUrl ? parseInt(guestsFromUrl) : baseDetails.guests,
      dateFrom: dateFromUrl || baseDetails.dateFrom,
    };

    // If no booking data at all, redirect to packages
    if (!details.packageId) {
      router.push('/packages');
      return;
    }

    setBookingDetails(details);
    const foundPkg = packages.find((p) => p.id === details.packageId);
    setPkg(foundPkg);

    // Update sessionStorage with merged data
    sessionStorage.setItem('bookingDetails', JSON.stringify(details));
  }, [router, searchParams]);

  if (!bookingDetails || !pkg) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setProcessing(true);

    try {
      // Generate booking reference
      const bookingReference = generateBookingReference();

      // Construct callback URL with booking params for payment gateway redirect
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const callbackUrl = `${appUrl}/book/payment/callback?packageId=${encodeURIComponent(bookingDetails.packageId)}&guests=${bookingDetails.guests}&dateFrom=${encodeURIComponent(bookingDetails.dateFrom)}`;

      // Prepare payment request
      const paymentRequest = {
        amount: pkg.price.total,
        currency: pkg.price.currency,
        customerEmail: email,
        customerPhone: phone,
        customerName: `${firstName} ${lastName}`,
        bookingReference,
        callbackUrl, // Include callback URL with booking params
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
          paymentProvider: 'pesapal',
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
              
              {/* PesaPal Payment Info */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-5 h-5 rounded-full border-2 border-gold bg-gold flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <h4 className="font-semibold text-navy text-lg">PesaPal</h4>
                </div>
                <div className="text-sm text-slate-600 space-y-1 ml-8">
                  <p>✓ Native M-Pesa Experience</p>
                  <p>✓ Trusted Local Standard</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Fees: ~3.5% (Card) / ~2.9-3.5% (M-Pesa)
                  </p>
                </div>
              </div>

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
                    disabled={processing}
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

export default function BookPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <BookPaymentContent />
    </Suspense>
  );
}

