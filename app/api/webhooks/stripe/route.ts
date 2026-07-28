import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Webhook verification failed";
    console.error(`❌ Webhook Error: ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const userId = paymentIntent.metadata.userId;
    const planName = paymentIntent.metadata.planName || "Subscription Plan";
    const amount = paymentIntent.amount / 100;

    if (userId) {
      const { error: historyError } = await supabase
        .from("payment_history")
        .insert({
          user_id: userId,
          amount: amount,
          plan_name: planName,
          status: "SUCCESS",
          transaction_id: paymentIntent.id,
        });

      if (historyError) {
        console.error("Supabase History Insert Error:", historyError.message);
      }

      const { error: userError } = await supabase
        .from("profiles")
        .update({
          is_subscribed: true,
          current_plan: planName,
        })
        .eq("id", userId);

      if (userError) {
        console.error("Supabase User Update Error:", userError.message);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
