'use client';

import { formatPrice, formatToKES } from '@/utils/formatters';

interface DualCurrencyPriceProps {
  priceUSD: number;
  size?: 'small' | 'large';
  showFrom?: boolean;
  currency?: 'USD' | 'KES' | 'TZS';
}

/**
 * Reusable component for displaying prices in both USD and KES
 * Responsive: Shows "approx." on desktop, "~" on mobile
 */
export default function DualCurrencyPrice({ 
  priceUSD, 
  size = 'large', 
  showFrom = true,
  currency = 'USD'
}: DualCurrencyPriceProps) {
  const isLarge = size === 'large';
  
  return (
    <div>
      {showFrom && (
        <span className={`block text-slate-500 ${isLarge ? 'text-sm mb-1' : 'text-xs mb-0.5'}`}>
          From
        </span>
      )}
      <p className={`font-bold text-gold ${isLarge ? 'text-2xl' : 'text-xl'}`}>
        {formatPrice(priceUSD, currency)}
      </p>
      <p className={`text-slate-600 ${isLarge ? 'text-sm mt-1' : 'text-xs mt-0.5'}`}>
        {/* Desktop/Tablet: show "approx." */}
        <span className="hidden sm:inline">(approx. {formatToKES(priceUSD)})</span>
        {/* Mobile: show "~" */}
        <span className="sm:hidden">(~{formatToKES(priceUSD)})</span>
      </p>
    </div>
  );
}

