"use client";

import React, { useMemo } from "react";
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
  // ۱. فیلتر تراکنش‌های موفق با دسترسی امن و منعطف به فیلد تاریخ (Any-Casting موقت برای حل خط قرمز)
  const paidTransactions = useMemo(() => {
    return (transactions || []).filter((tx: any) => {
      const isPaid = tx.status?.toLowerCase() === "paid";
      // بررسی اینکه فیلد تاریخ چه با نام created_at و چه با نام‌های دیگر وجود داشته باشد
      const hasDate = tx.created_at || tx.date || tx.timestamp;
      return isPaid && hasDate;
    });
  }, [transactions]);

  // ۲. پردازش حرفه‌ای دیتای زنده بر روی ساختار فیک پروژه
  const chartData = useMemo(() => {
    const now = new Date();
    const currentUTCString = now.toISOString();
    const [currentDateUTC] = currentUTCString.split("T");
    const [currentYear, currentMonth] = currentDateUTC.split("-");

    switch (timeFrame) {
      case "Today": {
        const todayTemplate = [
          { name: "00:00", revenue: 0 },
          { name: "02:00", revenue: 0 },
          { name: "04:00", revenue: 0 },
          { name: "06:00", revenue: 0 },
          { name: "08:00", revenue: 0 },
          { name: "10:00", revenue: 0 },
          { name: "12:00", revenue: 0 },
          { name: "14:00", revenue: 0 },
          { name: "16:00", revenue: 0 },
          { name: "18:00", revenue: 0 },
          { name: "20:00", revenue: 0 },
          { name: "22:00", revenue: 0 },
        ];

        paidTransactions.forEach((tx: any) => {
          // گرفتن تاریخ از هر فیلد ممکنی که سوپابیس فرستاده
          const rawDate = tx.created_at || tx.date || tx.timestamp;
          if (!rawDate) return;

          const [txDate, txTime] = rawDate.split("T");

          if (txDate === currentDateUTC) {
            const hour = parseInt(txTime?.substring(0, 2) || "0", 10);
            const bucketIndex = Math.floor(hour / 2);
            if (todayTemplate[bucketIndex]) {
              todayTemplate[bucketIndex].revenue += Number(tx.amount || 0);
            }
          }
        });

        return todayTemplate;
      }

      case "Month": {
        const monthTemplate = [
          { name: "Day 1", revenue: 0 },
          { name: "Day 5", revenue: 0 },
          { name: "Day 10", revenue: 0 },
          { name: "Day 15", revenue: 0 },
          { name: "Day 20", revenue: 0 },
          { name: "Day 25", revenue: 0 },
          { name: "Day 30", revenue: 0 },
        ];

        paidTransactions.forEach((tx: any) => {
          const rawDate = tx.created_at || tx.date || tx.timestamp;
          if (!rawDate) return;

          const [txDate] = rawDate.split("T");
          const [year, month, dayStr] = txDate.split("-");

          if (year === currentYear && month === currentMonth) {
            const day = parseInt(dayStr, 10);
            if (day <= 3) monthTemplate[0].revenue += Number(tx.amount || 0);
            else if (day <= 7)
              monthTemplate[1].revenue += Number(tx.amount || 0);
            else if (day <= 12)
              monthTemplate[2].revenue += Number(tx.amount || 0);
            else if (day <= 17)
              monthTemplate[3].revenue += Number(tx.amount || 0);
            else if (day <= 22)
              monthTemplate[4].revenue += Number(tx.amount || 0);
            else if (day <= 27)
              monthTemplate[5].revenue += Number(tx.amount || 0);
            else monthTemplate[6].revenue += Number(tx.amount || 0);
          }
        });

        return monthTemplate;
      }

      case "Year":
      default: {
        const yearTemplate = [
          { name: "Jan", revenue: 0 },
          { name: "Feb", revenue: 0 },
          { name: "Mar", revenue: 0 },
          { name: "Apr", revenue: 0 },
          { name: "May", revenue: 0 },
          { name: "Jun", revenue: 0 },
          { name: "Jul", revenue: 0 },
          { name: "Aug", revenue: 0 },
          { name: "Sep", revenue: 0 },
          { name: "Oct", revenue: 0 },
          { name: "Nov", revenue: 0 },
          { name: "Dec", revenue: 0 },
        ];

        paidTransactions.forEach((tx: any) => {
          const rawDate = tx.created_at || tx.date || tx.timestamp;
          if (!rawDate) return;

          const [txDate] = rawDate.split("T");
          const [year, monthStr] = txDate.split("-");

          if (year === currentYear) {
            const monthIndex = parseInt(monthStr, 10) - 1;
            if (yearTemplate[monthIndex]) {
              yearTemplate[monthIndex].revenue += Number(tx.amount || 0);
            }
          }
        });

        return yearTemplate;
      }
    }
  }, [timeFrame, paidTransactions]);

  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0);
  }, [chartData]);

  const chartKey = `${timeFrame}-${paidTransactions.length}-${totalRevenue}`;

  return (
    <div className="bg-[#121824] rounded-2xl border border-white/[0.04] p-6 shadow-xl w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-200">
            Revenue Analytics
          </h3>
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
        <ResponsiveContainer width="100%" height="100%" key={chartKey}>
          <AreaChart
            data={chartData}
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
