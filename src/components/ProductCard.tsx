'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Interface locale pour ProductCard
interface ProductCharacteristics {
  matureSize?: string;
  careLevel?: string;
  coldResistance?: number;
  indoorSuitable?: boolean;
  flowering?: boolean;
}

interface ProductVariant {
  height: string; // ex: "30cm", "40cm", "50cm"
  price: number;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // Prix de base
  stock_quantity: number;
  category: string;
  image_url?: string;
  variants?: ProductVariant[]; // Tailles multiples avec prix différents
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  // Fonction pour obtenir une image placeholder SVG valide
  const getPlaceholderImage = () => {
    return "data:image/svg+xml,%3csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='400' height='400' fill='%23f3f4f6'/%3e%3cg transform='translate(200%2c200)'%3e%3ccircle cx='0' cy='-30' r='25' fill='%2310b981'/%3e%3cpath d='M-5%2c-50 Q0%2c-60 5%2c-50 L3%2c-30 L-3%2c-30 Z' fill='%2310b981'/%3e%3cpath d='M-15%2c-35 Q-20%2c-45 -10%2c-40 L-8%2c-25 L-12%2c-25 Z' fill='%2310b981'/%3e%3cpath d='M15%2c-35 Q20%2c-45 10%2c-40 L12%2c-25 L8%2c-25 Z' fill='%2310b981'/%3e%3cellipse cx='0' cy='20' rx='40' ry='20' fill='%23d97706'/%3e%3c/g%3e%3ctext x='200' y='350' text-anchor='middle' fill='%236b7280' font-family='Arial%2c sans-serif' font-size='16'%3eImage non disponible%3c/text%3e%3c/svg%3e";
  };

  // Fonction pour valider et nettoyer l'URL de l'image
  const getValidImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl || imageUrl.trim() === '') {
      return getPlaceholderImage();
    }

    const cleanUrl = imageUrl.trim();
    
    // Accepter les URLs locales (/images/...) et les URLs HTTPS
    if (cleanUrl.startsWith('/images/') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    // Sinon utiliser le placeholder
    return getPlaceholderImage();
  };

  // Fonction pour obtenir le prix d'affichage
  const getDisplayPrice = () => {
    if (product.variants && product.variants.length > 0) {
      const minPrice = Math.min(...product.variants.map(v => v.price));
      const maxPrice = Math.max(...product.variants.map(v => v.price));
      if (minPrice === maxPrice) {
        return `${minPrice.toFixed(2)}€`;
      }
      return `À partir de ${minPrice.toFixed(2)}€`;
    }
    return `${product.price.toFixed(2)}€`;
  };

  // Fonction pour créer le slug SEO du produit
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group"
    >
      <Link href={`/produit/${createSlug(product.name)}`}>
        <div className="bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={getValidImageUrl(product.image_url)}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getPlaceholderImage();
              }}
            />
            {product.stock_quantity === 0 && (
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
            <p className="text-sm text-[var(--foreground)] opacity-75 mb-4 line-clamp-2">
              {product.description.substring(0, 100)}...
            </p>
            
            {/* Tailles disponibles */}
            {product.variants && product.variants.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {product.variants.slice(0, 3).map((variant, idx) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {variant.height}
                  </span>
                ))}
                {product.variants.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    +{product.variants.length - 3} tailles
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-[var(--accent)]">
                {getDisplayPrice()}
              </span>
              <span className="text-sm text-[var(--foreground)] opacity-50 capitalize">
                {product.category}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 