'use client';

import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

interface ExcursionFilterTriggerProps {
  onClick: () => void;
  activeFilterCount: number;
}

/**
 * Mobile filter trigger - Floating pill button with badge
 */
export default function ExcursionFilterTrigger({
  onClick,
  activeFilterCount,
}: ExcursionFilterTriggerProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-navy text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-semibold hover:bg-navy-light transition-colors"
    >
      <Filter className="w-5 h-5" />
      <span>Filters</span>
      {activeFilterCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
        >
          {activeFilterCount}
        </motion.span>
      )}
    </motion.button>
  );
}

