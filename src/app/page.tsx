'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import DarkModeSwitch from "../components/DarkModeSwitch";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="w-full bg-[var(--background)] text-[var(--card-title)] flex items-center py-3 shadow-sm border-b border-[var(--border)] text-sm">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4">
                      <Image
              src="/logo.png"
              alt="Atypic Cactus"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          <div className="flex items-center">
            <span className="hidden sm:block font-medium">Livraison offerte dès 200 €</span>
            {/* Discreet Button Placeholder */}
            <button
              className="ml-4 flex items-center justify-center rounded-full p-2 bg-[var(--card-bg)] hover:bg-[var(--accent)] transition-colors text-[var(--card-title)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              aria-label="Informations"
              type="button"
              onClick={() => alert('Discreet button clicked!')} // Placeholder action
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span className="sr-only">Informations</span>
            </button>
            <DarkModeSwitch />
          </div>
        </div>
      </header>

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
              className="text-lg sm:text-2xl mb-8 text-[var(--foreground)]"
            >
              Découvrez notre sélection exclusive de cactus de grande taille, de 1 à 2 mètres, pour sublimer vos espaces avec des spécimens rares et majestueux.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <Link
                href="/produit"
                className="inline-block px-8 py-4 bg-[var(--accent)] text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                Voir le cactus vedette
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
            <h3 className="font-bold text-lg mb-2 text-[var(--card-title)]">Taille impressionnante</h3>
            <p className="text-[var(--foreground)] flex items-center justify-center sm:justify-start">
              <span className="mr-2 text-xl">🌵</span>
              <span>Des cactus de 1 à 2 mètres pour un effet spectaculaire dans votre intérieur ou jardin.</span>
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -6, scale: 1.04 }}
            className="p-6 rounded-xl shadow-sm border border-[var(--border)] bg-[var(--card-bg)]"
            initial={{ opacity: 0, y: 30 }}
            variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
          >
            <h3 className="font-bold text-lg mb-2 text-[var(--card-title)]">Spécimens rares</h3>
            <p className="text-[var(--foreground)] flex items-center justify-center sm:justify-start">
              <span className="mr-2 text-xl">✨</span>
              <span>Sélection exclusive de variétés difficiles à trouver, pour collectionneurs et passionnés.</span>
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -6, scale: 1.04 }}
            className="p-6 rounded-xl shadow-sm border border-[var(--border)] bg-[var(--card-bg)]"
            initial={{ opacity: 0, y: 30 }}
            variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
          >
            <h3 className="font-bold text-lg mb-2 text-[var(--card-title)]">Livraison soignée</h3>
            <p className="text-[var(--foreground)] flex items-center justify-center sm:justify-start">
              <span className="mr-2 text-xl">📦</span>
              <span>Emballage sécurisé et livraison rapide partout en France.</span>
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Collection de cactus */}
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
            Notre Collection
          </motion.h2>
          
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            {/* Cactus 1 */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            >
              <Link href="/produit/opuntia" className="block">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src="/cactus-1.png"
                    alt="Opuntia Ficus-Indica"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-sm font-medium text-[var(--accent)] uppercase tracking-wide">
                    Opuntia
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-3 text-[var(--card-title)]">
                    Ficus-Indica Giant
                  </h3>
                  <p className="text-2xl font-bold text-[var(--accent)]">
                    149€
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Cactus 2 */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            >
              <Link href="/produit/cereus" className="block">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src="/cactus-2.png"
                    alt="Cereus Peruvianus"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-sm font-medium text-[var(--accent)] uppercase tracking-wide">
                    Cereus
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-3 text-[var(--card-title)]">
                    Peruvianus XL
                  </h3>
                  <p className="text-2xl font-bold text-[var(--accent)]">
                    229€
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Cactus 3 */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            >
              <Link href="/produit/echinocactus" className="block">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src="/cactus-3.png"
                    alt="Echinocactus Grusonii"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-sm font-medium text-[var(--accent)] uppercase tracking-wide">
                    Echinocactus
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-3 text-[var(--card-title)]">
                    Grusonii Golden
                  </h3>
                  <p className="text-2xl font-bold text-[var(--accent)]">
                    189€
                  </p>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Produit vedette */}
      <section id="produit" className="py-20 px-4 bg-[var(--background)] flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl w-full bg-[var(--card-bg)] rounded-2xl shadow-xl p-8 flex flex-col items-center"
        >
          <Image
            src="/cactus-vedette.png"
            alt="Cactus vedette"
            width={220}
            height={340}
            className="mb-6 rounded-xl border border-[var(--border)]"
          />
          <h2 className="text-2xl font-bold mb-2 text-[var(--card-title)]">Euphorbia Ingens XXL</h2>
          <p className="text-[var(--foreground)] mb-4 text-center">Un spécimen rare de plus de 1,8 mètre, parfait pour les amateurs de plantes d&apos;exception. Quantité très limitée !</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/produit"
              className="inline-block px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              Acheter ce cactus
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-[var(--foreground)] text-sm border-t border-[var(--border)] bg-[var(--background)]">
        © {new Date().getFullYear()} Atypic Cactus. Site inspiré par Stripe. Illustrations temporaires.
      </footer>
    </div>
  );
}
