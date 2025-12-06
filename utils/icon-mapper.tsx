/**
 * Unified icon mapping for Transport and Accommodation amenities
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
  Waves,
  Dumbbell,
  ParkingCircle,
  Camera,
  BookOpen,
  TreePine,
  Tent,
  Flame,
  Mountain,
  Droplets,
  Heart,
  Baby,
  Gamepad2,
  Music,
  ShoppingBag,
  Building2,
  type LucideIcon,
} from 'lucide-react';

/**
 * Unified icon mapping - case-insensitive matching
 * Keys are normalized (lowercase, no special chars)
 */
const ICON_MAP: Record<string, LucideIcon> = {
  // Transport amenities
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

  // Accommodation amenities
  pool: Waves,
  'swimming pool': Waves,
  'infinity pool': Waves,
  'multiple pools': Waves,
  '3 swimming pools': Waves,
  spa: Heart,
  'spa & wellness': Heart,
  'spa tent': Heart,
  gym: Dumbbell,
  'fitness center': Dumbbell,
  'fitness': Dumbbell,
  parking: ParkingCircle,
  'free parking': ParkingCircle,
  restaurant: Utensils,
  'fine dining': Utensils,
  '4 restaurants': Utensils,
  '3 restaurants': Utensils,
  'rooftop restaurant': Utensils,
  'organic restaurant': Utensils,
  bar: Coffee,
  'bar with fireplace': Coffee,
  beach: Waves,
  'private beach': Waves,
  'water sports': Waves,
  surf: Waves,
  'kids club': Baby,
  'game drives': Car,
  'night drives': Car,
  jeep: Car,
  'cultural tours': Camera,
  tour: Camera,
  library: BookOpen,
  'photography studio': Camera,
  camera: Camera,
  'hot air balloon': Plane,
  balloon: Plane,
  'butler service': Users,
  service: Users,
  'crater views': Mountain,
  'kilimanjaro views': Mountain,
  'panoramic views': Mountain,
  'mountain views': Mountain,
  view: Mountain,
  'treehouse rooms': TreePine,
  tree: TreePine,
  'luxury tents': Tent,
  tent: Tent,
  'riverside location': Droplets,
  river: Droplets,
  'private conservancy': Shield,
  conservation: Shield,
  'coffee plantation': Coffee,
  coffee: Coffee,
  'tennis courts': Gamepad2,
  tennis: Gamepad2,
  'maasai cultural show': Music,
  culture: Music,
  'gift shop': ShoppingBag,
  shop: ShoppingBag,
  'conference rooms': Building2,
  meeting: Building2,
  'garden suites': TreePine,
  garden: TreePine,
  yoga: Heart,
  'dhow excursions': Ship,
  boat: Ship,
  'all-inclusive': Utensils,
};

/**
 * Normalize amenity string for icon lookup
 */
function normalizeKey(key: string): string {
  return key.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
}

/**
 * Get icon component for an amenity key (transport or accommodation)
 * Returns CheckCircle as fallback if no match found
 */
export function getAmenityIcon(key: string): LucideIcon {
  const normalized = normalizeKey(key);
  return ICON_MAP[normalized] || CheckCircle;
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use getAmenityIcon instead
 */
export const getTransportAmenityIcon = getAmenityIcon;

