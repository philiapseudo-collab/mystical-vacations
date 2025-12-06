'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';
import type { IAccommodation } from '@/types';
import { formatPrice } from '@/utils/formatters';

interface RoomListProps {
  accommodation: IAccommodation;
  selectedRoomType: string | null;
  onSelectRoom: (roomType: string) => void;
}

export default function RoomList({
  accommodation,
  selectedRoomType,
  onSelectRoom,
}: RoomListProps) {
  // Get fallback image (second image from accommodation gallery, or first if only one)
  const fallbackImage =
    accommodation.images.length > 1
      ? accommodation.images[1]
      : accommodation.images[0] || {
          url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
          alt: 'Room',
        };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-navy mb-6">Available Rooms</h2>
      {accommodation.roomTypes.map((room, index) => {
        const isSelected = selectedRoomType === room.type;
        const roomImage = room.image || fallbackImage;

        return (
          <motion.div
            key={room.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectRoom(room.type)}
            className={`card p-6 cursor-pointer transition-all duration-300 ${
              isSelected
                ? 'border-4 border-gold shadow-xl bg-gold/5'
                : 'border-2 border-slate-200 hover:border-gold/50 hover:shadow-lg'
            }`}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Room Thumbnail */}
              <div className="relative w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={roomImage.url}
                  alt={roomImage.alt || `${room.type} at ${accommodation.name}`}
                  fill
                  className="object-cover"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-gold text-navy rounded-full p-2 shadow-lg">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-1">{room.type}</h3>
                    {room.bedType && (
                      <p className="text-sm text-slate-600">
                        Bed: <span className="font-semibold">{room.bedType}</span>
                      </p>
                    )}
                  </div>
                  {isSelected && (
                    <span className="bg-gold text-navy px-3 py-1 rounded-full text-xs font-bold">
                      Selected
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>Max {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</span>
                  </div>
                  {room.available ? (
                    <span className="text-green-600 font-semibold">✓ Available</span>
                  ) : (
                    <span className="text-red-600 font-semibold">✗ Unavailable</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Price per night</p>
                    <p className="text-2xl font-bold text-gold">
                      {formatPrice(room.pricePerNight)}
                    </p>
                  </div>
                  <button
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      isSelected
                        ? 'bg-navy text-gold hover:bg-navy-dark'
                        : 'bg-gold text-navy hover:bg-gold-dark'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Room'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

