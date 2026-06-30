"use client";

import React from "react";
import Sidebar from "@/app/components/Sidebar";
import GlowLayout from "@/app/components/GlowLayout";
import { useApp } from "@/app/components/context/AppContext";
import WelcomeToast from "@/app/components/WelcomeToast";
import AnalyticsCharts from "@/app/components/AnalyticsCharts";
import LatestMembersTable from "@/app/components/LatestMembersTable";

export interface Member {
  id: string;
  name: string;
  email: string;
  plan: string;
  price: number;
  status: "Active" | "Inactive";
}

interface StatItem {
  id: number;
  title: string;
  value: string;
  icon: string;
  change: string;
  color: string;
}

export default function AdminDashboard() {
  const { members: rawMembers } = useApp();
  const members = (rawMembers || []) as Member[];

  const totalMembers: number = members.length;
  const activeMembersCount: number = members.filter(
    (m) => m.status === "Active",
  ).length;
  const expiredMembersCount: number = members.filter(
    (m) => m.status === "Inactive",
  ).length;
  const totalRevenue: number = members.reduce(
    (sum, member) => sum + (Number(member.price) || 0),
    0,
  );

  const stats: StatItem[] = [
    {
      id: 1,
      title: "Total Members",
      value: totalMembers.toLocaleString(),
      icon: "👥",
      change: "Total registered athletes",
      color: "text-slate-400",
    },
    {
      id: 2,
      title: "Active Members",
      value: activeMembersCount.toLocaleString(),
      icon: "🟢",
      change: "Currently training",
      color: "text-emerald-400",
    },
    {
      id: 3,
      title: "Expired Members",
      value: expiredMembersCount.toLocaleString(),
      icon: "🔴",
      change: "Subscription ended",
      color: "text-rose-400",
    },
    {
      id: 4,
      title: "Monthly Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: "💰",
      change: "Total earnings",
      color: "text-amber-400",
    },
  ];

  return (
    <GlowLayout>
      <WelcomeToast />
      <div className="flex min-h-screen bg-[#0a0f1d] text-white w-full">
        <Sidebar />
        <div className="flex-1 p-8 overflow-y-auto z-10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-200">
                Dashboard Overview
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Real-time gym performance and analytics (View Only)
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat: StatItem) => (
                <div
                  key={stat.id}
                  className="glass-card-fixed relative overflow-hidden rounded-2xl p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.06]"
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
                </div>
              ))}
            </div>
            <AnalyticsCharts />
            <LatestMembersTable />
            
              
              <div className="space-y-3">
                {members.slice(0, 5).map((member: Member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/[0.04] hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl bg-white/[0.02] p-2 rounded-lg border border-white/[0.05]">
                        {member.status === "Active" ? "🟢" : "🔴"}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          {member.name || "Unknown Member"}
                        </p>
                        <p className="text-xs text-slate-400">
                          Registered with {member.plan || "No Plan"} Plan
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      Just now
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
     
    </GlowLayout>
  );
}
