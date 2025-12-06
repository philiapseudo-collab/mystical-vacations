'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { formatPrice, formatDuration, formatTime } from '@/utils/formatters';
import { getAmenityIcon } from '@/utils/icon-mapper';
import { calculateBestValue } from '@/utils/transport-helpers';
import type { ITransportRoute, ITransportSegment } from '@/types';
import { CheckCircle } from 'lucide-react';

interface TransportComparisonViewProps {
  flight: ITransportRoute;
  sgrEconomy?: ITransportRoute;
  sgrFirstClass?: ITransportRoute;
  origin: string;
  destination: string;
}

/**
 * TransportComparisonView - Smart comparison component for Flight vs SGR
 */
export default function TransportComparisonView({
  flight,
  sgrEconomy,
  sgrFirstClass,
  origin,
  destination,
}: TransportComparisonViewProps) {
  const router = useRouter();
  const [selectedSGRClass, setSelectedSGRClass] = useState<'Economy' | 'First Class'>(
    sgrFirstClass ? 'First Class' : 'Economy'
  );

  // Get the selected SGR route (with fallback)
  const selectedSGR =
    selectedSGRClass === 'First Class' && sgrFirstClass
      ? sgrFirstClass
      : sgrEconomy || sgrFirstClass;
  if (!selectedSGR) return null;

  // Calculate best value badges
  const bestValue = calculateBestValue(flight, sgrEconomy, sgrFirstClass);

  // Calculate max duration for relative bar scaling
  const maxDuration = Math.max(flight.totalDuration, selectedSGR.totalDuration);

  // Get first segment for each route (for display)
  const flightSegment = flight.segments[0];
  const sgrSegment = selectedSGR.segments[0];

  // Handle booking selection
  const handleSelectRoute = (route: ITransportRoute, selectedClass?: 'Economy' | 'First Class') => {
    const firstSegment = route.segments[0];
    const selectedClassType = selectedClass || firstSegment.class;
    
    // Find the segment with the selected class (for SGR routes with multiple classes)
    const segmentForClass = route.segments.find((s) => s.class === selectedClassType) || firstSegment;
    
    // Save booking details using new BookingSession schema
    const bookingSession = {
      type: 'transport' as const,
      item: {
        id: route.id,
        title: route.name,
        image: '/images/transport-placeholder.jpg', // Placeholder - should be from route data if available
        price: segmentForClass.price,
      },
      details: {
        type: 'transport' as const,
        date: new Date().toISOString().split('T')[0], // Default to today, user will select in review
        time: firstSegment.departureTime,
        origin: `${firstSegment.departureLocation.city}, ${firstSegment.departureLocation.country}`,
        destination: `${firstSegment.arrivalLocation.city}, ${firstSegment.arrivalLocation.country}`,
        class: selectedClassType as 'Economy' | 'First Class',
        passengers: 1, // Default, user will update in review
        routeId: route.id,
      },
      guests: {
        adults: 1,
        children: 0,
      },
    };

    sessionStorage.setItem('bookingDetails', JSON.stringify(bookingSession));
    router.push('/book/review');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Route Header */}
      <div className="mb-4">
        <h3 className="text-2xl font-serif font-bold text-navy">
          {origin} → {destination}
        </h3>
        <p className="text-sm text-slate-600 mt-1">Compare your transport options</p>
      </div>

      {/* Comparison Cards - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flight Card */}
        <TransportCard
          route={flight}
          segment={flightSegment}
          mode="Flight"
          duration={flight.totalDuration}
          maxDuration={maxDuration}
          bestValueBadge={bestValue.flight}
          onSelect={() => handleSelectRoute(flight)}
        />

        {/* SGR Card */}
        <TransportCard
          route={selectedSGR}
          segment={sgrSegment}
          mode="SGR"
          duration={selectedSGR.totalDuration}
          maxDuration={maxDuration}
          bestValueBadge={bestValue.sgr}
          sgrEconomy={sgrEconomy}
          sgrFirstClass={sgrFirstClass}
          selectedClass={selectedSGRClass}
          onClassChange={setSelectedSGRClass}
          onSelect={() => handleSelectRoute(selectedSGR, selectedSGRClass)}
        />
      </div>
    </motion.div>
  );
}

/**
 * Individual transport card component
 */
interface TransportCardProps {
  route: ITransportRoute;
  segment: ITransportSegment;
  mode: 'Flight' | 'SGR';
  duration: number;
  maxDuration: number;
  bestValueBadge?: 'fastest' | 'cheapest' | 'best-value';
  sgrEconomy?: ITransportRoute;
  sgrFirstClass?: ITransportRoute;
  selectedClass?: 'Economy' | 'First Class';
  onClassChange?: (classType: 'Economy' | 'First Class') => void;
  onSelect: () => void;
}

function TransportCard({
  route,
  segment,
  mode,
  duration,
  maxDuration,
  bestValueBadge,
  sgrEconomy,
  sgrFirstClass,
  selectedClass,
  onClassChange,
  onSelect,
}: TransportCardProps) {
  const durationPercentage = (duration / maxDuration) * 100;

  // Badge label
  const badgeLabel =
    bestValueBadge === 'fastest'
      ? 'Fastest'
      : bestValueBadge === 'cheapest'
      ? 'Cheapest'
      : bestValueBadge === 'best-value'
      ? 'Best Value'
      : null;

  return (
    <div className="card p-6 relative">
      {/* Best Value Badge */}
      {badgeLabel && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {badgeLabel}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="text-xl font-bold text-navy">{mode}</h4>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              mode === 'Flight'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {segment.operator}
          </span>
        </div>
        <p className="text-sm text-slate-600">
          {segment.departureLocation.city} → {segment.arrivalLocation.city}
        </p>
      </div>

      {/* SGR Class Toggle (only for SGR cards) */}
      {mode === 'SGR' && sgrEconomy && sgrFirstClass && onClassChange && (
        <div className="mb-4">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => onClassChange('Economy')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                selectedClass === 'Economy'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              Economy
            </button>
            <button
              onClick={() => onClassChange('First Class')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                selectedClass === 'First Class'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-slate-600 hover:text-navy'
              }`}
            >
              First Class
            </button>
          </div>
        </div>
      )}

      {/* Duration Bar */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-semibold text-navy">Duration</span>
          <span className="text-sm text-slate-600">{formatDuration(duration)}</span>
        </div>
        <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${durationPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              mode === 'Flight' ? 'bg-blue-500' : 'bg-green-500'
            }`}
          />
        </div>
      </div>

      {/* Schedule */}
      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-slate-600">Departure</p>
            <p className="font-semibold text-navy">{formatTime(segment.departureTime)}</p>
          </div>
          <div className="text-slate-400">→</div>
          <div className="text-right">
            <p className="text-slate-600">Arrival</p>
            <p className="font-semibold text-navy">{formatTime(segment.arrivalTime)}</p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-navy mb-2">Amenities</p>
        <div className="space-y-2">
          {segment.amenities.slice(0, 5).map((amenity, index) => {
            const Icon = getAmenityIcon(amenity);
            return (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                <Icon className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{amenity}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price & Select Button */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Total Price</p>
            <p className="text-3xl font-bold text-gold">{formatPrice(route.totalPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Available Seats</p>
            <p className="text-sm font-semibold text-navy">{segment.availableSeats}</p>
          </div>
        </div>
        <button onClick={onSelect} className="btn-primary w-full">
          Select for Booking
        </button>
      </div>
    </div>
  );
}

