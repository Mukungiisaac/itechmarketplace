/**
 * Image optimization utilities for better performance
 * Converts images to WebP, compresses, and resizes
 */

interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

const DEFAULT_OPTIONS: OptimizeOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.85,
};

/**
 * Load an image file and return HTMLImageElement
 */
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculate new dimensions maintaining aspect ratio
 */
const calculateDimensions = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const aspectRatio = width / height;

  if (width > height) {
    return {
      width: Math.min(width, maxWidth),
      height: Math.min(width, maxWidth) / aspectRatio,
    };
  } else {
    return {
      width: Math.min(height, maxHeight) * aspectRatio,
      height: Math.min(height, maxHeight),
    };
  }
};

/**
 * Optimize image: convert to WebP, compress, and resize
 * Returns a Blob ready for upload
 */
export const optimizeImage = async (
  file: File,
  options: OptimizeOptions = {}
): Promise<Blob> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Load the image
    const img = await loadImage(file);

    // Calculate new dimensions
    const { width, height } = calculateDimensions(
      img.naturalWidth,
      img.naturalHeight,
      opts.maxWidth!,
      opts.maxHeight!
    );

    // Create canvas and draw resized image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Use better image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the image
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to WebP blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log(
              `Image optimized: ${(file.size / 1024).toFixed(1)}KB → ${(blob.size / 1024).toFixed(1)}KB`
            );
            resolve(blob);
          } else {
            reject(new Error('Failed to create WebP blob'));
          }
        },
        'image/webp',
        opts.quality
      );
    });
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
};

/**
 * Convert optimized blob to base64 string for storage
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Get optimized image size category
 */
export const getImageSizeCategory = (
  type: 'product' | 'service' | 'house' | 'thumbnail'
): OptimizeOptions => {
  const sizes = {
    product: { maxWidth: 800, maxHeight: 800, quality: 0.85 },
    service: { maxWidth: 800, maxHeight: 800, quality: 0.85 },
    house: { maxWidth: 1200, maxHeight: 900, quality: 0.85 },
    thumbnail: { maxWidth: 400, maxHeight: 400, quality: 0.80 },
  };

  return sizes[type];
};
