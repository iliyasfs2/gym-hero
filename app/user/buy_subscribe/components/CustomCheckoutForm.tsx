"use client";

import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Lock,
  ArrowRight,
  CreditCard,
  Calendar,
  ShieldCheck,
} from "lucide-react";

interface CustomCheckoutFormProps {
  amount: number;
  planName?: string;
  clientSecret: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomCheckoutForm({
  amount,
  planName = "Pro Subscription",
  clientSecret,
  onClose,
  onSuccess,
}: CustomCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stripeElementOptions = {
    style: {
      base: {
        fontSize: "14px",
        color: "#ffffff",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#64748b",
        },
      },
      invalid: {
        color: "#f87171",
        iconColor: "#f87171",
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
          },
        },
      );

      if (error) {
        setErrorMessage(
          error.message || "Payment failed. Please check your card details.",
        );
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <CreditCard size={14} className="text-blue-400" />
          <span>Card Number</span>
        </label>
        <div className="relative flex items-center px-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/10 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 backdrop-blur-md h-[52px]">
          <div className="w-full">
            <CardNumberElement options={stripeElementOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Calendar size={14} className="text-blue-400" />
            <span>Expires</span>
          </label>
          <div className="relative flex items-center px-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/10 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 backdrop-blur-md h-[52px]">
            <div className="w-full">
              <CardExpiryElement options={stripeElementOptions} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-400" />
            <span>CVC / CVV</span>
          </label>
          <div className="relative flex items-center px-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/10 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 backdrop-blur-md h-[52px]">
            <div className="w-full">
              <CardCvcElement options={stripeElementOptions} />
            </div>
            <Lock
              size={13}
              className="text-slate-500 shrink-0 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-rose-400 text-xs bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/20 text-center font-medium"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 pt-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 py-3.5 rounded-2xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
        >
          Cancel
        </button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!stripe || loading}
          className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Lock size={13} className="text-blue-200" />
              <span>Pay ${amount.toFixed(2)}</span>
              <ArrowRight size={13} className="text-blue-200" />
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
