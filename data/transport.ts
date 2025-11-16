/**
 * Mock transport data for Mystical Vacations
 * 8 multi-modal routes combining Flights and SGR trains
 */

import { ITransportRoute, ITransportSegment } from '@/types';

// Helper function to create transport segments
const createSegment = (data: Partial<ITransportSegment>): ITransportSegment => ({
  id: data.id || 'seg-' + Math.random().toString(36).substr(2, 9),
  mode: data.mode || 'Flight',
  operator: data.operator || '',
  departureLocation: data.departureLocation!,
  arrivalLocation: data.arrivalLocation!,
  departureTime: data.departureTime || '09:00',
  arrivalTime: data.arrivalTime || '10:00',
  duration: data.duration || 60,
  class: data.class || 'Economy',
  price: data.price || 100,
  availableSeats: data.availableSeats || 20,
  amenities: data.amenities || [],
});

export const transportRoutes: ITransportRoute[] = [
  // Route 1: Nairobi to Mombasa (Flight vs SGR comparison)
  {
    id: 'route-001-flight',
    name: 'Nairobi to Mombasa - Flight',
    slug: 'nairobi-mombasa-flight',
    segments: [
      createSegment({
        id: 'seg-001-flight',
        mode: 'Flight',
        operator: 'Kenya Airways',
        departureLocation: { country: 'Kenya', city: 'Nairobi' },
        arrivalLocation: { country: 'Kenya', city: 'Mombasa' },
        departureTime: '08:00',
        arrivalTime: '09:00',
        duration: 60,
        class: 'Economy',
        price: 120,
        availableSeats: 45,
        amenities: ['In-flight snack', 'Baggage 23kg', 'Seat selection'],
      }),
    ],
    totalDuration: 60,
    totalPrice: 120,
    isMultiModal: false,
  },
  {
    id: 'route-001-sgr',
    name: 'Nairobi to Mombasa - Madaraka Express (SGR)',
    slug: 'nairobi-mombasa-sgr',
    segments: [
      createSegment({
        id: 'seg-001-sgr',
        mode: 'SGR',
        operator: 'Madaraka Express',
        departureLocation: { country: 'Kenya', city: 'Nairobi' },
        arrivalLocation: { country: 'Kenya', city: 'Mombasa' },
        departureTime: '08:00',
        arrivalTime: '13:30',
        duration: 330, // 5.5 hours
        class: 'Economy',
        price: 35,
        availableSeats: 120,
        amenities: ['AC coach', 'Snacks available', 'USB charging', 'Scenic views', 'Spacious seats'],
      }),
    ],
    totalDuration: 330,
    totalPrice: 35,
    isMultiModal: false,
  },
  {
    id: 'route-001-sgr-first',
    name: 'Nairobi to Mombasa - Madaraka Express First Class',
    slug: 'nairobi-mombasa-sgr-first',
    segments: [
      createSegment({
        id: 'seg-001-sgr-first',
        mode: 'SGR',
        operator: 'Madaraka Express',
        departureLocation: { country: 'Kenya', city: 'Nairobi' },
        arrivalLocation: { country: 'Kenya', city: 'Mombasa' },
        departureTime: '08:00',
        arrivalTime: '13:30',
        duration: 330,
        class: 'First Class',
        price: 100,
        availableSeats: 40,
        amenities: ['Premium seats', 'Complimentary meals', 'USB & power outlets', 'Wi-Fi', 'Priority boarding'],
      }),
    ],
    totalDuration: 330,
    totalPrice: 100,
    isMultiModal: false,
  },

  // Route 2: Nairobi to Zanzibar (Multi-modal: Flight to Dar + Ferry)
  {
    id: 'route-002',
    name: 'Nairobi to Zanzibar via Dar es Salaam',
    slug: 'nairobi-zanzibar-multimodal',
    segments: [
      createSegment({
        id: 'seg-002-flight',
        mode: 'Flight',
        operator: 'Precision Air',
        departureLocation: { country: 'Kenya', city: 'Nairobi' },
        arrivalLocation: { country: 'Tanzania', city: 'Dar es Salaam' },
        departureTime: '10:00',
        arrivalTime: '11:30',
        duration: 90,
        class: 'Economy',
        price: 180,
        availableSeats: 30,
        amenities: ['In-flight meal', 'Baggage 20kg', 'Seat selection'],
      }),
      createSegment({
        id: 'seg-002-ferry',
        mode: 'Ferry',
        operator: 'Azam Marine',
        departureLocation: { country: 'Tanzania', city: 'Dar es Salaam' },
        arrivalLocation: { country: 'Tanzania', city: 'Zanzibar' },
        departureTime: '14:00',
        arrivalTime: '16:00',
        duration: 120,
        class: 'Economy',
        price: 35,
        availableSeats: 150,
        amenities: ['Air conditioned', 'Refreshments', 'Ocean views', 'Life jackets'],
      }),
    ],
    totalDuration: 360, // 6 hours including layover
    totalPrice: 215,
    isMultiModal: true,
  },

  // Route 3: Arusha to Serengeti (Charter flight)
  {
    id: 'route-003',
    name: 'Arusha to Serengeti - Charter Flight',
    slug: 'arusha-serengeti-charter',
    segments: [
      createSegment({
        id: 'seg-003-charter',
        mode: 'Charter',
        operator: 'Coastal Aviation',
        departureLocation: { country: 'Tanzania', city: 'Arusha' },
        arrivalLocation: { country: 'Tanzania', city: 'Serengeti' },
        departureTime: '09:00',
        arrivalTime: '10:15',
        duration: 75,
        class: 'First Class',
        price: 250,
        availableSeats: 12,
        amenities: ['Light aircraft', 'Aerial views', 'Baggage 15kg', 'Direct transfer'],
      }),
    ],
    totalDuration: 75,
    totalPrice: 250,
    isMultiModal: false,
  },

  // Route 4: Mombasa to Diani Beach (SGR + Road transfer)
  {
    id: 'route-004',
    name: 'Mombasa to Diani Beach',
    slug: 'mombasa-diani-transfer',
    segments: [
      createSegment({
        id: 'seg-004-bus',
        mode: 'Bus',
        operator: 'Diani Shuttle',
        departureLocation: { country: 'Kenya', city: 'Mombasa' },
        arrivalLocation: { country: 'Kenya', city: 'Diani Beach' },
        departureTime: '10:00',
        arrivalTime: '11:30',
        duration: 90,
        class: 'Economy',
        price: 25,
        availableSeats: 40,
        amenities: ['AC bus', 'Wi-Fi', 'Comfortable seats', 'Baggage included'],
      }),
    ],
    totalDuration: 90,
    totalPrice: 25,
    isMultiModal: false,
  },

  // Route 5: Nairobi to Maasai Mara (Flight)
  {
    id: 'route-005',
    name: 'Nairobi to Maasai Mara - Air Safari',
    slug: 'nairobi-maasai-mara-flight',
    segments: [
      createSegment({
        id: 'seg-005-flight',
        mode: 'Charter',
        operator: 'SafariLink',
        departureLocation: { country: 'Kenya', city: 'Nairobi' },
        arrivalLocation: { country: 'Kenya', city: 'Maasai Mara' },
        departureTime: '07:30',
        arrivalTime: '08:30',
        duration: 60,
        class: 'Business',
        price: 220,
        availableSeats: 12,
        amenities: ['Light aircraft', 'Aerial wildlife viewing', 'Baggage 15kg', 'Direct airstrip transfer'],
      }),
    ],
    totalDuration: 60,
    totalPrice: 220,
    isMultiModal: false,
  },

  // Route 6: Nairobi to Amboseli (Road transfer)
  {
    id: 'route-006',
    name: 'Nairobi to Amboseli - Road Transfer',
    slug: 'nairobi-amboseli-road',
    segments: [
      createSegment({
        id: 'seg-006-bus',
        mode: 'Bus',
        operator: 'Safari Transport',
        departureLocation: { country: 'Kenya', city: 'Nairobi' },
        arrivalLocation: { country: 'Kenya', city: 'Amboseli' },
        departureTime: '06:00',
        arrivalTime: '10:00',
        duration: 240,
        class: 'Economy',
        price: 60,
        availableSeats: 25,
        amenities: ['4x4 safari vehicle', 'Professional driver', 'En route game viewing', 'Bottled water'],
      }),
    ],
    totalDuration: 240,
    totalPrice: 60,
    isMultiModal: false,
  },

  // Route 7: Kilimanjaro Airport to Arusha to Ngorongoro (Multi-segment road)
  {
    id: 'route-007',
    name: 'Kilimanjaro Airport to Ngorongoro via Arusha',
    slug: 'kilimanjaro-ngorongoro-road',
    segments: [
      createSegment({
        id: 'seg-007-transfer',
        mode: 'Bus',
        operator: 'Tanzania Safari Transport',
        departureLocation: { country: 'Tanzania', city: 'Arusha' },
        arrivalLocation: { country: 'Tanzania', city: 'Ngorongoro Crater' },
        departureTime: '08:00',
        arrivalTime: '12:00',
        duration: 240,
        class: 'Economy',
        price: 80,
        availableSeats: 20,
        amenities: ['4x4 safari vehicle', 'En route viewing', 'Lunch stop', 'Scenic drive'],
      }),
    ],
    totalDuration: 240,
    totalPrice: 80,
    isMultiModal: false,
  },

  // Route 8: Dar es Salaam to Zanzibar (Fast Ferry vs Flight)
  {
    id: 'route-008-ferry',
    name: 'Dar es Salaam to Zanzibar - Fast Ferry',
    slug: 'dar-zanzibar-ferry',
    segments: [
      createSegment({
        id: 'seg-008-ferry',
        mode: 'Ferry',
        operator: 'Azam Marine Fast Ferry',
        departureLocation: { country: 'Tanzania', city: 'Dar es Salaam' },
        arrivalLocation: { country: 'Tanzania', city: 'Zanzibar' },
        departureTime: '09:30',
        arrivalTime: '11:30',
        duration: 120,
        class: 'Business',
        price: 50,
        availableSeats: 100,
        amenities: ['VIP lounge', 'Refreshments', 'Air conditioned', 'Ocean views', 'Fast boarding'],
      }),
    ],
    totalDuration: 120,
    totalPrice: 50,
    isMultiModal: false,
  },
  {
    id: 'route-008-flight',
    name: 'Dar es Salaam to Zanzibar - Flight',
    slug: 'dar-zanzibar-flight',
    segments: [
      createSegment({
        id: 'seg-008-flight',
        mode: 'Flight',
        operator: 'Coastal Aviation',
        departureLocation: { country: 'Tanzania', city: 'Dar es Salaam' },
        arrivalLocation: { country: 'Tanzania', city: 'Zanzibar' },
        departureTime: '10:00',
        arrivalTime: '10:20',
        duration: 20,
        class: 'Economy',
        price: 85,
        availableSeats: 12,
        amenities: ['Light aircraft', 'Aerial views', 'Quick transfer', 'Baggage 15kg'],
      }),
    ],
    totalDuration: 20,
    totalPrice: 85,
    isMultiModal: false,
  },
];

/**
 * Search transport routes by origin and destination
 */
export function searchTransportRoutes(
  origin: string,
  destination: string
): ITransportRoute[] {
  return transportRoutes.filter((route) => {
    const firstSegment = route.segments[0];
    const lastSegment = route.segments[route.segments.length - 1];
    
    return (
      firstSegment.departureLocation.city.toLowerCase().includes(origin.toLowerCase()) &&
      lastSegment.arrivalLocation.city.toLowerCase().includes(destination.toLowerCase())
    );
  });
}

