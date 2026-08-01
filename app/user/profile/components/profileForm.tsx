"use client";

import React from "react";
import {
  User,
  Activity,
  Save,
  CheckCircle2,
  AlertCircle,
  Flame,
} from "lucide-react";

import { ProfileFormProps } from "./types";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileCard } from "./ProfileCard";
import { useProfileForm } from "./useProfileForm";

export function ProfileForm({ initialData, userId }: ProfileFormProps) {
  const {
    formData,
    isEditing,
    loading,
    status,
    bmiAnalysis,
    setIsEditing,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useProfileForm(initialData, userId);

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

      <ProfileHeader
        formData={formData}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(true)}
        onCancel={handleCancel}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProfileCard
            title="Account Details"
            icon={User}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-400"
          >
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
          </ProfileCard>

          <ProfileCard
            title="Body Metrics"
            icon={Flame}
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-400"
          >
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
          </ProfileCard>

          <ProfileCard
            title="Health Summary"
            icon={Activity}
            iconBg={bmiAnalysis.bg}
            iconColor={bmiAnalysis.color}
            className="md:col-span-2 lg:col-span-1"
          >
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
          </ProfileCard>
        </div>
      </form>
    </div>
  );
}
