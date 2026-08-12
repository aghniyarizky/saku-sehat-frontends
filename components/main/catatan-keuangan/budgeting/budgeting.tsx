"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "material-icons/iconfont/material-icons.css";
import Sidebar from "../../sidebar";
import NavCatatan from "../nav-catatan";

interface BudgetingProps {
  onSwitchToAddBudget?: () => void;
  onSwitchToEditBudget?: (id: string) => void;
}

interface BudgetItemBE {
  _id: string;
  Kategori_Budget: string;
  Batas_PerBulan: number;
  Tanggal_Mulai: string;
  Tanggal_Selesai: string;
  terpakai: number;
  tersisa: number;
  persentase: number;
  sisaHari: number;
  statusLabel: string;
}

export default function Budgeting({
  onSwitchToAddBudget,
  onSwitchToEditBudget,
}: BudgetingProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [ringkasan, setRingkasan] = useState({
    totalBudget: 0,
    totalPengeluaran: 0,
    sisaBudget: 0,
  });

  const [budgetList, setBudgetList] = useState<BudgetItemBE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getKategoriIcon = (kategori: string) => {
    const lower = kategori.toLowerCase();
    if (
      lower.includes("makan") ||
      lower.includes("kuliner") ||
      lower.includes("pangan")
    )
      return "🍜";
    if (
      lower.includes("trans") ||
      lower.includes("bensin") ||
      lower.includes("kendaraan")
    )
      return "🚗";
    if (
      lower.includes("belanja") ||
      lower.includes("mall") ||
      lower.includes("shopping")
    )
      return "🛍️";
    if (
      lower.includes("hiburan") ||
      lower.includes("main") ||
      lower.includes("game")
    )
      return "🎬";
    if (
      lower.includes("tagihan") ||
      lower.includes("listrik") ||
      lower.includes("air")
    )
      return "💡";
    if (lower.includes("kesehatan") || lower.includes("obat")) return "🏥";
    if (
      lower.includes("pendidikan") ||
      lower.includes("kuliah") ||
      lower.includes("buku")
    )
      return "📚";
    return "💰";
  };

  const formatBulanTahun = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchBudgetingData = async () => {
      setLoading(true);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/budgeting`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data budgeting.");
        }

        const result = await response.json();

        setBudgetList(result.data || []);
        setRingkasan(
          result.summary || {
            totalBudget: 0,
            totalPengeluaran: 0,
            sisaBudget: 0,
          },
        );
      } catch (err: any) {
        setError(
          err.message || "Terjadi kesalahan saat mengambil data budget.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetingData();
  }, []);

  return (
    <div className="relative w-full h-full p-6 py-8 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
            <span className="material-icons text-xl select-none">
              notifications
            </span>
          </Link>
          <Link
            href="/?mode=profil"
            className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-icons text-xl select-none">
              account_circle
            </span>
          </Link>
        </div>
      </div>

      <NavCatatan />

      {/* Ringkasan Header Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full">
              <span className="material-icons text-[#2EC4B6]">
                radio_button_checked
              </span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl lg:text-2xl font-extrabold">
              {formatRupiah(ringkasan.totalBudget)}
            </div>
            <div className="text-sm lg:text-base text-white/40 font-semibold pt-2">
              Total budget
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full">
              <span className="material-icons text-[#E74C3C]">
                trending_down
              </span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl lg:text-2xl font-extrabold">
              {formatRupiah(ringkasan.totalPengeluaran)}
            </div>
            <div className="text-sm lg:text-base text-white/40 font-semibold pt-2">
              Pengeluaran
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full col-span-2 sm:col-span-1">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full">
              <span className="material-icons text-[#2EC4B6]">wallet</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl lg:text-2xl font-extrabold">
              {formatRupiah(ringkasan.sisaBudget)}
            </div>
            <div className="text-sm lg:text-base text-white/40 font-semibold pt-2">
              Sisa budget
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <div className="text-lg lg:text-xl font-bold">
            Budget Saya ({budgetList.length})
          </div>

          {onSwitchToAddBudget ? (
            <button
              type="button"
              onClick={onSwitchToAddBudget}
              className="px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10"
            >
              <span className="material-icons select-none leading-none text-[#0A2E2A] text-[15px]">
                add
              </span>
              <span>Tambah</span>
            </button>
          ) : (
            <Link
              href="/?mode=tambahbudget"
              className="px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10"
            >
              <span className="material-icons select-none leading-none text-[#0A2E2A] text-[15px]">
                add
              </span>
              <span>Tambah</span>
            </Link>
          )}
        </div>

        {/* State Loading & Error */}
        {loading && (
          <div className="text-center py-8 text-white/50 text-sm lg:text-base">
            Memuat data budget...
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-red-400 text-sm lg:text-base bg-red-500/10 rounded-xl border border-red-500/20">
            {error}
          </div>
        )}

        {/* State Kosong */}
        {!loading && !error && budgetList.length === 0 && (
          <div className="text-center py-12 text-white/40 text-sm lg:text-base bg-white/5 rounded-2xl border border-gray-800">
            Belum ada data budget. Klik &quot;Tambah&quot; untuk membuat batasan budget
            baru.
          </div>
        )}

        {/* List Budgeting */}
        {!loading && (
          <div className="flex flex-col gap-4">
            {budgetList.map((item) => {
              const statusColor =
                item.statusLabel === "Melebihi Budget"
                  ? "bg-red-500/15 border-red-500/30 text-red-400"
                  : item.statusLabel === "Mendekati Batas"
                    ? "bg-[#FFB700]/15 border-[#FFB700]/30 text-[#FFB700]"
                    : "bg-[#05DF72]/15 border-[#05DF72]/30 text-[#05DF72]";

              const barColor =
                item.persentase >= 100
                  ? "bg-red-500"
                  : item.persentase >= 70
                    ? "bg-[#FFB700]"
                    : "bg-[#2EC4B6]";

              return (
                <div
                  key={item._id}
                  className="bg-[#121B2B] border border-gray-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg"
                >
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#1A2638] flex items-center justify-center text-2xl border border-gray-800">
                        {getKategoriIcon(item.Kategori_Budget)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base lg:text-lg text-white">
                          {item.Kategori_Budget}
                        </span>
                        <span className="text-xs lg:text-sm text-white/40 flex items-center gap-1">
                          <span className="material-icons text-xs select-none">
                            calendar_today
                          </span>
                          {formatBulanTahun(item.Tanggal_Mulai)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                      <span
                        className={`text-xs lg:text-sm px-3 py-1 rounded-full border font-medium ${statusColor}`}
                      >
                        {item.statusLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSwitchToEditBudget?.(item._id)}
                        className="text-white/40 hover:text-white transition-colors cursor-pointer p-1"
                      >
                        <span className="material-icons text-lg">edit</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-[#1A2638]/60 rounded-2xl flex flex-col justify-center border border-gray-800/60">
                      <span className="text-xs lg:text-sm text-white/40 font-medium mb-1">
                        Budget
                      </span>
                      <span className="font-bold text-white text-base lg:text-lg">
                        {formatRupiah(item.Batas_PerBulan)}
                      </span>
                      <span className="text-[11px] lg:text-xs text-white/30 font-medium">
                        / periode
                      </span>
                    </div>

                    <div className="p-3 bg-[#1A2638]/60 rounded-2xl flex flex-col justify-center border border-gray-800/60">
                      <span className="text-xs lg:text-sm text-white/40 font-medium mb-1">
                        Terpakai
                      </span>
                      <span className="font-bold text-[#2EC4B6] text-base lg:text-lg">
                        {formatRupiah(item.terpakai)}
                      </span>
                      <span className="text-[11px] lg:text-xs text-[#2EC4B6]/80 font-medium">
                        {item.persentase}%
                      </span>
                    </div>

                    <div className="p-3 bg-[#1A2638]/60 rounded-2xl flex flex-col justify-center border border-gray-800/60 col-span-2">
                      <span className="text-xs lg:text-sm text-white/40 font-medium mb-1">
                        Tersisa
                      </span>
                      <span className="font-bold text-[#20E070] text-lg lg:text-xl">
                        {formatRupiah(item.tersisa)}
                      </span>
                      <span className="text-[11px] lg:text-xs text-[#20E070] font-medium">
                        {item.sisaHari} hari lagi
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <span className="text-xs lg:text-sm text-white/40 font-medium">
                      {item.persentase}% budget terpakai
                    </span>
                    <div className="w-full bg-[#1A2638] h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`${barColor} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(100, item.persentase)}%` }}
                      />
                    </div>
                    <div className="flex flex-row justify-between text-[11px] lg:text-xs text-white/30 font-medium">
                      <span>Rp0</span>
                      <span>{formatRupiah(item.Batas_PerBulan)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}