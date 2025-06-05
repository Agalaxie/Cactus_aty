'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '../../data/products';
import type { Product, CategoryType } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchBar from '../../components/SearchBar';

type SortOption = 'relevance' | 'name' | 'price-asc' | 'price-desc' | 'category';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);

  // Recherche des produits
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const filtered = products.filter(product => {
      // Recherche textuelle
      const searchText = query.toLowerCase();
      const matchesText = 
        product.name.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText) ||
        (product.latin && product.latin.toLowerCase().includes(searchText));

      if (!matchesText) return false;

      // Filtre par catégorie
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Filtre par prix
      const productPrice = product.basePrice * (product.sizes[0]?.multiplier || 1);
      if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
        return false;
      }

      return true;
    });

    // Tri des résultats
    switch (sortBy) {
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-asc':
        return filtered.sort((a, b) => {
          const priceA = a.basePrice * (a.sizes[0]?.multiplier || 1);
          const priceB = b.basePrice * (b.sizes[0]?.multiplier || 1);
          return priceA - priceB;
        });
      case 'price-desc':
        return filtered.sort((a, b) => {
          const priceA = a.basePrice * (a.sizes[0]?.multiplier || 1);
          const priceB = b.basePrice * (b.sizes[0]?.multiplier || 1);
          return priceB - priceA;
        });
      case 'category':
        return filtered.sort((a, b) => a.category.localeCompare(b.category));
      default: // relevance
        return filtered;
    }
  }, [query, sortBy, selectedCategory, priceRange]);

  // Catégories disponibles dans les résultats
  const availableCategories = useMemo(() => {
    const categories = new Set<CategoryType>();
    searchResults.forEach(product => categories.add(product.category));
    return Array.from(categories);
  }, [searchResults]);

  const formatCategoryName = (category: CategoryType) => {
    const names: Record<CategoryType, string> = {
      'agaves': 'Agaves',
      'aloes': 'Aloès',
      'boutures': 'Boutures',
      'cactus': 'Cactus',
      'yuccas': 'Yuccas',
      'sujets-exceptionnels': 'Sujets Exceptionnels'
    };
    return names[category] || category;
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
            <p className="text-[var(--foreground)] opacity-75">
              {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''} pour 
              <span className="font-semibold text-[var(--accent)] ml-1">
                "{query}"
              </span>
            </p>
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
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryType | 'all')}
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
                className="w-full px-4 py-2 text-sm bg-[var(--background)] text-[var(--card-title)] rounded-md hover:opacity-80 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          {/* Résultats */}
          <div className="flex-1">
            {query ? (
              searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-[var(--foreground)] opacity-40" />
                  <h3 className="mt-2 text-sm font-medium text-[var(--card-title)]">
                    Aucun résultat trouvé
                  </h3>
                  <p className="mt-1 text-sm text-[var(--foreground)] opacity-75">
                    Essayez avec d'autres mots-clés ou ajustez vos filtres
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-[var(--foreground)] opacity-40" />
                <h3 className="mt-2 text-sm font-medium text-[var(--card-title)]">
                  Commencez votre recherche
                </h3>
                <p className="mt-1 text-sm text-[var(--foreground)] opacity-75">
                  Tapez le nom d'un cactus, agave ou yucca dans la barre de recherche
                </p>
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
        <div className="text-center">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-[var(--foreground)] opacity-40 animate-pulse" />
          <p className="mt-2 text-[var(--foreground)] opacity-75">Chargement de la recherche...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
} 