import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SubscriptionHistoryClient } from "@/app/user/subscription-history/components/SubscriptionHistoryClient";
import { SubscriptionRecord } from "@/app/user/subscription-history/components/SubscriptionCard";

export const revalidate = 0;

export default async function HistoryPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subscriptions:", error.message);
  }

  const now = new Date();

  const formattedSubscriptions: SubscriptionRecord[] = (data || []).map(
    (item) => {
      const rawEndDate = item.end_date || item.endDate;
      const endDate = rawEndDate ? new Date(rawEndDate) : new Date();

      const isStillActive =
        endDate > now && item.status?.toLowerCase() !== "cancelled";
      const status: "Active" | "Expired" = isStillActive ? "Active" : "Expired";

      const rawPrice = item.amount ?? item.price ?? 0;

      return {
        id: String(item.id),
        planName: item.plan_name || item.planName || item.name || "Plan",
        price: Number(rawPrice),
        duration: item.duration_months
          ? `${item.duration_months} Month${item.duration_months > 1 ? "s" : ""}`
          : item.duration || "1 Month",
        startDate:
          item.start_date || item.created_at || new Date().toISOString(),
        endDate: rawEndDate || new Date().toISOString(),
        status,
      };
    },
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-col gap-1 border-b border-white/10 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Subscription History
          </h1>
          <p className="text-sm text-slate-400">
            View and manage all your past and active membership plans.
          </p>
        </header>

        <SubscriptionHistoryClient
          initialSubscriptions={formattedSubscriptions}
        />
      </div>
    </main>
  );
}
