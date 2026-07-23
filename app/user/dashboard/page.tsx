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
    .select(
      "full_name, subscription_status, days_left, height, weight, plan_name, purchase_date, role",
    )
    .eq("id", user.id)
    .maybeSingle();

  const profileData = profile || {
    full_name: user.user_metadata?.full_name || "Admin (Preview Mode)",
    subscription_status: "active",
    days_left: 365,
    height: 180,
    weight: 75,
    plan_name: "Admin Preview",
    purchase_date: new Date().toISOString(),
    role: "admin",
  };

  return <DashboardOverview email={user.email!} profileData={profileData} />;
}
