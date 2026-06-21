import Sidebar from "@/components/Sidebar";

export default function Home() {
  // ۱. داده‌های مربوط به کارت‌های آمار باشگاه
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

  // ۲. داده‌های فرضی برای جدول ورزشکاران باشگاه
  const recentMembers = [
    {
      id: 1,
      name: "Alex Morgan",
      plan: "Premium (12 Months)",
      status: "Active",
      joined: "June 10, 2026",
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      plan: "Basic (1 Month)",
      status: "Expired",
      joined: "May 18, 2026",
    },
    {
      id: 3,
      name: "Michael Chang",
      plan: "Standard (3 Months)",
      status: "Active",
      joined: "June 02, 2026",
    },
    {
      id: 4,
      name: "Emma Watson",
      plan: "Premium (6 Months)",
      status: "Active",
      joined: "June 15, 2026",
    },
  ];

  return (
    <main className="flex min-h-screen bg-[#0a0f1d] text-white">
      {/* منوی کناری ثابت */}
      <Sidebar />

      {/* بخش محتوای اصلی سمت راست */}
      <div className="flex-1 p-8">
        {/* هدر بالای داشبورد */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-200">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Welcome to GymHero management system
            </p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-600/10 cursor-pointer">
            + Add New Member
          </button>
        </div>

        {/* بخش کارت‌های آمار سریع */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-[#0d1527] border border-slate-800/60 rounded-2xl p-6 shadow-md transition-all duration-300 hover:border-slate-700/80 hover:shadow-lg"
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

        {/* ۳. جدول مدیریت ورزشکاران اخیر */}
        <div className="bg-[#0d1527] border border-slate-800/60 rounded-2xl p-6 shadow-md">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-200">
              Recent Registrations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Overview of the latest gym members
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-4 pl-4">Member Name</th>
                  <th className="pb-4">Membership Plan</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 pr-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                {recentMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-800/20 transition-colors duration-150"
                  >
                    <td className="py-4 pl-4 font-medium text-slate-200">
                      {member.name}
                    </td>
                    <td className="py-4 text-slate-400">{member.plan}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                        ${
                          member.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-400 text-xs">
                      {member.joined}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
