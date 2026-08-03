"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import GlowLayout from "@/app/components/GlowLayout";
import WelcomeToast from "@/app/components/WelcomeToast";
import AnalyticsCharts from "@/app/components/AnalyticsCharts";
import LatestMembersTable from "@/app/components/LatestMembersTable";

interface StatItem {
  id: number;
  title: string;
  value: string;
  icon: React.ReactElement;
  change: string;
  color: string;
  iconBg: string;
  link: string;
}

interface AdminDashboardProps {
  stats: {
    totalMembers: number;
    activeMembersCount: number;
    expiredMembersCount: number;
    totalRevenue: number;
  };
  chartData: { month: string; revenue: number; registrations: number }[];
  recentActivities: {
    id: string;
    name: string;
    plan: string;
    date: string;
    status: "Active" | "Inactive";
  }[];
}

export default function AdminDashboard({
  stats: liveStats,
  chartData,
  recentActivities,
}: AdminDashboardProps) {
  const stats: StatItem[] = [
    {
      id: 1,
      title: "Total Members",
      value: liveStats.totalMembers.toLocaleString(),
      icon: (
        <svg
          className="w-5 h-5 text-sky-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      change: "Total registered athletes",
      color: "text-slate-400",
      iconBg: "bg-sky-500/10 border-sky-500/20",
      link: "/members?status=All",
    },
    {
      id: 2,
      title: "Active Members",
      value: liveStats.activeMembersCount.toLocaleString(),
      icon: (
        <svg
          className="w-5 h-5 text-emerald-400"
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
      ),
      change: "Currently training",
      color: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      link: "/members?status=Active",
    },
    {
      id: 3,
      title: "Expired Members",
      value: liveStats.expiredMembersCount.toLocaleString(),
      icon: (
        <svg
          className="w-5 h-5 text-rose-400"
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
      ),
      change: "Subscription ended",
      color: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/20",
      link: "/members?status=Inactive",
    },
    {
      id: 4,
      title: "Monthly Revenue",
      value: `$${liveStats.totalRevenue.toLocaleString()}`,
      icon: (
        <svg
          className="w-5 h-5 text-teal-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      change: "Total earnings",
      color: "text-teal-400",
      iconBg: "bg-teal-500/10 border-teal-500/20",
      link: "/payments",
    },
  ];

  return (
    <GlowLayout>
      <WelcomeToast />

      <div className="flex h-screen w-full bg-[#0a0f1d] text-white overflow-hidden">
        <Sidebar />

        <div className="flex-1 h-full  bg-[#0a0f1d] px-6 py-6 md:px-12 md:py-8 space-y-6 overflow-y-auto z-10 transition-all duration-300">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8 border-b border-white/[0.06] pb-5 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Dashboard Overview
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time gym performance and analytics
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {stats.map((stat: StatItem) => (
                <Link
                  key={stat.id}
                  href={stat.link}
                  className="relative overflow-hidden rounded-2xl p-5 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500/20 hover:bg-white/[0.03] block cursor-pointer border border-white/[0.08] bg-[#11151f]"
                >
                  {/* soft blue glow accent, top-right, matching the profile-panel look */}
                  <div
                    className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl"
                    style={{
                      background:
                        "radial-gradient(circle, #3b82f6, transparent 70%)",
                    }}
                  />
                  <div className="relative flex justify-between items-start mb-3">
                    <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                      {stat.title}
                    </span>
                    <div className={`p-2.5 rounded-xl border ${stat.iconBg}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="relative flex flex-col">
                    <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                      {stat.value}
                    </span>
                    <span
                      className={`text-[11px] mt-1 font-medium ${stat.color}`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/payments"
              className="block cursor-pointer mb-8 relative group"
            >
              <AnalyticsCharts data={chartData} />
            </Link>

            <div className="rounded-2xl border border-white/[0.08] bg-[#11151f] overflow-hidden">
              <LatestMembersTable activities={recentActivities} />
            </div>
          </div>
        </div>
      </div>
    </GlowLayout>
  );
}
