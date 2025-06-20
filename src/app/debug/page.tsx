'use client';

import { useState } from 'react';
import Header from '@/components/Header';

export default function DebugPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>({});

  const importProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/import-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      setTestResults((prev: any) => ({ ...prev, import_products: result }));
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, import_products: { error: (error as Error).message } }));
    } finally {
      setLoading(false);
    }
  };

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-production');
      const data = await response.json();
      setDiagnostics(data);
    } catch (error) {
      console.error('Erreur diagnostic:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSaveOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_save_order' })
      });
      const result = await response.json();
      setTestResults((prev: any) => ({ ...prev, save_order: result }));
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, save_order: { error: (error as Error).message } }));
    } finally {
      setLoading(false);
    }
  };

  const testSendEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_send_email' })
      });
      const result = await response.json();
      setTestResults((prev: any) => ({ ...prev, send_email: result }));
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, send_email: { error: (error as Error).message } }));
    } finally {
      setLoading(false);
    }
  };

  const testCustomerEmailOnly = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_customer_email_only' })
      });
      const result = await response.json();
      setTestResults((prev: any) => ({ ...prev, customer_email_only: result }));
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, customer_email_only: { error: (error as Error).message } }));
    } finally {
      setLoading(false);
    }
  };

  const testDetailedEmailSend = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_detailed_email_send' })
      });
      const result = await response.json();
      setTestResults((prev: any) => ({ ...prev, detailed_email_send: result }));
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, detailed_email_send: { error: (error as Error).message } }));
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ success }: { success: boolean }) => (
    <span className={`text-2xl ${success ? 'text-green-500' : 'text-red-500'}`}>
      {success ? '✅' : '❌'}
    </span>
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--card-title)] mb-4">
            🔧 Diagnostic de Production
          </h1>
          <p className="text-[var(--foreground)] opacity-75">
            Testez les fonctionnalités pour identifier les problèmes de sauvegarde et d'envoi d'emails.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '⏳ Test...' : '🔍 Diagnostic Général'}
          </button>
          
          <button
            onClick={importProducts}
            disabled={loading}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? '⏳ Import...' : '📦 Import Produits CSV'}
          </button>
          
          <button
            onClick={testSaveOrder}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? '⏳ Test...' : '💾 Test Sauvegarde'}
          </button>
          
          <button
            onClick={testSendEmail}
            disabled={loading}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? '⏳ Test...' : '📧 Test Email'}
          </button>

          <button
            onClick={testCustomerEmailOnly}
            disabled={loading}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? '⏳ Test...' : '👤 Email Client'}
          </button>

          <button
            onClick={testDetailedEmailSend}
            disabled={loading}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? '⏳ Test...' : '🔍 Email Détaillé'}
          </button>
        </div>

        {/* Résultats du diagnostic général */}
        {diagnostics && (
          <div className="bg-[var(--card-bg)] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-[var(--card-title)] mb-4">
              📊 Diagnostic Général
            </h2>
            <div className="text-sm text-[var(--foreground)] opacity-75 mb-4">
              Exécuté le : {new Date(diagnostics.timestamp).toLocaleString('fr-FR')}
            </div>

            <div className="space-y-4">
              {/* Variables d'environnement */}
              <div className="border border-[var(--border)] rounded-lg p-4">
                <h3 className="font-bold text-[var(--card-title)] mb-2 flex items-center gap-2">
                  <StatusIcon success={Object.values(diagnostics.tests.environment_variables).slice(0, 5).every(Boolean)} />
                  Variables d'environnement
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(diagnostics.tests.environment_variables).slice(0, 5).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span className={value ? 'text-green-500' : 'text-red-500'}>
                        {value ? '✅' : '❌'}
                      </span>
                    </div>
                  ))}
                </div>
                {diagnostics.tests.environment_variables.values && (
                  <div className="mt-2 text-xs text-[var(--foreground)] opacity-50">
                    <div>Admin Email: {diagnostics.tests.environment_variables.values.ADMIN_EMAIL}</div>
                    <div>Supabase URL: {diagnostics.tests.environment_variables.values.NEXT_PUBLIC_SUPABASE_URL}</div>
                  </div>
                )}
              </div>

              {/* Supabase */}
              <div className="border border-[var(--border)] rounded-lg p-4">
                <h3 className="font-bold text-[var(--card-title)] mb-2 flex items-center gap-2">
                  <StatusIcon success={diagnostics.tests.supabase_insert?.success && diagnostics.tests.supabase_read?.success} />
                  Supabase
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Insertion:</span>
                    <span className={diagnostics.tests.supabase_insert?.success ? 'text-green-500' : 'text-red-500'}>
                      {diagnostics.tests.supabase_insert?.success ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lecture:</span>
                    <span className={diagnostics.tests.supabase_read?.success ? 'text-green-500' : 'text-red-500'}>
                      {diagnostics.tests.supabase_read?.success ? '✅' : '❌'}
                    </span>
                  </div>
                  {diagnostics.tests.supabase_insert?.error && (
                    <div className="text-red-500 text-xs mt-1">
                      Erreur: {diagnostics.tests.supabase_insert.error}
                    </div>
                  )}
                </div>
              </div>

              {/* Resend */}
              <div className="border border-[var(--border)] rounded-lg p-4">
                <h3 className="font-bold text-[var(--card-title)] mb-2 flex items-center gap-2">
                  <StatusIcon success={diagnostics.tests.resend_config?.success} />
                  Configuration Email (Resend)
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>API Key:</span>
                    <span className={diagnostics.tests.resend_config?.api_key_present ? 'text-green-500' : 'text-red-500'}>
                      {diagnostics.tests.resend_config?.api_key_present ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admin Email:</span>
                    <span className={diagnostics.tests.resend_config?.admin_email ? 'text-green-500' : 'text-red-500'}>
                      {diagnostics.tests.resend_config?.admin_email || 'Non configuré'}
                    </span>
                  </div>
                  {diagnostics.tests.resend_config?.error && (
                    <div className="text-red-500 text-xs mt-1">
                      Erreur: {diagnostics.tests.resend_config.error}
                    </div>
                  )}
                </div>
              </div>

              {/* Authentification */}
              <div className="border border-[var(--border)] rounded-lg p-4">
                <h3 className="font-bold text-[var(--card-title)] mb-2 flex items-center gap-2">
                  <StatusIcon success={!!diagnostics.tests.auth?.user_authenticated} />
                  Authentification
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Utilisateur connecté:</span>
                    <span className={diagnostics.tests.auth?.user_authenticated ? 'text-green-500' : 'text-orange-500'}>
                      {diagnostics.tests.auth?.user_authenticated ? '✅ Oui' : '⚠️ Non'}
                    </span>
                  </div>
                  {diagnostics.tests.auth?.user_email && (
                    <div className="text-xs text-[var(--foreground)] opacity-50">
                      Email: {diagnostics.tests.auth.user_email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Résultats des tests spécifiques */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-[var(--card-bg)] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[var(--card-title)] mb-4">
              🧪 Tests Spécifiques
            </h2>
            
            <div className="space-y-4">
              {testResults.save_order && (
                <div className="border border-[var(--border)] rounded-lg p-4">
                  <h3 className="font-bold text-[var(--card-title)] mb-2 flex items-center gap-2">
                    <StatusIcon success={testResults.save_order.success} />
                    Test Sauvegarde Commande
                  </h3>
                  <pre className="text-xs bg-[var(--background)] p-3 rounded overflow-auto">
                    {JSON.stringify(testResults.save_order, null, 2)}
                  </pre>
                </div>
              )}

              {testResults.send_email && (
                <div className="border border-[var(--border)] rounded-lg p-4">
                  <h3 className="font-bold text-[var(--card-title)] mb-2 flex items-center gap-2">
                    <StatusIcon success={testResults.send_email.success} />
                    Test Envoi Email
                  </h3>
                  <pre className="text-xs bg-[var(--background)] p-3 rounded overflow-auto">
                    {JSON.stringify(testResults.send_email, null, 2)}
                  </pre>
                </div>
              )}

              {testResults.customer_email_only && (
                <div className="border border-[var(--border)] rounded-lg p-4">
                  <h3 className="font-bold text-[var(--card-title)] mb-2 flex items-center gap-2">
                    <StatusIcon success={testResults.customer_email_only.success} />
                    Test Email Client
                  </h3>
                  <pre className="text-xs bg-[var(--background)] p-3 rounded overflow-auto">
                    {JSON.stringify(testResults.customer_email_only, null, 2)}
                  </pre>
                </div>
              )}

              {testResults.detailed_email_send && (
                <div className="border border-[var(--border)] rounded-lg p-4">
                  <h3 className="font-bold text-[var(--card-title)] mb-2 flex items-center gap-2">
                    <StatusIcon success={testResults.detailed_email_send.success} />
                    Test Email Détaillé
                  </h3>
                  <pre className="text-xs bg-[var(--background)] p-3 rounded overflow-auto">
                    {JSON.stringify(testResults.detailed_email_send, null, 2)}
                  </pre>
                </div>
              )}

              {testResults.import_products && (
                <div className="border border-[var(--border)] rounded-lg p-4">
                  <h3 className="font-bold text-[var(--card-title)] mb-2 flex items-center gap-2">
                    <StatusIcon success={testResults.import_products.success} />
                    Importation Produits CSV
                  </h3>
                  {testResults.import_products.success && (
                    <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-green-800 dark:text-green-200 font-bold">
                        ✅ {testResults.import_products.message}
                      </div>
                      {testResults.import_products.statistics && (
                        <div className="text-green-600 dark:text-green-300 text-sm mt-1 space-y-1">
                          <div>📊 Lignes analysées: {testResults.import_products.statistics.totalLines}</div>
                          <div>✅ Lignes valides: {testResults.import_products.statistics.validLines}</div>
                          <div>❌ Lignes ignorées: {testResults.import_products.statistics.skippedLines}</div>
                          <div>💾 Produits insérés: {testResults.import_products.statistics.productsInserted}</div>
                        </div>
                      )}
                    </div>
                  )}
                  <pre className="text-xs bg-[var(--background)] p-3 rounded overflow-auto">
                    {JSON.stringify(testResults.import_products, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-[var(--foreground)] opacity-50">
          💡 Cette page est uniquement visible en développement et pour le diagnostic de production
        </div>
      </div>
    </div>
  );
} 