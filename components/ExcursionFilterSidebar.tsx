'use client';

import { useMemo } from 'react';
import { X } from 'lucide-react';
import type { IExcursion, ExcursionCategory } from '@/types';
import { EXCURSION_CATEGORIES } from '@/utils/constants';
import PriceRangeSlider from './PriceRangeSlider';
import type { ExcursionFilters } from '@/hooks/useExcursionFilters';

interface ExcursionFilterSidebarProps {
  excursions: IExcursion[];
  filters: ExcursionFilters;
  onFiltersChange: (filters: Partial<ExcursionFilters>) => void;
  onReset: () => void;
  showClearButton?: boolean;
}

/**
 * ExcursionFilterSidebar - Sticky filter sidebar for desktop
 */
export default function ExcursionFilterSidebar({
  excursions,
  filters,
  onFiltersChange,
  onReset,
  showClearButton = true,
}: ExcursionFilterSidebarProps) {
  // Extract unique locations from excursions
  const availableLocations = useMemo(() => {
    const locations = new Set<string>();
    excursions.forEach((exc) => {
      locations.add(exc.location.city);
    });
    return Array.from(locations).sort();
  }, [excursions]);

  // Calculate price range from data
  const priceRange = useMemo(() => {
    if (excursions.length === 0) return { min: 0, max: 1000 };
    const prices = excursions.map((exc) => exc.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [excursions]);

  // Handle location toggle
  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter((l) => l !== location)
      : [...filters.locations, location];
    onFiltersChange({ locations: newLocations });
  };

  // Handle category toggle
  const handleCategoryToggle = (category: ExcursionCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ categories: newCategories });
  };

  // Handle price range change
  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    onFiltersChange({ priceRange: range });
  };

  return (
    <div className="w-72 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-navy">Filters</h2>
        {showClearButton && (
          <button
            onClick={onReset}
            className="text-sm text-slate-600 hover:text-gold transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Location Filter */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-3">Location</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableLocations.map((location) => (
            <label
              key={location}
              className="flex items-center gap-2 cursor-pointer group hover:bg-slate-50 p-2 rounded-md transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.locations.includes(location)}
                onChange={() => handleLocationToggle(location)}
                className="w-4 h-4 text-gold border-slate-300 rounded focus:ring-gold focus:ring-2"
              />
              <span className="text-sm text-slate-700 group-hover:text-navy">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-3">Price Range</h3>
        <PriceRangeSlider
          min={priceRange.min}
          max={priceRange.max}
          value={filters.priceRange}
          onChange={handlePriceRangeChange}
          step={10}
        />
      </div>

      {/* Activity Type Filter */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-3">Activity Type</h3>
        <div className="space-y-2">
          {EXCURSION_CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer group hover:bg-slate-50 p-2 rounded-md transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 text-gold border-slate-300 rounded focus:ring-gold focus:ring-2"
              />
              <span className="text-sm text-slate-700 group-hover:text-navy">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

