'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';
import NavCatatan from '../nav-catatan';

interface TargetNabungProps {
  onSwitchToAddTarget?: () => void;
  onSwitchToEditTarget?: (id: string) => void;
}

interface TargetTabungBE {
  _id: string;
  icon: string;
  namaTarget: string;
  targetNominal: number;
  terkumpulNominal: number;
  deadlineTarget: string;
  status: string;
  persentase: number;
  sisaHari: number;
}

export default function TargetNabung({ 
  onSwitchToAddTarget, 
  onSwitchToEditTarget 
}: TargetNabungProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [ringkasan, setRingkasan] = useState({
    totalMenabung: 0,
    totalTarget: 0,
  });

  const [listTarget, setListTarget] = useState<TargetTabungBE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🟢 State Modal Setor Tabungan
  const [selectedTarget, setSelectedTarget] = useState<TargetTabungBE | null>(null);
  const [nominalSetor, setNominalSetor] = useState("");
  const [sumberDana, setSumberDana] = useState("Tunai");
  const [loadingSetor, setLoadingSetor] = useState(false);
  const [errorSetor, setErrorSetor] = useState("");

  const sumberDanaOptions = [
    "Tunai", "Gopay", "DANA", "ShopeePay", "Bank Mandiri", "BSI", "BRI", "BTN", "BSA", "OVO", "Lainnya"
  ];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const fetchTargetData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/target-tabung`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data target tabung.");
      }

      const result = await response.json();

      setListTarget(result.data || []);
      setRingkasan(result.summary || { totalMenabung: 0, totalTarget: 0 });
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || "Terjadi kesalahan saat mengambil data target tabung.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargetData();
  }, []);

  // 💰 Handler untuk Memproses Setor Tabungan
  const handleSetorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarget) return;

    const nominal = Number(nominalSetor);
    if (!nominal || nominal <= 0) {
      setErrorSetor("Nominal setor harus lebih dari 0.");
      return;
    }

    setLoadingSetor(true);
    setErrorSetor("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/target-tabung/${selectedTarget._id}/setor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nominalSetor: nominal,
          Sumber_Dana: sumberDana,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Gagal menyetor tabungan.");
      }

      // Reset Modal & Re-fetch Data
      setSelectedTarget(null);
      setNominalSetor("");
      setSumberDana("Tunai");
      await fetchTargetData();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setErrorSetor(errorObj.message || "Terjadi kesalahan saat menyimpan setoran.");
    } finally {
      setLoadingSetor(false);
    }
  };

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
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Catatan Keuangan</h1>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full">
              <span className="material-icons text-[#2EC4B6]">wallet</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl lg:text-2xl font-extrabold">{formatRupiah(ringkasan.totalMenabung)}</div>
            <div className="text-sm lg:text-base text-white/40 font-semibold pt-2">Total menabung</div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full">
              <span className="material-icons text-[#E74C3C]">radio_button_checked</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl lg:text-2xl font-extrabold">{formatRupiah(ringkasan.totalTarget)}</div>
            <div className="text-sm lg:text-base text-white/40 font-semibold pt-2">Total target</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row items-center gap-2 w-full pt-1">
        <button
          type="button"
          className="px-3.5 py-2 rounded-full duration-200 flex flex-row items-center gap-1.5 hover:text-white border shrink-0 border-teal-500/30 text-teal-300 text-xs lg:text-sm font-semibold hover:bg-teal-500/20 transition-colors cursor-pointer"
        >
          <span 
            className="material-icons select-none leading-none"
            style={{ fontSize: '14px' }}
          >
            auto_awesome
          </span>
          <span>Smart Assistant</span>
        </button>

        {onSwitchToAddTarget ? (
          <button
            type="button"
            onClick={onSwitchToAddTarget}
            className="px-3.5 py-2 rounded-full text-xs lg:text-sm font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10 shrink-0"
          >
            <span 
              className="material-icons select-none leading-none text-[#0A2E2A]"
              style={{ fontSize: '14px' }}
            >
              add
            </span>
            <span>Tambah</span>
          </button>
        ) : (
          <Link
            href="/?mode=tambahtarget"
            className="px-3.5 py-2 rounded-full text-xs lg:text-sm font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10 shrink-0"
          >
            <span 
              className="material-icons select-none leading-none text-[#0A2E2A]"
              style={{ fontSize: '14px' }}
            >
              add
            </span>
            <span>Tambah</span>
          </Link>
        )}
      </div>

      {/* State Loading & Error */}
      {loading && (
        <div className="text-center py-8 text-white/50 text-sm lg:text-base">
          Memuat data target tabung...
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-red-400 text-sm lg:text-base bg-red-500/10 rounded-xl border border-red-500/20">
          {error}
        </div>
      )}

      {/* State Kosong */}
      {!loading && !error && listTarget.length === 0 && (
        <div className="text-center py-12 text-white/40 text-sm lg:text-base bg-white/5 rounded-2xl border border-gray-800">
          Belum ada target tabung. Klik "Tambah" untuk membuat impian tabungan barumu!
        </div>
      )}

      {/* List Target Tabung */}
      {!loading && (
        <div className="flex flex-col gap-3">
          {listTarget.map((item) => (
            <div 
              key={item._id}
              className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 flex flex-col gap-3 relative"
            >
              <div className="flex flex-row items-center justify-between">
                <div className="text-2xl select-none">{item.icon}</div>
                <div className="flex flex-row items-center gap-2 z-10">
                  <span className="px-3 py-1 rounded-full bg-teal-500/20 text-[#2EC4B6] text-xs lg:text-sm font-bold select-none">
                    {item.persentase}%
                  </span>
                  
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSwitchToEditTarget) {
                        onSwitchToEditTarget(item._id);
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
                <h3 className="text-base lg:text-lg font-bold tracking-tight">{item.namaTarget}</h3>
                <span className="text-xs lg:text-sm text-white/40 font-medium">
                  {item.sisaHari > 0 ? `${item.sisaHari} Hari Tersisa` : "Batas waktu telah berakhir"}
                </span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#2EC4B6] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, item.persentase)}%` }}
                />
              </div>

              <div className="flex flex-row items-center justify-between text-xs lg:text-sm font-semibold pt-1">
                <div className="flex flex-row items-center gap-1">
                  <span className="text-[#2EC4B6]">{formatRupiah(item.terkumpulNominal)}</span>
                  <span className="text-white/40">/ {formatRupiah(item.targetNominal)}</span>
                </div>

                {/* 🟢 TOMBOL + SETOR */}
                <button
                  type="button"
                  onClick={() => setSelectedTarget(item)}
                  className="px-3 py-1.5 rounded-full bg-[#2EC4B6]/20 text-[#2EC4B6] hover:bg-[#2EC4B6] hover:text-[#0A2E2A] text-xs lg:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1"
                >
                  <span className="material-icons text-xs leading-none">add</span>
                  <span>Setor</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🟢 MODAL POP-UP SETOR TABUNGAN */}
      {selectedTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#101828] border border-gray-700/80 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
            
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedTarget.icon}</span>
                <h3 className="text-base lg:text-lg font-bold text-white truncate max-w-[200px]">
                  Setor: {selectedTarget.namaTarget}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTarget(null)}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-icons text-xl">close</span>
              </button>
            </div>

            {errorSetor && (
              <div className="p-2.5 text-xs lg:text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                {errorSetor}
              </div>
            )}

            <form onSubmit={handleSetorSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs lg:text-sm text-gray-300 font-semibold block mb-1.5">
                  Nominal Setor (Rp)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={nominalSetor}
                  onChange={(e) => setNominalSetor(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Contoh: 20000"
                  className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-4 py-2.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] text-white"
                  required
                />

                {/* Quick Chips Nominal */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[10000, 20000, 50000, 100000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setNominalSetor(String(amount))}
                      className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-[10px] lg:text-xs text-gray-300 font-medium transition-colors"
                    >
                      +{amount / 1000}rb
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs lg:text-sm text-gray-300 font-semibold block mb-1.5">
                  Sumber Dana
                </label>
                <div className="relative">
                  <select
                    value={sumberDana}
                    onChange={(e) => setSumberDana(e.target.value)}
                    className="appearance-none border border-white/15 rounded-full w-full text-xs lg:text-sm px-4 py-2.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] text-white cursor-pointer pr-8"
                  >
                    {sumberDanaOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#101828] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="flex flex-row gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTarget(null)}
                  disabled={loadingSetor}
                  className="w-1/2 py-2.5 rounded-full border border-white/15 text-xs lg:text-sm font-bold hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingSetor}
                  className="w-1/2 py-2.5 rounded-full bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b0a3] text-xs lg:text-sm font-extrabold transition-colors disabled:opacity-50"
                >
                  {loadingSetor ? "Menyimpan..." : "Simpan Setoran"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}