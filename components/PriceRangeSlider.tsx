'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { formatPrice } from '@/utils/formatters';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
  step?: number;
}

/**
 * Dual-thumb price range slider component
 */
export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
}: PriceRangeSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  // Calculate positions as percentages
  const minPercent = ((value.min - min) / (max - min)) * 100;
  const maxPercent = ((value.max - min) / (max - min)) * 100;

  // Convert pixel position to value
  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!sliderRef.current) return min;
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const rawValue = min + (percent / 100) * (max - min);
      return Math.round(rawValue / step) * step;
    },
    [min, max, step]
  );

  // Handle mouse/touch move
  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;

      const newValue = getValueFromPosition(clientX);

      if (isDragging === 'min') {
        const clampedValue = Math.max(min, Math.min(newValue, value.max - step));
        onChange({ ...value, min: clampedValue });
      } else {
        const clampedValue = Math.min(max, Math.max(newValue, value.min + step));
        onChange({ ...value, max: clampedValue });
      }
    },
    [isDragging, value, onChange, min, max, step, getValueFromPosition]
  );

  // Mouse handlers
  const handleMouseDown = (thumb: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(thumb);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMove]);

  // Touch handlers
  const handleTouchStart = (thumb: 'min' | 'max') => (e: React.TouchEvent) => {
    setIsDragging(thumb);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(null);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="w-full">
      {/* Value Display */}
      <div className="flex justify-between mb-4 text-sm">
        <div>
          <p className="text-slate-600 mb-1">Min Price</p>
          <p className="font-semibold text-navy">{formatPrice(value.min)}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-600 mb-1">Max Price</p>
          <p className="font-semibold text-navy">{formatPrice(value.max)}</p>
        </div>
      </div>

      {/* Slider Track */}
      <div
        ref={sliderRef}
        className="relative h-2 bg-slate-200 rounded-full cursor-pointer"
        onClick={(e) => {
          // If clicking on track, move nearest thumb
          if (!isDragging) {
            const clickValue = getValueFromPosition(e.clientX);
            const distToMin = Math.abs(clickValue - value.min);
            const distToMax = Math.abs(clickValue - value.max);
            if (distToMin < distToMax) {
              onChange({ ...value, min: Math.max(min, Math.min(clickValue, value.max - step)) });
            } else {
              onChange({ ...value, max: Math.min(max, Math.max(clickValue, value.min + step)) });
            }
          }
        }}
      >
        {/* Active Range */}
        <motion.div
          className="absolute h-2 bg-gold rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-gold rounded-full shadow-lg cursor-grab active:cursor-grabbing border-2 border-white z-10"
          style={{ left: `calc(${minPercent}% - 10px)` }}
          onMouseDown={handleMouseDown('min')}
          onTouchStart={handleTouchStart('min')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />

        {/* Max Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-gold rounded-full shadow-lg cursor-grab active:cursor-grabbing border-2 border-white z-10"
          style={{ left: `calc(${maxPercent}% - 10px)` }}
          onMouseDown={handleMouseDown('max')}
          onTouchStart={handleTouchStart('max')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />
      </div>
    </div>
  );
}

