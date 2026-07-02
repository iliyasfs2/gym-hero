"use client";

import React, { useState } from "react";
import { NewMemberFormData } from "./types";
import { Member } from "@/app/components/context/AppContext";

interface AddMemberModalProps {
  onClose: () => void;
  onSave: (formData: NewMemberFormData) => void;
  initialData?: Member | null;
}

export default function AddMemberModal({
  onClose,
  onSave,
  initialData,
}: AddMemberModalProps) {
  const todayString = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<NewMemberFormData>({
    name: initialData ? initialData.name : "",
    phone: initialData ? initialData.phone : "",
    plan: initialData ? initialData.plan : "Basic (1 Month)",
    startDate: initialData ? initialData.joinDate : todayString,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      name: "",
      phone: "",
      plan: "Basic (1 Month)",
      startDate: todayString,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-card-fixed bg-slate-950/80 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/[0.08] relative">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-100">
            {initialData ? "Edit Gym Member" : "Add Gym Member"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter athlete details to register subscription
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
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
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="09123456789"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Membership Plan
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  id: "Basic (1 Month)",
                  name: "Basic",
                  time: "1 Month",
                  price: "$50",
                  icon: "🏋️‍♂️",
                },
                {
                  id: "Standard (3 Months)",
                  name: "Standard",
                  time: "3 Months",
                  price: "$100",
                  icon: "⚡",
                },
                {
                  id: "Premium (6 Months)",
                  name: "Premium",
                  time: "6 Months",
                  price: "$150",
                  icon: "👑",
                },
              ].map((planItem) => {
                const isSelected = formData.plan === planItem.id;
                return (
                  <div
                    key={planItem.id}
                    onClick={() =>
                      setFormData({ ...formData, plan: planItem.id })
                    }
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 bg-black/30 ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/5"
                        : "border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl bg-white/[0.03] p-2 rounded-lg border border-white/[0.05]">
                        {planItem.icon}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">
                          {planItem.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {planItem.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-blue-400">
                        {planItem.price}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-600"}`}
                      >
                        {isSelected && (
                          <span className="text-[9px] text-white">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
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
