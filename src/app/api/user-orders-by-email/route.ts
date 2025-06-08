import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Récupérer l'access token depuis les headers
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    const token = authorization.replace('Bearer ', '');
    
    // Créer un client Supabase avec le token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Vérifier l'authentification avec le token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.log('❌ Token invalide:', authError?.message);
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // SÉCURITÉ: Vérifier que l'email demandé correspond à l'utilisateur connecté
    if (email !== user.email) {
      console.log(`🚨 TENTATIVE D'ACCÈS NON AUTORISÉ: ${user.email} tente d'accéder aux commandes de ${email}`);
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    console.log('🔍 Récupération des commandes pour:', email);

    // Récupérer les commandes de l'utilisateur par email
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
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des commandes' },
        { status: 500 }
      );
    }

    console.log(`✅ ${orders?.length || 0} commandes trouvées pour ${email}`);

    return NextResponse.json({
      orders: orders || [],
      total: orders?.length || 0
    });

  } catch (error) {
    console.error('Erreur API user-orders-by-email:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 