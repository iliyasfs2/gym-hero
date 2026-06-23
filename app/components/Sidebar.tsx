"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

interface MenuItem {
  id: number;
  name: string;
  icon: string;
  path: string;
}
export default function Sidebar() {
  const menuItems: MenuItem[] = [
    { id: 1, name: "Dashboard", icon: "📊", path: "/" },
    { id: 2, name: "Members", icon: "👥", path: "/members" },
    { id: 3, name: "Subscriptions", icon: "💳", path: "/subscriptions" },
    { id: 4, name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0d1527] border-l border-slate-800 p-4 flex flex-col text-slate-200 justify-between">
      <div>
        <div className="mb-10 pt-4 text-center">
          <h2 className="text-2xl font-black tracking-wider">
            GYM<span className="text-blue-500">HERO</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Management Panel</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  item.id === 1
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "hover:bg-slate-800/60 hover:text-white text-slate-400"
                }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-800/80 pt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-blue-400">
          A
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-300">Admin Panel</h4>
          <p className="text-xs text-slate-500">Welcome Back</p>
        </div>
      </div>
    </aside>
  );
}
