'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';

export default function KalkulatorBunga() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [jumlahPinjaman, setJumlahPinjaman] = useState<string>("");
  const [bungaPerBulan, setBungaPerBulan] = useState<string>("");
  const [tenorCicilan, setTenorCicilan] = useState<string>("");
  const [dendaPerHari, setDendaPerHari] = useState<string>("");
  const [deadlineTarget, setDeadlineTarget] = useState<string>("");

  const [hasilKalkulasi, setHasilKalkulasi] = useState<{
    totalBunga: number;
    totalPembayaran: number;
    totalBayarPerBulan: number;
    bungaEfektif: number;
  } | null>(null);

  const tenorOptions = [
    { id: "1", name: "1 Bulan" },
    { id: "3", name: "3 Bulan" },
    { id: "6", name: "6 Bulan" },
    { id: "12", name: "12 Bulan" },
  ];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pinjaman = parseFloat(jumlahPinjaman) || 0;
    const bunga = parseFloat(bungaPerBulan) || 0;
    const tenor = parseInt(tenorCicilan) || 1;

    const totalBunga = pinjaman * (bunga / 100) * tenor;
    const totalPembayaran = pinjaman + totalBunga;
    const totalBayarPerBulan = totalPembayaran / tenor;
    const bungaEfektif = (bunga * 12);

    setHasilKalkulasi({
      totalBunga,
      totalPembayaran,
      totalBayarPerBulan,
      bungaEfektif,
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
          <h1 className="text-xl font-bold tracking-tight">Kalkulator Bunga</h1>
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

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="border border-white/10 rounded-3xl bg-white/5 p-5">
          <div className="flex flex-col gap-4">
            
            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Jumlah Pinjaman</label>
              <input 
                type="number"
                value={jumlahPinjaman}
                onChange={(e) => setJumlahPinjaman(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Rp Contoh: 5000000"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Bunga per Bulan (%)</label>
              <input 
                type="number"
                step="0.1"
                value={bungaPerBulan}
                onChange={(e) => setBungaPerBulan(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="% Contoh: 2"
                required
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
                  required
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
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Denda Keterlambatan per Hari</label>
              <input 
                type="number"
                value={dendaPerHari}
                onChange={(e) => setDendaPerHari(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Rp Contoh: 15000"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Deadline Target</label>
              <input 
                type="date"
                value={deadlineTarget}
                onChange={(e) => setDeadlineTarget(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors text-white cursor-pointer"
              />
            </div>

          </div>
        </div>

        <button 
          type="submit"
          className="flex flex-row w-full bg-[#2EC4B6] hover:bg-[#28b0a3] p-3 rounded-full text-sm font-extrabold text-center text-[#101828] transition-colors cursor-pointer items-center gap-1 justify-center"
        >
          <span 
            className="material-icons select-none leading-none text-[13px] shrink-0"
            style={{ fontSize: '13px', width: '13px', height: '13px' }}
          >
            calculate
          </span>
          Hitung
        </button>
      </form>

      <div className="p-6 flex flex-col border border-white/10 rounded-3xl">
        <div className="text-sm font-semibold pb-2">Hasil Kalkulasi</div>
        
        <div className="flex flex-row justify-between items-center border-b border-white/10 pb-2">
          <div className="text-sm text-white/50">Total Bunga</div>
          <div className="text-md font-bold">
            {hasilKalkulasi ? formatRupiah(hasilKalkulasi.totalBunga) : "Rp600.000"}
          </div>
        </div>

        <div className="flex flex-row justify-between items-center py-2">
          <div className="text-sm text-white/50">Total Pembayaran</div>
          <div className="text-md font-bold">
            {hasilKalkulasi ? formatRupiah(hasilKalkulasi.totalPembayaran) : "Rp3.600.000"}
          </div>
        </div>

        <div className="flex flex-row justify-between items-center py-2">
          <div className="text-sm text-white/50">Total Bayar per Bulan</div>
          <div className="text-md font-bold">
            {hasilKalkulasi ? formatRupiah(hasilKalkulasi.totalBayarPerBulan) : "Rp360.000"}
          </div>
        </div>

        <div className="flex flex-row justify-between items-center py-2">
          <div className="items-center flex flex-row">
            <div className="text-sm text-white/50">Bunga Efektif</div>
            <span 
              className="material-icons select-none leading-none text-[13px] shrink-0 pl-2 text-white/50"
              style={{ fontSize: '13px', width: '13px', height: '13px' }}
            >
              info
            </span>
          </div>
          <div className="text-md font-bold">
            {hasilKalkulasi ? `${hasilKalkulasi.bungaEfektif.toFixed(1)}% per Tahun` : "21,8% per Tahun"}
          </div>
        </div>
      </div>

      <div className="w-full bg-white/4 border border-gray-700 rounded-2xl p-6">
        <div className="flex flex-row gap-4">
          <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
            <span className="material-icons text-[#2EC4B6] select-none leading-none">insights</span>
          </div>
          <div className="flex flex-col gap-5">
            <div className="text-lg text-white font-bold">Risiko Rendah</div>
            <div className="text-xs text-white/80 text-justify">
              Cicilan ini masih tergolong aman jika <b>tidak melebihi 30% dari penghasilan bulanan.</b> Jika terjadi keterlambatan, denda harian akan terus bertambah sehingga total utang bisa meningkat. Sebaiknya lakukan pembayaran tepat waktu untuk menghindari beban tambahan. 
            </div>
            <div className="flex flex-row gap-2 items-center cursor-pointer">
              <div className="text-xs text-[#2EC4B6] font-semibold">Detail</div>
              <span 
                className="material-icons select-none leading-none text-[#2EC4B6]" 
                style={{ fontSize: '11px', width: '11px', height: '11px' }}
              >
                arrow_forward
              </span>
            </div>
          </div>
        </div>
      </div> 

    </div>
  );
}