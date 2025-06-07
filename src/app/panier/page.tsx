'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { stripePromise } from '@/lib/stripe-client';
import { motion } from 'framer-motion';

export default function PanierPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fonction pour obtenir une image placeholder
  const getPlaceholderImage = () => {
    return "data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='200' height='200' fill='%23f3f4f6'/%3e%3cg transform='translate(100%2c100)'%3e%3ccircle cx='0' cy='-20' r='15' fill='%2310b981'/%3e%3cpath d='M-3%2c-30 Q0%2c-35 3%2c-30 L2%2c-18 L-2%2c-18 Z' fill='%2310b981'/%3e%3cellipse cx='0' cy='10' rx='20' ry='10' fill='%23d97706'/%3e%3c/g%3e%3c/svg%3e";
  };

  const fraisLivraison = totalPrice >= 200 ? 0 : 15;
  const totalFinal = totalPrice + fraisLivraison;

  const handlePayment = async () => {
    if (items.length === 0) return;
    
    setIsProcessingPayment(true);
    
    try {
      // Créer une session de paiement Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        alert(`Erreur : ${error}`);
        return;
      }

      // Rediriger vers Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (error) {
          alert(`Erreur Stripe : ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      alert('Erreur lors du traitement du paiement');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[var(--card-title)] mb-8">Mon Panier</h1>
          
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">🛒</div>
            <h2 className="text-2xl font-bold text-[var(--card-title)] mb-4">
              Votre panier est vide
            </h2>
            <p className="text-[var(--foreground)] opacity-75 mb-8">
              Découvrez notre collection de cactus et plantes exceptionnelles
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity"
            >
              <span>🌵</span>
              Découvrir nos plantes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--card-title)]">Mon Panier</h1>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <TrashIcon className="h-5 w-5" />
            Vider le panier
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemPrice = item.selectedVariant?.price || item.product.price;
              const itemTotal = itemPrice * item.quantity;

              return (
                <div key={item.id} className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-start gap-4">
                    {/* Image produit */}
                    <div className="w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.product.image_url || getPlaceholderImage()}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getPlaceholderImage();
                        }}
                      />
                    </div>

                    {/* Informations produit */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[var(--card-title)] mb-1">
                        {item.product.name}
                      </h3>
                      {item.selectedVariant && (
                        <p className="text-sm text-[var(--foreground)] opacity-75 mb-2">
                          Taille : {item.selectedVariant.height}
                        </p>
                      )}
                      <p className="text-sm text-[var(--foreground)] opacity-75 capitalize">
                        {item.product.category}
                      </p>
                    </div>

                    {/* Prix et contrôles */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-[var(--accent)]">
                          {itemTotal.toFixed(2)}€
                        </div>
                        <div className="text-sm text-[var(--foreground)] opacity-75">
                          {itemPrice.toFixed(2)}€ / unité
                        </div>
                      </div>

                      {/* Contrôles quantité */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border)] hover:bg-[var(--card-bg)] transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border)] hover:bg-[var(--card-bg)] transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Supprimer */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Supprimer cet article"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6 sticky top-4">
              <h2 className="text-xl font-bold text-[var(--card-title)] mb-6">
                Récapitulatif
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''})</span>
                  <span className="font-medium">{totalPrice.toFixed(2)}€</span>
                </div>

                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="font-medium">
                    {fraisLivraison === 0 ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      `${fraisLivraison.toFixed(2)}€`
                    )}
                  </span>
                </div>

                {totalPrice < 200 && (
                  <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    💡 Plus que {(200 - totalPrice).toFixed(2)}€ pour la livraison gratuite !
                  </div>
                )}

                <hr className="border-[var(--border)]" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[var(--accent)]">{totalFinal.toFixed(2)}€</span>
                </div>
              </div>

              <div className="space-y-3">
                {totalItems > 0 ? (
                  <Link
                    href="/commande"
                    className="block w-full bg-[var(--accent)] text-white py-3 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-2"
                  >
                    <span>📋</span>
                    Procéder au paiement
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-bold text-lg cursor-not-allowed opacity-50"
                  >
                    Panier vide
                  </button>
                )}
                
                <Link
                  href="/"
                  className="block w-full text-center border border-[var(--border)] text-[var(--card-title)] py-3 px-6 rounded-lg font-medium hover:bg-[var(--card-bg)] transition-colors"
                >
                  Continuer mes achats
                </Link>
              </div>

              {/* Avantages */}
              <div className="mt-6 pt-6 border-t border-[var(--border)] space-y-2 text-sm text-[var(--foreground)]">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Livraison sécurisée</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Garantie plante en bonne santé</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Support et conseils inclus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal confirmation vider panier */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-[var(--card-title)] mb-4">
              Vider le panier ?
            </h3>
            <p className="text-[var(--foreground)] mb-6">
              Cette action supprimera tous les articles de votre panier. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 border border-[var(--border)] text-[var(--card-title)] py-2 px-4 rounded-lg hover:bg-[var(--card-bg)] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 