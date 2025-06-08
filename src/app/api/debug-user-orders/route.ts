import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Vérifier l'authentification avec détails
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('🔍 Debug user-orders:');
    console.log('User:', user);
    console.log('Auth Error:', authError);
    console.log('User Email:', user?.email);
    
    // Récupérer les commandes pour neuromz@outlook.com
    const { data: testOrders, error: testError } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', 'neuromz@outlook.com');

    console.log('Commandes neuromz@outlook.com:', testOrders?.length);
    
    // Récupérer les commandes par user.email si connecté
    let userOrders = [];
    let userError = null;
    
    if (user?.email) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email);
      
      userOrders = data || [];
      userError = error;
      
      console.log(`Commandes pour ${user.email}:`, userOrders.length);
    }

    return NextResponse.json({
      success: true,
      debug: {
        isAuthenticated: !!user,
        userEmail: user?.email,
        userId: user?.id,
        authError: authError?.message,
        testOrdersCount: testOrders?.length || 0,
        userOrdersCount: userOrders.length,
        userError: userError?.message
      },
      testOrders: testOrders || [],
      userOrders: userOrders,
      rawUser: user
    });

  } catch (error) {
    console.error('Erreur debug user-orders:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur',
      details: error
    });
  }
} 