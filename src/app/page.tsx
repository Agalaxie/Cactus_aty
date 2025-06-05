'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "../components/Header";
import { products, getProductsByCategory, categories } from "../data/products";

export default function Home() {
  // Sélection de produits vedettes (premiers de chaque catégorie)
  const featuredProducts = [
    getProductsByCategory('cactus')[0],
    getProductsByCategory('agaves')[0],
    getProductsByCategory('yuccas')[0]
  ].filter(Boolean);

  // Sélection pour chaque catégorie (2 produits par catégorie)
  const cactusProducts = getProductsByCategory('cactus').slice(0, 2);
  const agaveProducts = getProductsByCategory('agaves').slice(0, 2);
  const yuccaProducts = getProductsByCategory('yuccas').slice(0, 2);
  const aloeProducts = getProductsByCategory('aloes').slice(0, 2);
  const boutures = getProductsByCategory('boutures').slice(0, 2);
  const sujetsExceptionnels = getProductsByCategory('sujets-exceptionnels').slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
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
              Découvrez notre collection de {products.length} cactus et plantes grasses exceptionnels, sélectionnés avec passion par Vincent Basset, spécialiste depuis plus de 15 ans.
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

      {/* Produits Vedettes */}
      <section className="py-20 px-4 bg-[var(--background)]">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[var(--card-title)]"
          >
            Nos Spécialités
          </motion.h2>
          
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
              >
                <Link href={`/produit/${product.id}`} className="block">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.characteristics?.coldResistance && (
                      <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        ❄️ {product.characteristics.coldResistance}°C
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-sm font-medium text-[var(--accent)] uppercase tracking-wide">
                      {product.category}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-3 text-[var(--card-title)]">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[var(--foreground)] mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-2xl font-bold text-[var(--accent)]">
                      {product.basePrice}€
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <Link
              href="/categorie/cactus"
              className="inline-block px-8 py-4 border-2 border-[var(--accent)] text-[var(--accent)] rounded-full font-semibold transition-all hover:bg-[var(--accent)] hover:text-white"
            >
              Voir tous les produits →
            </Link>
          </motion.div>
        </motion.div>
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

      {/* Statistiques */}
      <section className="py-16 px-4 bg-[var(--accent)]/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <div className="text-3xl font-bold text-[var(--accent)] mb-2">{products.length}</div>
              <div className="text-sm text-[var(--foreground)]">Spécimens disponibles</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <div className="text-3xl font-bold text-[var(--accent)] mb-2">{categories.length}</div>
              <div className="text-sm text-[var(--foreground)]">Catégories</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <div className="text-3xl font-bold text-[var(--accent)] mb-2">15+</div>
              <div className="text-sm text-[var(--foreground)]">Années d'expérience</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <div className="text-3xl font-bold text-[var(--accent)] mb-2">🇫🇷</div>
              <div className="text-sm text-[var(--foreground)]">Livraison France</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Écologique */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="text-6xl mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            variants={{ visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } } }}
          >
            🌍
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            className="text-3xl sm:text-4xl font-bold mb-6 text-[var(--card-title)]"
          >
            Choisir l'écologie
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            variants={{ visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.7 } } }}
            className="text-lg sm:text-xl text-[var(--foreground)] mb-8 leading-relaxed"
          >
            Optez pour des plantes écologiques, c'est œuvrer pour la planète en réduisant sa consommation d'eau !
            <br />
            Nos cactus, agaves, aloés et yuccas sont naturellement adaptés aux climats secs et demandent très peu d'entretien.
          </motion.p>
          <motion.div
            className="grid md:grid-cols-3 gap-6 mt-12"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-green-200 dark:border-green-800"
              initial={{ opacity: 0, y: 30 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <div className="text-3xl mb-4">💧</div>
              <h3 className="font-semibold mb-2 text-[var(--card-title)]">Économie d'eau</h3>
              <p className="text-sm text-[var(--foreground)]">Jusqu'à 90% moins d'arrosage qu'une plante classique</p>
            </motion.div>
            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-green-200 dark:border-green-800"
              initial={{ opacity: 0, y: 30 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="font-semibold mb-2 text-[var(--card-title)]">Croissance lente</h3>
              <p className="text-sm text-[var(--foreground)]">Moins d'émissions de CO2 liées à la production</p>
            </motion.div>
            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-green-200 dark:border-green-800"
              initial={{ opacity: 0, y: 30 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <div className="text-3xl mb-4">♻️</div>
              <h3 className="font-semibold mb-2 text-[var(--card-title)]">Longévité</h3>
              <p className="text-sm text-[var(--foreground)]">Des plantes qui durent des décennies, voire des siècles</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Avantages */}
      <section className="py-20 px-4 bg-[var(--background)]">
        <motion.div
          className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center sm:text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.18 } }
          }}
        >
          <motion.div
            whileHover={{ y: -6, scale: 1.04 }}
            className="p-6 rounded-xl shadow-sm border border-[var(--border)] bg-[var(--card-bg)]"
            initial={{ opacity: 0, y: 30 }}
            variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
          >
            <h3 className="font-bold text-lg mb-2 text-[var(--card-title)]">Expertise reconnue</h3>
            <p className="text-[var(--foreground)] flex items-center justify-center sm:justify-start">
              <span className="mr-2 text-xl">🌵</span>
              <span>Spécialiste passionné avec plus de 15 ans d'expérience et formation anthropologique.</span>
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -6, scale: 1.04 }}
            className="p-6 rounded-xl shadow-sm border border-[var(--border)] bg-[var(--card-bg)]"
            initial={{ opacity: 0, y: 30 }}
            variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
          >
            <h3 className="font-bold text-lg mb-2 text-[var(--card-title)]">Spécimens authentiques</h3>
            <p className="text-[var(--foreground)] flex items-center justify-center sm:justify-start">
              <span className="mr-2 text-xl">✨</span>
              <span>Sélection rigoureuse de variétés rares et résistantes, cultivées avec soin.</span>
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -6, scale: 1.04 }}
            className="p-6 rounded-xl shadow-sm border border-[var(--border)] bg-[var(--card-bg)]"
            initial={{ opacity: 0, y: 30 }}
            variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
          >
            <h3 className="font-bold text-lg mb-2 text-[var(--card-title)]">Ultra-faciles</h3>
            <p className="text-[var(--foreground)] flex items-center justify-center sm:justify-start">
              <span className="mr-2 text-xl">🎯</span>
              <span>Plantes architecturales ultra-faciles à entretenir, parfaites pour tous.</span>
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Nos Catégories */}
      <section className="py-20 px-4 bg-[var(--accent)]/5">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[var(--card-title)]"
          >
            Nos Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-center text-[var(--foreground)] mb-16 max-w-2xl mx-auto"
          >
            Explorez nos {categories.length} catégories spécialisées, chacune proposant des spécimens sélectionnés pour leur beauté et leur résistance.
          </motion.p>
          
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-6"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {categories.map((category) => {
              const categoryProducts = getProductsByCategory(category.id);
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border)] overflow-hidden group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                >
                  <Link href={category.href} className="block">
                    <div className="p-6 text-center">
                      <div className="text-4xl mb-4">{category.icon}</div>
                      <h3 className="text-lg font-bold mb-2 text-[var(--card-title)]">
                        {category.name}
                      </h3>
                      <p className="text-sm text-[var(--foreground)] mb-3">
                        {category.description}
                      </p>
                      <div className="text-sm font-medium text-[var(--accent)]">
                        {categoryProducts.length} produits
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Aménagements Clients */}
      <section className="py-20 px-4 bg-[var(--background)]">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[var(--card-title)]"
          >
            Réalisations Clients
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-center text-[var(--foreground)] mb-16 max-w-2xl mx-auto"
          >
            Découvrez comment nos cactus et plantes grasses transforment les espaces de nos clients, 
            créant des aménagements uniques et spectaculaires.
          </motion.p>
          
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            {/* Aménagement 1 - Terrasse moderne */}
            <motion.div
              className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    <div className="text-6xl mb-4">🌵</div>
                    <p className="text-sm">Terrasse moderne</p>
                    <p className="text-xs opacity-70">Aix-en-Provence</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[var(--card-title)]">
                  Terrasse Zen
                </h3>
                <p className="text-sm text-[var(--foreground)] mb-3">
                  Aménagement contemporain avec agaves et cactus colonnaires pour créer 
                  un espace détente unique.
                </p>
                <div className="flex gap-2 text-xs">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Agaves</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Cereus</span>
                </div>
              </div>
            </motion.div>

            {/* Aménagement 2 - Jardin méditerranéen */}
            <motion.div
              className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    <div className="text-6xl mb-4">🏡</div>
                    <p className="text-sm">Jardin méditerranéen</p>
                    <p className="text-xs opacity-70">Montpellier</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[var(--card-title)]">
                  Oasis Méditerranéenne
                </h3>
                <p className="text-sm text-[var(--foreground)] mb-3">
                  Transformation complète d'un jardin avec yuccas géants et 
                  collection d'aloés pour un effet désertique.
                </p>
                <div className="flex gap-2 text-xs">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Yuccas</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Aloés</span>
                </div>
              </div>
            </motion.div>

            {/* Aménagement 3 - Intérieur design */}
            <motion.div
              className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    <div className="text-6xl mb-4">🏢</div>
                    <p className="text-sm">Design intérieur</p>
                    <p className="text-xs opacity-70">Nice</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[var(--card-title)]">
                  Bureau Design
                </h3>
                <p className="text-sm text-[var(--foreground)] mb-3">
                  Intégration de cactus architecturaux dans un espace de travail 
                  moderne pour un effet wow garanti.
                </p>
                <div className="flex gap-2 text-xs">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">Euphorbes</span>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Pachycereus</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Call to action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="bg-[var(--accent)]/10 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-[var(--card-title)]">
                Un projet d'aménagement ?
              </h3>
              <p className="text-[var(--foreground)] mb-6">
                Nos spécialistes vous conseillent pour créer l'aménagement parfait. 
                Visite gratuite et devis personnalisé pour tous projets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+33603425595"
                  className="inline-block px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold transition-all hover:shadow-xl"
                >
                  📞 06 03 42 55 95
                </a>
                <a
                  href="mailto:info@atypic-cactus.com"
                  className="inline-block px-8 py-4 border-2 border-[var(--accent)] text-[var(--accent)] rounded-full font-semibold transition-all hover:bg-[var(--accent)] hover:text-white"
                >
                  ✉️ Demander un devis
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
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
                  <p className="font-medium mb-2">Horaires d'ouverture :</p>
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
            <p>&copy; 2024 Atypic Cactus. Tous droits réservés. | 🌵 {products.length} produits disponibles | 🚚 Livraison 24H par transporteur</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
