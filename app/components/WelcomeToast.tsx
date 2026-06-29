"use client";

import { useState, useEffect } from "react";

export default function WelcomeToast() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 5000);
    

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed top-5 left-[50vw] -translate-x-1/2 z-[9999] min-w-[320px] md:min-w-[400px] bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-xl animate-pulse">👋</span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white/90">
            Welcome back, Admin!
          </span>
        </div>
      </div>
      <button
        onClick={() => setIsOpen(false)}
        className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-xl transition-all duration-200"
      >
        ✕
      </button>
    </div>
  );
}
