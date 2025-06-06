import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Script SQL pour créer la table orders
    const createTableSQL = `
      -- Table pour stocker les commandes
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
        user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        customer_phone VARCHAR(50),
        customer_address TEXT,
        total_amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'eur',
        payment_status VARCHAR(50) DEFAULT 'pending',
        order_status VARCHAR(50) DEFAULT 'confirmed',
        items JSONB NOT NULL,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Index pour les recherches fréquentes
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
      CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

      -- Activer RLS
      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

      -- Politique : Les utilisateurs peuvent voir leurs propres commandes
      DROP POLICY IF EXISTS "Users can view own orders" ON orders;
      CREATE POLICY "Users can view own orders" ON orders
        FOR SELECT USING (auth.uid() = user_id);

      -- Politique : Insertion permise pour les utilisateurs authentifiés
      DROP POLICY IF EXISTS "Users can insert orders" ON orders;
      CREATE POLICY "Users can insert orders" ON orders
        FOR INSERT WITH CHECK (true);
    `;

    // Exécuter le script (note: en production, utilisez des migrations appropriées)
    const { error } = await supabase.rpc('exec_sql', { 
      sql_string: createTableSQL 
    });

    if (error) {
      console.error('Erreur lors de la création de la table:', error);
      
      // Essayer une approche alternative : créer manuellement
      try {
        // On ne peut pas exécuter du SQL brut via l'API Supabase client
        // Il faut le faire via le dashboard Supabase ou des migrations
        return NextResponse.json({
          success: false,
          error: 'La table doit être créée manuellement dans le dashboard Supabase',
          sql: createTableSQL,
          message: 'Copiez le SQL ci-dessus et exécutez-le dans l\'éditeur SQL de Supabase'
        });
      } catch (fallbackError) {
        return NextResponse.json(
          { error: 'Erreur lors de la création de la table' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Table orders créée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'initialisation' },
      { status: 500 }
    );
  }
} 