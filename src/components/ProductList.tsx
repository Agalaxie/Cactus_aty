'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

interface ProductListProps {
  limit?: number; // Nouveau prop pour limiter le nombre de produits
}

export default function ProductList({ limit }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        let query = supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        // Si limit est défini, l'appliquer à la requête
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [limit]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
      Erreur: {error}
    </div>
  );

  // Fonction pour obtenir une image placeholder SVG valide
  const getPlaceholderImage = () => {
    return "data:image/svg+xml,%3csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='400' height='400' fill='%23f3f4f6'/%3e%3cg transform='translate(200%2c200)'%3e%3ccircle cx='0' cy='-30' r='25' fill='%2310b981'/%3e%3cpath d='M-5%2c-50 Q0%2c-60 5%2c-50 L3%2c-30 L-3%2c-30 Z' fill='%2310b981'/%3e%3cpath d='M-15%2c-35 Q-20%2c-45 -10%2c-40 L-8%2c-25 L-12%2c-25 Z' fill='%2310b981'/%3e%3cpath d='M15%2c-35 Q20%2c-45 10%2c-40 L12%2c-25 L8%2c-25 Z' fill='%2310b981'/%3e%3cellipse cx='0' cy='20' rx='40' ry='20' fill='%23d97706'/%3e%3c/g%3e%3ctext x='200' y='350' text-anchor='middle' fill='%236b7280' font-family='Arial%2c sans-serif' font-size='16'%3eImage non disponible%3c/text%3e%3c/svg%3e";
  };

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

  // Fonction pour valider et nettoyer l'URL de l'image
  const getValidImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl || imageUrl.trim() === '') {
      return getPlaceholderImage();
    }

    const cleanUrl = imageUrl.trim();
    
    // Si c'est une URL locale (/images/...) ou invalide, utiliser le placeholder
    if (cleanUrl.startsWith('/images/') || !cleanUrl.startsWith('http')) {
      return getPlaceholderImage();
    }

    // Vérifier si c'est une URL HTTPS valide
    if (cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    // Sinon utiliser le placeholder
    return getPlaceholderImage();
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } }
      }}
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden group cursor-pointer"
          initial={{ opacity: 0, y: 50 }}
          variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
        >
          <Link href={`/produit/${createSlug(product.name)}`} className="block">
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={getValidImageUrl(product.image_url)}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // En cas d'erreur, utiliser l'image placeholder
                  const target = e.target as HTMLImageElement;
                  target.src = getPlaceholderImage();
                }}
              />
            </div>
            <div className="p-6">
              <span className="text-sm font-medium text-[var(--accent)] uppercase tracking-wide">
                {product.category}
              </span>
              <h3 className="text-xl font-bold mt-2 mb-3 text-[var(--card-title)]">
                {product.name}
              </h3>
              <p className="text-sm text-[var(--foreground)] mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-[var(--accent)]">
                  {product.price}€
                </p>
                <button 
                  className="px-4 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-semibold transition-all hover:shadow-lg focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-50"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Ajouter la fonction d'ajout au panier
                    alert('Fonctionnalité à venir !');
                  }}
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
} 