import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Test de connexion Supabase...');
    
    // Vérifier les variables d'environnement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Variables d\'environnement Supabase manquantes',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined'
        }
      }, { status: 500 });
    }

    // Test de connexion simple
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Erreur de connexion Supabase',
        details: {
          message: error.message,
          code: error.code,
          hint: error.hint
        }
      }, { status: 500 });
    }

    // Test du nombre total de produits
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      message: 'Connexion Supabase réussie',
      data: {
        connected: true,
        productCount: count || 0,
        hasTable: !countError
      }
    });

  } catch (error) {
    console.error('❌ Erreur test Supabase:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors du test de connexion',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 