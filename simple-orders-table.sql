-- Script SQL simplifié pour créer la table orders
-- Compatible avec toutes les versions de Supabase

-- 1. Créer la table orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID,
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

-- 3. Activer RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert orders" ON orders;
DROP POLICY IF EXISTS "Public can insert orders" ON orders;

-- 5. Politiques simples et compatibles
-- Politique 1: Les utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR user_id IS NULL
  );

-- Politique 2: Tout le monde peut insérer des commandes
CREATE POLICY "Public can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- 6. Accorder les permissions
GRANT SELECT, INSERT ON orders TO authenticated;
GRANT SELECT, INSERT ON orders TO anon;
GRANT ALL ON orders TO service_role;

-- 7. Fonction pour updated_at (optionnelle)
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger pour updated_at
DROP TRIGGER IF EXISTS trigger_update_orders_updated_at ON orders;
CREATE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at(); 