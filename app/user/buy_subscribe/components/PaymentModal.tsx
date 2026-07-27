"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CustomCheckoutForm from "./CustomCheckoutForm";
import { X, ShieldCheck, Lock, Check, Wifi, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  planName: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  planName,
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setIsSuccess(false);
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.clientSecret) {
            setClientSecret(data.clientSecret);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen, amount]);

  const handlePaymentSuccess = () => {
    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#60a5fa", "#ffffff"],
    });

    setTimeout(() => {
      onClose();
      setIsSuccess(false);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          onClick={() => onClose()}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-2xl z-10 flex flex-col md:flex-row gap-8 items-center"
        >
          <button
            type="button"
            onClick={() => onClose()}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 z-20"
          >
            <X size={18} />
          </button>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 w-full flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <Check size={40} className="animate-bounce" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Payment Successful!
              </h3>
              <p className="text-sm text-slate-400 max-w-[260px]">
                Your subscription to{" "}
                <span className="text-white font-semibold">{planName}</span> is
                active.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Checkout
                  </h3>
                  <p className="text-xs text-slate-400">
                    Complete your payment securely with Stripe.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/40 to-slate-900/40 border border-blue-500/25 flex items-center justify-between backdrop-blur-md">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <Sparkles size={12} />
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        Selected Plan
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white uppercase tracking-wide">
                      {planName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Total Amount
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-blue-400 tracking-tight">
                        ${amount}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        / USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative w-full h-48 rounded-2xl p-6 overflow-hidden bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-950/80 border border-white/10 shadow-2xl flex flex-col justify-between group transition-all duration-300 backdrop-blur-md">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl" />

                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1px] shadow-sm relative overflow-hidden flex items-center justify-center">
                        <div className="w-full h-[1px] bg-amber-900/40 absolute top-2" />
                        <div className="w-full h-[1px] bg-amber-900/40 absolute bottom-2" />
                        <div className="h-full w-[1px] bg-amber-900/40 absolute left-3" />
                        <div className="h-full w-[1px] bg-amber-900/40 absolute right-3" />
                      </div>
                      <Wifi size={16} className="text-slate-400 rotate-90" />
                    </div>
                  </div>

                  <div className="relative z-10 my-auto">
                    <p className="text-base sm:text-lg font-mono tracking-widest text-white font-semibold transition-all min-h-[28px] flex items-center">
                      {cardNumber ? cardNumber : "•••• •••• •••• ••••"}
                    </p>
                  </div>

                  <div className="relative z-10 flex justify-between items-end text-xs font-mono">
                    <div>
                      <p className="text-[9px] font-sans uppercase tracking-wider text-slate-500">
                        Expires
                      </p>
                      <p className="font-semibold text-slate-300">
                        {cardExpiry ? cardExpiry : "MM/YY"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-sans uppercase tracking-wider text-slate-500">
                        Total Due
                      </p>
                      <p className="font-bold text-white font-sans text-sm">
                        ${amount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-between">
                {loading || !clientSecret ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3 my-auto">
                    <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-xs text-slate-400 font-medium tracking-wide">
                      Loading Gateway...
                    </span>
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
                          colorBackground: "#0b0f19",
                          colorText: "#f8fafc",
                          colorDanger: "#ef4444",
                          fontFamily: "system-ui, sans-serif",
                          spacingUnit: "4.5px",
                          borderRadius: "12px",
                        },
                      },
                    }}
                  >
                    <CustomCheckoutForm
                      amount={amount}
                      onClose={() => onClose()}
                      onSuccess={handlePaymentSuccess}
                      onCardChange={(num, exp) => {
                        setCardNumber(num);
                        setCardExpiry(exp);
                      }}
                    />
                  </Elements>
                )}

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Lock size={12} className="text-slate-400" />
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-slate-400" />
                    <span>Stripe Verified</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
