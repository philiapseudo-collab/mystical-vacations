'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ExternalLink } from 'lucide-react';
import type { IAccommodation } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { getAmenityIcon } from '@/utils/icon-mapper';
import RoomList from '@/components/RoomList';
import BookingSidebar from '@/components/BookingSidebar';
import ImageGalleryModal from '@/components/ImageGalleryModal';
import MasonryGallery from '@/components/ui/MasonryGallery';

// Mock fetch function - replace with API call later
async function getAccommodationBySlug(slug: string): Promise<IAccommodation | null> {
  try {
    const response = await fetch('/api/accommodation');
    const data = await response.json();
    if (data.success) {
      return data.data.find((acc: IAccommodation) => acc.slug === slug) || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch accommodation:', error);
    return null;
  }
}

export default function AccommodationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [accommodation, setAccommodation] = useState<IAccommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  useEffect(() => {
    async function fetchAccommodation() {
      const acc = await getAccommodationBySlug(slug);
      setAccommodation(acc);
      setLoading(false);
    }
    fetchAccommodation();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate-600">Loading accommodation details...</p>
        </div>
      </div>
    );
  }

  if (!accommodation) {
    notFound();
  }

  const openGallery = (index: number = 0) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
  };

  // Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${accommodation.name}, ${accommodation.location.city}, ${accommodation.location.country}`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Image Gallery */}
      <MasonryGallery
        images={accommodation.images}
        title={accommodation.name}
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
                      {accommodation.type}
                    </span>
                    {accommodation.featured && (
                      <span className="bg-navy text-gold px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-serif font-bold text-navy mb-2">
                    {accommodation.name}
                  </h1>
                  <div className="flex items-center gap-4 text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-5 h-5 text-gold" />
                      <span>
                        {accommodation.location.city}, {accommodation.location.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gold">★</span>
                      <span className="font-semibold">{accommodation.rating}</span>
                      <span className="text-slate-400">({accommodation.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

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
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-serif font-bold text-navy mb-2">
                      {accommodation.name}
                    </h1>
                    <div className="flex items-center gap-4 text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-5 h-5 text-gold" />
                        <span>
                          {accommodation.location.city}, {accommodation.location.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gold">★</span>
                        <span className="font-semibold">{accommodation.rating}</span>
                        <span className="text-slate-400">({accommodation.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: accommodation.starRating }).map((_, i) => (
                          <span key={i} className="text-gold text-lg">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{accommodation.description}</p>
                  </div>
                </div>
              </motion.div>

              {/* Amenities Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-serif font-bold text-navy mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {accommodation.amenities.map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity.icon || amenity.name);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-gold/10 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-gold flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Location Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <h2 className="text-2xl font-serif font-bold text-navy mb-4 p-6 pb-0">
                  Location
                </h2>
                <div className="relative h-64 bg-slate-200">
                  {/* Placeholder Map */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-600 font-semibold mb-2">
                        {accommodation.location.city}, {accommodation.location.country}
                      </p>
                      {accommodation.location.coordinates && (
                        <p className="text-xs text-slate-500 mb-4">
                          {accommodation.location.coordinates.lat},{' '}
                          {accommodation.location.coordinates.lng}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* View on Google Maps Button */}
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all group"
                  >
                    <button className="bg-gold hover:bg-gold-dark text-navy px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center gap-2 group-hover:scale-105 transition-transform">
                      View on Google Maps
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </a>
                </div>
              </motion.div>

              {/* Room Selection List */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <RoomList
                  accommodation={accommodation}
                  selectedRoomType={selectedRoomType}
                  onSelectRoom={setSelectedRoomType}
                />
              </motion.div>
            </div>

            {/* Right Column (33%) - Sticky Booking Widget */}
            <div className="lg:col-span-1">
              <BookingSidebar
                accommodation={accommodation}
                selectedRoomType={selectedRoomType}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={accommodation.images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={galleryStartIndex}
      />
    </div>
  );
}

