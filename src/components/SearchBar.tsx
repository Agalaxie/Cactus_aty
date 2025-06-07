'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { m } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

interface SearchBarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

// Fonction pour créer un slug SEO-friendly à partir du nom du produit
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60);
};

export default function SearchBar({ onClose, isMobile = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Recherche en temps réel avec Supabase
  useEffect(() => {
    const searchProducts = async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
            .limit(5);

          if (error) throw error;
          
          setSuggestions(data || []);
          setIsOpen(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Erreur de recherche:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Gestion des touches du clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleProductSelect(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleProductSelect = (product: Product) => {
    router.push(`/produit/${createSlug(product.name)}`);
    setQuery('');
    setIsOpen(false);
    onClose?.();
  };

  // Fermer les suggestions en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fonction pour obtenir une image placeholder SVG valide
  const getPlaceholderImage = () => {
    return "data:image/svg+xml,%3csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='400' height='400' fill='%23f3f4f6'/%3e%3cg transform='translate(200%2c200)'%3e%3ccircle cx='0' cy='-30' r='25' fill='%2310b981'/%3e%3cpath d='M-5%2c-50 Q0%2c-60 5%2c-50 L3%2c-30 L-3%2c-30 Z' fill='%2310b981'/%3e%3cpath d='M-15%2c-35 Q-20%2c-45 -10%2c-40 L-8%2c-25 L-12%2c-25 Z' fill='%2310b981'/%3e%3cpath d='M15%2c-35 Q20%2c-45 10%2c-40 L12%2c-25 L8%2c-25 Z' fill='%2310b981'/%3e%3cellipse cx='0' cy='20' rx='40' ry='20' fill='%23d97706'/%3e%3c/g%3e%3ctext x='200' y='350' text-anchor='middle' fill='%236b7280' font-family='Arial%2c sans-serif' font-size='16'%3eImage non disponible%3c/text%3e%3c/svg%3e";
  };

  // Fonction pour valider et nettoyer l'URL de l'image
  const getValidImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl || imageUrl.trim() === '') {
      return getPlaceholderImage();
    }

    const cleanUrl = imageUrl.trim();
    
    // Accepter les URLs locales (/images/...) et les URLs HTTPS
    if (cleanUrl.startsWith('/images/') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    // Sinon utiliser le placeholder
    return getPlaceholderImage();
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Quel cactus recherchez-vous ?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 pl-12 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--card-title)] placeholder-[var(--foreground)] placeholder-opacity-50"
        />
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--foreground)] opacity-40" />
        
        {/* Indicator de chargement */}
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[var(--accent)]"></div>
          </div>
        )}
        
        {/* Bouton de recherche mobile */}
        {isMobile && !isLoading && (
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[var(--accent)] text-white p-2 rounded-md hover:opacity-90 transition-colors"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <m.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden"
          >
            {suggestions.map((product, index) => (
              <m.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center p-3 hover:bg-[var(--background)] cursor-pointer transition-colors ${
                  selectedIndex === index ? 'bg-[var(--background)]' : ''
                }`}
                onClick={() => handleProductSelect(product)}
              >
                <div className="relative h-12 w-12 flex-shrink-0 mr-3">
                  <Image
                    src={getValidImageUrl(product.image_url)}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                    loading="lazy"
                    quality={85}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getPlaceholderImage();
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--card-title)] truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--foreground)] opacity-75 capitalize">
                      {product.category.replace('-', ' ')}
                    </p>
                    <p className="text-sm font-semibold text-[var(--accent)]">
                      {product.price > 0 ? `${product.price}€` : 'Sur demande'}
                    </p>
                  </div>
                </div>
              </m.div>
            ))}
            
            {/* Lien vers tous les résultats */}
            <div className="border-t border-[var(--border)] p-3">
              <button
                onClick={handleSearch}
                className="w-full text-left text-sm text-[var(--accent)] hover:opacity-80 font-medium"
              >
                Voir tous les résultats pour "{query}"
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Message aucun résultat */}
      <AnimatePresence>
        {isOpen && query.length >= 2 && suggestions.length === 0 && !isLoading && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg p-4"
          >
            <div className="text-center">
              <div className="text-4xl mb-2 opacity-50">🔍</div>
              <p className="text-sm text-[var(--foreground)] opacity-75">
                Aucun résultat pour "{query}"
              </p>
              <button
                onClick={handleSearch}
                className="mt-2 text-xs text-[var(--accent)] hover:opacity-80"
              >
                Rechercher quand même
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
} 