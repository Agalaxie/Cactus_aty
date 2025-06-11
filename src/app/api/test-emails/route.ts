import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { emailType = 'all', customerEmail } = await request.json();

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Email client requis pour le test' },
        { status: 400 }
      );
    }

    // Données de test
    const testOrderData = {
      sessionId: "cs_test_" + Date.now(),
      amount: 4500, // 45€
      customerName: "Léa Dupont",
      customerPhone: "+33 6 12 34 56 78",
      customerAddress: "123 Rue des Cactus, 75001 Paris",
      items: [
        {
          description: "Echeveria elegans 'Poule et Poussins'",
          quantity: 2,
          amount_total: 2400,
          price: 2400
        },
        {
          description: "Cactus Barrel doré (Echinocactus grusonii)",
          quantity: 1,
          amount_total: 2100,
          price: 2100
        }
      ]
    };

    const results = [];

    // Test email de commande
    if (emailType === 'all' || emailType === 'order') {
      try {
        const orderResponse = await fetch(`${request.nextUrl.origin}/api/send-order-emails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderData: testOrderData,
            customerEmail,
            adminEmail: process.env.ADMIN_EMAIL
          }),
        });

        const orderResult = await orderResponse.json();
        results.push({
          type: 'order',
          success: orderResponse.ok,
          result: orderResult
        });
      } catch (error) {
        results.push({
          type: 'order',
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }

    // Délai entre les emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test email d'expédition
    if (emailType === 'all' || emailType === 'shipping') {
      try {
        const shippingResponse = await fetch(`${request.nextUrl.origin}/api/send-shipping-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderData: testOrderData,
            customerEmail,
            trackingNumber: "1Z999AA1234567890",
            carrier: "Colissimo"
          }),
        });

        const shippingResult = await shippingResponse.json();
        results.push({
          type: 'shipping',
          success: shippingResponse.ok,
          result: shippingResult
        });
      } catch (error) {
        results.push({
          type: 'shipping',
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }

    // Délai entre les emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test email de livraison
    if (emailType === 'all' || emailType === 'delivery') {
      try {
        const deliveryResponse = await fetch(`${request.nextUrl.origin}/api/send-delivery-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderData: testOrderData,
            customerEmail,
            deliveryDate: new Date().toISOString()
          }),
        });

        const deliveryResult = await deliveryResponse.json();
        results.push({
          type: 'delivery',
          success: deliveryResponse.ok,
          result: deliveryResult
        });
      } catch (error) {
        results.push({
          type: 'delivery',
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return NextResponse.json({
      success: successCount > 0,
      message: `Test terminé : ${successCount}/${totalCount} emails envoyés avec succès`,
      emailType,
      customerEmail,
      results,
      testData: testOrderData
    });

  } catch (error) {
    console.error('Erreur test emails:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors du test des emails',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint de test des emails',
    usage: {
      method: 'POST',
      body: {
        customerEmail: 'test@example.com (requis)',
        emailType: 'all | order | shipping | delivery (optionnel, défaut: all)'
      }
    },
    available_types: [
      {
        type: 'order',
        description: 'Email de confirmation de commande (client + admin)'
      },
      {
        type: 'shipping',
        description: 'Email d\'expédition avec numéro de suivi'
      },
      {
        type: 'delivery',
        description: 'Email de confirmation de livraison avec demande d\'avis'
      },
      {
        type: 'all',
        description: 'Tous les emails dans l\'ordre (avec délais)'
      }
    ]
  });
} 