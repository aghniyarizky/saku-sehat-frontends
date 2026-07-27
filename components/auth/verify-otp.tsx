"use client";

import { useState, useEffect } from "react";
import 'material-icons/iconfont/material-icons.css';

interface VerifyOTPProps {
  email: string;
  onSuccess: () => void;
  onBackToRegister?: () => void;
}

export default function VerifyOTPComponent({ email, onSuccess, onBackToRegister }: VerifyOTPProps) {
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

  const maskEmail = (userEmail: string) => {
    if (!userEmail || !userEmail.includes("@")) return "email Anda";
    const [name, domain] = userEmail.split("@");
    const maskedName = name.length > 2 ? `${name[0]}****${name[name.length - 1]}` : `${name[0]}****`;
    return `${maskedName}@${domain}`;
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

      setSuccess("Akun berhasil diaktifkan! Mengalihkan...");
      setTimeout(() => {
        onSuccess();
      }, 1500);
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
    <div className="w-full min-h-screen px-8 py-12 flex flex-col justify-center bg-[#101828] relative overflow-hidden">
      
      <div className="absolute top-6 left-0 right-0 w-full px-8">
        <div className="w-full"> 
          
          <div className="w-10 mb-5"> 
            <div 
              onClick={onBackToRegister}
              className="flex items-center justify-center w-full aspect-square bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <span className="material-icons text-lg text-white">arrow_back</span>
            </div>
          </div>

          <h2 className="bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-[32px] font-extrabold tracking-tight text-center">
            Masukkan Kode
            <span className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent pl-2 text-center">
              OTP
            </span>
          </h2>

          <p className="text-sm mt-3 text-gray-300 font-semibold mb-7 text-center tracking-normal">
            Kami telah mengirimkan kode OTP ke{" "}
            <span className="text-[#2EC4B6] font-sm">{maskEmail(email)}</span>. Masukkan kode tersebut untuk memverifikasi akun Anda.
          </p>

          <div className="w-full bg-linear-to-tr from-transparent via-gray-400 to-transparent rounded-xl p-px mb-5 mt-2">
            <div className="w-full bg-linear-to-b from-[#090e16] to-[#182133] rounded-xl p-3 text-white">
              <div className="flex flex-row gap-3 w-full items-center">
                <div className="w-auto flex items-center justify-center font-bold text-gray-400 rounded-lg px-2.5 py-0.5 text-sm">
                  <span className="material-icons text-lg text-amber-300">lightbulb</span>
                </div>
                <div className="flex-1 text-xs text-gray-200 leading-relaxed">
                  Tidak menemukan email kode? Coba cek folder **Spam** atau **Promosi**.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow-md w-full">
            {error && (
              <div className="p-3 mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 mb-4 text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-900 rounded-xl backdrop-blur-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-wider text-gray-300">Kode OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="XXXXXX"
                  className="w-full px-4 py-3 rounded-full border border-gray-400  text-center tracking-[0.5em] text-lg font-bold text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent transition-all placeholder:tracking-normal placeholder:text-sm placeholder:font-normal"
                  required
                  disabled={loading}
                />
              </div>

              <div className="text-center text-xs text-gray-300 my-1">
                {countdown > 0 ? (
                  <p>Kode kedaluwarsa dalam <span className="text-[#2EC4B6] font-semibold">{formatTime(countdown)}</span></p>
                ) : (
                  <p className="text-red-400 font-semibold">Kode OTP telah kedaluwarsa.</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading || countdown === 0} 
                className="w-full py-2.5 mt-2 bg-[#2EC4B6] hover:bg-[#23a89b] text-[#101828] font-bold rounded-full shadow-lg shadow-blue-950/50 transition-all active:scale-[0.98] cursor-pointer disabled:bg-gray-600"
              >
                {loading ? "Memverifikasi..." : "Verifikasi Akun"}
              </button>
            </form>

            <div className="text-sm text-center mt-6">
              <button 
                type="button" 
                onClick={handleResend} 
                disabled={loading || countdown > 240} 
                className="text-[#2EC4B6] hover:underline text-xs font-semibold bg-transparent border-none cursor-pointer disabled:text-gray-500 disabled:no-underline"
              >
                Kirim Ulang OTP
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}