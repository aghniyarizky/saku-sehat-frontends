"use client";

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess?: (email: string) => void;
}

export default function RegisterComponent({ onSwitchToLogin, onRegisterSuccess }: RegisterProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLogin = false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const teksResponse = await response.text();

      if (!response.ok) {
        try {
          const parsedError = JSON.parse(teksResponse);
          throw new Error(parsedError.error || parsedError.message || "Pendaftaran gagal.");
        } catch {
          throw new Error("Terjadi kesalahan pada server backend.");
        }
      }

      setSuccess(true);
      const userEmail = formData.email;

      setFormData({
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess(userEmail);
        }
      }, 1000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-8 py-12 flex flex-col justify-center bg-[#101828] relative overflow-hidden">
      <div className="absolute top-6 left-0 right-0 w-full px-8">
        <div className="w-full "> 
          <div className="w-10 mb-5"> 
            <div 
              onClick={onSwitchToLogin}
              className="flex items-center justify-center w-full aspect-square bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <span className="material-icons text-lg text-white">arrow_back</span>
            </div>
          </div>
        <h2 className="bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-[30px] font-extrabold tracking-tight text-center leading-snug">
          Selamat Datang di{" "}
        </h2>
        <h2 className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent text-[30px] font-extrabold text-center">
          SAKU SEHAT
        </h2>

        <p className="text-xs mt-2 text-gray-300 font-medium text-center leading-snug">
          Buat akun SAKU SEHAT dan nikmati kemudahan mencatat serta memantau finansialmu.
        </p>
        
        <div className="p-4">
          <div className="w-full bg-linear-to-tr from-transparent via-gray-400 to-transparent rounded-full p-px mb-4">
            <div className="relative w-full bg-linear-to-b from-[#090e16] to-[#182133] rounded-full p-1 text-white overflow-hidden">
              
              <div 
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-gray-800 border border-gray-500 rounded-full transition-transform duration-300 ease-out ${
                  isLogin ? "translate-x-0" : "translate-x-full"
                }`}
              />

              <div className="relative flex flex-row items-center w-full z-10">
                <div className="w-1/2">
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="w-full text-center py-2 font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                </div>
                
                <div className="w-1/2">
                  <button 
                    type="button"
                    className="w-full text-center py-2 font-semibold text-white transition-colors cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </div>

            </div>
          </div>

          {error && (
            <div className="p-2.5 mb-3 text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-2.5 mb-3 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900 rounded-xl backdrop-blur-sm">
              Registrasi berhasil! Mengalihkan ke verifikasi OTP...
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold tracking-wider text-white">Email</label>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-400 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#2EC4B6] focus-within:border-transparent transition-all">
                <span className="material-icons text-gray-300 text-sm select-none">email</span>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan Email Anda" 
                  className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                  required 
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold tracking-wider text-white">Nama Lengkap</label>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-400 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#2EC4B6] focus-within:border-transparent transition-all">
                <span className="material-icons text-gray-300 text-sm select-none">badge</span>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Masukkan Nama Lengkap Anda" 
                  className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                  required 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold tracking-wider text-white">Username</label>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-400 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#2EC4B6] focus-within:border-transparent transition-all">
                <span className="material-icons text-gray-300 text-sm select-none">person</span>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan Username Anda" 
                  className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                  required 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold tracking-wider text-white">Password</label>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-400 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#2EC4B6] focus-within:border-transparent transition-all">
                <span className="material-icons text-gray-300 text-sm select-none">lock</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 karakter, 1 kapital & 1 angka"
                  className={`w-full bg-transparent text-white placeholder-gray-400 focus:outline-none placeholder:text-xs ${
                    showPassword 
                      ? "text-xs tracking-normal" 
                      : "text-base tracking-widest placeholder-shown:tracking-normal"
                  }`} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-300 hover:text-white transition-colors focus:outline-none flex items-center cursor-pointer"
                >
                  <span className="material-icons text-xs select-none">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold tracking-wider text-white">Konfirmasi Password</label>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-400 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#2EC4B6] focus-within:border-transparent transition-all">
                <span className="material-icons text-gray-300 text-sm select-none">lock_reset</span>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi Password Anda"
                  className={`w-full bg-transparent text-white placeholder-gray-400 focus:outline-none placeholder:text-xs ${
                    showConfirmPassword 
                      ? "text-xs tracking-normal" 
                      : "text-base tracking-widest placeholder-shown:tracking-normal"
                  }`} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-300 hover:text-white transition-colors focus:outline-none flex items-center cursor-pointer"
                >
                  <span className="material-icons text-xs select-none">
                    {showConfirmPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-[#2EC4B6] hover:bg-[#23a89b] text-[#101828] text-xs font-bold rounded-full shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:bg-gray-600"
            >
              {loading ? "Memproses..." : "Daftar Akun"}
            </button>

          </form>
        </div>
      </div>
    </div>
    </div>
  );
}