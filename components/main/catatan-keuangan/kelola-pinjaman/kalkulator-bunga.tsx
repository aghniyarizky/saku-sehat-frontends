'use client';

import { useState, useEffect } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';
import { useRouter } from "next/navigation";

import Header from "../../header";

interface HasilKalkulasi {
  jumlahPinjaman: number;
  bungaPerBulan: number;
  tenorCicilan: number;
  dendaPerHari: number;
  deadlineTarget?: string;
  totalBunga: number;
  totalPembayaran: number;
  totalBayarPerBulan: number;
  bungaEfektifTahunan: number;
  levelRisiko: "Rendah" | "Sedang" | "Tinggi";
  analisisAI: string;
  createdAt?: string;
}

export default function KalkulatorBunga() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [jumlahPinjaman, setJumlahPinjaman] = useState<string>("");
  const [bungaPerBulan, setBungaPerBulan] = useState<string>("");
  const [tenorCicilan, setTenorCicilan] = useState<string>("");
  const [dendaPerHari, setDendaPerHari] = useState<string>("");
  const [deadlineTarget, setDeadlineTarget] = useState<string>("");

  const [hasilKalkulasi, setHasilKalkulasi] = useState<HasilKalkulasi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const renderAnalisis = (text: string) => {
    const parts = text.split("**");
    return parts.map((part, i) =>
      i % 2 === 1 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>
    );
  };

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || "";
    }
    return "";
  };

  const fetchLatestSimulasi = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kalkulator-bunga/output`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || "Gagal mengambil data simulasi.");

      if (resData.data) {
        setHasilKalkulasi(resData.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestSimulasi();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kalkulator-bunga`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          jumlahPinjaman,
          bungaPerBulan,
          tenorCicilan,
          dendaPerHari,
          deadlineTarget,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menghitung simulasi.");
      }

      if (!response.body) {
        throw new Error("Tidak ada respons dari server");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          try {
            const payload = JSON.parse(line.slice(6));

            if (payload.type === "done") {
              setHasilKalkulasi(payload.data);
            } else if (payload.type === "error") {
              throw new Error(payload.error || payload.message || "Gagal menghitung simulasi");
            }
          } catch {
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
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

      {error && (
        <div className="p-3 text-sm lg:text-base text-red-400 bg-red-950/40 border border-red-900 rounded-xl backdrop-blur-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="border border-white/10 rounded-3xl bg-white/5 p-5">
          <div className="flex flex-col gap-4">

            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Jumlah Pinjaman</label>
              <input
                type="number"
                value={jumlahPinjaman}
                onChange={(e) => setJumlahPinjaman(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Rp Contoh: 5000000"
                required
              />
            </div>

            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Bunga per Bulan (%)</label>
              <input
                type="number"
                step="0.1"
                value={bungaPerBulan}
                onChange={(e) => setBungaPerBulan(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="% Contoh: 2"
                required
              />
            </div>

            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Tenor Cicilan (Bulan)</label>
              <input
                type="number"
                min={1}
                value={tenorCicilan}
                onChange={(e) => setTenorCicilan(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Contoh: 6"
                required
              />
            </div>

            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Denda Keterlambatan per Hari</label>
              <input
                type="number"
                value={dendaPerHari}
                onChange={(e) => setDendaPerHari(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Rp Contoh: 15000"
              />
            </div>

            <div>
              <label className="text-xs lg:text-sm text-gray-300 mb-1 block font-semibold">Deadline Target</label>
              <input
                type="date"
                value={deadlineTarget}
                onChange={(e) => setDeadlineTarget(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs lg:text-sm px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors text-white cursor-pointer"
              />
            </div>

          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex flex-row w-full bg-[#2EC4B6] hover:bg-[#28b0a3] p-3 rounded-full text-sm lg:text-base font-extrabold text-center text-[#101828] transition-colors cursor-pointer items-center gap-1 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span
            className="material-icons select-none leading-none text-[13px] shrink-0"
            style={{ fontSize: '13px', width: '13px', height: '13px' }}
          >
            calculate
          </span>
          {loading ? "Menghitung..." : "Hitung"}
        </button>
      </form>

      {loading ? (
        <div className="p-6 flex flex-col items-center justify-center gap-3 border border-white/10 rounded-3xl py-16">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#2EC4B6] animate-spin" />
          <div className="text-xs lg:text-sm text-white/60 text-center">AI sedang menghitung dan menganalisis simulasi...</div>
        </div>
      ) : (
        <>
          <div className="p-6 flex flex-col border border-white/10 rounded-3xl">
            <div className="text-sm lg:text-base font-semibold pb-2">Hasil Kalkulasi</div>

            <div className="flex flex-row justify-between items-center border-b border-white/10 pb-2">
              <div className="text-sm lg:text-base text-white/50">Total Bunga</div>
              <div className="text-md lg:text-lg font-bold">
                {hasilKalkulasi ? formatRupiah(hasilKalkulasi.totalBunga) : "Rp600.000"}
              </div>
            </div>

            <div className="flex flex-row justify-between items-center py-2">
              <div className="text-sm lg:text-base text-white/50">Total Pembayaran</div>
              <div className="text-md lg:text-lg font-bold">
                {hasilKalkulasi ? formatRupiah(hasilKalkulasi.totalPembayaran) : "Rp3.600.000"}
              </div>
            </div>

            <div className="flex flex-row justify-between items-center py-2">
              <div className="text-sm lg:text-base text-white/50">Total Bayar per Bulan</div>
              <div className="text-md lg:text-lg font-bold">
                {hasilKalkulasi ? formatRupiah(hasilKalkulasi.totalBayarPerBulan) : "Rp360.000"}
              </div>
            </div>

            <div className="flex flex-row justify-between items-center py-2">
              <div className="items-center flex flex-row">
                <div className="text-sm lg:text-base text-white/50">Bunga Efektif</div>
                <span
                  className="material-icons select-none leading-none text-[13px] shrink-0 pl-2 text-white/50"
                  style={{ fontSize: '13px', width: '13px', height: '13px' }}
                >
                  info
                </span>
              </div>
              <div className="text-md lg:text-lg font-bold">
                {hasilKalkulasi ? `${hasilKalkulasi.bungaEfektifTahunan.toFixed(1)}% per Tahun` : "21,8% per Tahun"}
              </div>
            </div>
          </div>

          <div className="w-full bg-white/4 border border-gray-700 rounded-2xl p-6">
            <div className="flex flex-row gap-4">
              <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
                <span className="material-icons text-[#2EC4B6] select-none leading-none">insights</span>
              </div>
              <div className="flex flex-col gap-5">
                <div className="text-lg lg:text-xl text-white font-bold">
                  {hasilKalkulasi ? `Risiko ${hasilKalkulasi.levelRisiko}` : "Risiko Rendah"}
                </div>
                <div className="text-xs lg:text-sm text-white/80 text-justify">
                  {hasilKalkulasi
                    ? renderAnalisis(hasilKalkulasi.analisisAI)
                    : "Cicilan ini masih tergolong aman jika tidak melebihi 30% dari penghasilan bulanan. Jika terjadi keterlambatan, denda harian akan terus bertambah sehingga total utang bisa meningkat. Sebaiknya lakukan pembayaran tepat waktu untuk menghindari beban tambahan."}
                </div>
                <div className="flex flex-row gap-2 items-center cursor-pointer">
                  <div className="text-xs lg:text-sm text-[#2EC4B6] font-semibold">Detail</div>
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
        </>
      )}

    </div>
  );
}