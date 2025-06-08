'use client';
import Image from "next/image";
import Link from "next/link";
import ProductList from "../components/ProductList";
import { useEffect, useState, Suspense, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import LazyMotionWrapper from '../components/LazyMotion';
import { m, AnimatePresence } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

// Composant optimisé pour le hero
function HeroSection({ totalProducts, featuredProducts }: { totalProducts: number, featuredProducts: any[] }) {
  const [current, setCurrent] = useState(0);
  const nbProducts = featuredProducts.length;
  const goNext = () => setCurrent((prev) => (prev + 1) % nbProducts);
  const goPrev = () => setCurrent((prev) => (prev - 1 + nbProducts) % nbProducts);

  // Défilement auto
  useEffect(() => {
    if (nbProducts < 2) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % nbProducts);
    }, 3000);
    return () => clearInterval(interval);
  }, [nbProducts]);

  return (
    <section className="flex flex-col md:flex-row items-center justify-center flex-1 bg-[var(--background)] relative overflow-hidden gap-12 mt-12 mb-12">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 px-4">
        <div className="w-full md:w-7/12 text-left">
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight text-[var(--card-title)]"
          >
            Atypic Cactus
          </m.h1>
          <h2 className="text-xl sm:text-3xl font-bold mb-4 text-[var(--card-title)]">
            Vente de gros cactus, yuccas, agaves et aloès résistants au gel
          </h2>
          <p className="text-lg mb-4 text-[var(--foreground)]">
            Découvrez notre sélection unique de cactus, yuccas, agaves et aloès robustes, adaptés au climat français et livrés partout en France. Profitez de 15 ans d'expérience, d'un large choix de plantes exceptionnelles et de promotions exclusives pour aménager votre jardin ou terrasse avec style et sérénité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="/amenagement"
              className="inline-block px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              Aménagement
            </Link>
            <Link
              href="/categorie/cactus"
              className="inline-block px-8 py-4 border-2 border-[var(--accent)] text-[var(--accent)] rounded-full font-semibold transition-all hover:bg-[var(--accent)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              Voir les Cactus
            </Link>
          </div>
          <div className="mb-8 flex items-center gap-2">
            <a
              href="https://www.google.com/maps/place/Atypic-cactus/@42.765,2.9505,17z/data=!4m8!3m7!1s0x12b05e2e2e2e2e2e:0x123456789abcdef!8m2!3d42.765!4d2.9505!9m1!1b1!16s%2Fg%2F11c5z_2z2z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white/90 rounded-full px-4 py-2 shadow text-sm font-medium hover:scale-105 transition-transform border border-gray-200"
              style={{textDecoration: 'none'}}
            >
              <span className="text-yellow-500 text-base">★</span>
              <span className="text-[var(--card-title)] font-bold ml-1">4,7</span>
              <span className="text-gray-600 ml-1">| 37 avis vérifiés Google</span>
              <svg width="18" height="18" viewBox="0 0 48 48" className="ml-2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M44.5 20H24V28.5H36.5C35.2 33.1 31.1 36.5 24 36.5C16.6 36.5 10.5 30.4 10.5 23C10.5 15.6 16.6 9.5 24 9.5C27.2 9.5 29.9 10.6 32 12.5L37.7 7C34.1 3.7 29.4 1.5 24 1.5C12.7 1.5 3.5 10.7 3.5 23C3.5 35.3 12.7 44.5 24 44.5C34.5 44.5 44.5 36.5 44.5 23C44.5 21.7 44.5 20.8 44.5 20Z" fill="#E0E0E0"/>
                  <path d="M6.3 14.1L13.5 19.2C15.4 14.7 19.3 11.5 24 11.5C26.6 11.5 28.9 12.4 30.7 13.9L37.1 8.1C33.5 4.9 28.9 2.5 24 2.5C15.2 2.5 7.9 8.7 6.3 14.1Z" fill="#F44336"/>
                  <path d="M24 45.5C29.2 45.5 33.8 43.6 37.1 40.7L30.2 35.2C28.3 36.6 26.1 37.5 24 37.5C19.3 37.5 15.4 34.3 13.5 29.8L6.3 34.9C7.9 40.3 15.2 45.5 24 45.5Z" fill="#4CAF50"/>
                  <path d="M44.5 23C44.5 21.7 44.5 20.8 44.5 20H24V28.5H36.5C35.8 31.1 34.1 33.1 32 34.5L38.7 39.9C41.9 36.9 44.5 30.9 44.5 23Z" fill="#2196F3"/>
                  <path d="M6.3 14.1L13.5 19.2C15.4 14.7 19.3 11.5 24 11.5C26.6 11.5 28.9 12.4 30.7 13.9L37.1 8.1C33.5 4.9 28.9 2.5 24 2.5C15.2 2.5 7.9 8.7 6.3 14.1Z" fill="#F44336"/>
                </g>
              </svg>
            </a>
          </div>
        </div>
        {/* Carrousel de fiche produit à droite */}
        <div className="w-full md:w-5/12 flex flex-col items-center justify-center">
          <div className="flex items-center gap-4">
            {/* Fiche produit unique avec animation */}
            <div className="relative w-80 aspect-[4/5] flex flex-col items-stretch">
              <AnimatePresence mode="wait">
                {featuredProducts[current] && (
                  <m.div
                    key={featuredProducts[current].id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex flex-col items-stretch"
                  >
                    <Link href={`/produit/${featuredProducts[current].name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="bg-[var(--background)] rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
                      <div className="aspect-square w-full relative overflow-hidden">
                        <Image
                          src={featuredProducts[current].image_url || '/cactus-vedette.png'}
                          alt={featuredProducts[current].name}
                          fill
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-[var(--accent)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                          ⭐ Promo
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <h3 className="text-lg font-bold text-[var(--card-title)] mb-1">{featuredProducts[current].name}</h3>
                        <p className="text-xs text-[var(--foreground)] mb-2 line-clamp-2 opacity-80">{featuredProducts[current].description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-lg font-bold text-[var(--accent)]">{featuredProducts[current].price}€</span>
                          <span className="px-3 py-1 bg-[var(--accent)] text-white rounded-full text-xs font-semibold">Découvrir</span>
                        </div>
                      </div>
                    </Link>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Barre de progression façon Instagram */}
          {nbProducts > 1 && (
            <div className="flex gap-1 w-full max-w-xs mt-8">
              {featuredProducts.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full ${idx === current ? 'bg-[var(--accent)]' : 'bg-[var(--accent)]/30'} transition-all`}
                />
              ))}
            </div>
          )}
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
          .limit(4)
          .order('id', { ascending: true });
        let products = data || [];
        // Ajoute 3 produits fictifs si moins de 4 produits
        while (products.length < 4) {
          products.push({
            id: `fake${products.length}`,
            name: `Produit Promo ${products.length + 1}`,
            description: "Produit en promotion exceptionnelle !",
            price: 19.99 + products.length,
            image_url: "/cactus-vedette.png"
          });
        }
        setFeaturedProducts(products);
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
          {featuredProducts.slice(0, 3).map((product, index) => (
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

// Nouvelle version synchronisée
function AmenagementSection() {
  const projets = [
    {
      id: 1,
      titre: "Composition Gravier Blanc",
      description: "Design épuré avec sélection de cactus résistants au froid",
      image: "/composition_gravier-blanc.jpg",
      localisation: "Montpellier, France"
    },
    {
      id: 2,
      titre: "Sélection Plantes Adaptées",
      description: "Choix d'espèces selon la rusticité du climat local",
      image: "/Sélection de plantes adaptées.jpg",
      localisation: "Toulouse, France"
    },
    {
      id: 3,
      titre: "Polaskia Chichipe et massifs",
      description: "Massif de cactus Polaskia et autres variétés pour un effet spectaculaire.",
      image: "/images/Polaskia-Chichipe.jpg",
      localisation: "Canet, France"
    },
    {
      id: 4,
      titre: "Trichocereus Spachianus en groupe",
      description: "Plantation de Trichocereus Spachianus pour une ambiance exotique.",
      image: "/images/Trichocereus Spachianus.jpg",
      localisation: "Perpignan, France"
    },
    {
      id: 5,
      titre: "Aménagement piscine cactus",
      description: "Création d'un espace piscine exotique avec palmiers et grands cactus éclairés.",
      image: "/amenagement cactus piscine.jpg",
      localisation: "Saint-Cyprien, France"
    },
    {
      id: 6,
      titre: "Cactus à Toreilles",
      description: "Aménagement paysager avec cactus et graviers décoratifs pour un rendu naturel.",
      image: "/amenagement cactus toreilles.jpg",
      localisation: "Toreilles, France"
    }
  ];
  const [current, setCurrent] = useState(0);
  const goNext = useCallback(() => setCurrent((prev) => (prev + 1) % projets.length), [projets.length]);
  const goPrev = useCallback(() => setCurrent((prev) => (prev - 1 + projets.length) % projets.length), [projets.length]);
  useEffect(() => {
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [goNext]);
  const projet = projets[current];
  return (
    <section className="w-full bg-[var(--background)] py-20 px-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-0 md:gap-12">
        {/* Image principale à gauche (change avec le carrousel) */}
        <div className="md:w-1/2 w-full relative min-h-[340px] md:min-h-[480px] flex-shrink-0">
          <AnimatePresence mode="wait">
            <m.div
              key={projet.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={projet.image}
                alt={projet.titre}
                fill
                className="object-cover rounded-r-none rounded-2xl md:rounded-l-2xl md:rounded-r-none shadow-xl border border-[var(--border)]"
                priority
              />
              {/* Badge expertise */}
              <div className="absolute top-6 left-6 bg-[var(--accent)] text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg border-2 border-white/80">
                15 ans d'expertise
              </div>
              {/* Badge projet d'exception */}
              <div className="absolute bottom-6 left-6 bg-white/90 text-[var(--accent)] px-4 py-1 rounded-full text-sm font-semibold shadow-md border border-[var(--accent)]">
                Projet d'exception
              </div>
            </m.div>
          </AnimatePresence>
        </div>
        {/* Contenu à droite */}
        <div className="md:w-1/2 w-full flex flex-col justify-center px-6 py-10 md:py-0">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--card-title)] mb-2">
            🏡 Nos Aménagements
          </h2>
          {/* Encart projets réalisés */}
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-block bg-[var(--accent)] text-white px-4 py-1 rounded-full text-sm font-semibold shadow">+100 projets réalisés</span>
            <span className="text-[var(--foreground)] opacity-70 text-sm">Partout en France</span>
          </div>
          <p className="text-xl text-[var(--card-title)] font-semibold mb-2">
            Transformez votre extérieur en oasis unique
          </p>
          <p className="text-lg text-[var(--foreground)] opacity-80 mb-8 max-w-xl">
            Confiez votre projet à un expert passionné : conseil, suivi, et qualité professionnelle du devis à la réalisation. Nos aménagements sur-mesure subliment jardins, piscines et terrasses, même en climat difficile.
          </p>
          {/* Carrousel projet (infos + navigation) */}
          <div className="relative mb-8 w-full max-w-md mx-auto flex items-center justify-center">
            {/* Flèche gauche */}
            <button
              onClick={goPrev}
              className="hidden sm:flex items-center justify-center absolute left-[-48px] top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-[var(--accent)] hover:text-white text-[var(--accent)] rounded-full p-2 shadow transition-colors border border-[var(--accent)]"
              aria-label="Projet précédent"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {/* Bloc projet */}
            <div className="w-full">
              <AnimatePresence mode="wait">
                <m.div
                  key={projet.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] flex flex-col group"
                >
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--card-title)] mb-1">{projet.titre}</h3>
                      <p className="text-sm text-[var(--foreground)] opacity-75 mb-2">{projet.description}</p>
                    </div>
                    <div className="text-xs text-[var(--accent)] font-medium">📍 {projet.localisation}</div>
                  </div>
                </m.div>
              </AnimatePresence>
            </div>
            {/* Flèche droite */}
            <button
              onClick={goNext}
              className="hidden sm:flex items-center justify-center absolute right-[-48px] top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-[var(--accent)] hover:text-white text-[var(--accent)] rounded-full p-2 shadow transition-colors border border-[var(--accent)]"
              aria-label="Projet suivant"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              href="/amenagement"
              className="inline-block px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              Voir toutes nos réalisations
            </Link>
            <a
              href="tel:0603425595"
              className="inline-block px-8 py-4 border-2 border-[var(--accent)] text-[var(--accent)] rounded-full font-semibold transition-all hover:bg-[var(--accent)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              📞 Devis gratuit
            </a>
          </div>
          {/* Citation client */}
          <div className="italic text-[var(--foreground)] opacity-80 text-base border-l-4 border-[var(--accent)] pl-4">
            "Merci à Vincent pour ce jardin unique, réalisé avec passion et professionnalisme !"
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTotalProducts() {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      if (!error) {
        setTotalProducts(count || 0);
      }
    }

    async function fetchFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(4)
          .order('id', { ascending: true });
        let products = data || [];
        // Ajoute 3 produits fictifs si moins de 4 produits
        while (products.length < 4) {
          products.push({
            id: `fake${products.length}`,
            name: `Produit Promo ${products.length + 1}`,
            description: "Produit en promotion exceptionnelle !",
            price: 19.99 + products.length,
            image_url: "/cactus-vedette.png"
          });
        }
        setFeaturedProducts(products);
      } catch (e) {
        console.error('Erreur lors du chargement des produits phares:', e);
      }
    }

    fetchTotalProducts();
    fetchFeaturedProducts();
  }, []);

  return (
    <LazyMotionWrapper>
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <HeroSection totalProducts={totalProducts} featuredProducts={featuredProducts} />

        {/* Section produits phares */}
        <FeaturedProducts />

        {/* Section aménagements synchronisée */}
        <AmenagementSection />

        {/* Sections catégories produits */}
        <section className="py-16 px-2 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto">
            {/* Agaves premium */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🌱</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--card-title)]">Agaves</h2>
              </div>
              <p className="text-lg text-[var(--foreground)] opacity-80 mb-6">Des agaves robustes et graphiques pour un jardin d'exception.</p>
              <div className="rounded-3xl bg-[var(--card-bg)] shadow-2xl p-8 mb-6">
                <ProductList limit={4} category="Agaves" />
              </div>
              <div className="flex justify-end">
                <Link href="/categorie/agaves" className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all text-lg">
                  Voir toute la collection <span style={{ marginLeft: 8 }}><FaArrowRight size={20} /></span>
                </Link>
              </div>
            </div>
            {/* Aloès premium */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🪴</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--card-title)]">Aloès</h2>
              </div>
              <p className="text-lg text-[var(--foreground)] opacity-80 mb-6">Des aloès résistants et élégants pour une touche exotique.</p>
              <div className="rounded-3xl bg-[var(--card-bg)] shadow-2xl p-8 mb-6">
                <ProductList limit={4} category="Aloès" />
              </div>
              <div className="flex justify-end">
                <Link href="/categorie/aloes" className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all text-lg">
                  Voir toute la collection <span style={{ marginLeft: 8 }}><FaArrowRight size={20} /></span>
                </Link>
              </div>
            </div>
            {/* Cactus premium */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🌵</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--card-title)]">Cactus</h2>
              </div>
              <p className="text-lg text-[var(--foreground)] opacity-80 mb-6">Notre sélection de cactus rares et majestueux pour sublimer vos espaces.</p>
              <div className="rounded-3xl bg-[var(--card-bg)] shadow-2xl p-8 mb-6">
                <ProductList limit={4} category="Cactus" />
              </div>
              <div className="flex justify-end">
                <Link href="/categorie/cactus" className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all text-lg">
                  Voir toute la collection <span style={{ marginLeft: 8 }}><FaArrowRight size={20} /></span>
                </Link>
              </div>
            </div>
          </div>
        </section>

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
