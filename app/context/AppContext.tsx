"use client";

import React, { createContext, useContext, useState } from "react";

export interface Member {
  id: string;
  name: string;
  email: string;
  plan: string;
  price: number;
  status: "Active" | "Inactive";
}

interface AppContextType {
  members: Member[];
  addMember: (member: Omit<Member, "id">) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Iliya Mehri",
      email: "iliya@gym.com",
      plan: "Premium (6 Months)",
      price: 150,
      status: "Active",
    },
  ]);

  const addMember = (newMember: Omit<Member, "id">) => {
    const memberWithId: Member = {
      ...newMember,
      id: Math.random().toString(36).substr(2, 9),
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
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
