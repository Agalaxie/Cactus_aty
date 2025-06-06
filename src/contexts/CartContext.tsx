'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, ProductVariant } from '@/types/product';

export interface CartItem {
  id: string; // ID unique pour l'item (product.id + variant.height)
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  addedAt: Date;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; selectedVariant?: ProductVariant; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Calculer les totaux
const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.selectedVariant?.price || item.product.price;
    return sum + (price * item.quantity);
  }, 0);
  
  return { totalItems, totalPrice };
};

// Générer un ID unique pour un item du panier
const generateCartItemId = (product: Product, selectedVariant?: ProductVariant): string => {
  return `${product.id}-${selectedVariant?.height || 'default'}`;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, selectedVariant, quantity } = action.payload;
      const itemId = generateCartItemId(product, selectedVariant);
      
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // L'item existe déjà, on augmente la quantité
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Nouvel item
        const newItem: CartItem = {
          id: itemId,
          product,
          selectedVariant,
          quantity,
          addedAt: new Date(),
        };
        newItems = [...state.items, newItem];
      }
      
      const totals = calculateTotals(newItems);
      
      return {
        items: newItems,
        totalItems: totals.totalItems,
        totalPrice: totals.totalPrice,
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const totals = calculateTotals(newItems);
      
      return {
        items: newItems,
        totalItems: totals.totalItems,
        totalPrice: totals.totalPrice,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si quantité 0 ou négative, supprimer l'item
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } });
      }
      
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      const totals = calculateTotals(newItems);
      
      return {
        items: newItems,
        totalItems: totals.totalItems,
        totalPrice: totals.totalPrice,
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    case 'LOAD_CART': {
      const totals = calculateTotals(action.payload);
      return {
        items: action.payload,
        totalItems: totals.totalItems,
        totalPrice: totals.totalPrice,
      };
    }
    
    default:
      return state;
  }
};

interface CartContextType extends CartState {
  addItem: (product: Product, selectedVariant?: ProductVariant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (product: Product, selectedVariant?: ProductVariant) => boolean;
  getCartItemQuantity: (product: Product, selectedVariant?: ProductVariant) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          // Convertir les dates
          const cartWithDates = parsedCart.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }));
          dispatch({ type: 'LOAD_CART', payload: cartWithDates });
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error);
      }
    }
  }, [state.items]);

  const addItem = (product: Product, selectedVariant?: ProductVariant, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, selectedVariant, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (product: Product, selectedVariant?: ProductVariant): boolean => {
    const itemId = generateCartItemId(product, selectedVariant);
    return state.items.some(item => item.id === itemId);
  };

  const getCartItemQuantity = (product: Product, selectedVariant?: ProductVariant): number => {
    const itemId = generateCartItemId(product, selectedVariant);
    const item = state.items.find(item => item.id === itemId);
    return item?.quantity || 0;
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 