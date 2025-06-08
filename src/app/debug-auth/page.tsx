'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import Header from '@/components/Header';

export default function DebugAuthPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [apiResponse, setApiResponse] = useState<any>(null);

  useEffect(() => {
    // Récupérer toutes les commandes pour debug
    fetch('/api/test-orders-raw')
      .then(res => res.json())
      .then(data => {
        setAllOrders(data.ordersRaw || []);
      });

    // Essayer de récupérer les commandes de l'utilisateur
    if (isAuthenticated) {
      fetch('/api/user-orders')
        .then(res => res.json())
        .then(data => {
          setApiResponse(data);
          if (data.success) {
            setOrders(data.orders);
          }
        })
        .catch(err => {
          setApiResponse({ error: 'Erreur de connexion', details: err.message });
        });
    }
  }, [isAuthenticated]);

  const testEmailOrders = allOrders.filter(order => 
    order.customer_email === 'neuromz@outlook.com'
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-[var(--card-title)] mb-6">
            🔍 Debug Authentification
          </h1>
          
          {/* État d'authentification */}
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] mb-6">
            <h2 className="text-xl font-semibold text-[var(--card-title)] mb-4">
              👤 État d'authentification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Connecté:</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</p>
                <p><strong>Loading:</strong> {loading ? '⏳ Oui' : '✅ Non'}</p>
                <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>Nom:</strong> {user?.user_metadata?.name || 'N/A'}</p>
                <p><strong>Créé le:</strong> {user?.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Commandes neuromz@outlook.com dans la BDD */}
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] mb-6">
            <h2 className="text-xl font-semibold text-[var(--card-title)] mb-4">
              📦 Commandes neuromz@outlook.com dans la BDD ({testEmailOrders.length})
            </h2>
            {testEmailOrders.length > 0 ? (
              <div className="space-y-3">
                {testEmailOrders.map((order, index) => (
                  <div key={index} className="bg-[var(--background)] p-4 rounded border border-[var(--border)]">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>ID:</strong> #{order.id}</p>
                        <p><strong>Email:</strong> {order.customer_email}</p>
                        <p><strong>Nom:</strong> {order.customer_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p><strong>Montant:</strong> {(order.total_amount / 100).toFixed(2)}€</p>
                        <p><strong>Statut:</strong> {order.order_status}</p>
                        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--foreground)] opacity-75">
                Aucune commande trouvée pour neuromz@outlook.com
              </p>
            )}
          </div>

          {/* Réponse de l'API user-orders */}
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] mb-6">
            <h2 className="text-xl font-semibold text-[var(--card-title)] mb-4">
              🔧 Réponse API /api/user-orders
            </h2>
            <pre className="bg-[var(--background)] p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>

          {/* Commandes récupérées par l'API */}
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] mb-6">
            <h2 className="text-xl font-semibold text-[var(--card-title)] mb-4">
              📋 Commandes récupérées par l'API ({orders.length})
            </h2>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order, index) => (
                  <div key={index} className="bg-[var(--background)] p-4 rounded border border-[var(--border)]">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>ID:</strong> #{order.id}</p>
                        <p><strong>Email:</strong> {order.customer_email}</p>
                        <p><strong>Nom:</strong> {order.customer_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p><strong>Montant:</strong> {order.total_amount_formatted}€</p>
                        <p><strong>Statut:</strong> {order.order_status}</p>
                        <p><strong>Date:</strong> {order.created_at_formatted}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--foreground)] opacity-75">
                Aucune commande récupérée par l'API
              </p>
            )}
          </div>

          {/* Test manual avec l'API par email */}
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
            <h2 className="text-xl font-semibold text-[var(--card-title)] mb-4">
              🧪 Test direct
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  fetch('/api/user-orders-by-email?email=neuromz@outlook.com')
                    .then(res => res.json())
                    .then(data => {
                      alert(`Commandes trouvées: ${data.orders?.length || 0}\n\n${JSON.stringify(data, null, 2)}`);
                    });
                }}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90"
              >
                Tester API par email (neuromz@outlook.com)
              </button>
              
              <button
                onClick={() => {
                  fetch('/api/user-orders')
                    .then(res => res.json())
                    .then(data => {
                      alert(`Réponse API: ${JSON.stringify(data, null, 2)}`);
                    });
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:opacity-90 ml-2"
              >
                Tester API user-orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 