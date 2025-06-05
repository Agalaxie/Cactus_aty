'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '../../components/Header';

export default function QuiSuisJe() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-6">
              Qui suis-je ?
            </h1>
            <div className="w-24 h-1 bg-[var(--accent)] mx-auto"></div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Image Section */}
            <motion.div 
              className="relative"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/vincent basset.jpg"
                  alt="Vincent Basset"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--accent)] rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[var(--accent)] rounded-full opacity-10"></div>
            </motion.div>

            {/* Text Content */}
            <motion.div 
              className="space-y-8"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="space-y-6 text-lg leading-relaxed text-[var(--foreground)]">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <span className="text-2xl font-semibold text-[var(--accent)] block mb-3">
                    Vincent Basset
                  </span>
                  Passionné de cactus depuis mes 18 ans, j'ai poursuivi des études de Sociologie et d'Anthropologie entre la France et le Mexique. Docteur en Sociologie et Maitre de conférence en Anthropologie, je me suis spécialisé sur les thèmes du chamanisme et néochamanisme, du tourisme et de l'identité.
                </motion.p>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                >
                  Lors de mon travail de terrain, j'ai décidé d'étudier la communauté Wixarica, plus connue sous le nom de Huichol, et découvrir par là-même la richesse de la culture indienne et leurs relations avec les éléments naturels. Les cactus faisaient bien sûr partis du décor, naviguant entre le désert de San Luis Potosi et la côte Pacifique, ils ne cessaient de me fasciner sur leur capacité à s'adapter et survivre à des conditions extrêmes.
                </motion.p>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  Après avoir passé ma thèse en 2010, participé à une quinzaine de colloques internationaux et effectué un post-doctorat à Marrakech, j'ai publié différents articles, ouvrages et chapitres de livres que vous retrouverez-ci-dessous. Certains sont disponibles gratuitement en ligne, d'autres sont à commander.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Second Section */}
      <motion.section 
        className="py-20 px-6 bg-[var(--card-bg)]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <motion.div 
              className="space-y-8"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-[var(--card-title)] mb-8">
                L'aventure <span className="text-[var(--accent)]">Atypic Cactus</span>
              </h2>
              
              <div className="space-y-6 text-lg leading-relaxed text-[var(--foreground)]">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Parallèlement, en 2007, nous avons planté avec mon cousin 6000m² de cactus en pleine terre sur la commune de Sainte Marie dans les Pyrénées-Orientales. Les cactus avaient été soigneusement sélectionnés afin de s'acclimater au sud de la France, les Trichocereus, les agaves, les yuccas et les Opuntias.
                </motion.p>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  Notre collection s'est tellement développée que nous avons décidé de créer une entreprise de vente et de plantation. En 2010, nous avons commencé à réaliser des jardins secs de cactus auprès de collectivités et de particuliers.
                </motion.p>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  En 2019, je me suis installé en tant qu'agriculteur, sur un nouveau terrain de 2 Hectares afin d'y créer la pépinière Atypic Cactus destinée à la vente en directe aux professionnels et aux particuliers. J'ai définitivement stoppé mes interventions d'enseignant à L'université de Perpignan afin de me consacrer totalement aux cactus, tout en gardant une activité de recherche anthropologique à travers la parution d'ouvrages et d'articles.
                </motion.p>
              </div>
            </motion.div>

            {/* Stats/Highlights */}
            <motion.div 
              className="grid grid-cols-2 gap-8"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div 
                className="text-center p-8 bg-[var(--background)] rounded-2xl shadow-lg"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="text-4xl font-bold text-[var(--accent)] mb-2">2007</div>
                <div className="text-[var(--foreground)] font-medium">Premiers plantations</div>
                <div className="text-sm text-[var(--foreground)] opacity-75 mt-2">6000m² en pleine terre</div>
              </motion.div>

              <motion.div 
                className="text-center p-8 bg-[var(--background)] rounded-2xl shadow-lg"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="text-4xl font-bold text-[var(--accent)] mb-2">2010</div>
                <div className="text-[var(--foreground)] font-medium">Thèse & Entreprise</div>
                <div className="text-sm text-[var(--foreground)] opacity-75 mt-2">Création de l'activité</div>
              </motion.div>

              <motion.div 
                className="text-center p-8 bg-[var(--background)] rounded-2xl shadow-lg"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <div className="text-4xl font-bold text-[var(--accent)] mb-2">2019</div>
                <div className="text-[var(--foreground)] font-medium">Atypic Cactus</div>
                <div className="text-sm text-[var(--foreground)] opacity-75 mt-2">Pépinière 2 hectares</div>
              </motion.div>

              <motion.div 
                className="text-center p-8 bg-[var(--background)] rounded-2xl shadow-lg"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <div className="text-4xl font-bold text-[var(--accent)] mb-2">15+</div>
                <div className="text-[var(--foreground)] font-medium">Colloques</div>
                <div className="text-sm text-[var(--foreground)] opacity-75 mt-2">Internationaux</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Quote Section */}
      <motion.section 
        className="py-20 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote 
            className="text-2xl md:text-3xl font-medium text-[var(--foreground)] italic leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            "Les cactus ne cessaient de me fasciner sur leur capacité à s'adapter et survivre à des conditions extrêmes."
          </motion.blockquote>
          <motion.div 
            className="w-24 h-1 bg-[var(--accent)] mx-auto mt-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          ></motion.div>
        </div>
      </motion.section>
    </div>
  );
} 