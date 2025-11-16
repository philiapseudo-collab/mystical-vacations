'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import OmniSearch from '@/components/OmniSearch';
import DualCurrencyPrice from '@/components/DualCurrencyPrice';
import type { IPackage, IExcursion } from '@/types';

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState<IPackage[]>([]);
  const [featuredExcursions, setFeaturedExcursions] = useState<IExcursion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedData() {
      try {
        const [packagesRes, excursionsRes] = await Promise.all([
          fetch('/api/packages?featured=true'),
          fetch('/api/excursions')
        ]);
        
        const packagesData = await packagesRes.json();
        const excursionsData = await excursionsRes.json();
        
        if (packagesData.success) {
          setFeaturedPackages(packagesData.data.slice(0, 3));
        }
        
        if (excursionsData.success) {
          setFeaturedExcursions(excursionsData.data.filter((exc: IExcursion) => exc.featured).slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch featured data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center cinematic-bg">
        {/* Hero Background Image - Intended aspect ratio: 21:9, min-height: 100vh */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop"
            alt="African Safari - Serengeti"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6"
          >
            Discover <span className="text-gold">Mystical</span> Africa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-slate-200"
          >
            Luxury journeys through Kenya & Tanzania&apos;s most breathtaking destinations
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="#search">
              <button className="btn-primary text-lg">
                Start Your Journey
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-gold rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Omni-Search Section */}
      <section id="search" className="py-16 bg-navy">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-white">
              Plan Your <span className="text-gold">Perfect Journey</span>
            </h2>
            <OmniSearch />
          </motion.div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
              Featured <span className="text-gold">Packages</span>
            </h2>
            <p className="text-slate-600 text-lg">
              Curated luxury experiences for discerning travelers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Link href={`/packages/${pkg.slug}`}>
                  <div className="card group cursor-pointer h-full">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={pkg.images[0].url}
                        alt={pkg.images[0].alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-gold text-navy px-3 py-1 rounded-full text-sm font-semibold">
                        {pkg.duration} Days
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                        {pkg.title}
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {pkg.subtitle}
                      </p>
                      <div className="flex items-center justify-between">
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

          <div className="text-center mt-12">
            <Link href="/packages">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline"
              >
                View All Packages
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Why Choose <span className="text-gold">Mystical Vacations</span>
            </h2>
            <p className="text-slate-300 text-lg">
              Unparalleled luxury and expertise in East African travel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Curated Experiences',
                description: 'Every journey is meticulously crafted for your unique preferences',
                icon: '✨',
              },
              {
                title: 'Local Expertise',
                description: 'Deep knowledge and connections throughout Kenya and Tanzania',
                icon: '🗺️',
              },
              {
                title: 'Luxury Standards',
                description: 'Premium accommodations, transport, and personalized service',
                icon: '👑',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8 bg-navy-light rounded-lg hover:bg-navy-dark transition-colors"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gold mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Excursions */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
              Popular <span className="text-gold">Experiences</span>
            </h2>
            <p className="text-slate-600 text-lg">
              Add unforgettable activities to your journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredExcursions.map((exc, index) => (
              <motion.div
                key={exc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/excursions#${exc.slug}`}>
                  <div className="card group cursor-pointer h-full">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={exc.images[0].url}
                        alt={exc.images[0].alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 bg-navy text-gold px-2 py-1 rounded text-xs font-semibold">
                        {exc.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-gold transition-colors line-clamp-2">
                        {exc.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gold font-bold">${exc.price}</span>
                        <span className="text-slate-500">{exc.duration}h</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/excursions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline"
              >
                View All Excursions
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-navy via-navy-light to-navy">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready for Your <span className="text-gold">African Adventure</span>?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Let our travel experts craft your perfect East African journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#search">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg"
                >
                  Search Packages
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline text-lg"
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

