'use client';

import Image from 'next/image';
import type { BookingSession } from '@/types';
import { formatDate } from '@/utils/formatters';

interface TransportSummaryProps {
  session: BookingSession & { details: { type: 'transport' } & BookingSession['details'] };
  transportData: {
    routeName: string;
    operator?: string;
  };
}

export default function TransportSummary({ session, transportData }: TransportSummaryProps) {
  return (
    <div className="flex gap-4">
      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={session.item.image}
          alt={`${session.details.origin} to ${session.details.destination}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-navy mb-2">
          {session.details.origin} → {session.details.destination}
        </h3>
        {transportData.operator && (
          <p className="text-slate-600 text-sm mb-2">{transportData.operator}</p>
        )}
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-gold text-navy px-3 py-1 rounded-full text-xs font-bold">
            {session.details.class}
          </span>
        </div>
        {session.details.date && (
          <p className="text-slate-600 text-sm">
            Date: <span className="font-semibold">{formatDate(session.details.date, 'long')}</span>
          </p>
        )}
        {session.details.time && (
          <p className="text-slate-600 text-sm">
            Departure: <span className="font-semibold">{session.details.time}</span>
          </p>
        )}
        <p className="text-slate-600 text-sm mt-2">
          Passengers: <span className="font-semibold">{session.details.passengers}</span>
        </p>
      </div>
    </div>
  );
}

