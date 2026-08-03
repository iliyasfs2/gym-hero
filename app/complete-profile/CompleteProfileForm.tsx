"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Calendar,
  ArrowRight,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { completeProfileAction } from "@/utils/supabase/auth-actions";

// 👈 اضافه شدن userId به propها
interface CompleteProfileFormProps {
  defaultName: string;
  userId?: string;
}

export function CompleteProfileForm({
  defaultName,
  userId,
}: CompleteProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    fullName: defaultName,
    age: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);

    if (!profileData.fullName.trim()) {
      return setMsg("Please enter your full name.");
    }

    const fd = new FormData();
    fd.append("fullName", profileData.fullName.trim());
    fd.append("age", profileData.age);
    fd.append("phone", profileData.phone);

    // 👈 اضافه کردن userId به FormData در صورت وجود
    if (userId) {
      fd.append("userId", userId);
    }

    setLoading(true);
    const result = await completeProfileAction(fd);
    setLoading(false);

    if (!result.success) {
      setMsg(result.error || "Failed to save profile");
      return;
    }

    router.push("/user/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 bg-emerald-500">
          <Check size={18} />
        </div>
        <div className="h-1 w-20 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 w-full transition-all duration-300" />
        </div>
        <div className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm text-white shrink-0 bg-blue-600 border-blue-600">
          2
        </div>
      </div>

      <div className="w-full min-h-[410px] bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
        <div className="text-center font-black tracking-wider text-xl uppercase">
          <span className="text-white">GYM</span>
          <span className="text-blue-500">HERO</span>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-4 my-auto"
        >
          <h2 className="text-xl font-bold text-white text-center">
            Complete Your Profile
          </h2>
          <p className="text-xs text-slate-400 text-center -mt-2">
            Tell us a bit about yourself
          </p>

          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={profileData.fullName}
              onChange={(e) =>
                setProfileData({ ...profileData, fullName: e.target.value })
              }
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <Calendar
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="number"
              placeholder="Age"
              value={profileData.age}
              onChange={(e) =>
                setProfileData({ ...profileData, age: e.target.value })
              }
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <Phone
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {msg && (
            <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl border bg-red-500/10 border-red-500/30 text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <span>Finish Setup</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
