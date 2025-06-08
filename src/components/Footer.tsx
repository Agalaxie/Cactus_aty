'use client';

import Link from 'next/link';

const categories = [
  { id: 'cactus', name: 'Cactus', href: '/categorie/cactus' },
  { id: 'agaves', name: 'Agaves', href: '/categorie/agaves' },
  { id: 'aloes', name: 'Aloès', href: '/categorie/aloes' },
  { id: 'yuccas', name: 'Yuccas', href: '/categorie/yuccas' },
  { id: 'boutures', name: 'Boutures', href: '/categorie/boutures' },
  { id: 'sujets-exceptionnels', name: 'Sujets exceptionnels', href: '/categorie/sujets-exceptionnels' }
];

export default function Footer() {
  return (
    <footer className="bg-[var(--card-bg)] border-t border-[var(--border)] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-bold text-xl mb-4 text-[var(--card-title)]">Atypic Cactus</h3>
            <p className="text-[var(--foreground)] mb-4">
              Spécialiste passionné de cactus et plantes grasses depuis plus de 15 ans. 
              Découvrez notre sélection unique de spécimens exceptionnels dans notre pépinière de Villelongue de la Salanque.
            </p>
            <div className="flex gap-4 text-sm mb-4">
              <Link href="/qui-suis-je" className="text-[var(--accent)] hover:underline">
                Notre Histoire
              </Link>
              <Link href="/commande" className="text-[var(--accent)] hover:underline">
                Livraison
              </Link>
              <Link href="/conseils" className="text-[var(--accent)] hover:underline">
                Conseils
              </Link>
              <Link href="/cgv" className="text-[var(--accent)] hover:underline">
                CGV
              </Link>
              <Link href="/mentions-legales" className="text-[var(--accent)] hover:underline">
                Mentions légales
              </Link>
              <a 
                href="https://www.facebook.com/atypicboutique/?locale=fr_FR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Facebook
              </a>
            </div>
            {/* Lien migration */}
            <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <strong>🔄 Ancien client ?</strong>{' '}
                <Link href="/migration" className="text-orange-600 dark:text-orange-400 hover:underline font-medium">
                  Migrez votre compte WordPress →
                </Link>
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[var(--card-title)]">Catégories</h4>
            <div className="space-y-2 text-sm">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="block text-[var(--foreground)] hover:text-[var(--accent)]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[var(--card-title)]">Contact & Horaires</h4>
            <div className="space-y-2 text-sm text-[var(--foreground)]">
              <p className="font-medium">📍 Villelongue de la Salanque</p>
              <p>66410 France</p>
              <p>📞 <a href="tel:+33603425595" className="text-[var(--accent)] hover:underline">06 03 42 55 95</a></p>
              <p>✉️ <a href="mailto:info@atypic-cactus.com" className="text-[var(--accent)] hover:underline">info@atypic-cactus.com</a></p>
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <p className="font-medium mb-2">Horaires d&apos;ouverture :</p>
                <div className="text-xs space-y-1">
                  <p>Lundi : 08:30 - 17:00</p>
                  <p>Mardi : 13:30 - 17:00</p>
                  <p>Mercredi : 13:30 - 17:00</p>
                  <p>Jeudi : 08:30 - 17:00</p>
                  <p>Vendredi : 08:30 - 17:00</p>
                  <p>Samedi : 09:00 - 12:00</p>
                  <p>Dimanche : FERMÉ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section paiements sécurisés */}
        <div className="border-t border-[var(--border)] mt-12 pt-8">
          <div className="flex flex-col items-center justify-center space-y-3 mb-6">
            <div className="flex items-center space-x-2 text-sm text-[var(--foreground)]">
              <svg 
                className="w-5 h-5 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
              <span className="font-medium">Paiements 100% sécurisés</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Logo Stripe */}
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border shadow-sm">
                <svg 
                  className="w-8 h-4" 
                  viewBox="0 0 60 25" 
                  fill="none"
                >
                  <path 
                    d="M59.5 12.4c0-7.7-4.9-12.4-11.7-12.4S36.1 4.7 36.1 12.4s4.9 12.4 11.7 12.4c6.8 0 11.7-4.7 11.7-12.4zm-19.8 0c0-5.2 2.9-8.4 8.1-8.4s8.1 3.2 8.1 8.4-2.9 8.4-8.1 8.4-8.1-3.2-8.1-8.4zM32.4 24.1V.7h-3.6v9.6c-1.3-1.4-3.4-2.1-5.8-2.1-5.8 0-10.2 4.9-10.2 12.2S17.2 32.6 23 32.6c2.4 0 4.5-.7 5.8-2.1v1.6h3.6V24.1zm-14.4-11.7c0-5.2 2.6-8.4 6.8-8.4 4.2 0 6.8 3.2 6.8 8.4s-2.6 8.4-6.8 8.4c-4.2 0-6.8-3.2-6.8-8.4zM8.7 8.2c-2.9 0-4.8 1.3-5.8 3.1L.2 9.8C1.6 6.9 4.3 5.2 8.7 5.2c5.1 0 8.5 2.9 8.5 7.6v11.3h-3.6v-2.1c-1.3 1.6-3.4 2.6-6.1 2.6-4.2 0-7.3-2.4-7.3-6.1 0-3.7 3.1-6.1 7.3-6.1 2.7 0 4.8 1 6.1 2.6v-1.4c0-2.6-1.8-4.4-4.9-4.4zm1.6 12.2c0-2.1-1.8-3.6-4.9-3.6s-4.9 1.5-4.9 3.6 1.8 3.6 4.9 3.6 4.9-1.5 4.9-3.6z" 
                    fill="#6772e5"
                  />
                </svg>
                <span className="text-xs font-medium text-gray-700">Powered by Stripe</span>
              </div>
              {/* Badge SSL */}
              <div className="flex items-center space-x-1 text-xs text-[var(--foreground)]">
                <svg 
                  className="w-4 h-4 text-green-600" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>SSL</span>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-[var(--foreground)]">
            <p>&copy; 2024 Atypic Cactus. Tous droits réservés. | 🌵 Catalogue disponible | 🚚 Livraison 24H par transporteur</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 