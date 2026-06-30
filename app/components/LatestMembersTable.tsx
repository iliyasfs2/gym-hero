"use client";

import React, { JSX } from "react";


export interface LatestMember {
  id: string;
  name: string;
  avatar: string;
  plan: string;
  joinDate: string;
  status: "Active" | "Inactive";
}


const latestMembersData: LatestMember[] = [
  { id: "1", name: "Alex Morgan", avatar: "🏋️‍♂️", plan: "Premium (6 Months)", joinDate: "2026-06-28", status: "Active" },
  { id: "2", name: "Sarah Jenkins", avatar: "🏃‍♀️", plan: "Basic (1 Month)", joinDate: "2026-06-25", status: "Active" },
  { id: "3", name: "Michael Chang", avatar: "🚴‍♂️", plan: "Standard (3 Months)", joinDate: "2026-06-24", status: "Inactive" },
  { id: "4", name: "Emma Watson", avatar: "🧘‍♀️", plan: "Premium (6 Months)", joinDate: "2026-06-22", status: "Active" },
];

export default function LatestMembersTable(): JSX.Element {
  return (
    <div className="glass-card-fixed p-6 rounded-2xl shadow-xl border border-white/[0.04]">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-200">Latest Members</h3>
        <p className="text-xs text-slate-400 mt-0.5">Overview of newly joined athletes</p>
      </div>

     
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-sm text-slate-300">
          <thead>
            <tr className="border-b border-white/[0.05] text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 text-center w-16">Avatar</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Membership Plan</th>
              <th className="py-3 px-4">Join Date</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {latestMembersData.map((member: LatestMember) => (
              <tr 
                key={member.id} 
                className="hover:bg-white/[0.02] transition-colors duration-150"
              >
               
                <td className="py-4 px-4 text-center">
                  <div className="w-9 h-9 mx-auto rounded-xl bg-white/[0.03] flex items-center
                   justify-center border border-white/[0.05] text-lg">
                    {member.avatar}
                  </div>
                </td>
                
               
                <td className="py-4 px-4 font-medium text-slate-200">
                  {member.name}
                </td>
                
               
                <td className="py-4 px-4 text-slate-400">
                  <span className="text-blue-400 font-medium">{member.plan.split(" ")[0]}</span>
                  <span className="text-xs text-slate-500 block lg:inline lg:ml-1">
                    {member.plan.includes("(") ? member.plan.substring(member.plan.indexOf("(")) : ""}
                  </span>
                </td>
                
                
                <td className="py-4 px-4 text-xs font-mono text-slate-400">
                  {member.joinDate}
                </td>
                
                
                <td className="py-4 px-4 text-right">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold ${
                    member.status === "Active" 
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                      : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                  }`}>
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}