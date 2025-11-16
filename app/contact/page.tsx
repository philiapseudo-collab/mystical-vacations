'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

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
              Get in <span className="text-gold">Touch</span>
            </h1>
            <p className="text-xl text-slate-300">
              Let&apos;s start planning your extraordinary East African adventure
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-bold text-navy mb-4">Contact Information</h3>
                <div className="space-y-4 text-slate-700">
                  <div>
                    <p className="font-semibold text-navy mb-1">📧 Email</p>
                    <a href="mailto:info@mysticalvacations.com" className="text-gold hover:underline">
                      info@mysticalvacations.com
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold text-navy mb-1">📞 Phone</p>
                    <p>+254 (0) 700 000 000</p>
                  </div>
                  <div>
                    <p className="font-semibold text-navy mb-1">📍 Address</p>
                    <p>Westlands, Nairobi</p>
                    <p>Kenya</p>
                  </div>
                  <div>
                    <p className="font-semibold text-navy mb-1">🕐 Office Hours</p>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gold/10 rounded-lg p-6"
              >
                <h3 className="text-lg font-bold text-navy mb-3">Quick Response</h3>
                <p className="text-sm text-slate-700">
                  We typically respond to all inquiries within 24 hours. For urgent matters, 
                  please call us directly.
                </p>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-md p-8"
              >
                <h2 className="text-2xl font-serif font-bold text-navy mb-6">Send Us a Message</h2>
                
                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="text-green-600 text-5xl mb-4">✓</div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                    <p className="text-green-700">
                      Thank you for contacting us. We&apos;ll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-navy mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="input"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-navy mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="input"
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="booking">Booking Question</option>
                          <option value="custom">Custom Package</option>
                          <option value="support">Support</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-navy mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        className="input"
                        placeholder="Tell us about your dream vacation..."
                        required
                      />
                    </div>

                    <button type="submit" className="btn-primary w-full md:w-auto">
                      Send Message
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

