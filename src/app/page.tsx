'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "../components/Header";
import TopBar from "../components/TopBar";
import ProductList from "../components/ProductList";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    async function fetchTotalProducts() {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching total products:', error);
        return;
      }

      setTotalProducts(count || 0);
    }

    fetchTotalProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <TopBar />
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center flex-1 py-20 bg-[var(--background)] relative overflow-hidden gap-12">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 px-4">
          <div className="w-full md:w-7/12 text-left">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight text-[var(--card-title)]"
            >
              Atypic Cactus
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-lg sm:text-2xl mb-4 text-[var(--foreground)]"
            >
              Découvrez notre collection de {totalProducts} cactus et plantes grasses exceptionnels, sélectionnés avec passion par Vincent Basset, spécialiste depuis plus de 15 ans.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-lg mb-8 text-[var(--foreground)] opacity-90"
            >
              Des plantes architecturales, ultra-faciles à entretenir, de taille adulte à taille géante pour réaliser vos plus beaux aménagements intérieurs et extérieurs.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
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
            </motion.div>
          </div>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 md:mt-0 w-full md:w-5/12 flex justify-center items-center"
          >
            <video
              src="/Majestic Cactus Close-Up.mp4"
              className="w-full h-auto max-h-96 object-cover rounded-xl shadow-lg"
              autoPlay
              loop
              muted
              controls
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </section>

      {/* Nouveautés 2025 */}
      <section className="py-20 px-4 bg-[var(--background)]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[var(--card-title)]"
            >
            Nouveautés 2025
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-center text-[var(--foreground)] opacity-75 mb-12 max-w-2xl mx-auto"
          >
            Découvrez nos dernières acquisitions et variétés rares, sélectionnées spécialement pour cette année
          </motion.p>
          <ProductList limit={6} />
          
          {/* Bouton pour voir tous les produits */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <Link
              href="/categorie/cactus"
              className="inline-block px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              Voir toutes les nouveautés
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Plantes Exceptionnelles */}
      <section className="py-20 px-4 bg-[var(--card-bg)]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[var(--card-title)]"
          >
            ⭐ Plantes Exceptionnelles
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-center text-[var(--foreground)] opacity-75 mb-12 max-w-2xl mx-auto"
          >
            Nos sujets d'exception : grands cactus, plantes centenaires et pièces uniques de collection
          </motion.p>
          <ProductList limit={3} category="Sujets exceptionnels" />
          
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <Link
              href="/categorie/sujets-exceptionnels"
              className="inline-block px-8 py-4 bg-amber-600 text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              Voir toutes les plantes exceptionnelles
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Cactus */}
      <section className="py-20 px-4 bg-[var(--background)]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[var(--card-title)]"
          >
            🌵 Cactus
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-center text-[var(--foreground)] opacity-75 mb-12 max-w-2xl mx-auto"
          >
            Notre spécialité : une large gamme de cactus résistants au froid, parfaits pour vos jardins et intérieurs
          </motion.p>
          <ProductList limit={6} category="Cactus" />
          
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <Link
              href="/categorie/cactus"
              className="inline-block px-8 py-4 bg-green-600 text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              Voir toutes les plantes de cette catégorie
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Aloès */}
      <section className="py-20 px-4 bg-[var(--card-bg)]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[var(--card-title)]"
          >
            🌿 Aloès
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-center text-[var(--foreground)] opacity-75 mb-12 max-w-2xl mx-auto"
          >
            Plantes succulentes aux vertus thérapeutiques, faciles d'entretien et aux formes sculptées
          </motion.p>
          <ProductList limit={3} category="Aloes" />
          
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <Link
              href="/categorie/aloes"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Voir toutes les plantes de cette catégorie
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Banner */}
      <section className="py-8 px-4 bg-emerald-600 dark:bg-emerald-700">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div
              className="flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <span className="text-2xl">🚚</span>
              <div className="text-left">
                <div className="font-semibold">Livraison 24H</div>
                <div className="text-sm opacity-90">Nouveau service transporteur</div>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <span className="text-2xl">🌿</span>
              <div className="text-left">
                <div className="font-semibold">Pépinière ouverte</div>
                <div className="text-sm opacity-90">Toute la semaine</div>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <span className="text-2xl">📞</span>
              <div className="text-left">
                <div className="font-semibold">06 03 42 55 95</div>
                <div className="text-sm opacity-90">Conseil expert</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
