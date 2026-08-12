'use client';

import { useState, useEffect } from "react";
import 'material-icons/iconfont/material-icons.css';
import { useRouter } from "next/navigation";
import Sidebar from '../../../sidebar';

import Header from "../../../header";

interface EditBudgetingProps {
  budgetingId: string | number | null;
  onSwitchToBudgeting: () => void;
}

export default function EditBudgeting({ budgetingId, onSwitchToBudgeting }: EditBudgetingProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [kategoriBudget, setKategoriBudget] = useState("");
  const [batasBulan, setBatasBulan] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const router = useRouter();
  

  const jenisOptions = [
    { id: "uangsaku", name: "Uang Saku" },
    { id: "pendidikan", name: "Pendidikan" },
  ];

  const listBudgeting = [
    {
      id: 1,
      kategori: "uangsaku",
      batas: "3000000",
      mulai: "2026-08-01",
      selesai: "2026-08-31",
    },
    {
      id: 2,
      kategori: "pendidikan",
      batas: "1500000",
      mulai: "2026-08-01",
      selesai: "2026-08-31",
    },
  ];

  useEffect(() => {
    if (budgetingId) {
      const foundItem = listBudgeting.find(
        (item) => String(item.id) === String(budgetingId)
      );

      if (foundItem) {
        setKategoriBudget(foundItem.kategori);
        setBatasBulan(foundItem.batas);
        setTanggalMulai(foundItem.mulai);
        setTanggalSelesai(foundItem.selesai);
      }
    }
  }, [budgetingId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update Budgeting:", {
      budgetingId,
      kategoriBudget,
      batasBulan,
      tanggalMulai,
      tanggalSelesai,
    });
  };

    const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus pinjaman ini?")) {
      console.log("Menghapus Pinjaman ID:", budgetingId);

      if (onSwitchToBudgeting) {
        onSwitchToBudgeting();
      }
    }
  };

  return (
    <div className="relative w-full h-full p-6 py-10 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="lg:max-w-6xl lg:mx-auto lg:w-full flex flex-col gap-4">
      
      <Header
              title="Catatan Keuangan"
              onOpenSidebar={() => setIsSidebarOpen(true)}
              onProfileClick={() => router.push("/?mode=profile-edit")}
            />

      <div className="flex flex-row gap-4 items-center">
        <button 
          type="button"
          onClick={onSwitchToBudgeting}
          className="flex items-center justify-center w-8 h-8 bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors shrink-0"
        >
          <span className="material-icons text-lg text-white leading-none">arrow_back</span>
        </button>
        <div className="text-lg font-semibold leading-none">Edit Budget</div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="border border-white/10 rounded-3xl bg-white/5 p-5">
          <div className="flex flex-col gap-4">
            
            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Kategori Budget</label>
              <div className="relative">
                <select 
                  value={kategoriBudget}
                  onChange={(e) => setKategoriBudget(e.target.value)}
                  className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                    kategoriBudget === "" ? "text-white/50" : "text-white"
                  }`}
                >
                  <option value="" disabled hidden>Pilih Kategori Budget</option>
                  {jenisOptions.map((item) => (
                    <option key={item.id} value={item.id} className="bg-[#101828] text-white">
                      {item.name}
                    </option>
                  ))}
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">
                  expand_more
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Batas per Bulan</label>
              <input 
                type="number"
                value={batasBulan}
                onChange={(e) => setBatasBulan(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Rp  Contoh: 3000000"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Tanggal Mulai</label>
              <input 
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors text-white cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Tanggal Selesai</label>
              <input 
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors text-white cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-1">
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#2EC4B6] text-[#0A2E2A] text-sm font-bold hover:bg-[#28b3a6] transition-colors cursor-pointer shadow-md"
          >
            Simpan
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-full py-3.5 rounded-full bg-[#E74C3C] text-white text-sm font-bold hover:bg-[#d63b2b] transition-colors cursor-pointer shadow-md"
          >
            Hapus Transaksi
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}