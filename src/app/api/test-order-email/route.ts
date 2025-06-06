import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Données de test basées sur votre vraie commande
    const testOrderData = {
      sessionId: "cs_test_a1wLojoAn4uTax2vWm0WffdzH6PLhGlhY6U5owVehBCQWSQ6D6enDnPOKW",
      amount: 44000,
      customerName: "Stéphane Dumazert",
      customerPhone: "+33 7 89 51 90 00",
      customerAddress: "41 rue rempart villeneuve, Perpignan, 66100",
    };

    const customerEmail = "stephdumaz@gmail.com";
    const adminEmail = process.env.ADMIN_EMAIL;

    console.log('🧪 Test envoi email avec données réelles...');
    console.log('Customer email:', customerEmail);
    console.log('Admin email:', adminEmail);

    // Appeler l'API send-order-emails comme le fait verify-payment
    const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-order-emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderData: testOrderData,
        customerEmail,
        adminEmail
      }),
    });

    const emailResult = await emailResponse.json();

    console.log('Réponse API emails:', emailResult);

    return NextResponse.json({
      success: true,
      message: 'Test envoi email commande terminé',
      apiResponse: {
        status: emailResponse.status,
        ok: emailResponse.ok,
        data: emailResult
      },
      testData: {
        orderData: testOrderData,
        customerEmail,
        adminEmail
      }
    });

  } catch (error) {
    console.error('❌ Erreur test email commande:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors du test email commande',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
} 