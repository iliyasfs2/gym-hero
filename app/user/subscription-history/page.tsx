import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SubscriptionHistoryClient } from "@/app/user/subscription-history/components/SubscriptionHistoryClient";
import { SubscriptionRecord } from "@/app/user/subscription-history/components/SubscriptionCard";
import { History } from "lucide-react"
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
    <main className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans p-4 md:p-8 ">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/40 via-[#121824] to-[#121824] border border-white/[0.08] rounded-3xl p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
                <History size={15} />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Subscription History
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              View and manage all your past and active membership plans.
            </p>
          </div>
        </div>

        <SubscriptionHistoryClient
          initialSubscriptions={formattedSubscriptions}
        />
      </div>
    </main>
  );
}
