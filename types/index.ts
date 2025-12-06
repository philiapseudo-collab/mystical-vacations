// ============================================
// CORE DATA MODELS - Mystical Vacations Platform
// ============================================

/**
 * Location data for Kenya/Tanzania destinations
 */
export interface ILocation {
  country: 'Kenya' | 'Tanzania';
  city: string;
  region?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Price breakdown for transparency
 */
export interface IPriceBreakdown {
  basePrice: number;
  serviceFee: number;
  taxes: number;
  discount?: number;
  total: number;
  currency: 'USD' | 'KES' | 'TZS';
}

/**
 * Image data with cinematic aspect ratios
 */
export interface IImage {
  url: string;
  alt: string;
  aspectRatio?: '16:9' | '4:3' | '21:9';
  credit?: string;
}

// ============================================
// PACKAGE MODELS
// ============================================

export interface IPackageItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation: string;
  meals: ('Breakfast' | 'Lunch' | 'Dinner')[];
}

export interface IPackage {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  duration: number; // in days
  maxGroupSize: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  locations: ILocation[];
  itinerary: IPackageItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  price: IPriceBreakdown;
  images: IImage[];
  highlights: string[];
  bestSeasons: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
}

// ============================================
// ACCOMMODATION MODELS
// ============================================

export type AccommodationType = 'Resort' | 'Lodge' | 'Hotel' | 'Villa' | 'Camp' | 'Boutique Hotel';

export interface IAccommodationAmenity {
  name: string;
  icon: string;
  available: boolean;
}

export interface IAccommodation {
  id: string;
  name: string;
  slug: string;
  type: AccommodationType;
  description: string;
  location: ILocation;
  starRating: number;
  amenities: IAccommodationAmenity[];
  roomTypes: {
    type: string;
    capacity: number;
    pricePerNight: number;
    available: boolean;
    bedType?: 'King' | 'Twin' | 'Double' | 'Family';
    image?: IImage;
  }[];
  images: IImage[];
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  checkInTime: string;
  checkOutTime: string;
}

// ============================================
// TRANSPORT MODELS
// ============================================

export type TransportMode = 'Flight' | 'SGR' | 'Bus' | 'Ferry' | 'Charter';
export type TransportClass = 'Economy' | 'Business' | 'First Class';

export interface ITransportSegment {
  id: string;
  mode: TransportMode;
  operator: string;
  departureLocation: ILocation;
  arrivalLocation: ILocation;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  class: TransportClass;
  price: number;
  availableSeats: number;
  amenities: string[];
}

export interface ITransportRoute {
  id: string;
  name: string;
  slug: string;
  segments: ITransportSegment[];
  totalDuration: number; // in minutes
  totalPrice: number;
  isMultiModal: boolean; // true if combines Flight + SGR, etc.
}

export interface ITransportSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class?: TransportClass;
}

export interface ITransportSearchResponse {
  routes: ITransportRoute[];
  searchId: string;
  timestamp: string;
}

// ============================================
// EXCURSION MODELS
// ============================================

export type ExcursionCategory = 'Safari' | 'Culture' | 'Beach' | 'Adventure' | 'Food & Wine' | 'Wellness';

export interface IExcursion {
  id: string;
  title: string;
  slug: string;
  category: ExcursionCategory;
  description: string;
  duration: number; // in hours
  location: ILocation;
  price: number; // Adult price
  childPrice?: number; // Optional child price
  images: IImage[];
  included: string[];
  notIncluded: string[];
  maxParticipants: number;
  minAge?: number;
  difficultyLevel: 'Easy' | 'Moderate' | 'Strenuous';
  availableTimes: string[]; // e.g., ["09:00", "14:00"]
  itinerary?: Array<{ time: string; activity: string }>; // Optional timeline
  requirements?: string[]; // What to carry/prepare
  languages?: string[]; // Available languages
  rating: number;
  reviewCount: number;
  featured: boolean;
  highlights: string[];
}

// ============================================
// BOOKING MODELS
// ============================================

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type BookingType = 'package' | 'accommodation' | 'excursion' | 'transport';

/**
 * Booking details specific to each booking type
 */
export type BookingDetails =
  | { type: 'package'; date: string; guests: number }
  | {
      type: 'accommodation';
      checkIn: string;
      checkOut: string;
      nights: number;
      roomId: string;
      roomName: string;
      guests: number;
    }
  | {
      type: 'excursion';
      date: string;
      time?: string;
      adults: number;
      children: number;
      requirements?: string[];
    }
  | {
      type: 'transport';
      date: string;
      time: string;
      origin: string;
      destination: string;
      class: 'Economy' | 'First Class';
      passengers: number;
      routeId: string;
    };

/**
 * Standardized booking session storage schema
 */
export interface BookingSession {
  type: BookingType;
  item: {
    id: string;
    title: string;
    image: string; // URL only
    price: number; // Base price per unit
  };
  details: BookingDetails;
  guests: {
    adults: number;
    children: number;
  };
}

export interface IBookingItem {
  type: 'package' | 'accommodation' | 'transport' | 'excursion';
  itemId: string;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
  dateFrom?: string;
  dateTo?: string;
  specialRequests?: string;
}

export interface IBooking {
  id: string;
  bookingReference: string;
  items: IBookingItem[];
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality: string;
    passportNumber?: string;
    specialRequests?: string;
  };
  priceBreakdown: IPriceBreakdown;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
}

// ============================================
// PAYMENT MODELS (Mock Implementation)
// ============================================

export interface IPaymentMethod {
  type: 'card' | 'mpesa' | 'bank_transfer';
  provider?: 'Visa' | 'Mastercard' | 'M-Pesa' | 'Airtel Money';
}

export interface IPaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: IPaymentMethod;
  cardDetails?: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
  };
  mpesaDetails?: {
    phoneNumber: string;
  };
}

export interface IPaymentResponse {
  success: boolean;
  transactionId: string;
  paymentStatus: 'completed' | 'pending' | 'failed';
  message?: string;
  sgrTicket?: ISGRTicket; // For SGR bookings
}

// ============================================
// SGR (Standard Gauge Railway) ABSTRACTION
// ============================================

export interface ISGRTicket {
  ticketNumber: string;
  route: string;
  trainNumber: string;
  class: 'Economy' | 'First Class';
  seatNumber: string;
  departureTime: string;
  arrivalTime: string;
  passengerName: string;
  qrCode: string; // Base64 or URL
  bookingReference: string;
}

export interface ISGRBookingRequest {
  routeId: string;
  passengers: number;
  class: 'Economy' | 'First Class';
  departureDate: string;
  paymentToken: string; // From payment gateway
}

export interface ISGRBookingResponse {
  success: boolean;
  tickets: ISGRTicket[];
  mpesaTransactionId?: string; // Backend handles M-Pesa internally
  message?: string;
}

// ============================================
// SEARCH & FILTER MODELS
// ============================================

export interface ISearchFilters {
  categories?: ExcursionCategory[];
  priceRange?: {
    min: number;
    max: number;
  };
  locations?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  rating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popular' | 'name';
}

// ============================================
// API RESPONSE WRAPPERS
// ============================================

export interface IAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

