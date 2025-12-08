'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PriceBreakdownWidget from '@/components/PriceBreakdownWidget';
import BookingSummaryWrapper from '@/components/booking/summary/BookingSummaryWrapper';
import { packages } from '@/data/packages';
import { accommodations } from '@/data/accommodation';
import { excursions } from '@/data/excursions';
import { transportRoutes } from '@/data/transport';
import { parseBookingSession, calculateBookingPrice } from '@/utils/booking-helpers';
import { getChildPrice } from '@/utils/excursion-helpers';
import { generateBookingReference } from '@/utils/formatters';
import type { BookingSession } from '@/types';
import type { IPackage, IAccommodation, IExcursion, ITransportRoute } from '@/types';

function BookReviewContent() {
  const router = useRouter();
  const [session, setSession] = useState<BookingSession | null>(null);
  const [itemData, setItemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [specialRequests, setSpecialRequests] = useState('');

  // Form state - varies by booking type
  const [packageDate, setPackageDate] = useState('');
  const [packageGuests, setPackageGuests] = useState(2);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [accommodationGuests, setAccommodationGuests] = useState(2);
  const [excursionDate, setExcursionDate] = useState('');
  const [excursionTime, setExcursionTime] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [transportDate, setTransportDate] = useState('');
  const [transportPassengers, setTransportPassengers] = useState(1);

  // Load and validate booking session
  useEffect(() => {
    // Check for package booking from URL params (legacy support)
    // Use typeof window check for SSR safety
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('package');
    const guests = urlParams.get('guests');
    const dateFrom = urlParams.get('dateFrom');

    // If URL params exist, create a package booking session
    if (packageId) {
      const pkg = packages.find((p) => p.id === packageId);
      if (pkg) {
        // Extract base price from price breakdown (per person)
        const basePrice = pkg.price.basePrice || pkg.price.total / (pkg.price.taxes ? 1.16 : 1) || 0;
        const packageSession: BookingSession = {
          type: 'package',
          item: {
            id: pkg.id,
            title: pkg.title,
            image: pkg.images[0]?.url || '',
            price: basePrice,
          },
          details: {
            type: 'package',
            date: dateFrom || new Date().toISOString().split('T')[0],
            guests: guests ? parseInt(guests) : 2,
          },
          guests: {
            adults: guests ? parseInt(guests) : 2,
            children: 0,
          },
        };
        sessionStorage.setItem('bookingDetails', JSON.stringify(packageSession));
        // Clean URL
        router.replace('/book/review', { scroll: false });
        // Continue with normal flow below
      } else {
        sessionStorage.clear();
        router.push('/');
        return;
      }
    }

    const stored = sessionStorage.getItem('bookingDetails');
    if (!stored) {
      // No booking data - redirect to home
      sessionStorage.clear();
      router.push('/');
      return;
    }

    const parsed = parseBookingSession(stored);
    if (!parsed) {
      // Invalid or old format - clear and redirect
      sessionStorage.clear();
      router.push('/');
      // TODO: Show toast notification "Your booking session has expired. Please select your trip again."
      return;
    }

    setSession(parsed);

    // Fetch item data based on type
    let data: any = {};
    let formDefaults: any = {};

    switch (parsed.type) {
      case 'package': {
        const pkg = packages.find((p) => p.id === parsed.item.id);
        if (!pkg) {
          sessionStorage.clear();
          router.push('/');
          return;
        }
        data.package = {
          title: pkg.title,
          subtitle: pkg.subtitle,
          duration: pkg.duration,
          rating: pkg.rating,
          reviewCount: pkg.reviewCount,
        };
        if (parsed.details.type === 'package') {
          formDefaults = {
            date: parsed.details.date,
            guests: parsed.details.guests,
          };
        }
        break;
      }

      case 'accommodation': {
        const acc = accommodations.find((a) => a.id === parsed.item.id);
        if (!acc) {
          sessionStorage.clear();
          router.push('/');
          return;
        }
        data.accommodation = {
          name: acc.name,
          location: acc.location,
          rating: acc.rating,
          reviewCount: acc.reviewCount,
        };
        if (parsed.details.type === 'accommodation') {
          formDefaults = {
            checkIn: parsed.details.checkIn,
            checkOut: parsed.details.checkOut,
            guests: parsed.details.guests,
          };
        }
        break;
      }

      case 'excursion': {
        const exc = excursions.find((e) => e.id === parsed.item.id);
        if (!exc) {
          sessionStorage.clear();
          router.push('/');
          return;
        }
        data.excursion = {
          title: exc.title,
          location: exc.location,
          duration: exc.duration,
          rating: exc.rating,
          reviewCount: exc.reviewCount,
        };
        if (parsed.details.type === 'excursion') {
          formDefaults = {
            date: parsed.details.date,
            time: parsed.details.time,
            adults: parsed.details.adults,
            children: parsed.details.children,
          };
        }
        break;
      }

      case 'transport': {
        const route = transportRoutes.find((r) => r.id === parsed.item.id);
        if (!route) {
          sessionStorage.clear();
          router.push('/');
          return;
        }
        data.transport = {
          routeName: route.name,
          operator: route.segments[0]?.operator,
        };
        if (parsed.details.type === 'transport') {
          formDefaults = {
            date: parsed.details.date,
            passengers: parsed.details.passengers,
          };
        }
        break;
      }
    }

    setItemData(data);

    // Set form defaults
    if (formDefaults.date) {
      if (parsed.type === 'package') setPackageDate(formDefaults.date);
      if (parsed.type === 'excursion') setExcursionDate(formDefaults.date);
      if (parsed.type === 'transport') setTransportDate(formDefaults.date);
    }
    if (formDefaults.checkIn) setCheckIn(formDefaults.checkIn);
    if (formDefaults.checkOut) setCheckOut(formDefaults.checkOut);
    if (formDefaults.guests) {
      if (parsed.type === 'package') setPackageGuests(formDefaults.guests);
      if (parsed.type === 'accommodation') setAccommodationGuests(formDefaults.guests);
    }
    if (formDefaults.adults !== undefined) setAdults(formDefaults.adults);
    if (formDefaults.children !== undefined) setChildren(formDefaults.children);
    if (formDefaults.time) setExcursionTime(formDefaults.time);
    if (formDefaults.passengers) setTransportPassengers(formDefaults.passengers);

    setLoading(false);
  }, [router]);

  if (loading || !session || !itemData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update session with form data - use proper type narrowing
    let updatedSession: BookingSession;
    
    if (session.type === 'package') {
      updatedSession = {
        ...session,
        details: {
          type: 'package',
          date: packageDate,
          guests: packageGuests,
        },
        guests: {
          adults: packageGuests,
          children: 0,
        },
      };
    } else if (session.type === 'accommodation') {
      updatedSession = {
        ...session,
        details: {
          type: 'accommodation',
          checkIn,
          checkOut,
          nights: Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
          ),
          roomId: session.details.type === 'accommodation' ? session.details.roomId : '',
          roomName: session.details.type === 'accommodation' ? session.details.roomName : '',
          guests: accommodationGuests,
        },
        guests: {
          adults: accommodationGuests,
          children: 0,
        },
      };
    } else if (session.type === 'excursion') {
      updatedSession = {
        ...session,
        details: {
          type: 'excursion',
          date: excursionDate,
          time: excursionTime || undefined,
          adults,
          children,
          requirements: session.details.type === 'excursion' ? session.details.requirements : undefined,
        },
        guests: {
          adults,
          children,
        },
      };
    } else {
      // transport
      updatedSession = {
        ...session,
        details: {
          type: 'transport',
          date: transportDate,
          time: session.details.type === 'transport' ? session.details.time : '',
          origin: session.details.type === 'transport' ? session.details.origin : '',
          destination: session.details.type === 'transport' ? session.details.destination : '',
          class: session.details.type === 'transport' ? session.details.class : 'Economy',
          passengers: transportPassengers,
          routeId: session.details.type === 'transport' ? session.details.routeId : '',
        },
        guests: {
          adults: transportPassengers,
          children: 0,
        },
      };
    }

    sessionStorage.setItem('bookingDetails', JSON.stringify(updatedSession));

    // Calculate price breakdown
    const priceBreakdown = getPriceBreakdown();
    if (!priceBreakdown) {
      alert('Please complete all required fields to proceed.');
      return;
    }

    // Build booking items array
    const bookingItems = [{
      type: session.type,
      itemId: session.item.id,
      itemName: session.item.title,
      quantity: session.type === 'package' 
        ? (session.details.type === 'package' ? session.details.guests : 1)
        : session.type === 'accommodation'
        ? 1
        : session.type === 'excursion'
        ? (session.details.type === 'excursion' ? session.details.adults + session.details.children : 1)
        : (session.details.type === 'transport' ? session.details.passengers : 1),
      pricePerUnit: session.item.price,
      subtotal: priceBreakdown.basePrice,
      dateFrom: session.type === 'package' 
        ? (session.details.type === 'package' ? session.details.date : undefined)
        : session.type === 'accommodation'
        ? (session.details.type === 'accommodation' ? session.details.checkIn : undefined)
        : session.type === 'excursion'
        ? (session.details.type === 'excursion' ? session.details.date : undefined)
        : (session.details.type === 'transport' ? session.details.date : undefined),
      dateTo: session.type === 'accommodation' && session.details.type === 'accommodation'
        ? session.details.checkOut
        : undefined,
      specialRequests: specialRequests || undefined,
    }];

    // Create guest details placeholder (will be filled on payment page)
    const guestDetails = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationality: '',
      specialRequests: specialRequests || undefined,
    };

    try {
      // Generate booking reference
      const bookingReference = generateBookingReference();

      // Create booking in database
      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingReference,
          items: bookingItems,
          guestDetails,
          priceBreakdown,
        }),
      });

      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error?.message || 'Failed to create booking');
      }

      // Navigate to payment with booking reference
      router.push(`/book/payment?bookingReference=${encodeURIComponent(bookingReference)}`);
    } catch (error) {
      console.error('Booking creation error:', error);
      alert(error instanceof Error ? error.message : 'Failed to create booking. Please try again.');
    }
  };

  // Calculate price breakdown - for excursions, we need to fetch child price from excursion data
  // Use current form state for real-time price updates
  const getPriceBreakdown = () => {
    if (session.type === 'excursion') {
      const exc = excursions.find((e) => e.id === session.item.id);
      if (exc) {
        // Use current form state (adults, children) for real-time calculation
        // Fallback to session details if form hasn't been updated
        const currentAdults = adults || (session.details.type === 'excursion' ? session.details.adults : session.guests.adults);
        const currentChildren = children || (session.details.type === 'excursion' ? session.details.children : session.guests.children);
        
        // Require at least one guest and a date
        if ((currentAdults === 0 && currentChildren === 0) || !excursionDate) return null;
        
        // Use the excursion's childPrice if available
        const childPriceValue = getChildPrice(exc.price, exc.childPrice);
        const subtotal = exc.price * currentAdults + childPriceValue * currentChildren;
        const taxes = subtotal * 0.16;
        return {
          basePrice: subtotal,
          serviceFee: 0,
          taxes,
          total: subtotal + taxes,
          currency: 'USD' as const,
        };
      }
    } else if (session.type === 'accommodation') {
      // For accommodation, require check-in and check-out dates
      if (!checkIn || !checkOut) return null;
      // Recalculate with current form state
      const nights = Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (nights <= 0) return null;
      return calculateBookingPrice({
        ...session,
        details: {
          ...session.details,
          type: 'accommodation',
          nights,
        } as any,
      });
    } else if (session.type === 'package') {
      // For packages, require date
      if (!packageDate) return null;
      return calculateBookingPrice(session);
    } else if (session.type === 'transport') {
      // For transport, require date
      if (!transportDate) return null;
      return calculateBookingPrice({
        ...session,
        details: {
          ...session.details,
          type: 'transport',
          passengers: transportPassengers,
        } as any,
      });
    }
    return calculateBookingPrice(session);
  };

  const priceBreakdown = getPriceBreakdown();

  // Get back link
  const getBackLink = () => {
    switch (session.type) {
      case 'package':
        return `/packages/${packages.find((p) => p.id === session.item.id)?.slug || ''}`;
      case 'accommodation':
        return `/accommodation/${accommodations.find((a) => a.id === session.item.id)?.slug || ''}`;
      case 'excursion':
        return `/excursions/${excursions.find((e) => e.id === session.item.id)?.slug || ''}`;
      case 'transport':
        return '/transport';
      default:
        return '/';
    }
  };

  // Get breadcrumb label
  const getBreadcrumbLabel = () => {
    switch (session.type) {
      case 'accommodation':
        return 'Accommodation';
      case 'excursion':
        return 'Excursions';
      case 'transport':
        return 'Transport';
      default:
        return 'Packages';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href={getBackLink()} className="text-slate-600 hover:text-gold">
              {getBreadcrumbLabel()}
            </Link>
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
            {/* Booking Summary */}
            <BookingSummaryWrapper session={session} itemData={itemData} />

            {/* Booking Details Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-serif font-bold text-navy mb-6">Booking Details</h2>
              <form onSubmit={handleContinue} className="space-y-6">
                {/* Package Form */}
                {session.type === 'package' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="packageDate" className="block text-sm font-semibold text-navy mb-2">
                        Departure Date *
                      </label>
                      <input
                        type="date"
                        id="packageDate"
                        value={packageDate}
                        onChange={(e) => setPackageDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="packageGuests" className="block text-sm font-semibold text-navy mb-2">
                        Number of Guests *
                      </label>
                      <input
                        type="number"
                        id="packageGuests"
                        value={packageGuests}
                        onChange={(e) => setPackageGuests(parseInt(e.target.value))}
                        min="1"
                        max={packages.find((p) => p.id === session.item.id)?.maxGroupSize || 20}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Accommodation Form */}
                {session.type === 'accommodation' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="checkIn" className="block text-sm font-semibold text-navy mb-2">
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        id="checkIn"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="checkOut" className="block text-sm font-semibold text-navy mb-2">
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        id="checkOut"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="accommodationGuests" className="block text-sm font-semibold text-navy mb-2">
                        Number of Guests *
                      </label>
                      <input
                        type="number"
                        id="accommodationGuests"
                        value={accommodationGuests}
                        onChange={(e) => setAccommodationGuests(parseInt(e.target.value))}
                        min="1"
                        max={
                          accommodations
                            .find((a) => a.id === session.item.id)
                            ?.roomTypes.find((r) => r.type === (session.details as any).roomName)?.capacity || 10
                        }
                        className="input"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Excursion Form */}
                {session.type === 'excursion' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="excursionDate" className="block text-sm font-semibold text-navy mb-2">
                        Select Date *
                      </label>
                      <input
                        type="date"
                        id="excursionDate"
                        value={excursionDate}
                        onChange={(e) => setExcursionDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="excursionTime" className="block text-sm font-semibold text-navy mb-2">
                        Select Time (Optional)
                      </label>
                      <select
                        id="excursionTime"
                        value={excursionTime}
                        onChange={(e) => setExcursionTime(e.target.value)}
                        className="input"
                      >
                        <option value="">Select time</option>
                        {excursions
                          .find((e) => e.id === session.item.id)
                          ?.availableTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="adults" className="block text-sm font-semibold text-navy mb-2">
                        Adults *
                      </label>
                      <input
                        type="number"
                        id="adults"
                        value={adults}
                        onChange={(e) => setAdults(Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        max={excursions.find((e) => e.id === session.item.id)?.maxParticipants || 20}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="children" className="block text-sm font-semibold text-navy mb-2">
                        Children
                      </label>
                      <input
                        type="number"
                        id="children"
                        value={children}
                        onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        max={excursions.find((e) => e.id === session.item.id)?.maxParticipants || 20}
                        className="input"
                      />
                      <p className="text-xs text-slate-500 mt-1">(Ages 3-11)</p>
                    </div>
                  </div>
                )}

                {/* Transport Form */}
                {session.type === 'transport' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="transportDate" className="block text-sm font-semibold text-navy mb-2">
                        Departure Date *
                      </label>
                      <input
                        type="date"
                        id="transportDate"
                        value={transportDate}
                        onChange={(e) => setTransportDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="transportPassengers" className="block text-sm font-semibold text-navy mb-2">
                        Number of Passengers *
                      </label>
                      <input
                        type="number"
                        id="transportPassengers"
                        value={transportPassengers}
                        onChange={(e) => setTransportPassengers(parseInt(e.target.value))}
                        min="1"
                        max={20}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Special Requests (Global) */}
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
                  <Link href={getBackLink()} className="flex-1">
                    <button type="button" className="btn-outline w-full">
                      ← Back
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
            {priceBreakdown ? (
              <PriceBreakdownWidget
                priceBreakdown={priceBreakdown}
                itemCount={1}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-slate-600">
                  Please complete the booking details to see pricing
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      }
    >
      <BookReviewContent />
    </Suspense>
  );
}
