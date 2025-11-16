'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PriceBreakdownWidget from '@/components/PriceBreakdownWidget';
import { packages } from '@/data/packages';
import { generateBookingReference } from '@/utils/formatters';

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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');

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
    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate booking reference
    const bookingReference = generateBookingReference();

    // Store confirmation details
    sessionStorage.setItem('bookingConfirmation', JSON.stringify({
      ...bookingDetails,
      guestDetails: { firstName, lastName, email, phone, nationality },
      bookingReference,
      paymentMethod,
    }));

    router.push('/book/confirm');
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
                    placeholder="+254 700 000 000"
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
              
              {/* Payment Method Selector */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'card'
                      ? 'border-gold bg-gold/5'
                      : 'border-slate-300 hover:border-gold/50'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold text-navy">💳 Credit/Debit Card</p>
                    <p className="text-xs text-slate-600 mt-1">Visa, Mastercard</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'mpesa'
                      ? 'border-gold bg-gold/5'
                      : 'border-slate-300 hover:border-gold/50'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold text-navy">📱 M-Pesa</p>
                    <p className="text-xs text-slate-600 mt-1">Mobile payment</p>
                  </div>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {paymentMethod === 'card' ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-semibold text-navy mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="input"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="expiryMonth" className="block text-sm font-semibold text-navy mb-2">
                          Month *
                        </label>
                        <input
                          type="text"
                          id="expiryMonth"
                          value={expiryMonth}
                          onChange={(e) => setExpiryMonth(e.target.value)}
                          className="input"
                          placeholder="MM"
                          maxLength={2}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="expiryYear" className="block text-sm font-semibold text-navy mb-2">
                          Year *
                        </label>
                        <input
                          type="text"
                          id="expiryYear"
                          value={expiryYear}
                          onChange={(e) => setExpiryYear(e.target.value)}
                          className="input"
                          placeholder="YY"
                          maxLength={2}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-semibold text-navy mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="input"
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cardholderName" className="block text-sm font-semibold text-navy mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        id="cardholderName"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="input"
                        placeholder="Name on card"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="mpesaPhone" className="block text-sm font-semibold text-navy mb-2">
                      M-Pesa Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="mpesaPhone"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className="input"
                      placeholder="+254 700 000 000"
                      required
                    />
                    <p className="text-sm text-slate-600 mt-2">
                      You will receive an M-Pesa prompt on your phone to complete payment.
                    </p>
                  </div>
                )}

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

