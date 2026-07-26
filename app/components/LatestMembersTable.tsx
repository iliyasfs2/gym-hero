"use client";

import React, { JSX } from "react";

export interface LatestMemberActivity {
  id: string;
  name: string;
  plan: string;
  date: string;
  status: "Active" | "Inactive";
}

interface LatestMembersTableProps {
  activities: LatestMemberActivity[];
}

export default function LatestMembersTable({
  activities,
}: LatestMembersTableProps): JSX.Element {
  return (
    <div className="bg-[#141822] p-6 rounded-2xl shadow-xl border border-white/[0.08]">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-200">
          Latest Members
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Overview of newly joined athletes
        </p>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full table-fixed text-left border-collapse text-sm text-slate-300">
          <thead>
            <tr className="border-b border-white/[0.08] text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 text-center w-[10%]">Avatar</th>
              <th className="py-3 px-4 w-[25%]">Name</th>
              <th className="py-3 px-4 w-[25%]">Membership Plan</th>
              <th className="py-3 px-4 w-[25%]">Join Date</th>
              <th className="py-3 px-4 text-right w-[15%]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {activities.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-xs text-slate-500"
                >
                  No newly registered members found.
                </td>
              </tr>
            ) : (
              activities.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-white/[0.03] transition-colors duration-150"
                >
                  <td className="py-4 px-4 text-center">
                    <div className="w-9 h-9 mx-auto rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                      <svg
                        className="w-4 h-4 text-sky-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                        />
                      </svg>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-medium text-slate-200 truncate">
                    {member.name}
                  </td>

                  <td className="py-4 px-4 text-slate-400 truncate">
                    <span className="text-sky-400 font-medium">
                      {member.plan}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-xs font-mono text-slate-400 truncate">
                    {member.date}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold ${
                        member.status === "Active"
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
