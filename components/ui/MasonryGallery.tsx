'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { IImage } from '@/types';

interface MasonryGalleryProps {
  images: IImage[];
  title?: string;
  onViewAll: (startIndex?: number) => void;
}

export default function MasonryGallery({ images, title, onViewAll }: MasonryGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="relative w-full h-[70vh] bg-slate-200 flex items-center justify-center rounded-lg">
        <span className="text-slate-500">No images available</span>
      </div>
    );
  }

  const mainImage = images[0];
  const gridImages = images.slice(1, 5); // Images 2-5
  const hasEnoughImages = images.length >= 5;

  return (
    <section className="relative w-full">
      {hasEnoughImages ? (
        // Masonry Layout: 1 Main + 4 Grid
        <div className="grid grid-cols-4 gap-2 h-[70vh] overflow-hidden rounded-lg">
          {/* Main Image (Left, full height) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="col-span-2 row-span-2 relative cursor-pointer group"
            onClick={() => onViewAll(0)}
          >
            <Image
              src={mainImage.url}
              alt={mainImage.alt || title || 'Main image'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                Click to view
              </span>
            </div>
          </motion.div>

          {/* Grid Images (Right, 2x2) */}
          {gridImages.map((image, index) => {
            const isTopRight = index === 0;
            const isBottomRight = index === 3;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                className={`relative cursor-pointer group ${
                  isTopRight ? 'rounded-tr-lg' : ''
                } ${isBottomRight ? 'rounded-br-lg' : ''}`}
                onClick={() => onViewAll(index + 1)}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${title || 'Image'} - ${index + 2}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
              </motion.div>
            );
          })}
        </div>
      ) : (
        // Fallback: 1 Main + Row of thumbnails
        <div className="h-[70vh] relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-full cursor-pointer group rounded-lg overflow-hidden"
            onClick={() => onViewAll(0)}
          >
            <Image
              src={mainImage.url}
              alt={mainImage.alt || title || 'Main image'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                Click to view
              </span>
            </div>
          </motion.div>
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 flex gap-2">
              {images.slice(1).map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 border-white hover:border-gold transition-all"
                  onClick={() => onViewAll(index + 1)}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Thumbnail ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View All Photos Button */}
      {images.length > 0 && (
        <button
          onClick={() => onViewAll(0)}
          className="absolute bottom-6 right-6 bg-white/90 hover:bg-white text-navy px-6 py-3 rounded-lg font-semibold shadow-lg backdrop-blur-sm transition-all flex items-center gap-2"
        >
          View All Photos ({images.length})
        </button>
      )}
    </section>
  );
}

