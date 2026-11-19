import { createClient } from "@/utils/supabase/server";
import AdminDashboard from "@/app/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [membersResult, subscriptionsResult] = await Promise.all([
    supabase
      .from("members")
      .select("id, name, status, price, plan_name, joined_date")
      .order("created_at", { ascending: false }),
    supabase
      .from("user_subscriptions")
      .select("amount, start_date")
      .order("start_date", { ascending: false }),
  ]);

  if (membersResult.error) {
    console.error(
      "Dashboard Members Fetch Error:",
      membersResult.error.message,
    );
  }
  if (subscriptionsResult.error) {
    console.error(
      "Dashboard Subscriptions Fetch Error:",
      subscriptionsResult.error.message,
    );
  }

  const safeMembers = membersResult.data || [];
  const safeSubscriptions = subscriptionsResult.data || [];

  const totalMembers = safeMembers.length;
  const activeMembersCount = safeMembers.filter(
    (m) => m.status?.toLowerCase() === "active",
  ).length;
  const expiredMembersCount = safeMembers.filter(
    (m) => m.status?.toLowerCase() === "expired",
  ).length;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyRevenue = safeSubscriptions.reduce((sum, s) => {
    if (!s.start_date) return sum;
    const d = new Date(s.start_date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      return sum + (Number(s.amount) || 0);
    }
    return sum;
  }, 0);

  const recentActivities: Array<{
    id: string;
    name: string;
    plan: string;
    price: number;
    status: "Active" | "Inactive";
    date: string;
  }> = safeMembers.slice(0, 5).map((m) => ({
    id: String(m.id ?? ""),
    name: String(m.name ?? ""),
    plan: String(m.plan_name || "Basic"),
    price: Number(m.price) || 0,
    status: (m.status?.toLowerCase() === "active" ? "Active" : "Inactive") as
      | "Active"
      | "Inactive",
    date: m.joined_date
      ? String(m.joined_date).split("T")[0]
      : new Date().toISOString().split("T")[0],
  }));

  const chartDataMap: Record<
    string,
    { month: string; revenue: number; registrations: number }
  > = {};

  const getMonthKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = getMonthKey(d);
    const monthLabel = d.toLocaleString("en-US", { month: "short" });
    chartDataMap[key] = { month: monthLabel, revenue: 0, registrations: 0 };
  }

  safeSubscriptions.forEach((s) => {
    if (s.start_date) {
      const date = new Date(s.start_date);
      if (!isNaN(date.getTime())) {
        const key = getMonthKey(date);
        if (chartDataMap[key] !== undefined) {
          chartDataMap[key].revenue += Number(s.amount) || 0;
        }
      }
    }
  });

  safeMembers.forEach((m) => {
    if (m.joined_date) {
      const date = new Date(m.joined_date);
      if (!isNaN(date.getTime())) {
        const key = getMonthKey(date);
        if (chartDataMap[key] !== undefined) {
          chartDataMap[key].registrations += 1;
        }
      }
    }
  });

  const chartData = Object.values(chartDataMap);

  return (
    <AdminDashboard
      stats={{
        totalMembers,
        activeMembersCount,
        expiredMembersCount,
        totalRevenue: monthlyRevenue,
      }}
      chartData={chartData}
      recentActivities={recentActivities}
    />
  );
}
