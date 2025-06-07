'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import Image from 'next/image';

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

// Fonction pour obtenir l'icône de la catégorie
const getCategoryIcon = (category: string): string => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('cactus') || categoryLower.includes('echinocactus') || categoryLower.includes('cereus')) {
    return '🌵';
  }
  if (categoryLower.includes('agave')) {
    return '🪴';
  }
  if (categoryLower.includes('aloe')) {
    return '🌿';
  }
  if (categoryLower.includes('yucca') || categoryLower.includes('rostrata')) {
    return '🌾';
  }
  if (categoryLower.includes('dasylirion')) {
    return '🏺';
  }
  if (categoryLower.includes('opuntia')) {
    return '🌵';
  }
  if (categoryLower.includes('exceptionnel') || categoryLower.includes('sujet')) {
    return '⭐';
  }
  
  return '🌱'; // Icône par défaut
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

    // Nettoyage approfondi de l'URL
    const cleanUrl = imageUrl
      .trim()
      .replace(/^\s+|\s+$/g, '') // Supprimer espaces début/fin
      .replace(/[\r\n\t]/g, '') // Supprimer caractères de contrôle
      .replace(/\s+/g, ' ') // Normaliser les espaces internes
      .trim();
    
    // Accepter les URLs locales (/images/...) et les URLs HTTPS/HTTP
    if (cleanUrl.startsWith('/images/') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('http://')) {
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
      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute w-full mt-3 bg-white dark:bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm animate-in slide-in-from-top-2 duration-200"
          style={{ 
            zIndex: 9999,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
            {suggestions.map((product, index) => (
              <div
                key={product.id}
                className={`flex items-center p-4 hover:bg-gradient-to-r hover:from-[var(--accent)]/5 hover:to-[var(--accent)]/10 cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-md border-b border-[var(--border)]/30 last:border-b-0 ${
                  selectedIndex === index ? 'bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent)]/20 scale-[1.01]' : ''
                }`}
                onClick={() => handleProductSelect(product)}
                style={{ 
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="relative h-14 w-14 flex-shrink-0 mr-4">
                  <Image
                    src={getValidImageUrl(product.image_url)}
                    alt={product.name}
                    fill
                    className="object-cover rounded-xl shadow-lg ring-2 ring-[var(--accent)]/20 hover:ring-[var(--accent)]/40 transition-all duration-200"
                    loading="lazy"
                    quality={85}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getPlaceholderImage();
                    }}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-black/5"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--card-title)] truncate text-base leading-tight mb-1">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getCategoryIcon(product.category)}
                      </span>
                      <p className="text-sm text-[var(--foreground)]/70 capitalize font-medium">
                        {product.category.replace(/[>-]/g, ' • ').replace(/\s+/g, ' ').trim()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[var(--accent)] text-sm">💰</span>
                      <p className="text-sm font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded-lg">
                        {product.price > 0 ? `${product.price}€` : 'Sur demande'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Lien vers tous les résultats */}
            <div className="border-t border-[var(--border)]/50 bg-gradient-to-r from-[var(--accent)]/5 to-transparent p-4">
              <button
                onClick={handleSearch}
                className="w-full text-left text-sm text-[var(--accent)] hover:text-[var(--accent)]/80 font-semibold flex items-center gap-2 hover:translate-x-1 transition-all duration-200"
              >
                <span className="text-base">🔍</span>
                Voir tous les résultats pour <span className="font-bold">"{query}"</span>
                <span className="ml-auto text-xs opacity-70">→</span>
              </button>
            </div>
          </div>
        )}

      {/* Message aucun résultat */}
      {isOpen && query.length >= 2 && suggestions.length === 0 && !isLoading && (
        <div
          className="absolute w-full mt-3 bg-white dark:bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-2xl p-6 animate-in slide-in-from-top-2 duration-200"
          style={{ 
            zIndex: 9999,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="text-center">
            <div className="text-5xl mb-3 opacity-60">🌵</div>
            <p className="text-base text-[var(--foreground)] font-medium mb-1">
              Aucun cactus trouvé
            </p>
            <p className="text-sm text-[var(--foreground)]/60 mb-4">
              pour <span className="font-semibold">"{query}"</span>
            </p>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
            >
              🔍 Rechercher quand même
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 