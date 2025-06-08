'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import Header from '@/components/Header';
import { FaSearch, FaFilter, FaEdit, FaEye, FaBox, FaShippingFast, FaCheckCircle, FaClock, FaEuroSign, FaChartLine } from 'react-icons/fa';

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
  updated_at: string;
  created_at_formatted: string;
  updated_at_formatted: string;
}

interface Stats {
  totalOrders: number;
  recentOrders: number;
  totalRevenue: string;
  averageOrderValue: string;
  statusBreakdown: {
    confirmed: number;
    shipped: number;
    delivered: number;
    [key: string]: number;
  };
  dailyStats: {
    [date: string]: {
      count: number;
      revenue: number;
    };
  };
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
}

export default function AdminPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchStats();
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, selectedStatus, searchTerm, currentPage]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`/api/admin/orders?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
          setPagination(data.pagination);
        } else {
          setError(data.error || 'Erreur lors de la récupération des commandes');
        }
      } else {
        setError('Erreur lors de la récupération des commandes');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string, notes?: string) => {
    setUpdatingOrder(true);
    
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          orderStatus: newStatus,
          notes
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          fetchOrders();
          fetchStats();
          setIsEditModalOpen(false);
          setSelectedOrder(null);
        } else {
          setError(data.error || 'Erreur lors de la mise à jour');
        }
      } else {
        setError('Erreur lors de la mise à jour');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setUpdatingOrder(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <FaClock className="text-orange-500" />;
      case 'shipped': return <FaShippingFast className="text-blue-500" />;
      case 'delivered': return <FaCheckCircle className="text-green-500" />;
      default: return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      default: return status;
    }
  };

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

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[var(--background)] py-8">
          <div className="max-w-md mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-[var(--card-title)] mb-4">Accès refusé</h1>
            <p className="text-[var(--foreground)]">Vous devez être connecté pour accéder à cette page.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--card-title)] mb-2">Administration des Commandes</h1>
            <p className="text-[var(--foreground)] opacity-75">Gérez et suivez toutes les commandes de la boutique</p>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--foreground)] opacity-75">Total Commandes</p>
                    <p className="text-2xl font-bold text-[var(--card-title)]">{stats.totalOrders}</p>
                  </div>
                  <FaBox className="text-3xl text-[var(--accent)]" />
                </div>
              </div>
              
              <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--foreground)] opacity-75">Dernières 24h</p>
                    <p className="text-2xl font-bold text-[var(--card-title)]">{stats.recentOrders}</p>
                  </div>
                  <FaClock className="text-3xl text-orange-500" />
                </div>
              </div>
              
              <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--foreground)] opacity-75">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold text-[var(--card-title)]">{stats.totalRevenue}€</p>
                  </div>
                  <FaEuroSign className="text-3xl text-green-500" />
                </div>
              </div>
              
              <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--foreground)] opacity-75">Panier Moyen</p>
                    <p className="text-2xl font-bold text-[var(--card-title)]">{stats.averageOrderValue}€</p>
                  </div>
                  <FaChartLine className="text-3xl text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {stats && (
            <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] mb-8">
              <h3 className="text-lg font-semibold text-[var(--card-title)] mb-4">Répartition par statut</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-orange-500" />
                    <span className="font-medium">Confirmées</span>
                  </div>
                  <span className="text-xl font-bold text-orange-600">{stats.statusBreakdown.confirmed}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaShippingFast className="text-blue-500" />
                    <span className="font-medium">Expédiées</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">{stats.statusBreakdown.shipped}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500" />
                    <span className="font-medium">Livrées</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{stats.statusBreakdown.delivered}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground)] opacity-50" />
                <input
                  type="text"
                  placeholder="Rechercher par email ou nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>
              
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground)] opacity-50" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--background)] text-[var(--foreground)] appearance-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="confirmed">Confirmées</option>
                  <option value="shipped">Expédiées</option>
                  <option value="delivered">Livrées</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--background)] border-b border-[var(--border)]">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-[var(--card-title)]">Commande</th>
                    <th className="text-left py-4 px-6 font-semibold text-[var(--card-title)]">Client</th>
                    <th className="text-left py-4 px-6 font-semibold text-[var(--card-title)]">Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-[var(--card-title)]">Montant</th>
                    <th className="text-left py-4 px-6 font-semibold text-[var(--card-title)]">Statut</th>
                    <th className="text-left py-4 px-6 font-semibold text-[var(--card-title)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)] mx-auto"></div>
                        <p className="mt-2 text-[var(--foreground)]">Chargement...</p>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="text-4xl mb-4">📦</div>
                        <p className="text-[var(--foreground)]">Aucune commande trouvée</p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-[var(--border)] hover:bg-[var(--background)]/50">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-[var(--card-title)]">#{order.id}</div>
                            <div className="text-sm text-[var(--foreground)] opacity-75">
                              {order.stripe_session_id.slice(0, 20)}...
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-[var(--card-title)]">{order.customer_name || 'N/A'}</div>
                            <div className="text-sm text-[var(--foreground)] opacity-75">{order.customer_email}</div>
                            {order.customer_phone && (
                              <div className="text-sm text-[var(--foreground)] opacity-75">{order.customer_phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-[var(--foreground)]">{order.created_at_formatted}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-[var(--card-title)]">{order.total_amount_formatted}€</div>
                          <div className="text-sm text-[var(--foreground)] opacity-75">{order.payment_status}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.order_status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.order_status)}`}>
                              {getStatusLabel(order.order_status)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsEditModalOpen(true);
                              }}
                              className="p-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
                              title="Modifier"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 bg-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                              title="Voir détails"
                            >
                              <FaEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="border-t border-[var(--border)] p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[var(--foreground)]">
                    Page {pagination.currentPage} sur {pagination.totalPages} • {pagination.totalOrders} commandes
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isEditModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-[var(--card-title)] mb-4">
                Modifier la commande #{selectedOrder.id}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                    Nouveau statut
                  </label>
                  <select
                    id="newStatus"
                    className="w-full p-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--background)] text-[var(--foreground)]"
                    defaultValue={selectedOrder.order_status}
                  >
                    <option value="confirmed">Confirmée</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const select = document.getElementById('newStatus') as HTMLSelectElement;
                      updateOrderStatus(selectedOrder.id, select.value);
                    }}
                    disabled={updatingOrder}
                    className="flex-1 bg-[var(--accent)] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {updatingOrder ? 'Mise à jour...' : 'Confirmer'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 border border-[var(--border)] text-[var(--card-title)] py-3 px-4 rounded-lg font-semibold hover:bg-[var(--background)] transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedOrder && !isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[var(--card-title)]">
                  Détails de la commande #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-[var(--foreground)] hover:text-[var(--card-title)] text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[var(--card-title)] mb-3">Informations client</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom:</strong> {selectedOrder.customer_name || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                    <p><strong>Téléphone:</strong> {selectedOrder.customer_phone || 'N/A'}</p>
                    {selectedOrder.customer_address && (
                      <p><strong>Adresse:</strong> {selectedOrder.customer_address}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[var(--card-title)] mb-3">Informations commande</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Date:</strong> {selectedOrder.created_at_formatted}</p>
                    <p><strong>Montant:</strong> {selectedOrder.total_amount_formatted}€</p>
                    <p><strong>Statut paiement:</strong> {selectedOrder.payment_status}</p>
                    <p><strong>Statut commande:</strong> {getStatusLabel(selectedOrder.order_status)}</p>
                    <p><strong>Session Stripe:</strong> {selectedOrder.stripe_session_id}</p>
                  </div>
                </div>
              </div>
              
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-[var(--card-title)] mb-3">Articles commandés</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-[var(--background)] rounded-lg">
                        <div>
                          <span className="font-medium">{item.description || item.name || 'Article'}</span>
                          <span className="text-sm text-[var(--foreground)] opacity-75 ml-2">
                            x{item.quantity || 1}
                          </span>
                        </div>
                        <span className="font-bold">
                          {((item.amount_total || item.price || 0) / 100).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
} 