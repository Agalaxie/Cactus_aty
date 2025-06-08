'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/lib/useAuth';

export default function MigrationPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMigration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Vérifications
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, newPassword, name);

      if (error) {
        if (error.message.includes('already registered')) {
          setError('Un compte avec cet email existe déjà sur le nouveau site. Utilisez "Mot de passe oublié" pour vous connecter.');
        } else {
          setError(error.message);
        }
      } else {
        setMessage(`
          ✅ Migration réussie ! 
          
          Un email de confirmation a été envoyé à ${email}.
          
          📧 Vérifiez votre boîte mail (et les spams) pour activer votre nouveau compte.
          
          📋 Vos anciennes commandes ne sont pas automatiquement transférées. 
          Si vous avez besoin de l'historique, contactez-nous à info@atypic-cactus.com
        `);
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setName('');
      }
    } catch (err) {
      setError('Erreur lors de la migration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)] py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-[var(--card-bg)] p-8 rounded-lg border border-[var(--border)] shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[var(--card-title)] mb-3">
                🔄 Migration de compte
              </h1>
              <p className="text-lg text-[var(--foreground)] opacity-75 mb-4">
                Ancien client ? Migrez votre compte vers notre nouveau site !
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  📋 Pourquoi migrer ?
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• <strong>Nouveau système sécurisé</strong> avec Stripe</li>
                  <li>• <strong>Interface modernisée</strong> et plus rapide</li>
                  <li>• <strong>Suivi de commandes</strong> en temps réel</li>
                  <li>• <strong>Historique personnel</strong> accessible</li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-center">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-center whitespace-pre-line">
                {message}
              </div>
            )}

            <form onSubmit={handleMigration} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-lg font-semibold text-[var(--card-title)] mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-[var(--border)] rounded-lg focus:border-[var(--accent)] focus:outline-none"
                  placeholder="Votre nom complet"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-lg font-semibold text-[var(--card-title)] mb-2">
                  Email (le même que sur l'ancien site)
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
                <p className="text-sm text-[var(--foreground)] opacity-75 mt-1">
                  Utilisez la même adresse email que sur l'ancien site WordPress
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-lg font-semibold text-[var(--card-title)] mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-[var(--border)] rounded-lg focus:border-[var(--accent)] focus:outline-none"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <p className="text-sm text-[var(--foreground)] opacity-75 mt-1">
                  Minimum 6 caractères (peut être différent de l'ancien)
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-lg font-semibold text-[var(--card-title)] mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-[var(--border)] rounded-lg focus:border-[var(--accent)] focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent)] text-white py-4 px-6 rounded-lg text-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? '🔄 Migration en cours...' : '✅ Migrer mon compte'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--border)] text-center text-sm text-[var(--foreground)]">
              <p className="mb-2">
                <strong>Déjà migré ?</strong>{' '}
                <a href="/espace-client" className="text-[var(--accent)] hover:underline">
                  Connectez-vous ici
                </a>
              </p>
              <p className="mb-2">
                <strong>Nouveau client ?</strong>{' '}
                <a href="/espace-client" className="text-[var(--accent)] hover:underline">
                  Créez votre compte
                </a>
              </p>
              <p>
                <strong>Problème ?</strong>{' '}
                <a href="mailto:info@atypic-cactus.com" className="text-[var(--accent)] hover:underline">
                  Contactez-nous
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 