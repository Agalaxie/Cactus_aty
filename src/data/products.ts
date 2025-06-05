// Base de données des produits Atypic Cactus
// Import des produits réels depuis WooCommerce
import { importedProducts } from './imported-products';

export interface Product {
  id: string;
  name: string;
  latin?: string;
  category: CategoryType;
  basePrice: number;
  description: string;
  images: string[];
  details: string[];
  sizes: Size[];
  inStock: boolean;
  featured?: boolean;
  characteristics?: ProductCharacteristics;
}

export interface ProductCharacteristics {
  coldResistance: number; // Température minimale en °C
  matureSize: 'petit' | 'moyen' | 'grand' | 'géant';
  growthRate: 'lente' | 'moyenne' | 'rapide';
  careLevel: 'facile' | 'moyen' | 'difficile';
  sunExposure: 'plein-soleil' | 'mi-ombre' | 'ombre';
  flowering: boolean;
  indoorSuitable: boolean;
  outdoorSuitable: boolean;
  droughtTolerant: boolean;
  soilType: 'drainant' | 'standard' | 'humide';
}

export interface Size {
  id: string;
  label: string;
  multiplier: number;
}

export type CategoryType = 'agaves' | 'aloes' | 'boutures' | 'cactus' | 'yuccas' | 'sujets-exceptionnels';

export interface Category {
  id: CategoryType;
  name: string;
  description: string;
  icon: string;
  href: string;
}

export const categories: Category[] = [
  {
    id: 'agaves',
    name: 'Agaves',
    description: 'Agaves spectaculaires pour jardins modernes',
    icon: '🪴',
    href: '/categorie/agaves'
  },
  {
    id: 'aloes',
    name: 'Aloès',
    description: 'Aloès thérapeutiques et décoratifs',
    icon: '🌿',
    href: '/categorie/aloes'
  },
  {
    id: 'boutures',
    name: 'Boutures',
    description: 'Boutures et jeunes plants',
    icon: '🌱',
    href: '/categorie/boutures'
  },
  {
    id: 'cactus',
    name: 'Cactus',
    description: 'Collection exclusive de cactus majestueux',
    icon: '🌵',
    href: '/categorie/cactus'
  },
  {
    id: 'yuccas',
    name: 'Yuccas',
    description: 'Yuccas résistants et décoratifs',
    icon: '🌴',
    href: '/categorie/yuccas'
  },
  {
    id: 'sujets-exceptionnels',
    name: 'Sujets Exceptionnels',
    description: 'Spécimens rares et collectionneurs',
    icon: '⭐',
    href: '/categorie/sujets-exceptionnels'
  }
];

// Standard sizes for most products
const standardSizes: Size[] = [
  { id: 'small', label: 'Petit (S)', multiplier: 0.8 },
  { id: 'medium', label: 'Moyen (M)', multiplier: 1 },
  { id: 'large', label: 'Grand (L)', multiplier: 1.4 },
  { id: 'xlarge', label: 'Très Grand (XL)', multiplier: 1.8 }
];

// Utilisation des produits importés depuis WooCommerce
export const products: Product[] = importedProducts;

// Helper functions
export const getProductsByCategory = (categoryId: CategoryType): Product[] => {
  return products.filter(product => product.category === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getCategoryById = (id: CategoryType): Category | undefined => {
  return categories.find(category => category.id === id);
}; 