"use client";

import React from "react";
import {
  CreditCard,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export interface SubscriptionRecord {
  id: string;
  planName: string;
  price: number;
  duration: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired";
}

interface SubscriptionCardProps {
  subscription: SubscriptionRecord;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const isActive = subscription.status === "Active";

  const calculateProgress = (startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();

    if (now >= end) return { percent: 100, daysLeft: 0 };
    if (now <= start)
      return {
        percent: 0,
        daysLeft: Math.ceil((end - start) / (1000 * 3600 * 24)),
      };

    const totalDuration = end - start;
    const elapsed = now - start;
    const percent = Math.min(
      100,
      Math.max(0, Math.round((elapsed / totalDuration) * 100)),
    );
    const daysLeft = Math.ceil((end - now) / (1000 * 3600 * 24));

    return { percent, daysLeft };
  };

  const { percent, daysLeft } = calculateProgress(
    subscription.startDate,
    subscription.endDate,
  );

  return (
    <div
      className={`relative rounded-3xl p-6 md:p-8 border transition-all duration-300 flex flex-col justify-between gap-6 ${
        isActive
          ? "bg-white/[0.03] border-blue-500/40 shadow-xl shadow-blue-500/5"
          : "bg-[#121824] border-white/[0.06]"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-2xl shrink-0 ${
              isActive
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                : "bg-white/[0.04] text-slate-400"
            }`}
          >
            <CreditCard size={26} />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-white">
                {subscription.planName}
              </h3>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                  isActive
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-slate-500/10 border-slate-500/20 text-slate-400"
                }`}
              >
                {isActive ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <AlertCircle size={13} />
                )}
                {subscription.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
              <span className="bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                {subscription.duration}
              </span>
              <div className="flex items-center gap-1">
                <Calendar size={13} />
                <span>{subscription.startDate}</span>
                <span>→</span>
                <span>{subscription.endDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-left md:text-right">
          <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
            ${subscription.price}
          </span>
        </div>
      </div>

      {isActive && (
        <div className="pt-4 border-t border-white/[0.06] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock size={14} className="text-blue-400" />
              Time Remaining
            </span>
            <span className="font-bold text-blue-400">
              {daysLeft} days left ({100 - percent}% remaining)
            </span>
          </div>

          <div className="w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
