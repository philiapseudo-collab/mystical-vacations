'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { packages } from '@/data/packages';
import { accommodations } from '@/data/accommodation';
import { excursions } from '@/data/excursions';
import { formatPrice, formatDate } from '@/utils/formatters';
import type { IBooking, IBookingItem } from '@/types';

function BookConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);

  useEffect(() => {
    const bookingRef = searchParams?.get('ref');

    if (!bookingRef) {
      router.push('/packages');
      return;
    }

    // Fetch booking status from API
    async function fetchBookingStatus() {
      try {
        const response = await fetch(`/api/booking/${encodeURIComponent(bookingRef)}`);
        const data = await response.json();

        if (data.success && data.data) {
          const fetchedBooking = data.data as IBooking;
          setBooking(fetchedBooking);
          setCreatedAt(new Date(fetchedBooking.createdAt));
          
          // Poll for status updates if payment is pending
          if (fetchedBooking.paymentStatus === 'pending') {
            let pollCount = 0;
            const maxPolls = 10; // Poll for 20 seconds (10 * 2s)
            
            const pollInterval = setInterval(async () => {
              pollCount++;
              
              try {
                const pollResponse = await fetch(`/api/booking/${encodeURIComponent(bookingRef)}`);
                const pollData = await pollResponse.json();
                
                if (pollData.success && pollData.data) {
                  const updatedBooking = pollData.data as IBooking;
                  setBooking(updatedBooking);
                  
                  // Stop polling if payment is completed or failed
                  if (updatedBooking.paymentStatus === 'paid' || updatedBooking.paymentStatus === 'failed') {
                    clearInterval(pollInterval);
                  }
                }
              } catch (err) {
                console.error('Polling error:', err);
              }
              
              if (pollCount >= maxPolls) {
                clearInterval(pollInterval);
              }
            }, 2000);
            
            return () => clearInterval(pollInterval);
          }
        } else {
          // Booking not found
          router.push('/my-booking');
        }
      } catch (error) {
        console.error('Failed to fetch booking:', error);
        router.push('/my-booking');
      } finally {
        setLoading(false);
      }
    }

    fetchBookingStatus();
  }, [router, searchParams]);

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

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Booking not found</p>
          <Link href="/my-booking">
            <button className="btn-primary">Find My Booking</button>
          </Link>
        </div>
      </div>
    );
  }

  // Determine status banner
  const getStatusBanner = () => {
    if (booking.paymentStatus === 'paid' && booking.status === 'confirmed') {
      return {
        bg: 'bg-green-500',
        text: 'Booking Confirmed',
        icon: '✓',
      };
    } else if (booking.paymentStatus === 'pending') {
      return {
        bg: 'bg-yellow-500',
        text: 'Payment Processing - Please Wait',
        icon: '⏳',
      };
    } else if (booking.paymentStatus === 'failed' || booking.status === 'cancelled') {
      return {
        bg: 'bg-red-500',
        text: 'Payment Failed',
        icon: '✗',
      };
    } else {
      return {
        bg: 'bg-slate-500',
        text: 'Booking Status: ' + booking.status,
        icon: 'ℹ',
      };
    }
  };

  const statusBanner = getStatusBanner();
  
  // Check if retry payment should be shown
  const shouldShowRetryPayment = () => {
    if (booking.paymentStatus === 'failed') return true;
    if (booking.paymentStatus === 'pending' && createdAt) {
      // Show retry if pending for more than 5 minutes
      const minutesPending = (Date.now() - createdAt.getTime()) / (1000 * 60);
      return minutesPending > 5;
    }
    return false;
  };

  // Helper to get item details
  const getItemDetails = (item: IBookingItem) => {
    if (item.type === 'package') {
      return packages.find((p) => p.id === item.itemId);
    } else if (item.type === 'accommodation') {
      return accommodations.find((a) => a.id === item.itemId);
    } else if (item.type === 'excursion') {
      return excursions.find((e) => e.id === item.itemId);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${statusBanner.bg} text-white rounded-lg shadow-lg p-6 mb-8 text-center`}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">{statusBanner.icon}</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold">{statusBanner.text}</h2>
          </div>
        </motion.div>

        {/* Digital Ticket Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-xl p-8 mb-6 border-2 border-gold"
        >
          <div className="text-center mb-6 pb-6 border-b-2 border-gold">
            <h3 className="text-sm text-slate-600 mb-2 uppercase tracking-wide">Digital Ticket</h3>
            <p className="text-3xl font-bold text-navy font-mono">{booking.bookingReference}</p>
            {createdAt && (
              <p className="text-sm text-slate-500 mt-2">
                Booked on {formatDate(createdAt.toISOString(), 'long')}
              </p>
            )}
          </div>

          {/* All Booking Items */}
          <div className="space-y-6 mb-6">
            <h4 className="text-xl font-serif font-bold text-navy mb-4">Booking Items</h4>
            {booking.items.map((item, index) => {
              const itemDetails = getItemDetails(item);
              return (
                <div
                  key={index}
                  className="bg-slate-50 rounded-lg p-6 border border-slate-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-gold text-navy text-xs font-semibold rounded-full uppercase">
                          {item.type}
                        </span>
                        <h5 className="text-lg font-bold text-navy">
                          {item.itemName || itemDetails?.title || itemDetails?.name || 'Unknown Item'}
                        </h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                        <div>
                          <span className="font-semibold">Quantity:</span> {item.quantity}
                        </div>
                        {item.dateFrom && (
                          <div>
                            <span className="font-semibold">From:</span> {formatDate(item.dateFrom, 'long')}
                          </div>
                        )}
                        {item.dateTo && (
                          <div>
                            <span className="font-semibold">To:</span> {formatDate(item.dateTo, 'long')}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold">Price per unit:</span> {formatPrice(item.pricePerUnit)}
                        </div>
                        <div>
                          <span className="font-semibold">Subtotal:</span> {formatPrice(item.subtotal)}
                        </div>
                      </div>
                      {item.specialRequests && (
                        <div className="mt-2 text-sm text-slate-600">
                          <span className="font-semibold">Special Requests:</span> {item.specialRequests}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guest Information */}
          {booking.guestDetails && (
            <div className="mb-6 pb-6 border-b border-slate-200">
              <h4 className="text-xl font-serif font-bold text-navy mb-4">Guest Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600">Name:</span>
                  <span className="font-semibold text-navy ml-2">
                    {booking.guestDetails.firstName} {booking.guestDetails.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Email:</span>
                  <span className="font-semibold text-navy ml-2">{booking.guestDetails.email}</span>
                </div>
                <div>
                  <span className="text-slate-600">Phone:</span>
                  <span className="font-semibold text-navy ml-2">{booking.guestDetails.phone}</span>
                </div>
                {booking.guestDetails.nationality && (
                  <div>
                    <span className="text-slate-600">Nationality:</span>
                    <span className="font-semibold text-navy ml-2">{booking.guestDetails.nationality}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div>
            <h4 className="text-xl font-serif font-bold text-navy mb-4">Price Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Base Price:</span>
                <span className="font-semibold text-navy">
                  {formatPrice(booking.priceBreakdown.basePrice)}
                </span>
              </div>
              {booking.priceBreakdown.serviceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Service Fee:</span>
                  <span className="font-semibold text-navy">
                    {formatPrice(booking.priceBreakdown.serviceFee)}
                  </span>
                </div>
              )}
              {booking.priceBreakdown.taxes > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Taxes:</span>
                  <span className="font-semibold text-navy">
                    {formatPrice(booking.priceBreakdown.taxes)}
                  </span>
                </div>
              )}
              {booking.priceBreakdown.discount && booking.priceBreakdown.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span className="font-semibold">-{formatPrice(booking.priceBreakdown.discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t-2 border-gold mt-3">
                <span className="text-lg font-bold text-navy">Total Amount:</span>
                <span className="text-2xl font-bold text-gold">
                  {formatPrice(booking.priceBreakdown.total)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <button
            onClick={() => window.print()}
            className="btn-outline"
          >
            📄 Print Itinerary
          </button>
          {shouldShowRetryPayment() && (
            <Link href={`/book/payment?bookingReference=${encodeURIComponent(booking.bookingReference)}`}>
              <button className="btn-primary">
                🔄 Retry Payment
              </button>
            </Link>
          )}
          <Link href="/">
            <button className="btn-secondary">
              Return to Home
            </button>
          </Link>
        </motion.div>

        {/* Support Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-slate-600"
        >
          <p className="mb-2">Need help? Contact us:</p>
          <p className="font-semibold">
            <a href="mailto:admin@mysticalvacationsea.com" className="text-gold hover:underline">
              📧 admin@mysticalvacationsea.com
            </a>
          </p>
          <p className="font-semibold">
            <a href="mailto:reservations@mysticalvacationsea.com" className="text-gold hover:underline">
              📧 reservations@mysticalvacationsea.com
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

export default function BookConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <BookConfirmContent />
    </Suspense>
  );
}
