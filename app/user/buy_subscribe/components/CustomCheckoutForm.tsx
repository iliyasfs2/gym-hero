"use client";

import React, { useState } from "react";
import {
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock, ArrowRight, CreditCard } from "lucide-react";

interface CustomCheckoutFormProps {
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardExpiry: string;
  setCardExpiry: (val: string) => void;
}

export default function CustomCheckoutForm({
  amount,
  onClose,
  onSuccess,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
}: CustomCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const elementOptions = {
    style: {
      base: {
        fontSize: "14px",
        color: "#ffffff",
        "::placeholder": {
          color: "#64748b",
        },
      },
      invalid: {
        color: "#ef4444",
      },
    },
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 my-auto">
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Card Number
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="•••• •••• •••• ••••"
            maxLength={19}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-mono tracking-wider backdrop-blur-md transition-all"
          />
          <CreditCard className="absolute right-3.5 text-slate-500" size={16} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Expiration
          </label>
          <input
            type="text"
            value={cardExpiry}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            maxLength={5}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-mono tracking-wider backdrop-blur-md transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            CVC / CVV
          </label>
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all backdrop-blur-md">
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="text-red-400 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center font-medium">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center gap-3 pt-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-xs font-semibold transition-all active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-[2] py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Lock size={13} className="text-blue-200" />
              <span>Pay ${amount}</span>
              <ArrowRight
                size={13}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
