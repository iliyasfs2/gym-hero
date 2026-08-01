import React from "react";
import UserSidebar from "@/app/user/components/userSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0f1d] text-slate-100">
      <UserSidebar />
      <main className="flex-1 w-full min-w-0 bg-[#0a0f1d] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
