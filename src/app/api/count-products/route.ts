import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Erreur comptage produits:', error);
      return NextResponse.json({ 
        error: 'Erreur lors du comptage des produits',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      count: count || 0,
      message: `${count || 0} produits trouvés dans la base de données`
    });

  } catch (error) {
    console.error('Erreur lors du comptage:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur lors du comptage',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 