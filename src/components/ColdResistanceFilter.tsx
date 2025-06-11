'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ColdResistanceFilterProps {
  onFilterChange: (minTemperature: number | null) => void;
  currentFilter: number | null;
}

const TEMPERATURE_RANGES = [
  { label: 'Toutes les plantes', value: null, description: 'Aucun filtre' },
  { label: 'Intérieur uniquement (5°C et +)', value: 5, description: 'Plantes d\'intérieur' },
  { label: 'Avec protection (0°C à 4°C)', value: 0, description: 'Protection hivernale requise' },
  { label: 'Légers gels (-5°C à -1°C)', value: -5, description: 'Résistant aux légers gels' },
  { label: 'Froid modéré (-10°C à -6°C)', value: -10, description: 'Résistant au froid modéré' },
  { label: 'Très résistant (-15°C à -11°C)', value: -15, description: 'Très résistant au froid' },
  { label: 'Extrêmement résistant (-16°C et moins)', value: -20, description: 'Résistant aux grands froids' },
];

export default function ColdResistanceFilter({ onFilterChange, currentFilter }: ColdResistanceFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedRange = TEMPERATURE_RANGES.find(range => range.value === currentFilter) || TEMPERATURE_RANGES[0];

  const handleSelection = (value: number | null) => {
    onFilterChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white dark:bg-[var(--card-bg)] border border-gray-300 dark:border-[var(--border)] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">🌡️</span>
          <div>
            <div className="font-medium text-gray-900 dark:text-[var(--card-title)]">
              Résistance au froid
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedRange.label}
            </div>
          </div>
        </div>
        <ChevronDownIcon 
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[var(--card-bg)] border border-gray-200 dark:border-[var(--border)] rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            {TEMPERATURE_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => handleSelection(range.value)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                  currentFilter === range.value ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-gray-900 dark:text-[var(--card-title)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{range.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {range.description}
                    </div>
                  </div>
                  {currentFilter === range.value && (
                    <span className="text-[var(--accent)]">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 