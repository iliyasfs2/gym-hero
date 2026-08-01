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

  const endDate = member.endDate || null;
  const daysLeft = member.daysLeft ?? null;
  const payments = member.payments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-[#141822] w-full max-w-3xl rounded-2xl border border-white/[0.08] text-white shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-lg font-bold text-sky-400">
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
            className="text-slate-400 hover:text-white p-2 cursor-pointer transition-colors rounded-lg hover:bg-white/[0.05]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#0d1117] p-4 rounded-xl border border-white/[0.08] h-[190px] flex flex-col">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-3 shrink-0">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                />
              </svg>
              Basic Info
            </h3>
            <div className="space-y-2 text-sm text-slate-300 overflow-y-auto pr-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>{" "}
                <span className="font-medium text-slate-200">
                  {member.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>{" "}
                <span className="font-mono">{member.phone || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Join Date:</span>{" "}
                <span>{member.joinDate || "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs border ${
                    member.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1117] p-4 rounded-xl border border-white/[0.08] h-[190px] flex flex-col">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-3 shrink-0">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect
                  x="2"
                  y="5"
                  width="20"
                  height="14"
                  rx="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 10h20"
                />
              </svg>
              Membership Details
            </h3>
            <div className="space-y-2 text-sm text-slate-300 overflow-y-auto pr-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Plan:</span>{" "}
                <span className="font-bold text-slate-200">
                  {member.plan || "No plan assigned"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Start Date:</span>{" "}
                <span>{member.joinDate || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">End Date:</span>{" "}
                <span>{endDate || "—"}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/[0.08]">
                <span className="text-slate-400">Days Left:</span>
                <span className="font-bold text-amber-400">
                  {daysLeft !== null ? `${daysLeft} days` : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1117] p-4 rounded-xl border border-white/[0.08] h-[190px] flex flex-col md:col-span-2">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-3 shrink-0">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Payment History
            </h3>

            {payments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1 flex-1">
                {payments.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs bg-black/20 p-2.5 rounded-lg border border-white/[0.06]"
                  >
                    <div>
                      <p className="font-medium text-slate-300">{p.date}</p>
                      <p className="text-slate-500 font-mono mt-0.5">
                        {p.amount}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 14l6-6m-5-1h.01M15 15h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-slate-500">
                  No payment history recorded yet
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-white/[0.08] bg-black/20 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onClose();
              onEditClick(member);
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 text-xs font-semibold rounded-xl border border-amber-500/20 transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Member
          </button>

          <button
            onClick={() => {
              onClose();
              onDeleteClick(member.id);
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M3 7h18M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
              />
            </svg>
            Delete Member
          </button>
        </div>
      </div>
    </div>
  );
}
