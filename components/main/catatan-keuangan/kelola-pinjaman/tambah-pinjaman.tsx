'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';

import Header from "../../header";
import { useRouter } from "next/navigation";


interface TambahPinjamanProps {
  onSwitchToKelolaPinjaman: () => void;
}

export default function TambahPinjaman({ onSwitchToKelolaPinjaman }: TambahPinjamanProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [namaPlatformSelect, setNamaPlatformSelect] = useState("");
  const [namaPlatformCustom, setNamaPlatformCustom] = useState("");
  const [jenisPinjaman, setJenisPinjaman] = useState("");
  const [totalPinjaman, setTotalPinjaman] = useState("");
  const [tenorCicilan, setTenorCicilan] = useState("");
  const [cicilanPerBulan, setCicilanPerBulan] = useState("");
  const [totalBayar, setTotalBayar] = useState("");
  const [tanggalJatuhTempo, setTanggalJatuhTempo] = useState("");
  const [statusPinjaman, setStatusPinjaman] = useState("Aktif");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  

  const platformOptions = [
    { id: "ShopeePayLater", name: "ShopeePayLater" },
    { id: "GoPayLater", name: "GoPayLater" },
    { id: "Kredivo", name: "Kredivo" },
    { id: "Akulaku", name: "Akulaku" },
    { id: "Easycash", name: "Easycash" },
    { id: "Kredit Pintar", name: "Kredit Pintar" },
    { id: "Lainnya", name: "Lainnya (Ketik Manual)" },
  ];

  const jenisOptions = [
    { id: "Pinjaman Online", name: "Pinjaman Online" },
    { id: "Paylater", name: "Paylater" },
    { id: "KTA (Kredit Tanpa Agunan)", name: "KTA (Kredit Tanpa Agunan)" },
    { id: "Kredit Kendaraan", name: "Kredit Kendaraan" },
    { id: "Kredit Rumah (KPR)", name: "Kredit Rumah (KPR)" },
    { id: "Kartu Kredit", name: "Kartu Kredit" },
    { id: "Lainnya", name: "Lainnya" },
  ];

  const tenorOptions = [
    { id: "1", name: "1 Bulan" },
    { id: "3", name: "3 Bulan" },
    { id: "6", name: "6 Bulan" },
    { id: "12", name: "12 Bulan" },
    { id: "24", name: "24 Bulan" },
  ];

  const statusOptions = [
    { id: "Aktif", name: "Aktif / Belum Lunas" },
    { id: "Lunas", name: "Lunas" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const platformFinal = namaPlatformSelect === "Lainnya" ? namaPlatformCustom : namaPlatformSelect;

    if (!platformFinal.trim()) {
      setError("Silakan isi atau pilih Nama Platform.");
      return;
    }
    if (!jenisPinjaman) {
      setError("Silakan pilih Jenis Pinjaman.");
      return;
    }
    if (!totalPinjaman || Number(totalPinjaman) <= 0) {
      setError("Total Pinjaman harus lebih dari 0.");
      return;
    }
    if (!tenorCicilan) {
      setError("Silakan pilih Tenor Cicilan.");
      return;
    }
    if (!tanggalJatuhTempo) {
      setError("Silakan pilih Tanggal Jatuh Tempo.");
      return;
    }

    setLoading(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      const payload = {
        namaPlatform: platformFinal,
        jenisPinjaman,
        totalPinjaman: Number(totalPinjaman),
        tenorCicilan: Number(tenorCicilan),
        cicilanBulanan: Number(cicilanPerBulan) || 0,
        totalYangHarusDibayar: totalBayar ? Number(totalBayar) : Number(totalPinjaman),
        jatuhTempo: tanggalJatuhTempo,
        statusPinjaman,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/pinjaman/tambah-pinjaman`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan data pinjaman.");
      }

      onSwitchToKelolaPinjaman();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full p-6 py-8 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <Header
              title="Catatan Keuangan"
              onOpenSidebar={() => setIsSidebarOpen(true)}
              onProfileClick={() => router.push("/?mode=profile-edit")}
            />

      <div className="flex flex-row gap-4 items-center">
        <button 
          type="button"
          onClick={onSwitchToKelolaPinjaman}
          className="flex items-center justify-center w-8 h-8 bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors shrink-0"
        >
          <span className="material-icons text-lg text-white leading-none">arrow_back</span>
        </button>
        <div className="text-lg lg:text-xl font-semibold leading-none">Tambah Pinjaman</div>
      </div>

      {error && (
        <div className="p-3 text-xs lg:text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="border border-white/10 rounded-3xl bg-white/5 p-5">
          <div className="flex flex-col gap-4">
            
            {/* Nama Platform */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Nama Platform</label>
              <div className="relative">
                <select 
                  value={namaPlatformSelect}
                  onChange={(e) => setNamaPlatformSelect(e.target.value)}
                  className={`appearance-none border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                    namaPlatformSelect === "" ? "text-white/50" : "text-white"
                  }`}
                >
                  <option value="" disabled hidden>Pilih Nama Platform</option>
                  {platformOptions.map((item) => (
                    <option key={item.id} value={item.id} className="bg-[#101828] text-white">
                      {item.name}
                    </option>
                  ))}
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">
                  expand_more
                </span>
              </div>

              {namaPlatformSelect === "Lainnya" && (
                <input 
                  type="text"
                  value={namaPlatformCustom}
                  onChange={(e) => setNamaPlatformCustom(e.target.value)}
                  className="mt-2 border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                  placeholder="Ketikkan nama platform..."
                />
              )}
            </div>

            {/* Jenis Pinjaman */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Jenis Pinjaman</label>
              <div className="relative">
                <select 
                  value={jenisPinjaman}
                  onChange={(e) => setJenisPinjaman(e.target.value)}
                  className={`appearance-none border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                    jenisPinjaman === "" ? "text-white/50" : "text-white"
                  }`}
                >
                  <option value="" disabled hidden>Pilih Jenis Pinjaman</option>
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

            {/* Total Pinjaman */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Total Pinjaman</label>
              <input 
                type="number"
                value={totalPinjaman}
                onChange={(e) => setTotalPinjaman(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Masukkan jumlah total pinjaman (Rp)"
              />
            </div>

            {/* Tenor Cicilan */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Tenor Cicilan</label>
              <div className="relative">
                <select 
                  value={tenorCicilan}
                  onChange={(e) => setTenorCicilan(e.target.value)}
                  className={`appearance-none border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                    tenorCicilan === "" ? "text-white/50" : "text-white"
                  }`}
                >
                  <option value="" disabled hidden>Pilih Tenor Cicilan</option>
                  {tenorOptions.map((item) => (
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

            {/* Cicilan Perbulan */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Cicilan Perbulan</label>
              <input 
                type="number"
                value={cicilanPerBulan}
                onChange={(e) => setCicilanPerBulan(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Masukkan nominal cicilan per bulan"
              />
            </div>

            {/* Total yang Harus Dibayar / Sisa Tagihan */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Total yang Harus Dibayar (Sisa Tagihan)</label>
              <input 
                type="number"
                value={totalBayar}
                onChange={(e) => setTotalBayar(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Biarkan kosong jika sama dengan Total Pinjaman"
              />
            </div>

            {/* Tanggal Jatuh Tempo */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Tanggal Jatuh Tempo</label>
              <input 
                type="date"
                value={tanggalJatuhTempo}
                onChange={(e) => setTanggalJatuhTempo(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors text-white cursor-pointer"
              />
            </div>

            {/* Status Pinjaman */}
            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Status Pinjaman</label>
              <div className="relative">
                <select 
                  value={statusPinjaman}
                  onChange={(e) => setStatusPinjaman(e.target.value)}
                  className="appearance-none border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 text-white"
                >
                  {statusOptions.map((item) => (
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
  );
}