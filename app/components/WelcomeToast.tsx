"use client";

import { useState, useEffect } from "react";

export default function WelcomeToast() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const hasSeenToast = sessionStorage.getItem("admin_welcome_seen");

    if (!hasSeenToast) {
      setIsOpen(true);
      sessionStorage.setItem("admin_welcome_seen", "true");

      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] min-w-[320px] md:min-w-[400px] bg-[#111622]/95 backdrop-blur-md border border-white/[0.08] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-emerald-400">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#111622]" />
        </div>

        <div className="text-sm text-slate-300 font-medium">
          Welcome back, <span className="text-white font-semibold">Admin</span>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(false)}
        className="text-slate-400 hover:text-white bg-[#090d14] hover:bg-white/[0.06] border border-white/[0.08] p-1.5 rounded-xl transition-all duration-200 shrink-0"
        aria-label="Close"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
