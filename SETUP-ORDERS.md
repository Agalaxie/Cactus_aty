# 🛠️ Configuration du système de commandes et d'emails

## ⚠️ Actions requises pour activer les fonctionnalités

### 1. 📧 Configuration des emails (Resend)

Dans votre `.env.local`, ajoutez :

```bash
# Clé API Resend (gratuit sur resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email admin pour recevoir les notifications
ADMIN_EMAIL=votre-email@gmail.com

# URL du site (optionnel - détection automatique)
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

**📝 Étapes :**
1. Allez sur [resend.com](https://resend.com) et créez un compte gratuit
2. Vérifiez votre domaine (ou utilisez leur domaine de test)
3. Générez une clé API dans le dashboard
4. Ajoutez la clé dans votre `.env.local`

### 2. 🗄️ Création de la table des commandes

**Option A : Via le dashboard Supabase (Recommandé)**
1. Allez dans votre dashboard Supabase
2. Cliquez sur "SQL Editor"
3. Copiez-collez ce script :

```sql
-- Table pour stocker les commandes
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_address TEXT,
  total_amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'eur',
  payment_status VARCHAR(50) DEFAULT 'pending',
  order_status VARCHAR(50) DEFAULT 'confirmed',
  items JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Activer RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir leurs propres commandes
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Politique : Insertion permise
DROP POLICY IF EXISTS "Users can insert orders" ON orders;
CREATE POLICY "Users can insert orders" ON orders
  FOR INSERT WITH CHECK (true);
```

4. Exécutez le script en cliquant sur "Run"

**Option B : Via l'API (Alternative)**
Appelez : `POST http://localhost:3001/api/init-orders-table`

### 3. 🎯 Test du système

Après configuration :

1. **Test email** : Allez sur `http://localhost:3001/api/send-order-emails` (POST)
2. **Test table** : Allez sur `http://localhost:3001/api/user-orders` (GET)
3. **Test commande complète** : Passez une commande test

## ✅ Fonctionnalités activées

Une fois configuré, vous aurez :

### 📧 **Emails automatiques**
- ✅ Email de confirmation au client (avec récapitulatif)
- ✅ Email de notification à l'admin
- ✅ Templates HTML modernes et responsive
- ✅ Envoi automatique après chaque commande payée

### 🗄️ **Sauvegarde des commandes**
- ✅ Commandes stockées en base Supabase
- ✅ Lien avec l'utilisateur connecté (si applicable)
- ✅ Historique complet des achats
- ✅ Métadonnées Stripe sauvegardées

### 👤 **Espace client amélioré**
- ✅ Affichage des commandes dans l'espace client
- ✅ Détails complets de chaque commande
- ✅ Statuts de paiement et livraison
- ✅ Historique chronologique

## 🐛 Dépannage

### Emails non reçus ?
1. Vérifiez `RESEND_API_KEY` dans `.env.local`
2. Vérifiez les logs du serveur (`npm run dev`)
3. Testez avec l'API directement

### Commandes non affichées ?
1. Vérifiez que la table `orders` existe dans Supabase
2. Vérifiez que l'utilisateur est bien connecté
3. Vérifiez les politiques RLS dans Supabase

### Logs utiles
Regardez dans la console du serveur :
- ✅ "Commande sauvegardée avec succès"
- ✅ "Emails de confirmation envoyés avec succès"
- ❌ Toute erreur en rouge 