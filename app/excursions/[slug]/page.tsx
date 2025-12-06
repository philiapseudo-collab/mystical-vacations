'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Clock, Activity, Users, Languages, Mountain } from 'lucide-react';
import type { IExcursion } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { getDefaultRequirements } from '@/utils/excursion-helpers';
import MasonryGallery from '@/components/ui/MasonryGallery';
import DetailBadge from '@/components/ui/DetailBadge';
import ExcursionBookingSidebar from '@/components/ExcursionBookingSidebar';
import ImageGalleryModal from '@/components/ImageGalleryModal';

// Mock fetch function - replace with API call later
async function getExcursionBySlug(slug: string): Promise<IExcursion | null> {
  try {
    const response = await fetch('/api/excursions');
    const data = await response.json();
    if (data.success) {
      return data.data.find((exc: IExcursion) => exc.slug === slug) || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch excursion:', error);
    return null;
  }
}

export default function ExcursionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [excursion, setExcursion] = useState<IExcursion | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  useEffect(() => {
    async function fetchExcursion() {
      const exc = await getExcursionBySlug(slug);
      setExcursion(exc);
      setLoading(false);
    }
    fetchExcursion();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate-600">Loading excursion details...</p>
        </div>
      </div>
    );
  }

  if (!excursion) {
    notFound();
  }

  const openGallery = (index: number = 0) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
  };

  // Get requirements (use data or defaults)
  const requirements = excursion.requirements && excursion.requirements.length > 0
    ? excursion.requirements
    : getDefaultRequirements(excursion.category);

  // Get languages (default to English, Swahili)
  const languages = excursion.languages && excursion.languages.length > 0
    ? excursion.languages
    : ['English', 'Swahili'];

  // Difficulty icon
  const DifficultyIcon = excursion.difficultyLevel === 'Strenuous' ? Mountain : Activity;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Image Gallery */}
      <MasonryGallery
        images={excursion.images}
        title={excursion.title}
        onViewAll={openGallery}
      />

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column (66%) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-semibold">
                      {excursion.category}
                    </span>
                    {excursion.featured && (
                      <span className="bg-navy text-gold px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-serif font-bold text-navy mb-2">
                    {excursion.title}
                  </h1>
                  <div className="flex items-center gap-4 text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-5 h-5 text-gold" />
                      <span>
                        {excursion.location.city}, {excursion.location.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gold">★</span>
                      <span className="font-semibold">{excursion.rating}</span>
                      <span className="text-slate-400">({excursion.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Overview Bar */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                  <DetailBadge
                    icon={Clock}
                    label="Duration"
                    value={`${excursion.duration} ${excursion.duration === 1 ? 'Hour' : 'Hours'}`}
                  />
                  <DetailBadge
                    icon={DifficultyIcon}
                    label="Difficulty"
                    value={excursion.difficultyLevel}
                  />
                  <DetailBadge
                    icon={Users}
                    label="Group Size"
                    value={`Up to ${excursion.maxParticipants}`}
                  />
                  <DetailBadge
                    icon={Languages}
                    label="Languages"
                    value={languages.join(', ')}
                  />
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-serif font-bold text-navy mb-4">Overview</h2>
                <p className="text-slate-700 leading-relaxed">{excursion.description}</p>
              </motion.div>

              {/* Highlights */}
              {excursion.highlights && excursion.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-2xl font-serif font-bold text-navy mb-4">Highlights</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {excursion.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gold mt-1">✓</span>
                        <span className="text-slate-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Itinerary Timeline */}
              {excursion.itinerary && excursion.itinerary.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-2xl font-serif font-bold text-navy mb-6">Itinerary</h2>
                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gold/30" />

                    {/* Timeline Items */}
                    <div className="space-y-6">
                      {excursion.itinerary.map((item, index) => (
                        <div key={index} className="relative flex items-start gap-4">
                          {/* Time Circle */}
                          <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                            <span className="text-navy text-xs font-bold text-center px-2">
                              {item.time}
                            </span>
                          </div>

                          {/* Activity */}
                          <div className="flex-1 pt-2">
                            <p className="text-slate-700 font-medium">{item.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* What's Included */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-serif font-bold text-navy mb-4">What&apos;s Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {excursion.included.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* What's Not Included */}
              {excursion.notIncluded && excursion.notIncluded.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-2xl font-serif font-bold text-navy mb-4">What&apos;s Not Included</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {excursion.notIncluded.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* What to Carry (Requirements) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-navy rounded-lg shadow-md p-6 text-white"
              >
                <h2 className="text-2xl font-serif font-bold text-gold mb-4">What to Carry</h2>
                <ul className="space-y-2">
                  {requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span className="text-slate-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Right Column (33%) - Sticky Booking Widget */}
            <div className="lg:col-span-1">
              <ExcursionBookingSidebar excursion={excursion} />
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={excursion.images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={galleryStartIndex}
      />
    </div>
  );
}

