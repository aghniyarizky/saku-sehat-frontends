'use client';

import { useState } from "react";
import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';

import { useRouter } from "next/navigation";
import Header from "../../header";

interface TambahTargetNabungProps {
  onSwitchToTargetNabung: () => void;
}

export default function TambahTargetNabung({ 
  onSwitchToTargetNabung 
}: TambahTargetNabungProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedIcon, setSelectedIcon] = useState("🎯");
  const [namaTarget, setNamaTarget] = useState("");
  const [nominal, setNominal] = useState("");
  const [deadlineTarget, setDeadlineTarget] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  

  const iconsList = [
    { id: "target", label: "🎯" },
    { id: "laptop", label: "💻" },
    { id: "plane", label: "✈️" },
    { id: "house", label: "🏠" },
    { id: "car", label: "🚗" },
    { id: "smartphone", label: "📱" },
    { id: "ring", label: "💍" },
    { id: "game", label: "🎮" },
    { id: "guitar", label: "🎸" },
    { id: "camera", label: "📷" },
    { id: "gift", label: "🎁" },
    { id: "graduation", label: "🎓" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!namaTarget.trim()) {
      setError("Silakan isi Nama Target.");
      return;
    }
    if (!nominal || Number(nominal) <= 0) {
      setError("Target Nominal harus lebih dari 0.");
      return;
    }
    if (!deadlineTarget) {
      setError("Silakan pilih Deadline Target.");
      return;
    }
    if (new Date(deadlineTarget) <= new Date()) {
      setError("Deadline Target harus di masa mendatang.");
      return;
    }

    setLoading(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const payload = {
        icon: selectedIcon,
        namaTarget,
        targetNominal: Number(nominal),
        deadlineTarget,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/target-tabung/tambah-target`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat target tabung baru.");
      }

      onSwitchToTargetNabung();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan target tabung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full p-6 py-10 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="lg:max-w-6xl lg:mx-auto lg:w-full flex flex-col gap-4">

      <div className="w-full flex flex-row items-center justify-between">
        <Header
                title="Catatan Keuangan"
                onOpenSidebar={() => setIsSidebarOpen(true)}
                 onProfileClick={() => router.push("/?mode=profile-edit")}
              />

        <div className="flex flex-row items-center gap-3">
          <Link 
            href="/?mode=notifikasi" 
            className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-icons text-xl select-none">notifications</span>
          </Link>
          <Link 
            href="/?mode=profil" 
            className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-icons text-xl select-none">account_circle</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center">
        <button 
          type="button"
          onClick={onSwitchToTargetNabung}
          className="flex items-center justify-center w-8 h-8 bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors shrink-0"
        >
          <span className="material-icons text-lg text-white leading-none">arrow_back</span>
        </button>
        <div className="text-lg lg:text-xl font-semibold leading-none">Tambah Target Nabung</div>
      </div>

      {error && (
        <div className="p-3 text-xs lg:text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="border border-white/10 rounded-3xl bg-white/5 p-5 flex flex-col gap-5">
          
          {/* Icon Selector */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs lg:text-sm text-gray-300 font-semibold">Icon</label>
            <div className="grid grid-cols-6 gap-3">
              {iconsList.map((item) => {
                const isSelected = selectedIcon === item.label;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIcon(item.label)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-white/10 border-2 border-[#2EC4B6]" 
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nama Target */}
          <div>
            <label className="text-xs lg:text-sm text-gray-300 mb-1.5 block font-semibold">
              Nama Target
            </label>
            <input 
              type="text"
              value={namaTarget}
              onChange={(e) => setNamaTarget(e.target.value)}
              className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-4 py-2.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/40 text-white"
              placeholder="Contoh: Laptop Baru"
            />
          </div>

          {/* Nominal */}
          <div>
            <label className="text-xs lg:text-sm text-gray-300 mb-1.5 block font-semibold">
              Target Nominal (Rp)
            </label>
            <input 
              type="number"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-4 py-2.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/40 text-white"
              placeholder="Contoh: 5000000"
            />
          </div>

          {/* Deadline Target */}
          <div>
            <label className="text-xs lg:text-sm text-gray-300 mb-1.5 block font-semibold">
              Deadline Target
            </label>
            <input 
              type="date"
              value={deadlineTarget}
              onChange={(e) => setDeadlineTarget(e.target.value)}
              className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-4 py-2.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors text-white cursor-pointer"
            />
          </div>

        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-[#2EC4B6] hover:bg-[#28b0a3] disabled:bg-[#2EC4B6]/50 p-3 rounded-full text-sm lg:text-base font-extrabold text-center text-[#101828] transition-colors cursor-pointer"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
    </div>
  );
}