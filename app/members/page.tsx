"use client";

import React, { useState, JSX } from "react";
import Sidebar from "@/app/components/Sidebar";
import GlowLayout from "@/app/components/GlowLayout";
import { useApp, Member } from "@/app/components/context/AppContext";

export default function MembersPage(): JSX.Element {

  const [searchQuery, setSearchQuery] = useState<string>("");

  
  const { members: contextMembers } = useApp();
  const members: Member[] = Array.isArray(contextMembers) ? contextMembers : [];

 
  const filteredMembers: Member[] = members.filter(
    (member: Member): boolean => {
      const query: string = searchQuery.toLowerCase().trim();

     
      if (!query) return true;

      
      const matchesName: boolean = member.name.toLowerCase().includes(query);

      
      const matchesPhone: boolean = member.phone
        ? String(member.phone).includes(query)
        : false;

      return matchesName || matchesPhone;
    },
  );

  return (
    <GlowLayout>
      <div className="flex min-h-screen bg-[#0a0f1d] text-white w-full">
     
        <Sidebar />

       
        <main className="flex-1 p-8 overflow-y-auto z-10">
          <div className="max-w-5xl mx-auto">

            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-200">
                  Gym Members
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Manage and track registered athletes
                </p>
              </div>
            </div>

           
            <div className="glass-card-fixed p-6 mb-6 rounded-2xl shadow-xl border border-white/[0.04]">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-200">
                  Search Directory
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Find athletes instantly by entering their name or phone number
                </p>
              </div>

              <div className="relative w-full">
              
                <span className="absolute left-4 top-3.5 text-slate-400 text-sm">
                  🔍
                </span>

               
                <input
                  type="text"
                  placeholder="Type a name or phone number..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            
            <div className="text-xs text-slate-500 mt-2">
              Ready for the filtered list view...
            </div>
          </div>
        </main>
      </div>
    </GlowLayout>
  );
}
