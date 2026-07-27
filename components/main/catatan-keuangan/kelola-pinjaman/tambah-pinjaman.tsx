'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';

interface TambahPinjamanProps {
  onSwitchToKelolaPinjaman: () => void;
}

export default function TambahPinjaman({ onSwitchToKelolaPinjaman }: TambahPinjamanProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [namaPlatform, setNamaPlatform] = useState("");
  const [jenisPinjaman, setJenisPinjaman] = useState("");
  const [totalPinjaman, setTotalPinjaman] = useState("");
  const [tenorCicilan, setTenorCicilan] = useState("");
  const [cicilanPerBulan, setCicilanPerBulan] = useState("");
  const [totalBayar, setTotalBayar] = useState("");
  const [tanggalJatuhTempo, setTanggalJatuhTempo] = useState("");
  const [statusPinjaman, setStatusPinjaman] = useState("");

  const platformOptions = [
    { id: "spaylater", name: "ShopeePayLater" },
    { id: "gopaylater", name: "GoPayLater" },
    { id: "kredivo", name: "Kredivo" },
    { id: "akulaku", name: "Akulaku" },
    { id: "bank", name: "Bank / Personal" },
  ];

  const jenisOptions = [
    { id: "pribadi", name: "Pinjaman Pribadi" },
    { id: "paylater", name: "Paylater / Cicilan Barang" },
    { id: "pendidikan", name: "Pendidikan" },
  ];

  const tenorOptions = [
    { id: "1", name: "1 Bulan" },
    { id: "3", name: "3 Bulan" },
    { id: "6", name: "6 Bulan" },
    { id: "12", name: "12 Bulan" },
  ];

  const statusOptions = [
    { id: "belum_lunas", name: "Belum Lunas" },
    { id: "lunas", name: "Lunas" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      namaPlatform,
      jenisPinjaman,
      totalPinjaman,
      tenorCicilan,
      cicilanPerBulan,
      totalBayar,
      tanggalJatuhTempo,
      statusPinjaman,
    });
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
            className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-icons text-2xl select-none">menu</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Catatan Keuangan</h1>
        </div>
      
        <div className="flex flex-row items-center gap-3">
          <button type="button" className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span className="material-icons text-xl select-none">notifications</span>
          </button>
          <button type="button" className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span className="material-icons text-xl select-none">account_circle</span>
          </button>
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center">
        <button 
          type="button"
          onClick={onSwitchToKelolaPinjaman}
          className="flex items-center justify-center w-8 h-8 bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors shrink-0"
        >
          <span className="material-icons text-lg text-white leading-none">arrow_back</span>
        </button>
        <div className="text-lg font-semibold leading-none">Tambah Pinjaman</div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="border border-white/10 rounded-3xl bg-white/5 p-5">
          <div className="flex flex-col gap-4">
            
            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Nama Platform</label>
              <div className="relative">
                <select 
                  value={namaPlatform}
                  onChange={(e) => setNamaPlatform(e.target.value)}
                  className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                    namaPlatform === "" ? "text-white/50" : "text-white"
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
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Jenis Pinjaman</label>
              <div className="relative">
                <select 
                  value={jenisPinjaman}
                  onChange={(e) => setJenisPinjaman(e.target.value)}
                  className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
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

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Total Pinjaman</label>
              <input 
                type="number"
                value={totalPinjaman}
                onChange={(e) => setTotalPinjaman(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Masukkan jumlah total pinjaman (Rp)"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Tenor Cicilan</label>
              <div className="relative">
                <select 
                  value={tenorCicilan}
                  onChange={(e) => setTenorCicilan(e.target.value)}
                  className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
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

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Cicilan Perbulan</label>
              <input 
                type="number"
                value={cicilanPerBulan}
                onChange={(e) => setCicilanPerBulan(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Masukkan nominal cicilan per bulan"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Total yang Harus Dibayar</label>
              <input 
                type="number"
                value={totalBayar}
                onChange={(e) => setTotalBayar(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Masukkan total nominal yang harus dibayar"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Tanggal Jatuh Tempo</label>
              <input 
                type="date"
                value={tanggalJatuhTempo}
                onChange={(e) => setTanggalJatuhTempo(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors text-white cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Status Pinjaman</label>
              <div className="relative">
                <select 
                  value={statusPinjaman}
                  onChange={(e) => setStatusPinjaman(e.target.value)}
                  className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                    statusPinjaman === "" ? "text-white/50" : "text-white"
                  }`}
                >
                  <option value="" disabled hidden>Pilih Status Pinjaman</option>
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
          className="w-full bg-[#2EC4B6] hover:bg-[#28b0a3] p-3 rounded-full text-sm font-extrabold text-center text-[#101828] transition-colors cursor-pointer"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}