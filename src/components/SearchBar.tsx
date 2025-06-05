'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { products } from '../data/products';
import type { Product } from '../data/products';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export default function SearchBar({ onClose, isMobile = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Recherche en temps réel
  useEffect(() => {
    if (query.length >= 2) {
      const filtered = products
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          (product.latin && product.latin.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 5); // Limiter à 5 suggestions
      
      setSuggestions(filtered);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
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
    router.push(`/produit/${product.id}`);
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

  const formatPrice = (basePrice: number, multiplier: number) => {
    return Math.round(basePrice * multiplier);
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Rechercher un cactus, agave, yucca..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 pl-12 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-[var(--card-title)] placeholder-[var(--foreground)] placeholder-opacity-50"
        />
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--foreground)] opacity-40" />
        
        {/* Bouton de recherche mobile */}
        {isMobile && (
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
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden"
          >
            {suggestions.map((product, index) => (
              <motion.div
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
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
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
                      {formatPrice(product.basePrice, product.sizes[0]?.multiplier || 1)}€
                    </p>
                  </div>
                </div>
              </motion.div>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message aucun résultat */}
      {isOpen && query.length >= 2 && suggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 w-full mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg p-4"
        >
          <p className="text-[var(--foreground)] opacity-75 text-center">
            Aucun produit trouvé pour "{query}"
          </p>
        </motion.div>
      )}
    </div>
  );
} 