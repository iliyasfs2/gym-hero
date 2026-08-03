"use client";

import React, { JSX } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export interface ChartDataPoint {
  month: string;
  revenue: number;
  registrations: number;
}

export interface RecentActivity {
  id: string;
  name: string;
  plan: string;
  price?: number;
  status: "active" | "inactive";
  date: string;
}

interface AnalyticsChartsProps {
  data: ChartDataPoint[];
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function AnalyticsCharts({
  data = [],
}: AnalyticsChartsProps): JSX.Element {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-[#141822] rounded-2xl border border-white/[0.08] text-slate-400 text-sm">
        No analytics data available.
      </div>
    );
  }

  const parseNumericValue = (val: unknown): number => {
    if (Array.isArray(val)) {
      return Number(val[0] ?? 0);
    }
    return Number(val ?? 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-[#141822] p-6 rounded-2xl shadow-xl border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-200">
              Monthly Revenue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Total earnings trend over time
            </p>
          </div>
          <div className="p-2.5 rounded-xl border bg-sky-500/10 border-sky-500/20">
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
                d="M3 3v18h18M7 15l4-6 3 3 5-7"
              />
            </svg>
          </div>
        </div>

        <div className="h-[260px] w-full text-xs font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
              <YAxis
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: number) => `$${val.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d1117",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#60a5fa" }}
                formatter={(value: unknown) => [
                  currencyFormatter.format(parseNumericValue(value)),
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#141822] p-6 rounded-2xl shadow-xl border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-200">
              Monthly Registrations
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              New registered athletes per month
            </p>
          </div>
          <div className="p-2.5 rounded-xl border bg-sky-500/10 border-sky-500/20">
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
          </div>
        </div>
        <div className="h-[260px] w-full text-xs font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d1117",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#60a5fa" }}
                formatter={(value: unknown) => [
                  `${parseNumericValue(value).toLocaleString()} athletes`,
                  "Registrations",
                ]}
              />
              <Bar
                dataKey="registrations"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
