'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { IAccommodation } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { ACCOMMODATION_TYPES } from '@/utils/constants';

export default function AccommodationPage() {
  const [accommodations, setAccommodations] = useState<IAccommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');

  useEffect(() => {
    async function fetchAccommodations() {
      try {
        const response = await fetch('/api/accommodation');
        const data = await response.json();
        if (data.success) {
          setAccommodations(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch accommodations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAccommodations();
  }, []);

  // Filter and sort
  let filtered = [...accommodations];

  if (filterType !== 'all') {
    filtered = filtered.filter((acc) => acc.type === filterType);
  }

  if (filterCountry !== 'all') {
    filtered = filtered.filter((acc) => acc.location.country === filterCountry);
  }

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.pricePerNight - b.pricePerNight;
      case 'price_desc':
        return b.pricePerNight - a.pricePerNight;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate-600">Loading accommodations...</p>
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
              Luxury <span className="text-gold">Accommodation</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Stay in the finest hotels, lodges, and resorts across Kenya & Tanzania
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Sort */}
      <section className="bg-white border-b border-slate-200 sticky top-[72px] z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">All countries</option>
                <option value="Kenya">Kenya</option>
                <option value="Tanzania">Tanzania</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">All types</option>
                {ACCOMMODATION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="rating">Highest rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-slate-600">
              Showing <span className="font-semibold text-navy">{filtered.length}</span> properties
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((acc, index) => (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card flex flex-col md:flex-row group cursor-pointer overflow-hidden"
              >
                <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                  <Image
                    src={acc.images[0].url}
                    alt={acc.images[0].alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {acc.featured && (
                    <div className="absolute top-3 left-3 bg-gold text-navy px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-navy group-hover:text-gold transition-colors">
                          {acc.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {acc.location.city}, {acc.location.country}
                        </p>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gold mr-1">★</span>
                        <span className="font-semibold">{acc.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{acc.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {acc.amenities.slice(0, 4).map((amenity) => (
                        <span key={amenity.name} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {amenity.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <div>
                      <span className="text-sm text-slate-500">From</span>
                      <p className="text-xl font-bold text-gold">
                        {formatPrice(acc.pricePerNight)}<span className="text-sm text-slate-600">/night</span>
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gold hover:bg-gold-dark text-navy font-semibold rounded-md transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

