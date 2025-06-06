import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    console.log('🔍 Test des commandes utilisateur...');

    // 1. Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('Utilisateur connecté:', !!user);
    console.log('ID utilisateur:', user?.id);
    console.log('Email utilisateur:', user?.email);

    if (authError) {
      console.log('Erreur auth:', authError);
    }

    // 2. Récupérer TOUTES les commandes (sans filtre utilisateur)
    const { data: allOrders, error: allOrdersError } = await supabase
      .from('orders')
      .select('*')
      .limit(10);

    console.log('Total commandes dans la table:', allOrders?.length || 0);
    if (allOrdersError) {
      console.log('Erreur récupération toutes commandes:', allOrdersError);
    }

    // 3. Récupérer les commandes de l'utilisateur connecté
    let userOrders = [];
    let userOrdersError = null;
    
    if (user) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id);
      
      userOrders = data || [];
      userOrdersError = error;
      
      console.log('Commandes avec user_id:', userOrders.length);
    }

    // 4. Récupérer les commandes par email
    let emailOrders = [];
    let emailOrdersError = null;
    
    if (user?.email) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email);
      
      emailOrders = data || [];
      emailOrdersError = error;
      
      console.log('Commandes avec customer_email:', emailOrders.length);
    }

    return NextResponse.json({
      success: true,
      debug: {
        user: {
          authenticated: !!user,
          id: user?.id,
          email: user?.email
        },
        orders: {
          total_in_table: allOrders?.length || 0,
          by_user_id: userOrders.length,
          by_email: emailOrders.length
        },
        sample_orders: allOrders?.slice(0, 2) || [],
        errors: {
          auth: authError?.message,
          all_orders: allOrdersError?.message,
          user_orders: userOrdersError?.message,
          email_orders: emailOrdersError?.message
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur test orders:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors du test orders',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
} 