import type { ExcursionCategory } from '@/types';

/**
 * Get default requirements based on excursion category
 */
export function getDefaultRequirements(category: ExcursionCategory): string[] {
  switch (category) {
    case 'Safari':
      return [
        'Sunscreen',
        'Hat',
        'Camera',
        'Binoculars',
        'Warm Jacket (Morning/Evening)',
      ];
    case 'Beach':
      return ['Swimwear', 'Sunscreen', 'Towel', 'Sandals'];
    default:
      return ['Comfortable Shoes', 'Water Bottle', 'Camera'];
  }
}

/**
 * Calculate child price (50% of adult if not specified)
 */
export function getChildPrice(adultPrice: number, childPrice?: number): number {
  return childPrice ?? adultPrice * 0.5;
}

