import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CartItem } from '@/contexts/CartContext';

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail, customerInfo } = await request.json() as {
      items: CartItem[];
      customerEmail?: string;
      customerInfo?: {
        name: string;
        email: string;
        phone: string;
        address: {
          line1: string;
          city: string;
          postal_code: string;
          country: string;
        };
      };
    };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      );
    }

    // Construire les line_items pour Stripe
    const lineItems = items.map((item) => {
      const price = item.selectedVariant?.price || item.product.price;
      const name = item.selectedVariant 
        ? `${item.product.name} (${item.selectedVariant.height})`
        : item.product.name;

      // Vérifier si l'URL de l'image est valide pour Stripe
      const isValidImageUrl = (url: string | null): boolean => {
        if (!url) return false;
        try {
          const urlObj = new URL(url, process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3001');
          return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
          return false;
        }
      };

      // Ne pas inclure d'images invalides pour éviter l'erreur Stripe
      const validImages: string[] = [];
      if (item.product.image_url && isValidImageUrl(item.product.image_url)) {
        // Si c'est une URL relative, la convertir en URL absolue
        if (item.product.image_url.startsWith('/')) {
          const baseUrl = process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3001';
          validImages.push(`${baseUrl}${item.product.image_url}`);
        } else {
          validImages.push(item.product.image_url);
        }
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: name,
            description: item.product.description || `Cactus ${item.product.category}`,
            images: validImages, // Utiliser seulement les images valides
            metadata: {
              product_id: item.product.id.toString(),
              variant_height: item.selectedVariant?.height || 'standard',
            },
          },
          unit_amount: Math.round(price * 100), // Stripe utilise les centimes
        },
        quantity: item.quantity,
      };
    });

    // Calculer les frais de livraison
    const subtotal = items.reduce((sum, item) => {
      const price = item.selectedVariant?.price || item.product.price;
      return sum + (price * item.quantity);
    }, 0);

    const shippingCost = subtotal >= 200 ? 0 : 15;

    // Ajouter les frais de livraison si nécessaires
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Frais de livraison',
            description: 'Livraison express en 24-48h',
            images: [],
            metadata: {
              product_id: 'shipping',
              variant_height: 'standard',
            },
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Créer la session de paiement Stripe sans demander d'infos supplémentaires
    // si on a déjà toutes les informations nécessaires
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/commande/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/commande`,
      metadata: {
        order_type: 'cactus_shop',
        total_items: items.length.toString(),
        customer_name: customerInfo?.name || '',
        customer_phone: customerInfo?.phone || '',
        customer_address: customerInfo?.address ? `${customerInfo.address.line1}, ${customerInfo.address.city}, ${customerInfo.address.postal_code}` : '',
      },
      automatic_tax: {
        enabled: false,
      },
    };

    // Toujours utiliser l'email si disponible
    if (customerInfo?.email) {
      sessionConfig.customer_email = customerInfo.email;
    }

    // Si on a toutes les infos, ne pas demander d'adresse supplémentaire
    if (customerInfo?.name && customerInfo?.email && customerInfo?.address && customerInfo?.phone) {
      // Ne pas demander d'infos supplémentaires - on les a déjà !
      console.log('✅ Informations complètes reçues, pas besoin de collecte supplémentaire');
    } else {
      // Seulement si on manque des infos, demander à Stripe de les collecter
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['FR'],
      };
      sessionConfig.phone_number_collection = {
        enabled: true,
      };
      console.log('⚠️ Informations incomplètes, collecte nécessaire sur Stripe');
    }

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
} 