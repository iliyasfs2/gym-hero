import React from "react";
import Link from "next/link";
import RevenueChartWrapper from "./components/RevenueChartWrapper";
import TransactionTable from "./components/PaymentTable";
import AddPaymentModalWrapper from "./components/AddPaymentModal";
import { PaymentStatus, Transaction } from "./components/types";
import Sidebar from "@/app/components/Sidebar";
import GlowLayout from "@/app/components/GlowLayout";
import { createClient } from "@/utils/supabase/server";

interface SubscriptionRow {
  id: string;
  user_id: string;
  amount: number | string | null;
  method?: string | null;
  start_date?: string | null;
  created_at?: string | null;
  payment_status?: PaymentStatus | null;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ modal?: string }>;
}) {
  const supabase = await createClient();

  const { data: subscriptions } = await supabase
    .from("user_subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .order("full_name", { ascending: true });

  const profileMap = new Map(
    ((profiles as ProfileRow[]) || []).map((p) => [p.id, p.full_name]),
  );

  const transactions: Transaction[] = (
    (subscriptions as SubscriptionRow[]) || []
  ).map((sub) => ({
    id: sub.id,
    memberName: profileMap.get(sub.user_id) || "Unknown Member",
    amount: Number(sub.amount) || 0,
    method: sub.method || "Online",
    date: sub.start_date
      ? sub.start_date.split("T")[0]
      : sub.created_at
        ? sub.created_at.split("T")[0]
        : "",
    status: sub.payment_status || "Paid",
    invoiceNo: `SUB-${String(sub.id).slice(0, 8).toUpperCase()}`,
  }));

  const members = ((profiles as ProfileRow[]) || []).map((p) => ({
    id: p.id,
    fullName: p.full_name || "Unnamed User",
  }));

  const resolvedParams = await searchParams;
  const isModalOpen = resolvedParams.modal === "add-payment";

  return (
    <GlowLayout>
      <div className="flex flex-col md:flex-row h-dvh w-full bg-[#0a0f1d] text-white overflow-hidden">
        <Sidebar />
        <div className="flex-1 min-h-0 bg-[#0a0f1d] overflow-y-auto z-10 transition-all duration-300">
          <div className="w-full max-w-7xl mx-auto px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-8 space-y-5 sm:space-y-6">
            <div className="w-full">
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/40 via-[#121824] to-[#121824] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
                <div className="space-y-1 z-10">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                      Financial Transactions
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Real-time gym revenue, timeframes, and member invoices.
                  </p>
                </div>
                <Link
                  href="?modal=add-payment"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.45)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-white/10"
                >
                  <span className="text-lg font-bold">+</span>
                  <span>Add Payment</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <RevenueChartWrapper transactions={transactions} />
            </div>

            <TransactionTable transactions={transactions} />
          </div>
        </div>

        <AddPaymentModalWrapper isOpen={isModalOpen} members={members} />
      </div>
    </GlowLayout>
  );
}