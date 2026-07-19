"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAction, signUpAction } from "@/public/supabase/auth-actions";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = isSignUp
      ? await signUpAction(formData)
      : await signInAction(formData);

    setLoading(false);

    if (!result.success) {
      setMessage({ type: "error", text: result.error || "An error occurred" });
    } else {
      if (isSignUp) {
        setMessage({
          type: "success",
          text: result.message || "Registration successful.",
        });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900/40 backdrop-blur-md w-full max-w-md rounded-2xl p-8 shadow-2xl border border-white/[0.08]">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-slate-100 tracking-wide">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            {isSignUp
              ? "Register to access Gym Hero"
              : "Enter credentials to access your dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {message && (
            <div
              className={`text-xs p-3 rounded-xl border ${
                message.type === "error"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-lg shadow-blue-600/20 mt-2"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
