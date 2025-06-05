'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group"
    >
      <Link href={`/produit/${product.id}`}>
        <div className="bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {product.featured && (
              <div className="absolute top-3 left-3 bg-[var(--accent)] text-white px-2 py-1 rounded-full text-xs font-medium">
                ⭐ Vedette
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Rupture de stock
                </span>
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="p-6">
            <h3 className="font-bold text-lg text-[var(--card-title)] mb-1 group-hover:text-[var(--accent)] transition-colors">
              {product.name}
            </h3>
            {product.latin && (
              <p className="text-sm italic text-[var(--foreground)] opacity-75 mb-3">
                {product.latin}
              </p>
            )}
            <p className="text-sm text-[var(--foreground)] opacity-75 mb-4 line-clamp-2">
              {product.description.substring(0, 100)}...
            </p>
            
            {/* Caractéristiques rapides */}
            {product.characteristics && (
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {product.characteristics.matureSize}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {product.characteristics.careLevel}
                </span>
                {product.characteristics.coldResistance <= -5 && (
                  <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">
                    ❄️ résistant
                  </span>
                )}
                {product.characteristics.flowering && (
                  <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                    🌸 fleurit
                  </span>
                )}
                {product.characteristics.indoorSuitable && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    🏠 intérieur
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-[var(--accent)]">
                À partir de {product.basePrice}€
              </span>
              <span className="text-sm text-[var(--foreground)] opacity-50">
                {product.sizes.length} taille{product.sizes.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 