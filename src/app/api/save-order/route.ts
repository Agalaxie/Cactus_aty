import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { 
      stripeSessionId,
      customerEmail,
      customerName,
      customerPhone,
      customerAddress,
      totalAmount,
      items,
      userId = null,
      metadata = {}
    } = await request.json();

    if (!stripeSessionId || !customerEmail || !totalAmount || !items) {
      return NextResponse.json(
        { error: 'Données de commande incomplètes' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Vérifier si la commande existe déjà
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', stripeSessionId)
      .single();

    if (existingOrder) {
      return NextResponse.json(
        { success: true, message: 'Commande déjà enregistrée', orderId: existingOrder.id }
      );
    }

    // Sauvegarder la nouvelle commande
    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: stripeSessionId,
        user_id: userId,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        total_amount: totalAmount,
        currency: 'eur',
        payment_status: 'paid',
        order_status: 'confirmed',
        items: items,
        metadata: metadata
      })
      .select('id')
      .single();

    if (error) {
      console.error('Erreur lors de la sauvegarde de la commande:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde de la commande' },
        { status: 500 }
      );
    }

    console.log('✅ Commande sauvegardée avec succès:', newOrder.id);

    return NextResponse.json({
      success: true,
      message: 'Commande sauvegardée avec succès',
      orderId: newOrder.id
    });

  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la sauvegarde' },
      { status: 500 }
    );
  }
} 