/**
 * Mock image URLs using Unsplash with Kenya/Tanzania-specific keywords
 * 
 * For production, replace with actual cinematic 4K/HDR images
 */

import { IImage } from '@/types';

// Unsplash collections for Kenya/Tanzania
const UNSPLASH_BASE = 'https://images.unsplash.com';

export const mockImages = {
  // Hero and banner images
  hero: {
    safari: `${UNSPLASH_BASE}/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop`, // Serengeti
    zanzibar: `${UNSPLASH_BASE}/photo-1590073844006-33e912e5f53a?w=1920&h=1080&fit=crop`, // Zanzibar beach
    maasaiMara: `${UNSPLASH_BASE}/photo-1547471080-7cc2caa01a7e?w=1920&h=1080&fit=crop`, // Maasai Mara
  },

  // Safari images
  safari: [
    `${UNSPLASH_BASE}/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop`, // Elephants
    `${UNSPLASH_BASE}/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop`, // Lions
    `${UNSPLASH_BASE}/photo-1535083783855-76ae62b2914e?w=800&h=600&fit=crop`, // Zebras
    `${UNSPLASH_BASE}/photo-1549366021-9f761d450615?w=800&h=600&fit=crop`, // Giraffes
  ],

  // Beach/Zanzibar images
  beach: [
    `${UNSPLASH_BASE}/photo-1590073844006-33e912e5f53a?w=800&h=600&fit=crop`, // Zanzibar beach
    `${UNSPLASH_BASE}/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop`, // Beach resort
    `${UNSPLASH_BASE}/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop`, // Ocean sunset
  ],

  // Accommodation images
  accommodation: [
    `${UNSPLASH_BASE}/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop`, // Luxury lodge
    `${UNSPLASH_BASE}/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop`, // Hotel room
    `${UNSPLASH_BASE}/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop`, // Resort pool
  ],

  // Cultural images
  culture: [
    `${UNSPLASH_BASE}/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop`, // Maasai culture
    `${UNSPLASH_BASE}/photo-1489392191049-fc10c97e64b6?w=800&h=600&fit=crop`, // Local market
  ],
};

/**
 * Generate a mock image object
 */
export function generateMockImage(
  category: keyof typeof mockImages,
  index: number = 0,
  alt: string = 'Mystical Vacations destination'
): IImage {
  const images = mockImages[category];
  const url = Array.isArray(images) ? images[index % images.length] : images.safari;

  return {
    url,
    alt,
    aspectRatio: '16:9',
    credit: 'Unsplash (placeholder)',
  };
}

/**
 * Get random image from category
 */
export function getRandomImage(category: keyof typeof mockImages): string {
  const images = mockImages[category];
  if (Array.isArray(images)) {
    return images[Math.floor(Math.random() * images.length)];
  }
  return images.safari;
}

