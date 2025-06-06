'use client';

import { AnimatePresence } from 'framer-motion';
import { m } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface Category {
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
  dbCategories: string[];
}

// Fonction pour générer un placeholder SVG par catégorie
const getCategoryPlaceholder = (categoryName: string) => {
  const colors = {
    'Agaves': { bg: '%2316a34a', accent: '%2322c55e' }, // Vert
    'Aloès': { bg: '%2306b6d4', accent: '%2309e6ff' }, // Cyan
    'Cactus': { bg: '%23ca8a04', accent: '%23eab308' }, // Jaune
    'Yuccas': { bg: '%23dc2626', accent: '%23ef4444' }, // Rouge
    'Dasylirions': { bg: '%237c2d12', accent: '%23ea580c' }, // Orange
    'Sujets Exceptionnels': { bg: '%237c3aed', accent: '%238b5cf6' } // Violet
  };
  
  const color = colors[categoryName as keyof typeof colors] || colors['Cactus'];
  
  return `data:image/svg+xml,%3csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='400' height='400' fill='${color.bg}'/%3e%3cg transform='translate(200%2c200)'%3e%3ccircle cx='0' cy='-30' r='35' fill='${color.accent}'/%3e%3cpath d='M-8%2c-60 Q0%2c-75 8%2c-60 L5%2c-25 L-5%2c-25 Z' fill='${color.accent}'/%3e%3cpath d='M-25%2c-40 Q-35%2c-55 -15%2c-45 L-12%2c-20 L-18%2c-20 Z' fill='${color.accent}'/%3e%3cpath d='M25%2c-40 Q35%2c-55 15%2c-45 L18%2c-20 L12%2c-20 Z' fill='${color.accent}'/%3e%3cellipse cx='0' cy='30' rx='50' ry='25' fill='%23422006'/%3e%3c/g%3e%3ctext x='200' y='370' text-anchor='middle' fill='white' font-family='Arial%2c sans-serif' font-size='24' font-weight='bold'%3e${categoryName}%3c/text%3e%3c/svg%3e`;
};

const categoriesConfig: Omit<Category, 'count' | 'image'>[] = [
  {
    name: 'Agaves',
    slug: 'agaves',
    description: 'Agaves spectaculaires pour jardins modernes',
    dbCategories: ['Agaves', 'Agaves et aloes']
  },
  {
    name: 'Aloès', 
    slug: 'aloes',
    description: 'Aloès thérapeutiques et décoratifs',
    dbCategories: ['Aloes', 'Agaves et aloes']
  },
  {
    name: 'Cactus',
    slug: 'cactus',
    description: 'Collection exclusive de cactus majestueux', 
    dbCategories: ['Cactus', 'Cereus', 'Echinocactus', 'Mammillaria', 'Opuntia', 'Pachycereus']
  },
  {
    name: 'Yuccas',
    slug: 'yuccas',
    description: 'Yuccas résistants et décoratifs',
    dbCategories: ['Yuccas', 'Rostrata']
  },
  {
    name: 'Dasylirions',
    slug: 'dasylirions',
    description: 'Dasylirions architecturaux',
    dbCategories: ['Dasylirions']
  },
  {
    name: 'Sujets Exceptionnels',
    slug: 'sujets-exceptionnels',
    description: 'Spécimens rares et collectionneurs',
    dbCategories: ['Sujets exceptionnels']
  }
];

export default function MegaMenu({ isOpen, onClose, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoriesWithImages() {
      try {
        setLoading(true);
        
        // Récupérer les compteurs et images pour chaque catégorie
        const categoriesWithData = await Promise.all(
          categoriesConfig.map(async (categoryConfig) => {
            // Compter les produits
            const { count, error: countError } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .in('category', categoryConfig.dbCategories);

            // Récupérer un produit représentatif avec image
            const { data: products, error: imageError } = await supabase
              .from('products')
              .select('image_url')
              .in('category', categoryConfig.dbCategories)
              .not('image_url', 'is', null)
              .not('image_url', 'eq', '')
              .limit(1);

            if (countError) {
              console.error(`Erreur pour la catégorie ${categoryConfig.name}:`, countError);
            }

            // Utiliser l'image du produit ou le placeholder
            let categoryImage = getCategoryPlaceholder(categoryConfig.name);
            
            if (products && products.length > 0 && products[0].image_url) {
              const imageUrl = products[0].image_url.trim();
              if (imageUrl.startsWith('/images/') || imageUrl.startsWith('https://')) {
                categoryImage = imageUrl;
              }
            }

            return { 
              ...categoryConfig, 
              count: count || 0,
              image: categoryImage
            };
          })
        );

        setCategories(categoriesWithData);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        // En cas d'erreur, utiliser des placeholders
        setCategories(categoriesConfig.map(cat => ({ 
          ...cat, 
          count: 0,
          image: getCategoryPlaceholder(cat.name)
        })));
      } finally {
        setLoading(false);
      }
    }

    // Ne charger que si le menu est ouvert
    if (isOpen) {
      fetchCategoriesWithImages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed top-[116px] left-0 right-0 w-screen bg-[var(--background)] border-b border-[var(--border)] shadow-xl z-50"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--card-title)] mb-3">
              Nos Collections
            </h2>
            <p className="text-[var(--foreground)] opacity-75 text-lg">
              Découvrez notre sélection de plantes architecturales exceptionnelles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {loading ? (
              // Skeleton pendant le chargement
              [...Array(6)].map((_, index) => (
                <div key={index} className="p-6 rounded-lg border-2 border-[var(--border)] animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-[var(--background)] rounded-lg"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-6 bg-[var(--background)] rounded w-24"></div>
                        <div className="h-6 bg-[var(--background)] rounded-full w-8"></div>
                      </div>
                      <div className="h-4 bg-[var(--background)] rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categorie/${category.slug}`}
                  onClick={onClose}
                  className="block p-6 rounded-lg border-2 border-[var(--border)] hover:border-[var(--accent)] hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        sizes="96px"
                        loading="lazy"
                        quality={85}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getCategoryPlaceholder(category.name);
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-[var(--card-title)] text-xl">
                          {category.name}
                        </h3>
                        <span className="text-base bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded-full font-bold">
                          {category.count}
                        </span>
                      </div>
                      <p className="text-base text-[var(--foreground)] opacity-75 mt-2 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="border-t border-[var(--border)] mt-8 pt-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-green-600 dark:text-green-400 text-3xl">🚚</span>
                <div>
                  <h4 className="font-bold text-green-800 dark:text-green-200 text-lg">
                    Livraison 24H
                  </h4>
                  <p className="text-green-600 dark:text-green-300 text-base mt-1">
                    Expédition rapide par transporteur spécialisé
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 text-3xl">👨‍🌾</span>
                <div>
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 text-lg">
                    Conseils d'experts
                  </h4>
                  <p className="text-blue-600 dark:text-blue-300 text-base mt-1">
                    15+ années d'expérience à votre service
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/qui-suis-je"
              onClick={onClose}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-white rounded-lg font-bold text-lg hover:opacity-90 transition-colors hover:scale-105"
            >
              <span className="text-xl">📞</span>
              Nous contacter
            </Link>
          </div>
        </div>
      </m.div>
    </AnimatePresence>
  );
} 