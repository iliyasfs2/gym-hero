import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
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
    console.error(`❌ Webhook Verification Error: ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  console.log(`🔔 Event received: ${event.type}`);

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    console.log("💳 PaymentIntent Metadata:", paymentIntent.metadata);

    const userId = paymentIntent.metadata?.userId;
    const planName = paymentIntent.metadata?.planName || "Subscription Plan";
    const durationNum =
      parseInt(paymentIntent.metadata?.duration || "1", 10) || 1;
    const amount = paymentIntent.amount / 100;

    if (!userId) {
      console.error("❌ ERROR: userId is missing in paymentIntent metadata!");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    console.log(`👤 Processing subscription for userId: ${userId}`);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + durationNum);

    const { data: subData, error: subError } = await supabase
      .from("user_subscriptions")
      .insert({
        user_id: userId,
        plan_name: planName,
        amount: amount,
        duration_months: durationNum,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: "Active",
      })
      .select();

    if (subError) {
      console.error("❌ Supabase Subscription Insert Error:", subError.message);
    } else {
      console.log("🎉 Successfully inserted subscription:", subData);
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();

    const { error: paymentError } = await supabase.from("payments").insert({
      member_name: profileData?.full_name || "Unknown Member",
      amount: amount,
      method: "Online",
      status: "Paid",
      invoice_no: `SUB-${paymentIntent.id.slice(-8).toUpperCase()}`,
    });

    if (paymentError) {
      console.error("❌ Supabase Payments Insert Error:", paymentError.message);
    } else {
      console.log("🎉 Successfully inserted into payments table");
    }

    const { error: memberSyncError } = await supabase
      .from("members")
      .update({
        plan_name: planName,
        price: amount,
        status: "active",
      })
      .eq("user_id", userId);

    if (memberSyncError) {
      console.error("❌ Supabase Members Sync Error:", memberSyncError.message);
    } else {
      console.log("🎉 Successfully synced members table with new plan");
    }

    const { error: userError } = await supabase
      .from("profiles")
      .update({
        is_subscribed: true,
        current_plan: planName,
      })
      .eq("id", userId);

    if (userError) {
      console.error("❌ Supabase User Update Error:", userError.message);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
