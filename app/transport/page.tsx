'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { ITransportRoute } from '@/types';
import { formatDuration, formatPrice, formatTime } from '@/utils/formatters';
import { groupTransportRoutes } from '@/utils/transport-helpers';
import TransportComparisonView from '@/components/TransportComparisonView';

export default function TransportPage() {
  const router = useRouter();
  const [transportRoutes, setTransportRoutes] = useState<ITransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<string>('all');

  useEffect(() => {
    async function fetchTransportRoutes() {
      try {
        const response = await fetch('/api/transport/search');
        const data = await response.json();
        if (data.success) {
          setTransportRoutes(data.data.routes);
        }
      } catch (error) {
        console.error('Failed to fetch transport routes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransportRoutes();
  }, []);

  // Filter routes
  const filtered = useMemo(() => {
    let routes = [...transportRoutes];
    if (filterMode !== 'all') {
      routes = routes.filter((route) =>
        route.segments.some((seg) => seg.mode === filterMode)
      );
    }
    return routes;
  }, [transportRoutes, filterMode]);

  // Group routes for comparison
  const { comparableGroups, standaloneRoutes } = useMemo(() => {
    return groupTransportRoutes(filtered);
  }, [filtered]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate-600">Loading transport routes...</p>
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
              <span className="text-gold">Transport</span> Options
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Flights, SGR trains, and multi-modal routes across East Africa
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-slate-200 sticky top-[72px] z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'Flight', 'SGR', 'Ferry', 'Charter', 'Bus'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-4 py-2 rounded-md font-semibold transition-all ${
                  filterMode === mode
                    ? 'bg-gold text-navy'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {mode === 'all' ? 'All Modes' : mode}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-slate-600">
              Showing <span className="font-semibold text-navy">{filtered.length}</span> routes
              {comparableGroups.length > 0 && (
                <span className="ml-2">
                  ({comparableGroups.length} comparison{comparableGroups.length > 1 ? 's' : ''})
                </span>
              )}
            </p>
          </div>

          {/* Comparison Views */}
          {comparableGroups.length > 0 && (
            <div className="space-y-8 mb-12">
              {comparableGroups.map((group) => (
                <TransportComparisonView
                  key={group.key}
                  flight={group.flight!}
                  sgrEconomy={group.sgrEconomy}
                  sgrFirstClass={group.sgrFirstClass}
                  origin={group.origin}
                  destination={group.destination}
                />
              ))}
            </div>
          )}

          {/* Standalone Routes (List View) */}
          {standaloneRoutes.length > 0 && (
            <div>
              {comparableGroups.length > 0 && (
                <h2 className="text-2xl font-serif font-bold text-navy mb-6">
                  Other Transport Options
                </h2>
              )}
              <div className="space-y-4">
                {standaloneRoutes.map((route, index) => (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Route Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-xl font-bold text-navy">{route.name}</h3>
                          {route.isMultiModal && (
                            <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded font-semibold">
                              Multi-modal
                            </span>
                          )}
                        </div>

                        {/* Segments */}
                        <div className="space-y-3">
                          {route.segments.map((segment, i) => (
                            <div key={segment.id} className="flex items-center gap-4">
                              {/* Mode Badge */}
                              <div className="flex-shrink-0">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  segment.mode === 'Flight' || segment.mode === 'Charter'
                                    ? 'bg-blue-100 text-blue-700'
                                    : segment.mode === 'SGR'
                                    ? 'bg-green-100 text-green-700'
                                    : segment.mode === 'Ferry'
                                    ? 'bg-cyan-100 text-cyan-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {segment.mode} {segment.class !== 'Economy' && `(${segment.class})`}
                                </span>
                              </div>

                              {/* Route Details */}
                              <div className="flex-1 flex items-center gap-2 text-sm">
                                <span className="font-semibold">{segment.departureLocation.city}</span>
                                <span className="text-slate-400">→</span>
                                <span className="font-semibold">{segment.arrivalLocation.city}</span>
                                <span className="text-slate-500 mx-2">•</span>
                                <span className="text-slate-600">
                                  {formatTime(segment.departureTime)} - {formatTime(segment.arrivalTime)}
                                </span>
                                <span className="text-slate-500 mx-2">•</span>
                                <span className="text-slate-600">{formatDuration(segment.duration)}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Amenities */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {route.segments[0].amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex lg:flex-col items-center lg:items-end gap-4">
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Total</p>
                          <p className="text-3xl font-bold text-gold">{formatPrice(route.totalPrice)}</p>
                          <p className="text-xs text-slate-500">{formatDuration(route.totalDuration)}</p>
                        </div>
                        <button
                          onClick={() => {
                            const firstSegment = route.segments[0];
                            const bookingSession = {
                              type: 'transport' as const,
                              item: {
                                id: route.id,
                                title: route.name,
                                image: '/images/transport-placeholder.jpg',
                                price: firstSegment.price,
                              },
                              details: {
                                type: 'transport' as const,
                                date: new Date().toISOString().split('T')[0],
                                time: firstSegment.departureTime,
                                origin: `${firstSegment.departureLocation.city}, ${firstSegment.departureLocation.country}`,
                                destination: `${firstSegment.arrivalLocation.city}, ${firstSegment.arrivalLocation.country}`,
                                class: firstSegment.class as 'Economy' | 'First Class',
                                passengers: 1,
                                routeId: route.id,
                              },
                              guests: {
                                adults: 1,
                                children: 0,
                              },
                            };
                            sessionStorage.setItem('bookingDetails', JSON.stringify(bookingSession));
                            router.push('/book/review');
                          }}
                          className="btn-primary whitespace-nowrap"
                        >
                          Select Route
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SGR Info */}
      <section className="py-12 bg-gold/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-serif font-bold text-navy mb-4">
              About the SGR (Standard Gauge Railway)
            </h2>
            <p className="text-slate-700 leading-relaxed">
              The Madaraka Express SGR is a modern railway connecting major cities in Kenya and Tanzania. 
              Enjoy comfortable travel with both Economy and First Class options, featuring air conditioning, 
              dining services, and spectacular views of the East African landscape.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

