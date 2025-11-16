/**
 * Utility functions for formatting data in Mystical Vacations
 */

/**
 * Format price with currency symbol
 */
export function formatPrice(amount: number, currency: 'USD' | 'KES' | 'TZS' = 'USD'): string {
  const symbols = {
    USD: '$',
    KES: 'KSh',
    TZS: 'TSh',
  };

  return `${symbols[currency]}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Format duration in minutes to human-readable format
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Format date to display format
 */
export function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
  const date = new Date(dateString);
  
  if (format === 'long') {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time to 12-hour format
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/**
 * Calculate nights from duration in days
 */
export function calculateNights(days: number): number {
  return Math.max(0, days - 1);
}

/**
 * Generate booking reference
 */
export function generateBookingReference(): string {
  const prefix = 'MV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Format rating to 1 decimal place
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Convert USD to KES and format
 * Exchange rate: 1 USD = 145 KES
 */
export function formatToKES(usdPrice: number): string {
  const kesPrice = usdPrice * 145;
  return `KES ${kesPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

