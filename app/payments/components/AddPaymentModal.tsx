"use client";

import { addPaymentAction } from "../actions/actions";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentStatus } from "./types";

interface Member {
  id: string;
  fullName: string;
}

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose?: () => void;
  members: Member[];
}

export default function AddPaymentModal({
  isOpen,
  members,
}: AddPaymentModalProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    userId: "",
    memberName: "",
    amount: "",
    method: "Online" as "Online" | "Card" | "Cash",
    status: "Paid" as PaymentStatus,
  });

  const [searchText, setSearchText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const filteredMembers = members.filter((m) =>
    m.fullName.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleSelectMember = (member: Member) => {
    setForm({ ...form, userId: member.id, memberName: member.fullName });
    setSearchText(member.fullName);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setIsDropdownOpen(true);
    if (form.userId) {
      setForm({ ...form, userId: "", memberName: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userId || !form.amount) return;

    const formData = new FormData();
    formData.append("userId", form.userId);
    formData.append("amount", form.amount);
    formData.append("method", form.method);
    formData.append("status", form.status);

    await addPaymentAction(formData);

    setForm({
      userId: "",
      memberName: "",
      amount: "",
      method: "Online",
      status: "Paid",
    });
    setSearchText("");
    router.push("/payments");
  };

  const methodOptions = [
    {
      id: "Online" as const,
      title: "Online Payment",
      desc: "Instant gateway transfer",
      iconContainerClass: "bg-sky-500/10 border-sky-500/20 text-sky-400",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 010 18M12.5 3a17 17 0 000 18"
          />
        </svg>
      ),
    },
    {
      id: "Card" as const,
      title: "Card Reader / POS",
      desc: "Physical terminal swipe",
      iconContainerClass:
        "bg-purple-500/10 border-purple-500/20 text-purple-400",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      id: "Cash" as const,
      title: "Cash Payment",
      desc: "Hand-to-hand currency",
      iconContainerClass:
        "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
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
        onClick={() => router.push("/payments")}
      />

      <div className="bg-[#121824] border border-white/[0.08] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 text-left">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-200">Add New Payment</h3>
          <p className="text-xs text-slate-500 mt-1">
            Enter transaction details to register revenue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5 relative" ref={wrapperRef}>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Member
            </label>
            <input
              type="text"
              required
              autoComplete="off"
              placeholder="Start typing a name..."
              value={searchText}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={handleSearchChange}
              className="w-full bg-black/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />

            {form.userId && (
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                ✓ Selected: {form.memberName}
              </p>
            )}

            {isDropdownOpen && searchText.length > 0 && !form.userId && (
              <div className="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto bg-[#181f2e] border border-white/[0.1] rounded-xl shadow-2xl">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => handleSelectMember(m)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-blue-600/10 hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      {m.fullName}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-slate-500">
                    No matching member found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Amount ($)
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 150"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full bg-black/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Payment Method
            </label>
            <div className="space-y-2.5">
              {methodOptions.map((option) => {
                const isSelected = form.method === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setForm({ ...form, method: option.id })}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/10 border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                        : "bg-black/10 border-white/[0.04] hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center text-lg shadow-inner ${option.iconContainerClass}`}
                      >
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
                    checked={form.status === opt.id}
                    onChange={() => setForm({ ...form, status: opt.id })}
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
              onClick={() => router.push("/payments")}
              className="text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.userId}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.5)] cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
