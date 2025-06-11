'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    minTemperature: number | null;
    sizeCategory: string | null;
  }) => void;
  currentFilters: {
    minTemperature: number | null;
    sizeCategory: string | null;
  };
}

const TEMPERATURE_RANGES = [
  { label: 'Toutes résistances', value: null, icon: '🌡️' },
  { label: 'Intérieur (5°C+)', value: 5, icon: '🏠' },
  { label: 'Protection (0°C à 4°C)', value: 0, icon: '🛡️' },
  { label: 'Léger gel (-5°C à -1°C)', value: -5, icon: '❄️' },
  { label: 'Froid modéré (-10°C à -6°C)', value: -10, icon: '🧊' },
  { label: 'Très résistant (-15°C à -11°C)', value: -15, icon: '⛄' },
  { label: 'Extrême (-16°C et moins)', value: -20, icon: '🌨️' },
];

const SIZE_CATEGORIES = [
  { label: 'Toutes tailles', value: null, icon: '📏' },
  { label: 'Petit', value: 'petit', icon: '🌱' },
  { label: 'Moyen', value: 'moyen', icon: '🌿' },
  { label: 'Grand', value: 'grand', icon: '🌳' },
];

export default function ProductFilters({ onFiltersChange, currentFilters }: ProductFiltersProps) {
  const [isTemperatureOpen, setIsTemperatureOpen] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);

  const selectedTemperature = TEMPERATURE_RANGES.find(
    range => range.value === currentFilters.minTemperature
  ) || TEMPERATURE_RANGES[0];

  const selectedSize = SIZE_CATEGORIES.find(
    size => size.value === currentFilters.sizeCategory
  ) || SIZE_CATEGORIES[0];

  const handleTemperatureChange = (value: number | null) => {
    onFiltersChange({
      ...currentFilters,
      minTemperature: value
    });
    setIsTemperatureOpen(false);
  };

  const handleSizeChange = (value: string | null) => {
    onFiltersChange({
      ...currentFilters,
      sizeCategory: value
    });
    setIsSizeOpen(false);
  };

  const hasActiveFilters = currentFilters.minTemperature !== null || currentFilters.sizeCategory !== null;

  const clearFilters = () => {
    onFiltersChange({
      minTemperature: null,
      sizeCategory: null
    });
  };

  return (
    <div className="mb-4">
      {/* Filtres discrets en ligne horizontale */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-gray-600 dark:text-gray-400 font-medium">Filtres :</span>
        
        {/* Filtre par résistance au froid - compact */}
        <div className="relative">
          <button
            onClick={() => setIsTemperatureOpen(!isTemperatureOpen)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border transition-colors ${
              currentFilters.minTemperature !== null 
                ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]' 
                : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-xs">{selectedTemperature.icon}</span>
            <span className="text-xs font-medium">{selectedTemperature.label}</span>
            <ChevronDownIcon className={`h-3 w-3 transition-transform ${isTemperatureOpen ? 'rotate-180' : ''}`} />
          </button>

          {isTemperatureOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsTemperatureOpen(false)} />
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[var(--card-bg)] border border-gray-200 dark:border-[var(--border)] rounded-lg shadow-lg z-20 min-w-48 max-h-64 overflow-y-auto">
                {TEMPERATURE_RANGES.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handleTemperatureChange(range.value)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      currentFilters.minTemperature === range.value ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-gray-900 dark:text-[var(--card-title)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{range.icon}</span>
                      <span>{range.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Filtre par taille - compact */}
        <div className="relative">
          <button
            onClick={() => setIsSizeOpen(!isSizeOpen)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border transition-colors ${
              currentFilters.sizeCategory !== null 
                ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]' 
                : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-xs">{selectedSize.icon}</span>
            <span className="text-xs font-medium">{selectedSize.label}</span>
            <ChevronDownIcon className={`h-3 w-3 transition-transform ${isSizeOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSizeOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsSizeOpen(false)} />
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[var(--card-bg)] border border-gray-200 dark:border-[var(--border)] rounded-lg shadow-lg z-20 min-w-36">
                {SIZE_CATEGORIES.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => handleSizeChange(size.value)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      currentFilters.sizeCategory === size.value ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-gray-900 dark:text-[var(--card-title)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{size.icon}</span>
                      <span>{size.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bouton de réinitialisation discret */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors"
          >
            Effacer
          </button>
        )}
      </div>
    </div>
  );
} 