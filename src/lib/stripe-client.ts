import { loadStripe } from '@stripe/stripe-js';

// Clé publique Stripe (côté client uniquement)
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('La clé publique Stripe n\'est pas définie dans les variables d\'environnement');
}

// Instance Stripe côté client
export const stripePromise = loadStripe(stripePublishableKey); 