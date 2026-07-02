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
        <div className="w-full min-h-screen px-8 py-12 flex flex-col justify-center bg-[#101828] relative overflow-hidden">
      
      <div className="absolute top-[-18%] right-[-15%] w-[60%] h-[42%] aspect-square rotate-[-25%] opacity-70 blur-[50px] pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-400 via-blue-500 to-transparent rounded-tl-full rounded-bl-full"></div>
      </div>

      <div className="absolute top-[-19%] right-[-12%] w-[45%] h-[42%] rotate-[-25%] opacity-100 blur-[25px] pointer-events-none">
        <div className="absolute inset-9 bg-cyan-300 rounded-tl-full rounded-bl-full"></div>
      </div>
      <div className="absolute top-[-5%] right-[-34%] w-[40%] h-[25%] rounded-full bg-[#0a0e18] opacity-100 blur-[25px] pointer-events-none"></div>

      <div className="absolute left-1/2 -bottom-85 -translate-x-1/2 w-full aspect-square border-50 border-[#2388FF] opacity-80 rounded-full blur-xl pointer-events-none"></div>
      
      {/* ubah isian */}
      <div className="absolute top-10 left-0 right-0 w-full px-8">
        <div className="w-full"> 
          <div className="w-10 mb-6"> 
            <div className="flex items-center justify-center w-full aspect-square bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer" >
              <span className="material-icons text-lg text-white">arrow_back</span>
            </div>
          </div>

          <h2 className="bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-4xl font-extrabold tracking-tight">Masukkan </h2>
          <h2 className="bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-4xl font-extrabold mt-[-2]"> Kode
            <span className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text pl-2">
              OTP
            </span>
          </h2>

          <p className="text-md mt-3 text-gray-300 font-light mb-7 text-justify tracking-wider">
            Kami telah mengirimkan kode OTP ke <span className="text-[#2EC4B6]"> n****@*.com</span>  Masukkan kode tersebut untuk memverifikasi akun Anda.
          </p>

    <div className="w-full bg-linear-to-tr from-transparent via-gray-400 to-transparent rounded-xl p-px mb-5 mt-2">
      <div className="w-full bg-linear-to-b from-[#090e16] to-[#182133] rounded-xl p-3 text-white">
        <div className="flex flex-row gap-3 w-full items-center">
          
          <div className="w-auto flex items-center justify-center font-bold text-gray-400 rounded-lg px-2.5 py-0.5 text-sm">
              <span className="material-icons text-lg text-white rotate-180 transition-transform">wb_incandescent</span>
          </div>
          
          <div className="flex-1 text-sm text-gray-200 leading-relaxed">
            Tidak menemukan email kode? Coba cek folder Spam atau Promosi.
          </div>

        </div>
      </div>
    </div>

    <div className="rounded-xl shadow-md w-full">
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
      {success && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>}

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold tracking-wider text-gray-400">Kode OTP</label>
          <input
            type="text"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            placeholder="XXXXXX"
            className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-[#1B1B1B] text-sm text-white backdrop-blur-md focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-transparent transition-all"
            required
            disabled={loading}
          />
        </div>

        <div className="text-center text-xs text-gray-100 my-1">
          {countdown > 0 ? (
            <p>Kode kedaluwarsa dalam <span className="text-blue-200 font-semibold">{formatTime(countdown)}</span></p>
          ) : (
            <p className="text-red-500 font-semibold">Kode OTP telah kedaluwarsa.</p>
          )}
        </div>

        <button type="submit" disabled={loading || countdown === 0} className="w-full py-2.5 mt-4 bg-[#2EC4B6] hover:bg-[#23a89b] text-white font-bold rounded-full shadow-lg shadow-blue-950/50 transition-all active:scale-[0.98] cursor-pointer disabled:bg-gray-600">
          {loading ? "Memverifikasi..." : "Verifikasi Akun"}
        </button>
      </form>

      <div className="text-sm text-center mt-6">
        <button type="button" onClick={handleResend} disabled={loading || countdown > 240} className="text-blue-200 font-semibold bg-transparent border-none cursor-pointer disabled:text-gray-400">
          Kirim Ulang OTP
        </button>
      </div>
    </div>
    </div>
    </div>
    </div>

  );
}