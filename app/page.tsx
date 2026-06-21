export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f1d] p-6 text-white">
      {/* هدر ساده پروژه */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-wider text-slate-200">
          GYM<span className="text-[#3b82f6]">HERO</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          سیستم مدیریت اشتراک و ورزشکاران
        </p>
      </div>

      {/* دکمه سرمه‌ای-متالیک شیک با استایل انتخابی تو */}
      <button
        className="
        px-8 py-4 
        rounded-xl 
        font-semibold 
        text-base
        tracking-wide
        text-slate-200
        
        /* رنگ پس‌زمینه سرمه‌ای متالیک سنگین */
        bg-gradient-to-b from-slate-800 to-slate-900
        
        /* مرز و افکت متالیک دور دکمه */
        border border-slate-700/50
        
        /* سایه ملایم برای حجم دادن به دکمه متالیک */
        shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_4px_12px_rgba(0,0,0,0.4)]
        
        /* انیمیشن‌ها در حالت Hover */
        transition-all duration-300 ease-in-out
        hover:from-slate-700 hover:to-slate-800
        hover:text-white
        hover:border-slate-600
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),_0_6px_20px_rgba(0,0,0,0.5)]
        hover:scale-[1.02]
        
        /* انیمیشن کلیک شدن */
        active:scale-[0.98]
      "
      >
        خرید اشتراک ویژه
      </button>
    </main>
  );
}
