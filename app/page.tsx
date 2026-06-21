"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  // ۱. تعریف وضعیت باز یا بسته بودن پاپ‌آ‌پ و استیت‌های فرم
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState([
    { id: 1, name: "John Doe", plan: "Basic (1 Month)" }, // عضو نمونه
  ]);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Basic (1 Month)");
  const [fullName, setFullName] = useState(""); // برای ذخیره متن اینپوت

  // تابع ذخیره عضو جدید
  const handleSaveMember = () => {
    if (!fullName.trim()) return alert("Please enter a name!");

    // اضافه کردن عضو جدید به لیست قبلی
    const newMember = {
      id: Date.now(),
      name: fullName,
      plan: selectedPlan,
    };

    setMembers([...members, newMember]);

    // پاکسازی فرم و بستن پاپ‌آپ
    setFullName("");
    setSelectedPlan("Basic (1 Month)");
    setIsModalOpen(false);
  };

  // ۲. داده‌های کارت‌های آمار سریع
  const stats = [
    {
      id: 1,
      title: "Total Members",
      value: "1,248",
      icon: "👥",
      change: "+12% this month",
      color: "text-emerald-400",
    },
    {
      id: 2,
      title: "Active Subscriptions",
      value: "842",
      icon: "💳",
      change: "92% active rate",
      color: "text-blue-400",
    },
    {
      id: 3,
      title: "Monthly Revenue",
      value: "$14,250",
      icon: "💰",
      change: "+8% vs last month",
      color: "text-amber-400",
    },
  ];

  return (
    <main className="flex min-h-screen bg-[#0a0f1d] text-white relative">
      {/* سایدبار در سمت چپ */}
      <Sidebar />

      {/* محتوای اصلی سمت راست */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* هدر بالای صفحه همراه با دکمه افزودن */}
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

          {/* بخش کارت‌های آمار سریع */}
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

          {/* بخش نمایش لیست اعضای باشگاه (دقیقاً زیر کارت‌ها و تمام‌عرض) */}
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
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* پاپ‌آپ افزودن عضو جدید */}
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
              {/* فیلد نام */}
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

              {/* فیلد انتخاب پلان */}
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

            {/* دکمه‌های کنترل پاپ‌آ‌پ */}
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
