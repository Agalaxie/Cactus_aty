-- Script SQL pour supprimer les doublons de la table products
-- Garde seulement les produits avec les bonnes catégories

-- 1. D'abord, créer une vue pour identifier les doublons
WITH product_rankings AS (
  SELECT 
    id,
    name,
    category,
    -- Attribuer un score de priorité basé sur la catégorie
    CASE 
      -- Agaves : priorité à "Agaves" et "Agaves et aloes"
      WHEN name ILIKE '%agave%' THEN
        CASE 
          WHEN category = 'Agaves' THEN 1
          WHEN category = 'Agaves et aloes' THEN 2
          ELSE 99
        END
      
      -- Aloes : priorité à "Aloes" et "Agaves et aloes"  
      WHEN name ILIKE '%aloe%' THEN
        CASE 
          WHEN category = 'Aloes' THEN 1
          WHEN category = 'Agaves et aloes' THEN 2
          ELSE 99
        END
      
      -- Yuccas : priorité à "Yuccas" et "Rostrata"
      WHEN name ILIKE '%yucca%' THEN
        CASE 
          WHEN category = 'Yuccas' THEN 1
          WHEN category = 'Rostrata' THEN 2
          WHEN category = 'Sujets exceptionnels' THEN 3
          ELSE 99
        END
      
      -- Dasylirions : priorité à "Dasylirions"
      WHEN name ILIKE '%dasylirion%' THEN
        CASE 
          WHEN category = 'Dasylirions' THEN 1
          ELSE 99
        END
      
      -- Senecio : priorité à "Aloes"
      WHEN name ILIKE '%senecio%' THEN
        CASE 
          WHEN category = 'Aloes' THEN 1
          ELSE 99
        END
      
      -- Cereus : priorité à "Cereus"
      WHEN name ILIKE '%cereus%' THEN
        CASE 
          WHEN category = 'Cereus' THEN 1
          WHEN category = 'Cactus' THEN 2
          ELSE 99
        END
      
      -- Echinocactus : priorité à "Echinocactus" puis "Cactus"
      WHEN name ILIKE '%echinocactus%' THEN
        CASE 
          WHEN category = 'Echinocactus' THEN 1
          WHEN category = 'Cactus' THEN 2
          ELSE 99
        END
      
      -- Opuntia : priorité à "Opuntia" puis "Cactus"
      WHEN name ILIKE '%opuntia%' THEN
        CASE 
          WHEN category = 'Opuntia' THEN 1
          WHEN category = 'Cactus' THEN 2
          ELSE 99
        END
      
      -- Pachycereus : priorité à "Pachycereus" puis "Cactus"
      WHEN name ILIKE '%pachycereus%' THEN
        CASE 
          WHEN category = 'Pachycereus' THEN 1
          WHEN category = 'Cactus' THEN 2
          ELSE 99
        END
      
      -- Mammillaria : priorité à "Mammillaria" puis "Cactus"
      WHEN name ILIKE '%mammillaria%' THEN
        CASE 
          WHEN category = 'Mammillaria' THEN 1
          WHEN category = 'Cactus' THEN 2
          ELSE 99
        END
      
      -- Cycas : priorité à "Sujets exceptionnels"
      WHEN name ILIKE '%cycas%' THEN
        CASE 
          WHEN category = 'Sujets exceptionnels' THEN 1
          ELSE 99
        END
      
      -- Autres cactus : priorité à "Cactus"
      ELSE
        CASE 
          WHEN category = 'Cactus' THEN 1
          WHEN category LIKE '%cactus%' THEN 2
          ELSE 3
        END
    END AS category_priority,
    
    -- Rang par nom (pour garder le plus récent en cas d'égalité)
    ROW_NUMBER() OVER (
      PARTITION BY name 
      ORDER BY 
        CASE 
          -- Priorité de catégorie
          WHEN name ILIKE '%agave%' THEN
            CASE 
              WHEN category = 'Agaves' THEN 1
              WHEN category = 'Agaves et aloes' THEN 2
              ELSE 99
            END
          WHEN name ILIKE '%aloe%' THEN
            CASE 
              WHEN category = 'Aloes' THEN 1
              WHEN category = 'Agaves et aloes' THEN 2
              ELSE 99
            END
          WHEN name ILIKE '%yucca%' THEN
            CASE 
              WHEN category = 'Yuccas' THEN 1
              WHEN category = 'Rostrata' THEN 2
              WHEN category = 'Sujets exceptionnels' THEN 3
              ELSE 99
            END
          WHEN name ILIKE '%dasylirion%' THEN
            CASE 
              WHEN category = 'Dasylirions' THEN 1
              ELSE 99
            END
          WHEN name ILIKE '%senecio%' THEN
            CASE 
              WHEN category = 'Aloes' THEN 1
              ELSE 99
            END
          WHEN name ILIKE '%cereus%' THEN
            CASE 
              WHEN category = 'Cereus' THEN 1
              WHEN category = 'Cactus' THEN 2
              ELSE 99
            END
          WHEN name ILIKE '%echinocactus%' THEN
            CASE 
              WHEN category = 'Echinocactus' THEN 1
              WHEN category = 'Cactus' THEN 2
              ELSE 99
            END
          WHEN name ILIKE '%opuntia%' THEN
            CASE 
              WHEN category = 'Opuntia' THEN 1
              WHEN category = 'Cactus' THEN 2
              ELSE 99
            END
          WHEN name ILIKE '%pachycereus%' THEN
            CASE 
              WHEN category = 'Pachycereus' THEN 1
              WHEN category = 'Cactus' THEN 2
              ELSE 99
            END
          WHEN name ILIKE '%mammillaria%' THEN
            CASE 
              WHEN category = 'Mammillaria' THEN 1
              WHEN category = 'Cactus' THEN 2
              ELSE 99
            END
          WHEN name ILIKE '%cycas%' THEN
            CASE 
              WHEN category = 'Sujets exceptionnels' THEN 1
              ELSE 99
            END
          ELSE
            CASE 
              WHEN category = 'Cactus' THEN 1
              ELSE 3
            END
        END,
        id ASC -- En cas d'égalité, garder le plus ancien ID
    ) AS row_rank
  FROM products
),

-- 2. Identifier les IDs à supprimer (tous sauf le premier de chaque groupe)
ids_to_delete AS (
  SELECT id
  FROM product_rankings
  WHERE row_rank > 1
)

-- 3. Supprimer les doublons
DELETE FROM products 
WHERE id IN (SELECT id FROM ids_to_delete);

-- 4. Vérification : afficher les produits restants groupés par nom
SELECT 
  name,
  COUNT(*) as count,
  STRING_AGG(id::text || ' (' || category || ')', ', ' ORDER BY id) as remaining_products
FROM products 
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY name; 