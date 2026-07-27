import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";

export async function POST(req: Request) {
  try {
    const { amount, planName } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { planName },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe Payment Intent Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
