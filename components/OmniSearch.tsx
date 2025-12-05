'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type SearchTab = 'Packages' | 'Accommodation' | 'Transport' | 'Excursions';

interface SearchFormData {
  destination: string;
  destinationTo?: string; // For Transport tab "To" field
  dateFrom: string;
  dateTo?: string;
  guests: number;
}

export default function OmniSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>('Packages');
  const [formData, setFormData] = useState<SearchFormData>({
    destination: '',
    destinationTo: '',
    dateFrom: '',
    dateTo: '',
    guests: 2,
  });

  const tabs: SearchTab[] = ['Packages', 'Accommodation', 'Transport', 'Excursions'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build search query
    const params = new URLSearchParams();
    if (formData.destination) params.set('destination', formData.destination);
    if (activeTab === 'Transport' && formData.destinationTo) {
      params.set('destinationTo', formData.destinationTo);
    }
    if (formData.dateFrom) params.set('from', formData.dateFrom);
    if (formData.dateTo) params.set('to', formData.dateTo);
    params.set('guests', formData.guests.toString());

    // Navigate based on active tab
    const routes: Record<SearchTab, string> = {
      Packages: '/packages',
      Accommodation: '/accommodation',
      Transport: '/transport',
      Excursions: '/excursions',
    };

    router.push(`${routes[activeTab]}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-3 rounded-t-lg font-semibold transition-all duration-300 ${
              activeTab === tab
                ? 'bg-white text-navy shadow-lg'
                : 'bg-navy-light text-slate-300 hover:text-white hover:bg-navy'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gold"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-2xl p-6 md:p-8"
      >
        <form onSubmit={handleSearch} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {/* Destination */}
              <div className="flex flex-col">
                <label htmlFor="destination" className="text-sm font-semibold text-navy mb-2">
                  {activeTab === 'Transport' ? 'From' : 'Destination'}
                </label>
                <select
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select destination</option>
                  <optgroup label="Kenya">
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Maasai Mara">Maasai Mara</option>
                    <option value="Amboseli">Amboseli</option>
                    <option value="Diani Beach">Diani Beach</option>
                    <option value="Lamu">Lamu</option>
                  </optgroup>
                  <optgroup label="Tanzania">
                    <option value="Arusha">Arusha</option>
                    <option value="Serengeti">Serengeti</option>
                    <option value="Zanzibar">Zanzibar</option>
                    <option value="Ngorongoro Crater">Ngorongoro Crater</option>
                    <option value="Mount Kilimanjaro">Mount Kilimanjaro</option>
                  </optgroup>
                </select>
              </div>

              {/* Transport: Add "To" field */}
              {activeTab === 'Transport' && (
                <div className="flex flex-col">
                  <label htmlFor="destination-to" className="text-sm font-semibold text-navy mb-2">
                    To
                  </label>
                  <select
                    id="destination-to"
                    value={formData.destinationTo}
                    onChange={(e) => setFormData({ ...formData, destinationTo: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Select destination</option>
                    <optgroup label="Kenya">
                      <option value="Nairobi">Nairobi</option>
                      <option value="Mombasa">Mombasa</option>
                      <option value="Maasai Mara">Maasai Mara</option>
                    </optgroup>
                    <optgroup label="Tanzania">
                      <option value="Arusha">Arusha</option>
                      <option value="Zanzibar">Zanzibar</option>
                      <option value="Dar es Salaam">Dar es Salaam</option>
                    </optgroup>
                  </select>
                </div>
              )}

              {/* Date From */}
              <div className="flex flex-col">
                <label htmlFor="dateFrom" className="text-sm font-semibold text-navy mb-2">
                  {activeTab === 'Transport' ? 'Departure Date' : 'Check-in / Start Date'}
                </label>
                <input
                  type="date"
                  id="dateFrom"
                  value={formData.dateFrom}
                  onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="input"
                  required
                />
              </div>

              {/* Date To (optional for some tabs) */}
              {activeTab !== 'Excursions' && (
                <div className="flex flex-col">
                  <label htmlFor="dateTo" className="text-sm font-semibold text-navy mb-2">
                    {activeTab === 'Transport' ? 'Return Date (Optional)' : 'Check-out / End Date'}
                  </label>
                  <input
                    type="date"
                    id="dateTo"
                    value={formData.dateTo}
                    onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                    min={formData.dateFrom || new Date().toISOString().split('T')[0]}
                    className="input"
                  />
                </div>
              )}

              {/* Guests */}
              <div className="flex flex-col">
                <label htmlFor="guests" className="text-sm font-semibold text-navy mb-2">
                  {activeTab === 'Transport' ? 'Passengers' : 'Guests'}
                </label>
                <input
                  type="number"
                  id="guests"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  min="1"
                  max="20"
                  className="input"
                  required
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Search Button */}
          <div className="flex justify-center pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-12 py-4 rounded-lg"
            >
              Search {activeTab}
            </motion.button>
          </div>
        </form>

        {/* Quick Links */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 text-center mb-3">Popular destinations:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Serengeti', 'Maasai Mara', 'Zanzibar', 'Kilimanjaro', 'Amboseli'].map((dest) => (
              <button
                key={dest}
                onClick={() => setFormData({ ...formData, destination: dest })}
                className="px-4 py-2 text-sm border border-gold text-gold rounded-full hover:bg-gold hover:text-navy transition-all duration-300"
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

