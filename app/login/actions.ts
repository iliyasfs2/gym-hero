"use server";

import { createClient } from "@/utils/supabase/server";

export async function signInWithGoogle(mode: "signin" | "signup") {
  const supabase = await createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback?mode=${mode}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { url: data.url };
}
