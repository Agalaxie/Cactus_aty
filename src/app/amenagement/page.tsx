'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '../../components/Header';

export default function AmenagementPage() {
  const projets = [
    {
      id: 1,
      titre: "Jardin de Cactus Moderne",
      description: "Aménagement contemporain avec grands sujets et gravier décoratif",
      image: "/Jardin de cactus Pachycereus Pringlei avant de mettre le gravier de décoration.jpg",
      localisation: "Perpignan, France"
    },
    {
      id: 2,
      titre: "Composition Gravier Blanc",
      description: "Design épuré avec sélection de cactus résistants au froid",
      image: "/composition_gravier-blanc.jpg",
      localisation: "Montpellier, France"
    },
    {
      id: 3,
      titre: "Sélection Plantes Adaptées", 
      description: "Choix d'espèces selon la rusticité du climat local",
      image: "/Sélection de plantes adaptées.jpg",
      localisation: "Toulouse, France"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--card-title)] mb-6">
            🏡 Nos Aménagements
          </h1>
          <p className="text-xl text-[var(--foreground)] opacity-75 max-w-3xl mx-auto mb-8">
            Découvrez nos réalisations d'aménagements paysagers spécialisés en jardins de cactus. 
            Plus de 15 ans d'expertise au service de vos projets.
          </p>
          <div className="bg-[var(--accent)] text-white px-8 py-4 rounded-full inline-block font-semibold text-lg">
            📞 06 03 42 55 95 - Devis gratuit
          </div>
        </motion.div>

        {/* Grille des projets */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projets.map((projet, index) => (
            <motion.div
              key={projet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-video relative">
                <Image
                  src={projet.image}
                  alt={projet.titre}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[var(--card-title)] mb-2">
                  {projet.titre}
                </h3>
                <p className="text-[var(--foreground)] opacity-75 mb-3">
                  {projet.description}
                </p>
                <div className="text-sm text-[var(--accent)] font-medium">
                  📍 {projet.localisation}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section services */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)]"
        >
          <h2 className="text-3xl font-bold text-[var(--card-title)] mb-6 text-center">
            Nos Services d'Aménagement
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-semibold text-[var(--card-title)] mb-2">Conception</h3>
              <p className="text-sm text-[var(--foreground)] opacity-75">
                Étude personnalisée selon votre terrain et climat
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌵</div>
              <h3 className="font-semibold text-[var(--card-title)] mb-2">Plantation</h3>
              <p className="text-sm text-[var(--foreground)] opacity-75">
                Sélection et plantation de spécimens adaptés
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏔️</div>
              <h3 className="font-semibold text-[var(--card-title)] mb-2">Décoration</h3>
              <p className="text-sm text-[var(--foreground)] opacity-75">
                Graviers, pierres et éléments décoratifs
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-semibold text-[var(--card-title)] mb-2">Suivi</h3>
              <p className="text-sm text-[var(--foreground)] opacity-75">
                Conseils d'entretien et accompagnement
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="text-center mt-16"
        >
          <h2 className="text-2xl font-bold text-[var(--card-title)] mb-4">
            Prêt à transformer votre jardin ?
          </h2>
          <p className="text-[var(--foreground)] opacity-75 mb-6">
            Contactez Vincent Basset pour discuter de votre projet d'aménagement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0603425595"
              className="bg-[var(--accent)] text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              📞 Appeler maintenant
            </a>
            <a
              href="mailto:contact@atypic-cactus.fr"
              className="border-2 border-[var(--accent)] text-[var(--accent)] px-8 py-4 rounded-full font-semibold hover:bg-[var(--accent)] hover:text-white transition-colors"
            >
              ✉️ Demander un devis
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 