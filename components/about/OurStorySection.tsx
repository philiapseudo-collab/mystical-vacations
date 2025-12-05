'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * OurStorySection - High-end editorial layout for the About page
 * Features a two-column grid with text content and image collage
 */
export default function OurStorySection() {
  // Image URLs - Portrait and Landscape for collage effect
  // Portrait: Maasai warrior or tall giraffe (vertical orientation)
  const portraitImage = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&h=900&fit=crop'; // Maasai warrior portrait
  // Landscape: Safari lodge interior or sunset game drive (horizontal orientation)
  const landscapeImage = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'; // Safari lodge interior

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-4">
              Our Story
            </h2>
            
            {/* Gold Separator Line */}
            <div className="w-16 h-1 bg-gold mb-8" />

            <div className="space-y-6 text-slate-600 leading-relaxed">
              {/* First Paragraph with Hook Sentence */}
              <p>
                <span className="text-xl font-semibold text-navy">
                  Five years ago, Mystical Vacations began not as a corporate strategy, but as a shared family passion.
                </span>{' '}
                Born from a lifetime of exploring the vast savannahs of Kenya and the hidden coastlines of Tanzania, we set out with a singular purpose: to bridge the gap between untamed wilderness and uncompromising luxury.
              </p>

              {/* Second Paragraph */}
              <p>
                As a family-owned business, we take a different approach to travel. We don't believe in standard itineraries. Instead, we craft journeys with the same care and attention to detail we would for our own kin. Our intimate size allows us to open doors that others can't—granting you access to exclusive lodges, private conservancies, and authentic cultural exchanges.
              </p>

              {/* Third Paragraph */}
              <p>
                Today, we are proud to be East Africa's curators of the extraordinary. When you travel with us, you aren't just a client; you become part of our story, and we become the dedicated architects of your most cherished memories.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Image Collage */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main Portrait Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-4/5 ml-auto rounded-xl overflow-hidden shadow-xl"
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={portraitImage}
                  alt="Maasai warrior or safari portrait"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            {/* Overlay Landscape Image */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="absolute bottom-8 left-4 w-1/2 z-10 rounded-xl overflow-hidden shadow-xl border-4 border-white"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={landscapeImage}
                  alt="Safari lodge interior or sunset game drive"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

