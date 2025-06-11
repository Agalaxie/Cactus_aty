import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { orderData, customerEmail, trackingNumber, carrier = 'Colissimo' } = await request.json();

    if (!orderData || !customerEmail || !trackingNumber) {
      return NextResponse.json(
        { error: 'Données manquantes pour l\'email d\'expédition' },
        { status: 400 }
      );
    }

    const {
      sessionId,
      amount,
      customerName,
      customerAddress,
      items = []
    } = orderData;

    // Template email d'expédition
    const shippingEmailTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header expédition -->
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.5;"></div>
          
          <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); position: relative; z-index: 1;">
            <span style="color: #f59e0b; font-size: 36px;">📦</span>
          </div>
          
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; position: relative; z-index: 1;">
            Votre commande est expédiée !
          </h1>
          <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0; font-size: 16px; position: relative; z-index: 1;">
            Vos cactus sont en route vers vous ! 🌵
          </p>
        </div>
        
        <!-- Corps principal -->
        <div style="padding: 40px 30px;">
          <!-- Numéro de suivi mis en avant -->
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 30px; border-radius: 15px; margin-bottom: 30px; text-align: center; border: 2px solid #f59e0b;">
            <h2 style="color: #92400e; margin: 0 0 15px; font-size: 24px;">📋 Numéro de suivi</h2>
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 15px 0;">
              <code style="font-size: 20px; font-weight: bold; color: #1f2937; letter-spacing: 1px;">${trackingNumber}</code>
            </div>
            <p style="color: #a16207; margin: 15px 0 0; font-size: 16px;">
              Transporteur : <strong>${carrier}</strong>
            </p>
          </div>
          
          <!-- Informations de livraison -->
          <div style="background: #f0f9ff; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #0ea5e9;">
            <h3 style="color: #0c4a6e; margin: 0 0 20px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">🚚</span> Informations de livraison
            </h3>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <div style="grid-template-columns: 1fr 1fr; gap: 20px; display: grid;">
                <div>
                  <p style="margin: 10px 0; color: #1e293b;"><strong>Commande :</strong><br>#${sessionId.slice(-8)}</p>
                  <p style="margin: 10px 0; color: #1e293b;"><strong>Client :</strong><br>${customerName || customerEmail}</p>
                </div>
                <div>
                  <p style="margin: 10px 0; color: #1e293b;"><strong>Délai estimé :</strong><br>2-3 jours ouvrés</p>
                  <p style="margin: 10px 0; color: #1e293b;"><strong>Montant :</strong><br>${(amount / 100).toFixed(2)}€</p>
                </div>
              </div>
              ${customerAddress ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #1e293b;"><strong>📍 Adresse de livraison :</strong></p>
                <p style="margin: 10px 0; color: #475569; background: #f8fafc; padding: 15px; border-radius: 6px;">${customerAddress}</p>
              </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Étapes de livraison -->
          <div style="background: #f0fdf4; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #16a34a;">
            <h3 style="color: #166534; margin: 0 0 20px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">📍</span> Suivi de votre colis
            </h3>
            <div style="space-y: 15px;">
              <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: white; border-radius: 8px;">
                <div style="width: 12px; height: 12px; background: #16a34a; border-radius: 50%; flex-shrink: 0;"></div>
                <div>
                  <p style="margin: 0; font-weight: 600; color: #166534;">✅ Colis expédié</p>
                  <p style="margin: 5px 0 0; color: #475569; font-size: 14px;">Votre commande a quitté notre entrepôt</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: #f8fafc; border-radius: 8px; opacity: 0.7;">
                <div style="width: 12px; height: 12px; background: #94a3b8; border-radius: 50%; flex-shrink: 0;"></div>
                <div>
                  <p style="margin: 0; font-weight: 600; color: #64748b;">🚛 En transit</p>
                  <p style="margin: 5px 0 0; color: #64748b; font-size: 14px;">Votre colis est en cours d'acheminement</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: #f8fafc; border-radius: 8px; opacity: 0.7;">
                <div style="width: 12px; height: 12px; background: #94a3b8; border-radius: 50%; flex-shrink: 0;"></div>
                <div>
                  <p style="margin: 0; font-weight: 600; color: #64748b;">🏠 Livraison</p>
                  <p style="margin: 5px 0 0; color: #64748b; font-size: 14px;">Remise à votre adresse</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Conseils d'entretien -->
          <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #065f46; margin: 0 0 15px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">🌵</span> Conseils pour l'arrivée de vos cactus
            </h3>
            <ul style="color: #047857; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li style="margin-bottom: 8px;">Déballez délicatement vos cactus dès réception</li>
              <li style="margin-bottom: 8px;">Placez-les dans un endroit lumineux mais à l'abri du soleil direct</li>
              <li style="margin-bottom: 8px;">Attendez 3-4 jours avant le premier arrosage</li>
              <li style="margin-bottom: 8px;">En cas de problème, contactez-nous immédiatement</li>
            </ul>
          </div>
          
          <!-- Boutons d'action -->
          <div style="text-align: center; margin: 40px 0; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <a href="https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}" 
               style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
              📦 Suivre mon colis
            </a>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001'}" 
               style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
              🌵 Découvrir d'autres cactus
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; text-align: center; border-top: 1px solid #e5e7eb;">
          <div style="margin-bottom: 20px;">
            <h3 style="color: #1f2937; margin: 0 0 10px; font-size: 18px;">🌵 Atypic Cactus</h3>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Votre spécialiste des cactus et plantes succulentes</p>
          </div>
          
          <div style="margin: 20px 0; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="color: #374151; margin: 0 0 10px; font-weight: 500;">📞 Besoin d'aide ?</p>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              📧 support@atypic-cactus.fr<br>
              💬 Répondez simplement à cet email<br>
              🕒 Nous répondons sous 24h maximum
            </p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Atypic Cactus - Depuis 2020, nous cultivons votre passion pour les cactus 🌵<br>
              Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.
            </p>
          </div>
        </div>
      </div>
    `;

    // Envoi de l'email
    try {
      const emailData = {
        from: 'Atypic Cactus <onboarding@resend.dev>',
        to: customerEmail,
        subject: `📦 Votre commande #${sessionId.slice(-8)} est expédiée ! Suivi: ${trackingNumber}`,
        html: shippingEmailTemplate,
      };
      
      const result = await resend.emails.send(emailData);
      
      console.log('✅ Email d\'expédition envoyé:', result.data?.id);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email d\'expédition envoyé avec succès',
        emailId: result.data?.id,
        trackingNumber,
        carrier
      });
      
    } catch (error: any) {
      console.error('❌ Erreur email d\'expédition:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erreur lors de l\'envoi de l\'email d\'expédition',
          details: error.message 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email d\'expédition:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email d\'expédition' },
      { status: 500 }
    );
  }
} 