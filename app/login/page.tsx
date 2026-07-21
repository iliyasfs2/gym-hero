import React from "react";
import { LoginForm } from "./LoginForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, phone")
      .eq("id", user.id)
      .single();

    if (!profile?.full_name || !profile?.phone) {
      redirect("/onboarding");
    }

    if (profile?.role === "admin") {
      redirect("/dashboard");
    } else {
      redirect("/user/dashboard");
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
