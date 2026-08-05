'use client';

import { useState } from "react";
import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';

interface TambahTargetNabungProps {
  onSwitchToTargetNabung: () => void;
}

export default function TambahTargetNabung({ 
  onSwitchToTargetNabung 
}: TambahTargetNabungProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedIcon, setSelectedIcon] = useState("target");
  const [namaTarget, setNamaTarget] = useState("");
  const [nominal, setNominal] = useState("");
  const [deadlineTarget, setDeadlineTarget] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      selectedIcon,
      namaTarget,
      nominal,
      deadlineTarget,
    });
    onSwitchToTargetNabung();
  };

  return (
    <div className="relative w-full h-full p-6 py-8 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2.5">
          <button 
            type="button"
            className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer duration-500"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-icons text-2xl select-none">menu</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Catatan Keuangan</h1>
        </div>

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
        <div className="text-lg font-semibold leading-none">Tambah Target Nabung</div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="border border-white/10 rounded-3xl bg-white/5 p-5 flex flex-col gap-5">
          
          <div className="flex flex-col gap-2.5">
            <label className="text-xs text-gray-300 font-semibold">Icon</label>
            <div className="grid grid-cols-6 gap-3">
              {iconsList.map((item) => {
                const isSelected = selectedIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIcon(item.id)}
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
            <label className="text-xs text-gray-300 mb-1.5 block font-semibold">
              Nama Target
            </label>
            <input 
              type="text"
              value={namaTarget}
              onChange={(e) => setNamaTarget(e.target.value)}
              className="border border-white/15 rounded-full w-full text-xs px-4 py-2.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/40 text-white"
              placeholder="Contoh: Laptop Baru"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 mb-1.5 block font-semibold">
              Nominal
            </label>
            <input 
              type="number"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              className="border border-white/15 rounded-full w-full text-xs px-4 py-2.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/40 text-white"
              placeholder="Rp  Contoh: 5.000.000"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 mb-1.5 block font-semibold">
              Deadline Target
            </label>
            <input 
              type="date"
              value={deadlineTarget}
              onChange={(e) => setDeadlineTarget(e.target.value)}
              className="border border-white/15 rounded-full w-full text-xs px-4 py-2.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors text-white cursor-pointer"
            />
          </div>

        </div>

        <button 
          type="submit"
          className="w-full bg-[#2EC4B6] hover:bg-[#28b0a3] p-3 rounded-full text-sm font-extrabold text-center text-[#101828] transition-colors cursor-pointer"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}