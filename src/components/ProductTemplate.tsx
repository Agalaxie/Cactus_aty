'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

// Types locaux pour le template
interface ProductCharacteristics {
  matureSize: string;
  careLevel: string;
  coldResistance: number;
  indoorSuitable: boolean;
  flowering: boolean;
  growthRate: string;
}

interface ProductSize {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  latin?: string;
  description: string;
  details: string[];
  basePrice: number;
  images: string[];
  category: string;
  inStock: boolean;
  featured: boolean;
  sizes: ProductSize[];
  characteristics: ProductCharacteristics;
}

interface ProductTemplateProps {
  product: Product;
  showBreadcrumb?: boolean;
}

// Données des catégories (simplifiées)
const categories = {
  'cactus': { name: 'Cactus', icon: '🌵', href: '/categorie/cactus' },
  'agaves': { name: 'Agaves', icon: '🪴', href: '/categorie/agaves' },
  'aloes': { name: 'Aloès', icon: '🌿', href: '/categorie/aloes' },
  'yuccas': { name: 'Yuccas', icon: '🌴', href: '/categorie/yuccas' },
  'dasylirions': { name: 'Dasylirions', icon: '🌾', href: '/categorie/dasylirions' },
  'sujets-exceptionnels': { name: 'Sujets Exceptionnels', icon: '⭐', href: '/categorie/sujets-exceptionnels' }
};

export default function ProductTemplate({ product, showBreadcrumb = true }: ProductTemplateProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const category = categories[product.category as keyof typeof categories] || categories['cactus'];

  // Calcul du prix simple
  const totalPrice = useMemo(() => {
    const selectedSizeData = product.sizes.find(s => s.id === selectedSize);
    const basePrice = selectedSizeData?.price || product.basePrice;
    const quantityDiscount = quantity >= 3 ? 0.9 : quantity >= 2 ? 0.95 : 1;
    return Math.round(basePrice * quantity * quantityDiscount);
  }, [selectedSize, quantity, product.basePrice, product.sizes]);

  // Calcul des frais de livraison
  const shippingCost = useMemo(() => {
    if (totalPrice >= 200) return 0; // Livraison gratuite dès 200€
    
    let baseShipping = 20;
    
    switch (product.category) {
      case 'cactus':
        baseShipping = 25;
        break;
      case 'agaves':
      case 'yuccas':
        baseShipping = 30;
        break;
      case 'sujets-exceptionnels':
        baseShipping = 40;
        break;
      default:
        baseShipping = 20;
    }

    return baseShipping;
  }, [totalPrice, product.category]);

  const finalTotal = totalPrice + shippingCost;
  const selectedSizeInfo = product.sizes.find(s => s.id === selectedSize);

  const handleAddToCart = () => {
    if (!selectedSizeInfo || !product.inStock) return;
    
    setIsAdding(true);
    
    addToCart({
      productName: product.name,
      size: selectedSizeInfo.name,
      quantity: quantity,
      unitPrice: Math.round(totalPrice / quantity),
      totalPrice: totalPrice,
      shippingCost: shippingCost,
      image: product.images[0]
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {showBreadcrumb && (
        <div className="py-6 px-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[var(--accent)] hover:underline">Accueil</Link>
            <span className="text-[var(--foreground)] opacity-50">›</span>
            <Link href={category.href} className="text-[var(--accent)] hover:underline">
              {category.name}
            </Link>
            <span className="text-[var(--foreground)] opacity-50">›</span>
            <span className="text-[var(--card-title)]">{product.name}</span>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Images */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--border)] relative group">
                <Image
                  src={product.images[currentImageIndex] || '/placeholder-cactus.jpg'}
                  alt={product.name}
                  width={500}
                  height={600}
                  className="rounded-xl object-contain w-full h-auto"
                  priority
                />
                
                {/* Navigation des images */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      ←
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {/* Miniatures */}
              {product.images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex 
                          ? 'border-[var(--accent)]' 
                          : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Informations produit */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-sm text-[var(--accent)] font-medium uppercase tracking-wide">
                    {category.name}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-2 text-[var(--card-title)]">{product.name}</h1>
                {product.latin && (
                  <p className="text-lg italic text-[var(--accent)] font-medium">{product.latin}</p>
                )}
              </div>

              {/* Prix */}
              <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-[var(--accent)]">{totalPrice}€</span>
                  {product.inStock ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      En stock
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      Rupture de stock
                    </span>
                  )}
                </div>

                {/* Sélection de taille */}
                {product.sizes.length > 1 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                      Taille
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      {product.sizes.map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.name} - {size.price}€
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quantité */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                    Quantité
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center hover:bg-[var(--card-bg)] transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center hover:bg-[var(--card-bg)] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Récapitulatif */}
                <div className="border-t border-[var(--border)] pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total :</span>
                    <span>{totalPrice}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison :</span>
                    <span>{shippingCost === 0 ? 'Gratuite' : `${shippingCost}€`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-[var(--border)] pt-2">
                    <span>Total :</span>
                    <span className="text-[var(--accent)]">{finalTotal}€</span>
                  </div>
                </div>

                {/* Bouton d'ajout au panier */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                  className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    !product.inStock
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : isAdding
                      ? 'bg-green-500 text-white'
                      : 'bg-[var(--accent)] text-white hover:shadow-lg hover:scale-[1.02]'
                  }`}
                >
                  {!product.inStock 
                    ? 'Produit indisponible'
                    : isAdding
                    ? '✓ Ajouté au panier !'
                    : '🛒 Ajouter au panier'
                  }
                </button>
              </div>

              {/* Caractéristiques */}
              <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
                <h3 className="text-lg font-semibold text-[var(--card-title)] mb-4">
                  Caractéristiques
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--foreground)] opacity-75">Taille adulte :</span>
                    <div className="font-medium">{product.characteristics.matureSize}</div>
                  </div>
                  <div>
                    <span className="text-[var(--foreground)] opacity-75">Entretien :</span>
                    <div className="font-medium">{product.characteristics.careLevel}</div>
                  </div>
                  <div>
                    <span className="text-[var(--foreground)] opacity-75">Résistance au froid :</span>
                    <div className="font-medium">{product.characteristics.coldResistance}°C</div>
                  </div>
                  <div>
                    <span className="text-[var(--foreground)] opacity-75">Croissance :</span>
                    <div className="font-medium">{product.characteristics.growthRate}</div>
                  </div>
                  <div>
                    <span className="text-[var(--foreground)] opacity-75">Intérieur :</span>
                    <div className="font-medium">{product.characteristics.indoorSuitable ? 'Oui' : 'Non'}</div>
                  </div>
                  <div>
                    <span className="text-[var(--foreground)] opacity-75">Floraison :</span>
                    <div className="font-medium">{product.characteristics.flowering ? 'Oui' : 'Non'}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
                <h3 className="text-lg font-semibold text-[var(--card-title)] mb-4">
                  Description
                </h3>
                <div className="prose prose-sm max-w-none text-[var(--foreground)]">
                  <p>{product.description}</p>
                  {product.details.map((detail, index) => (
                    <p key={index}>{detail}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}