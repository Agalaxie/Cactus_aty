-- Script SQL de PREVIEW pour voir les doublons qui seront supprimés
-- NE SUPPRIME RIEN, juste affiche ce qui sera fait

WITH product_rankings AS (
  SELECT 
    id,
    name,
    category,
    price,
    -- Rang par nom avec priorité de catégorie
    ROW_NUMBER() OVER (
      PARTITION BY name 
      ORDER BY 
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
              ELSE 3
            END
        END,
        id ASC -- En cas d'égalité, garder le plus ancien ID
    ) AS row_rank
  FROM products
)

-- Afficher ce qui sera GARDE (row_rank = 1)
SELECT 
  '✅ GARDER' as action,
  id,
  name,
  category,
  price,
  row_rank
FROM product_rankings 
WHERE row_rank = 1 
  AND name IN (
    SELECT name 
    FROM product_rankings 
    GROUP BY name 
    HAVING COUNT(*) > 1
  )

UNION ALL

-- Afficher ce qui sera SUPPRIME (row_rank > 1)
SELECT 
  '🗑️ SUPPRIMER' as action,
  id,
  name,
  category,
  price,
  row_rank
FROM product_rankings 
WHERE row_rank > 1

ORDER BY name, row_rank; 