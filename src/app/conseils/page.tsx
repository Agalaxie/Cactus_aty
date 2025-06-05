'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  url: string;
  publishDate: string;
  views: number;
}

export default function ConseilsPage() {
  const articles: Article[] = [
    {
      id: 'jardin-cactus-guide',
      title: 'Réaliser un jardin de cactus en 6 étapes',
      excerpt: 'Guide complet pour créer votre jardin de cactus en France. De la préparation du sol à la décoration finale, découvrez tous les secrets d\'un aménagement réussi.',
      readTime: '8 min',
      category: 'Aménagement',
      url: '/comment-realiser-un-jardin-de-cactus-en-france',
      publishDate: 'Juin 2024',
      views: 15420
    },
    // Articles futurs
    {
      id: 'entretien-cactus-hiver',
      title: 'Protéger ses cactus en hiver',
      excerpt: 'Techniques essentielles pour faire passer l\'hiver à vos cactus en extérieur. Voilage, drainage, sélection des espèces résistantes au froid.',
      readTime: '6 min',
      category: 'Entretien',
      url: '#',
      publishDate: 'Bientôt',
      views: 0
    },
    {
      id: 'rempotage-cactus',
      title: 'Rempoter un cactus sans se piquer',
      excerpt: 'Méthodes sûres et techniques professionnelles pour rempoter vos cactus. Choix du terreau, période idéale, manipulation sécurisée.',
      readTime: '5 min',
      category: 'Technique',
      url: '#',
      publishDate: 'Bientôt',
      views: 0
    }
  ];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      {/* Breadcrumb */}
      <div className="py-6 px-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-[var(--accent)] hover:underline">
            Accueil
          </Link>
          <span className="text-[var(--foreground)]">/</span>
          <span className="text-[var(--foreground)]">Conseils pratiques</span>
        </div>
      </div>

      {/* Header de la page */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 flex justify-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src="/vincent basset.jpg"
                  alt="Vincent Basset - Expert en cactus"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--card-title)] mb-6">
              Conseils pratiques
            </h1>
            <p className="text-xl text-[var(--foreground)] mb-8 leading-relaxed">
              Découvrez tous nos guides d&apos;expert pour réussir vos aménagements de cactus et plantes grasses. 
              Plus de 15 ans d&apos;expérience à votre service.
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--accent)]">15k+</div>
                <div>Lectures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--accent)]">3</div>
                <div>Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--accent)]">100%</div>
                <div>Gratuit</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Liste des articles */}
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="space-y-8"
          >
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.7 }}
                className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {article.url === '#' ? (
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="text-sm text-[var(--foreground)] opacity-60">
                        {article.publishDate}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-[var(--card-title)] mb-4">
                      {article.title}
                    </h2>
                    
                    <p className="text-[var(--foreground)] leading-relaxed mb-6">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-[var(--foreground)] opacity-75">
                        <span>⏱️ {article.readTime}</span>
                        {article.views > 0 && <span>👁️ {article.views.toLocaleString()} vues</span>}
                      </div>
                      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl font-medium">
                        Bientôt disponible
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href={article.url} className="block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="p-8"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium">
                          {article.category}
                        </span>
                        <span className="text-sm text-[var(--foreground)] opacity-60">
                          {article.publishDate}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-[var(--card-title)] mb-4 group-hover:text-[var(--accent)] transition-colors">
                        {article.title}
                      </h2>
                      
                      <p className="text-[var(--foreground)] leading-relaxed mb-6">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-[var(--foreground)] opacity-75">
                          <span>⏱️ {article.readTime}</span>
                          <span>👁️ {article.views.toLocaleString()} vues</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--accent)] font-medium">
                          Lire l&apos;article
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                )}
              </motion.article>
            ))}
          </motion.div>

          {/* Section newsletter/contact */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="mt-16 bg-gradient-to-r from-[var(--accent)]/10 to-green-500/10 rounded-2xl p-8 border border-[var(--accent)]/20"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[var(--card-title)] mb-4">
                Une question spécifique ?
              </h3>
              <p className="text-[var(--foreground)] mb-6 max-w-2xl mx-auto">
                Vincent Basset répond personnellement à vos questions. 
                Bénéficiez de conseils sur-mesure pour vos projets d&apos;aménagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/qui-suis-je"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  📞 06 03 42 55 95
                </Link>
                <Link
                  href="mailto:info@atypic-cactus.com"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-[var(--accent)] text-[var(--accent)] rounded-xl font-semibold hover:bg-[var(--accent)] hover:text-white transition-all"
                >
                  ✉️ Nous écrire
                </Link>
              </div>
            </div>
          </motion.section>

          {/* Articles liés */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-[var(--card-title)] mb-8 text-center">
              Découvrez aussi
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/categorie/cactus"
                className="group bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)] hover:border-[var(--accent)] transition-all"
              >
                <div className="text-3xl mb-3">🌵</div>
                <h4 className="font-semibold text-[var(--card-title)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                  Notre collection
                </h4>
                <p className="text-sm text-[var(--foreground)] opacity-75">
                  Découvrez nos 92 spécimens sélectionnés pour le climat français
                </p>
              </Link>
              
              <Link
                href="/qui-suis-je"
                className="group bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border)] hover:border-[var(--accent)] transition-all"
              >
                <div className="text-3xl mb-3">👨‍🌾</div>
                <h4 className="font-semibold text-[var(--card-title)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                  L&apos;expert
                </h4>
                <p className="text-sm text-[var(--foreground)] opacity-75">
                  Vincent Basset, 15+ ans d&apos;expérience en aménagement cactus
                </p>
              </Link>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
} 