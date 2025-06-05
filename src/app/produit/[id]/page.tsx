'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import { useCart } from '../../../components/CartContext';
import { getProductById, getCategoryById } from '../../../data/products';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const { addToCart, getTotalItems } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const product = getProductById(productId);

  // Initialize selectedSize when product loads
  useState(() => {
    if (product && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0].id);
    }
  });

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4 opacity-50">🌵</div>
          <h1 className="text-3xl font-bold text-[var(--card-title)] mb-4">Produit non trouvé</h1>
          <p className="text-[var(--foreground)] opacity-75 mb-8">
            Ce produit n'existe pas ou n'est plus disponible.
          </p>
          <Link href="/" className="bg-[var(--accent)] text-white px-6 py-3 rounded-lg hover:bg-[var(--accent)]/90 transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const category = getCategoryById(product.category);

  // Set default size if none selected
  if (!selectedSize && product.sizes.length > 0) {
    setSelectedSize(product.sizes[0].id);
  }

  // Calcul du prix dynamique
  const totalPrice = useMemo(() => {
    const size = product.sizes.find(s => s.id === selectedSize);
    const sizeMultiplier = size?.multiplier || 1;
    const quantityDiscount = quantity >= 3 ? 0.9 : quantity >= 2 ? 0.95 : 1;
    return Math.round(product.basePrice * sizeMultiplier * quantity * quantityDiscount);
  }, [selectedSize, quantity, product.basePrice, product.sizes]);

  // Calcul des frais de livraison
  const shippingCost = useMemo(() => {
    if (totalPrice >= 200) return 0; // Livraison gratuite dès 200€
    
    const size = product.sizes.find(s => s.id === selectedSize);
    // Calcul basé sur la catégorie et la taille
    let baseShipping = 20;
    
    switch (product.category) {
      case 'boutures':
        baseShipping = 15;
        break;
      case 'aloes':
        baseShipping = 20;
        break;
      case 'agaves':
      case 'yuccas':
        baseShipping = 30;
        break;
      case 'cactus':
        baseShipping = 35;
        break;
      case 'sujets-exceptionnels':
        baseShipping = 50;
        break;
    }

    // Ajustement selon la taille
    const sizeMultiplier = size?.multiplier || 1;
    return Math.round(baseShipping * sizeMultiplier);
  }, [selectedSize, totalPrice, product.category, product.sizes]);

  const finalTotal = totalPrice + shippingCost;
  const selectedSizeInfo = product.sizes.find(s => s.id === selectedSize);

  const handleAddToCart = () => {
    if (!selectedSizeInfo) return;
    
    setIsAdding(true);
    
    addToCart({
      productName: product.name,
      size: selectedSizeInfo.label,
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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Breadcrumb */}
      <div className="py-6 px-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-[var(--accent)] hover:underline">Accueil</Link>
          <span className="text-[var(--foreground)] opacity-50">›</span>
          <Link href={category?.href || '/'} className="text-[var(--accent)] hover:underline">
            {category?.name || 'Produits'}
          </Link>
          <span className="text-[var(--foreground)] opacity-50">›</span>
          <span className="text-[var(--card-title)]">{product.name}</span>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Galerie d'images */}
            <motion.div
              className="sticky top-4"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Image principale */}
              <div className="relative group mb-4">
                <div className="aspect-square relative rounded-2xl overflow-hidden bg-[var(--card-bg)]">
                  <Image
                    src={product.images[currentImageIndex] || '/placeholder-cactus.png'}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Boutons de navigation */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        →
                      </button>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.featured && (
                      <span className="bg-[var(--accent)] text-white px-3 py-1 rounded-full text-sm font-medium">
                        ⭐ Produit vedette
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Rupture de stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Miniatures */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex 
                          ? "border-[var(--accent)]" 
                          : "border-[var(--border)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Miniature ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Infos produit */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{category?.icon}</span>
                  <span className="text-sm text-[var(--accent)] font-medium uppercase tracking-wide">
                    {category?.name}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-2 text-[var(--card-title)]">{product.name}</h1>
                {product.latin && (
                  <p className="text-lg italic text-[var(--accent)] font-medium">{product.latin}</p>
                )}
              </div>

              {/* Prix */}
              <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)]">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-3xl font-bold text-[var(--accent)]">{finalTotal}€</span>
                  {quantity >= 2 && (
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {quantity >= 3 ? "Remise -10%" : "Remise -5%"}
                    </span>
                  )}
                </div>
                
                {/* Détail du prix */}
                <div className="space-y-2 text-sm text-[var(--foreground)] opacity-75 border-t border-[var(--border)] pt-3">
                  <div className="flex justify-between">
                    <span>Sous-total ({quantity}x {selectedSizeInfo?.label || 'produit'})</span>
                    <span>{totalPrice}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                      {shippingCost === 0 ? "Gratuite 🎉" : `${shippingCost}€`}
                    </span>
                  </div>
                  {shippingCost > 0 && totalPrice < 200 && (
                    <p className="text-xs text-[var(--accent)]">
                      Livraison gratuite dès 200€ (encore {200 - totalPrice}€)
                    </p>
                  )}
                  <div className="flex justify-between font-semibold text-[var(--card-title)] border-t border-[var(--border)] pt-2">
                    <span>Total TTC</span>
                    <span>{finalTotal}€</span>
                  </div>
                </div>
              </div>

              {/* Sélecteurs */}
              {product.inStock && (
                <div className="space-y-4">
                  {/* Taille */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--card-title)] mb-2">
                      Taille :
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      {product.sizes.map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantité */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--card-title)] mb-2">
                      Quantité :
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--card-title)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold text-[var(--card-title)]">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--card-title)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                    {quantity >= 2 && (
                      <p className="text-xs text-green-600 mt-1">
                        🎉 Économisez {quantity >= 3 ? "10%" : "5%"} sur cette commande !
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              {product.inStock ? (
                <div className="space-y-3">
                  <motion.button
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isAdding || !selectedSizeInfo}
                    className="w-full px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white rounded-2xl font-semibold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-60"
                  >
                    {isAdding ? "Ajouté ✓" : `Ajouter au panier • ${finalTotal}€`}
                  </motion.button>
                  
                  <Link href="/commande" className="block w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-8 py-3 border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white rounded-2xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      Voir le panier ({getTotalItems()})
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Produit indisponible</h3>
                  <p className="text-red-600 mb-4">Ce produit est actuellement en rupture de stock.</p>
                  <Link href="/contact" className="text-red-600 hover:text-red-800 font-medium underline">
                    Être notifié de la disponibilité
                  </Link>
                </div>
              )}

              {/* Description */}
              <div className="prose prose-sm max-w-none text-[var(--foreground)]">
                <h3 className="text-lg font-semibold text-[var(--card-title)] mb-3">Description</h3>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>

              {/* Détails */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--card-title)] mb-3">Caractéristiques</h3>
                <ul className="space-y-2">
                  {product.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-[var(--foreground)]">
                      <span className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
} 