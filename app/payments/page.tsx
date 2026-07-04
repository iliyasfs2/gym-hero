"use client";

import React, { useState } from "react";
import RevenueChart from "./components/RevenueChart";
import TransactionTable from "./components/PaymentTable";
import AddPaymentModal from "./components/AddPaymentModal";
import { TimeFrame, Transaction } from "./components/types";
import Sidebar from "@/app/components/Sidebar";

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    memberName: "Ali Ahmadi",
    amount: 150,
    method: "Online",
    date: "2026-07-03",
    status: "Paid",
    invoiceNo: "INV-8821",
  },
  {
    id: "t2",
    memberName: "Sara Kamali",
    amount: 100,
    method: "Card",
    date: "2026-07-02",
    status: "Pending",
    invoiceNo: "INV-8822",
  },
  {
    id: "t3",
    memberName: "Reza Nouri",
    amount: 150,
    method: "Cash",
    date: "2026-07-01",
    status: "Paid",
    invoiceNo: "INV-8823",
  },
  {
    id: "t4",
    memberName: "Mina Alavi",
    amount: 50,
    method: "Online",
    date: "2026-06-28",
    status: "Failed",
    invoiceNo: "INV-8824",
  },
  {
    id: "t5",
    memberName: "Arash Moradi",
    amount: 150,
    method: "Online",
    date: "2026-06-25",
    status: "Paid",
    invoiceNo: "INV-8825",
  },
];

export default function PaymentsPage() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("Month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const handleAddNewPayment = (
    newTx: Omit<Transaction, "id" | "date" | "invoiceNo">,
  ) => {
    const fullTransaction: Transaction = {
      ...newTx,
      id: `t_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setTransactions((prev) => [fullTransaction, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-[#0b1224] text-slate-100 font-sans antialiased">
      <Sidebar />

      <div className="flex-1 bg-[#0b1224] p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.04] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Financial Transactions
            </h1>
            <p className="text-sm text-slate-400 mt-1.5">
              Real-time gym revenue, timeframes, and member invoices.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.45)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-white/10"
          >
            <span className="text-lg font-bold">+</span>
            <span>Add Payment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <RevenueChart
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            transactions={transactions}
          />
        </div>

        <TransactionTable transactions={transactions} />

        <AddPaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddNewPayment}
        />
      </div>
    </div>
  );
}
