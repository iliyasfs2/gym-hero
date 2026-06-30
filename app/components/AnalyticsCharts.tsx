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


const monthlyAnalyticsData: ChartDataPoint[] = [
  { month: "Jan", revenue: 1200, registrations: 12 },
  { month: "Feb", revenue: 1900, registrations: 18 },
  { month: "Mar", revenue: 3200, registrations: 26 },
  { month: "Apr", revenue: 2800, registrations: 20 },
  { month: "May", revenue: 4100, registrations: 35 },
  { month: "Jun", revenue: 5300, registrations: 42 },
];

export default function AnalyticsCharts(): JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    
      <div className="glass-card-fixed p-6 rounded-2xl shadow-xl border border-white/[0.04]">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-200">
            Monthly Revenue
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Total earnings trend over time
          </p>
        </div>

        <div className="h-[260px] w-full text-xs font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyAnalyticsData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.03)"
                vertical={false}
              />
              <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#60a5fa" }}
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

     
      <div className="glass-card-fixed p-6 rounded-2xl shadow-xl border border-white/[0.04]">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-200">
            Monthly Registrations
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            New registered athletes per month
          </p>
        </div>

        <div className="h-[260px] w-full text-xs font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyAnalyticsData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.03)"
                vertical={false}
              />
              <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#34d399" }}
              />
              <Bar
                dataKey="registrations"
                fill="#10b981"
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
