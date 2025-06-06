import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Email pour le client
    const customerEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #4ade80, #10b981); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <div style="background: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #10b981; font-size: 30px;">✓</span>
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px;">Commande confirmée !</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Merci pour votre achat chez Atypic Cactus</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Bonjour ${customerName},</h2>
          
          <p style="color: #6b7280; line-height: 1.6;">
            Votre commande a été validée avec succès ! Nous préparons vos cactus avec soin pour un envoi sous 24-48h.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px;">Récapitulatif de commande</h3>
            <p style="margin: 5px 0; color: #6b7280;"><strong>N° de commande :</strong> ${sessionId}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Montant total :</strong> ${(amount / 100).toFixed(2)}€</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Email :</strong> ${customerEmail}</p>
            ${customerPhone ? `<p style="margin: 5px 0; color: #6b7280;"><strong>Téléphone :</strong> ${customerPhone}</p>` : ''}
          </div>
          
          ${customerAddress ? `
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px;">Adresse de livraison</h3>
            <p style="margin: 5px 0; color: #6b7280;">${customerAddress}</p>
          </div>
          ` : ''}
          
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #065f46; margin: 0 0 10px;">🚚 Suivi de livraison</h3>
            <p style="color: #047857; margin: 0; font-size: 14px;">
              Vous recevrez un email avec le numéro de suivi dès l'expédition de votre commande.
            </p>
          </div>
          
                     <div style="text-align: center; margin: 30px 0;">
             <a href="${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001'}" 
                style="background: linear-gradient(135deg, #4ade80, #10b981); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
               Continuer mes achats
             </a>
           </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 14px; text-align: center;">
            Des questions ? Répondez à cet email ou contactez-nous à support@atypic-cactus.fr<br>
            Merci de faire confiance à Atypic Cactus ! 🌵
          </p>
        </div>
      </div>
    `;

    // Email pour l'admin
    const adminEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛒 Nouvelle commande !</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Une nouvelle commande vient d'être passée</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Détails de la commande</h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px;">Informations client</h3>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Nom :</strong> ${customerName}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Email :</strong> ${customerEmail}</p>
            ${customerPhone ? `<p style="margin: 5px 0; color: #6b7280;"><strong>Téléphone :</strong> ${customerPhone}</p>` : ''}
            ${customerAddress ? `<p style="margin: 5px 0; color: #6b7280;"><strong>Adresse :</strong> ${customerAddress}</p>` : ''}
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px;">Détails de commande</h3>
            <p style="margin: 5px 0; color: #6b7280;"><strong>N° de session :</strong> ${sessionId}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Montant total :</strong> ${(amount / 100).toFixed(2)}€</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Status :</strong> <span style="color: #10b981;">Payé</span></p>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px;">⚡ Action requise</h3>
            <p style="color: #d97706; margin: 0; font-size: 14px;">
              Cette commande doit être préparée et expédiée sous 24-48h.
            </p>
          </div>
          
                     <div style="text-align: center; margin: 30px 0;">
             <a href="${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001'}/admin" 
                style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
               Gérer les commandes
             </a>
           </div>
        </div>
      </div>
    `;

    const emails = [];
    const results = [];

    // Email client (priorité 1)
    try {
      const customerEmailData = {
        from: 'Atypic Cactus <onboarding@resend.dev>',
        to: customerEmail,
        subject: `✅ Commande confirmée - ${sessionId}`,
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

    // Délai pour éviter rate limit (1 seconde)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Email admin (priorité 2)
    if (adminEmail) {
      try {
        const adminEmailData = {
          from: 'Atypic Cactus <onboarding@resend.dev>',
          to: adminEmail,
          subject: `🛒 Nouvelle commande - ${(amount / 100).toFixed(2)}€`,
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
          success: successes.length > 0, // Succès partiel si au moins un email est passé
          error: failures.length === results.length ? 'Tous les emails ont échoué' : 'Erreur partielle lors de l\'envoi des emails',
          details: { successes, failures },
          sent: successes.length,
          failed: failures.length
        },
        { status: successes.length > 0 ? 207 : 500 } // Multi-status ou erreur complète
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