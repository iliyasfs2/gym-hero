import React from "react";
import { MemberCard } from "../components/MemberCard";
import {
  CalendarCheck,
  Ruler,
  Weight,
  Sparkles,
  Zap,
  ShieldAlert,
  Flame,
  User,
  History,
} from "lucide-react";

interface ProfileData {
  full_name: string;
  plan_name: string;
  subscription_status: "active" | "expired";
  height?: number;
  weight?: number;
  days_left: number;
  purchase_date?: string;
}

interface DashboardOverviewProps {
  email: string;
  profileData: ProfileData;
}

export default function DashboardOverview({
  profileData,
}: DashboardOverviewProps) {
  const isActive = profileData.subscription_status === "active";

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans p-4 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/40 via-[#121824] to-[#121824] border border-white/[0.08] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
                <Flame size={16} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                Gym Hero Athlete
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {profileData.full_name || "Welcome Back!"}
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Ready to crush your goals today? Keep pushing your limits.
            </p>
          </div>

          <div className="z-10 w-full md:w-auto flex justify-start md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/[0.06]">
            <div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold tracking-wide uppercase ${
                isActive
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/5"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}
            >
              {isActive ? <Zap size={14} /> : <ShieldAlert size={14} />}
              <span>{isActive ? "Active Membership" : "Expired"}</span>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#121824] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all">
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl">
              <CalendarCheck size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Days Left</p>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {profileData.days_left ?? 0}
              </h3>
            </div>
          </div>

          <div className="bg-[#121824] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all">
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Plan</p>
              <h3 className="text-base font-bold text-white mt-0.5 truncate max-w-[100px]">
                {profileData.plan_name || "None"}
              </h3>
            </div>
          </div>

          <div className="bg-[#121824] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all">
            <div className="p-3 bg-cyan-600/10 text-cyan-400 rounded-xl">
              <Weight size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Weight</p>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {profileData.weight ? `${profileData.weight} kg` : "--"}
              </h3>
            </div>
          </div>

          <div className="bg-[#121824] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all">
            <div className="p-3 bg-sky-600/10 text-sky-400 rounded-xl">
              <Ruler size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Height</p>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {profileData.height ? `${profileData.height} cm` : "--"}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-[#121824] border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <MemberCard
            fullName={profileData.full_name}
            planName={profileData.plan_name}
            status={profileData.subscription_status}
            height={profileData.height}
            weight={profileData.weight}
            daysLeft={profileData.days_left}
            purchaseDate={profileData.purchase_date}
          />

          <div className="pt-6 border-t border-white/[0.06] flex items-center justify-center gap-4">
            <a
              href="/profile"
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all text-sm font-semibold text-slate-200 hover:scale-[1.02]"
            >
              <User size={18} className="text-blue-400" />
              <span>Profile</span>
            </a>

            <a
              href="/history"
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all text-sm font-semibold text-slate-200 hover:scale-[1.02]"
            >
              <History size={18} className="text-blue-400" />
              <span>History</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
