"use client";

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';

interface LoginProps {
  onSwitchToRegister: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginPage({ onSwitchToRegister, onLoginSuccess }: LoginProps) {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = true;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const teksResponse = await response.text();

      if (!response.ok) {
        console.error("ISI ERROR LOGIN DARI SERVER:", teksResponse);
        try {
          const parsedError = JSON.parse(teksResponse);
          throw new Error(parsedError.message || "Gagal masuk.");
        } catch {
          throw new Error("Terjadi kesalahan pada server backend.");
        }
      }

      const resData = JSON.parse(teksResponse);
      setSuccess(true);
      
      if (resData.data) {
        localStorage.setItem("token", resData.data);
      }
      
      console.log("Login Sukses, Token:", resData.data);
      setFormData({ identifier: "", password: "" });

      setTimeout(() => {
        // Panggil prop callback agar state step/mode di AuthContent berpindah ke dashboard
        if (onLoginSuccess) {
          onLoginSuccess();
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
        <div className="w-full"> 
          
          <div className="w-10 mb-5"> 
            <div 
              onClick={onSwitchToRegister}
              className="flex items-center justify-center w-full aspect-square bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <span className="material-icons text-lg text-white">arrow_back</span>
            </div>
          </div>

          <h2 className="bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-[32px] font-extrabold tracking-tight text-center leading-snug">
            Yuk, Lanjut{" "}
            <span className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent text-[32px] font-extrabold text-center">
              Kelola
            </span> 
          </h2>
          <h2 className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent text-[32px] font-extrabold text-center">
            Keuanganmu!
          </h2>

          <p className="text-sm mt-3 text-gray-300 font-semibold text-center leading-snug">
            Masuk ke SAKU SEHAT dan lihat perkembangan finansialmu dengan mudah.
          </p>
          
          <div className="p-4">
            <div className="w-full bg-linear-to-tr from-transparent via-gray-400 to-transparent rounded-full p-px mb-5 mt-2">
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
                      onClick={onSwitchToRegister} 
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
              <div className="p-3 mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 mb-4 text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-900 rounded-xl backdrop-blur-sm">
                Login berhasil! Mengalihkan...
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold tracking-wider text-white">Username / Email</label>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-400 backdrop-blur-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                  <span className="material-icons text-gray-300 text-sm select-none">person</span>
                  <input 
                    type="text" 
                    name="identifier" 
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Masukkan Username/Email Anda" 
                    className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                    required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold tracking-wider text-white">Password</label>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-400 backdrop-blur-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                  <span className="material-icons text-gray-300 text-sm select-none">lock</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan Password Anda"
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
              
              {/* Checkbox Ingat Saya & Lupa Password */}
              <div className="flex items-center justify-between font-urbanist">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    className="w-4 h-4 rounded bg-[#1B1B1B] border-gray-400 accent-[#2EC4B6] cursor-pointer transition-all"
                  />
                  <span>Ingat Saya</span>
                </label>
                
                <a href="#" className="text-xs text-[#2EC4B6] hover:underline font-medium">
                  Lupa Password?
                </a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-[#2EC4B6] hover:bg-[#23a89b] text-[#101828] font-bold rounded-full shadow-lg shadow-blue-950/50 transition-all active:scale-[0.98] cursor-pointer disabled:bg-gray-600"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}