import React from "react";
import RevenueChartWrapper from "./components/RevenueChartWrapper";
import TransactionTable from "./components/PaymentTable";
import AddPaymentModalWrapper from "./components/AddPaymentModal";
import { Transaction } from "./components/types";
import Sidebar from "@/app/components/Sidebar";
import { createClient } from "@/utils/supabase/server";

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

  const userIds = Array.from(
    new Set((subscriptions || []).map((s: any) => s.user_id).filter(Boolean)),
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .order("full_name", { ascending: true });

  const profileMap = new Map(
    (profiles || []).map((p: any) => [p.id, p.full_name]),
  );

  const transactions: Transaction[] = (subscriptions || []).map((sub: any) => ({
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

  const members = (profiles || []).map((p: any) => ({
    id: p.id,
    fullName: p.full_name || "Unnamed User",
  }));

  const resolvedParams = await searchParams;
  const isModalOpen = resolvedParams.modal === "add-payment";

  return (
    <div className="flex h-screen w-full bg-[#0a0f1d] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full bg-[#0a0f1d] overflow-y-auto z-10 transition-all duration-300">
        <div className="w-full max-w-7xl mx-auto px-6 py-6 md:px-12 md:py-8 space-y-6">
          <div className="w-full">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/40 via-[#121824] to-[#121824] border border-white/[0.08] rounded-3xl p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
              <div className="space-y-1.5 z-10">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Financial Transactions
                  </h1>
                </div>
                <p className="text-sm text-slate-400 mt-1.5">
                  Real-time gym revenue, timeframes, and member invoices.
                </p>
              </div>
              <a
                href="?modal=add-payment"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.45)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-white/10"
              >
                <span className="text-lg font-bold">+</span>
                <span>Add Payment</span>
              </a>
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
  );
}