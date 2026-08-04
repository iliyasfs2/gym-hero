import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options }),
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options }),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const redirectWithCookies = (targetUrl: string) => {
    const redirectResponse = NextResponse.redirect(
      new URL(targetUrl, request.url),
    );
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  };

  const isLoginPage = pathname.startsWith("/login");
  const isRootPage = pathname === "/";
  const isAdminRoute = pathname.startsWith("/dashboard");
  const isUserRoute = pathname.startsWith("/user");

  const isPublicRoute =
    isLoginPage ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api");

  if (!user) {
    if (!isPublicRoute && !isRootPage) {
      return redirectWithCookies("/login");
    }
    return response;
  }

  if (user) {
    if (isLoginPage || isRootPage) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = profile?.role || "user";

      if (role === "admin") {
        return redirectWithCookies("/dashboard");
      } else {
        return redirectWithCookies("/user/dashboard");
      }
    }

    if (isAdminRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = profile?.role || "user";

      if (role !== "admin") {
        return redirectWithCookies("/user/dashboard");
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
