# Configuration Stripe

## 1. Créer un compte Stripe

1. Allez sur https://stripe.com
2. Créez un compte gratuit
3. Vérifiez votre email

## 2. Obtenir les clés API

1. Connectez-vous à votre dashboard Stripe
2. Allez dans "Développeurs" > "Clés API"
3. Copiez votre **clé publique** (commence par `pk_test_...`)
4. Copiez votre **clé secrète** (commence par `sk_test_...`)

## 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet cactus-shop :

```env
# Clé publique Stripe (visible côté client)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_ici

# Clé secrète Stripe (serveur uniquement)
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici

# Autres variables existantes...
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
```

## 4. Redémarrer le serveur

```bash
npm run dev
```

## 5. Tester le paiement

1. Ajoutez des produits au panier
2. Cliquez sur "Payer avec Stripe"
3. Utilisez les cartes de test Stripe :
   - **Succès** : 4242 4242 4242 4242
   - **Échec** : 4000 0000 0000 0002
   - Date d'expiration : toute date future
   - CVV : n'importe quel code 3 chiffres

## 6. Mode production

Pour passer en production :
1. Vérifiez votre compte Stripe
2. Remplacez les clés test par les clés live
3. Configurez les webhooks si nécessaire

## Notes importantes

- ⚠️ **JAMAIS** commiter les clés secrètes dans Git
- ✅ Le fichier `.env.local` est déjà dans `.gitignore`
- 🔒 Les clés test sont sûres pour le développement
- 💰 Aucune vraie transaction avec les clés test 