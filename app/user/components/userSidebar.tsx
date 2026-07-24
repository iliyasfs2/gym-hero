"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  History,
  User,
  ArrowLeftRight,
} from "lucide-react";
import { createClient } from "@/utils/supabase/clinet";

const menuItems = [
  { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
  { name: "Buy Subscription", href: "/user/subscribe", icon: ShoppingCart },
  { name: "History", href: "/user/history", icon: History },
  { name: "Profile", href: "/user/profile", icon: User },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkAdminRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.role === "admin") {
          setIsAdmin(true);
        }
      }
    }

    checkAdminRole();
  }, [supabase]);

  return (
    <aside className="hidden md:flex flex-col h-screen bg-[#121824] border-r border-white/[0.04] text-slate-400 sticky top-0 left-0 z-40 transition-all duration-300 ease-in-out w-20 hover:w-64 group shadow-xl">
      <div className="h-20 flex items-center px-6 border-b border-white/[0.04] overflow-hidden whitespace-nowrap">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md shadow-blue-600/20">
          G
        </div>
        <span className="ml-4 text-white font-bold text-sm tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Gym Hero Member
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center h-12 px-3 rounded-xl transition-all duration-200 overflow-hidden whitespace-nowrap group/item relative ${
                isActive
                  ? "bg-white/[0.06] text-white font-semibold shadow-inner"
                  : "hover:bg-white/[0.02] hover:text-slate-200"
              }`}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? "text-blue-500"
                    : "text-slate-400 group-hover/item:text-slate-200"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
              </div>

              <span className="ml-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.name}
              </span>

              {isActive && (
                <div className="absolute left-0 w-1 h-5 bg-blue-500 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {isAdmin && (
        <div className="p-4 border-t border-white/[0.04] overflow-hidden whitespace-nowrap space-y-2">
          <button
            onClick={() => router.push("/dashboard")}
            title="Admin View"
            className="w-full flex items-center h-12 px-3 rounded-xl hover:bg-white/[0.02] text-slate-400 hover:text-slate-200 transition-all duration-200 overflow-hidden whitespace-nowrap group/btn"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0 text-slate-400 group-hover/btn:text-slate-200 transition-colors">
              <ArrowLeftRight size={20} strokeWidth={2} />
            </div>
            <span className="ml-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Admin View
            </span>
          </button>
        </div>
      )}
    </aside>
  );
}
