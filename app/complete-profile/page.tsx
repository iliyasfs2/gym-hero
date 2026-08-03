import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CompleteProfileForm } from "./CompleteProfileForm";

export default async function CompleteProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const defaultName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "";

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4">
      <CompleteProfileForm defaultName={defaultName} />
    </div>
  );
}
