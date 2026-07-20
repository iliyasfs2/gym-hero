import React from "react";

interface MemberCardProps {
  fullName: string;
  planName: string;
  status: "active" | "expired";
  height?: number;
  weight?: number;
  daysLeft: number;
  purchaseDate?: string;
}

export function MemberCard({
  fullName,
  planName,
  status,
  height,
  weight,
  daysLeft,
  purchaseDate,
}: MemberCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl shadow-blue-950/20">
      <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>

      {/* Name and Subscription Status Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">{fullName}</h2>
          <p className="text-sm text-blue-400 mt-1 font-medium flex items-center gap-1">
            <span className="text-slate-400">Active Plan:</span>
            <span className="text-slate-200">{planName || "Not Assigned"}</span>
          </p>
        </div>

        <span
          className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border ${
            status === "active"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {status === "active" ? "Active Subscription" : "Expired Subscription"}
        </span>
      </div>

      {/* Grid containing Physical and Plan details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="block text-xs text-slate-400 mb-1">Height</span>
          <span className="text-lg font-bold text-slate-200 font-mono">
            {height || "--"}{" "}
            <span className="text-xs text-slate-400 font-sans">cm</span>
          </span>
        </div>

        <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="block text-xs text-slate-400 mb-1">Weight</span>
          <span className="text-lg font-bold text-slate-200 font-mono">
            {weight || "--"}{" "}
            <span className="text-xs text-slate-400 font-sans">kg</span>
          </span>
        </div>

        <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="block text-xs text-slate-400 mb-1">
            Days Remaining
          </span>
          <span className="text-lg font-bold text-blue-400 font-mono">
            {daysLeft}{" "}
            <span className="text-xs text-slate-400 font-sans">Days</span>
          </span>
        </div>

        <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="block text-xs text-slate-400 mb-1">
            Purchase Date
          </span>
          <span className="text-sm font-semibold text-slate-300">
            {purchaseDate || "--"}
          </span>
        </div>
      </div>
    </div>
  );
}
