"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "material-icons/iconfont/material-icons.css";
import Sidebar from "../../sidebar";
import NavCatatan from "../nav-catatan";

import Header from "../../header";

interface PinjamanProps {
  onSwitchToKalkulator?: () => void;
  onSwitchToAddPinjaman?: () => void;
  onSwitchToEdit?: (id: string) => void;
}

interface PinjamanItem {
  _id: string;
  namaPlatform: string;
  jenisPinjaman: string;
  totalPinjaman: number;
  tenorCicilan: number;
  cicilanBulanan: number;
  totalYangHarusDibayar: number;
  jatuhTempo: string;
  persenBunga?: number;
  statusPinjaman: string;
  progress: number;
}

export default function Pinjaman({
  onSwitchToKalkulator,
  onSwitchToAddPinjaman,
  onSwitchToEdit,
}: PinjamanProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const [ringkasan, setRingkasan] = useState({
    belumDibayar: 0,
    sudahDibayar: 0,
    kewajibanPerbulan: 0,
  });

  const [daftarPinjaman, setDaftarPinjaman] = useState<PinjamanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPinjaman, setSelectedPinjaman] = useState<PinjamanItem | null>(
    null,
  );
  const [nominalBayar, setNominalBayar] = useState("");
  const [sumberDana, setSumberDana] = useState("Tunai");
  const [loadingBayar, setLoadingBayar] = useState(false);
  const [errorBayar, setErrorBayar] = useState("");

  const sumberDanaOptions = [
    "Tunai",
    "Gopay",
    "DANA",
    "ShopeePay",
    "Bank Mandiri",
    "BSI",
    "BRI",
    "BTN",
    "BSA",
    "OVO",
    "Lainnya",
  ];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatTanggal = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchPinjamanData = async () => {
    setLoading(true);
    setError("");
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/pinjaman`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data pinjaman.");
      }

      const result = await response.json();

      setDaftarPinjaman(result.data || []);
      setRingkasan(
        result.summary || {
          belumDibayar: 0,
          sudahDibayar: 0,
          kewajibanPerbulan: 0,
        },
      );
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(
        errorObj.message || "Terjadi kesalahan saat mengambil data pinjaman.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPinjamanData();
  }, []);

  const handleOpenBayarModal = (item: PinjamanItem) => {
    setSelectedPinjaman(item);
    setNominalBayar(String(item.cicilanBulanan));
    setSumberDana("Tunai");
    setErrorBayar("");
  };

  const handleBayarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPinjaman) return;

    const bayar = Number(nominalBayar);
    if (!bayar || bayar <= 0) {
      setErrorBayar("Nominal bayar harus lebih dari 0.");
      return;
    }

    setLoadingBayar(true);
    setErrorBayar("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/pinjaman/${selectedPinjaman._id}/bayar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            nominalBayar: bayar,
            Sumber_Dana: sumberDana,
          }),
        },
      );

      const teksResponse = await res.text();

      if (!res.ok) {
        try {
          const parsed = JSON.parse(teksResponse);
          throw new Error(
            parsed.message || "Gagal memproses pembayaran cicilan.",
          );
        } catch {
          throw new Error("Terjadi kesalahan pada server backend.");
        }
      }

      setSelectedPinjaman(null);
      setNominalBayar("");
      setSumberDana("Tunai");
      await fetchPinjamanData();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setErrorBayar(
        errorObj.message || "Terjadi kesalahan saat memproses pembayaran.",
      );
    } finally {
      setLoadingBayar(false);
    }
  };

  return (
    <div className="relative w-full h-full p-6 py-10 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:max-w-6xl lg:mx-auto lg:w-full flex flex-col gap-4">

      <Header
              title="Catatan Keuangan"
              onOpenSidebar={() => setIsSidebarOpen(true)}
              onProfileClick={() => router.push("/?mode=profile-edit")}
            />

      <NavCatatan />

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full">
              <span className="material-icons text-[#E74C3C]">wallet</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">
              {formatRupiah(ringkasan.belumDibayar)}
            </div>
            <div className="text-sm text-white/40 font-semibold pt-2">
              Belum dibayar
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#05DF7226]/75 rounded-full">
              <span className="material-icons text-[#05DF72]">check</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">
              {formatRupiah(ringkasan.sudahDibayar)}
            </div>
            <div className="text-sm text-white/40 font-semibold pt-2">
              Sudah dibayar
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full col-span-2 sm:col-span-1">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#FFB70018] rounded-full">
              <span className="material-icons text-[#FFB700]">schedule</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">
              {formatRupiah(ringkasan.kewajibanPerbulan)}
            </div>
            <div className="text-sm text-white/40 font-semibold pt-2">
              Kewajiban Perbulan
            </div>
          </div>
        </div>
      </div>

      <div className="p-1 flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="text-lg font-semibold mb-2">
            Pinjaman Saya ({daftarPinjaman.length})
          </div>

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

        {loading && (
          <div className="text-center py-8 text-white/50 text-sm">
            Memuat data pinjaman...
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-red-400 text-sm bg-red-500/10 rounded-xl border border-red-500/20">
            {error}
          </div>
        )}

        {!loading && !error && daftarPinjaman.length === 0 && (
          <div className="text-center py-12 text-white/40 text-sm bg-white/5 rounded-2xl border border-gray-800">
            Belum ada data pinjaman. Klik "Tambah" untuk mencatat pinjaman baru.
          </div>
        )}

        {!loading && (
          <div className="flex flex-col gap-3 mt-1">
            {daftarPinjaman.map((item) => (
              <div
                key={item._id}
                className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="flex flex-row pb-1">
                  <div className="flex flex-row items-start justify-between w-full">
                    <div className="flex flex-col">
                      <div className="font-bold text-base mb-1">
                        {item.namaPlatform}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[#2EC4B61F] border border-[#2EC4B640] text-[#2EC4B6] font-medium">
                          {item.jenisPinjaman}
                        </span>
                        {item.persenBunga !== undefined &&
                          item.persenBunga > 0 && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-[#FFB70018] border border-[#FFB700]/50 font-medium text-[#FFB700]">
                              Bunga {item.persenBunga}% /bulan
                            </span>
                          )}
                        {item.statusPinjaman === "Lunas" && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#05DF7226] border border-[#05DF72] font-bold text-[#05DF72]">
                            Lunas
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-sm font-semibold text-white/50 hover:text-white cursor-pointer ml-auto gap-1">
                      <button
                        type="button"
                        onClick={() => onSwitchToEdit?.(item._id)}
                        className="text-white/40 hover:text-white transition-colors cursor-pointer p-1"
                        title="Edit Pinjaman"
                      >
                        <span className="material-icons text-lg">edit</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs px-2">
                  <div className="p-2 px-3 bg-white/5 rounded-2xl">
                    <span className="text-white/40 block font-medium">
                      Pinjaman Awal
                    </span>
                    <span className="font-bold text-white text-sm">
                      {formatRupiah(item.totalPinjaman)}
                    </span>
                  </div>
                  <div className="p-2 px-3 bg-white/5 rounded-2xl">
                    <span className="text-white/40 block font-medium">
                      Sisa Tagihan
                    </span>
                    <span className="font-bold text-sm text-[#FF6467]">
                      {formatRupiah(item.totalYangHarusDibayar)}
                    </span>
                  </div>
                  <div className="p-2 px-3 bg-white/5 rounded-2xl">
                    <span className="text-white/40 block font-medium">
                      Cicilan Bulanan
                    </span>
                    <span className="font-bold text-white text-sm">
                      {formatRupiah(item.cicilanBulanan)}
                    </span>
                  </div>
                  <div className="p-2 px-3 bg-white/5 rounded-2xl">
                    <span className="text-white/40 block font-medium">
                      Jatuh Tempo
                    </span>
                    <span className="font-bold text-white text-sm">
                      {formatTanggal(item.jatuhTempo)}
                    </span>
                  </div>
                </div>

                <div className="px-2 pt-1 flex flex-col gap-1.5">
                  <div className="flex flex-row items-center justify-between text-xs font-medium">
                    <span className="text-white/40">Progress Pembayaran</span>
                    <span className="text-[#2EC4B6] font-bold">
                      {item.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2EC4B6] h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(0, item.progress))}%`,
                      }}
                    />
                  </div>
                </div>

                {item.statusPinjaman !== "Lunas" && (
                  <div className="flex justify-end px-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenBayarModal(item)}
                      className="px-4 py-2 rounded-full bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#2EC4B6]/10"
                    >
                      <span className="material-icons text-sm leading-none">
                        payments
                      </span>
                      <span>Bayar Cicilan</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPinjaman && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#101828] border border-gray-700/80 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-icons text-[#2EC4B6] text-2xl">
                  account_balance_wallet
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-[200px]">
                  Bayar: {selectedPinjaman.namaPlatform}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPinjaman(null)}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-icons text-xl">close</span>
              </button>
            </div>

            {errorBayar && (
              <div className="p-2.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                {errorBayar}
              </div>
            )}

            <form onSubmit={handleBayarSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1.5">
                  Nominal Pembayaran (Rp)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={nominalBayar}
                  onChange={(e) =>
                    setNominalBayar(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="Masukkan nominal bayar"
                  className="border border-white/15 rounded-full w-full text-xs px-4 py-2.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] text-white"
                  required
                />

                {/* Quick Chips Nominal */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setNominalBayar(String(selectedPinjaman.cicilanBulanan))
                    }
                    className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-[10px] text-gray-300 font-medium transition-colors"
                  >
                    1x Cicilan ({formatRupiah(selectedPinjaman.cicilanBulanan)})
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNominalBayar(
                        String(selectedPinjaman.totalYangHarusDibayar),
                      )
                    }
                    className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 text-[10px] text-[#2EC4B6] font-medium transition-colors"
                  >
                    Pelunasan (
                    {formatRupiah(selectedPinjaman.totalYangHarusDibayar)})
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1.5">
                  Sumber Dana
                </label>
                <div className="relative">
                  <select
                    value={sumberDana}
                    onChange={(e) => setSumberDana(e.target.value)}
                    className="appearance-none border border-white/15 rounded-full w-full text-xs px-4 py-2.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] text-white cursor-pointer pr-8"
                  >
                    {sumberDanaOptions.map((opt) => (
                      <option
                        key={opt}
                        value={opt}
                        className="bg-[#101828] text-white"
                      >
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
                  onClick={() => setSelectedPinjaman(null)}
                  disabled={loadingBayar}
                  className="w-1/2 py-2.5 rounded-full border border-white/15 text-xs font-bold hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingBayar}
                  className="w-1/2 py-2.5 rounded-full bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b0a3] text-xs font-extrabold transition-colors disabled:opacity-50"
                >
                  {loadingBayar ? "Memproses..." : "Simpan Pembayaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
