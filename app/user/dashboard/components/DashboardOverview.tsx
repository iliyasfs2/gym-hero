import React from "react";
import { MemberCard } from "../components/MemberCard";
import { NavigationLinks } from "../components/NavigationLinks";

interface ProfileData {
  full_name: string;
  plan_name: string;
  subscription_status: "active" | "expired";
  height?: number;
  weight?: number;
  days_left: number;
  purchase_date?: string;
}

interface DashboardOverviewProps {
  email: string;
  profileData: ProfileData;
}

export default function DashboardOverview({
  email,
  profileData,
}: DashboardOverviewProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header section with user email */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <h1 className="text-lg font-semibold text-slate-200">
              User Dashboard
            </h1>
          </div>
          <span className="text-xs text-slate-400 font-mono">{email}</span>
        </div>

        {/* Physical info and subscription card */}
        <MemberCard
          fullName={profileData.full_name}
          planName={profileData.plan_name}
          status={profileData.subscription_status}
          height={profileData.height}
          weight={profileData.weight}
          daysLeft={profileData.days_left}
          purchaseDate={profileData.purchase_date}
        />

        {/* Quick action navigation links */}
        <NavigationLinks />
      </div>
    </div>
  );
}
