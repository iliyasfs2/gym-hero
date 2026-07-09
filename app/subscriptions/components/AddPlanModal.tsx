"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface AddPlanModalProps {
  isOpen: boolean;
}

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPlanModal({ isOpen, onClose }: AddPlanModalProps) {
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleClose = () => {
    router.push("/subscriptions");
    
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm w-full h-full"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[480px] bg-[#0c0f17]/40 backdrop-blur-2xl border border-white/[0.05] rounded-3xl p-8 shadow-2xl z-10 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Add Gym Plan
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter plan details to register a new subscription
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g., Diamond Elite"
              className="w-full bg-black/20 border border-white/[0.04] rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">
                  $
                </span>
                <input
                  type="number"
                  placeholder="150"
                  className="w-full bg-black/20 border border-white/[0.04] rounded-xl pl-8 pr-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Duration
              </label>
              <input
                type="text"
                placeholder="6 Months"
                className="w-full bg-black/20 border border-white/[0.04] rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Membership Plan
            </label>
            <div className="space-y-3">
        
              <div
                onClick={() => setStatus("Active")}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  status === "Active"
                    ? "border-blue-500/80 bg-blue-500/[0.03] ring-1 ring-blue-500/30"
                    : "border-white/[0.04] bg-black/10 hover:border-white/[0.08]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🟢</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      Active
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Visible to everyone
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      status === "Active"
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-700"
                    }`}
                  >
                    {status === "Active" && (
                      <span className="text-[10px]">✓</span>
                    )}
                  </div>
                </div>
              </div>

            
              <div
                onClick={() => setStatus("Inactive")}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  status === "Inactive"
                    ? "border-blue-500/80 bg-blue-500/[0.03] ring-1 ring-blue-500/30"
                    : "border-white/[0.04] bg-black/10 hover:border-white/[0.08]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🔴</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      Inactive
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Hidden in drafts
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      status === "Inactive"
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-700"
                    }`}
                  >
                    {status === "Inactive" && (
                      <span className="text-[10px]">✓</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-5 pt-4 mt-6">
            <button
              type="button"
              onClick={handleClose} 
              className="text-slate-400 hover:text-white text-sm font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleClose} 
              className="bg-[#1b63ff] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
