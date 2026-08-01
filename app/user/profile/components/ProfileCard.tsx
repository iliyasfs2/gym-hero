import React from "react";
import { ProfileCardProps } from "./types";

export function ProfileCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  children,
  className = "",
}: ProfileCardProps) {
  return (
    <div
      className={`bg-[#111622] border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between shadow-xl ${className}`}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
          <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {title}
            </h3>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
