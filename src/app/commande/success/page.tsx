'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // Vérifier la session de paiement
      fetch(`/api/verify-payment?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSessionData(data.session);
            // Vider le panier après succès de paiement
            clearCart();
          } else {
            setError(data.error || 'Erreur lors de la vérification du paiement');
          }
        })
        .catch(err => {
          console.error('Erreur:', err);
          setError('Erreur lors de la vérification du paiement');
        })
        .finally(() => setLoading(false));
    } else {
      setError('Session de paiement non trouvée');
      setLoading(false);
    }
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
            <p className="text-[var(--foreground)]">Vérification du paiement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-red-500 mb-4">Erreur de paiement</h1>
          <p className="text-[var(--foreground)] mb-8">{error}</p>
          <div className="space-y-4">
            <Link
              href="/panier"
              className="inline-block bg-[var(--accent)] text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Retour au panier
            </Link>
            <br />
            <Link
              href="/"
              className="inline-block text-[var(--accent)] hover:underline"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          {/* Icône moderne animée */}
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-2xl"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg">
              <svg 
                className="w-12 h-12 text-white animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Paiement réussi !
          </h1>
          <p className="text-xl text-[var(--foreground)] opacity-75">
            Votre commande a été validée avec succès
          </p>
        </div>

        {sessionData && (
          <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] mb-8">
            <h2 className="text-2xl font-bold text-[var(--card-title)] mb-6">
              Récapitulatif de votre commande
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-[var(--card-title)] mb-3">Informations de paiement</h3>
                <div className="space-y-2 text-[var(--foreground)]">
                  <p><strong>ID de session :</strong> {sessionData.id}</p>
                  <p><strong>Montant :</strong> {(sessionData.amount_total / 100).toFixed(2)}€</p>
                  <p><strong>Status :</strong> 
                    <span className="text-green-600 font-semibold ml-2">Payé</span>
                  </p>
                  <p><strong>Email :</strong> {sessionData.customer_details?.email || 'Non fourni'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[var(--card-title)] mb-3">Livraison</h3>
                <div className="space-y-2 text-[var(--foreground)]">
                  {sessionData.customer_details?.address ? (
                    <>
                      <p><strong>Nom :</strong> {sessionData.customer_details.name}</p>
                      <p><strong>Adresse :</strong></p>
                      <div className="ml-4">
                        <p>{sessionData.customer_details.address.line1}</p>
                        {sessionData.customer_details.address.line2 && (
                          <p>{sessionData.customer_details.address.line2}</p>
                        )}
                        <p>
                          {sessionData.customer_details.address.postal_code} {sessionData.customer_details.address.city}
                        </p>
                        <p>{sessionData.customer_details.address.country}</p>
                      </div>
                    </>
                  ) : (
                    <p>Informations de livraison non disponibles</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-2xl">📧</span>
            <div>
              <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">
                Email de confirmation envoyé
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Vous allez recevoir un email de confirmation avec tous les détails de votre commande. 
                Votre commande sera expédiée sous 24-48h.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-2xl">🚚</span>
            <div>
              <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
                Suivi de livraison
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Vous recevrez un numéro de suivi par email dès l'expédition de votre commande. 
                Livraison estimée : 24-48h en France métropolitaine.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-block bg-[var(--accent)] text-white px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity"
          >
            Continuer mes achats
          </Link>
          
          <div>
            <Link
              href="/espace-client"
              className="text-[var(--accent)] hover:underline"
            >
              Voir mes commandes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant de fallback pour le Suspense
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
          <p className="text-[var(--foreground)]">Chargement...</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PaymentSuccessContent />
    </Suspense>
  );
} 