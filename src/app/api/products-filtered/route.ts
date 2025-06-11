import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const minTempFilter = searchParams.get('minTemperature');
    const sizeFilter = searchParams.get('sizeCategory');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let query = supabase
      .from('products')
      .select('*');

    // Filtre par catégorie (obligatoire pour les pages de catégories)
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Filtre par température minimale
    if (minTempFilter !== null && minTempFilter !== 'null') {
      const minTemp = parseInt(minTempFilter);
      if (!isNaN(minTemp)) {
        query = query.gte('min_temperature', minTemp);
      }
    }

    // Filtre par taille
    if (sizeFilter && sizeFilter !== 'null' && sizeFilter !== 'all') {
      query = query.eq('size_category', sizeFilter);
    }

    // Pagination
    if (offset) {
      const offsetNum = parseInt(offset);
      if (!isNaN(offsetNum)) {
        query = query.range(offsetNum, offsetNum + (limit ? parseInt(limit) - 1 : 19));
      }
    } else if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum)) {
        query = query.limit(limitNum);
      }
    }

    // Trier par nom par défaut
    query = query.order('name', { ascending: true });

    const { data: products, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des produits' },
        { status: 500 }
      );
    }

    // Ajouter les descriptions de résistance au froid et informations de taille
    const productsWithDescriptions = products?.map(product => ({
      ...product,
      cold_resistance_description: getColdResistanceDescription(product.min_temperature),
      size_description: getSizeDescription(product.size_category, product.max_height_cm)
    })) || [];

    return NextResponse.json({
      products: productsWithDescriptions,
      total: productsWithDescriptions.length,
      filters: {
        minTemperature: minTempFilter ? parseInt(minTempFilter) : null,
        sizeCategory: sizeFilter || null,
        category: category || 'all'
      }
    });

  } catch (error) {
    console.error('Erreur dans l\'API products-filtered:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Fonction helper pour obtenir la description de résistance au froid
function getColdResistanceDescription(minTemp: number | null): string {
  if (minTemp === null) return 'Non spécifié';
  
  if (minTemp >= 5) return 'Intérieur uniquement';
  if (minTemp >= 0) return 'Extérieur avec protection hivernale';
  if (minTemp >= -5) return 'Résistant aux légers gels';
  if (minTemp >= -10) return 'Résistant au froid modéré';
  if (minTemp >= -15) return 'Très résistant au froid';
  return 'Extrêmement résistant au froid';
}

// Fonction helper pour obtenir la description de taille
function getSizeDescription(sizeCategory: string | null, maxHeight: number | null): string {
  if (!sizeCategory) return 'Taille non spécifiée';
  
  const heightInfo = maxHeight ? ` (${maxHeight}cm max)` : '';
  
  switch (sizeCategory) {
    case 'petit':
      return `Petit${heightInfo}`;
    case 'moyen':
      return `Moyen${heightInfo}`;
    case 'grand':
      return `Grand${heightInfo}`;
    default:
      return `${sizeCategory}${heightInfo}`;
  }
} 