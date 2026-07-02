"use client";

import { useState } from "react";

interface LoginProps {
  onSwitchToRegister: () => void;
}

export default function LoginPage({ onSwitchToRegister }: LoginProps) {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
        window.location.href = "/dashboard"; 
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="w-full min-h-screen px-8 py-12 flex flex-col justify-center bg-[#101828]">
    {/* 
    <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[42%] aspect-square rounded-full bg-linear-to-br from-cyan-400 via-blue-500 to-transparent opacity-70 blur-[50px] pointer-events-none"></div>
    <div className="absolute top-[-25%] right-[-19%] w-[40%] h-[42%] rounded-full bg-cyan-400 opacity-100 blur-[20px] pointer-events-none"></div> */}
    {/* <div className="absolute top-[-5%] right-[-33%] w-[40%] h-[25%] rounded-full bg-[#141e30] opacity-100 blur-[30px] pointer-events-none"></div> */}

    
    <div className="absolute top-[-18%] right-[-15%] w-[60%] h-[42%] aspect-square rotate-[-25%] opacity-70 blur-[50px] pointer-events-none">
      <div className="absolute inset-0 bg-linear-to-br from-cyan-400 via-blue-500 to-transparent rounded-tl-full rounded-bl-full"></div>
    </div>

    <div className="absolute top-[-19%] right-[-12%] w-[45%] h-[42%] rotate-[-25%] opacity-100 blur-[25px] pointer-events-none">
      <div className="absolute inset-9 bg-cyan-300 rounded-tl-full rounded-bl-full"></div>
    </div>
    <div className="absolute top-[-5%] right-[-34%] w-[40%] h-[25%] rounded-full bg-[#0a0e18] opacity-100 blur-[25px] pointer-events-none"></div>

    <div className="absolute left-1/2 -bottom-85 -translate-x-1/2 w-full aspect-square border-50 border-[#2388FF] opacity-80 rounded-full blur-xl pointer-events-none"></div>
    
    {/* ngedit isinya */}
    <div className="absolute top-15 left-0 right-0 w-full px-8">
    <div className="relative w-full"> 
        <div className="w-10 mb-8"> 
          <div className="flex items-center justify-center w-full aspect-square bg-[#3E3E3E] rounded-full border border-white">
            <span className="material-icons text-[2vw] sm:text-[1vw] md:text-lg">arrow_back</span>
          </div>
        </div>

      <h2 className="bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-4xl font-extrabold tracking-tight">Yuk, Lanjut 
        <span className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent text-4xl font-extrabold"> Kelola</span> 
      </h2>
      <h2 className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent text-4xl font-extrabold mt-[-3]">
        Keuanganmu!
      </h2>

      <p className="text-md mt-3 text-gray-300 font-light mb-5 justify">Masuk ke SAKU SEHAT dan lihat perkembangan finansialmu dengan mudah.</p>
      
      <div className="w-full bg-linear-to-tr from-transparent via-gray-400 to-transparent rounded-full p-px mb-5">
        <div className="w-full bg-linear-to-b from-[#090e16] to-[#182133] rounded-full p-1 text-white">
          <div className="flex flex-row items-center w-full">
            <div className="w-1/2">
              <div className="w-full text-center py-2 border border-gray-500 rounded-full font-semibold bg-gray-800 cursor-pointer">
                Login
              </div>
            </div>
            
            <div className="w-1/2">
              <button 
                onClick={onSwitchToRegister} 
                className="w-full text-center py-2 font-semibold text-gray-400 hover:text-white cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
      {success && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">Login berhasil! Mengalihkan...</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400">Username / Email</label>
            <input 
              type="text" 
              name="identifier" 
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Masukkan Username Anda" 
              className="px-4 py-2 rounded-xl border border-gray-400 bg-[#1B1B1B] text-white text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required 
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan Password Anda" 
              className="px-4 py-2 rounded-xl border border-gray-400 bg-[#1B1B1B] text-white text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required 
            />
          </div>
          
          <div className="flex items-center justify-between font-urbanist">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                name="rememberMe"
                className="w-4 h-4 rounded bg-[#1B1B1B] border-gray-400 accent-[#2EC4B6] cursor-pointer transition-all"
              />
              <span>Ingat Saya</span>
            </label>
            
            <a href="#" className="text-sm text-[#2EC4B6] underline font-medium">
              Lupa Password?
            </a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 bg-[#2EC4B6] hover:bg-[#23a89b] text-white font-semibold rounded-full mt-2 text-base shadow transition-colors duration-200 cursor-pointer disabled:bg-gray-400"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}