"use client";

import React, { useEffect, useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CustomCheckoutForm from "./CustomCheckoutForm";
import { X, ShieldCheck, Lock, Check, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { createBrowserClient } from "@supabase/ssr";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  planName: string;
  userId?: string;
  duration?: string;
  onSuccessCallback?: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  planName,
  userId: propUserId,
  duration = "1 Month",
  onSuccessCallback,
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSafeClose = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const fetchCheckoutSecret = async () => {
      setLoading(true);
      setIsSuccess(false);
      setError(null);

      try {
        let currentUserId = propUserId;

        if (!currentUserId) {
          const { data } = await supabase.auth.getUser();
          currentUserId = data.user?.id;
        }

        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount),
            planName,
            userId: currentUserId,
            duration,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to initialize checkout session.");
        }

        const data = await res.json();

        if (isMounted && data?.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (err: unknown) {
        console.error("Checkout secret fetch error:", err);
        if (isMounted) {
          setError("Unable to initialize payment gateway. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCheckoutSecret();

    return () => {
      isMounted = false;
    };
  }, [isOpen, amount, planName, propUserId, duration, supabase]);

  const handlePaymentSuccess = async () => {
    setIsSuccess(true);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#60a5fa", "#ffffff"],
    });

    setTimeout(() => {
      handleSafeClose();
      setIsSuccess(false);
      if (onSuccessCallback) {
        onSuccessCallback();
      } else {
        window.location.reload();
      }
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
        <div className="fixed inset-0" onClick={handleSafeClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-2xl z-10 text-white"
        >
          <div className="absolute -top-28 -left-28 w-56 h-56 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -right-28 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          <button
            type="button"
            onClick={handleSafeClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 z-20"
          >
            <X size={20} />
          </button>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                  <Check size={40} className="animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Payment Successful!
                  </h3>
                  <p className="text-sm text-slate-400 max-w-[260px] mx-auto">
                    Your subscription to{" "}
                    <span className="text-white font-semibold">{planName}</span>{" "}
                    is active.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="checkout" className="space-y-7 relative z-10">
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                      <CreditCard size={24} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                          Live Checkout
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white tracking-wide">
                        Payment Gateway
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {planName}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight">
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {loading || !clientSecret ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3">
                    {error ? (
                      <p className="text-xs text-red-400 font-medium">
                        {error}
                      </p>
                    ) : (
                      <>
                        <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        <span className="text-xs text-slate-400 font-medium tracking-wide">
                          Connecting to Live Gateway...
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "night",
                        variables: {
                          colorPrimary: "#3b82f6",
                          colorBackground: "#090d16",
                          colorText: "#f8fafc",
                          colorDanger: "#f87171",
                          fontFamily: "Inter, system-ui, sans-serif",
                          borderRadius: "14px",
                        },
                      },
                    }}
                  >
                    <CustomCheckoutForm
                      amount={amount}
                      planName={planName}
                      clientSecret={clientSecret}
                      onClose={handleSafeClose}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                )}

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Lock size={12} className="text-emerald-400" />
                    <span className="font-medium text-slate-300">
                      256-Bit SSL Encryption
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-blue-400" />
                    <span className="font-medium text-slate-300">
                      Stripe Verified
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
