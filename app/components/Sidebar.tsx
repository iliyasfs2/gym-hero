"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-card-fixed w-[280px] min-h-screen flex flex-col p-6 z-20 rounded-none border-y-0 border-r border-l-0">
      <div className="h-12 w-full bg-white/[0.04] rounded-xl mb-8 flex items-center px-4 border border-white/[0.05]">
        <span className="text-lg mr-2">📊</span>
        <span className="font-bold text-white/90">Gym Hero Admin</span>
      </div>

      <nav className="space-y-3 flex-1">
        <Link
          href="/"
          className={`flex items-center px-4 py-3 rounded-xl border transition-all cursor-pointer ${
            pathname === "/"
              ? "bg-white/[0.08] border-white/[0.1] text-white font-semibold"
              : "border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          <span className="ml-3 text-base">🏠</span>
          <span className="text-sm">Dashboard</span>
        </Link>

        <Link
          href="/members"
          className={`flex items-center px-4 py-3 rounded-xl border transition-all cursor-pointer ${
            pathname === "/members"
              ? "bg-white/[0.08] border-white/[0.1] text-white font-semibold"
              : "border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          <span className="ml-3 text-base">👥</span>
          <span className="text-sm">Members</span>
        </Link>

        <div className="flex items-center px-4 py-3 border border-transparent hover:bg-white/[0.04] rounded-xl transition-all cursor-not-allowed text-slate-600">
          <span className="ml-3 text-base">💳</span>
          <span className="text-sm">Billing</span>
        </div>
      </nav>
    </aside>
  );
}
