"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  
  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (otpError) {
      setError(otpError.message);
      setLoading(false);
      return;
    }

    setMessage("A 6-digit verification code has been sent to your email.");
    setStep("code");
    setLoading(false);
  };


  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'email',
    });

    if (verifyError) {
      setError("Invalid or expired verification code.");
      setLoading(false);
      return;
    }

    router.push("/member/subscription");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 tracking-tight">
          Sign In to Gym Hero
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center border border-red-200">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg text-center border border-green-200">
            {message}
          </p>
        )}

        
        {step === "email" ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                placeholder="name@example.com"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 p-3 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-sm"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
         
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-center tracking-[0.5em] font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-gray-800"
                placeholder="------"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 p-3 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-sm"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 text-center block transition-colors"
            >
              ← Change email address
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
