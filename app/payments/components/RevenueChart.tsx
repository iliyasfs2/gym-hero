"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TimeFrame, Transaction } from "./types";

interface RevenueChartProps {
  timeFrame: TimeFrame;
  setTimeFrame: (value: TimeFrame) => void;
  transactions: Transaction[];
}

export default function RevenueChart({
  timeFrame,
  setTimeFrame,
  transactions,
}: RevenueChartProps) {
  const paidTransactions = transactions.filter((tx) => tx.status === "Paid");

  const getChartData = () => {
    switch (timeFrame) {
      case "Today":
        const baseHours = [
          { name: "00:00", revenue: 400 },
          { name: "02:00", revenue: 200 },
          { name: "04:00", revenue: 100 },
          { name: "06:00", revenue: 300 },
          { name: "08:00", revenue: 1200 },
          { name: "10:00", revenue: 2500 },
          { name: "12:00", revenue: 3400 },
          { name: "14:00", revenue: 2900 },
          { name: "16:00", revenue: 2100 },
          { name: "18:00", revenue: 4200 },
          { name: "20:00", revenue: 5100 },
          { name: "22:00", revenue: 1800 },
        ];

        const newTodayAmount = paidTransactions
          .filter((tx) => tx.id.startsWith("t_"))
          .reduce((sum, tx) => sum + tx.amount, 0);
        baseHours[8].revenue += newTodayAmount;
        return baseHours;

      case "Month":
        const baseDays = [
          { name: "Day 1", revenue: 1100 },
          { name: "Day 5", revenue: 1800 },
          { name: "Day 10", revenue: 2500 },
          { name: "Day 15", revenue: 2200 },
          { name: "Day 20", revenue: 3600 },
          { name: "Day 25", revenue: 4800 },
          { name: "Day 30", revenue: 5400 },
        ];

        const newMonthAmount = paidTransactions
          .filter((tx) => tx.id.startsWith("t_"))
          .reduce((sum, tx) => sum + tx.amount, 0);
        baseDays[6].revenue += newMonthAmount;
        return baseDays;

      case "Year":
      default:
        const baseMonths = [
          { name: "Jan", revenue: 1200 },
          { name: "Feb", revenue: 2100 },
          { name: "Mar", revenue: 3200 },
          { name: "Apr", revenue: 2800 },
          { name: "May", revenue: 4100 },
          { name: "Jun", revenue: 5300 },
          { name: "Jul", revenue: 4900 },
          { name: "Aug", revenue: 5200 },
          { name: "Sep", revenue: 5600 },
          { name: "Oct", revenue: 5100 },
          { name: "Nov", revenue: 5800 },
          { name: "Dec", revenue: 6000 },
        ];

        const newYearAmount = paidTransactions
          .filter((tx) => tx.id.startsWith("t_"))
          .reduce((sum, tx) => sum + tx.amount, 0);
        baseMonths[6].revenue += newYearAmount;
        return baseMonths;
    }
  };

  const data = getChartData();

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-[#121824] rounded-2xl border border-white/[0.04] p-6 shadow-xl w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-200">Monthly Revenue</h3>
          <p className="text-sm font-semibold text-blue-400 mt-0.5">
            Total: ${totalRevenue.toLocaleString()}
          </p>
        </div>

       
        <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/[0.05]">
          {(["Today", "Month", "Year"] as TimeFrame[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeFrame(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeFrame === tab
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
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
              stroke="rgba(255,255,255,0.02)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                color: "#f8fafc",
              }}
              itemStyle={{ color: "#3b82f6" }}
              cursor={{ stroke: "rgba(255,255,255,0.04)" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
