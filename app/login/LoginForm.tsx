"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Lock,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { signInAction, signUpAction } from "@/utils/supabase/auth-actions";
import { signInWithGoogle } from "./actions";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      setMsg(null);
      const res = await signInWithGoogle();
      if (res?.error) setMsg(res.error);
    } catch {
      setMsg("Google sign in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const pass = fd.get("password") as string;

    if (!email?.includes("@")) return setMsg("Enter a valid email address.");
    if (!pass || pass.length < 6)
      return setMsg("Password must be at least 6 characters.");

    setLoading(true);
    const result = await (isSignUp ? signUpAction : signInAction)(fd);
    setLoading(false);

    if (!result.success) setMsg(result.error || "Auth failed");
    else {
      router.push("/user/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {/* STEPPER */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white ${step === 2 ? "bg-emerald-500" : "bg-blue-600"}`}
        >
          {step === 2 ? <Check size={18} /> : "1"}
        </div>
        <div className="h-1 w-20 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-emerald-500 transition-all ${step === 2 ? "w-full" : "w-0"}`}
          />
        </div>
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm text-white ${step === 2 ? "bg-blue-600 border-blue-600" : "bg-slate-900 border-slate-800"}`}
        >
          2
        </div>
      </div>

      {/* CARD */}
      <div className="w-full h-[410px] bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
        <div className="text-center font-black tracking-wider text-xl uppercase">
          <span className="text-white">GYM</span>
          <span className="text-blue-500">HERO</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="s1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 my-auto"
            >
              <h2 className="text-2xl font-bold text-white text-center">
                Welcome Back
              </h2>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full bg-slate-950 border border-white/10 hover:border-white/20 text-slate-200 py-3.5 rounded-2xl text-sm font-medium flex items-center justify-center gap-3 cursor-pointer transition-all disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="animate-spin text-blue-500" size={20} />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>
                  {googleLoading ? "Connecting..." : "Continue with Google"}
                </span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase absolute">
                  or
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <Mail size={18} />
                <span>Continue with Email</span>
                <ArrowRight size={16} />
              </button>

              {msg && (
                <div className="text-xs p-2.5 rounded-xl border bg-red-500/10 border-red-500/30 text-red-300 text-center">
                  {msg}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="s2"
              noValidate
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4 my-auto"
            >
              <h2 className="text-xl font-bold text-white text-center">
                {isSignUp ? "Create Account" : "Sign In"}
              </h2>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {msg && (
                <div className="text-xs p-2.5 rounded-xl border bg-red-500/10 border-red-500/30 text-red-300 text-center">
                  {msg}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setMsg(null);
                  }}
                  className="w-1/3 bg-slate-950 border border-white/10 text-slate-300 py-3 rounded-xl text-sm flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : isSignUp ? (
                    "Sign Up"
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setMsg(null);
                  }}
                  className="text-xs text-slate-400 hover:text-blue-400"
                >
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
