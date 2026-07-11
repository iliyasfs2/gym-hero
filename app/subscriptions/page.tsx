import React from "react";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import GlowLayout from "@/app/components/GlowLayout";
import AddPlanModal from "./components/AddPlanModal";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SubscriptionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeModal = params.modal;

  
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <GlowLayout>
      <div className="flex h-screen w-full bg-[#0b1224] text-white overflow-hidden">
        <Sidebar />

        <main className="flex-1 h-full bg-[#0b1224] p-4 md:p-8 space-y-6 overflow-y-auto z-10">
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/[0.02] pb-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-200 tracking-tight">
                  📄 Subscriptions
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage gym membership packages and pricing
                </p>
              </div>

              <Link
                href="?modal=add-plan"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95"
              >
                <span>+</span>
                <span>Add New Plan</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans?.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-[#121824]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.04] shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/20 flex flex-col justify-between min-h-[290px]"
                >
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-sm font-bold text-slate-200 tracking-wide">
                        🏷️ {plan.name}
                      </span>
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium border ${
                          plan.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        ● {plan.status}
                      </span>
                    </div>

                    <div className="space-y-3.5 my-4 text-sm bg-black/20 p-4 rounded-xl border border-white/[0.02]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">💰 Price:</span>
                        <span className="font-bold text-blue-400 text-base font-mono">
                          {Number(plan.price).toLocaleString()} Toman
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">📅 Duration:</span>
                        <span className="font-medium text-slate-300">
                          {plan.duration}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">
                          👥 Active Members:
                        </span>
                        <span className="font-semibold text-slate-200 font-mono">
                          {plan.active_members || 0} Athletes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 border-t border-white/[0.04] pt-4 mt-2">
                    <Link
                      href={`?modal=edit-plan&id=${plan.id}`}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-center text-xs text-slate-300 py-2.5 rounded-xl border border-white/[0.06] font-medium transition-all active:scale-95"
                    >
                      ✏️ Edit
                    </Link>
                    <Link
                      href={`?modal=delete-plan&id=${plan.id}`}
                      className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-center text-xs text-rose-400 py-2.5 rounded-xl border border-rose-500/20 font-medium transition-all active:scale-95"
                    >
                      🗑️ Delete
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <AddPlanModal isOpen={activeModal === "add-plan"} />
      </div>
    </GlowLayout>
  );
}
