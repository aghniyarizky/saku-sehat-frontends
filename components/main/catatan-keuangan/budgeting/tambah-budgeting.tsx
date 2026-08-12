'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import { useRouter } from "next/navigation";
import Sidebar from '../../sidebar';

import Header from "../../header";

interface TambahBudgetingProps {
  onSwitchToBudgeting: () => void;
}

export default function TambahBudgeting({ onSwitchToBudgeting }: TambahBudgetingProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [kategoriSelect, setKategoriSelect] = useState("");
  const [kategoriCustom, setKategoriCustom] = useState("");
  const [batasBulan, setBatasBulan] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  

  const jenisOptions = [
    { id: "Makanan", name: "Makanan & Minuman" },
    { id: "Transportasi", name: "Transportasi / Bensin" },
    { id: "Uang Saku", name: "Uang Saku" },
    { id: "Pendidikan", name: "Pendidikan / Kuliah" },
    { id: "Belanja", name: "Belanja / kebutuhan" },
    { id: "Hiburan", name: "Hiburan / Game" },
    { id: "Tagihan", name: "Tagihan / Listrik / Air" },
    { id: "Lainnya", name: "Lainnya (Ketik Manual)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const kategoriFinal = kategoriSelect === "Lainnya" ? kategoriCustom : kategoriSelect;

    if (!kategoriFinal.trim()) {
      setError("Silakan pilih atau isi Kategori Budget.");
      return;
    }
    if (!batasBulan || Number(batasBulan) <= 0) {
      setError("Batas per Bulan harus lebih besar dari 0.");
      return;
    }
    if (!tanggalMulai || !tanggalSelesai) {
      setError("Tanggal Mulai dan Tanggal Selesai wajib diisi.");
      return;
    }
    if (new Date(tanggalSelesai) <= new Date(tanggalMulai)) {
      setError("Tanggal Selesai harus setelah Tanggal Mulai.");
      return;
    }

    setLoading(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const payload = {
        Kategori_Budget: kategoriFinal,
        Batas_PerBulan: Number(batasBulan),
        Tanggal_Mulai: tanggalMulai,
        Tanggal_Selesai: tanggalSelesai,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/budgeting/tambah-budget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat budget baru.");
      }

      onSwitchToBudgeting();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan budget.");
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
        <div className="text-lg lg:text-xl font-semibold leading-none">Tambah Budget</div>
      </div>

      {error && (
        <div className="p-3 text-xs lg:text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="border border-white/10 rounded-3xl bg-white/5 p-5">
          <div className="flex flex-col gap-4">
            
            {/* Kategori Budget */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Kategori Budget</label>
              <div className="relative">
                <select 
                  value={kategoriSelect}
                  onChange={(e) => setKategoriSelect(e.target.value)}
                  className={`appearance-none border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                    kategoriSelect === "" ? "text-white/50" : "text-white"
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

              {kategoriSelect === "Lainnya" && (
                <input 
                  type="text"
                  value={kategoriCustom}
                  onChange={(e) => setKategoriCustom(e.target.value)}
                  className="mt-2 border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                  placeholder="Ketikkan nama kategori..."
                />
              )}
            </div>

            {/* Batas per Bulan */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Batas per Bulan (Rp)</label>
              <input 
                type="number"
                value={batasBulan}
                onChange={(e) => setBatasBulan(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Contoh: 500000"
              />
            </div>

            {/* Tanggal Mulai */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Tanggal Mulai</label>
              <input 
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors text-white cursor-pointer"
              />
            </div>

            {/* Tanggal Selesai */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Tanggal Selesai</label>
              <input 
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors text-white cursor-pointer"
              />
            </div>

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