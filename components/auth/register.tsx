"use client";

import { useState } from "react";

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

      // Jalankan fungsi callback dan kirim data email yang sukses didaftarkan
      onRegisterSuccess(formData.email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">Daftar Akun</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Lengkapi data di bawah ini untuk mendaftar</p>
      
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Input Nama Lengkap */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="px-3.5 py-2.5 rounded-lg border border-blue-600 text-sm text-black" required />
        </div>

        {/* Input Username */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} className="px-3.5 py-2.5 rounded-lg border border-blue-600 text-sm text-black" required />
        </div>

        {/* Input Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="px-3.5 py-2.5 rounded-lg border border-blue-600 text-sm text-black" required />
        </div>
        
        {/* Input Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="px-3.5 py-2.5 rounded-lg border border-blue-600 text-sm text-black" required />
        </div>

        {/* Input Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Konfirmasi Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="px-3.5 py-2.5 rounded-lg border border-blue-600 text-sm text-black" required />
        </div>
        
        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400">
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-4">
        Sudah punya akun?{" "}
        <button onClick={onSwitchToLogin} className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer">
          Login di sini
        </button>
      </p>
    </div>
  );
}