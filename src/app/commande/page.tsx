'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "../../components/Header";
import { useCart } from "../../contexts/CartContext";
import { stripePromise } from "../../lib/stripe-client";

interface FormData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  commentaires: string;
}

// Villes françaises populaires pour l'autocomplète
const VILLES_FRANCAISES = [
  'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier',
  'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Le Havre', 'Grenoble',
  'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Saint-Denis', 'Le Mans', 'Aix-en-Provence',
  'Clermont-Ferrand', 'Brest', 'Limoges', 'Tours', 'Amiens', 'Perpignan', 'Metz', 'Besançon',
  'Orléans', 'Caen', 'Mulhouse', 'Rouen', 'Nancy', 'Argenteuil', 'Saint-Paul', 'Montreuil',
  'Avignon', 'La Rochelle', 'Versailles', 'Poitiers', 'Courbevoie', 'Dunkerque', 'Pau',
  'Vitry-sur-Seine', 'Asnieres-sur-Seine', 'Colombes', 'Aulnay-sous-Bois', 'Rueil-Malmaison',
  'Antibes', 'Saint-Maur-des-Fossés', 'Champigny-sur-Marne', 'La Seyne-sur-Mer', 'Cannes',
  'Créteil', 'Boulogne-Billancourt', 'Calais', 'Bourges', 'Saint-Nazaire', 'Valence',
  'Ajaccio', 'Issy-les-Moulineaux', 'Levallois-Perret', 'Noisy-le-Grand', 'Quimper',
  'Villejuif', 'Neuilly-sur-Seine', 'Troyes', 'Antony', 'Pessac', 'Ivry-sur-Seine',
  'Clichy', 'Chambéry', 'Montauban', 'Lorient', 'Sarcelles', 'Meaux', 'Niort', 'Cholet'
];

export default function CommandePage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCart();
  
  // Calculer les frais de livraison (comme dans la page panier)
  const fraisLivraison = totalPrice >= 200 ? 0 : 15;
  const totalFinal = totalPrice + fraisLivraison;
  
  const [formData, setFormData] = useState<FormData>({
    // Informations personnelles
    prenom: '',
    nom: '',
    email: '',
    telephone: '+33 ',
    
    // Adresse de livraison
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'France',
    
    // Options
    commentaires: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [villeSuggestions, setVilleSuggestions] = useState<string[]>([]);
  const [showVilleSuggestions, setShowVilleSuggestions] = useState(false);

  // Auto-complétion des villes
  const handleVilleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, ville: value }));
    
    if (value.length >= 2) {
      const suggestions = VILLES_FRANCAISES.filter(ville =>
        ville.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setVilleSuggestions(suggestions);
      setShowVilleSuggestions(true);
    } else {
      setShowVilleSuggestions(false);
    }
  };

  const selectVille = (ville: string) => {
    setFormData(prev => ({ ...prev, ville }));
    setShowVilleSuggestions(false);
    setVilleSuggestions([]);
  };

  // Formatage du numéro de téléphone français
  const formatPhoneNumber = (value: string) => {
    // Supprimer tous les caractères non numériques sauf le +
    const cleanValue = value.replace(/[^\d+]/g, '');
    
    // Si on commence par +33, on garde
    if (cleanValue.startsWith('+33')) {
      const numbers = cleanValue.slice(3);
      if (numbers.length <= 9) {
        // Formater avec des espaces tous les 2 chiffres
        const formatted = numbers.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
        return '+33 ' + formatted.trim();
      }
    }
    
    // Si on commence par 0, on convertit en +33
    if (cleanValue.startsWith('0')) {
      const numbers = cleanValue.slice(1);
      if (numbers.length <= 9) {
        const formatted = numbers.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
        return '+33 ' + formatted.trim();
      }
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, telephone: formatted }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telephone') {
      handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
      return;
    }
    
    if (name === 'ville') {
      handleVilleChange(e as React.ChangeEvent<HTMLInputElement>);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur si le champ est maintenant rempli
    if (errors[name] && value.trim()) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validation des champs obligatoires
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.telephone.trim() || formData.telephone === '+33 ') newErrors.telephone = 'Le téléphone est requis';
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise';
    if (!formData.ville.trim()) newErrors.ville = 'La ville est requise';
    if (!formData.codePostal.trim()) newErrors.codePostal = 'Le code postal est requis';
    
    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation code postal français
    const cpRegex = /^[0-9]{5}$/;
    if (formData.codePostal && !cpRegex.test(formData.codePostal)) {
      newErrors.codePostal = 'Le code postal doit contenir 5 chiffres';
    }
    
    // Validation téléphone français
    const phoneRegex = /^\+33\s[1-9](\s\d{2}){4}$/;
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide (ex: +33 6 12 34 56 78)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (items.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Créer une session de paiement Stripe avec les infos client
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          customerEmail: formData.email,
          customerInfo: {
            name: `${formData.prenom} ${formData.nom}`,
            email: formData.email,
            phone: formData.telephone,
            address: {
              line1: formData.adresse,
              city: formData.ville,
              postal_code: formData.codePostal,
              country: 'FR',
            }
          }
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        alert(`Erreur : ${error}`);
        return;
      }

      // Rediriger vers Stripe Checkout avec les infos pré-remplies
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (error) {
          alert(`Erreur Stripe : ${error.message}`);
        }
      }
      
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      alert('Erreur lors du traitement du paiement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      {/* Breadcrumb */}
      <div className="py-6 px-4 max-w-6xl mx-auto w-full">
        <Link href="/" className="text-[var(--accent)] font-medium hover:underline transition-colors">
          ← Retour à l'accueil
        </Link>
      </div>

      {/* Contenu principal */}
      <main className="flex-1 py-10 px-4 bg-[var(--background)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-3xl font-bold mb-8 text-[var(--card-title)]">
                Finaliser votre commande
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
                {/* Informations personnelles */}
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)]">
                  <h2 className="text-xl font-semibold mb-4 text-[var(--card-title)]">
                    Informations personnelles
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        autoComplete="given-name"
                        className={`w-full p-3 rounded-xl border bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                          errors.prenom ? 'border-red-500' : 'border-[var(--border)]'
                        }`}
                        placeholder="Jean"
                      />
                      {errors.prenom && (
                        <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        autoComplete="family-name"
                        className={`w-full p-3 rounded-xl border bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                          errors.nom ? 'border-red-500' : 'border-[var(--border)]'
                        }`}
                        placeholder="Dupont"
                      />
                      {errors.nom && (
                        <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                        className={`w-full p-3 rounded-xl border bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                          errors.email ? 'border-red-500' : 'border-[var(--border)]'
                        }`}
                        placeholder="jean.dupont@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                        <span className="inline-flex items-center gap-2">
                          🇫🇷 Téléphone *
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        autoComplete="tel"
                        className={`w-full p-3 rounded-xl border bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                          errors.telephone ? 'border-red-500' : 'border-[var(--border)]'
                        }`}
                        placeholder="+33 6 12 34 56 78"
                      />
                      {errors.telephone && (
                        <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>
                      )}
                      <p className="text-xs text-[var(--foreground)] opacity-60 mt-1">
                        Format: +33 6 12 34 56 78
                      </p>
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)]">
                  <h2 className="text-xl font-semibold mb-4 text-[var(--card-title)]">
                    <span className="inline-flex items-center gap-2">
                      🇫🇷 Adresse de livraison en France
                    </span>
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                        Adresse *
                      </label>
                      <input
                        type="text"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                        autoComplete="street-address"
                        className={`w-full p-3 rounded-xl border bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                          errors.adresse ? 'border-red-500' : 'border-[var(--border)]'
                        }`}
                        placeholder="123 rue de la Paix"
                      />
                      {errors.adresse && (
                        <p className="text-red-500 text-xs mt-1">{errors.adresse}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                          Ville *
                        </label>
                        <input
                          type="text"
                          name="ville"
                          value={formData.ville}
                          onChange={handleInputChange}
                          onFocus={() => {
                            if (formData.ville.length >= 2) {
                              setShowVilleSuggestions(true);
                            }
                          }}
                          onBlur={() => {
                            // Délai pour permettre le clic sur une suggestion
                            setTimeout(() => setShowVilleSuggestions(false), 200);
                          }}
                          className={`w-full p-3 rounded-xl border bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                            errors.ville ? 'border-red-500' : 'border-[var(--border)]'
                          }`}
                          placeholder="Paris"
                          autoComplete="address-level2"
                        />
                        
                        {/* Suggestions de villes */}
                        {showVilleSuggestions && villeSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-lg max-h-40 overflow-y-auto">
                            {villeSuggestions.map((ville, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => selectVille(ville)}
                                className="w-full text-left px-4 py-2 hover:bg-[var(--accent)]/10 transition-colors text-[var(--card-title)] first:rounded-t-xl last:rounded-b-xl"
                              >
                                {ville}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {errors.ville && (
                          <p className="text-red-500 text-xs mt-1">{errors.ville}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                          Code postal *
                        </label>
                        <input
                          type="text"
                          name="codePostal"
                          value={formData.codePostal}
                          onChange={handleInputChange}
                          autoComplete="postal-code"
                          className={`w-full p-3 rounded-xl border bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                            errors.codePostal ? 'border-red-500' : 'border-[var(--border)]'
                          }`}
                          placeholder="75001"
                          maxLength={5}
                        />
                        {errors.codePostal && (
                          <p className="text-red-500 text-xs mt-1">{errors.codePostal}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                        Pays
                      </label>
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                        <span className="text-2xl">🇫🇷</span>
                        <span className="text-[var(--card-title)] font-medium">France</span>
                        <span className="text-xs text-[var(--foreground)] opacity-60 ml-auto">
                          Livraison uniquement en France métropolitaine
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commentaires optionnels */}
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)]">
                  <h2 className="text-xl font-semibold mb-4 text-[var(--card-title)]">
                    Informations complémentaires
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                      Commentaires (optionnel)
                    </label>
                    <textarea
                      name="commentaires"
                      value={formData.commentaires}
                      onChange={handleInputChange}
                      rows={4}
                      autoComplete="off"
                      className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                      placeholder="Instructions de livraison, questions particulières..."
                    />
                  </div>
                </div>

                {/* Bouton de validation */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                    isSubmitting || items.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[var(--accent)] text-white hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Redirection vers le paiement...
                    </span>
                  ) : (
                    <>
                      <span>💳</span>
                      Valider et payer
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Récapitulatif de commande */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:sticky lg:top-8 h-fit"
            >
              <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)]">
                <h2 className="text-xl font-semibold mb-6 text-[var(--card-title)]">
                  Récapitulatif de commande
                </h2>
                
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🛒</div>
                    <p className="text-[var(--foreground)] mb-4">Votre panier est vide</p>
                    <Link 
                      href="/" 
                      className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Continuer mes achats
                    </Link>
                  </div>
                ) : (
                  <>
                                         {/* Articles */}
                     <div className="space-y-4 mb-6">
                       {items.map((item) => (
                         <div key={item.id} className="flex items-center gap-4 p-4 bg-[var(--background)] rounded-xl">
                           <div className="w-15 h-15 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                             <span className="text-2xl">🌵</span>
                           </div>
                           <div className="flex-1 min-w-0">
                             <h3 className="font-medium text-[var(--card-title)] text-sm">
                               {item.product.name}
                             </h3>
                             {item.selectedVariant && (
                               <p className="text-xs text-[var(--foreground)] opacity-70">
                                 Taille: {item.selectedVariant.height}
                               </p>
                             )}
                             <div className="flex items-center gap-2 mt-2">
                               <button
                                 onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                 className="w-6 h-6 rounded-full bg-[var(--border)] text-[var(--card-title)] text-xs flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors"
                               >
                                 -
                               </button>
                               <span className="text-sm font-medium text-[var(--card-title)] w-6 text-center">
                                 {item.quantity}
                               </span>
                               <button
                                 onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                 className="w-6 h-6 rounded-full bg-[var(--border)] text-[var(--card-title)] text-xs flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors"
                               >
                                 +
                               </button>
                             </div>
                           </div>
                           <div className="text-right">
                             <p className="font-semibold text-[var(--card-title)]">
                               {((item.selectedVariant?.price || item.product.price) * item.quantity).toFixed(2)}€
                             </p>
                             <button
                               onClick={() => removeItem(item.id)}
                               className="text-red-500 text-xs hover:underline mt-1"
                             >
                               Supprimer
                             </button>
                           </div>
                         </div>
                       ))}
                    </div>

                    {/* Totaux */}
                    <div className="border-t border-[var(--border)] pt-4 space-y-3">
                      <div className="flex justify-between text-[var(--foreground)]">
                        <span>Sous-total</span>
                        <span>{totalPrice.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-[var(--foreground)]">
                        <span>Livraison</span>
                        <span>{fraisLivraison.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-[var(--card-title)] border-t border-[var(--border)] pt-3">
                        <span>Total</span>
                        <span>{totalFinal.toFixed(2)}€</span>
                      </div>
                    </div>

                    {/* Informations de livraison */}
                    <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-600 text-xl">🚚</span>
                        <div>
                          <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 text-sm">
                            Livraison 24H
                          </h3>
                          <p className="text-emerald-700 dark:text-emerald-300 text-xs mt-1">
                            Expédition sous 24H par transporteur spécialisé.
                            Suivi de livraison par SMS et email.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}