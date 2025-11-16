'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PriceBreakdownWidget from '@/components/PriceBreakdownWidget';
import { packages } from '@/data/packages';

export default function BookReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams?.get('package');

  const [guests, setGuests] = useState(2);
  const [dateFrom, setDateFrom] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const pkg = packages.find((p) => p.id === packageId);

  useEffect(() => {
    if (!pkg) {
      router.push('/packages');
    }
  }, [pkg, router]);

  if (!pkg) {
    return <div>Loading...</div>;
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Store booking details in sessionStorage for next step
    sessionStorage.setItem('bookingDetails', JSON.stringify({
      packageId: pkg.id,
      guests,
      dateFrom,
      specialRequests,
    }));
    router.push('/book/payment');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/packages" className="text-slate-600 hover:text-gold">Packages</Link>
            <span className="text-slate-400">→</span>
            <span className="text-gold font-semibold">Review Booking</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-400">Payment</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-400">Confirmation</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-serif font-bold text-navy mb-4">Your Package</h2>
              <div className="flex gap-4">
                <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={pkg.images[0].url}
                    alt={pkg.images[0].alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-navy mb-2">{pkg.title}</h3>
                  <p className="text-slate-600 text-sm mb-2">{pkg.subtitle}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>⏱️ {pkg.duration} Days</span>
                    <span>⭐ {pkg.rating} ({pkg.reviewCount})</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Booking Details Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-serif font-bold text-navy mb-6">Booking Details</h2>
              <form onSubmit={handleContinue} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="guests" className="block text-sm font-semibold text-navy mb-2">
                      Number of Guests *
                    </label>
                    <input
                      type="number"
                      id="guests"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      min="1"
                      max={pkg.maxGroupSize}
                      className="input"
                      required
                    />
                    <p className="text-xs text-slate-500 mt-1">Maximum {pkg.maxGroupSize} guests</p>
                  </div>

                  <div>
                    <label htmlFor="dateFrom" className="block text-sm font-semibold text-navy mb-2">
                      Departure Date *
                    </label>
                    <input
                      type="date"
                      id="dateFrom"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-semibold text-navy mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={4}
                    className="input"
                    placeholder="Dietary requirements, accessibility needs, special occasions, etc."
                  />
                </div>

                {/* Guest Information Note */}
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-sm text-slate-700">
                    <strong>Note:</strong> Detailed guest information (names, passport details) will be collected after payment.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Link href={`/packages/${pkg.slug}`} className="flex-1">
                    <button type="button" className="btn-outline w-full">
                      ← Back to Package
                    </button>
                  </Link>
                  <button type="submit" className="btn-primary flex-1">
                    Continue to Payment →
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Column - Price Breakdown */}
          <div className="lg:col-span-1">
            <PriceBreakdownWidget priceBreakdown={pkg.price} itemCount={guests} />
          </div>
        </div>
      </div>
    </div>
  );
}

