import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .single();

  if (profile?.full_name && profile?.phone) {
    redirect("/user/dashboard");
  }

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4">
      <OnboardingForm />
    </div>
  );
}
