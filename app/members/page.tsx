"use client";

import Link from "next/link";
import React, { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import GlowLayout from "@/app/components/GlowLayout";
import { useApp } from "@/app/components/context/AppContext";

export interface Member {
  id: string;
  name: string;
  email: string;
  plan: string;
  price: number;
  status: "Active" | "Inactive";
}

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { members: rawMembers, addMember } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<string>("Basic (1 Month)");
  const [fullName, setFullName] = useState<string>("");

  const members = (rawMembers || []) as Member[];

  const handleSaveMember = () => {
    if (!fullName.trim()) return alert("Please enter a name!");
    if (addMember) {
      addMember({
        name: fullName,
        email: `${fullName.toLowerCase().replace(/\s+/g, "")}@gym.com`,
        plan: selectedPlan,
        price: selectedPlan.includes("Premium") ? 150 : 50,
        status: "Active",
      });
    }
    setFullName("");
    setSelectedPlan("Basic (1 Month)");
    setIsModalOpen(false);
  };

  return (
    <GlowLayout>
      <div className="flex min-h-screen bg-[#0a0f1d] text-white w-full">
        <Sidebar />
        <div className="flex-1 p-8 overflow-y-auto z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-200">
                  Dashboard Overview
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  GymHero management system
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer shadow-lg shadow-blue-600/20"
              >
                + Add New Member
              </button>
            </div>

            {/* Members List */}
            <div className="glass-card-fixed space-y-4 p-6 w-full rounded-2xl shadow-xl">
              <h2 className="text-lg font-bold text-white/90 px-1">
                Members List
              </h2>
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/[0.04] hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
                        <span className="text-xs">
                          {member.status === "Active" ? "🟢" : "🔴"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white/90">
                          {member.name || "Unknown Member"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Registered with{" "}
                          <span className="text-blue-400 font-medium">
                            {member.plan || "No Plan"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full border font-semibold ${member.status === "Active" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-slate-400 bg-slate-500/10 border-slate-500/20"}`}
                    >
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="glass-card-fixed bg-slate-950/80 w-full max-w-md rounded-2xl p-6 shadow-2xl relative m-4 border border-white/[0.1]">
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              Add Gym Member
            </h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Basic (1 Month)" className="bg-[#0d1527]">
                  Basic (1 Month)
                </option>
                <option value="Standard (3 Months)" className="bg-[#0d1527]">
                  Standard (3 Months)
                </option>
                <option value="Premium (6 Months)" className="bg-[#0d1527]">
                  Premium (6 Months)
                </option>
              </select>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:bg-white/[0.04] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMember}
                className="bg-blue-600 text-white px-4 py-2 text-sm rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </GlowLayout>
  );
}