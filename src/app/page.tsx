'use client';
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import TopBar from "../components/TopBar";
import ProductList from "../components/ProductList";
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '../lib/supabase';
import LazyMotionWrapper, { motion } from '../components/LazyMotion';

// Composant optimisé pour le hero
function HeroSection({ totalProducts }: { totalProducts: number }) {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center flex-1 py-20 bg-[var(--background)] relative overflow-hidden gap-12">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 px-4">
        <div className="w-full md:w-7/12 text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight text-[var(--card-title)]"
          >
            Atypic Cactus
          </motion.h1>
          <p className="text-lg sm:text-2xl mb-4 text-[var(--foreground)]">
            Découvrez notre collection de {totalProducts} cactus et plantes grasses exceptionnels, sélectionnés avec passion par Vincent Basset, spécialiste depuis plus de 15 ans.
          </p>
          <p className="text-lg mb-8 text-[var(--foreground)] opacity-90">
            Des plantes architecturales, ultra-faciles à entretenir, de taille adulte à taille géante pour réaliser vos plus beaux aménagements intérieurs et extérieurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/categorie/cactus"
              className="inline-block px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              Voir les Cactus
            </Link>
            <Link
              href="/qui-suis-je"
              className="inline-block px-8 py-4 border-2 border-[var(--accent)] text-[var(--accent)] rounded-full font-semibold transition-all hover:bg-[var(--accent)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              Notre Histoire
            </Link>
          </div>
        </div>

        {/* Video Container optimisé */}
        <div className="mt-8 md:mt-0 w-full md:w-5/12 flex justify-center items-center">
          <video
            src="/Majestic Cactus Close-Up.mp4"
            className="w-full h-auto max-h-96 object-cover rounded-xl shadow-lg"
            autoPlay
            loop
            muted
            controls
            playsInline
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    async function fetchTotalProducts() {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        setTotalProducts(count || 0);
      }
    }

    fetchTotalProducts();
  }, []);

  return (
    <LazyMotionWrapper>
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <TopBar />
        <Header />

        <HeroSection totalProducts={totalProducts} />

        {/* Nouveautés 2025 - Version simplifiée sans animations lourdes */}
        <section className="py-20 px-4 bg-[var(--card-bg)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--card-title)] mb-4">
                Nouveautés 2025
              </h2>
              <div className="w-24 h-1 bg-[var(--accent)] mx-auto"></div>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center group cursor-pointer">
                <div className="mb-6 relative overflow-hidden rounded-xl">
                  <Image
                    src="/images/nouveaute-1.jpg"
                    alt="Nouveauté 2025"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[var(--card-title)] mb-3">
                  Collection Résistance
                </h3>
                <p className="text-[var(--foreground)] opacity-80">
                  Nouvelles variétés ultra-résistantes au froid jusqu'à -17°C
                </p>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="mb-6 relative overflow-hidden rounded-xl">
                  <Image
                    src="/images/nouveaute-2.jpg"
                    alt="Nouveauté 2025"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[var(--card-title)] mb-3">
                  Géants du Mexique
                </h3>
                <p className="text-[var(--foreground)] opacity-80">
                  Spécimens exceptionnels directement du Mexique
                </p>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="mb-6 relative overflow-hidden rounded-xl">
                  <Image
                    src="/images/nouveaute-3.jpg"
                    alt="Nouveauté 2025"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[var(--card-title)] mb-3">
                  Aménagements Pros
                </h3>
                <p className="text-[var(--foreground)] opacity-80">
                  Solutions clé en main pour professionnels
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section produits avec Suspense */}
        <Suspense fallback={
          <div className="py-20 text-center">
            <div className="animate-pulse">Chargement des produits...</div>
          </div>
        }>
          <ProductList limit={8} />
        </Suspense>

        {/* Newsletter - Version simplifiée */}
        <section className="py-20 px-4 bg-[var(--background)]">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
            <div className="max-w-2xl w-full bg-[var(--card-bg)] rounded-2xl shadow-xl p-8 flex flex-col items-center">
              <h2 className="text-3xl font-bold text-[var(--card-title)] mb-4">
                Restez informé
              </h2>
              <p className="text-lg text-[var(--foreground)] opacity-80 mb-8">
                Recevez nos conseils d'expert et les dernières nouveautés
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-3 rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <button className="px-6 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-opacity-90 transition-colors">
                  S'abonner
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section contact - Version simplifiée sans animations */}
        <section className="py-8 px-4 bg-emerald-600 dark:bg-emerald-700">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">🚚</span>
                <div className="text-left">
                  <div className="font-semibold">Livraison 24H</div>
                  <div className="text-sm opacity-90">Nouveau service transporteur</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">🌿</span>
                <div className="text-left">
                  <div className="font-semibold">Pépinière ouverte</div>
                  <div className="text-sm opacity-90">Toute la semaine</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">📞</span>
                <div className="text-left">
                  <div className="font-semibold">06 03 42 55 95</div>
                  <div className="text-sm opacity-90">Conseil expert</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LazyMotionWrapper>
  );
}
