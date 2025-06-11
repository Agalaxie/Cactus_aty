'use client';

import { Product } from '@/types/product';

interface ProductBadgesProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showColdResistance?: boolean;
  showSize?: boolean;
  showWinterProtection?: boolean;
}

export default function ProductBadges({ 
  product, 
  size = 'md',
  showColdResistance = true,
  showSize = true,
  showWinterProtection = true
}: ProductBadgesProps) {
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg'
  };

  // Fonction pour obtenir l'icône et couleur de résistance au froid
  const getColdResistanceInfo = (minTemp: number | null) => {
    if (minTemp === null) return { icon: '❓', color: 'bg-gray-100 text-gray-600', label: 'Non spécifié' };
    
    if (minTemp >= 5) return { icon: '🏠', color: 'bg-red-100 text-red-700', label: 'Intérieur uniquement' };
    if (minTemp >= 0) return { icon: '🛡️', color: 'bg-orange-100 text-orange-700', label: 'Protection requise' };
    if (minTemp >= -5) return { icon: '❄️', color: 'bg-blue-100 text-blue-700', label: 'Résistant léger gel' };
    if (minTemp >= -10) return { icon: '🧊', color: 'bg-blue-200 text-blue-800', label: 'Résistant froid modéré' };
    if (minTemp >= -15) return { icon: '⛄', color: 'bg-blue-300 text-blue-900', label: 'Très résistant' };
    return { icon: '🌨️', color: 'bg-blue-400 text-white', label: 'Extrêmement résistant' };
  };

  // Fonction pour obtenir l'icône et couleur de taille
  const getSizeInfo = (sizeCategory: string | undefined) => {
    switch (sizeCategory) {
      case 'petit':
        return { icon: '🌱', color: 'bg-green-100 text-green-700', label: 'Petit' };
      case 'moyen':
        return { icon: '🌿', color: 'bg-green-200 text-green-800', label: 'Moyen' };
      case 'grand':
        return { icon: '🌳', color: 'bg-green-300 text-green-900', label: 'Grand' };
      default:
        return { icon: '📏', color: 'bg-gray-100 text-gray-600', label: 'Taille inconnue' };
    }
  };

  const coldResistanceInfo = getColdResistanceInfo(product.min_temperature ?? null);
  const sizeInfo = getSizeInfo(product.size_category);

  return (
    <div className="flex flex-wrap gap-1">
      
      {/* Badge résistance au froid */}
      {showColdResistance && (
        <div 
          className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${coldResistanceInfo.color}`}
          title={`${coldResistanceInfo.label} (${product.min_temperature ?? 'N/A'}°C)`}
        >
          <span className={iconSizes[size]}>{coldResistanceInfo.icon}</span>
          {size === 'lg' && (
            <span>{product.min_temperature ?? 'N/A'}°C</span>
          )}
        </div>
      )}

      {/* Badge protection hivernale */}
      {showWinterProtection && product.winter_protection_needed && (
        <div 
          className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} bg-yellow-100 text-yellow-700`}
          title="Protection hivernale recommandée"
        >
          <span className={iconSizes[size]}>⚠️</span>
          {size === 'lg' && <span>Protection</span>}
        </div>
      )}

      {/* Badge taille */}
      {showSize && (
        <div 
          className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${sizeInfo.color}`}
          title={`${sizeInfo.label} (${product.max_height_cm ?? 'N/A'}cm max)`}
        >
          <span className={iconSizes[size]}>{sizeInfo.icon}</span>
          {size === 'lg' && (
            <span>{sizeInfo.label}</span>
          )}
        </div>
      )}
    </div>
  );
} 