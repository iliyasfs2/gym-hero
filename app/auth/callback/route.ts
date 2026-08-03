import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { ensureUserRecords } from "@/utils/supabase/auth-actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const mode = searchParams.get("mode");

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.user) {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (serviceRoleKey) {
          const serviceSupabase = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
          );

          const { data: existingProfile } = await serviceSupabase
            .from("profiles")
            .select("id")
            .eq("id", data.user.id)
            .maybeSingle();

          const isBrandNewAccount = !existingProfile;

          if (isBrandNewAccount && mode === "signin") {
            await serviceSupabase.auth.admin.deleteUser(data.user.id);
            return NextResponse.redirect(`${origin}/login?error=no-account`);
          }

          if (!isBrandNewAccount && mode === "signup") {
            await supabase.auth.signOut();
            return NextResponse.redirect(
              `${origin}/login?error=already-exists`,
            );
          }

          if (isBrandNewAccount) {
            const fallbackName =
              data.user.user_metadata?.full_name ||
              data.user.email?.split("@")[0] ||
              "New Member";

            await ensureUserRecords(
              data.user.id,
              data.user.email || "",
              fallbackName,
            );

            return NextResponse.redirect(`${origin}/complete-profile`);
          }
        }

        const fallbackName =
          data.user.user_metadata?.full_name ||
          data.user.email?.split("@")[0] ||
          "New Member";

        await ensureUserRecords(
          data.user.id,
          data.user.email || "",
          fallbackName,
        );

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();

        const destination =
          profile?.role === "admin" ? "/dashboard" : "/user/dashboard";

        return NextResponse.redirect(`${origin}${destination}`);
      }
    } catch (err) {
      console.error("Auth Callback Error:", err);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-failed`);
}
