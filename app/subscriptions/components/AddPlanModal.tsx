"use client";

import React, { useState } from "react";
import Link from "next/link";
import { addPlanAction } from "../actions/actions";

interface AddPlanModalProps {
  isOpen: boolean;
}

export default function AddPlanModal({ isOpen }: AddPlanModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    status: "Active",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-card-fixed bg-slate-950/80 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/[0.08] relative">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-100">Add New Plan</h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter subscription details to create a new gym package
          </p>
        </div>

        <form action={addPlanAction} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Plan Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Premium Pack"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Price (Toman)
            </label>
            <input
              type="number"
              name="price"
              placeholder="500,000"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              placeholder="e.g., 1 Month, 3 Months"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Status
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  id: "Active",
                  name: "Active",
                  desc: "Available for new members",
                  icon: "🟢",
                },
                {
                  id: "Inactive",
                  name: "Inactive",
                  desc: "Hidden from registrations",
                  icon: "🔴",
                },
              ].map((statusItem) => {
                const isSelected = formData.status === statusItem.id;
                return (
                  <div
                    key={statusItem.id}
                    onClick={() =>
                      setFormData({ ...formData, status: statusItem.id })
                    }
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 bg-black/30 ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/5"
                        : "border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]"
                    }`}
                  >
                   
                    {isSelected && (
                      <input
                        type="hidden"
                        name="status"
                        value={statusItem.id}
                      />
                    )}

                    <div className="flex items-center gap-3">
                      <span className="text-xl bg-white/[0.03] p-2 rounded-lg border border-white/[0.05]">
                        {statusItem.icon}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">
                          {statusItem.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {statusItem.desc}
                        </p>
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full border flex items-center justify-center transition-all border-slate-600">
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <Link
              href="/subscriptions"
              className="px-4 py-2 text-sm text-slate-400 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer text-center flex items-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
