'use client';

import { useState } from "react";
import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';
import NavCatatan from '../nav-catatan'; 
import { useTransition } from 'react';

interface TargetNabungProps {
  onSwitchToAddTarget?: () => void;
  onSwitchToEditTarget?: (id: number | string) => void;
}

export default function TargetNabung({ 
  onSwitchToAddTarget, 
  onSwitchToEditTarget 
}: TargetNabungProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const listTarget = [
    {
      id: 1,
      title: "Nabung Laptop Baru",
      sisaHari: "67 Hari Tersisa",
      terkumpul: "Rp1.800.000",
      total: "Rp 3.000.000",
      persen: 60,
      icon: "💻",
    },
    {
      id: 2,
      title: "Kado Ulang Tahun",
      sisaHari: "100 Hari Tersisa",
      terkumpul: "Rp150.000",
      total: "Rp 300.000",
      persen: 50,
      icon: "🎁",
    },
  ];

  return (
    <div className="relative w-full h-full p-6 py-8 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Header Utama */}
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

      <NavCatatan />

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full">
              <span className="material-icons text-[#2EC4B6]">wallet</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">Rp150.000</div>
            <div className="text-sm text-white/40 font-semibold pt-2">Total menabung</div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full">
              <span className="material-icons text-[#E74C3C]">radio_button_checked</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">Rp30.000</div>
            <div className="text-sm text-white/40 font-semibold pt-2">Total target</div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2 w-full pt-1">
        <button
          type="button"
          className="px-3.5 py-2 rounded-full duration-200 flex flex-row items-center gap-1.5 hover:text-white border shrink-0 border-teal-500/30 text-teal-300 text-xs font-semibold hover:bg-teal-500/20 transition-colors cursor-pointer"
        >
          <span 
            className="material-icons select-none leading-none"
            style={{ fontSize: '14px' }}
          >
            auto_awesome
          </span>
          <span>Smart Assistant</span>
        </button>

        <button
          type="button"
          onClick={onSwitchToAddTarget}
          className="px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10 shrink-0"
        >
          <span 
            className="material-icons select-none leading-none text-[#0A2E2A]"
            style={{ fontSize: '14px' }}
          >
            add
          </span>
          <span>Tambah</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {listTarget.map((item) => (
          <div 
            key={item.id}
            className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 flex flex-col gap-3 relative"
          >
            <div className="flex flex-row items-center justify-between">
              <div className="text-2xl select-none">{item.icon}</div>
              <div className="flex flex-row items-center gap-2 z-10">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-[#2EC4B6] text-xs font-bold select-none">
                  {item.persen}%
                </span>
                
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSwitchToEditTarget) {
                      onSwitchToEditTarget(item.id);
                    }
                  }}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10 active:scale-95 flex items-center justify-center"
                  title="Edit Target"
                >
                  <span className="material-icons text-lg leading-none select-none">edit</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <h3 className="text-base font-bold tracking-tight">{item.title}</h3>
              <span className="text-xs text-white/40 font-medium">{item.sisaHari}</span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#2EC4B6] h-full rounded-full transition-all duration-300"
                style={{ width: `${item.persen}%` }}
              />
            </div>

            <div className="flex flex-row items-center justify-between text-xs font-semibold">
              <span className="text-[#2EC4B6]">{item.terkumpul}</span>
              <span className="text-white/40">/ {item.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}