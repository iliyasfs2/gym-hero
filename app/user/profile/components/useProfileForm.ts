"use client";

import { useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { ProfileData, StatusState } from "./types";

export function useProfileForm(initialData: ProfileData, userId: string) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    type: null,
    message: "",
  });

  const router = useRouter();

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

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(initialData);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return {
    formData,
    isEditing,
    loading,
    status,
    bmiAnalysis,
    setIsEditing,
    handleChange,
    handleSubmit,
    handleCancel,
    handleSignOut, 
  };
}
