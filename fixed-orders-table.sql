-- Script corrigé pour créer la table orders dans Supabase
-- Étapes à suivre dans le dashboard Supabase SQL Editor

-- 1. D'abord, créer la table sans la contrainte de clé étrangère
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID, -- Pas de contrainte pour l'instant
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

-- 2. Créer les index
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 3. Activer RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Créer les politiques RLS
-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert orders" ON orders;
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;

-- Politique : Les utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id IS NULL OR
    auth.email() = customer_email
  );

-- Politique : Insertion permise pour tous (avec vérification côté application)
CREATE POLICY "Users can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Politique : Service role peut tout faire
CREATE POLICY "Service role can manage orders" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 5. Accorder les permissions nécessaires
GRANT SELECT, INSERT ON orders TO authenticated;
GRANT SELECT, INSERT ON orders TO anon;
GRANT ALL ON orders TO service_role;

-- 6. Créer une fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Créer le trigger
DROP TRIGGER IF EXISTS trigger_update_orders_updated_at ON orders;
CREATE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();