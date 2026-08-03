import { createClient } from "@/utils/supabase/server";
import { ensureUserRecords } from "@/utils/supabase/auth-actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const fallbackName =
        data.user.user_metadata?.full_name ||
        data.user.email?.split("@")[0] ||
        "New Member";

      try {
        await ensureUserRecords(
          data.user.id,
          data.user.email || "",
          fallbackName,
        );
      } catch (e) {
        console.error("Error creating user record:", e);
      }

      // بررسی نقش کاربر برای هدایت به داشبورد
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      const destination =
        profile?.role === "admin" ? "/dashboard" : "/user/dashboard";

      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-failed`);
}
