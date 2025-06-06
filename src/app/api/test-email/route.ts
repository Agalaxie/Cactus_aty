import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test de configuration email...');
    console.log('RESEND_API_KEY configuré:', !!process.env.RESEND_API_KEY);
    console.log('ADMIN_EMAIL configuré:', !!process.env.ADMIN_EMAIL);

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY manquant dans .env.local'
      });
    }

    // Test d'envoi simple
    const testEmail = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>', // Email de test Resend
      to: process.env.ADMIN_EMAIL || 'test@example.com',
      subject: '🧪 Test email Cactus Shop',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #10b981;">✅ Test email réussi !</h1>
          <p>Cet email confirme que Resend fonctionne correctement.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Email de test envoyé avec succès',
      emailId: testEmail.data?.id,
      config: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
        adminEmail: process.env.ADMIN_EMAIL
      }
    });

  } catch (error) {
    console.error('❌ Erreur test email:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors du test email',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
} 