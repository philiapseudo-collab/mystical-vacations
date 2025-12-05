/**
 * Filter logic utilities for excursions
 * Implements: OR within category, AND across categories
 */

import type { IExcursion } from '@/types';
import type { ExcursionFilters } from '@/hooks/useExcursionFilters';

/**
 * Filter excursions based on filter criteria
 * Logic: OR within category (e.g., Safari OR Beach), AND across categories (e.g., (Safari OR Beach) AND (Mombasa))
 */
export function filterExcursions(
  excursions: IExcursion[],
  filters: ExcursionFilters
): IExcursion[] {
  return excursions.filter((excursion) => {
    // Location filter: OR logic (any selected location matches)
    if (filters.locations.length > 0) {
      const matchesLocation = filters.locations.includes(excursion.location.city);
      if (!matchesLocation) return false;
    }

    // Category filter: OR logic (any selected category matches)
    if (filters.categories.length > 0) {
      const matchesCategory = filters.categories.includes(excursion.category);
      if (!matchesCategory) return false;
    }

    // Price range filter: AND logic (must be within range)
    if (
      excursion.price < filters.priceRange.min ||
      excursion.price > filters.priceRange.max
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Calculate price range from excursions data
 */
export function calculatePriceRange(excursions: IExcursion[]): { min: number; max: number } {
  if (excursions.length === 0) {
    return { min: 0, max: 1000 };
  }

  const prices = excursions.map((exc) => exc.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

