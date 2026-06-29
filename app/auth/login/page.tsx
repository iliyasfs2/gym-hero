
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // 1. Mock OTP Sending Logic
  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    setTimeout(() => {
      setMessage("Development Mode: Mock code sent successfully.");
      setStep("code");
      setLoading(false);
    }, 1000);
  };

  // 2. Mock OTP Verification Logic
  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (token.length === 6) {
        router.push("/member/subscription");
      } else {
        setError("Please enter a valid 6-digit code.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div>
      <div>
        <h2>Sign In to Gym Hero</h2>

        {error && <p>{error}</p>}
        {message && <p>{message}</p>}

        {step === "email" ? (
          <form onSubmit={handleSendOtp}>
            <div>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div>
              <label>Enter 6-Digit Code</label>
              <input
                type="text"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="------"
                required
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button type="button" onClick={() => setStep("email")}>
              Change Email Address
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
