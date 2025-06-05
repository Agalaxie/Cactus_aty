'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useMemo } from "react";
import Header from "../../../components/Header";
import { useCart } from "../../../components/CartContext";

const product = {
  name: "Cereus Peruvianus XL",
  latin: "Cereus peruvianus",
  basePrice: 229,
  images: [
    "/cactus-2.png",
    "/cactus-2-detail.png",
    "/cactus-2-side.png"
  ],
  description: `
    <strong>Cereus peruvianus</strong>, également appelé cactus cierge du Pérou, est un cactus colonnaire majestueux qui peut atteindre des hauteurs impressionnantes. Ses côtes marquées et ses épines courtes en font un choix parfait pour créer un point focal dramatique dans votre jardin ou votre intérieur. Cette espèce robuste est idéale pour les collectionneurs cherchant un spécimen imposant.
  `,
  details: [
    "Origine : Amérique du Sud (Pérou, Argentine)",
    "Croissance verticale impressionnante",
    "Résistant à la sécheresse",
    "Floraison nocturne spectaculaire (sur sujets matures)",
    "Adapté aux intérieurs lumineux et jardins",
    "Livraison sécurisée partout en France",
    "Garantie 2 ans"
  ],
  sizes: [
    { id: "medium", label: "1.0m - 1.3m (M)", multiplier: 1 },
    { id: "large", label: "1.3m - 1.6m (L)", multiplier: 1.3 },
    { id: "xlarge", label: "1.6m - 2.0m (XL)", multiplier: 1.6 },
    { id: "custom", label: "Sur mesure (nous contacter)", multiplier: 2.2 }
  ],
  advantages: [
    { icon: "🌿", label: "Garantie 2 ans" },
    { icon: "📦", label: "Livraison soignée" },
    { icon: "💳", label: "Paiement sécurisé" },
  ]
};

export default function CereusProduct() {
  const { addToCart, getTotalItems } = useCart();
  const [selectedSize, setSelectedSize] = useState("large");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // Calcul du prix dynamique
  const totalPrice = useMemo(() => {
    const size = product.sizes.find(s => s.id === selectedSize);
    const sizeMultiplier = size?.multiplier || 1;
    const quantityDiscount = quantity >= 3 ? 0.9 : quantity >= 2 ? 0.95 : 1;
    return Math.round(product.basePrice * sizeMultiplier * quantity * quantityDiscount);
  }, [selectedSize, quantity]);

  // Calcul des frais de livraison
  const shippingCost = useMemo(() => {
    if (totalPrice >= 200) return 0; // Livraison gratuite dès 200€
    
    const size = product.sizes.find(s => s.id === selectedSize);
    switch (size?.id) {
      case "medium": return 30; // Cactus M
      case "large": return 40;  // Cactus L  
      case "xlarge": return 50; // Cactus XL
      case "custom": return 70; // Sur mesure
      default: return 40;
    }
  }, [selectedSize, totalPrice]);

  const finalTotal = totalPrice + shippingCost;
  const selectedSizeInfo = product.sizes.find(s => s.id === selectedSize);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    addToCart({
      productName: product.name,
      size: selectedSizeInfo?.label || '',
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
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      {/* Breadcrumb */}
      <div className="py-6 px-4 max-w-6xl mx-auto w-full">
        <Link href="/" className="text-[var(--accent)] font-medium hover:underline transition-colors">
          ← Retour à l'accueil
        </Link>
      </div>

      {/* Contenu principal */}
      <main className="flex-1 py-10 px-4 bg-[var(--background)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Galerie d'images */}
            <motion.div
              className="sticky top-4"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              {/* Image principale */}
              <div className="relative group">
                <Image
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  width={400}
                  height={500}
                  className="rounded-xl object-contain w-full h-auto max-h-[80vh]"
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
              </div>

              {/* Miniatures */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 justify-center">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
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
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <div>
                <h1 className="text-4xl font-bold mb-2 text-[var(--card-title)]">{product.name}</h1>
                <p className="text-lg italic text-[var(--accent)] font-medium">{product.latin}</p>
              </div>

              {/* Prix dynamique */}
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
                    <span>Sous-total ({quantity}x cactus)</span>
                    <span>{totalPrice}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                      {shippingCost === 0 ? "Gratuite 🎉" : `${shippingCost}€`}
                    </span>
                  </div>
                  {shippingCost === 0 && totalPrice < 200 && (
                    <p className="text-xs text-green-600">
                      Livraison gratuite car commande ≥ 200€
                    </p>
                  )}
                  {shippingCost > 0 && (
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--card-title)] mb-2">
                    Taille :
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  >
                    {product.sizes.map((size) => (
                      <option key={size.id} value={size.id}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

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
                      🎉 Achetez {quantity >= 3 ? "3+" : "2+"} cactus et économisez {quantity >= 3 ? "10%" : "5%"} !
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none text-[var(--foreground)]" 
                   dangerouslySetInnerHTML={{ __html: product.description }} />

              {/* Détails */}
              <ul className="space-y-2">
                {product.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 text-[var(--foreground)]">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    {detail}
                  </li>
                ))}
              </ul>

              {/* Bouton d'achat */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isAdding}
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

              {/* Avantages */}
              <div className="flex flex-wrap gap-3">
                {product.advantages.map((adv, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm font-medium">
                    <span>{adv.icon}</span>
                    <span className="text-[var(--card-title)]">{adv.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>


    </div>
  );
} 