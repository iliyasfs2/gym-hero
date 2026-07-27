"use client";

import React, { useState } from "react";
import {
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock, ArrowRight, CreditCard, Calendar } from "lucide-react";

interface CustomCheckoutFormProps {
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
  onCardChange: (cardNumber: string, expiry: string) => void;
}

export default function CustomCheckoutForm({
  amount,
  onClose,
  onSuccess,
  onCardChange,
}: CustomCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");

  const cvcElementOptions = {
    style: {
      base: {
        fontSize: "14px",
        color: "#ffffff",
        "::placeholder": {
          color: "#64748b",
        },
      },
      invalid: {
        color: "#f87171",
      },
    },
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length > 16) rawValue = rawValue.slice(0, 16);

    const formatted = rawValue.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    onCardChange(formatted, expiry);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length > 4) rawValue = rawValue.slice(0, 4);

    let formatted = rawValue;
    if (rawValue.length >= 3) {
      formatted = `${rawValue.slice(0, 2)}/${rawValue.slice(2)}`;
    }

    setExpiry(formatted);
    onCardChange(cardNumber, formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const rawCardNumber = cardNumber.replace(/\s/g, "");
    const [expMonthStr, expYearStr] = expiry.split("/");

    if (rawCardNumber.length < 15 || !expMonthStr || !expYearStr) {
      setErrorMessage("Please enter a valid card number and expiration date.");
      return;
    }

    const expMonth = parseInt(expMonthStr, 10);
    let expYear = parseInt(expYearStr, 10);
    if (expYear < 100) expYear += 2000;

    const cvcElement = elements.getElement(CardCvcElement);
    if (!cvcElement) {
      setErrorMessage("CVC element is not ready.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(
          String(data.error || "Failed to create PaymentIntent."),
        );
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: {
              number: rawCardNumber,
              exp_month: expMonth,
              exp_year: expYear,
              cvc: cvcElement,
            },
          },
        },
      );

      if (error) {
        setErrorMessage(String(error.message || "Payment failed."));
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess();
      } else {
        setErrorMessage("Payment status pending or incomplete.");
      }
    } catch (err: any) {
      setErrorMessage(String(err?.message || "An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
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
            inputMode="numeric"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="•••• •••• •••• ••••"
            maxLength={19}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-mono tracking-wider backdrop-blur-md transition-all"
          />
          <CreditCard
            className="absolute right-3.5 text-slate-500 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Expiration
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              inputMode="numeric"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-mono tracking-wider backdrop-blur-md transition-all"
            />
            <Calendar
              className="absolute right-3.5 text-slate-500 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            CVC / CVV
          </label>
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all backdrop-blur-md flex items-center h-[42px]">
            <div className="w-full">
              <CardCvcElement options={cvcElementOptions} />
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="text-rose-400 text-xs bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-center font-medium animate-in fade-in">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onClose()}
          className="flex-1 py-3.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition-all duration-200 active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(59,130,246,0.4)] active:scale-95 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 group relative overflow-hidden"
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
