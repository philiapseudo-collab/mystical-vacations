'use client';

import { motion } from 'framer-motion';
import type { BookingSession } from '@/types';
import PackageSummary from './PackageSummary';
import AccommodationSummary from './AccommodationSummary';
import ExcursionSummary from './ExcursionSummary';
import TransportSummary from './TransportSummary';

interface BookingSummaryWrapperProps {
  session: BookingSession;
  // Additional data fetched from APIs/mock data
  itemData: {
    package?: {
      title: string;
      subtitle: string;
      duration: number;
      rating: number;
      reviewCount: number;
    };
    accommodation?: {
      name: string;
      location: { city: string; country: string };
      rating: number;
      reviewCount: number;
    };
    excursion?: {
      title: string;
      location: { city: string; country: string };
      duration: number;
      rating: number;
      reviewCount: number;
    };
    transport?: {
      routeName: string;
      operator?: string;
    };
  };
}

export default function BookingSummaryWrapper({
  session,
  itemData,
}: BookingSummaryWrapperProps) {
  const getTitle = () => {
    switch (session.type) {
      case 'accommodation':
        return 'Your Accommodation';
      case 'excursion':
        return 'Your Experience';
      case 'transport':
        return 'Your Transport';
      default:
        return 'Your Package';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-serif font-bold text-navy mb-4">{getTitle()}</h2>
      {session.type === 'package' && itemData.package && (
        <PackageSummary session={session as any} packageData={itemData.package} />
      )}
      {session.type === 'accommodation' && itemData.accommodation && (
        <AccommodationSummary
          session={session as any}
          accommodationData={itemData.accommodation}
        />
      )}
      {session.type === 'excursion' && itemData.excursion && (
        <ExcursionSummary session={session as any} excursionData={itemData.excursion} />
      )}
      {session.type === 'transport' && itemData.transport && (
        <TransportSummary session={session as any} transportData={itemData.transport} />
      )}
    </motion.div>
  );
}

