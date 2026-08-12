"use client";

import { useState, useEffect } from "react";
import "material-icons/iconfont/material-icons.css";
import Header from "./header";
import Sidebar from "./sidebar";
import { useRouter } from "next/navigation";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/bottts/svg?seed=sakusehat"; 

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  userData: { username: string; email: string; fotoProfilUrl: string };
  onSave: (newData: any) => void;
}

export default function EditProfile({ isOpen, onClose, onBack, userData: initialUserData, onSave }: EditProfileProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: initialUserData?.username || "",
    email: initialUserData?.email || "",
    fotoProfilUrl: initialUserData?.fotoProfilUrl || "",
  });

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setFormData((prev) => ({
            ...prev,
            username: parsed.username || parsed.name || "",
            email: parsed.email || "",
            fotoProfilUrl: parsed.fotoProfilUrl || "",
          }));
        } catch (e) {
          console.error("Gagal parsing data user dari localStorage", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchProfileSidebar = async () => {
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
              fotoProfilUrl: data.fotoProfilUrl || "",
            });
            localStorage.setItem("user", JSON.stringify(data));
          }
        }
      } catch (error) {
        console.error("Gagal memuat profil sidebar:", error);
      }
    };

    if (isOpen) {
      fetchProfileSidebar();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setImagePreview(compressedBase64);
          // Update juga ke formData agar ikut tersimpan
          setFormData((prev) => ({ ...prev, fotoProfilUrl: compressedBase64 }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = async () => {
    setLoading(true);
    setError("");

    try {
      // Jalankan fungsi onSave yang dikirim dari komponen parent
      await onSave(formData);
    } catch (err: any) {
      console.error("Error tertangkap di frontend:", err);
      setError(err.message || "Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="mb-4 p-2 text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-xl">
            {error}
          </div>
        )}

        <div className="relative w-44 mx-auto mb-4">
            <div className="rounded-full w-44 h-44 flex mx-auto justify-center items-center p-1 border-3 border-[#166f66] bg-[#0b0f19] overflow-hidden">
                <img
                src={
                    imagePreview || (isMounted && formData.fotoProfilUrl)
                    ? imagePreview || formData.fotoProfilUrl
                    : DEFAULT_AVATAR
                }
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                }}
                />
            </div>
            
            <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-1 right-2 w-11 h-11 bg-[#166f66] hover:bg-[#125750] rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all active:scale-95 border-2 border-[#101828]"
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
            <label className="text-xs text-gray-400 font-semibold">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#0b0f19] border border-white/10 rounded-4xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#2EC4B6]"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveClick}
            disabled={loading}
            className="w-full bg-[#2EC4B6] text-sm text-[#101828] font-bold py-3 rounded-3xl mt-4 hover:bg-[#28b0a3] transition-colors cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}