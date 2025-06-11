'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import ColdResistanceFilter from '@/components/ColdResistanceFilter';
import Link from 'next/link';
import Image from 'next/image';

interface FilteredProductsResponse {
  products: (Product & { cold_resistance_description?: string })[];
  total: number;
  filter: {
    minTemperature: number | null;
    category: string;
  };
}

export default function ColdResistancePage() {
  const [products, setProducts] = useState<(Product & { cold_resistance_description?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchProducts = async (minTemperature: number | null, category: string = 'all') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (minTemperature !== null) {
        params.append('minTemperature', minTemperature.toString());
      }
      if (category !== 'all') {
        params.append('category', category);
      }

      const response = await fetch(`/api/products-by-cold-resistance?${params.toString()}`);
      if (response.ok) {
        const data: FilteredProductsResponse = await response.json();
        setProducts(data.products);
      } else {
        console.error('Erreur lors de la récupération des produits');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentFilter, selectedCategory);
  }, [currentFilter, selectedCategory]);

  const handleFilterChange = (minTemperature: number | null) => {
    setCurrentFilter(minTemperature);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const categories = ['all', 'Cactus', 'Agaves', 'Aloès'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--background)] pt-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--card-title)] mb-4">
            🌡️ Filtre par Résistance au Froid
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Trouvez les plantes adaptées à votre climat en filtrant par température minimale supportée.
            Parfait pour choisir des cactus, agaves et aloès pour votre jardin ou terrasse.
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white dark:bg-[var(--card-bg)] rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Filtre par résistance au froid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Résistance au froid
              </label>
              <ColdResistanceFilter 
                onFilterChange={handleFilterChange}
                currentFilter={currentFilter}
              />
            </div>

            {/* Filtre par catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-[var(--card-bg)] border border-gray-300 dark:border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Toutes les catégories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="bg-white dark:bg-[var(--card-bg)] rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des produits...</p>
            </div>
          ) : (
            <>
              {/* En-tête des résultats */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--card-title)]">
                  {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
                </h2>
                {currentFilter !== null && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Résistance minimum : {currentFilter}°C
                  </div>
                )}
              </div>

              {/* Grille des produits */}
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Link key={product.id} href={`/produit/${product.id}`}>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        {/* Image */}
                        <div className="aspect-square relative bg-gray-200 dark:bg-gray-700">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              🌵
                            </div>
                          )}
                        </div>

                        {/* Contenu */}
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 dark:text-[var(--card-title)] mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          
                          {/* Informations de résistance au froid */}
                          <div className="mb-2">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <span className="mr-2">🌡️</span>
                              Minimum : {product.min_temperature ?? 'N/A'}°C
                            </div>
                            <div className="text-xs text-[var(--accent)] font-medium">
                              {product.cold_resistance_description || 'Non spécifié'}
                            </div>
                            {product.winter_protection_needed && (
                              <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                ⚠️ Protection hivernale recommandée
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-[var(--accent)]">
                              {product.price.toFixed(2)}€
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-[var(--card-title)] mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Essayez de modifier vos critères de filtrage pour voir plus de résultats.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Informations utiles */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
            💡 Comment utiliser ce filtre ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
            <div>
              <h4 className="font-medium mb-2">Zones climatiques France :</h4>
              <ul className="space-y-1">
                <li>• <strong>Nord/Est :</strong> -10°C à -15°C</li>
                <li>• <strong>Centre :</strong> -5°C à -10°C</li>
                <li>• <strong>Ouest/Sud-Ouest :</strong> 0°C à -5°C</li>
                <li>• <strong>Méditerranée :</strong> 0°C à 5°C</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Conseils :</h4>
              <ul className="space-y-1">
                <li>• Choisissez une résistance inférieure à votre température minimale</li>
                <li>• Prévoyez une protection hivernale si indiqué</li>
                <li>• Les agaves sont généralement plus résistants</li>
                <li>• Testez d'abord avec une plante avant d'investir dans plusieurs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 