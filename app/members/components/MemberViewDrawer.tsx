"use client";

import React from "react";
import { DetailedMember } from "./types";

interface MemberViewDrawerProps {
  member: DetailedMember | null;
  onClose: () => void;
  onEditClick: (member: DetailedMember) => void;
  onDeleteClick: (id: string) => void;
}

export default function MemberViewDrawer({
  member,
  onClose,
  onEditClick,
  onDeleteClick,
}: MemberViewDrawerProps) {
  if (!member) return null;

 
  const endDate = member.endDate || "2026-07-30";
  const daysLeft = member.daysLeft ?? 28;

  const payments = member.payments || [
    { date: "2026-05-10", amount: "$50", status: "Paid" },
    { date: "2026-06-10", amount: "$50", status: "Paid" },
  ];

  const workoutPlan = member.workoutPlan || [
    { day: "Day 1", target: "Chest & Triceps" },
    { day: "Day 2", target: "Back & Biceps" },
    { day: "Day 3", target: "Legs & Abs" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
     
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      
      <div className="relative bg-[#0b1224] w-full max-w-3xl rounded-2xl border border-white/[0.08] text-white shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06] bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/[0.08] flex items-center justify-center text-lg font-bold text-blue-400">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-200">
                {member.name}
              </h2>
              <p className="text-xs text-slate-400">Detailed Member Profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl p-2 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        
        <div className="p-6 overflow-y-auto space-y-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
         
          <div className="space-y-6">
           
            <div className="bg-black/20 p-4 rounded-xl border border-white/[0.04]">
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
                👤 Basic Info
              </h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>{" "}
                  <span className="font-medium text-slate-200">
                    {member.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>{" "}
                  <span className="font-mono">{member.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Join Date:</span>{" "}
                  <span>{member.joinDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    🟢 {member.status}
                  </span>
                </div>
              </div>
            </div>

           
            <div className="bg-black/20 p-4 rounded-xl border border-white/[0.04]">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
                💳 Membership Details
              </h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Plan:</span>{" "}
                  <span className="font-bold text-slate-200">
                    {member.plan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Start Date:</span>{" "}
                  <span>{member.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">End Date:</span>{" "}
                  <span>endDate</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
                  <span className="text-slate-400">Days Left:</span>
                  <span className="font-bold text-amber-400">
                    {daysLeft} days
                  </span>
                </div>
              </div>
            </div>
          </div>

         
          <div className="space-y-6">
            
            <div className="bg-black/20 p-4 rounded-xl border border-white/[0.04]">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">
                💰 Payment History
              </h3>
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {payments.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs bg-black/40 p-2.5 rounded-lg border border-white/[0.04]"
                  >
                    <div>
                      <p className="font-medium text-slate-300">{p.date}</p>
                      <p className="text-slate-500 font-mono mt-0.5">
                        {p.amount}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                      Paid
                    </span>
                  </div>
                ))}
              </div>
            </div>

          
            <div className="bg-black/20 p-4 rounded-xl border border-white/[0.04]">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                🏋️ Workout Routine
              </h3>
              <div className="space-y-2 text-xs">
                {workoutPlan.map((w, i) => (
                  <div
                    key={i}
                    className="flex justify-between p-2 bg-white/[0.02] border border-white/[0.04] rounded-lg"
                  >
                    <span className="font-bold text-slate-400">{w.day}</span>
                    <span className="text-slate-300">{w.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
 
      
        <div className="p-6 border-t border-white/[0.06] bg-black/20 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => {
              onClose();
              onEditClick(member);
            }}
            className="py-2.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 text-xs font-semibold rounded-xl border border-amber-500/20 transition-colors cursor-pointer text-center"
          >
            ✏️ Edit Member
          </button>

          <button className="py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold rounded-xl border border-white/[0.06] transition-colors cursor-pointer text-center">
            📄 Renew Plan
          </button>

          <button className="py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold rounded-xl border border-blue-500/20 transition-colors cursor-pointer text-center">
            💳 Add Payment
          </button>

          <button
            onClick={() => {
              onClose();
              onDeleteClick(member.id);
            }}
            className="py-2.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 transition-colors cursor-pointer text-center"
          >
            ❌ Delete Member
          </button>
        </div>
      </div>
    </div>
  );
}
