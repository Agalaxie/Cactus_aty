# 📧 Configuration Email avec Resend

## 🚨 Problème actuel
Les emails utilisent `atypic-cactus.fr` qui n'est **pas vérifié** dans Resend, causant des erreurs 403/428.

## ✅ Solution temporaire (déjà appliquée)
- Utilisation de `onboarding@resend.dev` (domaine vérifié par défaut)
- Les emails fonctionnent immédiatement

## 🎯 Solution définitive pour un domaine personnalisé

### Étape 1 : Vérifier votre domaine dans Resend

1. **Connectez-vous à Resend** : https://resend.com/domains
2. **Ajoutez votre domaine** : `atypic-cactus.fr`
3. **Configurez les enregistrements DNS** :

```dns
Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10

Type: TXT
Name: @
Value: "v=spf1 include:amazonses.com ~all"

Type: TXT
Name: _dmarc
Value: "v=DMARC1; p=quarantine; rua=mailto:admin@atypic-cactus.fr"

Type: CNAME
Name: [clé-fournie-par-resend]
Value: [valeur-fournie-par-resend]
```

### Étape 2 : Attendre la vérification (24-48h)

### Étape 3 : Modifier le code

Une fois le domaine vérifié, changez dans `send-order-emails/route.ts` :

```typescript
// De :
from: 'Atypic Cactus <onboarding@resend.dev>',

// Vers :
from: 'Atypic Cactus <noreply@atypic-cactus.fr>',
```

## 🔍 Codes d'erreur Resend

- **403 Forbidden** : Domaine non vérifié
- **428 Precondition Required** : Configuration DNS manquante
- **429 Too Many Requests** : Limite de taux (plan gratuit : 100 emails/jour)

## 📋 Variables d'environnement requises

```env
RESEND_API_KEY=re_xxxxxxxxx
ADMIN_EMAIL=stephdumaz@gmail.com
```

## 🧪 Test

Utilisez `/debug` pour tester l'envoi d'emails après chaque modification. 