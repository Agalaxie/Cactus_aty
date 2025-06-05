'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import { getProductsByCategory, getCategoryById, CategoryType } from '../../../data/products';

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'featured';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as CategoryType;
  
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showOnlyInStock, setShowOnlyInStock] = useState(true);
  
  // Nouveaux filtres
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColdResistance, setSelectedColdResistance] = useState<string>('all');
  const [selectedCareLevel, setSelectedCareLevel] = useState<string>('all');
  const [selectedGrowthRate, setSelectedGrowthRate] = useState<string>('all');
  const [showOnlyFlowering, setShowOnlyFlowering] = useState(false);
  const [showOnlyIndoor, setShowOnlyIndoor] = useState(false);
  const [showOnlyDroughtTolerant, setShowOnlyDroughtTolerant] = useState(false);

  const category = getCategoryById(categoryId);
  const allProducts = getProductsByCategory(categoryId);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const inPriceRange = product.basePrice >= priceRange[0] && product.basePrice <= priceRange[1];
      const inStock = showOnlyInStock ? product.inStock : true;
      
      // Filtres avancés basés sur les caractéristiques
      const characteristics = product.characteristics;
      
      const sizeMatch = selectedSize === 'all' || !characteristics || characteristics.matureSize === selectedSize;
      
      const coldResistanceMatch = selectedColdResistance === 'all' || !characteristics || (() => {
        switch (selectedColdResistance) {
          case 'tres-resistant': return characteristics.coldResistance <= -10;
          case 'resistant': return characteristics.coldResistance <= -5 && characteristics.coldResistance > -10;
          case 'peu-resistant': return characteristics.coldResistance > -5;
          default: return true;
        }
      })();
      
      const careLevelMatch = selectedCareLevel === 'all' || !characteristics || characteristics.careLevel === selectedCareLevel;
      const growthRateMatch = selectedGrowthRate === 'all' || !characteristics || characteristics.growthRate === selectedGrowthRate;
      
      const floweringMatch = !showOnlyFlowering || !characteristics || characteristics.flowering;
      const indoorMatch = !showOnlyIndoor || !characteristics || characteristics.indoorSuitable;
      const droughtTolerantMatch = !showOnlyDroughtTolerant || !characteristics || characteristics.droughtTolerant;
      
      return inPriceRange && inStock && sizeMatch && coldResistanceMatch && 
             careLevelMatch && growthRateMatch && floweringMatch && indoorMatch && droughtTolerantMatch;
    });

    // Tri
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'featured':
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.basePrice - b.basePrice;
        });
        break;
    }

    return filtered;
  }, [allProducts, sortBy, priceRange, showOnlyInStock, selectedSize, selectedColdResistance, 
      selectedCareLevel, selectedGrowthRate, showOnlyFlowering, showOnlyIndoor, showOnlyDroughtTolerant]);

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
          {/* Première ligne : Tri et stock */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[var(--card-title)]">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="featured">Mis en avant</option>
                <option value="name">Nom A-Z</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOnlyInStock}
                  onChange={(e) => setShowOnlyInStock(e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-[var(--card-title)]">En stock seulement</span>
              </label>
            </div>
          </div>

          {/* Filtres avancés */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Taille adulte */}
            <div>
              <label className="block text-xs font-medium text-[var(--card-title)] mb-1">Taille adulte :</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="all">Toutes tailles</option>
                <option value="petit">🌱 Petit</option>
                <option value="moyen">🌿 Moyen</option>
                <option value="grand">🌳 Grand</option>
                <option value="géant">🌲 Géant</option>
              </select>
            </div>

            {/* Résistance au froid */}
            <div>
              <label className="block text-xs font-medium text-[var(--card-title)] mb-1">Résistance au gel :</label>
              <select
                value={selectedColdResistance}
                onChange={(e) => setSelectedColdResistance(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="all">Toutes résistances</option>
                <option value="tres-resistant">❄️ Très résistant (-10°C et plus)</option>
                <option value="resistant">🧊 Résistant (-5°C à -10°C)</option>
                <option value="peu-resistant">🌡️ Peu résistant (+5°C)</option>
              </select>
            </div>

            {/* Facilité d'entretien */}
            <div>
              <label className="block text-xs font-medium text-[var(--card-title)] mb-1">Entretien :</label>
              <select
                value={selectedCareLevel}
                onChange={(e) => setSelectedCareLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="all">Tous niveaux</option>
                <option value="facile">✅ Facile</option>
                <option value="moyen">⚡ Moyen</option>
                <option value="difficile">🔥 Difficile</option>
              </select>
            </div>

            {/* Vitesse de croissance */}
            <div>
              <label className="block text-xs font-medium text-[var(--card-title)] mb-1">Croissance :</label>
              <select
                value={selectedGrowthRate}
                onChange={(e) => setSelectedGrowthRate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="all">Toutes vitesses</option>
                <option value="rapide">🚀 Rapide</option>
                <option value="moyenne">🚶 Moyenne</option>
                <option value="lente">🐌 Lente</option>
              </select>
            </div>
          </div>

          {/* Filtres par propriétés */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showOnlyFlowering}
                onChange={(e) => setShowOnlyFlowering(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span className="text-[var(--card-title)]">🌸 Floraison</span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showOnlyIndoor}
                onChange={(e) => setShowOnlyIndoor(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span className="text-[var(--card-title)]">🏠 Adapté intérieur</span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showOnlyDroughtTolerant}
                onChange={(e) => setShowOnlyDroughtTolerant(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span className="text-[var(--card-title)]">🏜️ Résistant sécheresse</span>
            </label>

            {/* Bouton reset */}
            <button
              onClick={() => {
                setSelectedSize('all');
                setSelectedColdResistance('all');
                setSelectedCareLevel('all');
                setSelectedGrowthRate('all');
                setShowOnlyFlowering(false);
                setShowOnlyIndoor(false);
                setShowOnlyDroughtTolerant(false);
              }}
              className="text-sm text-[var(--accent)] hover:text-[var(--accent)]/80 font-medium"
            >
              🔄 Réinitialiser filtres
            </button>
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
                          {product.description}
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
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 