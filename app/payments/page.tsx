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
    <div className="flex min-h-screen bg-[#0a0f1d] text-slate-100 font-sans antialiased">
      <Sidebar />

      <div className="flex-1 bg-[#0a0f1d] p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.04] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Financial Transactions
            </h1>
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

        <div className="grid grid-cols-1 gap-6">
          <RevenueChartWrapper transactions={transactions} />
        </div>

        <TransactionTable transactions={transactions} />
      </div>

      <AddPaymentModalWrapper isOpen={isModalOpen} members={members} />
    </div>
  );
}
