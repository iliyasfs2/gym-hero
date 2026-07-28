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
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subscriptions:", error.message);
  }

  if (!data || data.length === 0) {
    console.log("No subscription records found for user:", user.id);
  }

  const now = new Date();

  const formattedSubscriptions: SubscriptionRecord[] = (data || []).map(
    (item) => {
      const rawEndDate = item.end_date || item.endDate;
      const endDate = rawEndDate ? new Date(rawEndDate) : new Date();

      const isStillActive = item.status
        ? item.status.toLowerCase() === "active"
        : endDate > now;

      const status: "Active" | "Expired" = isStillActive ? "Active" : "Expired";

      return {
        id: String(item.id),

        planName: item.name || item.plan_name || item.planName || "Plan",
        price: Number(item.price || 0),
        duration: item.duration || "1 Month",

        startDate:
          item.start_date || item.created_at || new Date().toISOString(),
        endDate: rawEndDate || new Date().toISOString(),
        status: status,
      };
    },
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        Subscription History
      </h1>
      <SubscriptionHistoryClient
        initialSubscriptions={formattedSubscriptions}
      />
    </div>
  );
}
