'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { IExcursion } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { useExcursionFilters } from '@/hooks/useExcursionFilters';
import { filterExcursions, calculatePriceRange } from '@/utils/excursion-filters';
import ExcursionFilterSidebar from '@/components/ExcursionFilterSidebar';
import ExcursionFilterDrawer from '@/components/ExcursionFilterDrawer';
import ExcursionFilterTrigger from '@/components/ExcursionFilterTrigger';

function ExcursionsContent() {
  const searchParams = useSearchParams();
  const [excursions, setExcursions] = useState<IExcursion[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'duration'>('rating');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Fetch excursions
  useEffect(() => {
    async function fetchExcursions() {
      try {
        const response = await fetch('/api/excursions');
        const data = await response.json();
        if (data.success) {
          setExcursions(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch excursions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchExcursions();
  }, []);

  // Calculate default price range from data (use fallback if no data yet)
  const defaultPriceRange = useMemo(() => {
    if (excursions.length === 0) {
      return { min: 0, max: 1000 };
    }
    return calculatePriceRange(excursions);
  }, [excursions]);

  // Initialize filters with URL params
  const { filters, updateFilters, resetFilters, activeFilterCount } = useExcursionFilters(
    defaultPriceRange
  );

  // Update price range when data loads (if not set in URL)
  useEffect(() => {
    if (excursions.length > 0 && defaultPriceRange.min > 0 && defaultPriceRange.max < Infinity) {
      const urlPriceMin = searchParams?.get('price_min');
      const urlPriceMax = searchParams?.get('price_max');
      
      // Only update if URL doesn't specify price range
      if (!urlPriceMin && !urlPriceMax) {
        updateFilters({
          priceRange: {
            min: Math.max(filters.priceRange.min, defaultPriceRange.min),
            max: Math.min(filters.priceRange.max, defaultPriceRange.max),
          },
        });
      }
    }
  }, [excursions.length, defaultPriceRange, searchParams, filters.priceRange, updateFilters]);

  // Apply filters
  const filtered = useMemo(() => {
    return filterExcursions(excursions, filters);
  }, [excursions, filters]);

  // Sort filtered results
  const sorted = useMemo(() => {
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });
    return sorted;
  }, [filtered, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate-600">Loading excursions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-navy text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Unforgettable <span className="text-gold">Experiences</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Curated activities and excursions to enhance your East African adventure
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sort Bar (Top) */}
      <section className="bg-white border-b border-slate-200 sticky top-[72px] z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Showing <span className="font-semibold text-navy">{sorted.length}</span> experiences
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="rating">Highest rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content: Sidebar + Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Desktop Sidebar - Hidden on mobile */}
            <aside className="hidden xl:block flex-shrink-0">
              <div className="sticky top-24">
                <ExcursionFilterSidebar
                  excursions={excursions}
                  filters={filters}
                  onFiltersChange={updateFilters}
                  onReset={resetFilters}
                />
              </div>
            </aside>

            {/* Results Grid */}
            <div className="flex-1 min-w-0">
              {sorted.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-slate-600 mb-2">No excursions found</p>
                  <p className="text-slate-500 mb-6">Try adjusting your filters</p>
                  <button onClick={resetFilters} className="btn-outline">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                  {sorted.map((exc, index) => (
                    <motion.div
                      key={exc.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      id={exc.slug}
                      className="card group cursor-pointer w-full break-inside-avoid mb-6 flex flex-col"
                    >
                      <div className="relative w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={exc.images[0].url}
                          alt={exc.images[0].alt}
                          width={800}
                          height={1200}
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="w-full h-auto max-h-[600px] object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {exc.featured && (
                          <div className="absolute top-3 right-3 bg-gold text-navy px-2 py-1 rounded text-xs font-semibold">
                            Featured
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-navy text-gold px-3 py-1 rounded-full text-xs font-semibold">
                          {exc.category}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col">
                        <div>
                          <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                            {exc.title}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3">
                            {exc.location.city}, {exc.location.country}
                          </p>
                          <p className="text-sm text-slate-700 mb-4 line-clamp-3">
                            {exc.description}
                          </p>

                          {/* Highlights */}
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-navy mb-1">Highlights:</p>
                            <ul className="text-xs text-slate-600 space-y-1">
                              {exc.highlights.slice(0, 3).map((highlight, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-gold mt-0.5">✓</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <div>
                                <span className="text-2xl font-bold text-gold">
                                  {formatPrice(exc.price)}
                                </span>
                                <span className="text-sm text-slate-600"> per person</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>⏱️ {exc.duration}h</span>
                            <div className="flex items-center gap-1">
                              <span className="text-gold">★</span>
                              <span className="font-semibold">{exc.rating}</span>
                              <span className="text-slate-500">({exc.reviewCount})</span>
                            </div>
                          </div>
                          <Link href={`/excursions/${exc.slug}`}>
                            <button className="btn-primary w-full mt-4">View Details</button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <ExcursionFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        excursions={excursions}
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
      />

      {/* Mobile Filter Trigger */}
      <div className="xl:hidden">
        <ExcursionFilterTrigger
          onClick={() => setIsMobileDrawerOpen(true)}
          activeFilterCount={activeFilterCount}
        />
      </div>
    </div>
  );
}

export default function ExcursionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ExcursionsContent />
    </Suspense>
  );
}
