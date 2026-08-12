"use client";

import { useState, useEffect } from "react";
import "material-icons/iconfont/material-icons.css";
import Header from "./header";
import Sidebar from "./sidebar";
import { useRouter } from "next/navigation";

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  userData: { username: string; email: string; fullName: string; fotoProfilUrl: string; sumberPemasukan: string };
  onSave: (newData: any) => void;
}

export default function EditProfile({ isOpen, onClose, onBack, userData: initialUserData, onSave }: EditProfileProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: initialUserData?.username || "",
    email: initialUserData?.email || "",
    fullName: initialUserData?.fullName || "",
    fotoProfilUrl: initialUserData?.fotoProfilUrl || "",
    sumberPemasukan: initialUserData?.sumberPemasukan || "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setFormData({
              username: data.username || "",
              email: data.email || "",
              fullName: data.fullName || "",
              fotoProfilUrl: data.fotoProfilUrl || "",
              sumberPemasukan: data.sumberPemasukan || "",
            });
          }
        }
      } catch (err: any) {
        console.error("Gagal memuat profil:", err);
      }
    };

    if (isOpen) {
      setError("");
      fetchProfileData();
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran foto terlalu besar. Harap pilih gambar di bawah 2MB.");
        return;
      }
      setError("");

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          fotoProfilUrl: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = async () => {
    setLoading(true);
    setError("");
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          fullName: formData.fullName,
          fotoProfilUrl: formData.fotoProfilUrl,
          sumberPemasukan: formData.sumberPemasukan,
        }),
      });

      const contentType = res.headers.get("content-type");
      let result;
      
      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        throw new Error("Sesi Anda mungkin sudah habis atau terjadi gangguan pada server. Silakan login ulang.");
      }

      if (!res.ok) {
        throw new Error(result.message || result.error || "Gagal memperbarui profil.");
      }

      const updatedData = {
        username: result.data?.user?.username || formData.username,
        fullName: result.data?.user?.fullName || formData.fullName,
        email: formData.email,
        fotoProfilUrl: result.data?.fotoProfilUrl || formData.fotoProfilUrl,
        sumberPemasukan: result.data?.sumberPemasukan || formData.sumberPemasukan,
      };
      
      onSave(updatedData);
      onClose();
    } catch (err: any) {
      console.error("Gagal menyimpan perubahan profil:", err);
      setError(err.message || "Terjadi kesalahan saat menyimpan data. Periksa kembali koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full min-h-screen bg-[#101828] text-white p-6 flex flex-col gap-6">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
      <div className="w-full flex flex-row items-center justify-between">
        <Header
          title="Dashboard"
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onProfileClick={() => router.push("/?mode=profile-edit")}
        />
      </div>

      <div className="w-full max-w-md mx-auto bg-[#101828] border border-white/10 p-6 rounded-3xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center cursor-pointer">
              <span className="material-icons text-xl">arrow_back</span>
            </button>
            <h2 className="text-lg font-bold text-white">Edit Profil</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <span className="material-icons">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-start gap-2">
            <span className="material-icons text-sm shrink-0 mt-0.5">error_outline</span>
            <span>{error}</span>
          </div>
        )}

        <div className="relative">
            <div className="rounded-full w-44 h-44 flex mx-auto justify-center items-center p-2 border-3 border-[#166f66] mb-3 overflow-hidden">
                <img
                src={
                    isMounted && formData.fotoProfilUrl
                    ? formData.fotoProfilUrl
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-avatar.png";
                }}
                />
            </div>
            
            <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-1 right-25 w-11 h-11 bg-[#166f66] hover:bg-[#125750]  rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all active:scale-95"
            >
                <span className="material-icons text-xl text-white select-none">
                photo_camera
                </span>
            </label>

            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="hidden" 
            />
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-semibold">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="bg-[#0b0f19] border border-white/10 rounded-4xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#2EC4B6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-semibold">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="bg-[#0b0f19] border border-white/10 rounded-4xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#2EC4B6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-semibold">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="bg-[#0b0f19] border border-white/10 rounded-4xl px-4 py-2 text-sm text-white/50 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-semibold">Sumber Pemasukan</label>
            <input
              type="text"
              value={formData.sumberPemasukan}
              onChange={(e) => setFormData({ ...formData, sumberPemasukan: e.target.value })}
              className="bg-[#0b0f19] border border-white/10 rounded-4xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#2EC4B6]"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveClick}
            disabled={loading}
            className="w-full bg-[#2EC4B6] text-sm text-[#101828] font-bold py-3 rounded-3xl mt-4 hover:bg-[#28b0a3] transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}