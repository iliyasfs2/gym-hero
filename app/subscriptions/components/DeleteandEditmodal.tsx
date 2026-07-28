import React from "react";
import Link from "next/link";
import { X, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import {
  updatePlanAction,
  deletePlanAction,
} from "@/app/subscriptions/actions/actions";

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  status: string;
}

interface DeleteandEditmodalProps {
  activeModal: string | undefined;
  plan: Plan | undefined;
  planId: string | undefined;
}

export default function DeleteandEditmodal({
  activeModal,
  plan,
  planId,
}: DeleteandEditmodalProps) {
  if (!activeModal) return null;

  if (activeModal === "edit-plan" && plan) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
        <div className="w-full max-w-md bg-[#121824] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              Edit Subscription Plan
            </h2>
            <Link
              href="/subscriptions"
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </Link>
          </div>

          <form action={updatePlanAction} className="space-y-4">
            <input type="hidden" name="planId" value={plan.id} />

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Plan Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={plan.name}
                required
                className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  defaultValue={plan.price}
                  required
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  defaultValue={plan.duration}
                  required
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl cursor-pointer hover:bg-emerald-500/20 transition-all has-[:checked]:border-emerald-500 has-[:checked]:ring-1 has-[:checked]:ring-emerald-500">
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    defaultChecked={plan.status === "Active"}
                    className="sr-only"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">
                    Active
                  </span>
                </label>

                <label className="relative flex items-center justify-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl cursor-pointer hover:bg-rose-500/20 transition-all has-[:checked]:border-rose-500 has-[:checked]:ring-1 has-[:checked]:ring-rose-500">
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    defaultChecked={plan.status === "Inactive"}
                    className="sr-only"
                  />
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-semibold text-rose-300">
                    Inactive
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 border-t border-white/[0.06] pt-4 mt-6">
              <Link
                href="/subscriptions"
                className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-2.5 rounded-xl transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (activeModal === "delete-plan" && planId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
        <div className="w-full max-w-sm bg-[#121824] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-4 relative text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-100">
              Delete Subscription Plan
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Are you sure you want to delete this plan? This action cannot be
              undone.
            </p>
          </div>

          <form action={deletePlanAction} className="space-y-3 pt-2">
            <input type="hidden" name="planId" value={planId} />

            <div className="flex gap-3">
              <Link
                href="/subscriptions"
                className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-2.5 rounded-xl transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-rose-600/20 active:scale-95"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
