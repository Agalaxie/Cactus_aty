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
  products: { id: string; name: string; image_url?: string }[];
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

const categoriesConfig: Omit<Category, 'count' | 'image' | 'products'>[] = [
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Bloquer le scroll de la page quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      // Calculer la largeur de la scrollbar pour éviter le décalage
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Sauvegarder la position de scroll actuelle
      const scrollY = window.scrollY;
      
      // Bloquer le scroll en compensant la scrollbar
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Compenser pour tous les éléments fixes
      const fixedElements = document.querySelectorAll([
        'header',
        '[style*="position: fixed"]',
        '[style*="position:fixed"]', 
        '.fixed',
        '[class*="fixed"]'
      ].join(', '));
      
      fixedElements.forEach((element: Element) => {
        const htmlElement = element as HTMLElement;
        // Ne pas appliquer au MegaMenu lui-même pour éviter les conflits
        if (!htmlElement.contains(document.querySelector('[data-megamenu]'))) {
          htmlElement.style.paddingRight = `${scrollbarWidth}px`;
        }
      });
    } else {
      // Restaurer le scroll normal
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      
      // Restaurer tous les éléments fixes
      const fixedElements = document.querySelectorAll([
        'header',
        '[style*="position: fixed"]',
        '[style*="position:fixed"]', 
        '.fixed',
        '[class*="fixed"]'
      ].join(', '));
      
      fixedElements.forEach((element: Element) => {
        (element as HTMLElement).style.paddingRight = '';
      });
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Nettoyage au démontage du composant
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      
      const fixedElements = document.querySelectorAll([
        'header',
        '[style*="position: fixed"]',
        '[style*="position:fixed"]', 
        '.fixed',
        '[class*="fixed"]'
      ].join(', '));
      
      fixedElements.forEach((element: Element) => {
        (element as HTMLElement).style.paddingRight = '';
      });
    };
  }, [isOpen]);

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

            // Récupérer un produit représentatif avec image ET la liste des produits
            const { data: products, error: imageError } = await supabase
              .from('products')
              .select('id, name, image_url')
              .in('category', categoryConfig.dbCategories)
              .not('image_url', 'is', null)
              .not('image_url', 'eq', '')
              .limit(6);

            // Récupérer tous les produits de la catégorie pour le catalogue
            const { data: allProducts, error: catalogError } = await supabase
              .from('products')
              .select('id, name, image_url')
              .in('category', categoryConfig.dbCategories)
              .limit(8);

            if (countError) {
              console.error(`Erreur pour la catégorie ${categoryConfig.name}:`, countError);
            }

            // Utiliser l'image du produit ou le placeholder
            let categoryImage = getCategoryPlaceholder(categoryConfig.name);
            
            if (products && products.length > 0 && products[0].image_url) {
              // Nettoyage approfondi de l'URL
              const imageUrl = products[0].image_url
                .trim()
                .replace(/^\s+|\s+$/g, '') // Supprimer espaces début/fin
                .replace(/[\r\n\t]/g, '') // Supprimer caractères de contrôle
                .replace(/\s+/g, ' ') // Normaliser les espaces internes
                .trim();
              
              if (imageUrl.startsWith('/images/') || imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
                categoryImage = imageUrl;
              }
            }

            return { 
              ...categoryConfig, 
              count: count || 0,
              image: categoryImage,
              products: allProducts || []
            };
          })
        );

        setCategories(categoriesWithData);
        // Sélectionner la première catégorie par défaut
        if (categoriesWithData.length > 0) {
          setSelectedCategory(categoriesWithData[0]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        // En cas d'erreur, utiliser des placeholders
        const fallbackCategories = categoriesConfig.map(cat => ({ 
          ...cat, 
          count: 0,
          image: getCategoryPlaceholder(cat.name),
          products: []
        }));
        setCategories(fallbackCategories);
        if (fallbackCategories.length > 0) {
          setSelectedCategory(fallbackCategories[0]);
        }
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
    <div
      data-megamenu="true"
      className="fixed left-0 right-0 w-screen bg-white dark:bg-[var(--background)] border-b border-[var(--border)] shadow-xl"
      style={{ 
        zIndex: 9999,
        top: '123px',
        position: 'fixed'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
                <div className="px-8 py-6">
          <div className="max-w-7xl mx-auto flex">
            {/* Navigation latérale */}
            <div className="w-72 pr-8 border-r border-[var(--border)]/30">
              <h2 className="text-2xl font-bold text-[var(--card-title)] mb-6">Nos Collections</h2>
              <nav className="space-y-1">
                {loading ? (
                  [...Array(6)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg animate-pulse">
                      <div className="h-5 bg-[var(--background)] rounded w-20"></div>
                      <div className="h-5 bg-[var(--background)] rounded-full w-6"></div>
                    </div>
                  ))
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.slug}
                      onMouseEnter={() => setSelectedCategory(category)}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors group cursor-pointer ${
                        selectedCategory?.slug === category.slug 
                          ? 'bg-[var(--accent)]/10 border-l-2 border-[var(--accent)]' 
                          : 'hover:bg-[var(--card-bg)]'
                      }`}
                      onClick={() => {
                        window.location.href = `/categorie/${category.slug}`;
                        onClose();
                      }}
                    >
                      <span className={`transition-colors font-medium ${
                        selectedCategory?.slug === category.slug 
                          ? 'text-[var(--accent)]' 
                          : 'text-[var(--card-title)] group-hover:text-[var(--accent)]'
                      }`}>
                        {category.name}
                      </span>
                      <span className="text-sm bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-1 rounded-full font-bold">
                        {category.count}
                      </span>
                    </div>
                  ))
                )}
              </nav>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 pl-8">
              {selectedCategory ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[var(--card-title)] mb-2">{selectedCategory.name}</h3>
                    <p className="text-[var(--foreground)] opacity-75">{selectedCategory.description}</p>
                  </div>

                                      {selectedCategory.products.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                        {selectedCategory.products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/produit/${product.id}`}
                            onClick={onClose}
                            className="group p-2 hover:bg-[var(--card-bg)] rounded-lg transition-colors"
                          >
                            <div className="text-center">
                              <div className="w-24 h-24 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {product.image_url ? (
                                  <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling!.classList.remove('hidden');
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-[var(--accent)]/10 flex items-center justify-center">
                                    <span className="text-2xl">🌵</span>
                                  </div>
                                )}
                                <div className="w-full h-full bg-[var(--accent)]/10 flex items-center justify-center hidden">
                                  <span className="text-2xl">🌵</span>
                                </div>
                              </div>
                              <h4 className="font-medium text-[var(--card-title)] group-hover:text-[var(--accent)] transition-colors text-xs leading-tight px-1">
                                {product.name.length > 20 ? `${product.name.substring(0, 20)}...` : product.name}
                              </h4>
                            </div>
                          </Link>
                        ))}
                      </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-50">🌱</div>
                      <p className="text-[var(--foreground)] opacity-75">Aucun produit disponible dans cette catégorie</p>
                    </div>
                  )}
                </div>
              ) : loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                  {[...Array(12)].map((_, index) => (
                    <div key={index} className="animate-pulse p-2">
                      <div className="w-24 h-24 mx-auto mb-2 bg-[var(--background)] rounded-lg"></div>
                      <div className="h-3 bg-[var(--background)] rounded w-3/4 mx-auto"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">🌿</div>
                  <p className="text-[var(--foreground)] opacity-75">Survolez une catégorie pour voir les produits</p>
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
  );
} 