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
        
        <div className="border-t border-[var(--border)] mt-12 pt-8 text-center text-sm text-[var(--foreground)]">
          <p>&copy; 2024 Atypic Cactus. Tous droits réservés. | 🌵 Catalogue disponible | 🚚 Livraison 24H par transporteur</p>
        </div>
      </div>
    </footer>
  );
} 