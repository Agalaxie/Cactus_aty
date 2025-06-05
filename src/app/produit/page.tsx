'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useMemo } from "react";
import Header from "../../components/Header";

const product = {
  name: "Euphorbia Ingens XXL",
  latin: "Euphorbia ingens",
  basePrice: 299,
  image: "/cactus-vedette.png",
  description: `
    <strong>Euphorbia ingens</strong> est une espèce rare de cactus-arbre originaire d'Afrique australe, appréciée pour sa silhouette majestueuse et sa facilité d'entretien. Idéale pour les intérieurs lumineux ou les jardins d'hiver, elle peut atteindre plus de 1,8 mètre de haut. Quantité très limitée !
  `,
  details: [
    "Origine : Afrique australe",
    "Entretien facile, peu d'arrosage",
    "Livraison sécurisée partout en France",
    "Garantie 2 ans"
  ],
  sizes: [
    { id: "medium", label: "1.2m - 1.5m (L)", multiplier: 1 },
    { id: "large", label: "1.5m - 1.8m (XL)", multiplier: 1.3 },
    { id: "xlarge", label: "1.8m - 2m (XXL)", multiplier: 1.6 },
    { id: "custom", label: "Sur mesure (nous contacter)", multiplier: 2 }
  ],
  advantages: [
    { icon: "🌿", label: "Garantie 2 ans" },
    { icon: "📦", label: "Livraison soignée" },
    { icon: "💳", label: "Paiement sécurisé" },
  ]
};

export default function Produit() {
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("xlarge");
  const [quantity, setQuantity] = useState(1);

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
      case "medium": return 25; // Cactus L
      case "large": return 35;  // Cactus XL  
      case "xlarge": return 45; // Cactus XXL
      case "custom": return 65; // Sur mesure
      default: return 35;
    }
  }, [selectedSize, totalPrice]);

  const finalTotal = totalPrice + shippingCost;
  const selectedSizeInfo = product.sizes.find(s => s.id === selectedSize);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        quantity: quantity,
        size: selectedSizeInfo?.label,
        totalPrice: finalTotal
      }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur lors de la création de la session de paiement.");
      setLoading(false);
    }
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
            
            {/* Image principale */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--border)]">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={500}
                  className="rounded-xl object-contain w-full h-auto"
                  priority
                />
              </div>
            </motion.div>

            {/* Infos produit */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
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
              <motion.button
                onClick={handleCheckout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white rounded-2xl font-semibold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Redirection..." : `Acheter pour ${finalTotal}€`}
              </motion.button>

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

      <footer className="py-8 text-center text-[var(--foreground)] text-sm border-t border-[var(--border)] bg-[var(--background)]">
        © {new Date().getFullYear()} Atypic Cactus. Site inspiré par Stripe. Illustrations temporaires.
      </footer>
    </div>
  );
} 