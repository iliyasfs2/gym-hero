"use client";
import Link from "next/link";
import React, { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { useApp } from "@/app/components/context/AppContext";

export interface Member {
  id: string;
  name: string;
  email: string;
  plan: string;
  price: number;
  status: "Active" | "Inactive";
}

interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, "id">) => void;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { members, addMember } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<string>("Basic (1 Month)");
  const [fullName, setFullName] = useState<string>("");

  const handleSaveMember = () => {
    if (!fullName.trim()) return alert("Please enter a name!");

    addMember({
      name: fullName,
      email: `${fullName.toLowerCase().replace(/\s+/g, "")}@gym.com`,
      plan: selectedPlan,
      price: selectedPlan.includes("Premium") ? 150 : 50,
      status: "Active",
    });

    setFullName("");
    setSelectedPlan("Basic (1 Month)");
    setIsModalOpen(false);
  };

  const totalMembers: number = members.length;
  const activeSubs: number = members.filter(
    (m) => m.status === "Active",
  ).length;
  const totalRevenue: number = members.reduce(
    (sum, member) => sum + member.price,
    0,
  );

  const stats = [
    {
      id: 1,
      title: "Total Members",
      value: totalMembers.toLocaleString(),
      icon: "👥",
      change: "Total registered athletes",
      color: "text-emerald-400",
    },
    {
      id: 2,
      title: "Active Subscriptions",
      value: activeSubs.toLocaleString(),
      icon: "💳",
      change: "Current running plans",
      color: "text-blue-400",
    },
    {
      id: 3,
      title: "Monthly Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: "💰",
      change: "Total earnings from plans",
      color: "text-amber-400",
    },
  ];

  return (
    <main className="flex min-h-screen bg-[#0a0f1d] text-white relative">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer shadow-lg shadow-blue-600/10"
            >
              + Add New Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-[#0d1527] border border-slate-800/60 rounded-2xl p-6 shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </span>
                  <span className="text-2xl p-2 bg-slate-800/40 rounded-xl">
                    {stat.icon}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-slate-100 tracking-tight">
                    {stat.value}
                  </span>
                  <span className={`text-xs font-medium ${stat.color}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0d1527]/40 backdrop-blur-md border border-slate-900 rounded-2xl p-6 mt-8 w-full">
            <h2 className="text-lg font-semibold mb-4 text-slate-300">
              Members List
            </h2>
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex justify-between items-center p-4 bg-[#0a0f1d]/60 border border-slate-900 rounded-xl hover:border-slate-800 transition-all"
                >
                  <div>
                    <p className="text-slate-200 font-medium text-sm">
                      {member.name}
                    </p>
                    <span className="inline-block mt-1 text-xs px-2.5 py-1 bg-blue-600/10 text-blue-400 rounded-full border border-blue-500/10">
                      {member.plan}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                      member.status === "Active"
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/10"
                        : "text-slate-400 bg-slate-500/10 border-slate-500/10"
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0d1527] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative m-4">
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              Add Gym Member
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter details to register a new athlete.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Iliya Mehri"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Membership Plan
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option
                    value="Basic (1 Month)"
                    className="bg-[#0d1527] text-slate-200"
                  >
                    Basic (1 Month)
                  </option>
                  <option
                    value="Standard (3 Months)"
                    className="bg-[#0d1527] text-slate-200"
                  >
                    Standard (3 Months)
                  </option>
                  <option
                    value="Premium (6 Months)"
                    className="bg-[#0d1527] text-slate-200"
                  >
                    Premium (6 Months)
                  </option>
                  <option
                    value="Ultimate (12 Months)"
                    className="bg-[#0d1527] text-slate-200"
                  >
                    Ultimate (12 Months)
                  </option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setFullName("");
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMember}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
