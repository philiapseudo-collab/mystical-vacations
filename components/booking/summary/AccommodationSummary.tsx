'use client';

import Image from 'next/image';
import type { BookingSession } from '@/types';
import { formatDate } from '@/utils/formatters';

interface AccommodationSummaryProps {
  session: BookingSession & { details: { type: 'accommodation' } & BookingSession['details'] };
  accommodationData: {
    name: string;
    location: { city: string; country: string };
    rating: number;
    reviewCount: number;
  };
}

export default function AccommodationSummary({
  session,
  accommodationData,
}: AccommodationSummaryProps) {
  return (
    <div className="flex gap-4">
      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={session.item.image}
          alt={accommodationData.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-navy mb-2">{accommodationData.name}</h3>
        <p className="text-slate-600 text-sm mb-2">
          {accommodationData.location.city}, {accommodationData.location.country}
        </p>
        {session.details.roomName && (
          <p className="text-slate-600 text-sm mb-2">
            Room: <span className="font-semibold">{session.details.roomName}</span>
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
          <span>⭐ {accommodationData.rating} ({accommodationData.reviewCount})</span>
        </div>
        {session.details.checkIn && session.details.checkOut && (
          <div className="text-slate-600 text-sm space-y-1">
            <p>
              Check-in: <span className="font-semibold">{formatDate(session.details.checkIn, 'short')}</span>
            </p>
            <p>
              Check-out: <span className="font-semibold">{formatDate(session.details.checkOut, 'short')}</span>
            </p>
            <p>
              {session.details.nights} {session.details.nights === 1 ? 'Night' : 'Nights'}
            </p>
          </div>
        )}
        <p className="text-slate-600 text-sm mt-2">
          Guests: <span className="font-semibold">{session.details.guests}</span>
        </p>
      </div>
    </div>
  );
}

