import React from "react";
import Link from "next/link";

export function NavigationLinks() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <Link
        href="/user/payments"
        className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl text-sm font-medium text-slate-300 hover:text-slate-100 transition-all shadow-lg"
      >
        <span>📜 Payment History</span>
      </Link>

      <Link
        href="/user/profile"
        className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl text-sm font-medium text-slate-300 hover:text-slate-100 transition-all shadow-lg"
      >
        <span>👤 Profile</span>
      </Link>
    </div>
  );
}
