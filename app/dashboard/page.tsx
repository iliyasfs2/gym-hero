import { createClient } from "@/public/supabase/server";
import AdminDashboard from "@/app/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("members")
    .select("id, name, status, price, plan_name, joined_date")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Dashboard Fetch Error:", error.message);
  }

  const safeMembers = members || [];

  const totalMembers = safeMembers.length;
  const activeMembersCount = safeMembers.filter(
    (m) => m.status === "Active",
  ).length;
  const expiredMembersCount = safeMembers.filter(
    (m) => m.status === "Inactive",
  ).length;
  const totalRevenue = safeMembers.reduce(
    (sum, m) => sum + (Number(m.price) || 0),
    0,
  );

  const recentActivities = safeMembers.slice(0, 5).map((m) => ({
    id: m.id,
    name: m.name,
    plan: m.plan_name || "Basic",
    price: Number(m.price) || 0,
    status:
      m.status === "Active" || m.status === "Inactive" ? m.status : "Active",
    date: m.joined_date
      ? m.joined_date.split("T")[0]
      : new Date().toISOString().split("T")[0],
  }));

  const chartDataMap: { [key: string]: number } = {};
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = d.toLocaleString("en-US", { month: "short" });
    chartDataMap[monthLabel] = 0;
  }

  safeMembers.forEach((m) => {
    if (m.joined_date) {
      const date = new Date(m.joined_date);
      const monthLabel = date.toLocaleString("en-US", { month: "short" });
      if (chartDataMap[monthLabel] !== undefined) {
        chartDataMap[monthLabel] += Number(m.price) || 0;
      }
    }
  });

  const chartData = Object.entries(chartDataMap).map(([name, revenue]) => ({
    name,
    revenue,
  }));

  return (
    <AdminDashboard
      stats={{
        totalMembers,
        activeMembersCount,
        expiredMembersCount,
        totalRevenue,
      }}
      chartData={chartData}
      recentActivities={recentActivities}
    />
  );
}
