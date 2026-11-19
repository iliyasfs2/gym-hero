import React from "react";
import { LoginForm } from "./LoginForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

function getErrorMessage(errorParam?: string): string | null {
  if (errorParam === "no-account") {
    return "No account found with this email. Please sign up first.";
  }
  if (errorParam === "already-exists") {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (errorParam === "auth-failed") {
    return "Authentication failed. Please try again.";
  }
  return null;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/user/dashboard");
  }

  const resolvedParams = await searchParams;
  const initialError = getErrorMessage(resolvedParams.error);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 py-8 overflow-y-auto">
      <LoginForm initialError={initialError} />
    </div>
  );
}
