import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les commandes de l'utilisateur (par user_id OU par email)
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        stripe_session_id,
        customer_email,
        customer_name,
        customer_phone,
        customer_address,
        total_amount,
        currency,
        payment_status,
        order_status,
        items,
        created_at,
        updated_at
      `)
      .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des commandes' },
        { status: 500 }
      );
    }

    // Formater les commandes pour l'affichage
    const formattedOrders = orders.map(order => ({
      ...order,
      total_amount_formatted: (order.total_amount / 100).toFixed(2),
      created_at_formatted: new Date(order.created_at).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders
    });

  } catch (error) {
    console.error('Erreur serveur lors de la récupération des commandes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 