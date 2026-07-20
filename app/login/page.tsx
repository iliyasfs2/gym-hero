import React from "react";
import { LoginForm } from "@/app/login/loginform";

export default function LoginPage() {
  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
