'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { IPackage } from '@/types';
import DualCurrencyPrice from '@/components/DualCurrencyPrice';

export default function PackagesPage() {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'duration'>('rating');
  const [filterDuration, setFilterDuration] = useState<string>('all');

  // Fetch packages from API
  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await fetch('/api/packages');
        const data = await response.json();
        if (data.success) {
          setPackages(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  // Filter and sort packages
  let filteredPackages = [...packages];

  // Filter by duration
  if (filterDuration !== 'all') {
    const [min, max] = filterDuration.split('-').map(Number);
    filteredPackages = filteredPackages.filter((pkg) => {
      if (max) {
        return pkg.duration >= min && pkg.duration <= max;
      }
      return pkg.duration >= min;
    });
  }

  // Sort packages
  filteredPackages.sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price.total - b.price.total;
      case 'price_desc':
        return b.price.total - a.price.total;
      case 'rating':
        return b.rating - a.rating;
      case 'duration':
        return a.duration - b.duration;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate-600">Loading packages...</p>
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
              Luxury <span className="text-gold">Travel Packages</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Curated journeys combining the best of Kenya and Tanzania
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Sort */}
      <section className="bg-white border-b border-slate-200 sticky top-[72px] z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="text-sm font-semibold text-navy">Duration:</label>
              <select
                value={filterDuration}
                onChange={(e) => setFilterDuration(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">All durations</option>
                <option value="1-4">1-4 days</option>
                <option value="5-7">5-7 days</option>
                <option value="8-10">8-10 days</option>
                <option value="11">11+ days</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-navy">Sort by:</label>
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
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-slate-600">
              Showing <span className="font-semibold text-navy">{filteredPackages.length}</span> packages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/packages/${pkg.slug}`}>
                  <div className="card group cursor-pointer h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={pkg.images[0].url}
                        alt={pkg.images[0].alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {pkg.featured && (
                        <div className="absolute top-4 left-4 bg-gold text-navy px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-navy text-gold px-3 py-1 rounded-full text-sm font-semibold">
                        {pkg.duration} Days
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-xl font-serif font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                          {pkg.title}
                        </h3>
                        <p className="text-slate-600 mb-3 line-clamp-2">
                          {pkg.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pkg.locations.map((loc, i) => (
                            <span
                              key={i}
                              className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                            >
                              {loc.city}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <DualCurrencyPrice 
                          priceUSD={pkg.price.total} 
                          size="large"
                          showFrom={true}
                        />
                        <div className="flex items-center text-sm">
                          <span className="text-gold mr-1">★</span>
                          <span className="font-semibold">{pkg.rating}</span>
                          <span className="text-slate-500 ml-1">({pkg.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

