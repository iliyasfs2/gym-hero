"use client";

import React, { useState } from "react";
import { Check, Zap, Crown, ShieldCheck } from "lucide-react";

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

export default function SubscribeClient({ plans = [] }: SubscribeClientProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(
    plans?.[0]?.id || "",
  );
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const getPlanIcon = (index: number) => {
    const icons = [Zap, ShieldCheck, Crown];
    return icons[index % icons.length];
  };

  const handlePurchase = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlan(planId);
    setLoadingPlanId(planId);

    setTimeout(() => {
      alert(`Proceeding to checkout for plan ID: ${planId}`);
      setLoadingPlanId(null);
    }, 1000);
  };

  return (
    <div className="pt-2 pb-14 px-6 md:px-12 max-w-7xl mx-auto min-h-screen flex flex-col justify-between space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Pick Your Power Plan
        </h1>
        <p className="text-slate-400 max-w-md mx-auto text-sm md:text-base">
          No fluff, just pure gains. Choose what fits your routine best.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="bg-[#121824] border border-white/[0.06] rounded-3xl p-16 text-center text-slate-400 my-auto">
          No active plans available right now. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch flex-1">
          {plans.map((plan, index) => {
            const Icon = getPlanIcon(index);
            const isSelected = selectedPlan === plan.id;
            const isLoading = loadingPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
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
                    <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 bg-white/[0.04] px-4 py-1.5 rounded-full border border-white/[0.06]">
                      {plan.duration}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 mb-8 leading-relaxed">
                    Full gym access & instant progress tracking.
                  </p>

                  <div className="flex items-baseline gap-1 mb-8 pb-8 border-b border-white/[0.06]">
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                      ${Number(plan.price).toLocaleString("en-US")}
                    </span>
                    <span className="text-slate-400 text-sm font-medium">
                      / plan
                    </span>
                  </div>

                  <div className="space-y-4">
                    {[
                      "All equipment access",
                      "Workout tracker",
                      "Locker & sauna",
                    ].map((feature, idx) => (
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
                  onClick={(e) => handlePurchase(plan.id, e)}
                  disabled={isLoading}
                  className={`w-full mt-10 py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                      : "bg-white/[0.06] text-slate-200 hover:bg-white/[0.12]"
                  }`}
                >
                  {isLoading
                    ? "Processing..."
                    : isSelected
                      ? "Get Started"
                      : "Select Plan"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
