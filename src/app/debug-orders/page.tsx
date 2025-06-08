'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';

export default function DebugOrdersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test-orders-raw')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--background)] py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Chargement...</h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-[var(--card-title)] mb-6">
            🔍 Debug Commandes
          </h1>
          
          {data && (
            <div className="space-y-6">
              {/* Utilisateur actuel */}
              <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
                <h2 className="text-xl font-semibold text-[var(--card-title)] mb-4">
                  👤 Utilisateur actuel
                </h2>
                <pre className="bg-[var(--background)] p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(data.currentUser, null, 2)}
                </pre>
              </div>

              {/* Commandes */}
              <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
                <h2 className="text-xl font-semibold text-[var(--card-title)] mb-4">
                  📦 Commandes ({data.ordersRaw?.length || 0})
                </h2>
                
                {data.ordersRaw && data.ordersRaw.length > 0 ? (
                  <div className="space-y-4">
                    {data.ordersRaw.map((order: any, index: number) => (
                      <div key={index} className="bg-[var(--background)] p-4 rounded-lg border border-[var(--border)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h3 className="font-bold text-[var(--card-title)] mb-2">
                              Commande #{order.id}
                            </h3>
                            <p><strong>Email:</strong> {order.customer_email}</p>
                            <p><strong>Nom:</strong> {order.customer_name || 'N/A'}</p>
                            <p><strong>Téléphone:</strong> {order.customer_phone || 'N/A'}</p>
                            <p><strong>Montant:</strong> {(order.total_amount / 100).toFixed(2)}€</p>
                          </div>
                          <div>
                            <p><strong>Statut paiement:</strong> {order.payment_status}</p>
                            <p><strong>Statut commande:</strong> {order.order_status}</p>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString('fr-FR')}</p>
                            <p><strong>Session:</strong> {order.stripe_session_id?.slice(0, 30)}...</p>
                          </div>
                        </div>
                        
                        {order.customer_address && (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                            <strong>Adresse:</strong> {order.customer_address}
                          </div>
                        )}
                        
                        {order.items && (
                          <div className="mt-3">
                            <strong>Articles:</strong>
                            <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(order.items, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--foreground)] opacity-75">
                    Aucune commande trouvée
                  </p>
                )}
              </div>

              {/* Erreurs */}
              {data.errors && (
                <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
                  <h2 className="text-xl font-semibold text-[var(--card-title)] mb-4">
                    ⚠️ Erreurs
                  </h2>
                  <pre className="bg-[var(--background)] p-4 rounded-lg text-sm overflow-auto">
                    {JSON.stringify(data.errors, null, 2)}
                  </pre>
                </div>
              )}

              {/* Données complètes */}
              <details className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
                <summary className="text-xl font-semibold text-[var(--card-title)] cursor-pointer">
                  🔧 Données complètes (debug)
                </summary>
                <pre className="bg-[var(--background)] p-4 rounded-lg text-xs overflow-auto mt-4">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 