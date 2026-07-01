"use client";

import React, { useState, JSX } from "react";
import Sidebar from "@/app/components/Sidebar";
import GlowLayout from "@/app/components/GlowLayout";
import { useApp, Member } from "@/app/components/context/AppContext";

export interface NewMemberFormData {
  name: string;
  phone: string;
  plan: string;
  startDate: string;
}

type FilterStatus = "All" | "Active" | "Expired" | "Expiring Soon";

const MOCK_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Ali Ahmadi",
    phone: "09123456789",
    plan: "Gold",
    status: "Active",
    joinDate: "2026-06-01",
    price: 150,
  },
  {
    id: "2",
    name: "Sara Kamali",
    phone: "09359876543",
    plan: "Silver",
    status: "Expired",
    joinDate: "2026-05-15",
    price: 100,
  },
  {
    id: "3",
    name: "Reza Nouri",
    phone: "09191112233",
    plan: "Gold",
    status: "Expiring Soon",
    joinDate: "2026-06-20",
    price: 150,
  },
];

export default function MembersPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // فرم افزودن عضو جدید
  const todayString = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState<NewMemberFormData>({
    name: "",
    phone: "",
    plan: "Basic (1 Month)",
    startDate: todayString,
  });

  const { members: contextMembers, addMember } = useApp();
  const members: Member[] =
    contextMembers.length > 0 ? contextMembers : MOCK_MEMBERS;

  // فیلتر کردن اعضا بر اساس سرچ و وضعیت
  const filteredMembers: Member[] = members.filter(
    (member: Member): boolean => {
      const query: string = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        (member.phone ? String(member.phone).includes(query) : false);
      const matchesStatus =
        selectedFilter === "All" || member.status === selectedFilter;
      return matchesSearch && matchesStatus;
    },
  );

  const handleSaveMember = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    let price = 50;
    if (formData.plan.includes("Standard")) price = 100;
    if (formData.plan.includes("Premium")) price = 150;

    addMember({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      plan: formData.plan,
      price: price,
      status: "Active",
      joinDate: formData.startDate,
    });

    setIsModalOpen(false);
    setFormData({
      name: "",
      phone: "",
      plan: "Basic (1 Month)",
      startDate: todayString,
    });
  };

  const filters: FilterStatus[] = ["All", "Active", "Expired", "Expiring Soon"];

  return (
    <GlowLayout>
      <div className="flex min-h-screen bg-[#0a0f1d] text-white w-full">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto z-10">
          <div className="max-w-5xl mx-auto">
            {/* هدر صفحه */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 w-full">
              <div>
                <h1 className="text-2xl font-bold text-slate-200">
                  Gym Members
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Manage, search, and filter registered athletes
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer shadow-lg shadow-blue-600/20 flex items-center gap-2"
              >
                <span>+</span>
                <span>Add Member</span>
              </button>
            </div>

            {/* بخش فیلترها و سرچ */}
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
                  placeholder="Search member..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/[0.05]">
                {filters.map((filter) => {
                  const emoji =
                    filter === "Active"
                      ? "🟢"
                      : filter === "Expired"
                        ? "🔴"
                        : filter === "Expiring Soon"
                          ? "⏳"
                          : "📊";
                  const isActive = selectedFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedFilter(filter)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                          : "bg-white/[0.02] border-white/[0.05] text-slate-400 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <span>{emoji}</span>
                      <span>{filter}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* جدول نمایش کاربران */}
            <div className="glass-card-fixed rounded-2xl border border-white/[0.04] overflow-hidden shadow-xl w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.01]">
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

                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredMembers.map((member) => {
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
                          className="hover:bg-white/[0.01] transition-colors group"
                        >
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/[0.08] flex items-center justify-center text-sm font-bold text-blue-400 shadow-inner">
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
                              <button className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all cursor-pointer text-xs">
                                👁 View
                              </button>
                              <button className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/20 transition-all cursor-pointer text-xs">
                                ✏️ Edit
                              </button>
                              <button className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer text-xs">
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* مدال ثبت نام عضو جدید */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-card-fixed bg-slate-950/80 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/[0.08] relative">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-100">
                Add Gym Member
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter athlete details to register subscription
              </p>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="09123456789"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Membership Plan
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      id: "Basic (1 Month)",
                      name: "Basic",
                      time: "1 Month",
                      price: "$50",
                      icon: "🏋️‍♂️",
                    },
                    {
                      id: "Standard (3 Months)",
                      name: "Standard",
                      time: "3 Months",
                      price: "$100",
                      icon: "⚡",
                    },
                    {
                      id: "Premium (6 Months)",
                      name: "Premium",
                      time: "6 Months",
                      price: "$150",
                      icon: "👑",
                    },
                  ].map((planItem) => {
                    const isSelected = formData.plan === planItem.id;
                    return (
                      <div
                        key={planItem.id}
                        onClick={() =>
                          setFormData({ ...formData, plan: planItem.id })
                        }
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 bg-black/30 ${
                          isSelected
                            ? "border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/5"
                            : "border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl bg-white/[0.03] p-2 rounded-lg border border-white/[0.05]">
                            {planItem.icon}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-200">
                              {planItem.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {planItem.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono font-bold text-blue-400">
                            {planItem.price}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-600"}`}
                          >
                            {isSelected && (
                              <span className="text-[9px] text-white">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GlowLayout>
  );
}
