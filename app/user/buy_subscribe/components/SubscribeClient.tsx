"use client";

import React, { useState } from "react";
import { Check, Zap, Crown, ShieldCheck, LucideIcon, CreditCard, } from "lucide-react";
import PaymentModal from "@/app/user/buy_subscribe/components/PaymentModal";

export interface PlanFromDB {
  id: string;
  name: string;
  price: number | string;
  duration: string;
  status: string;
}

interface SubscribeClientProps {
  plans: PlanFromDB[];
}

interface PlanCardProps {
  plan: PlanFromDB;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPurchase: (plan: PlanFromDB) => void;
}

const PLAN_ICONS: LucideIcon[] = [Zap, ShieldCheck, Crown];

const PLAN_FEATURES = [
  "All equipment access",
  "Workout tracker",
  "Locker & sauna",
] as const;

function formatDuration(duration: string | number): string {
  const num = parseInt(String(duration), 10);
  if (isNaN(num)) return String(duration);
  return num === 1 ? "1 Month" : `${num} Months`;
}

function PlanCard({
  plan,
  index,
  isSelected,
  onSelect,
  onPurchase,
}: PlanCardProps) {
  const Icon = PLAN_ICONS[index % PLAN_ICONS.length];

  return (
    <div
      onClick={() => onSelect(plan.id)}
      className={`relative rounded-3xl p-8 md:p-10 transition-all duration-300 cursor-pointer flex flex-col justify-between border min-h-[580px] ${
        isSelected
          ? "bg-white/[0.05] border-blue-500 shadow-2xl shadow-blue-500/15 scale-[1.02] z-10"
          : "bg-[#121824] border-white/[0.06] hover:border-white/[0.15]"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-8">
          <div
            className={`p-4 rounded-2xl ${
              isSelected
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-white/[0.04] text-slate-400"
            }`}
          >
            <Icon size={28} />
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300 bg-white/[0.06] px-4 py-1.5 rounded-full border border-white/[0.08]">
            {formatDuration(plan.duration)}
          </span>
        </div>

        <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>

        <p className="text-sm text-slate-400 mt-2 mb-8 leading-relaxed">
          Full gym access & instant progress tracking.
        </p>

        <div className="flex items-baseline gap-1 mb-8 pb-8 border-b border-white/[0.06]">
          <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
            ${Number(plan.price).toLocaleString("en-US")}
          </span>
          <span className="text-slate-400 text-sm font-medium">/ plan</span>
        </div>

        <div className="space-y-4">
          {PLAN_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 text-sm text-slate-300"
            >
              <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Check size={14} strokeWidth={3} />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPurchase(plan);
        }}
        className={`w-full mt-10 py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
          isSelected
            ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
            : "bg-white/[0.06] text-slate-200 hover:bg-white/[0.12]"
        }`}
      >
        {isSelected ? "Get Started" : "Select Plan"}
      </button>
    </div>
  );
}

export default function SubscribeClient({ plans = [] }: SubscribeClientProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(
    plans?.[0]?.id || "",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePlan, setActivePlan] = useState<{
    name: string;
    price: number;
  } | null>(null);

  const handlePurchase = (plan: PlanFromDB) => {
    setSelectedPlan(plan.id);

    setActivePlan({
      name: String(plan.name),
      price: Number(plan.price) || 0,
    });

    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans p-4 md:p-5 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/40 via-[#121824] to-[#121824] border border-white/[0.08] rounded-3xl p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
                <CreditCard size={15} />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Pick Your Power Plan
              </h1>
            </div>
            <p className="text-slate-400 max-w-md mx-auto text-sm md:text-base">
              No fluff, just pure gains. Choose what fits your routine best.
            </p>
          </div>
        </div>
        {plans.length === 0 ? (
          <div className="bg-[#121824] border border-white/[0.06] rounded-3xl p-16 text-center text-slate-400 my-auto">
            No active plans available right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch flex-1">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                index={index}
                isSelected={selectedPlan === plan.id}
                onSelect={setSelectedPlan}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}

        {activePlan && (
          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            amount={activePlan.price}
            planName={activePlan.name}
          />
        )}
      </div>
    </div>
  );
}
