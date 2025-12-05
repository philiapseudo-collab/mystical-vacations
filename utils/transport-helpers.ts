/**
 * Transport route grouping and comparison utilities
 */

import type { ITransportRoute, ITransportSegment } from '@/types';

/**
 * Route group key: "origin-destination" format
 */
type RouteKey = string;

/**
 * Grouped routes with Flight and SGR options
 */
export interface IRouteGroup {
  key: RouteKey;
  origin: string;
  destination: string;
  flight?: ITransportRoute;
  sgrEconomy?: ITransportRoute;
  sgrFirstClass?: ITransportRoute;
  otherRoutes: ITransportRoute[]; // Multi-modal or other modes
}

/**
 * Generate route key from origin and destination
 */
function getRouteKey(origin: string, destination: string): RouteKey {
  return `${origin.toLowerCase()}-${destination.toLowerCase()}`;
}

/**
 * Check if route is a Flight
 */
function isFlight(route: ITransportRoute): boolean {
  return route.segments.some((seg) => seg.mode === 'Flight');
}

/**
 * Check if route is SGR
 */
function isSGR(route: ITransportRoute): boolean {
  return route.segments.some((seg) => seg.mode === 'SGR');
}

/**
 * Get SGR class from route
 */
function getSGRClass(route: ITransportRoute): 'Economy' | 'First Class' | null {
  const sgrSegment = route.segments.find((seg) => seg.mode === 'SGR');
  if (!sgrSegment) return null;
  return sgrSegment.class === 'First Class' ? 'First Class' : 'Economy';
}

/**
 * Get origin and destination from route
 */
function getRouteEndpoints(route: ITransportRoute): { origin: string; destination: string } {
  const firstSegment = route.segments[0];
  const lastSegment = route.segments[route.segments.length - 1];
  return {
    origin: firstSegment.departureLocation.city,
    destination: lastSegment.arrivalLocation.city,
  };
}

/**
 * Group transport routes by origin/destination
 * Returns grouped routes and standalone routes
 */
export function groupTransportRoutes(
  routes: ITransportRoute[]
): {
  comparableGroups: IRouteGroup[];
  standaloneRoutes: ITransportRoute[];
} {
  const groups = new Map<RouteKey, IRouteGroup>();
  const standalone: ITransportRoute[] = [];

  for (const route of routes) {
    const { origin, destination } = getRouteEndpoints(route);
    const key = getRouteKey(origin, destination);

    // Initialize group if it doesn't exist
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        origin,
        destination,
        otherRoutes: [],
      });
    }

    const group = groups.get(key)!;

    // Categorize route
    if (isFlight(route)) {
      group.flight = route;
    } else if (isSGR(route)) {
      const sgrClass = getSGRClass(route);
      if (sgrClass === 'First Class') {
        group.sgrFirstClass = route;
      } else {
        group.sgrEconomy = route;
      }
    } else {
      // Multi-modal or other modes
      group.otherRoutes.push(route);
    }
  }

  // Separate comparable groups from standalone routes
  const comparableGroups: IRouteGroup[] = [];
  const standaloneRoutes: ITransportRoute[] = [];

  for (const group of groups.values()) {
    // A group is "comparable" if it has both Flight AND at least one SGR option
    const hasFlight = !!group.flight;
    const hasSGR = !!(group.sgrEconomy || group.sgrFirstClass);

    if (hasFlight && hasSGR) {
      comparableGroups.push(group);
    } else {
      // Add all routes from this group to standalone
      if (group.flight) standaloneRoutes.push(group.flight);
      if (group.sgrEconomy) standaloneRoutes.push(group.sgrEconomy);
      if (group.sgrFirstClass) standaloneRoutes.push(group.sgrFirstClass);
      standaloneRoutes.push(...group.otherRoutes);
    }
  }

  return { comparableGroups, standaloneRoutes };
}

/**
 * Calculate "Best Value" badge
 * Returns: 'fastest' | 'cheapest' | 'best-value' | null
 */
export function calculateBestValue(
  flight?: ITransportRoute,
  sgrEconomy?: ITransportRoute,
  sgrFirstClass?: ITransportRoute
): {
  flight?: 'fastest' | 'cheapest' | 'best-value';
  sgr?: 'fastest' | 'cheapest' | 'best-value';
} {
  const result: {
    flight?: 'fastest' | 'cheapest' | 'best-value';
    sgr?: 'fastest' | 'cheapest' | 'best-value';
  } = {};

  if (!flight || (!sgrEconomy && !sgrFirstClass)) {
    return result;
  }

  // Use SGR First Class for comparison if available, otherwise Economy
  const sgrRoute = sgrFirstClass || sgrEconomy;
  if (!sgrRoute) return result;

  // Fastest: lowest duration
  if (flight.totalDuration < sgrRoute.totalDuration) {
    result.flight = 'fastest';
  } else {
    result.sgr = 'fastest';
  }

  // Cheapest: lowest price
  if (flight.totalPrice < sgrRoute.totalPrice) {
    result.flight = 'cheapest';
  } else {
    result.sgr = 'cheapest';
  }

  // Best Value: If Flight price is within 30% of SGR First Class price
  // (or SGR Economy if First Class not available)
  const sgrPrice = sgrRoute.totalPrice;
  const flightPrice = flight.totalPrice;
  const priceDiff = Math.abs(flightPrice - sgrPrice) / sgrPrice;

  if (priceDiff <= 0.3) {
    // Flight is within 30% - time saved > money cost
    result.flight = 'best-value';
  } else {
    result.sgr = 'best-value';
  }

  return result;
}

