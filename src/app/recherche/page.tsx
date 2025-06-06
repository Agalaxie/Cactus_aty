'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import ProductCard from '../../components/ProductCard';
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchBar from '../../components/SearchBar';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

type SortOption = 'relevance' | 'name' | 'price-asc' | 'price-desc' | 'category';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Recherche des produits avec Supabase
  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        let queryBuilder = supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);

        // Filtre par catégorie
        if (selectedCategory !== 'all') {
          queryBuilder = queryBuilder.eq('category', selectedCategory);
        }

        // Filtre par prix
        queryBuilder = queryBuilder
          .gte('price', priceRange[0])
          .lte('price', priceRange[1]);

        // Tri
        switch (sortBy) {
          case 'name':
            queryBuilder = queryBuilder.order('name', { ascending: true });
            break;
          case 'price-asc':
            queryBuilder = queryBuilder.order('price', { ascending: true });
            break;
          case 'price-desc':
            queryBuilder = queryBuilder.order('price', { ascending: false });
            break;
          case 'category':
            queryBuilder = queryBuilder.order('category', { ascending: true });
            break;
          default: // relevance
            queryBuilder = queryBuilder.order('name', { ascending: true });
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error('Erreur de recherche:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, sortBy, selectedCategory, priceRange]);

  // Catégories disponibles dans les résultats
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    searchResults.forEach(product => categories.add(product.category));
    return Array.from(categories);
  }, [searchResults]);

  const formatCategoryName = (category: string) => {
    const names: Record<string, string> = {
      'Agaves': 'Agaves',
      'Aloes': 'Aloès',
      'Cactus': 'Cactus',
      'Cereus': 'Cereus',
      'Echinocactus': 'Echinocactus',
      'Mammillaria': 'Mammillaria',
      'Opuntia': 'Opuntia',
      'Pachycereus': 'Pachycereus',
      'Yuccas': 'Yuccas',
      'Rostrata': 'Rostrata',
      'Dasylirions': 'Dasylirions',
      'Sujets exceptionnels': 'Sujets Exceptionnels'
    };
    return names[category] || category;
  };

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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header de recherche */}
      <div className="bg-[var(--card-bg)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <SearchBar />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--background)] text-[var(--card-title)] rounded-lg hover:opacity-80 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              Filtres
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Résumé de recherche */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--card-title)] mb-2">
            Résultats de recherche
          </h1>
          {query && (
            <div className="flex items-center gap-2">
              <p className="text-[var(--foreground)] opacity-75">
                {loading ? 'Recherche en cours...' : `${searchResults.length} résultat${searchResults.length !== 1 ? 's' : ''} pour`}
                <span className="font-semibold text-[var(--accent)] ml-1">
                  "{query}"
                </span>
              </p>
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[var(--accent)]"></div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-[var(--card-bg)] rounded-lg p-6 space-y-6">
              <h3 className="font-semibold text-[var(--card-title)]">Filtres</h3>
              
              {/* Tri */}
              <div>
                <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                  Trier par
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--card-bg)] text-[var(--card-title)]"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="name">Nom A-Z</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="category">Catégorie</option>
                </select>
              </div>

              {/* Catégories */}
              <div>
                <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--card-bg)] text-[var(--card-title)]"
                >
                  <option value="all">Toutes les catégories</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>
                      {formatCategoryName(category)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                  Prix
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-[var(--accent)]"
                  />
                  <div className="flex justify-between text-sm text-[var(--foreground)] opacity-75">
                    <span>0€</span>
                    <span>Max: {priceRange[1]}€</span>
                  </div>
                </div>
              </div>

              {/* Reset filtres */}
              <button
                onClick={() => {
                  setSortBy('relevance');
                  setSelectedCategory('all');
                  setPriceRange([0, 2000]);
                }}
                className="w-full px-3 py-2 text-sm bg-[var(--background)] text-[var(--card-title)] rounded-md hover:opacity-80 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          {/* Résultats */}
          <div className="flex-1">
            {!query ? (
              <div className="text-center py-20">
                <MagnifyingGlassIcon className="h-16 w-16 text-[var(--foreground)] opacity-25 mx-auto mb-4" />
                <p className="text-[var(--foreground)] opacity-75">
                  Saisissez un terme de recherche pour commencer
                </p>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[var(--card-bg)] rounded-lg p-4 animate-pulse">
                    <div className="aspect-square bg-[var(--background)] rounded-lg mb-4"></div>
                    <div className="h-4 bg-[var(--background)] rounded mb-2"></div>
                    <div className="h-3 bg-[var(--background)] rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <h3 className="text-xl font-semibold text-[var(--card-title)] mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-[var(--foreground)] opacity-75 mb-4">
                  Aucun produit ne correspond à votre recherche "{query}"
                </p>
                <button
                  onClick={() => {
                    setSortBy('relevance');
                    setSelectedCategory('all');
                    setPriceRange([0, 2000]);
                  }}
                  className="text-[var(--accent)] hover:opacity-80"
                >
                  Essayez d'ajuster vos filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map(product => {
                  // Convertir le produit Supabase vers le format attendu par ProductCard
                  const adaptedProduct = {
                    id: createSlug(product.name),
                    name: product.name,
                    latin: '',
                    description: product.description,
                    basePrice: product.price,
                    images: [product.image_url || '/placeholder-cactus.jpg'],
                    category: 'cactus',
                    inStock: product.price > 0,
                    featured: product.price > 100,
                    sizes: [{
                      id: 'standard',
                      label: 'Standard',
                      multiplier: 1,
                      stock: product.price > 0 ? 5 : 0
                    }]
                  };

                  return (
                    <ProductCard
                      key={product.id}
                      product={adaptedProduct}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
} 