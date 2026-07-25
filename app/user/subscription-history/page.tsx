import React from "react";
import { SubscriptionHistoryClient } from "@/app/user/subscription-history/components/SubscriptionHistoryClient";
import { SubscriptionRecord } from "@/app/user/subscription-history/components/SubscriptionCard";

async function getSubscriptions(): Promise<SubscriptionRecord[]> {
  return [
    {
      id: "sub_1",
      planName: "Pro Athlete Plan",
      price: 49,
      duration: "1 Month",
      startDate: "2026-07-01",
      endDate: "2026-08-01",
      status: "Active",
    },
    {
      id: "sub_2",
      planName: "Starter Gym Pass",
      price: 19,
      duration: "1 Month",
      startDate: "2026-05-15",
      endDate: "2026-06-15",
      status: "Expired",
    },
    {
      id: "sub_3",
      planName: "VIP Unlimited",
      price: 120,
      duration: "3 Months",
      startDate: "2026-01-01",
      endDate: "2026-04-01",
      status: "Expired",
    },
  ];
}

export default async function SubscriptionHistoryPage() {
  const subscriptions = await getSubscriptions();

  return (
    <main className="pt-2 pb-14 px-6 md:px-12 max-w-7xl mx-auto min-h-screen space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Subscription History
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage and review your active and past membership plans.
        </p>
      </div>

      <SubscriptionHistoryClient initialSubscriptions={subscriptions} />
    </main>
  );
}
