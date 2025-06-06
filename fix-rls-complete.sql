-- Script SQL complet pour corriger les politiques RLS
-- Copiez-collez EXACTEMENT ce script dans Supabase SQL Editor

-- 1. Supprimer l'ancienne politique
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

-- 2. Créer la nouvelle politique (SCRIPT COMPLET)
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id 
    OR 
    (auth.email() = customer_email AND auth.email() IS NOT NULL)
    OR
    (user_id IS NULL AND auth.email() = customer_email AND auth.email() IS NOT NULL)
  );

-- 3. Lier votre commande existante à votre utilisateur
UPDATE orders 
SET user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'stephdumaz@gmail.com' 
  LIMIT 1
)
WHERE customer_email = 'stephdumaz@gmail.com' 
AND user_id IS NULL; 