-- Ajouter la colonne variants pour gérer les tailles et prix multiples
ALTER TABLE products ADD COLUMN variants JSONB;

-- Exemple de mise à jour pour quelques produits (vous pourrez modifier dans l'interface Supabase)
UPDATE products 
SET variants = '[
  {"height": "30cm", "price": 29.99, "stock": 5},
  {"height": "40cm", "price": 39.99, "stock": 3},
  {"height": "50cm", "price": 49.99, "stock": 2}
]'::jsonb
WHERE id = 1;

UPDATE products 
SET variants = '[
  {"height": "20cm", "price": 24.99, "stock": 8},
  {"height": "30cm", "price": 34.99, "stock": 5},
  {"height": "40cm", "price": 44.99, "stock": 2}
]'::jsonb
WHERE id = 2;

-- Pour les produits sans variants, on peut garder le prix simple
-- La colonne 'price' servira de prix par défaut ou prix minimum

-- Index pour améliorer les performances des requêtes JSON
CREATE INDEX idx_products_variants ON products USING gin (variants); 