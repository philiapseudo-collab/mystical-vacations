'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { packages } from '@/data/packages';
import { formatPrice, formatDate } from '@/utils/formatters';

export default function BookConfirmPage() {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState<any>(null);
  const [pkg, setPkg] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('bookingConfirmation');
    if (!stored) {
      router.push('/packages');
      return;
    }
    const details = JSON.parse(stored);
    setConfirmation(details);
    const foundPkg = packages.find((p) => p.id === details.packageId);
    setPkg(foundPkg);
  }, [router]);

  if (!confirmation || !pkg) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const total = pkg.price.total * confirmation.guests;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-8"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>

        {/* Confirmation Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-4">
            Booking <span className="text-gold">Confirmed!</span>
          </h1>
          <p className="text-xl text-slate-600">
            Your mystical African adventure awaits
          </p>
        </motion.div>

        {/* Confirmation Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-xl p-8 mb-6"
        >
          {/* Booking Reference */}
          <div className="text-center mb-8 pb-8 border-b-2 border-gold">
            <p className="text-sm text-slate-600 mb-2">Booking Reference</p>
            <p className="text-3xl font-bold text-navy font-mono">{confirmation.bookingReference}</p>
          </div>

          {/* Package Details */}
          <div className="mb-8">
            <h2 className="text-xl font-serif font-bold text-navy mb-4">Package Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Package:</span>
                <span className="font-semibold text-navy">{pkg.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Duration:</span>
                <span className="font-semibold text-navy">{pkg.duration} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Departure Date:</span>
                <span className="font-semibold text-navy">{formatDate(confirmation.dateFrom, 'long')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Number of Guests:</span>
                <span className="font-semibold text-navy">{confirmation.guests}</span>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="mb-8">
            <h2 className="text-xl font-serif font-bold text-navy mb-4">Guest Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Name:</span>
                <span className="font-semibold text-navy">
                  {confirmation.guestDetails.firstName} {confirmation.guestDetails.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Email:</span>
                <span className="font-semibold text-navy">{confirmation.guestDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Phone:</span>
                <span className="font-semibold text-navy">{confirmation.guestDetails.phone}</span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-serif font-bold text-navy mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Method:</span>
                <span className="font-semibold text-navy capitalize">{confirmation.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Status:</span>
                <span className="font-semibold text-green-600">✓ Paid</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200">
                <span className="text-lg font-bold text-navy">Total Amount:</span>
                <span className="text-2xl font-bold text-gold">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gold/10 rounded-lg p-6">
            <h3 className="font-bold text-navy mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">✓</span>
                <span>A confirmation email has been sent to {confirmation.guestDetails.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">✓</span>
                <span>Our travel specialist will contact you within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">✓</span>
                <span>You&apos;ll receive a detailed itinerary and travel documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">✓</span>
                <span>Pre-departure briefing will be scheduled 2 weeks before travel</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => window.print()}
            className="btn-outline"
          >
            📄 Print Confirmation
          </button>
          <Link href="/">
            <button className="btn-primary">
              Return to Home
            </button>
          </Link>
        </motion.div>

        {/* Support Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-slate-600"
        >
          <p className="mb-2">Need help? Contact us:</p>
          <p className="font-semibold">
            <a href="mailto:admin@mysticalvacationsea.com" className="text-gold hover:underline">
              📧 admin@mysticalvacationsea.com
            </a>
          </p>
          <p className="font-semibold">
            <a href="tel:+254718097179" className="text-gold hover:underline">
              📞 +254 718 097 179
            </a>
            {' | '}
            <a href="tel:+254735537873" className="text-gold hover:underline">
              +254 735 537 873
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

