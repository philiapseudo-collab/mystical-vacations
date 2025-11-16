'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { IExcursion } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { EXCURSION_CATEGORIES } from '@/utils/constants';

export default function ExcursionsPage() {
  const [excursions, setExcursions] = useState<IExcursion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'duration'>('rating');

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

  // Filter and sort
  let filtered = [...excursions];

  if (filterCategory !== 'all') {
    filtered = filtered.filter((exc) => exc.category === filterCategory);
  }

  filtered.sort((a, b) => {
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

      {/* Filters */}
      <section className="bg-white border-b border-slate-200 sticky top-[72px] z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 rounded-md font-semibold transition-all ${
                  filterCategory === 'all'
                    ? 'bg-gold text-navy'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {EXCURSION_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-md font-semibold transition-all ${
                    filterCategory === category
                      ? 'bg-gold text-navy'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

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

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-slate-600">
              Showing <span className="font-semibold text-navy">{filtered.length}</span> experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((exc, index) => (
              <motion.div
                key={exc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                id={exc.slug}
                className="card group cursor-pointer h-full flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={exc.images[0].url}
                    alt={exc.images[0].alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
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

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
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
                          <span className="text-2xl font-bold text-gold">{formatPrice(exc.price)}</span>
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
                    <button className="btn-primary w-full mt-4">
                      Book Experience
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

