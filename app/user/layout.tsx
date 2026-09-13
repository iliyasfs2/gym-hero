"use client";

import React, { useCallback, useState } from "react";
import UserSidebar from "@/app/user/components/userSidebar";
import MobileHeader from "@/app/user/components/MobileHeader";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100">
      <MobileHeader isMenuOpen={isMenuOpen} onToggle={toggleMenu} />
      <div className="flex min-h-screen">
        <UserSidebar isMenuOpen={isMenuOpen} onClose={closeMenu} />
        <main className="flex-1 w-full min-w-0 bg-[#0a0f1d] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}