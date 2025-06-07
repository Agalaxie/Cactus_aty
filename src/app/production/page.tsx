'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProductionPage() {
  const services = [
    {
      id: 1,
      titre: "PLANTES RUSTIQUES",
      description: "Toutes nos plantes ont été sélectionnées pour résister au gel et à la sécheresse",
      icon: "❄️"
    },
    {
      id: 2,
      titre: "NOTRE MISSION", 
      description: "Proposer des alternatives aux jardins nécessiteux en eau et en entretien",
      icon: "🎯"
    },
    {
      id: 3,
      titre: "NOTRE VISION",
      description: "Les cactus et autres plantes du désert représentent une alternative face au réchauffement climatique",
      icon: "🌍"
    },
    {
      id: 4,
      titre: "NOTRE PASSION",
      description: "Cultiver et diffuser les plantes de milieux désertiques",
      icon: "💚"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--card-title)] mb-6">
            🏢 Notre Entreprise
          </h1>
          <p className="text-xl text-[var(--accent)] font-semibold max-w-4xl mx-auto mb-8">
            Des plantes et des jardins économiques en eau et en entretien
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-16"
        >
          <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--border)]">
            <p className="text-lg text-[var(--foreground)] leading-relaxed mb-6">
              Brisant les normes et les exigences des jardins classiques, <strong>Atypic-cactus</strong>, entreprise spécialisée dans la vente et l'installation de cactus et autres plantes désertiques répond à la fois à une réelle nécessité climatique, résistants à la sécheresse, mais aussi à un changement des codes esthétiques et éthiques du jardin.
            </p>
          </div>
        </motion.section>

        {/* Notre Histoire */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[var(--card-title)] mb-8 text-center">
            🌱 Notre Histoire
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[var(--foreground)] leading-relaxed mb-4">
                Depuis <strong>10 ans</strong>, Atypic-cactus sélectionne et reproduit, dans le <strong>Roussillon (66)</strong> des plantes acclimatées au climat français afin de proposer des cactus et yuccas pouvant résister jusqu'à <strong>-17°</strong>.
              </p>
              <p className="text-[var(--foreground)] leading-relaxed mb-4">
                Originaire de Bolivie, du désert d'Atacama au Pérou tels que les cierges <em>Cleistocactus</em>, ou les <em>Trichocereus Pasacana</em> pouvant atteindre plus de 10 mètres, du Mexique et des États-Unis comme les fameux <em>Echinocactus Grussonii</em> « coussin de belle-mère », ou encore les yuccas filifera, et rostrata.
              </p>
              <p className="text-[var(--foreground)] leading-relaxed">
                Ces plantes sont aujourd'hui majoritairement produites sur le sol européen, <strong>évitant ainsi le pillage écologique</strong> dont ont été victimes les déserts américains.
              </p>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden">
              <Image
                src="/vincent basset.jpg"
                alt="Production de cactus dans le Roussillon"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </motion.section>

        {/* Livraison et Qualité */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[var(--card-title)] mb-6">📦 Livraison et Qualité</h3>
            <p className="text-[var(--foreground)] leading-relaxed mb-4">
              Proposées en différentes tailles, en boutures, en pots ou racines nues, les plantes sont emballées et livrées avec grand soin, de diverses manières selon quantité et taille (colis postal, point relais ou transporteur pour les gros spécimens).
            </p>
            <p className="text-[var(--foreground)] leading-relaxed mb-4">
              Parfaitement adaptées à ce traitement, les plantes à racines nues et les boutures donnent d'excellents résultats et réagissent très rapidement une fois remises en terre, sans arrosage immédiat ni abondant.
            </p>
            <div className="bg-[var(--accent)] text-white p-4 rounded-lg">
              <p className="font-semibold">💰 Un choix financièrement judicieux :</p>
              <p>Elles vivent longtemps, ne nécessitent pas de taille, se contentent de presque rien, n'imposent pas de traitements.</p>
            </div>
          </div>
        </motion.section>

        {/* Vincent Basset - Expert */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[var(--card-title)] mb-8 text-center">
            👨‍🌾 Un spécialiste pour vos aménagements secs
          </h2>
          <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--border)]">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="mb-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--accent)] mx-auto md:mx-0">
                    <Image
                      src="/vincent basset.jpg"
                      alt="Vincent Basset - Expert en cactus"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[var(--card-title)] mb-2">Vincent Basset</h3>
                <p className="text-[var(--accent)] font-medium mb-4">Anthropologue et Expert Cactus</p>
              </div>
              <div>
                <p className="text-[var(--foreground)] leading-relaxed mb-4">
                  <strong>Vincent Basset</strong>, Anthropologue et mordu de cactus depuis 20 ans, a réuni ses deux passions au Mexique dont il est devenu spécialiste. Confronté là-bas à la grande diversité des plantes de milieux arides, il n'a de cesse depuis d'en rechercher les espèces les plus adaptées aux sécheresses et au froid.
                </p>
                <p className="text-[var(--foreground)] leading-relaxed">
                  Il cultive ainsi divers cactées, agaves et aloès, yuccas et dasylirions ce qui fait de lui un expert passionnant. Qui recherche de gros spécimens au graphisme remarquable y trouve également un très beau choix, de quoi réaliser des décors hors-norme, insolites, sobres et magnifiques.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Nos Réalisations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[var(--card-title)] mb-8 text-center">
            🏗️ Nos Réalisations
          </h2>
          <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--border)]">
            <p className="text-[var(--foreground)] leading-relaxed mb-6">
              Avec de nombreuses installations à son actif, pour des <strong>particuliers, entreprises, architectes, décorateurs, municipalités…</strong> de Toulouse à Montpellier et au-delà, Atypic Cactus réalise aussi des prestations chez vous, à la demande, <strong>partout en France</strong>, afin de composer et mettre en place les spécimens de votre choix.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-xl">
                <h4 className="font-bold text-[var(--card-title)] mb-3">🏠 Intérieur</h4>
                <p className="text-[var(--foreground)] text-sm">Jardin d'hiver, véranda, vitrines…</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 p-6 rounded-xl">
                <h4 className="font-bold text-[var(--card-title)] mb-3">🌞 Extérieur</h4>
                <p className="text-[var(--foreground)] text-sm">Jardin sec, graphique, minimaliste, zen, contemporain, terrasse, piscine…</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Conseils d'Aménagement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[var(--card-title)] mb-8 text-center">
            💡 Conseils pour un Bel Aménagement
          </h2>
          <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--border)]">
            <p className="text-[var(--foreground)] leading-relaxed mb-6">
              La réussite pour un bel aménagement type « rocaille » nécessite une terre bien drainée par de petits graviers, légèrement en butte, et plusieurs plantes incontournables :
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🌵</span>
                  <div>
                    <h4 className="font-semibold text-[var(--card-title)]">Cierges Multi-bras</h4>
                    <p className="text-sm text-[var(--foreground)] opacity-75">Trichocereus, Cleistocactus, Cereus pour donner de la hauteur</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🪴</span>
                  <div>
                    <h4 className="font-semibold text-[var(--card-title)]">Yuccas Variés</h4>
                    <p className="text-sm text-[var(--foreground)] opacity-75">Rostrata, Filifera, Linearifolia pour l'aspect feuillu</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚪</span>
                  <div>
                    <h4 className="font-semibold text-[var(--card-title)]">Cactus Globulaires</h4>
                    <p className="text-sm text-[var(--foreground)] opacity-75">Ferocactus Stainesii, Echinocactus Grusonii</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🌿</span>
                  <div>
                    <h4 className="font-semibold text-[var(--card-title)]">Agaves Compactes</h4>
                    <p className="text-sm text-[var(--foreground)] opacity-75">Victoria Reginae, Parryi, Ovatifolia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Nos Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[var(--card-title)] mb-8 text-center">
            🎯 Nos Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1, duration: 0.6 }}
                className="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg border border-[var(--border)] text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-bold text-[var(--card-title)] mb-3 text-lg">
                  {service.titre}
                </h3>
                <p className="text-[var(--foreground)] opacity-75 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Informations Pratiques */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.7 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-[var(--accent)] to-green-600 text-white rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">🏭 Notre Pépinière</h2>
            <p className="text-lg mb-4">
              <strong>Villelongue de la Salanque</strong> - Pyrénées-Orientales (66)
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">⏰ Horaires</h3>
                <p>Lun-Ven : 8H-16H</p>
                <p>Samedi : 9H-12H</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">📞 Contact</h3>
                <p>06 03 42 55 95</p>
                <p>contact@atypic-cactus.fr</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.7 }}
          className="text-center"
        >
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
              🌍 Optez pour des plantes écologiques
            </h2>
            <p className="text-green-700 dark:text-green-300 text-lg">
              C'est œuvrer pour la planète en réduisant sa consommation d'eau !
            </p>
          </div>
        </motion.section>

      </main>
    </div>
  );
} 