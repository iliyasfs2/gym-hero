"use client";

import React from "react";
import Sidebar from "@/app/components/Sidebar";
import { useApp } from "./context/AppContext";

// ۱. تعریف مستقیم تایپ ممبر در همین فایل برای حل مشکل ایمپورت
export interface Member {
  id: string;
  name: string;
  email: string;
  plan: string;
  price: number;
  status: "Active" | "Inactive";
}

// ۲. تعریف ساختار برای آیتم‌های بخش آمار (Stats)
interface StatItem {
  id: number;
  title: string;
  value: string;
  icon: string;
  change: string;
  color: string;
}

export default function AdminDashboard() {
  // استفاده از کامپوننت با دیتای کانتکست
  const { members } = useApp();

  // مشخص کردن صریح تایپ محاسبات عددی
  const totalMembers: number = members.length;
  const activeSubs: number = members.filter(
    (m) => m.status === "Active",
  ).length;
  const totalRevenue: number = members.reduce(
    (sum, member) => sum + member.price,
    0,
  );

  // متصل کردن اینترفیس StatItem به آرایه آمار
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
      title: "Active Subscriptions",
      value: activeSubs.toLocaleString(),
      icon: "💳",
      change: "Current running plans",
      color: "text-emerald-400",
    },
    {
      id: 3,
      title: "Monthly Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: "💰",
      change: "Total earnings from plans",
      color: "text-amber-400",
    },
  ];

  return (
    <main className="flex min-h-screen bg-[#0a0f1d] text-white">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-200">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time gym performance and analytics (View Only)
            </p>
          </div>

          {/* بخش کارت‌های آمار */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat: StatItem) => (
              <div
                key={stat.id}
                className="bg-[#0d1527] border border-slate-800/60 rounded-2xl p-6 shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </span>
                  <span className="text-2xl p-2 bg-slate-800/40 rounded-xl">
                    {stat.icon}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-slate-100 tracking-tight">
                    {stat.value}
                  </span>
                  <span className={`text-xs ${stat.color}`}>{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* بخش لیست آخرین فعالیت اعضا */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-300 px-1">
              Recent Activity
            </h2>

            {members.slice(0, 5).map((member: Member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-800/50 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl bg-slate-800 p-2 rounded-lg">
                    {member.status === "Active" ? "🟢" : "🔴"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Registered with {member.plan} Plan
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Just now
                </span>
              </div>
            ))}

            {members.length === 0 && (
              <p className="text-sm text-slate-500 py-8 text-center bg-slate-900/10 rounded-xl border border-dashed border-slate-800/60">
                No recent activity found.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
