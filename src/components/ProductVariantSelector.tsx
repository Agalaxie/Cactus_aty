'use client';

import { useState } from 'react';
import { ProductVariant } from '@/types/product';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
}

export default function ProductVariantSelector({ 
  variants, 
  selectedVariant, 
  onVariantChange 
}: ProductVariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-[var(--card-title)] mb-3">
          Choisir la taille
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {variants.map((variant, index) => {
            const isSelected = selectedVariant?.height === variant.height;
            const isOutOfStock = variant.stock === 0;
            
            return (
              <button
                key={index}
                onClick={() => !isOutOfStock && onVariantChange(variant)}
                disabled={isOutOfStock}
                className={`
                  p-4 rounded-lg border-2 transition-all text-center
                  ${isSelected 
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' 
                    : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                  }
                  ${isOutOfStock 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                    : 'hover:scale-105'
                  }
                `}
              >
                <div className="text-sm font-medium text-[var(--card-title)]">
                  {variant.height}
                </div>
                <div className="text-lg font-bold text-[var(--accent)] mt-1">
                  {variant.price.toFixed(2)}€
                </div>
                <div className="text-xs text-[var(--foreground)] opacity-75 mt-1">
                  {isOutOfStock 
                    ? 'Rupture de stock' 
                    : `${variant.stock} en stock`
                  }
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedVariant && (
        <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[var(--card-title)] font-medium">
                Taille sélectionnée : {selectedVariant.height}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--accent)]">
                {selectedVariant.price.toFixed(2)}€
              </div>
              <div className="text-sm text-[var(--foreground)] opacity-75">
                {selectedVariant.stock} disponible{selectedVariant.stock > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 