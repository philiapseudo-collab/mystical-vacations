'use client';

import Image from 'next/image';
import type { BookingSession } from '@/types';
import { formatDate } from '@/utils/formatters';

interface PackageSummaryProps {
  session: BookingSession & { details: { type: 'package' } & BookingSession['details'] };
  packageData: {
    title: string;
    subtitle: string;
    duration: number;
    rating: number;
    reviewCount: number;
  };
}

export default function PackageSummary({ session, packageData }: PackageSummaryProps) {
  return (
    <div className="flex gap-4">
      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={session.item.image}
          alt={packageData.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-navy mb-2">{packageData.title}</h3>
        <p className="text-slate-600 text-sm mb-2">{packageData.subtitle}</p>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span>⏱️ {packageData.duration} Days</span>
          <span>⭐ {packageData.rating} ({packageData.reviewCount})</span>
        </div>
        {session.details.date && (
          <p className="text-slate-600 text-sm mt-2">
            Departure: <span className="font-semibold">{formatDate(session.details.date, 'long')}</span>
          </p>
        )}
        <p className="text-slate-600 text-sm">
          Guests: <span className="font-semibold">{session.details.guests}</span>
        </p>
      </div>
    </div>
  );
}

