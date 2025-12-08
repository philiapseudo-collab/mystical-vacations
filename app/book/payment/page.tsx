'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PriceBreakdownWidget from '@/components/PriceBreakdownWidget';
import PaymentForm from '@/components/booking/PaymentForm';
import Toast from '@/components/ui/Toast';
import type { IBooking } from '@/types';

function BookPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRedirectOverlay, setShowRedirectOverlay] = useState(false);

  // Guest info form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');

  useEffect(() => {
    // Get bookingReference from URL
    const bookingReference = searchParams?.get('bookingReference');

    if (!bookingReference) {
      setError('Booking reference is required');
      setLoading(false);
      return;
    }

    // TypeScript: bookingReference is guaranteed to be string here after null check
    const bookingRef: string = bookingReference;

    // Fetch booking from API
    async function fetchBooking() {
      try {
        const response = await fetch(`/api/booking/${encodeURIComponent(bookingRef)}`);
        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error?.message || 'Booking not found');
        }

        const fetchedBooking = data.data;
        setBooking(fetchedBooking);

        // Pre-fill form if guest details exist
        if (fetchedBooking.guestDetails) {
          setFirstName(fetchedBooking.guestDetails.firstName || '');
          setLastName(fetchedBooking.guestDetails.lastName || '');
          setEmail(fetchedBooking.guestDetails.email || '');
          setPhone(fetchedBooking.guestDetails.phone || '');
          setNationality(fetchedBooking.guestDetails.nationality || '');
        }
      } catch (err) {
        console.error('Failed to fetch booking:', err);
        setError(err instanceof Error ? err.message : 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [searchParams]);

  const handlePaymentSuccess = (redirectUrl: string, trackingId: string) => {
    // Store tracking ID for later reference
    if (booking) {
      sessionStorage.setItem('paymentTrackingId', trackingId);
      sessionStorage.setItem('bookingConfirmation', JSON.stringify({
        bookingReference: booking.bookingReference,
        trackingId,
      }));
    }
    // PaymentForm will handle the redirect
  };

  const handlePaymentError = (message: string) => {
    setToastMessage(message);
  };

  const handlePaymentSubmit = async (paymentMethod: string): Promise<void> => {
    if (!booking) {
      handlePaymentError('Booking not found');
      return;
    }

    // Validate guest details
    if (!firstName || !lastName || !email || !phone) {
      handlePaymentError('Please fill in all required guest information');
      return;
    }

    // Update booking with guest details before processing payment
    try {
      const updateResponse = await fetch(`/api/booking/${encodeURIComponent(booking.bookingReference)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestDetails: {
            firstName,
            lastName,
            email,
            phone,
            nationality,
          },
        }),
      });

      const updateData = await updateResponse.json();

      if (!updateData.success) {
        throw new Error(updateData.error?.message || 'Failed to update booking');
      }

      // Update local booking state
      setBooking(updateData.data);

      // Now process payment
      const paymentResponse = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingReference: booking.bookingReference,
          paymentMethod,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentData.success || !paymentData.data) {
        throw new Error(paymentData.error?.message || 'Failed to initiate payment');
      }

      const { redirectUrl, trackingId } = paymentData.data;

      if (!redirectUrl) {
        throw new Error('No redirect URL received from payment provider');
      }

      // Store tracking ID
      sessionStorage.setItem('paymentTrackingId', trackingId);
      sessionStorage.setItem('bookingConfirmation', JSON.stringify({
        bookingReference: booking.bookingReference,
        trackingId,
      }));

      // Show redirect overlay and redirect
      setShowRedirectOverlay(true);
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
    } catch (err) {
      console.error('Payment processing error:', err);
      // Re-throw so PaymentForm can handle the error state
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
          <Link href="/packages">
            <button className="btn-primary">Back to Packages</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setToastMessage(null)}
        />
      )}
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
                <div className="space-y-2 text-slate-700 mb-4">
                  <p>
                    <span className="font-semibold">Booking Reference:</span>{' '}
                    <span className="font-mono text-gold">{booking.bookingReference}</span>
                  </p>
                </div>
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
                
                <PaymentForm
                  bookingReference={booking.bookingReference}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onSubmit={handlePaymentSubmit}
                />
              </motion.div>
            </div>

            {/* Right Column - Price Breakdown */}
            <div className="lg:col-span-1">
              <PriceBreakdownWidget priceBreakdown={booking.priceBreakdown} itemCount={1} />
            </div>
          </div>
        </div>
      </div>
    </>
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

