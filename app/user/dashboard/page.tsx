import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardOverview from "@/app/user/dashboard/components/DashboardOverview";

export default async function UserPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, height, weight, role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: latestSubscription } = await supabase
    .from("user_subscriptions")
    .select("plan_name, start_date, end_date")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  let subscriptionStatus: "active" | "expired" = "expired";
  let daysLeft = 0;

  if (latestSubscription?.end_date) {
    const endDate = new Date(latestSubscription.end_date);
    const now = new Date();
    if (endDate > now) {
      subscriptionStatus = "active";
      daysLeft = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
    }
  }

  const profileData = {
    full_name: profile?.full_name || user.user_metadata?.full_name || "Athlete",
    subscription_status: subscriptionStatus,
    days_left: daysLeft,
    height: profile?.height || undefined,
    weight: profile?.weight || undefined,
    plan_name: latestSubscription?.plan_name || "No Active Plan",
    purchase_date: latestSubscription?.start_date
      ? latestSubscription.start_date.split("T")[0]
      : undefined,
  };

  return <DashboardOverview email={user.email!} profileData={profileData} />;
}
