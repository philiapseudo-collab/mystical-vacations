'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { IAccommodation } from '@/types';
import { formatPrice } from '@/utils/formatters';

interface BookingSidebarProps {
  accommodation: IAccommodation;
  selectedRoomType: string | null;
}

export default function BookingSidebar({
  accommodation,
  selectedRoomType,
}: BookingSidebarProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  // Get selected room details
  const selectedRoom = accommodation.roomTypes.find(
    (room) => room.type === selectedRoomType
  );

  // Calculate nights
  const calculateNights = (): number => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) return 0;
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  // Calculate prices
  const pricePerNight = selectedRoom?.pricePerNight || accommodation.pricePerNight;
  const subtotal = pricePerNight * nights;
  const taxes = subtotal * 0.16; // 16% VAT
  const total = subtotal + taxes;

  // Minimum date is today
  const today = new Date().toISOString().split('T')[0];
  const minCheckOut = checkIn || today;

  const handleRequestToBook = () => {
    if (!selectedRoomType || !checkIn || !checkOut) {
      alert('Please select a room and dates before booking.');
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    const selectedRoom = accommodation.roomTypes.find((r) => r.type === selectedRoomType);
    if (!selectedRoom) return;

    // Save booking details using new BookingSession schema
    const bookingSession = {
      type: 'accommodation' as const,
      item: {
        id: accommodation.id,
        title: accommodation.name,
        image: accommodation.images[0]?.url || '',
        price: selectedRoom.pricePerNight,
      },
      details: {
        type: 'accommodation' as const,
        checkIn,
        checkOut,
        nights,
        roomId: selectedRoomType,
        roomName: selectedRoomType,
        guests,
      },
      guests: {
        adults: guests,
        children: 0,
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
      <h3 className="text-2xl font-serif font-bold text-gold mb-6">Request to Book</h3>

      {/* Date Range Picker */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="checkIn" className="block text-sm font-semibold text-gold mb-2">
            Check-in Date
          </label>
          <input
            type="date"
            id="checkIn"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={today}
            className="w-full px-4 py-3 rounded-lg bg-navy-light border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
            style={{
              colorScheme: 'dark',
            }}
          />
          {accommodation.checkInTime && (
            <p className="text-xs text-slate-400 mt-1">Check-in: {accommodation.checkInTime}</p>
          )}
        </div>

        <div>
          <label htmlFor="checkOut" className="block text-sm font-semibold text-gold mb-2">
            Check-out Date
          </label>
          <input
            type="date"
            id="checkOut"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={minCheckOut}
            className="w-full px-4 py-3 rounded-lg bg-navy-light border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
            style={{
              colorScheme: 'dark',
            }}
          />
          {accommodation.checkOutTime && (
            <p className="text-xs text-slate-400 mt-1">Check-out: {accommodation.checkOutTime}</p>
          )}
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-semibold text-gold mb-2">
            Number of Guests
          </label>
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max={selectedRoom?.capacity || 10}
            className="w-full px-4 py-3 rounded-lg bg-navy-light border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
          />
          {selectedRoom && (
            <p className="text-xs text-slate-400 mt-1">
              Max capacity: {selectedRoom.capacity} {selectedRoom.capacity === 1 ? 'guest' : 'guests'}
            </p>
          )}
        </div>
      </div>

      {/* Selected Room Info */}
      {selectedRoom ? (
        <div className="mb-6 p-4 bg-navy-light rounded-lg border border-gold/20">
          <p className="text-sm text-slate-300 mb-1">Selected Room</p>
          <p className="font-semibold text-gold">{selectedRoom.type}</p>
          {selectedRoom.bedType && (
            <p className="text-xs text-slate-400 mt-1">Bed: {selectedRoom.bedType}</p>
          )}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-navy-light rounded-lg border border-gold/20">
          <p className="text-sm text-slate-400">Please select a room to continue</p>
        </div>
      )}

      {/* Price Breakdown */}
      {nights > 0 && selectedRoom && (
        <div className="mb-6 pt-6 border-t border-gold/30">
          <h4 className="text-lg font-semibold text-gold mb-4">Price Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>
                {formatPrice(pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}
              </span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
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

      {/* Request to Book Button */}
      <button
        onClick={handleRequestToBook}
        disabled={!selectedRoomType || !checkIn || !checkOut || nights === 0}
        className="w-full py-4 bg-gold text-navy font-bold rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gold"
      >
        Request to Book
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

