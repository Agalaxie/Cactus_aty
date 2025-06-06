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
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
} 