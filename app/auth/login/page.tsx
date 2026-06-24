"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase";

export default function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const supabase = createClient();

  
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  };

  

  return (
    <div className="w-full max-w-md p-6 bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-center text-slate-200 mb-6"> Login to GymHero </h2>

      
      <p className="text-center text-xs text-slate-500">welcome</p>
    </div>
    
    
  );

  
}
