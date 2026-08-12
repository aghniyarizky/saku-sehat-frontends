"use client";

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/bottts/svg?seed=sakusehat"; 

interface ProfileAuthProps {
  email: string;
  onNext: (fotoProfilUrl: string) => void;
  onSkip: () => void;
  onSwitchToLogin: () => void;
}

export default function ProfileAuthComponent({ 
  email, 
  onNext, 
  onSkip, 
  onSwitchToLogin 
}: ProfileAuthProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const finalFoto = imagePreview || DEFAULT_AVATAR;
      
      console.log("1. Status imagePreview (apakah ada file yang dipilih):", imagePreview ? "Ada file (Base64)" : "Kosong (Pakai Default Avatar)");
      console.log("2. URL/String foto akhir yang akan dikirim:", finalFoto);

      const token = localStorage.getItem("token"); 

      const payload = {
        fotoProfilUrl: finalFoto,
        onboardingCompleted: true,
        saldoSekarang: 0, 
        sumberPemasukan: "Lainnya"
      };

      console.log("3. Payload JSON lengkap yang di-fetch:", payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      console.log("4. Respons yang diterima dari backend:", data);

      if (!response.ok) {
        throw new Error(data.message || "Gagal menyimpan foto profil.");
      }

      onNext(finalFoto); 
    } catch (err: any) {
      console.error("Error tertangkap di frontend:", err);
      setError(err.message || "Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setImagePreview(DEFAULT_AVATAR);
    onNext(DEFAULT_AVATAR);
  };

  return (
    <div className="w-full h-screen px-8 py-8 flex flex-col justify-between bg-[#101828] relative overflow-hidden">
      <div className="absolute top-6 left-0 right-0 w-full px-8">
        <div className="w-full">
            <div className="w-10 h-10 mb-4"> 
              <div 
                  onClick={onSwitchToLogin}
                  className="flex items-center justify-center w-full h-full bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors"
              >
                  <span className="material-icons text-lg text-white">arrow_back</span>
              </div>
            </div>

            <div className="mt-6">
                <div className="w-full flex justify-between items-center gap-1 mb-2">
                    <div className="w-1/2">
                      <div className="p-1 bg-[#2EC4B6] rounded-full"></div>
                    </div>
                    <div className="w-1/2">
                      <div className="p-1 bg-white rounded-full"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-white text-xs font-medium">Foto Profil</span>
                    <span className="text-white text-xs font-medium text-end">Langkah 1 dari 2</span>
                </div>
            </div>

            <div className="w-full text-start mt-8">
              <h2 className="bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-3xl font-extrabold tracking-tight leading-snug">
                  Tambah{" "}
                  <span className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent">
                  Foto Profil
                  </span>
              </h2>

              <p className="text-md mt-2 text-gray-300 font-semibold leading-relaxed">
                  Tambahin foto profil biar akunmu lebih personal.<br />
                  Bisa dilewati dan diubah kapan aja.
              </p>
            </div>
        </div>
      </div>
      
      <form id="profile-form" onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-center my-auto py-10 mt-56">
        {error && (
          <div className="mb-4 p-2 text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-xl">
            {error}
          </div>
        )}

        <div className="relative group">
          <div className="w-50 h-50 rounded-full border-2 border-dashed border-[#2EC4B6] flex items-center justify-center overflow-hidden bg-[#1B1B1B] shadow-xl">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Preview Profil" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-icons text-6xl text-gray-500 select-none">
                person
              </span>
            )}
          </div>

          <label 
            htmlFor="avatar-upload" 
            className="absolute bottom-1 right-1 w-11 h-11 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all active:scale-95"
          >
            <span className="material-icons text-xl text-[#166f66] select-none">
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
      </form>

      <div className="w-full flex flex-col gap-3 pb-4">
        <button
          type="submit"
          form="profile-form" 
          disabled={loading}
          className="w-full py-3 bg-[#2EC4B6] hover:bg-[#23a89b] text-[#101828] font-bold rounded-full shadow-lg shadow-blue-950/50 transition-all active:scale-[0.98] cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? "Menyimpan..." : "Lanjut"}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full py-3 text-sm text-[#2EC4B6] bg-transparent border border-[#2EC4B6] hover:border-gray-400 font-semibold rounded-full transition-all cursor-pointer"
        >
          Lewati
        </button>
      </div>

    </div>
  );
}