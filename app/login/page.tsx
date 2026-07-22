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
    redirect("/user/dashboard");
  }

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
