/**
 * Amenity icon mapping for transport routes
 * Maps amenity strings to lucide-react icon components
 */

import {
  Wifi,
  Utensils,
  Wind,
  Luggage,
  CheckCircle,
  Zap,
  Coffee,
  MapPin,
  Shield,
  Users,
  Clock,
  Plane,
  Train,
  Ship,
  Bus,
  Car,
  type LucideIcon,
} from 'lucide-react';

/**
 * Icon mapping - case-insensitive matching
 * Keys are normalized (lowercase, no special chars)
 */
export const AMENITY_ICONS: Record<string, LucideIcon> = {
  wifi: Wifi,
  'wi-fi': Wifi,
  internet: Wifi,
  meals: Utensils,
  meal: Utensils,
  food: Utensils,
  'complimentary meals': Utensils,
  'in-flight meal': Utensils,
  'in-flight snack': Utensils,
  ac: Wind,
  'air conditioning': Wind,
  'air conditioned': Wind,
  baggage: Luggage,
  luggage: Luggage,
  'baggage 23kg': Luggage,
  'baggage 20kg': Luggage,
  'baggage 15kg': Luggage,
  charging: Zap,
  'usb charging': Zap,
  'usb & power outlets': Zap,
  'power outlets': Zap,
  refreshments: Coffee,
  'seat selection': Users,
  'scenic views': MapPin,
  'ocean views': MapPin,
  'aerial views': MapPin,
  'en route viewing': MapPin,
  'en route game viewing': MapPin,
  'life jackets': Shield,
  'priority boarding': Clock,
  'direct transfer': Car,
  'direct airstrip transfer': Car,
  'light aircraft': Plane,
  'spacious seats': Users,
  'comfortable seats': Users,
  'premium seats': Users,
  'vip lounge': Users,
  'fast boarding': Clock,
  'lunch stop': Utensils,
  'scenic drive': Car,
  '4x4 safari vehicle': Car,
  'professional driver': Users,
  'bottled water': Coffee,
  'game viewing': MapPin,
};

/**
 * Normalize amenity string for icon lookup
 */
function normalizeAmenity(amenity: string): string {
  return amenity.toLowerCase().trim();
}

/**
 * Get icon component for an amenity string
 * Returns CheckCircle as fallback if no match found
 */
export function getAmenityIcon(amenity: string): LucideIcon {
  const normalized = normalizeAmenity(amenity);
  return AMENITY_ICONS[normalized] || CheckCircle;
}

