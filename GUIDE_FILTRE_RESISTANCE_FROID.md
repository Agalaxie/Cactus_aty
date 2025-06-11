# Guide : Système de Filtrage par Résistance au Froid et Taille

## 🎯 Fonctionnalités Implémentées

### 1. Base de Données
- ✅ **Nouvelles colonnes** dans la table `products` :
  - `min_temperature` : Température minimale supportée (°C)
  - `max_temperature` : Température maximale supportée (°C)
  - `cold_resistance_zone` : Zone de rusticité USDA (ex: "9a", "8b", "10a")
  - `winter_protection_needed` : Protection hivernale nécessaire (booléen)
  - `size_category` : Catégorie de taille (petit, moyen, grand)
  - `max_height_cm` : Hauteur maximale en cm
  - `max_width_cm` : Largeur maximale en cm

- ✅ **Index de performance** pour optimiser les requêtes de filtrage
- ✅ **Fonction SQL** pour obtenir des descriptions automatiques
- ✅ **Données d'exemple** pour différents types de cactus/agaves/aloès

### 2. Interface Utilisateur
- ✅ **Composant ProductFilters** : Filtres combinés pour pages de catégories
- ✅ **Composant ProductBadges** : Icônes sur vignettes et fiches produits
- ✅ **Page dédiée** : `/resistance-au-froid` avec filtrage avancé
- ✅ **Intégration pages catégories** : Filtres directement sur `/categorie/[category]`
- ✅ **Navigation** : Liens ajoutés dans le header (desktop + mobile)
- ✅ **API routes** : `/api/products-filtered` et `/api/products-by-cold-resistance`

### 3. Fonctionnalités
- ✅ **Filtrage par température minimale** (7 plages prédéfinies)
- ✅ **Filtrage par taille** (petit, moyen, grand)
- ✅ **Filtrage combiné** température + taille + catégorie
- ✅ **Badges visuels** sur toutes les vignettes produits
- ✅ **Descriptions automatiques** selon la résistance
- ✅ **Indicateurs visuels** protection hivernale
- ✅ **Guide utilisateur** avec zones climatiques françaises

## 🚀 Installation

### Étape 1 : Migration Base de Données
1. Connectez-vous à votre dashboard Supabase
2. Allez dans l'éditeur SQL
3. Exécutez le fichier `add-cold-resistance-filter.sql`

```sql
-- Le script va :
-- 1. Ajouter les 4 nouvelles colonnes
-- 2. Créer les index de performance
-- 3. Remplir avec des données d'exemple
-- 4. Créer la fonction helper
```

### Étape 2 : Vérification
```sql
-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('min_temperature', 'max_temperature', 'cold_resistance_zone', 'winter_protection_needed');

-- Vérifier les données
SELECT name, min_temperature, cold_resistance_zone, winter_protection_needed 
FROM products 
WHERE min_temperature IS NOT NULL 
LIMIT 10;
```

## 🌡️ Utilisation

### Accès Public
- **URL directe** : `https://votre-site.com/resistance-au-froid`
- **Via navigation** : Menu "🌡️ Résistance au froid"

### Filtres Disponibles
1. **Intérieur uniquement** (5°C+) - Plantes d'intérieur
2. **Avec protection** (0°C à 4°C) - Protection hivernale requise
3. **Légers gels** (-5°C à -1°C) - Résistant aux légers gels
4. **Froid modéré** (-10°C à -6°C) - Résistant au froid modéré
5. **Très résistant** (-15°C à -11°C) - Très résistant au froid
6. **Extrêmement résistant** (-16°C-) - Résistant aux grands froids

### API Usage
```javascript
// Tous les produits résistants à -10°C minimum
GET /api/products-by-cold-resistance?minTemperature=-10

// Agaves résistants à -5°C minimum
GET /api/products-by-cold-resistance?minTemperature=-5&category=Agaves

// Limiter à 20 résultats
GET /api/products-by-cold-resistance?minTemperature=0&limit=20
```

## 📊 Données d'Exemple Intégrées

### Opuntia (Figuiers de Barbarie)
- **Résistance** : -15°C
- **Zone** : 7a
- **Protection** : Non requise

### Echinocactus
- **Résistance** : -5°C  
- **Zone** : 9a
- **Protection** : Recommandée

### Agaves
- **Résistance** : -10°C
- **Zone** : 8a
- **Protection** : Généralement non

### Aloès
- **Résistance** : 0°C
- **Zone** : 10a
- **Protection** : Oui

## 🛠️ Personnalisation

### Ajouter des Données
```sql
-- Mettre à jour un produit spécifique
UPDATE products 
SET 
  min_temperature = -12,
  max_temperature = 35,
  cold_resistance_zone = '8a',
  winter_protection_needed = false
WHERE id = 123;
```

### Modifier les Plages de Filtre
Éditez le fichier `src/components/ColdResistanceFilter.tsx` :

```typescript
const TEMPERATURE_RANGES = [
  { label: 'Ma nouvelle plage', value: -25, description: 'Description' },
  // ... autres plages
];
```

## 🎨 Intégration dans d'Autres Pages

### ProductList.tsx
```typescript
import { Product } from '@/types/product';

// Le type Product inclut maintenant :
// min_temperature?: number;
// max_temperature?: number; 
// cold_resistance_zone?: string;
// winter_protection_needed?: boolean;
```

### Composant ColdResistanceFilter
```typescript
import ColdResistanceFilter from '@/components/ColdResistanceFilter';

<ColdResistanceFilter 
  onFilterChange={(temp) => setMinTemp(temp)}
  currentFilter={minTemp}
/>
```

## 🌍 Zones Climatiques France

| Zone | Températures | Régions |
|------|-------------|---------|
| Nord/Est | -10°C à -15°C | Lille, Strasbourg, Nancy |
| Centre | -5°C à -10°C | Paris, Orléans, Dijon |
| Ouest/Sud-Ouest | 0°C à -5°C | Nantes, Bordeaux, Toulouse |
| Méditerranée | 0°C à 5°C | Nice, Montpellier, Marseille |

## ✅ Tests à Effectuer

1. **Navigation** : Vérifier les liens dans le header
2. **Filtrage** : Tester chaque plage de température
3. **Combinaisons** : Température + catégorie
4. **Responsive** : Mobile et desktop
5. **Performance** : Temps de réponse avec filtres
6. **Données** : Vérifier les descriptions automatiques

## 🔧 Maintenance

### Ajouter Nouvelles Plantes
1. Rechercher les données botaniques fiables
2. Mettre à jour via SQL ou interface admin
3. Tester le filtrage

### Optimisations Futures
- Cache Redis pour les requêtes fréquentes
- Filtrage par plage de température (min-max)
- Cartes interactives des zones climatiques
- Recommandations personnalisées par localisation

---

**Le système est maintenant prêt ! 🎉**
Les utilisateurs peuvent filtrer les plantes selon leur climat local et faire des choix éclairés pour leur jardin ou terrasse. 