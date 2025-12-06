'use client';

import Image from 'next/image';
import type { BookingSession } from '@/types';
import { formatDate } from '@/utils/formatters';

interface ExcursionSummaryProps {
  session: BookingSession & { details: { type: 'excursion' } & BookingSession['details'] };
  excursionData: {
    title: string;
    location: { city: string; country: string };
    duration: number;
    rating: number;
    reviewCount: number;
  };
}

export default function ExcursionSummary({ session, excursionData }: ExcursionSummaryProps) {
  const requirements = session.details.requirements || [];
  const requirementsDisplay =
    requirements.length > 0
      ? requirements.slice(0, 3).join(', ') + (requirements.length > 3 ? '...' : '')
      : null;

  return (
    <div className="flex gap-4">
      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={session.item.image}
          alt={excursionData.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-navy mb-2">{excursionData.title}</h3>
        <p className="text-slate-600 text-sm mb-2">
          {excursionData.location.city}, {excursionData.location.country}
        </p>
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
          <span>⏱️ {excursionData.duration} Hours</span>
          <span>⭐ {excursionData.rating} ({excursionData.reviewCount})</span>
        </div>
        {session.details.date && (
          <p className="text-slate-600 text-sm">
            Date: <span className="font-semibold">{formatDate(session.details.date, 'long')}</span>
            {session.details.time && (
              <span className="ml-2">at {session.details.time}</span>
            )}
          </p>
        )}
        <div className="text-slate-600 text-sm mt-2">
          <p>
            {session.details.adults} {session.details.adults === 1 ? 'Adult' : 'Adults'}
            {session.details.children > 0 && (
              <span>, {session.details.children} {session.details.children === 1 ? 'Child' : 'Children'}</span>
            )}
          </p>
        </div>
        {requirementsDisplay && (
          <div className="mt-3 p-2 bg-gold/10 border border-gold/30 rounded text-xs text-slate-700">
            <span className="font-semibold">Remember:</span> {requirementsDisplay}
          </div>
        )}
      </div>
    </div>
  );
}

