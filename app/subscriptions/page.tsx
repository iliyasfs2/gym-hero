import { createClient } from "@/utils/supabase/server";
import SubscriptionManager from "./components/SubscriptionManager";

export default async function SubscriptionsPage() {
  const supabase = await createClient();
  const { data: plans, error } = await supabase
    .from("plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching plans:", error.message);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Subscription Plans</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage gym membership packages and pricing
          </p>
        </div>

        <SubscriptionManager />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <div
            key={plan.id}
            className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  plan.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {plan.status}
              </span>
            </div>
            <p className="text-2xl font-extrabold my-2">
              {Number(plan.price).toLocaleString()}{" "}
              <span className="text-sm font-normal text-slate-400">Toman</span>
            </p>
            <p className="text-slate-400 text-sm">Duration: {plan.duration}</p>
          </div>
        ))}

        {plans?.length === 0 && (
          <p className="text-slate-500 col-span-full text-center py-12">
            No plans found. Click "+ Add New Plan" to create one.
          </p>
        )}
      </div>
    </div>
  );
}
