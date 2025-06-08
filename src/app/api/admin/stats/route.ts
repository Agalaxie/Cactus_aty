import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Vérifier l'authentification admin (TEMPORAIREMENT DÉSACTIVÉ POUR DEBUG)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // TEMPORAIRE : Commenté pour permettre l'accès sans auth
    // if (authError || !user) {
    //   return NextResponse.json(
    //     { error: 'Non authentifié' },
    //     { status: 401 }
    //   );
    // }

    // Obtenir les statistiques générales
    const { data: totalOrders, error: totalError } = await supabase
      .from('orders')
      .select('id', { count: 'exact' });

    const { data: confirmedOrders, error: confirmedError } = await supabase
      .from('orders')
      .select('id', { count: 'exact' })
      .eq('order_status', 'confirmed');

    const { data: shippedOrders, error: shippedError } = await supabase
      .from('orders')
      .select('id', { count: 'exact' })
      .eq('order_status', 'shipped');

    const { data: deliveredOrders, error: deliveredError } = await supabase
      .from('orders')
      .select('id', { count: 'exact' })
      .eq('order_status', 'delivered');

    // Calcul du chiffre d'affaires total
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid');

    const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

    // Commandes récentes (dernières 24h)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { data: recentOrders, error: recentError } = await supabase
      .from('orders')
      .select('id', { count: 'exact' })
      .gte('created_at', yesterday.toISOString());

    // Commandes par statut
    const { data: statusBreakdown, error: statusError } = await supabase
      .from('orders')
      .select('order_status');

    const statusCounts = statusBreakdown?.reduce((acc: any, order) => {
      acc[order.order_status] = (acc[order.order_status] || 0) + 1;
      return acc;
    }, {}) || {};

    // Commandes des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: weeklyOrders, error: weeklyError } = await supabase
      .from('orders')
      .select('created_at, total_amount')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Grouper par jour
    const dailyStats = weeklyOrders?.reduce((acc: any, order) => {
      const date = new Date(order.created_at).toLocaleDateString('fr-FR');
      if (!acc[date]) {
        acc[date] = { count: 0, revenue: 0 };
      }
      acc[date].count += 1;
      acc[date].revenue += order.total_amount;
      return acc;
    }, {}) || {};

    if (totalError || confirmedError || shippedError || deliveredError || revenueError || recentError || statusError || weeklyError) {
      console.error('Erreur lors de la récupération des statistiques');
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: totalOrders?.length || 0,
        recentOrders: recentOrders?.length || 0,
        totalRevenue: (totalRevenue / 100).toFixed(2),
        averageOrderValue: totalOrders?.length ? (totalRevenue / totalOrders.length / 100).toFixed(2) : '0.00',
        statusBreakdown: {
          confirmed: confirmedOrders?.length || 0,
          shipped: shippedOrders?.length || 0,
          delivered: deliveredOrders?.length || 0,
          ...statusCounts
        },
        dailyStats
      }
    });

  } catch (error) {
    console.error('Erreur serveur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 