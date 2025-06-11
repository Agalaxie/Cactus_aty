export interface ProductVariant {
  height: string; // ex: "30cm", "40cm", "50cm"
  price: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // Prix de base ou prix minimum
  stock_quantity: number;
  category: string;
  image_url?: string;
  variants?: ProductVariant[]; // Tailles multiples avec prix différents
  created_at?: string;
  // Nouvelles propriétés pour la résistance au froid
  min_temperature?: number; // Température minimale supportée en °C
  max_temperature?: number; // Température maximale supportée en °C
  cold_resistance_zone?: string; // Zone de rusticité USDA (ex: "9a", "8b", "10a")
  winter_protection_needed?: boolean; // Protection hivernale nécessaire
  // Nouvelles propriétés pour la taille
  size_category?: 'petit' | 'moyen' | 'grand'; // Catégorie de taille
  max_height_cm?: number; // Hauteur maximale en cm
  max_width_cm?: number; // Largeur maximale en cm
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
} 