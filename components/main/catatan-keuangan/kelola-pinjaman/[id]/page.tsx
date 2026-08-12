'use client';

import { useState, useEffect } from 'react';
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../../sidebar';

import { useRouter } from "next/navigation";
import Header from "../../../header";

interface EditPinjamanProps {
  pinjamanId: string | number | null;
  onSwitchToTransaction?: () => void;
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
    tempo: "2026-06-30", 
    tenor: "12 Bulan",
    status: "Belum Lunas",
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
    tempo: "2026-06-30", 
    tenor: "6 Bulan",
    status: "Belum Lunas",
    progress: '16.0%'
  },
];

const platformOptions = [
  { id: "Shopee PayLater", name: "Shopee PayLater" },
  { id: "EasyCash", name: "EasyCash" },
  { id: "Gopay Later", name: "Gopay Later" },
  { id: "Kredivo", name: "Kredivo" },
];

const jenisOptions = [
  { id: "Bunga Tetap", name: "Bunga Tetap" },
  { id: "Bunga Anuitas", name: "Bunga Anuitas" },
  { id: "Bunga Efektif", name: "Bunga Efektif" },
];

const tenorOptions = [
  { id: "1 Bulan", name: "1 Bulan" },
  { id: "3 Bulan", name: "3 Bulan" },
  { id: "6 Bulan", name: "6 Bulan" },
  { id: "12 Bulan", name: "12 Bulan" },
  { id: "24 Bulan", name: "24 Bulan" },
];

const statusOptions = [
  { id: "Belum Lunas", name: "Belum Lunas" },
  { id: "Lunas", name: "Lunas" },
  { id: "Terlambat", name: "Terlambat" },
];

export default function EditPinjaman({ pinjamanId, onSwitchToTransaction }: EditPinjamanProps) {
const [namaPlatform, setNamaPlatform] = useState("");
  const [jenisPinjaman, setJenisPinjaman] = useState("");
  const [totalPinjaman, setTotalPinjaman] = useState("");
  const [tenorCicilan, setTenorCicilan] = useState("");
  const [cicilanPerBulan, setCicilanPerBulan] = useState("");
  const [totalBayar, setTotalBayar] = useState("");
  const [tanggalJatuhTempo, setTanggalJatuhTempo] = useState("");
  const [statusPinjaman, setStatusPinjaman] = useState("");

  const router = useRouter();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (pinjamanId) {
      const foundItem = pinjaman.find(
        (item) => String(item.id) === String(pinjamanId)
      );

      if (foundItem) {
        setNamaPlatform(foundItem.name);
        setJenisPinjaman(foundItem.jenis);
        setTotalPinjaman(String(foundItem.awal));
        setTenorCicilan(foundItem.tenor);
        setCicilanPerBulan(String(foundItem.cicilan));
        setTotalBayar(String(foundItem.sisa));
        setTanggalJatuhTempo(foundItem.tempo);
        setStatusPinjaman(foundItem.status);
      }
    }
  }, [pinjamanId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Memperbarui Transaksi ID:", pinjamanId, {
      namaPlatform,
      jenisPinjaman,
      totalPinjaman,
      tenorCicilan,
      cicilanPerBulan,
      totalBayar,
      tanggalJatuhTempo,
      statusPinjaman,
    });


    if (onSwitchToTransaction) {
      onSwitchToTransaction();
    }
  };

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus pinjaman ini?")) {
      console.log("Menghapus Pinjaman ID:", pinjamanId);

      if (onSwitchToTransaction) {
        onSwitchToTransaction();
      }
    }
  };

  return (
    <div className="relative w-full h-full p-6 py-8 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <Header
              title="Catatan Keuangan"
              onOpenSidebar={() => setIsSidebarOpen(true)}
               onProfileClick={() => router.push("/?mode=profile-edit")}
            />

      <div className="flex flex-row items-center gap-3">
        <button 
          type="button"
          onClick={onSwitchToTransaction}
          className="flex items-center justify-center p-2 rounded-full border-2 border-white bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-icons text-xl select-none">arrow_back</span>
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-tight">Edit Pinjaman</h1>
        </div>
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
  );
}