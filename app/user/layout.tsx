import React, { useState } from "react";
import UserSidebar from "@/app/user/components/userSidebar";
import MobileHeader from "@/app/user/components/MobileHeader";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0f1d] text-slate-100">
      <MobileHeader setIsMenuOpen={setIsMenuOpen} />
      <UserSidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="flex-1 w-full min-w-0 bg-[#0a0f1d] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
