import React from "react";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import GlowLayout from "@/app/components/GlowLayout";
import AddPlanModal from "./components/AddPlanModal";
import PlanModals from "./components/DeleteandEditmodal";
import { createClient } from "@/utils/supabase/server";
import {
  Plus,
  Package,
  Users,
  Calendar,
  CreditCard,
  Pencil,
  Trash2,
  PackageOpen,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SubscriptionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeModal =
    typeof params.modal === "string" ? params.modal : undefined;
  const selectedPlanId = typeof params.id === "string" ? params.id : undefined;

  const supabase = await createClient();

  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: activeSubscriptions } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("status", "Active");

  const activeMembersMap: Record<string, number> = {};
  activeSubscriptions?.forEach((sub) => {
    if (sub.plan_id) {
      activeMembersMap[sub.plan_id] = (activeMembersMap[sub.plan_id] || 0) + 1;
    }
  });

  const selectedPlan = plans?.find((plan) => plan.id === selectedPlanId);

  return (
    <GlowLayout>
      <div className="flex h-screen w-full bg-[#0b1224] text-white overflow-hidden">
        <Sidebar />

        <main className="flex-1 h-full bg-[#0b1224] p-4 md:p-8 space-y-6 overflow-y-auto z-10">
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/[0.04] pb-5">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                    Subscriptions
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage gym membership packages and pricing
                  </p>
                </div>
              </div>

              <Link
                href="?modal=add-plan"
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Plan</span>
              </Link>
            </div>

            {plans && plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const memberCount = activeMembersMap[plan.id] || 0;
                  const isActive = plan.status === "Active";

                  return (
                    <div
                      key={plan.id}
                      className="bg-[#121824]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.06] shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/30 flex flex-col justify-between min-h-[290px]"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-5">
                          <span className="text-base font-bold text-slate-100 tracking-wide flex items-center gap-2">
                            {plan.name}
                          </span>
                          <span
                            className={`text-[11px] px-2.5 py-1 rounded-full font-medium border flex items-center gap-1.5 ${
                              isActive
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? "bg-emerald-400" : "bg-rose-400"
                              }`}
                            />
                            {plan.status}
                          </span>
                        </div>

                        <div className="space-y-3.5 my-4 text-sm bg-black/30 p-4 rounded-xl border border-white/[0.03]">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs flex items-center gap-1.5">
                              <CreditCard className="w-4 h-4 text-slate-500" />
                              Price:
                            </span>
                            <span className="font-bold text-blue-400 text-base font-mono">
                              ${Number(plan.price).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              Duration:
                            </span>
                            <span className="font-medium text-slate-300">
                              {plan.duration}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-slate-500" />
                              Active Members:
                            </span>
                            <span className="font-semibold text-slate-200 font-mono">
                              {memberCount} Athletes
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2.5 border-t border-white/[0.04] pt-4 mt-2">
                        <Link
                          href={`?modal=edit-plan&id=${plan.id}`}
                          className="flex-1 bg-slate-800/80 hover:bg-slate-700 text-center text-xs text-slate-300 py-2.5 rounded-xl border border-white/[0.06] font-medium transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Pencil className="w-3.5 h-3.5 text-slate-400" />
                          <span>Edit</span>
                        </Link>
                        <Link
                          href={`?modal=delete-plan&id=${plan.id}`}
                          className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-center text-xs text-rose-400 py-2.5 rounded-xl border border-rose-500/20 font-medium transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center min-h-[380px] bg-[#121824]/50 border border-dashed border-white/10 rounded-2xl p-8 text-center backdrop-blur-xl">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 mb-4">
                  <PackageOpen className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200">
                  No Subscription Plans Found
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
                  You haven&apos;t created any membership plans yet. Start by
                  adding your first gym plan for your athletes.
                </p>
                <Link
                  href="?modal=add-plan"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Plan</span>
                </Link>
              </div>
            )}
          </div>
        </main>

        <AddPlanModal isOpen={activeModal === "add-plan"} />

        <PlanModals
          activeModal={activeModal}
          plan={selectedPlan}
          planId={selectedPlanId}
        />
      </div>
    </GlowLayout>
  );
}
