'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '../../components/Header';
import TopBar from '../../components/TopBar';

export default function ProductionPage() {
  const etapes = [
    {
      id: 1,
      titre: "Sélection des Graines",
      description: "Choix rigoureux de graines provenant de collecteurs spécialisés",
      icon: "🌱"
    },
    {
      id: 2,
      titre: "Germination Contrôlée", 
      description: "Conditions optimales de température et d'humidité",
      icon: "🌡️"
    },
    {
      id: 3,
      titre: "Croissance Surveillée",
      description: "Suivi personnalisé de chaque plant pendant des années",
      icon: "📈"
    },
    {
      id: 4,
      titre: "Sélection Qualité",
      description: "Seuls les plus beaux spécimens sont proposés à la vente",
      icon: "⭐"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <TopBar />
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
            🌵 Notre Production
          </h1>
          <p className="text-xl text-[var(--foreground)] opacity-75 max-w-3xl mx-auto mb-8">
            Depuis plus de 15 ans, nous cultivons avec passion des cactus d'exception. 
            Découvrez nos méthodes de production artisanale au cœur du Sud de la France.
          </p>
          <div className="bg-gradient-to-r from-green-500 to-[var(--accent)] text-white px-8 py-4 rounded-full inline-block font-semibold text-lg">
            🏭 Production française • Qualité garantie
          </div>
        </motion.div>

        {/* Chiffres clés */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-[var(--card-bg)] rounded-2xl p-6 text-center border border-[var(--border)]">
            <div className="text-3xl font-bold text-[var(--accent)] mb-2">15+</div>
            <div className="text-sm text-[var(--foreground)] opacity-75">Années d'expérience</div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-2xl p-6 text-center border border-[var(--border)]">
            <div className="text-3xl font-bold text-[var(--accent)] mb-2">500+</div>
            <div className="text-sm text-[var(--foreground)] opacity-75">Variétés cultivées</div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-2xl p-6 text-center border border-[var(--border)]">
            <div className="text-3xl font-bold text-[var(--accent)] mb-2">10k+</div>
            <div className="text-sm text-[var(--foreground)] opacity-75">Plants produits/an</div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-2xl p-6 text-center border border-[var(--border)]">
            <div className="text-3xl font-bold text-[var(--accent)] mb-2">100%</div>
            <div className="text-sm text-[var(--foreground)] opacity-75">Production française</div>
          </div>
        </motion.div>

        {/* Processus de production */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[var(--card-title)] mb-8 text-center">
            Notre Processus de Production
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {etapes.map((etape, index) => (
              <motion.div
                key={etape.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                className="bg-[var(--card-bg)] rounded-2xl p-6 text-center border border-[var(--border)] relative"
              >
                {index < etapes.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <div className="w-6 h-0.5 bg-[var(--accent)]"></div>
                    <div className="w-0 h-0 border-l-4 border-l-[var(--accent)] border-t-2 border-b-2 border-transparent absolute -right-1 -top-1"></div>
                  </div>
                )}
                <div className="text-4xl mb-4">{etape.icon}</div>
                <h3 className="font-bold text-[var(--card-title)] mb-3">{etape.titre}</h3>
                <p className="text-sm text-[var(--foreground)] opacity-75">{etape.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section environnement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--card-title)] mb-6">
                🌿 Production Éco-Responsable
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-[var(--foreground)]">
                    <strong>Arrosage raisonné</strong> - Économie d'eau grâce aux propriétés des cactus
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-[var(--foreground)]">
                    <strong>Substrats naturels</strong> - Mélanges drainants sans produits chimiques
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-[var(--foreground)]">
                    <strong>Énergies renouvelables</strong> - Serres chauffées par panneaux solaires
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-[var(--foreground)]">
                    <strong>Circuit court</strong> - Vente directe producteur sans intermédiaire
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-[var(--card-title)] mb-2">
                Engagement Environnemental
              </h3>
              <p className="text-[var(--foreground)] opacity-75">
                Une production respectueuse de l'environnement pour des cactus durables
              </p>
            </div>
          </div>
        </motion.div>

        {/* Certifications et labels */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-[var(--card-title)] mb-6">
            Qualité et Traçabilité
          </h2>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-[var(--card-bg)] rounded-full px-6 py-3 border border-[var(--border)]">
              🇫🇷 <strong>Origine France Garantie</strong>
            </div>
            <div className="bg-[var(--card-bg)] rounded-full px-6 py-3 border border-[var(--border)]">
              🌱 <strong>Production Artisanale</strong>
            </div>
            <div className="bg-[var(--card-bg)] rounded-full px-6 py-3 border border-[var(--border)]">
              ✅ <strong>Qualité Contrôlée</strong>
            </div>
          </div>
          <p className="text-[var(--foreground)] opacity-75 max-w-2xl mx-auto">
            Chaque cactus est cultivé avec soin dans nos serres du Sud de la France. 
            Notre expérience de plus de 15 ans garantit des plants robustes et de qualité exceptionnelle.
          </p>
        </motion.div>
      </main>
    </div>
  );
} 