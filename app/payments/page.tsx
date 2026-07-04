"use client";

import React, { useState } from "react";
import RevenueChart from "./components/RevenueChart";
import { TimeFrame } from "./components/types";

export default function PaymentsPage() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("Month");

  return (
    <div className="min-h-screen bg-[#0b1224] text-white p-4 md:p-8 space-y-6">
      {/* هدر بالایی صفحه */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-200">
            Financial Transactions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage gym revenue, timeframes, and member invoices.
          </p>
        </div>
      </div>

      {/* بخش چارت نئونی آبی که امروز ساختی */}
      <div className="grid grid-cols-1 gap-6">
        <RevenueChart timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
      </div>

      {/* جالی خالی برای جدول فردا */}
      <div className="glass-card-fixed rounded-2xl border border-white/[0.04] p-8 text-center text-sm text-slate-500 bg-white/[0.01]">
        🔄 Transaction Table and Filters will be connected here tomorrow.
      </div>
    </div>
  );
}
