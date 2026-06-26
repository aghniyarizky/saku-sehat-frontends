"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
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
          identifier: formData.identifier, // Sudah sinkron dengan BE
          password: formData.password,     // Sudah sinkron dengan BE
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

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans p-5">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">Selamat Datang</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Silakan masuk ke akun Anda</p>
        
        {/* Notifikasi Status Error / Sukses */}
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
        {success && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">Login berhasil!</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Username / Email</label>
            <input 
              type="text" 
              name="identifier" 
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Username atau nama@email.com" 
              className="px-3.5 py-2.5 rounded-lg border border-blue-600 bg-white text-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required 
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              className="px-3.5 py-2.5 rounded-lg border border-blue-600 bg-white text-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg mt-2 text-base shadow transition-colors duration-200 cursor-pointer disabled:bg-gray-400"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}