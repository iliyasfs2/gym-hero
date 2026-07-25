"use client";

import React from "react";
import {
  CreditCard,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Sparkles,
  CalendarDays,
  Hourglass,
  ArrowRight,
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
  isExpanded: boolean;
  onToggle: () => void;
}

export function SubscriptionCard({
  subscription,
  isExpanded,
  onToggle,
}: SubscriptionCardProps) {
  const isActive = subscription.status === "Active";

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const calculateProgress = (startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();

    if (now >= end) {
      const daysAgo = Math.ceil((now - end) / (1000 * 3600 * 24));
      return { percent: 100, daysLeft: 0, daysAgo };
    }
    if (now <= start) {
      const daysUntilStart = Math.ceil((start - now) / (1000 * 3600 * 24));
      return {
        percent: 0,
        daysLeft: Math.ceil((end - start) / (1000 * 3600 * 24)),
        daysUntilStart,
      };
    }

    const totalDuration = end - start;
    const elapsed = now - start;
    const percent = Math.min(
      100,
      Math.max(0, Math.round((elapsed / totalDuration) * 100)),
    );
    const daysLeft = Math.ceil((end - now) / (1000 * 3600 * 24));

    return { percent, daysLeft, daysAgo: 0 };
  };

  const { percent, daysLeft, daysAgo } = calculateProgress(
    subscription.startDate,
    subscription.endDate,
  );

  const formattedStart = formatDate(subscription.startDate);
  const formattedEnd = formatDate(subscription.endDate);

  return (
    <div
      onClick={onToggle}
      className={`relative rounded-3xl p-6 md:p-7 border cursor-pointer transition-all duration-300 ease-in-out select-none ${
        isExpanded
          ? isActive
            ? "bg-white/[0.04] border-blue-500/50 shadow-2xl shadow-blue-500/10"
            : "bg-white/[0.04] border-rose-500/50 shadow-2xl shadow-rose-500/10"
          : "bg-[#121824] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.02]"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-3.5 rounded-2xl shrink-0 transition-colors duration-300 ${
              isExpanded
                ? isActive
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                : "bg-white/[0.04] text-slate-400 border border-white/[0.06]"
            }`}
          >
            <CreditCard size={24} />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h3
                className={`text-lg md:text-xl font-bold transition-colors duration-300 ${
                  isExpanded ? "text-white" : "text-slate-200"
                }`}
              >
                {subscription.planName}
              </h3>

              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 transition-colors duration-300 ${
                  isActive
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}
              >
                {isActive ? (
                  <CheckCircle2 size={12} />
                ) : (
                  <AlertCircle size={12} />
                )}
                {subscription.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs mt-2.5 transition-colors duration-300">
              <span
                className={`px-2.5 py-1 rounded-lg border font-medium ${
                  isExpanded
                    ? "bg-white/[0.08] text-slate-200 border-white/10"
                    : "bg-white/[0.03] text-slate-400 border-white/[0.05]"
                }`}
              >
                {subscription.duration}
              </span>

              <div className="flex items-center gap-1.5 bg-black/30 border border-white/[0.06] px-2.5 py-1 rounded-lg text-slate-300">
                <CalendarDays size={13} className="text-blue-400" />
                <span className="font-medium text-[11px]">
                  {formattedStart}
                </span>
                <ArrowRight size={11} className="text-slate-500" />
                <span className="font-medium text-[11px]">{formattedEnd}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-white/[0.05]">
          <span className="text-2xl font-black text-white tracking-tight">
            ${subscription.price}
          </span>

          <div
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all duration-300 ${
              isExpanded
                ? isActive
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                : "bg-white/[0.04] text-slate-400 border-white/[0.06] hover:text-white"
            }`}
          >
            <span>{isExpanded ? "Less Details" : "View Details"}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-black/30 border border-white/[0.06] p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Calendar size={15} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                    Start Date
                  </div>
                  <div className="text-xs font-semibold text-white mt-0.5">
                    {formattedStart}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 border border-white/[0.06] p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  <Hourglass size={15} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                    Expiration Date
                  </div>
                  <div className="text-xs font-semibold text-white mt-0.5">
                    {formattedEnd}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Clock
                  size={14}
                  className={isActive ? "text-blue-400" : "text-rose-400"}
                />
                {isActive ? "Cycle Progress" : "Subscription Status"}
              </span>
              <span
                className={`font-bold text-xs ${
                  isActive ? "text-blue-400" : "text-rose-400"
                }`}
              >
                {isActive
                  ? `${daysLeft} days remaining (${100 - percent}% left)`
                  : `Expired ${daysAgo > 0 ? `${daysAgo} days ago` : ""}`}
              </span>
            </div>

            <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/[0.05]">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 shadow-md shadow-blue-500/50"
                    : "bg-gradient-to-r from-rose-700 via-rose-500 to-red-400 shadow-md shadow-rose-500/50"
                }`}
                style={{ width: `${isActive ? percent : 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
              <span>0%</span>
              <span className="flex items-center gap-1 text-slate-300 font-semibold font-sans">
                <Sparkles
                  size={11}
                  className={isActive ? "text-blue-400" : "text-rose-400"}
                />
                {isActive ? `${percent}% completed` : "Plan completed"}
              </span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
