import { createClient } from "@/utils/supabase/server";
import MembersClientContainer from "./components/MembersClientContainer";
import { Member, AppProvider } from "@/app/components/context/AppContext";
import { FilterStatus } from "./components/types";

function parseFilterStatus(raw?: string): FilterStatus {
  const normalized = (raw || "").toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "expired" || normalized === "inactive") return "Expired";
  if (normalized === "expiring soon") return "Expiring Soon";
  return "All";
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const initialStatus = parseFilterStatus(resolvedParams.status);
  const supabase = await createClient();

  const [membersResult, subscriptionsResult] = await Promise.all([
    supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("plans")
      .select("id, name, price")
      .order("price", { ascending: true }),
  ]);

  if (membersResult.error) {
    console.error("Supabase Members Error:", membersResult.error.message);
  }
  if (subscriptionsResult.error) {
    console.error(
      "Supabase Subscriptions Error:",
      subscriptionsResult.error.message,
    );
  }

  const formattedMembers: Member[] = (membersResult.data || []).map(
    (member) => ({
      id: member.id,
      name: member.name,
      phone: member.phone || "",
      plan: member.plan_name,
      status: member.status,
      joinDate: member.joined_date ? member.joined_date.split("T")[0] : "N/A",
      price: Number(member.price) || 0,
    }),
  );

  const availablePlans = subscriptionsResult.data || [];

  return (
    <AppProvider>
      <MembersClientContainer
        initialMembers={formattedMembers}
        availablePlans={availablePlans}
        initialStatus={initialStatus}
      />
    </AppProvider>
  );
}
