import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rawAmount =
      typeof body?.amount === "number" ? body.amount : Number(body?.amount);

    if (isNaN(rawAmount) || rawAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid or missing amount." },
        { status: 400 },
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(rawAmount * 100),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: "gym_hero_subscription_test",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create PaymentIntent" },
      { status: 500 },
    );
  }
}
