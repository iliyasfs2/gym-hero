"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, ArrowRight, Check } from "lucide-react";
import { completeOnboarding } from "./actions";

export function OnboardingForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim()) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setError(null);
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phone);

    startTransition(async () => {
      const res = await completeOnboarding(formData);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 1 ? "bg-blue-600 text-white" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"}`}
          >
            {step === 1 ? "1" : <Check size={14} />}
          </div>
          <div
            className={`h-0.5 w-12 transition-colors ${step === 2 ? "bg-blue-600" : "bg-white/[0.1]"}`}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 2 ? "bg-blue-600 text-white" : "bg-white/[0.05] text-slate-500"}`}
          >
            2
          </div>
        </div>
        <span className="text-xs font-medium text-slate-400">
          Step {step} of 2
        </span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleNext}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                What's your name?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Please enter your full name to set up your profile.
              </p>
            </div>

            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={!fullName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-blue-600/20"
            >
              <span>Continue</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                Phone number
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Used for workout updates and gym membership info.
              </p>
            </div>

            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 234 567 8900"
                className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {error && (
              <div className="text-xs p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 py-3.5 rounded-xl text-sm font-medium transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isPending || !phone.trim()}
                className="w-2/3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
              >
                <span>{isPending ? "Saving..." : "Complete Setup"}</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
