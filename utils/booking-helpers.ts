import type { BookingSession, IPriceBreakdown } from '@/types';
import { getChildPrice } from './excursion-helpers';

/**
 * Calculate price breakdown for a booking session
 */
export function calculateBookingPrice(session: BookingSession): IPriceBreakdown | null {
  const basePrice = session.item.price;
  const { adults, children } = session.guests;

  switch (session.type) {
    case 'package': {
      // Package: price per person * guests
      if (session.details.type !== 'package') return null;
      const subtotal = basePrice * session.details.guests;
      const serviceFee = subtotal * 0.05; // 5% service fee
      const taxes = subtotal * 0.16; // 16% VAT
      return {
        basePrice,
        serviceFee: serviceFee / session.details.guests, // Per person
        taxes: taxes / session.details.guests, // Per person
        total: subtotal + serviceFee + taxes,
        currency: 'USD',
      };
    }

    case 'accommodation': {
      // Accommodation: price per night * nights (per room, assume 1 room)
      if (session.details.type !== 'accommodation') return null;
      const subtotal = basePrice * session.details.nights;
      const taxes = subtotal * 0.16; // 16% VAT
      return {
        basePrice,
        serviceFee: 0,
        taxes: taxes / session.details.nights, // Per night
        total: subtotal + taxes,
        currency: 'USD',
      };
    }

    case 'excursion': {
      // Excursion: (adult price * adults) + (child price * children)
      if (session.details.type !== 'excursion') return null;
      if (session.details.adults === 0 && session.details.children === 0) return null;
      // Child price defaults to 50% of adult price if not specified
      const childPriceValue = getChildPrice(basePrice);
      const subtotal = basePrice * session.details.adults + childPriceValue * session.details.children;
      const taxes = subtotal * 0.16; // 16% VAT
      return {
        basePrice: subtotal,
        serviceFee: 0,
        taxes,
        total: subtotal + taxes,
        currency: 'USD',
      };
    }

    case 'transport': {
      // Transport: ticket price * passengers
      if (session.details.type !== 'transport') return null;
      const subtotal = basePrice * session.details.passengers;
      const taxes = subtotal * 0.16; // 16% VAT
      return {
        basePrice,
        serviceFee: 0,
        taxes: taxes / session.details.passengers, // Per passenger
        total: subtotal + taxes,
        currency: 'USD',
      };
    }

    default:
      return null;
  }
}

/**
 * Validate and parse booking session from sessionStorage
 */
export function parseBookingSession(storageData: string): BookingSession | null {
  try {
    const parsed = JSON.parse(storageData);
    
    // Basic validation
    if (!parsed.type || !parsed.item || !parsed.details || !parsed.guests) {
      return null;
    }

    // Validate structure matches BookingSession
    if (
      typeof parsed.item.id !== 'string' ||
      typeof parsed.item.title !== 'string' ||
      typeof parsed.item.image !== 'string' ||
      typeof parsed.item.price !== 'number'
    ) {
      return null;
    }

    if (
      typeof parsed.guests.adults !== 'number' ||
      typeof parsed.guests.children !== 'number'
    ) {
      return null;
    }

    return parsed as BookingSession;
  } catch {
    return null;
  }
}

