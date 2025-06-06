-- Script pour corriger les politiques RLS de la table orders
-- Exécuter dans le SQL Editor de Supabase

-- Supprimer l'ancienne politique
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

-- Créer une nouvelle politique plus flexible
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    -- Utilisateur connecté peut voir ses commandes par user_id
    auth.uid() = user_id 
    OR 
    -- Utilisateur connecté peut voir ses commandes par email
    (auth.email() = customer_email AND auth.email() IS NOT NULL)
    OR
    -- Commandes sans user_id mais avec email correspondant
    (user_id IS NULL AND auth.email() = customer_email AND auth.email() IS NOT NULL)
  );

-- Mettre à jour la commande existante pour la lier à l'utilisateur
-- (Remplacez l'email par le vôtre si différent)
UPDATE orders 
SET user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'stephdumaz@gmail.com' 
  LIMIT 1
)
WHERE customer_email = 'stephdumaz@gmail.com' 
AND user_id IS NULL; 