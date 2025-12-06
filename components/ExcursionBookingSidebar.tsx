'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { IExcursion } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { getChildPrice } from '@/utils/excursion-helpers';

interface ExcursionBookingSidebarProps {
  excursion: IExcursion;
}

export default function ExcursionBookingSidebar({ excursion }: ExcursionBookingSidebarProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Calculate prices
  const adultPrice = excursion.price;
  const childPrice = getChildPrice(adultPrice, excursion.childPrice);
  const subtotal = adultPrice * adults + childPrice * children;
  const taxes = subtotal * 0.16; // 16% VAT
  const total = subtotal + taxes;

  // Minimum date is today
  const today = new Date().toISOString().split('T')[0];

  const handleBookExperience = () => {
    if (!selectedDate) {
      alert('Please select a date before booking.');
      return;
    }

    if (adults === 0 && children === 0) {
      alert('Please select at least one guest.');
      return;
    }

    // Save booking details using new BookingSession schema
    const bookingSession = {
      type: 'excursion' as const,
      item: {
        id: excursion.id,
        title: excursion.title,
        image: excursion.images[0]?.url || '',
        price: adultPrice,
      },
      details: {
        type: 'excursion' as const,
        date: selectedDate,
        time: excursion.availableTimes?.[0],
        adults,
        children,
        requirements: excursion.requirements || undefined,
      },
      guests: {
        adults,
        children,
      },
    };

    sessionStorage.setItem('bookingDetails', JSON.stringify(bookingSession));
    router.push('/book/review');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-navy text-white rounded-lg shadow-xl p-6 sticky top-24"
    >
      <h3 className="text-2xl font-serif font-bold text-gold mb-6">Book Experience</h3>

      {/* Date Picker */}
      <div className="mb-6">
        <label htmlFor="excursionDate" className="block text-sm font-semibold text-gold mb-2">
          Select Date *
        </label>
        <input
          type="date"
          id="excursionDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={today}
          className="w-full px-4 py-3 rounded-lg bg-navy-light border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
          style={{
            colorScheme: 'dark',
          }}
          required
        />
        {excursion.availableTimes && excursion.availableTimes.length > 0 && (
          <p className="text-xs text-slate-400 mt-1">
            Available times: {excursion.availableTimes.join(', ')}
          </p>
        )}
      </div>

      {/* Guest Count */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="adults" className="block text-sm font-semibold text-gold mb-2">
            Adults *
          </label>
          <input
            type="number"
            id="adults"
            value={adults}
            onChange={(e) => setAdults(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            max={excursion.maxParticipants}
            className="w-full px-4 py-3 rounded-lg bg-navy-light border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </div>

        <div>
          <label htmlFor="children" className="block text-sm font-semibold text-gold mb-2">
            Children
          </label>
          <input
            type="number"
            id="children"
            value={children}
            onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            max={excursion.maxParticipants}
            className="w-full px-4 py-3 rounded-lg bg-navy-light border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <p className="text-xs text-slate-400 mt-1">(Ages 3-11)</p>
        </div>

        {adults + children > excursion.maxParticipants && (
          <p className="text-xs text-red-400">
            Maximum {excursion.maxParticipants} participants allowed
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      {(adults > 0 || children > 0) && (
        <div className="mb-6 pt-6 border-t border-gold/30">
          <h4 className="text-lg font-semibold text-gold mb-4">Price Breakdown</h4>
          <div className="space-y-2 text-sm">
            {adults > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>
                  Adults ({adults} × {formatPrice(adultPrice)})
                </span>
                <span className="font-semibold">{formatPrice(adultPrice * adults)}</span>
              </div>
            )}
            {children > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>
                  Children ({children} × {formatPrice(childPrice)})
                </span>
                <span className="font-semibold">{formatPrice(childPrice * children)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300">
              <span>Taxes (16% VAT)</span>
              <span className="font-semibold">{formatPrice(taxes)}</span>
            </div>
            <div className="pt-3 border-t border-gold/20 flex justify-between items-center">
              <span className="text-lg font-bold text-gold">Total</span>
              <span className="text-2xl font-bold text-gold">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Book Experience Button */}
      <button
        onClick={handleBookExperience}
        disabled={!selectedDate || (adults === 0 && children === 0) || adults + children > excursion.maxParticipants}
        className="w-full py-4 bg-gold text-navy font-bold rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gold"
      >
        Book Experience
      </button>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gold/20 space-y-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-gold">✓</span>
          <span>Secure payment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gold">✓</span>
          <span>Flexible cancellation</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gold">✓</span>
          <span>Best price guarantee</span>
        </div>
      </div>
    </motion.div>
  );
}

