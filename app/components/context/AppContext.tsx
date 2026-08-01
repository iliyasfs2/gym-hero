"use client";

import React, { createContext, useContext, useState } from "react";

export interface PaymentHistory {
  date: string;
  amount: string;
  status: string;
}

export interface Member {
  id: string;
  user_id?: string;
  name: string;
  phone: string;
  plan: string;
  price: number;
  status: "Active" | "Expired" | "Expiring Soon";
  joinDate: string;
  endDate?: string;
  daysLeft?: number;
  payments?: PaymentHistory[];
}

interface AppContextType {
  members: Member[];
  addMember: (member: Omit<Member, "id">) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);

  const addMember = (newMember: Omit<Member, "id">) => {
    const memberWithId: Member = {
      ...newMember,
      id: crypto.randomUUID(),
    };
    setMembers((prev) => [...prev, memberWithId]);
  };

  return (
    <AppContext.Provider value={{ members, addMember }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
