"use client";

import React, { useState } from "react";
import { Member } from "@/app/components/context/AppContext";

interface MemberTableProps {
  members: Member[];
  onEditClick: (member: Member) => void;
  onDeleteClick: (id: string) => void;
  onViewClick: (member: Member) => void;
}

export default function MemberTable({
  members,
  onEditClick,
  onDeleteClick,
  onViewClick,
}: MemberTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(members.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = members.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-4 w-full">
      <div className="bg-[#141822] rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.01]">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Member
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.06]">
              {currentItems.map((member) => {
                const statusStyles =
                  member.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : member.status === "Expired"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20";

                const avatarLetter = member.name.charAt(0).toUpperCase();

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sm font-bold text-sky-400 shadow-inner">
                        {avatarLetter}
                      </div>
                      <span className="font-medium text-sm text-slate-200 group-hover:text-white transition-colors">
                        {member.name}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-slate-400 font-mono">
                      {member.phone}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                          member.plan.toLowerCase().includes("gold")
                            ? "bg-amber-500/5 text-amber-300 border-amber-500/10"
                            : "bg-slate-500/5 text-slate-300 border-slate-500/10"
                        }`}
                      >
                        {member.plan.includes("(")
                          ? member.plan.split(" ")[0]
                          : member.plan}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyles}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {member.status}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-slate-400">
                      {member.joinDate}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewClick(member)}
                          className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/20 transition-all cursor-pointer"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => onEditClick(member)}
                          className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/20 transition-all cursor-pointer"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDeleteClick(member.id)}
                          className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M3 7h18M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-sm text-slate-500"
                  >
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs text-slate-400 hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            &lt; Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-sky-600 border-sky-500 text-white shadow-lg shadow-sky-600/20"
                  : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:bg-white/[0.05]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs text-slate-400 hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}
