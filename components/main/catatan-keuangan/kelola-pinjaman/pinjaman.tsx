'use client';

import { useState } from "react";
import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';
import NavCatatan from '../nav-catatan';

interface PinjamanProps {
  onSwitchToKalkulator?: () => void;
  onSwitchToAddPinjaman?: () => void;
  onSwitchToEdit?: (id: number | string) => void;
}

const pinjaman = [
  { 
    id: "paylater", 
    name: "Shopee PayLater", 
    jenis: "Bunga Tetap", 
    bunga: "5%/ Bulan",
    awal: 15000000,
    cicilan: 200000,
    sisa: 12600000,
    tempo: "30 Jun 2026", 
    progress: '16.0%'
  },
  { 
    id: "pinjol", 
    name: "EasyCash", 
    jenis: "Bunga Tetap", 
    bunga: "5%/ Bulan",
    awal: 3000000,
    cicilan: 300000,
    sisa: 2520000,
    tempo: "30 Jun 2026", 
    progress: '16.0%'
  },
];

export default function Pinjaman({ onSwitchToKalkulator, onSwitchToAddPinjaman, onSwitchToEdit }: PinjamanProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

      <NavCatatan />

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full">
              <span className="material-icons text-[#E74C3C]">wallet</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">Rp1.800.000</div>
            <div className="text-sm text-white/40 font-semibold pt-2">Belum dibayar</div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#05DF7226]/75 rounded-full">
              <span className="material-icons text-[#05DF72]">check</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">Rp1.500.000</div>
            <div className="text-sm text-white/40 font-semibold pt-2">Sudah dibayar</div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full col-span-2 sm:col-span-1">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#FFB70018] rounded-full">
              <span className="material-icons text-[#FFB700]">schedule</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">Rp500.000</div>
            <div className="text-sm text-white/40 font-semibold pt-2">Kewajiban Perbulan</div>
          </div>
        </div>
      </div>

      <div className="p-1 flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="text-lg font-semibold mb-2">Pinjaman Saya ({pinjaman.length})</div>

          <div className="flex flex-row items-center gap-2 w-fit">
            {onSwitchToKalkulator ? (
              <button
                type="button"
                onClick={onSwitchToKalkulator}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-gray-800 shrink-0"
              >
                <span className="material-icons select-none leading-none text-[#2EC4B6] text-[13px]">
                  calculate
                </span>
                <span>Kalkulator Bunga</span>
              </button>
            ) : (
              <Link
                href="/?mode=kalkulator"
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-gray-800 shrink-0"
              >
                <span className="material-icons select-none leading-none text-[#2EC4B6] text-[13px]">
                  calculate
                </span>
                <span>Kalkulator Bunga</span>
              </Link>
            )}

            {onSwitchToAddPinjaman ? (
              <button
                type="button"
                onClick={onSwitchToAddPinjaman}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10 shrink-0"
              >
                <span className="material-icons select-none leading-none text-[#0A2E2A] text-[13px]">
                  add
                </span>
                <span>Tambah</span>
              </button>
            ) : (
              <Link
                href="/?mode=tambahpinjaman"
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10 shrink-0"
              >
                <span className="material-icons select-none leading-none text-[#0A2E2A] text-[13px]">
                  add
                </span>
                <span>Tambah</span>
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-1">
          {pinjaman.map((item) => (
            <div 
              key={item.id} 
              className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 flex flex-col gap-3"
            >
              <div className="flex flex-row pb-2">
                <div className="flex flex-row items-start justify-between w-full">
                  <div className="flex flex-col">
                    <div className="font-bold text-base mb-1">{item.name}</div>
                    <div className="flex flex-row gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#2EC4B61F] border border-[#2EC4B640] text-[#2EC4B6] font-medium">
                        {item.jenis}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#FFB70018] border border-[#FFB700]/50 font-medium text-[#FFB700]">
                        {item.bunga}
                      </span>
                    </div>
                  </div>

                  <Link 
                    href={`/?mode=detailpinjaman&id=${item.id}`}
                    className="flex items-center text-sm font-semibold text-white/50 hover:text-white cursor-pointer ml-auto gap-1"
                  >
                    <button 
                            type="button"
                            onClick={() => onSwitchToEdit?.(item.id)}
                            className="text-white/40 hover:text-white transition-colors cursor-pointer p-1"
                          >
                            <span className="material-icons text-lg">edit</span>
                          </button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs px-4">
                <div className="p-2 px-3 bg-white/5 rounded-2xl">
                  <span className="text-white/40 block font-medium">Pinjaman Awal</span>
                  <span className="font-bold text-white text-sm">
                    Rp{item.awal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-2 px-3 bg-white/5 rounded-2xl">
                  <span className="text-white/40 block font-medium">Sisa Tagihan</span>
                  <span className="font-bold text-sm text-[#FF6467]">
                    Rp{item.sisa.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-2 px-3 bg-white/5 rounded-2xl">
                  <span className="text-white/40 block font-medium">Cicilan Bulanan</span>
                  <span className="font-bold text-white text-sm">
                    Rp{item.cicilan.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-2 px-3 bg-white/5 rounded-2xl">
                  <span className="text-white/40 block font-medium">Jatuh Tempo</span>
                  <span className="font-bold text-white text-sm">{item.tempo}</span>
                </div>
              </div>

              <div className="px-4 pt-1 flex flex-col gap-1.5 mb-2">
                <div className="flex flex-row items-center justify-between text-xs font-medium">
                  <span className="text-white/40">Progress Pembayaran</span>
                  <span className="text-[#2EC4B6] font-bold">{item.progress}</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#2EC4B6] h-full rounded-full transition-all duration-300"
                    style={{ width: item.progress }}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}