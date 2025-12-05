'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X } from 'lucide-react';
import ExcursionFilterSidebar from './ExcursionFilterSidebar';
import type { IExcursion } from '@/types';
import type { ExcursionFilters } from '@/hooks/useExcursionFilters';

interface ExcursionFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  excursions: IExcursion[];
  filters: ExcursionFilters;
  onFiltersChange: (filters: Partial<ExcursionFilters>) => void;
  onReset: () => void;
}

/**
 * Mobile filter drawer that slides up from bottom (iOS Sheet style)
 */
export default function ExcursionFilterDrawer({
  isOpen,
  onClose,
  excursions,
  filters,
  onFiltersChange,
  onReset,
}: ExcursionFilterDrawerProps) {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle drag end
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.y > threshold) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ y, opacity }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-navy">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ExcursionFilterSidebar
                excursions={excursions}
                filters={filters}
                onFiltersChange={onFiltersChange}
                onReset={onReset}
                showClearButton={false}
              />
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex gap-3">
              <button
                onClick={onReset}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gold text-navy rounded-lg font-semibold hover:bg-gold-dark transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

