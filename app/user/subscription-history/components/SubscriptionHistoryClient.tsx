"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Layers,
  Zap,
  Clock,
  Calendar,
  CalendarDays,
  DollarSign,
} from "lucide-react";
import { SubscriptionCard, SubscriptionRecord } from "./SubscriptionCard";

interface SubscriptionHistoryClientProps {
  initialSubscriptions: SubscriptionRecord[];
}

type FilterStatus = "All" | "Active" | "Expired";
type SortOption = "newest" | "oldest" | "highest_price" | "lowest_price";

interface SortItem {
  id: SortOption;
  label: string;
  icon: React.ElementType;
}

const SORT_OPTIONS: SortItem[] = [
  { id: "newest", label: "Newest First", icon: CalendarDays },
  { id: "oldest", label: "Oldest First", icon: Calendar },
  { id: "highest_price", label: "Highest Price", icon: DollarSign },
  { id: "lowest_price", label: "Lowest Price", icon: DollarSign },
];

const FILTER_TABS = [
  { id: "All" as FilterStatus, label: "All Plans", icon: Layers },
  { id: "Active" as FilterStatus, label: "Active", icon: Zap },
  { id: "Expired" as FilterStatus, label: "Expired", icon: Clock },
];

export function SubscriptionHistoryClient({
  initialSubscriptions = [],
}: SubscriptionHistoryClientProps) {
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const initialExpandedId = useMemo(() => {
    if (!initialSubscriptions || initialSubscriptions.length === 0) return null;
    const sortedByPriority = [...initialSubscriptions].sort((a, b) => {
      const isAActive = a.status?.toLowerCase() === "active";
      const isBActive = b.status?.toLowerCase() === "active";
      if (isAActive && !isBActive) return -1;
      if (!isAActive && isBActive) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
    return sortedByPriority[0]?.id || null;
  }, [initialSubscriptions]);

  const [expandedId, setExpandedId] = useState<string | null>(
    initialExpandedId,
  );

  useEffect(() => {
    setExpandedId(initialExpandedId);
  }, [initialExpandedId]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilter(newFilter);
    setExpandedId(null);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    setIsSortOpen(false);
    setExpandedId(null);
  };

  const processedSubscriptions = useMemo(() => {
    if (!Array.isArray(initialSubscriptions)) return [];

    return [...initialSubscriptions]
      .filter((sub) => {
        if (filter === "All") return true;

        return sub.status?.toLowerCase() === filter.toLowerCase();
      })
      .sort((a, b) => {
        const isAActive = a.status?.toLowerCase() === "active";
        const isBActive = b.status?.toLowerCase() === "active";

        if (isAActive && !isBActive) return -1;
        if (!isAActive && isBActive) return 1;

        const timeA = new Date(a.startDate).getTime() || 0;
        const timeB = new Date(b.startDate).getTime() || 0;

        if (sortOption === "newest") {
          return timeB - timeA;
        }
        if (sortOption === "oldest") {
          return timeA - timeB;
        }
        if (sortOption === "highest_price") {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortOption === "lowest_price") {
          return (a.price || 0) - (b.price || 0);
        }
        return 0;
      });
  }, [initialSubscriptions, filter, sortOption]);

  const activeSort = SORT_OPTIONS.find((opt) => opt.id === sortOption);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#121824] border border-white/[0.06] p-2 md:p-3 rounded-2xl relative z-20">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleFilterChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200"
                }`}
              >
                <Icon
                  size={14}
                  className={isSelected ? "text-white" : "text-slate-400"}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="w-full sm:w-auto flex items-center justify-between gap-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-200 text-xs font-medium rounded-xl px-4 py-2.5 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-blue-400" />
              <span className="text-slate-400">Sort by:</span>
              <span className="font-semibold text-white">
                {activeSort?.label}
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-full sm:w-52 bg-[#121824] border border-white/[0.1] rounded-2xl shadow-2xl p-1.5 z-50 backdrop-blur-xl">
              {SORT_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = sortOption === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSortChange(option.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-blue-600/10 text-blue-400 font-semibold"
                        : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={14}
                        className={
                          isSelected ? "text-blue-400" : "text-slate-400"
                        }
                      />
                      <span>{option.label}</span>
                    </div>
                    {isSelected && (
                      <Check size={14} className="text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {processedSubscriptions.length === 0 ? (
        <div className="bg-[#121824] border border-white/[0.06] rounded-3xl p-16 text-center text-slate-400">
          No subscriptions found matching your criteria.
        </div>
      ) : (
        <div className="space-y-5">
          {processedSubscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              isExpanded={expandedId === sub.id}
              onToggle={() =>
                setExpandedId((prevId) => (prevId === sub.id ? null : sub.id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
