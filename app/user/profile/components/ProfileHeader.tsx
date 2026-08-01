"use client";

import { Edit3, X, Dumbbell, ShieldCheck } from "lucide-react";
import { ProfileHeaderProps } from "./types";

export function ProfileHeader({
  formData,
  isEditing,
  onEditToggle,
  onCancel,
}: ProfileHeaderProps) {
  const userInitials = formData.name
    ? formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="relative overflow-hidden bg-[#111622] border border-white/[0.08] p-8 md:p-9 rounded-3xl shadow-xl">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-emerald-500/20 border border-white/10">
              {userInitials}
            </div>
            <span className="absolute -bottom-1 -right-1 p-0.5 bg-[#111622] rounded-full">
              <span className="w-4 h-4 bg-emerald-500 rounded-full block border-2 border-[#111622]" />
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {formData.name || "Athlete Profile"}
            </h1>
            <p className="text-sm text-slate-400 font-mono">{formData.email}</p>

            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Dumbbell className="w-3.5 h-3.5" /> GYM HERO MEMBER
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
              </span>
            </div>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={onEditToggle}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-bold text-sm rounded-xl transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <Edit3 className="w-5 h-5 text-emerald-400" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-sm rounded-xl transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
