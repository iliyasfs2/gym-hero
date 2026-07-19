import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardOverview from "./DashboardOverview";

export default async function UserPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "full_name, subscription_status, days_left, height, weight, plan_name, purchase_date, role",
    )
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/dashboard");
  }

  if (profileError || !profile) {
    return (
      <div
        className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center font-sans"
        dir="rtl"
      >
        <p>Error loading user profile. Please try again.</p>
      </div>
    );
  }

  return <DashboardOverview email={user.email!} profileData={profile} />;
}
