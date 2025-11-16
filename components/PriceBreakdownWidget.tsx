'use client';

import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/formatters';
import type { IPriceBreakdown } from '@/types';

interface PriceBreakdownWidgetProps {
  priceBreakdown: IPriceBreakdown;
  itemCount?: number;
}

export default function PriceBreakdownWidget({ priceBreakdown, itemCount = 1 }: PriceBreakdownWidgetProps) {
  const subtotal = priceBreakdown.basePrice * itemCount;
  const serviceFee = priceBreakdown.serviceFee * itemCount;
  const taxes = priceBreakdown.taxes * itemCount;
  const discount = priceBreakdown.discount ? priceBreakdown.discount * itemCount : 0;
  const total = subtotal + serviceFee + taxes - discount;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-xl p-6 sticky top-24"
    >
      <h3 className="text-xl font-serif font-bold text-navy mb-6">Price Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-slate-700">
          <span>Base Price {itemCount > 1 && `(× ${itemCount})`}</span>
          <span className="font-semibold">{formatPrice(subtotal, priceBreakdown.currency)}</span>
        </div>

        <div className="flex justify-between text-slate-700">
          <span>Service Fee</span>
          <span className="font-semibold">{formatPrice(serviceFee, priceBreakdown.currency)}</span>
        </div>

        <div className="flex justify-between text-slate-700">
          <span>Taxes & Fees</span>
          <span className="font-semibold">{formatPrice(taxes, priceBreakdown.currency)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-semibold">-{formatPrice(discount, priceBreakdown.currency)}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t-2 border-gold">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-navy">Total</span>
          <span className="text-2xl font-bold text-gold">{formatPrice(total, priceBreakdown.currency)}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 space-y-2 text-sm text-slate-600">
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

