"use client";

import React, { useState } from "react";
import { PaymentStatus, Transaction } from "./types";

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payment: Omit<Transaction, "id" | "date" | "invoiceNo">) => void;
}

export default function AddPaymentModal({
  isOpen,
  onClose,
  onAdd,
}: AddPaymentModalProps) {
  const [memberName, setMemberName] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"Online" | "Card" | "Cash">("Online");
  const [status, setStatus] = useState<PaymentStatus>("Paid");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !amount) return;

    onAdd({
      memberName,
      amount: Number(amount),
      method,
      status,
    });

    setMemberName("");
    setAmount("");
    setMethod("Online");
    setStatus("Paid");
    onClose();
  };

  const methodOptions = [
    {
      id: "Online" as const,
      title: "Online Payment",
      desc: "Instant gateway transfer",
      icon: "🌐",
    },
    {
      id: "Card" as const,
      title: "Card Reader / POS",
      desc: "Physical terminal swipe",
      icon: "💳",
    },
    {
      id: "Cash" as const,
      title: "Cash Payment",
      desc: "Hand-to-hand currency",
      icon: "💵",
    },
  ];

  const statusOptions: { id: PaymentStatus; label: string; color: string }[] = [
    {
      id: "Paid",
      label: "Paid",
      color:
        "peer-checked:border-emerald-500/50 peer-checked:bg-emerald-500/10 peer-checked:text-emerald-400",
    },
    {
      id: "Pending",
      label: "Pending",
      color:
        "peer-checked:border-amber-500/50 peer-checked:bg-amber-500/10 peer-checked:text-amber-400",
    },
    {
      id: "Failed",
      label: "Failed",
      color:
        "peer-checked:border-rose-500/50 peer-checked:bg-rose-500/10 peer-checked:text-rose-400",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="bg-[#121824] border border-white/[0.08] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 text-left">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-200">Add New Payment</h3>
          <p className="text-xs text-slate-500 mt-1">
            Enter transaction details to register revenue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="w-full bg-black/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Amount ($)
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 150"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Payment Method
            </label>
            <div className="space-y-2.5">
              {methodOptions.map((option) => {
                const isSelected = method === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setMethod(option.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/10 border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                        : "bg-black/10 border-white/[0.04] hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-lg shadow-inner">
                        {option.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200">
                          {option.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {option.desc}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-600"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Initial Status
            </label>
            <div className="grid grid-cols-3 gap-2 bg-black/20 p-1.5 rounded-xl border border-white/[0.06]">
              {statusOptions.map((opt) => (
                <label key={opt.id} className="relative block cursor-pointer">
                  <input
                    type="radio"
                    name="paymentStatus"
                    value={opt.id}
                    checked={status === opt.id}
                    onChange={() => setStatus(opt.id)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-full text-center py-2.5 rounded-lg text-xs font-semibold text-slate-500 border border-transparent transition-all duration-200 hover:text-slate-300 ${opt.color}`}
                  >
                    {opt.id === "Paid"
                      ? "● Paid"
                      : opt.id === "Pending"
                        ? "● Pending"
                        : "● Failed"}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/[0.04] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.5)] cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
