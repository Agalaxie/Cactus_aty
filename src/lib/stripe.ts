// Configuration Stripe côté serveur uniquement (pour les API routes)
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('La clé secrète Stripe n\'est pas définie dans les variables d\'environnement');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-05-28.basil', // Version API Stripe
}); 