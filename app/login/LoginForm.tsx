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
} from "lucide-react";
import { signInAction, signUpAction } from "@/utils/supabase/auth-actions";
import { signInWithGoogle } from "./actions";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !email.includes("@")) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (!password || password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    setLoading(true);
    const action = isSignUp ? signUpAction : signInAction;
    const result = await action(formData);
    setLoading(false);

    if (!result.success) {
      setMessage({
        type: "error",
        text: result.error || "Authentication failed",
      });
    } else {
      setIsCompleted(true);
      setTimeout(() => {
        router.push("/user/dashboard");
        router.refresh();
      }, 1200);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setMessage(null);
    const res = await signInWithGoogle();
    if (res?.error) {
      setGoogleLoading(false);
      setMessage({ type: "error", text: res.error });
    }
  };

  return (
    <div className="relative w-full max-w-md flex flex-col items-center">
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full flex items-center justify-center gap-3 mb-6 z-10">
        <motion.div
          animate={{
            backgroundColor: step === 2 || isCompleted ? "#10b981" : "#2563eb",
          }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg transition-colors"
        >
          {step === 2 || isCompleted ? (
            <Check size={18} strokeWidth={3} />
          ) : (
            "1"
          )}
        </motion.div>

        <div className="h-1 w-20 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: step === 2 || isCompleted ? "100%" : "0%" }}
            transition={{ duration: 0.3 }}
            className="h-full bg-emerald-500"
          />
        </div>

        <motion.div
          animate={{
            backgroundColor: isCompleted
              ? "#10b981"
              : step === 2
                ? "#2563eb"
                : "#0f172a",
            borderColor: step === 2 || isCompleted ? "#10b981" : "#1e293b",
          }}
          className="w-10 h-10 rounded-xl border flex items-center justify-center text-white font-bold text-sm transition-colors"
        >
          {isCompleted ? <Check size={18} strokeWidth={3} /> : "2"}
        </motion.div>
      </div>

      <div className="relative w-full h-[420px] bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col justify-between">
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/30">
              <Check size={40} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Welcome Back!
            </h3>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-center pt-1">
              <span className="text-xl font-black tracking-wider uppercase">
                <span className="text-white">GYM</span>
                <span className="text-blue-500">HERO</span>
              </span>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 my-auto"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">
                      Welcome Back
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={googleLoading}
                    className="w-full bg-slate-950/80 hover:bg-slate-950 border border-white/10 hover:border-white/20 text-slate-200 py-3.5 px-4 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg disabled:opacity-50"
                  >
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
                    <span>
                      {googleLoading ? "Connecting..." : "Continue with Google"}
                    </span>
                  </button>

                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-white/10 w-full" />
                    <span className="bg-slate-900/90 px-3 text-[10px] uppercase font-semibold text-slate-500 tracking-widest absolute">
                      or
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 group"
                  >
                    <Mail size={18} />
                    <span>Continue with Email</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>

                  {message && (
                    <div className="text-xs p-3 rounded-xl border bg-red-500/10 border-red-500/30 text-red-300">
                      {message.text}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  key="step2"
                  noValidate
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-4 my-auto"
                >
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {isSignUp ? "Create Account" : "Sign In"}
                    </h2>
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        size={18}
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        size={18}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-none"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {message && (
                    <div className="text-xs p-3 rounded-xl border bg-red-500/10 border-red-500/30 text-red-300">
                      {message.text}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setMessage(null);
                      }}
                      className="w-1/3 bg-slate-950/80 hover:bg-slate-950 border border-white/10 text-slate-300 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                    >
                      {loading
                        ? "Processing..."
                        : isSignUp
                          ? "Sign Up"
                          : "Sign In"}
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <button
                      type="button"
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
                </motion.form>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
