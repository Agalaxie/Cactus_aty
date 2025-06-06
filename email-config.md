# Configuration du système d'emails

## Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env.local` :

```bash
# Clé API Resend (gratuit jusqu'à 3000 emails/mois)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email de l'administrateur pour recevoir les notifications de commandes
ADMIN_EMAIL=admin@votre-domaine.com

# URL de votre site (optionnel - détection automatique)
# En local : laissez vide ou mettez http://localhost:3001
# En production : mettez votre URL Vercel
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

## Configuration Resend

1. Créez un compte gratuit sur [resend.com](https://resend.com)
2. Vérifiez votre domaine ou utilisez le domaine de test
3. Générez une clé API dans le dashboard
4. Ajoutez la clé dans `RESEND_API_KEY`

## Fonctionnalités

✅ **Email client** : Confirmation de commande avec récapitulatif
✅ **Email admin** : Notification de nouvelle commande
✅ **Templates modernes** : Design responsive et professionnel
✅ **Gestion d'erreurs** : Les emails n'interrompent pas le processus de commande
✅ **Envoi automatique** : Déclenché après validation du paiement

## Emails envoyés

### Pour le client :
- ✅ Confirmation de commande
- 📦 Numéro de suivi (à implémenter)
- 🚚 Livraison effectuée (à implémenter)

### Pour l'admin :
- 🛒 Nouvelle commande reçue
- ⚡ Action requise (préparation/expédition)

## Personnalisation

Les templates d'emails sont dans `/api/send-order-emails/route.ts` et peuvent être personnalisés selon vos besoins. 