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
  icon: string;
  change: string;
  color: string;
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
      icon: "👥",
      change: "Total registered athletes",
      color: "text-slate-400",
      link: "/members?status=All",
    },
    {
      id: 2,
      title: "Active Members",
      value: liveStats.activeMembersCount.toLocaleString(),
      icon: "🟢",
      change: "Currently training",
      color: "text-emerald-400",
      link: "/members?status=Active",
    },
    {
      id: 3,
      title: "Expired Members",
      value: liveStats.expiredMembersCount.toLocaleString(),
      icon: "🔴",
      change: "Subscription ended",
      color: "text-rose-400",
      link: "/members?status=Inactive",
    },
    {
      id: 4,
      title: "Monthly Revenue",
      value: `$${liveStats.totalRevenue.toLocaleString()}`,
      icon: "💰",
      change: "Total earnings",
      color: "text-amber-400",
      link: "/payments",
    },
  ];

  return (
    <GlowLayout>
      <WelcomeToast />

      <div className="flex h-screen w-full bg-[#0b1224] text-white overflow-hidden">
        <Sidebar />

        <div className="flex-1 h-full bg-[#0b1224] p-4 md:p-8 space-y-6 overflow-y-auto z-10 transition-all duration-300">
          <div className="w-full mx-auto">
            <div className="mb-6 border-b border-white/[0.02] pb-5">
              <h1 className="text-2xl font-bold text-slate-200 tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time gym performance and analytics
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat: StatItem) => (
                <Link
                  key={stat.id}
                  href={stat.link}
                  className="glass-card-fixed relative overflow-hidden rounded-2xl p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.06] block cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-slate-400 tracking-wide">
                      {stat.title}
                    </span>
                    <span className="text-xl p-1.5 bg-white/[0.04] rounded-xl border border-white/[0.05]">
                      {stat.icon}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                      {stat.value}
                    </span>
                    <span
                      className={`text-[10px] mt-0.5 font-medium ${stat.color}`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/payments" className="block cursor-pointer mb-8">
              <AnalyticsCharts data={chartData} />
            </Link>

            <LatestMembersTable activities={recentActivities} />
          </div>
        </div>
      </div>
    </GlowLayout>
  );
}
