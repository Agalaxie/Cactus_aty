'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../../components/Header';
import ProductVariantSelector from '../../../components/ProductVariantSelector';
import { supabase } from '../../../lib/supabase';
import { Product, ProductVariant } from '../../../types/product';

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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
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
        
        if (foundProduct) {
          setProduct(foundProduct);
          // Sélectionner automatiquement le premier variant s'il y en a
          if (foundProduct.variants && foundProduct.variants.length > 0) {
            setSelectedVariant(foundProduct.variants[0]);
          }
        } else {
          setProduct(null);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchProductBySlug();
  }, [productSlug]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset la quantité quand on change de variant
  };

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return product?.price || 0;
  };

  const getCurrentStock = () => {
    if (selectedVariant) {
      return selectedVariant.stock;
    }
    return product?.stock_quantity || 0;
  };

  const isInStock = () => {
    return getCurrentStock() > 0;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Ici on ajouterait la logique du panier
    console.log('Ajout au panier:', {
      product,
      selectedVariant,
      quantity
    });
    
    alert(`Ajouté au panier : ${product.name} ${selectedVariant ? `(${selectedVariant.height})` : ''} x${quantity}`);
  };

  // Fonction pour obtenir une image placeholder
  const getPlaceholderImage = () => {
    return "data:image/svg+xml,%3csvg width='600' height='600' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='600' height='600' fill='%23f3f4f6'/%3e%3cg transform='translate(300%2c300)'%3e%3ccircle cx='0' cy='-50' r='40' fill='%2310b981'/%3e%3cpath d='M-8%2c-80 Q0%2c-95 8%2c-80 L5%2c-45 L-5%2c-45 Z' fill='%2310b981'/%3e%3cpath d='M-25%2c-55 Q-35%2c-70 -15%2c-60 L-12%2c-40 L-18%2c-40 Z' fill='%2310b981'/%3e%3cpath d='M25%2c-55 Q35%2c-70 15%2c-60 L18%2c-40 L12%2c-40 Z' fill='%2310b981'/%3e%3cellipse cx='0' cy='30' rx='60' ry='30' fill='%23d97706'/%3e%3c/g%3e%3ctext x='300' y='550' text-anchor='middle' fill='%236b7280' font-family='Arial%2c sans-serif' font-size='24'%3eImage non disponible%3c/text%3e%3c/svg%3e";
  };

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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-[var(--foreground)] opacity-75">
            <Link href="/" className="hover:text-[var(--accent)]">Accueil</Link>
            <span>/</span>
            <Link href={`/categorie/${product.category}`} className="hover:text-[var(--accent)] capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[var(--card-title)]">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden border border-[var(--border)]">
              <Image
                src={product.image_url || getPlaceholderImage()}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getPlaceholderImage();
                }}
              />
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[var(--card-title)] mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-[var(--foreground)] opacity-75 capitalize">
                {product.category}
              </p>
            </div>

            <div className="text-3xl font-bold text-[var(--accent)]">
              {getCurrentPrice().toFixed(2)}€
            </div>

            <p className="text-[var(--foreground)] leading-relaxed">
              {product.description}
            </p>

            {/* Sélecteur de variants */}
            {product.variants && product.variants.length > 0 && (
              <ProductVariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={handleVariantChange}
              />
            )}

            {/* Quantité et ajout au panier */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-[var(--card-title)] font-medium">Quantité :</label>
                <div className="flex items-center border border-[var(--border)] rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-[var(--card-bg)] transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-[var(--border)]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(getCurrentStock(), quantity + 1))}
                    className="px-3 py-2 hover:bg-[var(--card-bg)] transition-colors"
                    disabled={quantity >= getCurrentStock()}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-[var(--foreground)] opacity-75">
                  ({getCurrentStock()} disponible{getCurrentStock() > 1 ? 's' : ''})
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isInStock() || quantity === 0}
                className="w-full bg-[var(--accent)] text-white py-4 px-6 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isInStock() ? 'Rupture de stock' : 'Ajouter au panier'}
              </button>
            </div>

            {/* Informations complémentaires */}
            <div className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border)]">
              <h3 className="font-bold text-[var(--card-title)] mb-4">Informations</h3>
              <ul className="space-y-2 text-[var(--foreground)]">
                <li>🚚 <strong>Livraison :</strong> 2-3 jours ouvrés</li>
                <li>📦 <strong>Emballage :</strong> Sécurisé pour le transport</li>
                <li>🌱 <strong>Garantie :</strong> Plante en bonne santé</li>
                <li>💬 <strong>Support :</strong> Conseils d'entretien inclus</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 