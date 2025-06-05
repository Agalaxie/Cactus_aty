import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Comment out or remove the global Stripe initialization
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-05-28.basil",
// });

export async function POST(req: NextRequest) {
  try {
    // Initialize Stripe inside the POST function
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-05-28.basil",
    });

    const { quantity = 1 } = await req.json();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Euphorbia Ingens XXL",
              description: "Cactus rare de plus de 1,8 mètre, livraison sécurisée.",
              images: [
                "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80",
              ],
            },
            unit_amount: 34900, // 349€
          },
          quantity,
        },
      ],
      success_url: `${req.nextUrl.origin}/success`,
      cancel_url: `${req.nextUrl.origin}/produit`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "An unknown error occurred" }, { status: 500 });
  }
} 