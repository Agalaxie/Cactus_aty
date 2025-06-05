'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import DarkModeSwitch from "../../components/DarkModeSwitch";
import { useCart } from "../../components/CartContext";

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

export default function CommandePage() {
  const searchParams = useSearchParams();
  const { items, getTotalPrice, getTotalShipping, getFinalTotal, removeFromCart, updateQuantity } = useCart();
  
  const [formData, setFormData] = useState<FormData>({
    // Informations personnelles
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simuler l'envoi de la commande
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirection vers page de confirmation
      alert('Commande validée ! Vous allez recevoir un email de confirmation.');
      
    } catch (error) {
      alert('Erreur lors de la validation de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="w-full bg-[var(--background)] text-[var(--card-title)] flex items-center py-3 shadow-sm border-b border-[var(--border)] text-sm">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="Atypic Cactus"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center">
            <span className="hidden sm:block font-medium">Commande sécurisée</span>
            <DarkModeSwitch />
          </div>
        </div>
      </header>

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

              <form onSubmit={handleSubmit} className="space-y-6">
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
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-xl border bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                          errors.telephone ? 'border-red-500' : 'border-[var(--border)]'
                        }`}
                        placeholder="06 12 34 56 78"
                      />
                      {errors.telephone && (
                        <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)]">
                  <h2 className="text-xl font-semibold mb-4 text-[var(--card-title)]">
                    Adresse de livraison
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
                        className={`w-full p-3 rounded-xl border bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                          errors.adresse ? 'border-red-500' : 'border-[var(--border)]'
                        }`}
                        placeholder="123 rue de la Paix"
                      />
                      {errors.adresse && (
                        <p className="text-red-500 text-xs mt-1">{errors.adresse}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                          Code postal *
                        </label>
                        <input
                          type="text"
                          name="codePostal"
                          value={formData.codePostal}
                          onChange={handleInputChange}
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
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                          Ville *
                        </label>
                        <input
                          type="text"
                          name="ville"
                          value={formData.ville}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-xl border bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                            errors.ville ? 'border-red-500' : 'border-[var(--border)]'
                          }`}
                          placeholder="Paris"
                        />
                        {errors.ville && (
                          <p className="text-red-500 text-xs mt-1">{errors.ville}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--card-title)] mb-2">
                        Pays
                      </label>
                      <select
                        name="pays"
                        value={formData.pays}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Luxembourg">Luxembourg</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Commentaires */}
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)]">
                  <h2 className="text-xl font-semibold mb-4 text-[var(--card-title)]">
                    Commentaires (optionnel)
                  </h2>
                  <textarea
                    name="commentaires"
                    value={formData.commentaires}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--card-title)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    placeholder="Instructions de livraison, préférences..."
                  />
                </div>
              </form>
            </motion.div>

            {/* Récapitulatif commande */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:sticky lg:top-4"
            >
              <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)]">
                <h2 className="text-xl font-semibold mb-4 text-[var(--card-title)]">
                  Récapitulatif de commande ({items.length} article{items.length > 1 ? 's' : ''})
                </h2>

                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[var(--foreground)] opacity-75 mb-4">Votre panier est vide</p>
                    <Link href="/" className="text-[var(--accent)] hover:underline">
                      Continuer les achats
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-[var(--background)] rounded-xl">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            🌵
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-[var(--card-title)] text-sm truncate">{item.productName}</h3>
                            <p className="text-xs text-[var(--foreground)] opacity-75">
                              {item.size}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 rounded bg-[var(--card-bg)] border border-[var(--border)] text-xs hover:bg-[var(--accent)] hover:text-white"
                              >
                                -
                              </button>
                              <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 rounded bg-[var(--card-bg)] border border-[var(--border)] text-xs hover:bg-[var(--accent)] hover:text-white"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-auto text-red-500 hover:text-red-700 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-medium text-[var(--card-title)] text-sm">{item.totalPrice}€</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 mb-6 border-t border-[var(--border)] pt-4">
                      <div className="flex justify-between text-[var(--foreground)]">
                        <span>Sous-total</span>
                        <span>{getTotalPrice()}€</span>
                      </div>
                      <div className="flex justify-between text-[var(--foreground)]">
                        <span>Livraison</span>
                        <span className={getTotalShipping() === 0 ? "text-green-600 font-medium" : ""}>
                          {getTotalShipping() === 0 ? "Gratuite 🎉" : `${getTotalShipping()}€`}
                        </span>
                      </div>
                      {getTotalShipping() === 0 && getTotalPrice() >= 200 && (
                        <p className="text-xs text-green-600">
                          Livraison gratuite car commande ≥ 200€
                        </p>
                      )}
                      {getTotalShipping() > 0 && (
                        <p className="text-xs text-[var(--accent)]">
                          Livraison gratuite dès 200€ (encore {200 - getTotalPrice()}€)
                        </p>
                      )}
                      <div className="flex justify-between font-semibold text-[var(--card-title)] border-t border-[var(--border)] pt-2">
                        <span>Total TTC</span>
                        <span>{getFinalTotal()}€</span>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleSubmit}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting || items.length === 0}
                      className="w-full px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white rounded-2xl font-semibold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Validation..." : `Valider la commande • ${getFinalTotal()}€`}
                    </motion.button>

                    <p className="text-xs text-[var(--foreground)] opacity-75 mt-4 text-center">
                      🔒 Paiement sécurisé • Satisfaction garantie
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-[var(--foreground)] text-sm border-t border-[var(--border)] bg-[var(--background)]">
        © {new Date().getFullYear()} Atypic Cactus. Commande sécurisée.
      </footer>
    </div>
  );
}