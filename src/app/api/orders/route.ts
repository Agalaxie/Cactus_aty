import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getUserOrders } from '@/lib/db';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier et décoder le token
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as number;

    if (!userId) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Récupérer les commandes
    const orders = await getUserOrders(userId);

    // Formatter les données pour le frontend
    const formattedOrders = orders.map(order => ({
      id: order.order_number,
      date: new Date(order.created_at).toLocaleDateString('fr-FR'),
      status: getStatusInFrench(order.status),
      total: parseFloat(order.total),
      items: order.items || [],
      trackingNumber: order.tracking_number
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

function getStatusInFrench(status: string): 'En préparation' | 'Expédiée' | 'Livrée' {
  switch (status) {
    case 'pending':
    case 'processing':
      return 'En préparation';
    case 'shipped':
      return 'Expédiée';
    case 'delivered':
      return 'Livrée';
    default:
      return 'En préparation';
  }
} 