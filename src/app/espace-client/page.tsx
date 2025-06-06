'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import Header from '@/components/Header';

interface Order {
  id: number;
  stripe_session_id: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  total_amount_formatted: string;
  currency: string;
  payment_status: string;
  order_status: string;
  items: any[];
  created_at: string;
  created_at_formatted: string;
  updated_at: string;
}

export default function EspaceClient() {
  const { user, loading: authLoading, signIn, signUp, signOut, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  // Récupérer le message de redirection depuis les paramètres URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlMessage = urlParams.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/espace-client');
    }
  }, []);

  // Récupérer les commandes quand l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      fetchOrders();
    } else if (!isAuthenticated && !authLoading) {
      // Vider les commandes si l'utilisateur n'est pas connecté
      setOrders([]);
    }
  }, [isAuthenticated, user, authLoading]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/user-orders', {
        credentials: 'include', // Important pour les cookies de session
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } else if (response.status === 401) {
        // Utilisateur non connecté - ne pas afficher d'erreur
        console.log('Utilisateur non connecté - pas de commandes à récupérer');
        setOrders([]);
      } else {
        console.error('Erreur lors de la récupération des commandes:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError('Email ou mot de passe incorrect');
      } else {
        // L'utilisateur sera automatiquement connecté grâce au hook
        setEmail('');
        setPassword('');
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
    setMessage('');

    try {
      const { error } = await signUp(email, password, name);

      if (error) {
        if (error.message.includes('already registered')) {
          setError('Un compte avec cet email existe déjà');
        } else {
          setError(error.message);
        }
      } else {
        setMessage('Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.');
        setIsRegistering(false);
        setName('');
        setPassword('');
        setEmail('');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setOrders([]);
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livrée': return 'bg-green-100 text-green-800 border-green-200';
      case 'Expédiée': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En préparation': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Affichage de chargement
  if (authLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--background)] py-8">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--accent)] mx-auto"></div>
            <p className="mt-4 text-[var(--foreground)]">Chargement...</p>
          </div>
        </div>
      </>
    );
  }

  // Utilisateur non connecté
  if (!isAuthenticated) {
    return (
      <>
        <Header />
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

              {message && (
                <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-center">
                  {message}
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
                    setMessage('');
                  }}
                  className="text-[var(--accent)] hover:underline text-lg font-medium"
                >
                  {isRegistering 
                    ? 'Vous avez déjà un compte ? Se connecter' 
                    : 'Vous n\'avez pas de compte ? S\'inscrire'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Utilisateur connecté
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--card-title)] mb-3">
              Bienvenue, {user?.user_metadata?.name || user?.email}
            </h1>
            <p className="text-lg text-[var(--foreground)] opacity-75">
              Gérez vos commandes et votre compte
            </p>
          </div>

          <div className="bg-[var(--card-bg)] p-8 rounded-lg border border-[var(--border)] shadow-lg mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[var(--card-title)]">Mon Compte</h2>
                <p className="text-[var(--foreground)] opacity-75">Email: {user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] p-8 rounded-lg border border-[var(--border)] shadow-lg">
            <h2 className="text-2xl font-bold text-[var(--card-title)] mb-6">Mes Commandes</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-[var(--card-title)] mb-2">
                  Aucune commande
                </h3>
                <p className="text-[var(--foreground)] opacity-75 mb-6">
                  Vous n'avez pas encore passé de commande
                </p>
                <Link
                  href="/"
                  className="inline-block bg-[var(--accent)] text-white px-8 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity"
                >
                  Découvrir nos cactus
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-[var(--border)] rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[var(--card-title)]">
                          Commande #{order.id}
                        </h3>
                        <p className="text-[var(--foreground)] opacity-75">
                          {order.created_at_formatted}
                        </p>
                        <p className="text-sm text-[var(--foreground)] opacity-60">
                          Session: {order.stripe_session_id.slice(0, 20)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.order_status)}`}>
                          {order.order_status}
                        </span>
                        <p className="text-lg font-bold text-[var(--card-title)] mt-2">
                          {order.total_amount_formatted} €
                        </p>
                        <p className="text-xs text-[var(--foreground)] opacity-60">
                          {order.payment_status}
                        </p>
                      </div>
                    </div>

                    {order.customer_address && (
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-[var(--foreground)] opacity-75">
                          <strong>Livraison:</strong> {order.customer_address}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-[var(--foreground)]">
                            <span>{item.description || 'Article'} x{item.quantity || 1}</span>
                            <span>{((item.amount_total || 0) / 100).toFixed(2)} €</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[var(--foreground)] opacity-60">
                          Détails des articles non disponibles
                        </p>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-green-800 dark:text-green-200 font-medium text-sm">
                        ✅ Paiement confirmé • Expédition sous 24-48h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 