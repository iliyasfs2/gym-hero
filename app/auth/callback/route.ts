import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const serviceSupabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );

      const { data: existingMember } = await serviceSupabase
        .from("members")
        .select("id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!existingMember) {
        await serviceSupabase.from("members").insert({
          user_id: data.user.id,
          name:
            data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0] ||
            "New Member",
          email: data.user.email,
          phone: "",
          plan_name: null,
          price: 0,
          status: "active",
          joined_date: new Date().toISOString(),
        });
      }

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
