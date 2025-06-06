'use client';

import { useState } from 'react';
import Header from '@/components/Header';

export default function DebugPage() {
  const [emailResult, setEmailResult] = useState<any>(null);
  const [ordersResult, setOrdersResult] = useState<any>(null);
  const [orderEmailResult, setOrderEmailResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      setEmailResult(data);
    } catch (error) {
      setEmailResult({ success: false, error: 'Erreur réseau' });
    } finally {
      setLoading(false);
    }
  };

  const testOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-orders');
      const data = await response.json();
      setOrdersResult(data);
    } catch (error) {
      setOrdersResult({ success: false, error: 'Erreur réseau' });
    } finally {
      setLoading(false);
    }
  };

  const testOrderEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setOrderEmailResult(data);
    } catch (error) {
      setOrderEmailResult({ success: false, error: 'Erreur réseau' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[var(--card-title)] mb-8">
          🔧 Page de diagnostic
        </h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Test Email */}
          <div className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--card-title)] mb-4">
              📧 Test Email
            </h2>
            
            <button
              onClick={testEmail}
              disabled={loading}
              className="mb-4 bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Test en cours...' : 'Tester envoi email'}
            </button>
            
            {emailResult && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">Résultat:</h3>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(emailResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Test Orders */}
          <div className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--card-title)] mb-4">
              📦 Test Commandes
            </h2>
            
            <button
              onClick={testOrders}
              disabled={loading}
              className="mb-4 bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Test en cours...' : 'Tester récupération commandes'}
            </button>
            
            {ordersResult && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">Résultat:</h3>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(ordersResult, null, 2)}
                </pre>
              </div>
                         )}
           </div>

           {/* Test Email Commande */}
           <div className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border)]">
             <h2 className="text-xl font-bold text-[var(--card-title)] mb-4">
               📧 Test Email Commande
             </h2>
             
             <button
               onClick={testOrderEmail}
               disabled={loading}
               className="mb-4 bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
             >
               {loading ? 'Test en cours...' : 'Tester email avec vraie commande'}
             </button>
             
             {orderEmailResult && (
               <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                 <h3 className="font-bold mb-2">Résultat:</h3>
                 <pre className="text-sm overflow-x-auto">
                   {JSON.stringify(orderEmailResult, null, 2)}
                 </pre>
               </div>
             )}
           </div>
         </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
            📋 Instructions de diagnostic
          </h3>
                     <div className="text-blue-700 dark:text-blue-300 text-sm space-y-2">
             <p><strong>Test Email:</strong> Vérifie si Resend est configuré et peut envoyer des emails</p>
             <p><strong>Test Commandes:</strong> Vérifie si les commandes sont récupérées correctement</p>
             <p><strong>Test Email Commande:</strong> Teste l'envoi d'email avec les données d'une vraie commande</p>
             <p><strong>Variables requises:</strong> RESEND_API_KEY et ADMIN_EMAIL dans .env.local</p>
           </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[var(--foreground)] opacity-75">
            🔍 Utilisez cette page pour diagnostiquer les problèmes d'emails et de commandes
          </p>
        </div>
      </div>
    </div>
  );
} 