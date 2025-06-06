import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Désactiver temporairement RLS pour voir toutes les commandes
    const { data: ordersRaw, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(5);

    if (ordersError) {
      console.error('Erreur ordersRaw:', ordersError);
    }

    // Récupérer les utilisateurs pour debug
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    const { data: authUsers, error: usersError } = await supabase
      .from('auth.users')
      .select('id, email')
      .limit(3);

    if (usersError) {
      console.error('Erreur users:', usersError);
    }

    return NextResponse.json({
      success: true,
      currentUser: user ? { id: user.id, email: user.email } : null,
      ordersRaw: ordersRaw || [],
      authUsers: authUsers || [],
      errors: {
        orders: ordersError?.message,
        auth: authError?.message,
        users: usersError?.message
      }
    });

  } catch (error) {
    console.error('Erreur complète:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur',
      details: error
    });
  }
} 