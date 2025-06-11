import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Template pour l'affichage des produits
function generateProductsHTML(items: any[] = []) {
  if (!items.length) return '';
  
  return `
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #1f2937; margin: 0 0 15px;">🛒 Produits commandés</h3>
      <div style="space-y: 10px;">
        ${items.map(item => `
          <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1;">
              <p style="margin: 0; font-weight: bold; color: #1f2937;">${item.description || item.name || 'Produit'}</p>
              <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">Quantité: ${item.quantity || 1}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: bold; color: #059669;">${((item.amount_total || item.price || 0) / 100).toFixed(2)}€</p>
              ${item.quantity > 1 ? `<p style="margin: 5px 0 0; color: #6b7280; font-size: 12px;">${((item.amount_total || item.price || 0) / 100 / item.quantity).toFixed(2)}€ /unité</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Template de footer modernisé
function generateFooter() {
  return `
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
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { orderData, customerEmail, adminEmail } = await request.json();

    if (!orderData || !customerEmail) {
      return NextResponse.json(
        { error: 'Données de commande manquantes' },
        { status: 400 }
      );
    }

    const {
      sessionId,
      amount,
      customerName,
      customerPhone,
      customerAddress,
      items = []
    } = orderData;

    // Template modernisé pour le client
    const customerEmailTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header avec gradient moderne -->
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.5;"></div>
          <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.7;"></div>
          
          <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); position: relative; z-index: 1;">
            <span style="color: #10b981; font-size: 36px; font-weight: bold;">✓</span>
          </div>
          
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; position: relative; z-index: 1;">
            Commande confirmée !
          </h1>
          <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0; font-size: 16px; position: relative; z-index: 1;">
            Merci ${customerName ? customerName : ''} pour votre confiance ! 🌵
          </p>
        </div>
        
        <!-- Corps principal -->
        <div style="padding: 40px 30px;">
          <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 25px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #10b981;">
            <h2 style="color: #065f46; margin: 0 0 10px; font-size: 20px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">🎉</span> Votre commande est validée !
            </h2>
            <p style="color: #047857; margin: 0; line-height: 1.6;">
              Vos cactus sont entre de bonnes mains ! Notre équipe prépare votre commande avec le plus grand soin pour une expédition sous <strong>24-48 heures</strong>.
            </p>
          </div>
          
          <!-- Récapitulatif de commande -->
          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #e2e8f0;">
            <h3 style="color: #1e293b; margin: 0 0 20px; font-size: 18px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">📋</span> Récapitulatif de commande
            </h3>
            <div style="grid-template-columns: 1fr 1fr; gap: 15px; display: grid;">
              <div>
                <p style="margin: 8px 0; color: #475569;"><strong>N° de commande :</strong><br><code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${sessionId}</code></p>
                <p style="margin: 8px 0; color: #475569;"><strong>Email :</strong><br>${customerEmail}</p>
              </div>
              <div>
                <p style="margin: 8px 0; color: #475569;"><strong>Montant total :</strong><br><span style="font-size: 24px; font-weight: bold; color: #059669;">${(amount / 100).toFixed(2)}€</span></p>
                ${customerPhone ? `<p style="margin: 8px 0; color: #475569;"><strong>Téléphone :</strong><br>${customerPhone}</p>` : ''}
              </div>
            </div>
          </div>
          
          ${generateProductsHTML(items)}
          
          ${customerAddress ? `
          <div style="background: #fefce8; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #fde047; border-left: 4px solid #eab308;">
            <h3 style="color: #a16207; margin: 0 0 15px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">📦</span> Adresse de livraison
            </h3>
            <div style="background: white; padding: 15px; border-radius: 8px; color: #374151; line-height: 1.5;">
              ${customerAddress}
            </div>
          </div>
          ` : ''}
          
          <!-- Info suivi -->
          <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #93c5fd;">
            <h3 style="color: #1e40af; margin: 0 0 15px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">🚚</span> Suivi de votre commande
            </h3>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
              <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
              <span style="color: #1e40af; font-weight: 500;">Commande confirmée</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; opacity: 0.6;">
              <div style="width: 8px; height: 8px; background: #6b7280; border-radius: 50%;"></div>
              <span style="color: #374151;">Préparation en cours</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; opacity: 0.6;">
              <div style="width: 8px; height: 8px; background: #6b7280; border-radius: 50%;"></div>
              <span style="color: #374151;">Expédition</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; opacity: 0.6;">
              <div style="width: 8px; height: 8px; background: #6b7280; border-radius: 50%;"></div>
              <span style="color: #374151;">Livraison</span>
            </div>
            <p style="color: #1e40af; margin: 15px 0 0; font-size: 14px; background: white; padding: 10px; border-radius: 6px;">
              💌 Vous recevrez un email avec le numéro de suivi dès l'expédition de votre commande.
            </p>
          </div>
          
          <!-- Bouton d'action -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001'}" 
               style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
              🌵 Découvrir d'autres cactus
            </a>
          </div>
        </div>
        
        ${generateFooter()}
      </div>
    `;

    // Template amélioré pour l'admin
    const adminEmailTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header admin -->
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -30px; right: -30px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          
          <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <span style="color: #3b82f6; font-size: 36px;">🛒</span>
          </div>
          
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Nouvelle commande !</h1>
          <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0; font-size: 16px;">
            💰 ${(amount / 100).toFixed(2)}€ • ${new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
        
        <!-- Corps admin -->
        <div style="padding: 30px;">
          <!-- Alerte action requise -->
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 10px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">⚡</span> Action requise
            </h3>
            <p style="color: #d97706; margin: 0; font-weight: 500;">
              Cette commande doit être préparée et expédiée sous 24-48h.
            </p>
          </div>
          
          <!-- Infos client -->
          <div style="background: #f1f5f9; padding: 25px; border-radius: 12px; margin: 25px 0;">
            <h3 style="color: #1e293b; margin: 0 0 20px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">👤</span> Informations client
            </h3>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <div style="grid-template-columns: 1fr 1fr; gap: 15px; display: grid;">
                <div>
                  <p style="margin: 10px 0; color: #475569;"><strong>Nom :</strong><br>${customerName || 'Non renseigné'}</p>
                  <p style="margin: 10px 0; color: #475569;"><strong>Email :</strong><br><a href="mailto:${customerEmail}" style="color: #2563eb; text-decoration: none;">${customerEmail}</a></p>
                </div>
                <div>
                  ${customerPhone ? `<p style="margin: 10px 0; color: #475569;"><strong>Téléphone :</strong><br><a href="tel:${customerPhone}" style="color: #2563eb; text-decoration: none;">${customerPhone}</a></p>` : '<p style="margin: 10px 0; color: #9ca3af;">Téléphone non renseigné</p>'}
                </div>
              </div>
              ${customerAddress ? `
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #475569;"><strong>Adresse de livraison :</strong><br>${customerAddress}</p>
              </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Détails commande -->
          <div style="background: #f0fdf4; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #bbf7d0;">
            <h3 style="color: #15803d; margin: 0 0 20px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">📊</span> Détails de commande
            </h3>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <div style="grid-template-columns: 1fr 1fr; gap: 15px; display: grid;">
                <div>
                  <p style="margin: 10px 0; color: #374151;"><strong>N° de session :</strong><br><code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${sessionId}</code></p>
                  <p style="margin: 10px 0; color: #374151;"><strong>Statut paiement :</strong><br><span style="color: #10b981; font-weight: bold;">✅ Payé</span></p>
                </div>
                <div>
                  <p style="margin: 10px 0; color: #374151;"><strong>Montant :</strong><br><span style="font-size: 24px; font-weight: bold; color: #059669;">${(amount / 100).toFixed(2)}€</span></p>
                  <p style="margin: 10px 0; color: #374151;"><strong>Date :</strong><br>${new Date().toLocaleString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </div>
          
          ${generateProductsHTML(items)}
          
          <!-- Boutons d'action admin -->
          <div style="text-align: center; margin: 30px 0; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001'}/admin" 
               style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
              🎛️ Dashboard Admin
            </a>
            <a href="mailto:${customerEmail}?subject=Votre commande ${sessionId}&body=Bonjour ${customerName || ''},%0D%0A%0D%0AConcernant votre commande ${sessionId}..." 
               style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
              ✉️ Contacter client
            </a>
          </div>
        </div>
        
        <!-- Footer admin -->
        <div style="background: #f8fafc; padding: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #64748b; margin: 0; font-size: 14px;">
            🤖 Email automatique • Admin Atypic Cactus • ${new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    `;

    const results = [];

    // Email client (priorité 1)
    try {
      const customerEmailData = {
        from: 'Atypic Cactus <onboarding@resend.dev>',
        to: customerEmail,
        subject: `✅ Commande confirmée #${sessionId.slice(-8)} - ${(amount / 100).toFixed(2)}€`,
        html: customerEmailTemplate,
      };
      
      const customerResult = await resend.emails.send(customerEmailData);
      results.push({ 
        type: 'customer', 
        success: true, 
        id: customerResult.data?.id,
        recipient: customerEmail 
      });
      
      console.log('✅ Email client envoyé:', customerResult.data?.id);
      
    } catch (customerError: any) {
      console.error('❌ Erreur email client:', customerError);
      results.push({ 
        type: 'customer', 
        success: false, 
        error: customerError.message 
      });
    }

    // Délai pour éviter rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Email admin (priorité 2)
    if (adminEmail) {
      try {
        const adminEmailData = {
          from: 'Atypic Cactus <onboarding@resend.dev>',
          to: adminEmail,
          subject: `🛒 Nouvelle commande #${sessionId.slice(-8)} - ${(amount / 100).toFixed(2)}€ - ${customerName || customerEmail}`,
          html: adminEmailTemplate,
        };
        
        const adminResult = await resend.emails.send(adminEmailData);
        results.push({ 
          type: 'admin', 
          success: true, 
          id: adminResult.data?.id,
          recipient: adminEmail 
        });
        
        console.log('✅ Email admin envoyé:', adminResult.data?.id);
        
      } catch (adminError: any) {
        console.error('❌ Erreur email admin:', adminError);
        results.push({ 
          type: 'admin', 
          success: false, 
          error: adminError.message 
        });
      }
    }

    // Vérifier les résultats
    const failures = results.filter(result => !result.success);
    const successes = results.filter(result => result.success);
    
    if (failures.length > 0) {
      console.error('Erreurs d\'envoi email:', failures);
      return NextResponse.json(
        { 
          success: successes.length > 0,
          error: failures.length === results.length ? 'Tous les emails ont échoué' : 'Erreur partielle lors de l\'envoi des emails',
          details: { successes, failures },
          sent: successes.length,
          failed: failures.length
        },
        { status: successes.length > 0 ? 207 : 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Emails envoyés avec succès',
      sent: results.length,
      details: results
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi des emails:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi des emails' },
      { status: 500 }
    );
  }
} 