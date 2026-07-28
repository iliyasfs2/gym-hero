import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  try {
    const { amount, planName, userId } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 },
      );
    }

   
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: userId || "guest_user",
        planName: planName || "Subscription Plan",
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Checkout API Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
