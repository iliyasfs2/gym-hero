import { createClient } from "@/utils/supabase/server";
import MembersClientContainer from "./components/MembersClientContainer";
import { Member, AppProvider } from "@/app/components/context/AppContext";

export default async function MembersPage() {
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
      />
    </AppProvider>
  );
}
