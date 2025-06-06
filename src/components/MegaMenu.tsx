'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  dbCategories: string[]; // Catégories correspondantes dans Supabase
}

const categoriesConfig: Omit<Category, 'count'>[] = [
  {
    name: 'Agaves',
    slug: 'agaves',
    description: 'Agaves spectaculaires pour jardins modernes',
    image: '/Agave Nigra.jpg',
    dbCategories: ['Agaves', 'Agaves et aloes']
  },
  {
    name: 'Aloès', 
    slug: 'aloes',
    description: 'Aloès thérapeutiques et décoratifs',
    image: '/Aloe Aristata.jpg',
    dbCategories: ['Aloes', 'Agaves et aloes']
  },
  {
    name: 'Cactus',
    slug: 'cactus',
    description: 'Collection exclusive de cactus majestueux', 
    image: '/Echinocactus grusonii intermedius.jpg',
    dbCategories: ['Cactus', 'Cereus', 'Echinocactus', 'Mammillaria', 'Opuntia', 'Pachycereus']
  },
  {
    name: 'Yuccas',
    slug: 'yuccas',
    description: 'Yuccas résistants et décoratifs',
    image: '/cactus-vedette.png', 
    dbCategories: ['Yuccas', 'Rostrata']
  },
  {
    name: 'Dasylirions',
    slug: 'dasylirions',
    description: 'Dasylirions architecturaux',
    image: '/cactus-hero.png',
    dbCategories: ['Dasylirions']
  },
  {
    name: 'Sujets Exceptionnels',
    slug: 'sujets-exceptionnels',
    description: 'Spécimens rares et collectionneurs',
    image: '/cactus-hero.png',
    dbCategories: ['Sujets exceptionnels']
  }
];

export default function MegaMenu({ isOpen, onClose, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryCounts() {
      try {
        setLoading(true);
        
        // Récupérer les compteurs pour chaque catégorie
        const categoriesWithCounts = await Promise.all(
          categoriesConfig.map(async (categoryConfig) => {
            const { count, error } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .in('category', categoryConfig.dbCategories);

            if (error) {
              console.error(`Erreur pour la catégorie ${categoryConfig.name}:`, error);
              return { ...categoryConfig, count: 0 };
            }

            return { ...categoryConfig, count: count || 0 };
          })
        );

        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error('Erreur lors du chargement des compteurs:', error);
        // En cas d'erreur, utiliser des valeurs par défaut
        setCategories(categoriesConfig.map(cat => ({ ...cat, count: 0 })));
      } finally {
        setLoading(false);
      }
    }

    // Ne charger que si le menu est ouvert
    if (isOpen) {
      fetchCategoryCounts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
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
      </motion.div>
    </AnimatePresence>
  );
} 