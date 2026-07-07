"use client";

import React from "react";
import { Transaction } from "./types";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  transaction,
}: InvoiceModalProps) {
  if (!isOpen || !transaction) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#121824] border border-white/[0.06] rounded-2xl p-6 shadow-2xl z-10 text-slate-200">
        <div className="flex justify-between items-center border-b border-white/[0.04] pb-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Receipt / Invoice
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {transaction.invoiceNo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm bg-white/[0.02] hover:bg-white/[0.06] px-3 py-1.5 rounded-lg transition-colors border border-white/[0.04]"
          >
            Close
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              Gym Hero
            </span>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusColor(transaction.status)}`}
          >
            {transaction.status}
          </span>
        </div>

        <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/[0.02] mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Member Name:</span>
            <span className="font-medium text-white">
              {transaction.memberName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Payment Method:</span>
            <span className="font-medium text-slate-300">
              {transaction.method}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Transaction Date:</span>
            <span className="font-mono text-slate-300">{transaction.date}</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-dashed border-white/[0.1] pt-4 mb-6">
          <span className="text-sm font-medium text-slate-300">
            Total Amount
          </span>
          <span className="text-2xl font-bold text-blue-400 tracking-tight">
            ${transaction.amount.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium py-2.5 rounded-xl transition-all border border-white/[0.06] active:scale-[0.98]"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
} 
