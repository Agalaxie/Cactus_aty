'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import ProductTemplate from '../../../components/ProductTemplate';
import { supabase } from '../../../lib/supabase';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

type CategoryType = 'cactus' | 'agaves' | 'aloes' | 'yuccas' | 'dasylirions' | 'sujets-exceptionnels';

// Fonction pour créer un slug SEO-friendly à partir du nom du produit
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/-+/g, '-') // Éviter les tirets multiples
    .trim()
    .substring(0, 60); // Limiter la longueur
};

export default function ProductPage() {
  const params = useParams();
  const productSlug = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductBySlug() {
      try {
        setLoading(true);
        setError(null);

        // Récupérer tous les produits pour pouvoir les comparer avec le slug
        const { data: products, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;

        // Trouver le produit qui correspond au slug
        const foundProduct = products?.find(p => createSlug(p.name) === productSlug);
        
        setProduct(foundProduct || null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchProductBySlug();
  }, [productSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-red-500">Erreur</h1>
          <p className="text-[var(--foreground)] mt-4">{error}</p>
          <Link href="/" className="text-[var(--accent)] hover:underline mt-4 inline-block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4 opacity-50">🌵</div>
          <h1 className="text-3xl font-bold text-[var(--card-title)] mb-4">Produit non trouvé</h1>
          <p className="text-[var(--foreground)] opacity-75 mb-6">
            Le produit que vous recherchez n'existe pas ou n'est plus disponible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/categorie/cactus" 
              className="bg-[var(--accent)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Voir tous les cactus
            </Link>
            <Link 
              href="/" 
              className="border border-[var(--border)] text-[var(--card-title)] px-6 py-3 rounded-lg hover:bg-[var(--card-bg)] transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Convertir le produit Supabase vers le format attendu par ProductTemplate
  const adaptedProduct = {
    id: product.name.toLowerCase().replace(/\s+/g, '-'),
    name: product.name,
    latin: '', // Pas d'info latine dans Supabase pour l'instant
    description: product.description,
    details: [product.description], // Ajouter les détails requis comme array
    basePrice: product.price,
    images: [product.image_url || '/placeholder-cactus.jpg'],
    category: 'cactus' as CategoryType,
    inStock: product.price > 0,
    featured: product.price > 100,
    sizes: [
      {
        id: 'standard',
        name: 'Taille standard',
        price: product.price,
        stock: product.price > 0 ? 5 : 0
      }
    ],
    characteristics: {
      matureSize: '30-50cm',
      careLevel: 'Facile',
      coldResistance: -5,
      indoorSuitable: true,
      flowering: true,
      growthRate: 'Lent'
    }
  };

  return <ProductTemplate product={adaptedProduct} />;
} 