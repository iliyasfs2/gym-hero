import React from "react";
import UserSidebar from "@/app/user/components/userSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#121824] text-slate-100">
      <UserSidebar />
      <main className="flex-1 w-full min-w-0 bg-[#121824] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
