/**
 * Global constants for Mystical Vacations platform
 */

// Brand colors (matching tailwind.config.ts)
export const COLORS = {
  navy: '#0A192F',
  navyLight: '#112240',
  navyDark: '#020c1b',
  gold: '#D4AF37',
  goldLight: '#E5C158',
  goldDark: '#B8941F',
} as const;

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const API_ENDPOINTS = {
  packages: '/packages',
  accommodation: '/accommodation',
  transport: '/transport',
  excursions: '/excursions',
  booking: '/booking',
  payment: '/payment',
  sgr: '/sgr',
} as const;

// Popular destinations
export const KENYA_DESTINATIONS = [
  'Nairobi',
  'Mombasa',
  'Maasai Mara',
  'Amboseli',
  'Diani Beach',
  'Lamu',
  'Tsavo',
  'Lake Nakuru',
] as const;

export const TANZANIA_DESTINATIONS = [
  'Dar es Salaam',
  'Zanzibar',
  'Serengeti',
  'Arusha',
  'Ngorongoro Crater',
  'Mount Kilimanjaro',
  'Tarangire',
  'Lake Manyara',
] as const;

// Search categories
export const SEARCH_CATEGORIES = [
  'Packages',
  'Accommodation',
  'Transport',
  'Excursions',
] as const;

// Excursion categories
export const EXCURSION_CATEGORIES = [
  'Safari',
  'Culture',
  'Beach',
  'Adventure',
  'Food & Wine',
  'Wellness',
] as const;

// Transport classes
export const TRANSPORT_CLASSES = ['Economy', 'Business', 'First Class'] as const;

// Accommodation types
export const ACCOMMODATION_TYPES = [
  'Resort',
  'Lodge',
  'Hotel',
  'Villa',
  'Camp',
  'Boutique Hotel',
] as const;

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 - $1,000', min: 500, max: 1000 },
  { label: '$1,000 - $2,500', min: 1000, max: 2500 },
  { label: '$2,500 - $5,000', min: 2500, max: 5000 },
  { label: 'Over $5,000', min: 5000, max: Infinity },
] as const;

// Booking flow steps
export const BOOKING_STEPS = [
  { step: 1, name: 'Review', path: '/book/review' },
  { step: 2, name: 'Payment', path: '/book/payment' },
  { step: 3, name: 'Confirmation', path: '/book/confirm' },
] as const;

// Default meta data
export const DEFAULT_META = {
  siteName: 'Mystical Vacations',
  description: 'Experience the mystical luxury of East Africa. Curated journeys through Kenya and Tanzania&apos;s most breathtaking destinations.',
  keywords: 'luxury travel, Kenya, Tanzania, safari, Zanzibar, Serengeti, Maasai Mara, luxury tours',
  ogImage: '/og-image.jpg',
} as const;

