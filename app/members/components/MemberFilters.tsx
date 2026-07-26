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

  const filterIcon = (filter: FilterStatus) => {
    if (filter === "Active") {
      return (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    if (filter === "Expired") {
      return (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    if (filter === "Expiring Soon") {
      return (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    );
  };

  return (
    <div className="relative overflow-hidden bg-[#141822] mb-6 rounded-2xl shadow-xl border border-white/[0.08]">
      <div
        className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-15 blur-2xl"
        style={{
          background: "radial-gradient(circle, #3b82f6, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 w-44 h-44 rounded-full opacity-15 blur-2xl"
        style={{
          background: "radial-gradient(circle, #3b82f6, transparent 70%)",
        }}
      />
      <div className="relative p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-200">
            Search Directory
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Find athletes instantly by entering their name or phone number
          </p>
        </div>

        <div className="relative w-full">
          <span className="absolute left-4 top-3.5 text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search member..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/[0.08]">
          {filters.map((filter) => {
            const isActive = selectedFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-b from-blue-500 to-blue-600 border-blue-400/50 text-white shadow-lg shadow-blue-600/30 ring-1 ring-inset ring-white/10"
                    : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {filterIcon(filter)}
                <span>{filter}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
