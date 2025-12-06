/**
 * Custom hook for managing excursion filters with URL search params persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ExcursionCategory } from '@/types';

export interface ExcursionFilters {
  locations: string[];
  priceRange: { min: number; max: number };
  categories: ExcursionCategory[];
}

/**
 * Parse URL search params into filter state
 */
function parseFiltersFromURL(searchParams: URLSearchParams): Partial<ExcursionFilters> {
  const filters: Partial<ExcursionFilters> = {
    locations: [],
    categories: [],
    priceRange: { min: 0, max: 1000 }, // Defaults, will be overridden by data
  };

  // Parse locations
  const locationParam = searchParams.get('locations');
  if (locationParam) {
    filters.locations = locationParam.split(',').filter(Boolean);
  }

  // Parse categories
  const categoryParam = searchParams.get('categories');
  if (categoryParam) {
    filters.categories = categoryParam.split(',') as ExcursionCategory[];
  }

  // Parse price range
  const priceMin = searchParams.get('price_min');
  const priceMax = searchParams.get('price_max');
  if (priceMin || priceMax) {
    const currentRange = filters.priceRange || { min: 0, max: 1000 };
    filters.priceRange = {
      min: priceMin ? parseInt(priceMin, 10) : currentRange.min,
      max: priceMax ? parseInt(priceMax, 10) : currentRange.max,
    };
  }

  return filters;
}

/**
 * Build URL search params from filter state
 */
function buildURLParams(filters: ExcursionFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.locations.length > 0) {
    params.set('locations', filters.locations.join(','));
  }

  if (filters.categories.length > 0) {
    params.set('categories', filters.categories.join(','));
  }

  if (filters.priceRange.min > 0) {
    params.set('price_min', filters.priceRange.min.toString());
  }

  if (filters.priceRange.max < Infinity) {
    params.set('price_max', filters.priceRange.max.toString());
  }

  return params;
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: ExcursionFilters): number {
  let count = 0;
  if (filters.locations.length > 0) count++;
  if (filters.categories.length > 0) count++;
  if (filters.priceRange.min > 0 || filters.priceRange.max < Infinity) count++;
  return count;
}

/**
 * Hook for managing excursion filters with URL persistence
 */
export function useExcursionFilters(
  defaultPriceRange: { min: number; max: number }
): {
  filters: ExcursionFilters;
  updateFilters: (updates: Partial<ExcursionFilters>) => void;
  resetFilters: () => void;
  activeFilterCount: number;
} {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState<ExcursionFilters>(() => {
    const urlFilters = parseFiltersFromURL(searchParams);
    return {
      locations: urlFilters.locations || [],
      categories: urlFilters.categories || [],
      priceRange: urlFilters.priceRange || {
        min: defaultPriceRange.min,
        max: defaultPriceRange.max,
      },
    };
  });

  // Update price range when default changes (e.g., data loads)
  useEffect(() => {
    if (defaultPriceRange.min > 0 || defaultPriceRange.max < Infinity) {
      setFilters((prev) => {
        // Only update if current range is at defaults or if URL didn't specify
        const urlFilters = parseFiltersFromURL(searchParams);
        if (!urlFilters.priceRange) {
          return {
            ...prev,
            priceRange: {
              min: Math.max(prev.priceRange.min, defaultPriceRange.min),
              max: Math.min(prev.priceRange.max, defaultPriceRange.max),
            },
          };
        }
        return prev;
      });
    }
  }, [defaultPriceRange, searchParams]);

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: ExcursionFilters) => {
      const params = buildURLParams(newFilters);
      const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newURL, { scroll: false });
    },
    [router]
  );

  // Update filters
  const updateFilters = useCallback(
    (updates: Partial<ExcursionFilters>) => {
      setFilters((prev) => {
        const newFilters = { ...prev, ...updates };
        updateURL(newFilters);
        return newFilters;
      });
    },
    [updateURL]
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    const defaultFilters: ExcursionFilters = {
      locations: [],
      categories: [],
      priceRange: defaultPriceRange,
    };
    setFilters(defaultFilters);
    router.replace(window.location.pathname, { scroll: false });
  }, [defaultPriceRange, router]);

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const urlFilters = parseFiltersFromURL(searchParams);
    setFilters((prev) => ({
      locations: urlFilters.locations || prev.locations,
      categories: urlFilters.categories || prev.categories,
      priceRange: urlFilters.priceRange || prev.priceRange,
    }));
  }, [searchParams]);

  const activeFilterCount = countActiveFilters(filters);

  return {
    filters,
    updateFilters,
    resetFilters,
    activeFilterCount,
  };
}

