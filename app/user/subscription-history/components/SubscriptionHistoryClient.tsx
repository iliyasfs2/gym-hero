"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { SubscriptionCard, SubscriptionRecord } from "./SubscriptionCard";

interface SubscriptionHistoryClientProps {
  initialSubscriptions: SubscriptionRecord[];
}

type FilterStatus = "All" | "Active" | "Expired";
type SortOrder = "newest" | "oldest";

export function SubscriptionHistoryClient({
  initialSubscriptions,
}: SubscriptionHistoryClientProps) {
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const processedSubscriptions = useMemo(() => {
    return initialSubscriptions
      .filter((sub) => (filter === "All" ? true : sub.status === filter))
      .sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [initialSubscriptions, filter, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#121824] border border-white/[0.06] p-4 rounded-2xl">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(["All", "Active", "Expired"] as FilterStatus[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === tab
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <ArrowUpDown size={16} className="text-slate-400" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="bg-white/[0.04] border border-white/[0.06] text-slate-300 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="newest" className="bg-[#121824] text-white">
              Newest First
            </option>
            <option value="oldest" className="bg-[#121824] text-white">
              Oldest First
            </option>
          </select>
        </div>
      </div>

      {processedSubscriptions.length === 0 ? (
        <div className="bg-[#121824] border border-white/[0.06] rounded-3xl p-16 text-center text-slate-400">
          No subscriptions found matching your criteria.
        </div>
      ) : (
        <div className="space-y-5">
          {processedSubscriptions.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
        </div>
      )}
    </div>
  );
}
