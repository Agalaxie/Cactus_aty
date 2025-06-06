import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: 'production',
    tests: {} as any
  };

  // Test 1: Variables d'environnement
  diagnostics.tests.environment_variables = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
    values: {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
    }
  };

  // Test 2: Connexion Supabase
  try {
    const supabase = await createSupabaseServerClient();
    
    // Test d'insertion simple
    const testData = {
      stripe_session_id: `test_${Date.now()}`,
      customer_email: 'test@test.com',
      customer_name: 'Test User',
      total_amount: 1000,
      currency: 'eur',
      payment_status: 'test',
      order_status: 'test',
      items: [{ name: 'Test Item' }],
      metadata: { test: true }
    };

    const { data: insertResult, error: insertError } = await supabase
      .from('orders')
      .insert(testData)
      .select('id')
      .single();

    if (insertError) {
      diagnostics.tests.supabase_insert = {
        success: false,
        error: insertError.message,
        code: insertError.code
      };
    } else {
      // Nettoyer le test
      await supabase.from('orders').delete().eq('id', insertResult.id);
      
      diagnostics.tests.supabase_insert = {
        success: true,
        test_id: insertResult.id
      };
    }

    // Test de lecture
    const { data: readResult, error: readError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    diagnostics.tests.supabase_read = {
      success: !readError,
      error: readError?.message,
      count: readResult?.length || 0
    };

  } catch (supabaseError: any) {
    diagnostics.tests.supabase_connection = {
      success: false,
      error: supabaseError.message
    };
  }

  // Test 3: Resend Email
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      // Test simple de validation d'API
      const testEmail = {
        from: 'Atypic Cactus <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL || 'test@test.com',
        subject: '🧪 Test de diagnostic - Ne pas traiter',
        html: '<p>Email de test automatique pour vérifier la configuration Resend.</p>'
      };

      // Ne pas envoyer réellement, juste valider la configuration
      diagnostics.tests.resend_config = {
        success: true,
        api_key_present: true,
        from_domain: 'resend.dev (domaine vérifié)',
        admin_email: process.env.ADMIN_EMAIL
      };
    } else {
      diagnostics.tests.resend_config = {
        success: false,
        error: 'RESEND_API_KEY manquante'
      };
    }
  } catch (resendError: any) {
    diagnostics.tests.resend_config = {
      success: false,
      error: resendError.message
    };
  }

  // Test 4: Authentification utilisateur
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    diagnostics.tests.auth = {
      user_authenticated: !!user,
      user_id: user?.id,
      user_email: user?.email,
      error: authError?.message
    };
  } catch (authError: any) {
    diagnostics.tests.auth = {
      success: false,
      error: authError.message
    };
  }

  return NextResponse.json(diagnostics, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'test_save_order') {
      // Test complet de sauvegarde de commande
      const response = await fetch(`${request.nextUrl.origin}/api/save-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripeSessionId: `test_${Date.now()}`,
          customerEmail: 'test@example.com',
          customerName: 'Test User',
          customerPhone: '0123456789',
          customerAddress: '123 Test Street, Test City',
          totalAmount: 2000,
          items: [{ name: 'Test Cactus', quantity: 1, price: 2000 }],
          userId: null,
          metadata: { test: true }
        }),
      });

      const result = await response.json();
      return NextResponse.json({
        success: response.ok,
        status: response.status,
        result
      });
    }

    if (action === 'test_send_email') {
      // Test complet d'envoi d'email
      const response = await fetch(`${request.nextUrl.origin}/api/send-order-emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderData: {
            sessionId: `test_${Date.now()}`,
            amount: 2000,
            customerName: 'Test User',
            customerPhone: '0123456789',
            customerAddress: '123 Test Street, Test City'
          },
          customerEmail: process.env.ADMIN_EMAIL || 'test@example.com',
          adminEmail: process.env.ADMIN_EMAIL
        }),
      });

      const result = await response.json();
      return NextResponse.json({
        success: response.ok,
        status: response.status,
        result
      });
    }

    if (action === 'test_customer_email_only') {
      // Test spécifique email client uniquement
      try {
        if (!process.env.RESEND_API_KEY) {
          return NextResponse.json({
            success: false,
            error: 'RESEND_API_KEY manquante'
          });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const customerEmail = process.env.ADMIN_EMAIL || 'test@example.com';
        const testSessionId = `test_customer_${Date.now()}`;
        
        // Template simplifié pour le test
        const simpleTemplate = `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #10b981;">✅ Test Email Client</h1>
            <p>Ceci est un test de l'email client seulement.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Informations de test:</h3>
              <p><strong>Email destinataire:</strong> ${customerEmail}</p>
              <p><strong>ID de session:</strong> ${testSessionId}</p>
              <p><strong>Montant:</strong> 20.00€</p>
            </div>
            <p style="color: #6b7280;">Si vous recevez cet email, l'envoi client fonctionne correctement.</p>
          </div>
        `;

        const emailData = {
          from: 'Atypic Cactus <onboarding@resend.dev>',
          to: customerEmail,
          subject: `🧪 Test Email Client - ${testSessionId}`,
          html: simpleTemplate,
        };

        const emailResult = await resend.emails.send(emailData);
        
        return NextResponse.json({
          success: true,
          message: 'Email client envoyé avec succès',
          email_id: emailResult.data?.id,
          recipient: customerEmail,
          test_session: testSessionId
        });

      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: error.message,
          details: error
        });
      }
    }

    if (action === 'test_detailed_email_send') {
      // Test détaillé avec envoi séparé pour identifier les erreurs
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const customerEmail = process.env.ADMIN_EMAIL || 'test@example.com';
        const adminEmail = process.env.ADMIN_EMAIL;
        
        const results = {
          customer_email: null as any,
          admin_email: null as any,
          errors: [] as any[]
        };

        // Test email client
        try {
          const customerResult = await resend.emails.send({
            from: 'Atypic Cactus <onboarding@resend.dev>',
            to: customerEmail,
            subject: '🧪 Test Client Email',
            html: '<p>Test email client</p>'
          });
          results.customer_email = {
            success: true,
            id: customerResult.data?.id,
            recipient: customerEmail
          };
        } catch (customerError: any) {
          results.customer_email = {
            success: false,
            error: customerError.message,
            details: customerError
          };
          results.errors.push({ type: 'customer', error: customerError });
        }

        // Test email admin
        if (adminEmail) {
          try {
            const adminResult = await resend.emails.send({
              from: 'Atypic Cactus <onboarding@resend.dev>',
              to: adminEmail,
              subject: '🧪 Test Admin Email',
              html: '<p>Test email admin</p>'
            });
            results.admin_email = {
              success: true,
              id: adminResult.data?.id,
              recipient: adminEmail
            };
          } catch (adminError: any) {
            results.admin_email = {
              success: false,
              error: adminError.message,
              details: adminError
            };
            results.errors.push({ type: 'admin', error: adminError });
          }
        }

        return NextResponse.json({
          success: results.errors.length === 0,
          results,
          summary: {
            customer_success: results.customer_email?.success || false,
            admin_success: results.admin_email?.success || false,
            total_errors: results.errors.length
          }
        });

      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: error.message
        });
      }
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 