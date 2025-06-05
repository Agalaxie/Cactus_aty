'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  date: string;
  status: 'En préparation' | 'Expédiée' | 'Livrée';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  trackingNumber?: string;
}

interface User {
  id: number;
  email: string;
  name: string;
}

export default function EspaceClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsLoggedIn(true);
        await loadOrders();
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        setIsRegistering(false);
        setName('');
        setPassword('');
      } else {
        setError(data.error || 'Erreur lors de la création du compte');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setOrders([]);
    setEmail('');
    setPassword('');
    setName('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livrée': return 'bg-green-100 text-green-800 border-green-200';
      case 'Expédiée': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En préparation': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[var(--background)] py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--card-title)] mb-3">
              Espace Client
            </h1>
            <p className="text-lg text-[var(--foreground)] opacity-75">
              {isRegistering ? 'Créez votre compte' : 'Connectez-vous pour accéder à vos commandes'}
            </p>
          </div>

          <div className="bg-[var(--card-bg)] p-8 rounded-lg border border-[var(--border)] shadow-lg">
            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-center">
                {error}
              </div>
            )}

            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-6">
              {isRegistering && (
                <div>
                  <label htmlFor="name" className="block text-lg font-semibold text-[var(--card-title)] mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-[var(--border)] rounded-lg focus:border-[var(--accent)] focus:outline-none"
                    placeholder="Votre nom"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-lg font-semibold text-[var(--card-title)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-[var(--border)] rounded-lg focus:border-[var(--accent)] focus:outline-none"
                  placeholder="votre.email@exemple.fr"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-lg font-semibold text-[var(--card-title)] mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-[var(--border)] rounded-lg focus:border-[var(--accent)] focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent)] text-white py-4 px-6 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Chargement...' : isRegistering ? 'Créer mon compte' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-[var(--accent)] text-lg font-semibold hover:underline"
              >
                {isRegistering ? 'Déjà un compte ? Se connecter' : 'Créer un compte'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--card-title)] mb-2">
              Bonjour {user?.name} ! 👋
            </h1>
            <p className="text-lg text-[var(--foreground)] opacity-75">
              Voici l'historique de vos commandes
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Se déconnecter
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-[var(--card-title)] mb-2">
              Aucune commande pour le moment
            </h3>
            <p className="text-base text-[var(--foreground)] opacity-75 mb-6">
              Découvrez notre belle collection de cactus et plantes grasses !
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity"
            >
              <span>🌵</span>
              Voir nos plantes
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <div
                key={order.id}
                className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border)] shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--card-title)] mb-1">
                      Commande #{order.id}
                    </h3>
                    <p className="text-base text-[var(--foreground)] opacity-75">
                      Passée le {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-4 py-2 rounded-full text-base font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-xl font-bold text-[var(--card-title)] mt-2">
                      {order.total.toFixed(2)} €
                    </p>
                  </div>
                </div>

                <div className="border-t border-[var(--border)] pt-4 mb-4">
                  <h4 className="text-lg font-semibold text-[var(--card-title)] mb-3">
                    Articles commandés :
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-base text-[var(--foreground)]">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-base font-semibold text-[var(--card-title)]">
                          {item.price.toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📦</span>
                      <div>
                        <p className="text-base font-semibold text-blue-800 dark:text-blue-200">
                          Numéro de suivi : {order.trackingNumber}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                          Suivez votre colis sur le site du transporteur
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {order.status === 'Livrée' && (
                  <div className="mt-4 text-center">
                    <Link
                      href="/conseils"
                      className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      <span>🌱</span>
                      Conseils d'entretien
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity"
          >
            <span>🛒</span>
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
} 