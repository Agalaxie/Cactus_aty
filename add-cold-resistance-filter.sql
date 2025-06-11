-- Migration pour ajouter le système de filtrage par résistance au froid
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Ajouter les colonnes de résistance au froid et taille
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS min_temperature INTEGER, -- Température minimale supportée en °C
ADD COLUMN IF NOT EXISTS max_temperature INTEGER, -- Température maximale supportée en °C
ADD COLUMN IF NOT EXISTS cold_resistance_zone VARCHAR(10), -- Zone de rusticité (ex: "9a", "8b", "10a")
ADD COLUMN IF NOT EXISTS winter_protection_needed BOOLEAN DEFAULT false, -- Protection hivernale nécessaire
ADD COLUMN IF NOT EXISTS size_category VARCHAR(20) DEFAULT 'moyen', -- Catégorie de taille: petit, moyen, grand
ADD COLUMN IF NOT EXISTS max_height_cm INTEGER, -- Hauteur maximale en cm
ADD COLUMN IF NOT EXISTS max_width_cm INTEGER; -- Largeur maximale en cm

-- 2. Commentaires pour clarifier les colonnes
COMMENT ON COLUMN products.min_temperature IS 'Température minimale supportée par la plante en °C';
COMMENT ON COLUMN products.max_temperature IS 'Température maximale supportée par la plante en °C';
COMMENT ON COLUMN products.cold_resistance_zone IS 'Zone de rusticité USDA (ex: 9a, 8b, 10a)';
COMMENT ON COLUMN products.winter_protection_needed IS 'Indique si la plante a besoin de protection hivernale';
COMMENT ON COLUMN products.size_category IS 'Catégorie de taille: petit, moyen, grand';
COMMENT ON COLUMN products.max_height_cm IS 'Hauteur maximale de la plante en cm';
COMMENT ON COLUMN products.max_width_cm IS 'Largeur maximale de la plante en cm';

-- 3. Créer des index pour optimiser les requêtes de filtrage
CREATE INDEX IF NOT EXISTS idx_products_min_temperature ON products(min_temperature);
CREATE INDEX IF NOT EXISTS idx_products_cold_resistance_zone ON products(cold_resistance_zone);
CREATE INDEX IF NOT EXISTS idx_products_size_category ON products(size_category);

-- 4. Exemples de mise à jour pour quelques produits typiques de cactus
-- (Ces valeurs peuvent être ajustées selon vos connaissances botaniques)

-- Cactus très résistants au froid
UPDATE products 
SET 
  min_temperature = -15,
  max_temperature = 40,
  cold_resistance_zone = '7a',
  winter_protection_needed = false
WHERE name ILIKE '%opuntia%' OR name ILIKE '%figuier de barbarie%';

-- Cactus moyennement résistants
UPDATE products 
SET 
  min_temperature = -5,
  max_temperature = 35,
  cold_resistance_zone = '9a',
  winter_protection_needed = true
WHERE name ILIKE '%echinocactus%' OR name ILIKE '%barrel%';

-- Agaves résistants
UPDATE products 
SET 
  min_temperature = -10,
  max_temperature = 40,
  cold_resistance_zone = '8a',
  winter_protection_needed = false
WHERE category = 'Agaves' OR name ILIKE '%agave%';

-- Aloès moins résistants
UPDATE products 
SET 
  min_temperature = 0,
  max_temperature = 35,
  cold_resistance_zone = '10a',
  winter_protection_needed = true
WHERE category = 'Aloès' OR name ILIKE '%aloe%';

-- Cactus d'intérieur/tropicaux
UPDATE products 
SET 
  min_temperature = 5,
  max_temperature = 30,
  cold_resistance_zone = '11a',
  winter_protection_needed = true
WHERE 
  min_temperature IS NULL 
  AND (
    name ILIKE '%cereus%' 
    OR name ILIKE '%mammillaria%'
    OR name ILIKE '%gymnocalycium%'
  );

-- 5. Valeurs par défaut pour les produits non encore mis à jour
UPDATE products 
SET 
  min_temperature = 0,
  max_temperature = 30,
  cold_resistance_zone = '10a',
  winter_protection_needed = true
WHERE min_temperature IS NULL;

-- 6. Mise à jour des catégories de taille selon les noms de produits
-- Petits cactus/plantes (généralement < 30cm)
UPDATE products 
SET 
  size_category = 'petit',
  max_height_cm = 25,
  max_width_cm = 20
WHERE 
  name ILIKE '%mini%' 
  OR name ILIKE '%small%'
  OR name ILIKE '%petit%'
  OR name ILIKE '%mammillaria%'
  OR name ILIKE '%gymnocalycium%';

-- Grands cactus/plantes (généralement > 100cm)  
UPDATE products 
SET 
  size_category = 'grand',
  max_height_cm = 200,
  max_width_cm = 150
WHERE 
  name ILIKE '%giant%'
  OR name ILIKE '%grand%'
  OR name ILIKE '%large%'
  OR name ILIKE '%cereus%'
  OR name ILIKE '%echinocactus grusonii%'
  OR name ILIKE '%opuntia%';

-- Moyens par défaut (30-100cm)
UPDATE products 
SET 
  size_category = 'moyen',
  max_height_cm = 60,
  max_width_cm = 40
WHERE size_category IS NULL OR size_category = 'moyen';

-- 6. Fonction pour obtenir la description de résistance au froid
CREATE OR REPLACE FUNCTION get_cold_resistance_description(min_temp INTEGER)
RETURNS TEXT AS $$
BEGIN
  CASE 
    WHEN min_temp >= 5 THEN RETURN 'Intérieur uniquement'
    WHEN min_temp >= 0 THEN RETURN 'Extérieur avec protection hivernale'
    WHEN min_temp >= -5 THEN RETURN 'Résistant aux légers gels'
    WHEN min_temp >= -10 THEN RETURN 'Résistant au froid modéré'
    WHEN min_temp >= -15 THEN RETURN 'Très résistant au froid'
    ELSE RETURN 'Extrêmement résistant au froid'
  END CASE;
END;
$$ LANGUAGE plpgsql; 