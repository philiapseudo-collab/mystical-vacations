'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-navy text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              About <span className="text-gold">Mystical Vacations</span>
            </h1>
            <p className="text-xl text-slate-300">
              Crafting extraordinary journeys through East Africa's most breathtaking destinations since 2010
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-md p-8 md:p-12"
            >
              <h2 className="text-3xl font-serif font-bold text-navy mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none text-slate-700 space-y-4">
                <p>
                  Founded in 2010, Mystical Vacations was born from a passion for showcasing the extraordinary beauty 
                  and cultural richness of Kenya and Tanzania. Our founders, seasoned travelers and conservationists, 
                  recognized the need for luxury travel experiences that honor both the land and its people.
                </p>
                <p>
                  Today, we are East Africa's premier luxury travel company, specializing in bespoke safaris, 
                  cultural immersions, and coastal escapes. Our deep local knowledge, commitment to sustainability, 
                  and partnerships with the finest lodges and camps ensure unforgettable experiences.
                </p>
                <p>
                  Every journey we craft tells a story—of ancient migrations, vibrant cultures, and pristine 
                  wilderness. We believe that luxury travel should not only provide comfort and exclusivity but 
                  also create meaningful connections with the destinations we explore.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Sustainable Tourism',
                description: 'We partner with eco-conscious lodges and support conservation efforts to protect East Africa\'s natural heritage.',
                icon: '🌍',
              },
              {
                title: 'Authentic Experiences',
                description: 'Every journey is designed to create genuine connections with local communities and cultures.',
                icon: '🤝',
              },
              {
                title: 'Uncompromising Quality',
                description: 'From accommodation to guides, we ensure every aspect of your journey meets the highest standards.',
                icon: '⭐',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8 bg-navy-light rounded-lg"
              >
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gold mb-3">{value.title}</h3>
                <p className="text-slate-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
              Our <span className="text-gold">Team</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Meet the passionate individuals dedicated to crafting your perfect East African adventure
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <p className="text-slate-700 text-center">
              Our team comprises experienced travel designers, certified safari guides, and local experts 
              who bring decades of combined knowledge about Kenya and Tanzania. Each member shares a deep 
              love for East Africa and is committed to creating transformative travel experiences.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-navy via-navy-light to-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Let us create a bespoke itinerary tailored to your dreams
            </p>
            <a href="/contact">
              <button className="btn-primary text-lg">Contact Us Today</button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

