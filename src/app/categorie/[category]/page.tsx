'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import { supabase } from '../../../lib/supabase';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
}

const categories: Category[] = [
  {
    id: 'agaves',
    name: 'Agaves',
    description: 'Agaves spectaculaires pour jardins modernes',
    icon: '🪴',
    href: '/categorie/agaves'
  },
  {
    id: 'aloes',
    name: 'Aloès',
    description: 'Aloès thérapeutiques et décoratifs',
    icon: '🌿',
    href: '/categorie/aloes'
  },
  {
    id: 'cactus',
    name: 'Cactus',
    description: 'Collection exclusive de cactus majestueux',
    icon: '🌵',
    href: '/categorie/cactus'
  },
  {
    id: 'yuccas',
    name: 'Yuccas',
    description: 'Yuccas résistants et décoratifs',
    icon: '🌴',
    href: '/categorie/yuccas'
  },
  {
    id: 'dasylirions',
    name: 'Dasylirions',
    description: 'Dasylirions architecturaux',
    icon: '🌾',
    href: '/categorie/dasylirions'
  },
  {
    id: 'sujets-exceptionnels',
    name: 'Sujets Exceptionnels',
    description: 'Spécimens rares et collectionneurs',
    icon: '⭐',
    href: '/categorie/sujets-exceptionnels'
  }
];

type SortOption = 'name' | 'price-asc' | 'price-desc';

// Fonction pour créer un slug SEO-friendly à partir du nom du produit
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/-+/g, '-') // Éviter les tirets multiples
    .trim()
    .substring(0, 60); // Limiter la longueur
};

// Fonction pour mapper les URLs vers les catégories de la base de données
const getCategoryFilters = (categoryName: string): string[] => {
  switch (categoryName) {
    case 'cactus':
      return ['Cactus', 'Cereus', 'Echinocactus', 'Mammillaria', 'Opuntia', 'Pachycereus'];
    case 'agaves':
      return ['Agaves', 'Agaves et aloes'];
    case 'aloes':
      return ['Aloes', 'Agaves et aloes'];
    case 'yuccas':
      return ['Yuccas', 'Rostrata'];
    case 'dasylirions':
      return ['Dasylirions'];
    case 'sujets-exceptionnels':
      return ['Sujets exceptionnels'];
    default:
      return [categoryName];
  }
};

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.category as string;
  
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    
    // Si c'est une URL locale (/images/...) ou invalide, utiliser le placeholder
    if (cleanUrl.startsWith('/images/') || !cleanUrl.startsWith('http')) {
      return getPlaceholderImage();
    }

    // Vérifier si c'est une URL HTTPS valide
    if (cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    // Sinon utiliser le placeholder
    return getPlaceholderImage();
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        // Obtenir les catégories à filtrer pour cette page
        const categoryFilters = getCategoryFilters(categoryName);
        
        // Requête pour récupérer les produits de cette catégorie depuis Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('category', categoryFilters)
          .order('name', { ascending: true });

        if (error) throw error;
        setProducts(data || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryName]);

  const category = categories.find(cat => cat.id === categoryName);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Pour la catégorie cactus, exclure les produits mal catégorisés
      if (categoryName === 'cactus') {
        const productNameLower = product.name.toLowerCase();
        const isWronglyPlaced = productNameLower.includes('agave') ||
                               productNameLower.includes('aloe') ||
                               productNameLower.includes('dasylirion') ||
                               productNameLower.includes('yucca') ||
                               productNameLower.includes('senecio');
        
        if (isWronglyPlaced) {
          return false; // Exclure ces produits de la catégorie cactus
        }
      }
      
      return inPriceRange;
    });

    // Tri
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [products, sortBy, priceRange, categoryName]);

  if (!category) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-[var(--card-title)]">Catégorie non trouvée</h1>
          <Link href="/" className="text-[var(--accent)] hover:underline mt-4 inline-block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-red-500">Erreur</h1>
          <p className="text-[var(--foreground)] mt-4">{error}</p>
          <Link href="/" className="text-[var(--accent)] hover:underline mt-4 inline-block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Breadcrumb */}
      <div className="py-6 px-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-[var(--accent)] hover:underline">Accueil</Link>
          <span className="text-[var(--foreground)] opacity-50">›</span>
          <span className="text-[var(--card-title)]">{category.name}</span>
        </div>
      </div>

      {/* Header de catégorie */}
      <section className="py-12 px-4 bg-[var(--card-bg)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-6xl mb-4 block">{category.icon}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--card-title)] mb-4">
              {category.name}
            </h1>
            <p className="text-xl text-[var(--foreground)] opacity-75 max-w-2xl mx-auto">
              {category.description}
            </p>
            <div className="mt-6 text-[var(--accent)] font-medium">
              {filteredAndSortedProducts.length} produit{filteredAndSortedProducts.length > 1 ? 's' : ''} disponible{filteredAndSortedProducts.length > 1 ? 's' : ''}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filtres et tri */}
      <section className="py-6 px-4 border-b border-[var(--border)] bg-[var(--card-bg)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[var(--card-title)]">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="name">Nom A-Z</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
            
            {/* Filtre de prix */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[var(--card-title)]">Prix max :</span>
              <select
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="100">100€</option>
                <option value="200">200€</option>
                <option value="500">500€</option>
                <option value="1000">1000€</option>
                <option value="2000">2000€</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Grille de produits */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 opacity-50">🌵</div>
              <h3 className="text-xl font-semibold text-[var(--card-title)] mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-[var(--foreground)] opacity-75">
                Essayez d'ajuster vos filtres ou explorez d'autres catégories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  {/* Utiliser un slug SEO-friendly pour l'URL */}
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
                        {product.price > 100 && (
                          <div className="absolute top-3 left-3 bg-[var(--accent)] text-white px-2 py-1 rounded-full text-xs font-medium">
                            ⭐ Populaire
                          </div>
                        )}
                        {product.price === 0 && (
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
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[var(--accent)]">
                            {product.price > 0 ? product.price + '€' : 'Sur demande'}
                          </span>
                          <span className="text-sm text-[var(--foreground)] opacity-50 capitalize">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 