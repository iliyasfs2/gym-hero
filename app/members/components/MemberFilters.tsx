"use client";

import React from "react";
import { FilterStatus } from "./types";

interface MemberFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: FilterStatus;
  setSelectedFilter: (filter: FilterStatus) => void;
}

export default function MemberFilters({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
}: MemberFiltersProps) {
  const filters: FilterStatus[] = ["All", "Active", "Expired", "Expiring Soon"];

  return (
    <div className="glass-card-fixed p-6 mb-6 rounded-2xl shadow-xl border border-white/[0.04]">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-200">
          Search Directory
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Find athletes instantly by entering their name or phone number
        </p>
      </div>

      <div className="relative w-full">
        <span className="absolute left-4 top-3.5 text-slate-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search member..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/[0.05]">
        {filters.map((filter) => {
          const emoji =
            filter === "Active"
              ? "🟢"
              : filter === "Expired"
                ? "🔴"
                : filter === "Expiring Soon"
                  ? "⏳"
                  : "📊";
          const isActive = selectedFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white/[0.02] border-white/[0.05] text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <span>{emoji}</span>
              <span>{filter}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
