'use client';

import { useState } from "react";
import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';
import NavCatatan from '../nav-catatan';

interface BudgetingProps {
  onSwitchToAddBudget?: () => void;
  onSwitchToEditBudget?: (id: number | string) => void;
}

const budgetList = [
  {
    id: "makanan",
    name: "Makanan",
    icon: "🍜",
    bulan: "Juli 2026",
    status: "Batas Aman",
    budget: 500000,
    terpakai: 200000,
    persentase: 40,
    sisa: 300000,
    sisaHari: 8,
  },
];

export default function Budgeting({ onSwitchToAddBudget, onSwitchToEditBudget }: BudgetingProps) {
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
            <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full">
              <span className="material-icons text-[#2EC4B6]">radio_button_checked</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">Rp1.800.000</div>
            <div className="text-sm text-white/40 font-semibold pt-2">Total budget</div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full">
              <span className="material-icons text-[#E74C3C]">trending_down</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">Rp1.000.000</div>
            <div className="text-sm text-white/40 font-semibold pt-2">Pengeluaran</div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full col-span-2 sm:col-span-1">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full">
              <span className="material-icons text-[#2EC4B6]">wallet</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">Rp500.000</div>
            <div className="text-sm text-white/40 font-semibold pt-2">Sisa budget</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <div className="text-lg font-bold">Budget Saya ({budgetList.length})</div>

          {onSwitchToAddBudget ? (
            <button
              type="button"
              onClick={onSwitchToAddBudget}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10"
            >
              <span className="material-icons select-none leading-none text-[#0A2E2A] text-[15px]">
                add
              </span>
              <span>Tambah</span>
            </button>
          ) : (
            <Link
              href="/?mode=tambahbudget"
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10"
            >
              <span className="material-icons select-none leading-none text-[#0A2E2A] text-[15px]">
                add
              </span>
              <span>Tambah</span>
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {budgetList.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#121B2B] border border-gray-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg"
            >
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A2638] flex items-center justify-center text-2xl border border-gray-800">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-base text-white">{item.name}</span>
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <span className="material-icons text-xs select-none">calendar_today</span>
                      {item.bulan}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-[#05DF72]/15 border border-[#05DF72]/30 text-[#05DF72] font-medium">
                    {item.status}
                  </span>
                  <button 
                    type="button"
                    onClick={() => onSwitchToEditBudget?.(item.id)}
                    className="text-white/40 hover:text-white transition-colors cursor-pointer p-1"
                  >
                    <span className="material-icons text-lg">edit</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-[#1A2638]/60 rounded-2xl flex flex-col justify-center border border-gray-800/60">
                  <span className="text-xs text-white/40 font-medium mb-1">Budget</span>
                  <span className="font-bold text-white text-base">
                    Rp{item.budget.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[11px] text-white/30 font-medium">/ bulan</span>
                </div>

                <div className="p-3 bg-[#1A2638]/60 rounded-2xl flex flex-col justify-center border border-gray-800/60">
                  <span className="text-xs text-white/40 font-medium mb-1">Terpakai</span>
                  <span className="font-bold text-[#2EC4B6] text-base">
                    Rp{item.terpakai.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[11px] text-[#2EC4B6]/80 font-medium">{item.persentase}%</span>
                </div>

                <div className="p-3 bg-[#1A2638]/60 rounded-2xl flex flex-col justify-center border border-gray-800/60 col-span-2">
                  <span className="text-xs text-white/40 font-medium mb-1">Tersisa</span>
                  <span className="font-bold text-[#20E070] text-lg">
                    Rp{item.sisa.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[11px] text-[#20E070] font-medium">{item.sisaHari} hari lagi</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <span className="text-xs text-white/40 font-medium">
                  {item.persentase}% budget terpakai
                </span>
                <div className="w-full bg-[#1A2638] h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#2EC4B6] h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.persentase}%` }}
                  />
                </div>
                <div className="flex flex-row justify-between text-[11px] text-white/30 font-medium">
                  <span>Rp0</span>
                  <span>Rp{item.budget.toLocaleString('id-ID')}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}