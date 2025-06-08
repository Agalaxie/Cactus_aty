'use client';

import { useState } from 'react';
import Header from '@/components/Header';

export default function TestCommandesPage() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!email.trim()) {
      setError('Veuillez entrer un email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/user-orders-by-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        setError('');
      } else {
        setError(data.error || 'Erreur lors de la récupération');
        setOrders([]);
      }
    } catch (err) {
      setError('Erreur de connexion');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-[var(--card-title)] mb-6">
            🔍 Test Commandes par Email
          </h1>
          
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] mb-6">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Entrez l'email du client..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--background)] text-[var(--foreground)]"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {orders.length > 0 && (
            <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--card-title)] mb-4">
                📦 Commandes trouvées ({orders.length})
              </h2>
              
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <div key={index} className="bg-[var(--background)] p-4 rounded-lg border border-[var(--border)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold text-[var(--card-title)] mb-2">
                          Commande #{order.id}
                        </h3>
                        <p className="text-sm"><strong>Email:</strong> {order.customer_email}</p>
                        <p className="text-sm"><strong>Nom:</strong> {order.customer_name || 'N/A'}</p>
                        <p className="text-sm"><strong>Téléphone:</strong> {order.customer_phone || 'N/A'}</p>
                        <p className="text-sm"><strong>Montant:</strong> {order.total_amount_formatted}€</p>
                      </div>
                      <div>
                        <p className="text-sm"><strong>Statut paiement:</strong> {order.payment_status}</p>
                        <p className="text-sm"><strong>Statut commande:</strong> {order.order_status}</p>
                        <p className="text-sm"><strong>Date:</strong> {order.created_at_formatted}</p>
                        <p className="text-sm"><strong>Session:</strong> {order.stripe_session_id?.slice(0, 30)}...</p>
                      </div>
                    </div>
                    
                    {order.customer_address && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                        <p className="text-sm"><strong>Adresse:</strong> {order.customer_address}</p>
                      </div>
                    )}
                    
                    {order.items && order.items.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Articles commandés:</p>
                        <div className="space-y-1">
                          {order.items.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="flex justify-between text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              <span>{item.description || item.name || 'Article'} x{item.quantity || 1}</span>
                              <span className="font-medium">
                                {((item.amount_total || item.price || 0) / 100).toFixed(2)}€
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Astuce :</strong> Entrez l'email utilisé lors d'une commande pour voir toutes les commandes de ce client.
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 