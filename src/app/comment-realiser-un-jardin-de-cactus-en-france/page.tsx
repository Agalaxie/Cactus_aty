'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';

interface Comment {
  id: number;
  author: string;
  email: string;
  date: string;
  content: string;
  replies?: Comment[];
}

export default function JardinCactusGuidePage() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Marie Dubois",
      email: "marie@email.com",
      date: "15 mars 2024",
      content: "Excellents conseils ! J'ai suivi vos recommandations pour mon jardin en Provence et les résultats sont spectaculaires. Mes cactus se développent parfaitement.",
      replies: [
        {
          id: 11,
          author: "Vincent Basset - Atypic",
          email: "info@atypic-cactus.com",
          date: "16 mars 2024",
          content: "Merci Marie ! Ravi que nos conseils vous aient été utiles. N'hésitez pas si vous avez d'autres questions."
        }
      ]
    },
    {
      id: 2,
      author: "Jean-Pierre Martin",
      email: "jp.martin@email.com", 
      date: "8 avril 2024",
      content: "Question sur la résistance au froid : mes Trichocereus pasacana peuvent-ils supporter l'hiver en région parisienne ? Faut-il les protéger ?"
    },
    {
      id: 3,
      author: "Sophie Laurent",
      email: "sophie.l@email.com",
      date: "22 mai 2024",
      content: "Merci pour ces conseils détaillés ! J'ai créé un petit jardin de cactus sur ma terrasse en suivant vos étapes. Le drainage avec le gravier fait vraiment la différence."
    }
  ]);

  const [newComment, setNewComment] = useState({
    author: '',
    email: '',
    content: ''
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.author && newComment.email && newComment.content) {
      const comment: Comment = {
        id: Date.now(),
        author: newComment.author,
        email: newComment.email,
        date: new Date().toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        content: newComment.content
      };
      setComments([...comments, comment]);
      setNewComment({ author: '', email: '', content: '' });
      alert('Commentaire ajouté avec succès !');
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      {/* Breadcrumb */}
      <div className="py-6 px-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-[var(--accent)] hover:underline">
            Accueil
          </Link>
          <span className="text-[var(--foreground)]">/</span>
          <Link href="/conseils" className="text-[var(--accent)] hover:underline">
            Conseils
          </Link>
          <span className="text-[var(--foreground)]">/</span>
          <span className="text-[var(--foreground)]">Réaliser un jardin de cactus</span>
        </div>
      </div>

      {/* Article principal */}
      <main className="flex-1 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden"
          >
            {/* En-tête de l'article */}
            <div className="p-8 border-b border-[var(--border)]">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-3xl sm:text-4xl font-bold text-[var(--card-title)] mb-4"
              >
                Réaliser un jardin de cactus en 6 étapes
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="flex items-center gap-4 text-sm text-[var(--foreground)] opacity-75"
              >
                <span>Par <strong>Vincent Basset - Atypic</strong></span>
                <span>•</span>
                <span>Dernière mise à jour : juin 2024</span>
                <span>•</span>
                <span>⏱️ 8 min de lecture</span>
              </motion.div>
            </div>

            {/* Image principale */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="relative h-64 sm:h-80 overflow-hidden"
            >
              <Image
                src="/Jardin de cactus Pachycereus Pringlei avant de mettre le gravier de décoration.jpg"
                alt="Jardin de cactus Pachycereus Pringlei avant décoration"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-lg font-medium">
                    Guide complet pour créer votre jardin de cactus
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contenu de l'article */}
            <div className="p-8 space-y-8">
              
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="prose prose-lg max-w-none"
              >
                <p className="text-lg text-[var(--foreground)] leading-relaxed">
                  Créer un jardin de cactus nécessite une approche spécifique mais accessible à tous. 
                  Suivez ce guide détaillé pour réussir votre aménagement et profiter de plantes spectaculaires 
                  nécessitant peu d&apos;entretien.
                </p>
              </motion.div>

              {/* Étape 1 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-2xl font-bold text-[var(--card-title)]">Préparation du sol</h2>
                </div>
                <div className="pl-11 space-y-4 text-[var(--foreground)] leading-relaxed">
                  <p>
                    Toute plantation de cactus et autres plantes désertiques doit être effectuée dans un sol drainant. 
                    Bien souvent, les cactus sont plantés dans n&apos;importe quelle terre et les clients s&apos;étonnent qu&apos;ils 
                    ne poussent pas ou qu&apos;ils périclitent.
                  </p>
                  <p>
                    Il y a très peu d&apos;entretien en terme d&apos;arrosage ou de traitement mais une chose importante se doit 
                    d&apos;être observée : <strong>la nature du sol</strong>.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">💡 Conseil d&apos;expert</h4>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Mélangez 50% de terre végétale criblée + 50% de gravier type grain de riz, 
                      ou utilisez du terreau spécial cactus pour un résultat optimal.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Étape 2 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-2xl font-bold text-[var(--card-title)]">Préparation du terrain</h2>
                </div>
                <div className="pl-11 space-y-4 text-[var(--foreground)] leading-relaxed">
                  <p>
                    Prévoir un terrain avec un minimum de <strong>5-6 heures d&apos;ensoleillement</strong>, 
                    l&apos;ombrage ne gêne nullement le cactus à pousser. Les cactus supportent aussi bien le plein vent.
                  </p>
                  <p>
                    En effet, j&apos;ai planté plusieurs cactus sur des ronds-points dans le sud de la France avec des vents 
                    à 120km/h, le vent ne les a pas empêché de bien pousser.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🏡 Jardin intérieur</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Vous pouvez aussi créer un jardin intérieur. Consultez notre galerie pour découvrir 
                      nos créations d&apos;intérieur et bénéficier d&apos;une sélection de plantes par un spécialiste.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Étape 3 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-2xl font-bold text-[var(--card-title)]">Sélection de plantes adaptées</h2>
                </div>
                <div className="pl-11 space-y-4 text-[var(--foreground)] leading-relaxed">
                  <p>
                    Choisissez les plantes selon la rusticité de votre climat. Les <strong>Trichocereus pasacana</strong> 
                    et <strong>validus</strong> peuvent résister à des <strong>-15°C</strong>.
                  </p>
                  <p>
                    J&apos;ai sélectionné toute une gamme de plantes pouvant être cultivée en France. 
                    J&apos;ai des clients qui ont réalisé des jardins de cactus un peu partout en France, 
                    alors n&apos;hésitez pas, lancez-vous !
                  </p>
                  
                  {/* Image sélection de plantes */}
                  <div className="my-6 rounded-xl overflow-hidden">
                    <Image
                      src="/Sélection de plantes adaptées.jpg"
                      alt="Sélection de plantes adaptées au climat français"
                      width={800}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    <p className="text-sm text-[var(--foreground)] opacity-75 mt-2 text-center italic">
                      Sélection de cactus et plantes grasses adaptés au climat français
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">❄️ Résistants au froid</h4>
                      <ul className="text-orange-700 dark:text-orange-300 text-sm space-y-1">
                        <li>• Trichocereus pasacana (-15°C)</li>
                        <li>• Trichocereus validus (-15°C)</li>
                        <li>• Agave parryi (-20°C)</li>
                        <li>• Yucca rostrata (-18°C)</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">☀️ Climat doux</h4>
                      <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                        <li>• Ferocactus (0°C)</li>
                        <li>• Echinocactus (-5°C)</li>
                        <li>• Cleistocactus (-8°C)</li>
                        <li>• Opuntia (-10°C)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Étape 4 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.7 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <h2 className="text-2xl font-bold text-[var(--card-title)]">Idées de composition</h2>
                </div>
                <div className="pl-11 space-y-4 text-[var(--foreground)] leading-relaxed">
                  <p>Selon le style de votre maison, vous choisirez la composition idéale. Voici les principaux styles :</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-[var(--card-bg)] border border-[var(--border)] p-4 rounded-xl">
                        <h4 className="font-semibold text-[var(--card-title)] mb-2">🏜️ Jardin Californien</h4>
                        <p className="text-sm">Beaucoup de succulentes, yuccas et roches ocre</p>
                      </div>
                      <div className="bg-[var(--card-bg)] border border-[var(--border)] p-4 rounded-xl">
                        <h4 className="font-semibold text-[var(--card-title)] mb-2">🏛️ Jardin Contemporain</h4>
                        <p className="text-sm">Répétitif, épuré et élégant</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-[var(--card-bg)] border border-[var(--border)] p-4 rounded-xl">
                        <h4 className="font-semibold text-[var(--card-title)] mb-2">🌺 Jardin Exotique</h4>
                        <p className="text-sm">Massifs mêlant formes exubérantes et strictes</p>
                      </div>
                      <div className="bg-[var(--card-bg)] border border-[var(--border)] p-4 rounded-xl">
                        <h4 className="font-semibold text-[var(--card-title)] mb-2">🌊 Jardin Méditerranéen</h4>
                        <p className="text-sm">Succulentes, agaves, aloès endémiques</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Étape 5 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.7 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold">5</div>
                  <h2 className="text-2xl font-bold text-[var(--card-title)]">Plantation</h2>
                </div>
                <div className="pl-11 space-y-4 text-[var(--foreground)] leading-relaxed">
                  <p>
                    Une fois le géo-textile posé et le type de composition choisi, entaillez la bâche au cutter 
                    en forme de croix, et creusez pour y planter le cactus.
                  </p>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">⚠️ Important</h4>
                    <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                      <li>• Plantez de mars à octobre-novembre</li>
                      <li>• Utilisez des gants spécialisés</li>
                      <li>• Enveloppez dans du carton pour la manipulation</li>
                      <li>• <strong>Ne jamais arroser à la plantation</strong></li>
                    </ul>
                  </div>
                  <p>
                    Il s&apos;enracinera en moins d&apos;un mois. Pour les plantes de taille moyenne, 
                    arrosez au jet d&apos;eau une fois par semaine durant les mois les plus chauds.
                  </p>
                </div>
              </motion.section>

              {/* Étape 6 */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.7 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold">6</div>
                  <h2 className="text-2xl font-bold text-[var(--card-title)]">Décoration</h2>
                </div>
                <div className="pl-11 space-y-4 text-[var(--foreground)] leading-relaxed">
                  <p>
                    Les éléments de décoration sont multiples : placez les beaux galets et rochers, 
                    puis déposez le gravier, la roche volcanique ou l&apos;ardoise en jouant sur la granulométrie.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">💎 Citation d&apos;expert</h4>
                    <p className="text-green-700 dark:text-green-300 text-sm italic">
                      &quot;Une belle roche remplace une plante&quot; - Vincent Basset
                    </p>
                  </div>
                  <p>
                    Arrosez le gravier afin de faire descendre la poussière, vous n&apos;avez plus qu&apos;à vous asseoir et admirer !
                  </p>
                  
                  {/* Images de décoration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="rounded-xl overflow-hidden">
                      <Image
                        src="/composition_gravier-blanc.jpg"
                        alt="Composition avec gravier blanc pour décoration"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                      <p className="text-sm text-[var(--foreground)] opacity-75 mt-2 text-center italic">
                        Composition élégante avec gravier blanc
                      </p>
                    </div>
                    <div className="rounded-xl overflow-hidden">
                      <Image
                        src="/Combinaison de gravier blanc et noir, et gabion en pierre blanche prévue en haut du talus.jpg"
                        alt="Combinaison de gravier blanc et noir avec gabion"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                      <p className="text-sm text-[var(--foreground)] opacity-75 mt-2 text-center italic">
                        Combinaison de gravier blanc et noir avec gabion en pierre blanche
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Call to action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.7 }}
                className="bg-gradient-to-r from-[var(--accent)]/10 to-green-500/10 p-6 rounded-xl border border-[var(--accent)]/20"
              >
                <h3 className="text-xl font-bold text-[var(--card-title)] mb-3">
                  Besoin d&apos;aide pour votre projet ?
                </h3>
                <p className="text-[var(--foreground)] mb-4">
                  Vincent Basset vous accompagne dans la réalisation de votre jardin de cactus. 
                  Conseil personnalisé, sélection de plantes adaptées à votre région.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/qui-suis-je"
                    className="inline-flex items-center justify-center px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    📞 Nous contacter
                  </Link>
                  <Link
                    href="/categorie/cactus"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-[var(--accent)] text-[var(--accent)] rounded-xl font-semibold hover:bg-[var(--accent)] hover:text-white transition-all"
                  >
                    🌵 Voir nos cactus
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.article>

          {/* Section commentaires */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="mt-12 bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] p-8"
          >
            <h2 className="text-2xl font-bold text-[var(--card-title)] mb-6">
              Commentaires ({comments.length})
            </h2>

            {/* Formulaire de commentaire */}
            <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={newComment.author}
                    onChange={(e) => setNewComment({...newComment, author: e.target.value})}
                    required
                    className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newComment.email}
                    onChange={(e) => setNewComment({...newComment, email: e.target.value})}
                    required
                    className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                  Commentaire *
                </label>
                <textarea
                  value={newComment.content}
                  onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                  required
                  rows={4}
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                  placeholder="Partagez votre expérience, posez vos questions..."
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Publier le commentaire
              </button>
            </form>

            {/* Liste des commentaires */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border border-[var(--border)] rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[var(--card-title)]">{comment.author}</h4>
                      <p className="text-sm text-[var(--foreground)] opacity-75">{comment.date}</p>
                    </div>
                  </div>
                  <p className="text-[var(--foreground)] leading-relaxed mb-4">{comment.content}</p>
                  
                  {/* Réponses */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 border-l-2 border-[var(--accent)]/20 pl-6 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-[var(--accent)]/5 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-semibold text-[var(--accent)]">{reply.author}</h5>
                              <p className="text-xs text-[var(--foreground)] opacity-75">{reply.date}</p>
                            </div>
                          </div>
                          <p className="text-[var(--foreground)] text-sm leading-relaxed">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
} 