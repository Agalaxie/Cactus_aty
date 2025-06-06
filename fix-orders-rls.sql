-- Script pour corriger les politiques RLS de la table orders

-- 1. Supprimer les politiques existantes qui pourraient bloquer
DROP POLICY IF EXISTS "orders_policy" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;

-- 2. Créer des politiques plus permissives pour les commandes

-- Politique pour l'insertion (permettre à tout le monde d'insérer)
CREATE POLICY "orders_insert_policy" ON orders
    FOR INSERT
    WITH CHECK (true);

-- Politique pour la lecture (permettre aux utilisateurs de voir leurs propres commandes)
CREATE POLICY "orders_select_policy" ON orders
    FOR SELECT
    USING (
        -- Permettre à l'utilisateur connecté de voir ses commandes
        auth.uid() = user_id 
        OR 
        -- Permettre la lecture si pas d'utilisateur connecté (pour les commandes invités)
        auth.uid() IS NULL
    );

-- Politique pour la mise à jour (seulement l'utilisateur propriétaire)
CREATE POLICY "orders_update_policy" ON orders
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. S'assurer que RLS est activé
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Vérifier les politiques créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'orders'; 