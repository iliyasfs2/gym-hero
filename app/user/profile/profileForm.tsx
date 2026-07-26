"use client";

import { useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  User,
  Phone,
  Calendar,
  Activity,
  Save,
  CheckCircle2,
  AlertCircle,
  Edit3,
  X,
  Flame,
  Dumbbell,
  ShieldCheck,
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  age: number | string;
  height: number | string;
  weight: number | string;
  bmi: number | null;
}

export function ProfileForm({
  initialData,
  userId,
}: {
  initialData: ProfileData;
  userId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const bmiAnalysis = useMemo(() => {
    const h = Number(formData.height);
    const w = Number(formData.weight);
    if (!h || !w || h <= 0 || w <= 0)
      return {
        val: null,
        label: "N/A",
        color: "text-slate-500",
        bg: "bg-slate-800/50",
      };

    const score = Number((w / ((h / 100) * (h / 100))).toFixed(1));
    if (score < 18.5)
      return {
        val: score,
        label: "Underweight",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
      };
    if (score <= 24.9)
      return {
        val: score,
        label: "Healthy Weight",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      };
    if (score <= 29.9)
      return {
        val: score,
        label: "Overweight",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
      };
    return {
      val: score,
      label: "Obese",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    };
  }, [formData.height, formData.weight]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age ? Number(formData.age) : null,
      height: formData.height ? Number(formData.height) : null,
      weight: formData.weight ? Number(formData.weight) : null,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);

    if (error) {
      setStatus({
        type: "error",
        message: "Failed to update profile: " + error.message,
      });
    } else {
      setStatus({
        type: "success",
        message: "Profile updated successfully!",
      });
      setIsEditing(false);
      setTimeout(() => setStatus({ type: null, message: "" }), 4000);
    }
  };

  return (
    <div className="w-full space-y-8">
      {status.type && (
        <div
          className={`p-5 rounded-2xl border flex items-center gap-3 text-base font-medium transition-all ${
            status.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-6 h-6 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <div className="relative overflow-hidden bg-[#111622] border border-white/[0.08] p-8 md:p-9 rounded-3xl shadow-xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-emerald-500/20 border border-white/10">
                {formData.name
                  ? formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </div>
              <span className="absolute -bottom-1 -right-1 p-0.5 bg-[#111622] rounded-full">
                <span className="w-4 h-4 bg-emerald-500 rounded-full block border-2 border-[#111622]" />
              </span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {formData.name || "Athlete Profile"}
              </h1>
              <p className="text-sm text-slate-400 font-mono">
                {formData.email}
              </p>

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
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-bold text-sm rounded-xl transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(initialData);
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-sm rounded-xl transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#111622] border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between shadow-xl">
            <div className="space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Account Details
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#090d14] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-white bg-[#090d14]/60 px-4 py-3 rounded-xl border border-white/[0.04]">
                      {formData.name || "--"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <p className="text-sm font-semibold text-slate-400 bg-[#090d14]/30 px-4 py-3 rounded-xl border border-white/[0.02] truncate">
                    {formData.email}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#090d14] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-white bg-[#090d14]/60 px-4 py-3 rounded-xl border border-white/[0.04]">
                      {formData.phone || "Not Set"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111622] border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between shadow-xl">
            <div className="space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Body Metrics
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Height (cm)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="w-full bg-[#090d14] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    ) : (
                      <div className="bg-[#090d14]/60 p-3 rounded-xl border border-white/[0.04] text-center">
                        <p className="text-xl font-black text-white">
                          {formData.height ? `${formData.height}` : "--"}
                        </p>
                        <span className="text-[11px] text-slate-500 font-medium uppercase">
                          cm
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Weight (kg)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full bg-[#090d14] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    ) : (
                      <div className="bg-[#090d14]/60 p-3 rounded-xl border border-white/[0.04] text-center">
                        <p className="text-xl font-black text-white">
                          {formData.weight ? `${formData.weight}` : "--"}
                        </p>
                        <span className="text-[11px] text-slate-500 font-medium uppercase">
                          kg
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Age
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full bg-[#090d14] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-white bg-[#090d14]/60 px-4 py-3 rounded-xl border border-white/[0.04]">
                      {formData.age ? `${formData.age} years old` : "Not Set"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111622] border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between shadow-xl md:col-span-2 lg:col-span-1">
            <div className="space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
                <div
                  className={`p-3 rounded-xl ${bmiAnalysis.bg} ${bmiAnalysis.color}`}
                >
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Health Summary
                  </h3>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#090d14] border border-white/[0.06] text-center space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Body Mass Index (BMI)
                </span>
                <p className="text-3xl font-black text-white">
                  {bmiAnalysis.val !== null ? bmiAnalysis.val : "--"}
                </p>
                {bmiAnalysis.val !== null && (
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${bmiAnalysis.bg} ${bmiAnalysis.color} border border-white/[0.05]`}
                  >
                    {bmiAnalysis.label}
                  </span>
                )}
              </div>
            </div>

            {isEditing && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? "Saving..." : "Save Profile"}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
