'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { IPackage } from '@/types';
import { formatPrice, calculateNights } from '@/utils/formatters';
import DualCurrencyPrice from '@/components/DualCurrencyPrice';

export default function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [pkg, setPkg] = useState<IPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackage() {
      try {
        const response = await fetch('/api/packages');
        const data = await response.json();
        if (data.success) {
          const foundPkg = data.data.find((p: IPackage) => p.slug === slug);
          setPkg(foundPkg || null);
        }
      } catch (error) {
        console.error('Failed to fetch package:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-end cinematic-bg">
        <div className="absolute inset-0 z-0">
          <Image
            src={pkg.images[0].url}
            alt={pkg.images[0].alt}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            {pkg.featured && (
              <span className="inline-block bg-gold text-navy px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Featured Package
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              {pkg.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-6 max-w-3xl">
              {pkg.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span>⏱️</span>
                <span>{pkg.duration} Days / {calculateNights(pkg.duration)} Nights</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span>👥</span>
                <span>Max {pkg.maxGroupSize} guests</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span>⭐</span>
                <span>{pkg.rating} ({pkg.reviewCount} reviews)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6 md:p-8"
              >
                <h2 className="text-2xl font-serif font-bold text-navy mb-4">Overview</h2>
                <p className="text-slate-700 leading-relaxed">{pkg.description}</p>
              </motion.div>

              {/* Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 md:p-8"
              >
                <h2 className="text-2xl font-serif font-bold text-navy mb-4">Highlights</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pkg.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gold mt-1">✓</span>
                      <span className="text-slate-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Itinerary */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6 md:p-8"
              >
                <h2 className="text-2xl font-serif font-bold text-navy mb-6">Detailed Itinerary</h2>
                <div className="space-y-6">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="border-l-4 border-gold pl-6 pb-6 relative">
                      <div className="absolute -left-3 top-0 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                        <span className="text-navy text-xs font-bold">{day.day}</span>
                      </div>
                      <h3 className="text-lg font-bold text-navy mb-2">
                        Day {day.day}: {day.title}
                      </h3>
                      <p className="text-slate-700 mb-3">{day.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {day.activities.map((activity, i) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                            {activity}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-slate-600">
                        <p><strong>Accommodation:</strong> {day.accommodation}</p>
                        <p><strong>Meals:</strong> {day.meals.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Inclusions & Exclusions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 md:p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-4">What&apos;s Included</h3>
                    <ul className="space-y-2">
                      {pkg.inclusions.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-slate-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-4">What&apos;s Not Included</h3>
                    <ul className="space-y-2">
                      {pkg.exclusions.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">✗</span>
                          <span className="text-slate-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Best Time to Visit */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-md p-6 md:p-8"
              >
                <h2 className="text-2xl font-serif font-bold text-navy mb-4">Best Time to Visit</h2>
                <div className="flex flex-wrap gap-2">
                  {pkg.bestSeasons.map((season, index) => (
                    <span key={index} className="bg-gold/10 text-gold px-4 py-2 rounded-full font-semibold">
                      {season}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-xl p-6 sticky top-24"
              >
                <div className="text-center mb-6 pb-6 border-b border-slate-200">
                  <p className="text-slate-600 mb-3">Package Price</p>
                  <div className="flex justify-center">
                    <DualCurrencyPrice 
                      priceUSD={pkg.price.total} 
                      size="large"
                      showFrom={false}
                    />
                  </div>
                  <p className="text-sm text-slate-500 mt-2">per person</p>
                </div>

                {/* Price Breakdown */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h3 className="font-semibold text-navy mb-3">Price Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Base Price</span>
                      <span className="font-semibold">{formatPrice(pkg.price.basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Service Fee</span>
                      <span className="font-semibold">{formatPrice(pkg.price.serviceFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Taxes</span>
                      <span className="font-semibold">{formatPrice(pkg.price.taxes)}</span>
                    </div>
                    {pkg.price.discount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-semibold">-{formatPrice(pkg.price.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="font-bold text-navy">Total</span>
                      <span className="font-bold text-gold">{formatPrice(pkg.price.total)}</span>
                    </div>
                  </div>
                </div>

                <Link href={`/book/review?package=${pkg.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary w-full text-lg mb-4"
                  >
                    Book Now
                  </motion.button>
                </Link>

                <Link href="/contact">
                  <button className="btn-outline w-full">
                    Contact Us
                  </button>
                </Link>

                <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
                  <p>🛡️ Flexible cancellation</p>
                  <p className="mt-1">💳 Secure payment</p>
                  <p className="mt-1">✅ Best price guarantee</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

