"use client";

import { useState, useEffect } from "react";

interface VerifyOTPProps {
  email: string;
  onSuccess: () => void;
}

export default function VerifyOTPComponent({ email, onSuccess }: VerifyOTPProps) {
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 Menit

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otpCode }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || "Verifikasi OTP gagal.");

      setSuccess("Akun berhasil diaktifkan!");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || "Gagal mengirim ulang OTP.");

      setSuccess("Kode OTP baru telah dikirim ke email!");
      setCountdown(300);
      setOtpCode("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">Verifikasi OTP</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Masukkan kode yang dikirim ke <br />
        <span className="font-semibold text-gray-700">{email}</span>
      </p>

      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
      {success && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>}

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 text-center">
          <input
            type="text"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="px-4 py-3 rounded-lg border border-blue-600 bg-white text-gray-800 text-center text-xl font-bold tracking-widest outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={loading}
          />
        </div>

        <div className="text-center text-xs text-gray-500 my-1">
          {countdown > 0 ? (
            <p>Kode kedaluwarsa dalam <span className="text-blue-600 font-semibold">{formatTime(countdown)}</span></p>
          ) : (
            <p className="text-red-500 font-semibold">Kode OTP telah kedaluwarsa.</p>
          )}
        </div>

        <button type="submit" disabled={loading || countdown === 0} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400">
          {loading ? "Memverifikasi..." : "Verifikasi Akun"}
        </button>
      </form>

      <div className="text-sm text-center mt-6">
        <button type="button" onClick={handleResend} disabled={loading || countdown > 240} className="text-blue-600 font-semibold bg-transparent border-none cursor-pointer disabled:text-gray-400">
          Kirim Ulang OTP
        </button>
      </div>
    </div>
  );
}