import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'ID de session manquant' },
        { status: 400 }
      );
    }

    // Récupérer la session depuis Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details']
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Le paiement n\'a pas été effectué' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur connecté (si applicable)
    let currentUser = null;
    try {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      currentUser = user;
    } catch (userError) {
      console.log('Utilisateur non connecté ou erreur d\'authentification');
    }

    // Préparer les données pour l'envoi d'emails et la sauvegarde
    const orderData = {
      sessionId: session.id,
      amount: session.amount_total,
      customerName: session.metadata?.customer_name || session.customer_details?.name || 'Client',
      customerPhone: session.metadata?.customer_phone || session.customer_details?.phone || '',
      customerAddress: session.metadata?.customer_address || 
        (session.customer_details?.address ? 
          `${session.customer_details.address.line1}, ${session.customer_details.address.city}, ${session.customer_details.address.postal_code}` : 
          ''),
    };

    const customerEmail = session.customer_details?.email;
    const adminEmail = process.env.ADMIN_EMAIL;

    // 1. Sauvegarder la commande en base de données
    if (customerEmail) {
      try {
        const saveResponse = await fetch(`${request.nextUrl.origin}/api/save-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stripeSessionId: session.id,
            customerEmail,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            customerAddress: orderData.customerAddress,
            totalAmount: session.amount_total,
            items: session.line_items?.data || [],
            userId: currentUser?.id || null,
            metadata: {
              stripe_session: session.id,
              payment_intent: session.payment_intent,
              customer_details: session.customer_details,
            }
          }),
        });

        if (saveResponse.ok) {
          console.log('✅ Commande sauvegardée avec succès');
        } else {
          console.error('❌ Erreur lors de la sauvegarde de la commande');
        }
      } catch (saveError) {
        console.error('Erreur lors de la sauvegarde:', saveError);
      }
    }

    // 2. Envoyer les emails de confirmation (ne pas bloquer la réponse si ça échoue)
    if (customerEmail) {
      try {
        const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-order-emails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderData,
            customerEmail,
            adminEmail
          }),
        });

        if (!emailResponse.ok) {
          console.error('❌ Erreur lors de l\'envoi des emails de confirmation');
        } else {
          console.log('✅ Emails de confirmation envoyés avec succès');
        }
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi des emails:', emailError);
        // Ne pas faire échouer la vérification de paiement pour un problème d'email
      }
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        customer_details: session.customer_details,
        line_items: session.line_items,
        created: session.created,
      }
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    );
  }
} 