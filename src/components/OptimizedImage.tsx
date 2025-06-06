'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallback?: string;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  fallback = '/placeholder-cactus.jpg',
  ...props 
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setImgSrc(fallback)}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${props.className || ''}`}
        loading="lazy"
        quality={85}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
} 