"use client";

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';

interface RegisterProps {
  onRegisterSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterComponent({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Karena ini halaman Register, kita buat konstan atau default-nya false demi kelancaran animasi slider
  const isLogin = false; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword, 
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || resData.message || "Gagal mendaftar.");
      }

      onRegisterSuccess(formData.email);
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
          <div className="w-10 mb-8"> 
            <div className="flex items-center justify-center w-full aspect-square bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer" onClick={onSwitchToLogin}>
              <span className="material-icons text-lg text-white">arrow_back</span>
            </div>
          </div>

          <h2 className="bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-4xl font-extrabold tracking-tight">Selamat Datang di </h2>
          <h2 className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent text-4xl font-extrabold mt-[-2]">
            SAKU SEHAT
          </h2>

          <p className="text-md mt-3 text-gray-300 font-light mb-5 text-justify">
            Masuk untuk mencatat, memantau, dan menjaga keuanganmu tetap sehat setiap hari.
          </p>
          
          <div className="w-full bg-linear-to-tr from-transparent via-gray-400 to-transparent rounded-full p-px mb-5">
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
                    className={`w-full text-center py-2 font-semibold transition-colors duration-300 cursor-pointer ${
                      isLogin ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Login
                  </button>
                </div>
                
                <div className="w-1/2">
                  <button 
                    type="button"
                    className={`w-full text-center py-2 font-semibold transition-colors duration-300 cursor-pointer ${
                      !isLogin ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

            </div>
          </div>

          {error && (
            <div className="p-3 mb-5 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold tracking-wider text-gray-400">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Masukkan Email Anda" className="px-4 py-2 rounded-xl border border-gray-400 bg-[#1B1B1B] text-sm text-white backdrop-blur-md focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-transparent transition-all" required />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold tracking-wider text-gray-400">Nama Lengkap</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Masukkan Nama Lengkap Anda" className="px-4 py-2 rounded-xl border border-gray-400 bg-[#1B1B1B] text-sm text-white backdrop-blur-md focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-transparent transition-all" required />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold tracking-wider text-gray-400">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Masukkan Username Anda" className="px-4 py-2 rounded-xl border border-gray-400 bg-[#1B1B1B] text-sm text-white backdrop-blur-md focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-transparent transition-all" required />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold tracking-wider text-gray-400">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Masukkan Password Anda" className="px-4 py-2 rounded-xl border border-gray-400 bg-[#1B1B1B] text-sm text-white backdrop-blur-md focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-transparent transition-all" required />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold tracking-wider text-gray-400">Konfirmasi Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Konfirmasi Password Anda" className="px-4 py-2 rounded-xl border border-gray-400 bg-[#1B1B1B] text-sm text-white backdrop-blur-md focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-transparent transition-all" required />
            </div>
            
            <button type="submit" disabled={loading} className="w-full py-2.5 mt-4 bg-[#2EC4B6] hover:bg-[#23a89b] text-white font-bold rounded-full shadow-lg shadow-blue-950/50 transition-all active:scale-[0.98] cursor-pointer disabled:bg-gray-600">
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}