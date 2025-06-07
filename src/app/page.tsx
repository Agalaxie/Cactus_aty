'use client';
import Image from "next/image";
import Link from "next/link";
import ProductList from "../components/ProductList";
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '../lib/supabase';
import LazyMotionWrapper from '../components/LazyMotion';
import { m } from 'framer-motion';

// Composant optimisé pour le hero
function HeroSection({ totalProducts }: { totalProducts: number }) {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center flex-1 py-20 bg-[var(--background)] relative overflow-hidden gap-12">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 px-4">
        <div className="w-full md:w-7/12 text-left">
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight text-[var(--card-title)]"
          >
            Atypic Cactus
          </m.h1>
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

// Composant pour les produits phares
function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(3)
          .order('id', { ascending: true });

        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (e) {
        console.error('Erreur lors du chargement des produits phares:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  const getPlaceholderImage = () => {
    return "data:image/svg+xml,%3csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='400' height='400' fill='%23f3f4f6'/%3e%3cg transform='translate(200%2c200)'%3e%3ccircle cx='0' cy='-30' r='25' fill='%2310b981'/%3e%3cpath d='M-5%2c-50 Q0%2c-60 5%2c-50 L3%2c-30 L-3%2c-30 Z' fill='%2310b981'/%3e%3cpath d='M-15%2c-35 Q-20%2c-45 -10%2c-40 L-8%2c-25 L-12%2c-25 Z' fill='%2310b981'/%3e%3cpath d='M15%2c-35 Q20%2c-45 10%2c-40 L12%2c-25 L8%2c-25 Z' fill='%2310b981'/%3e%3cellipse cx='0' cy='20' rx='40' ry='20' fill='%23d97706'/%3e%3c/g%3e%3ctext x='200' y='350' text-anchor='middle' fill='%236b7280' font-family='Arial%2c sans-serif' font-size='16'%3eImage non disponible%3c/text%3e%3c/svg%3e";
  };

  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 60);
  };

  const getValidImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl || imageUrl.trim() === '') {
      return getPlaceholderImage();
    }

    const cleanUrl = imageUrl.trim();
    
    if (cleanUrl.startsWith('/images/') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    return getPlaceholderImage();
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-[var(--card-bg)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--card-title)] mb-4">
              ⭐ Nos Produits Phares
            </h2>
            <div className="w-24 h-1 bg-[var(--accent)] mx-auto"></div>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-[var(--card-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--card-title)] mb-4">
            ⭐ Nos Produits Phares
          </h2>
          <div className="w-24 h-1 bg-[var(--accent)] mx-auto mb-4"></div>
          <p className="text-lg text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
            Découvrez notre sélection de cactus d'exception, choisis pour leur beauté et leur résistance
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <m.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-[var(--background)] rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <Link href={`/produit/${createSlug(product.name)}`} className="block">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={getValidImageUrl(product.image_url)}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    quality={90}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getPlaceholderImage();
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-[var(--accent)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ Phare
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-sm font-medium text-[var(--accent)] uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-3 text-[var(--card-title)]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[var(--foreground)] mb-4 line-clamp-3 opacity-80">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-[var(--accent)]">
                      {product.price}€
                    </p>
                    <div className="px-4 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-semibold group-hover:bg-opacity-90 transition-colors">
                      Découvrir
                    </div>
                  </div>
                </div>
              </Link>
            </m.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/categorie/cactus"
            className="inline-block px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            Voir tous nos produits
          </Link>
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
        <HeroSection totalProducts={totalProducts} />

        {/* Section produits phares */}
        <FeaturedProducts />

        {/* Section produits dynamiques avec Suspense */}
        <Suspense fallback={
          <div className="py-20 text-center">
            <div className="animate-pulse">Chargement des produits...</div>
          </div>
        }>
          <ProductList limit={6} />
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
