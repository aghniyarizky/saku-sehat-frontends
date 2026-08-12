"use client";

import { useState, useEffect } from "react";
import "material-icons/iconfont/material-icons.css";
import Sidebar from "../../sidebar";
import NavCatatan from "../nav-catatan";

import Header from "../../header";
import { useRouter } from "next/navigation";


interface TransaksiProps {
  onSwitchToScan?: () => void;
  onSwitchToAdd?: () => void;
  onSwitchToEdit?: (id: number | string) => void;
}

interface TransactionItem {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: string;
  icon: string;
  iconColor: string;
}

interface Summary {
  saldo: number;
  totalPemasukan: number;
  totalPengeluaran: number;
}

const CATEGORY_ICON: Record<string, string> = {
  makanan: "ramen_dining",
  transportasi: "directions_car",
  belanja: "shopping_bag",
  tagihan: "payments",
  hiburan: "local_movies",
  freelance: "work",
  gaji: "account_balance_wallet",
  "part-time": "badge",
  investasi: "trending_up",
  kesehatan: "medical_services",
  tabungan: "savings",
  lainnya: "receipt_long",
};

const getIconForCategory = (kategori: string) => {
  const key = (kategori || "").toLowerCase();
  return CATEGORY_ICON[key] || "receipt_long";
};

const formatTanggal = (isoDate: string) => {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
};

const formatRupiah = (val: number) =>
  `Rp${Math.abs(val).toLocaleString("id-ID")}`;

export default function Transaksi({
  onSwitchToScan,
  onSwitchToAdd,
  onSwitchToEdit,
}: TransaksiProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState<
    "semua" | "pemasukan" | "pengeluaran"
  >("semua");

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [summary, setSummary] = useState<Summary>({
    saldo: 0,
    totalPemasukan: 0,
    totalPengeluaran: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const datesPerPage = 2;

  const router = useRouter();

  const fetchTransaksi = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const teksResponse = await response.text();

      if (!response.ok) {
        console.error("ERROR AMBIL TRANSAKSI:", teksResponse);
        try {
          const parsedError = JSON.parse(teksResponse);
          throw new Error(
            parsedError.message || "Gagal mengambil data transaksi.",
          );
        } catch {
          throw new Error("Terjadi kesalahan pada server backend.");
        }
      }

      const resData = JSON.parse(teksResponse);

      setSummary({
        saldo: resData.summary?.saldo ?? 0,
        totalPemasukan: resData.summary?.totalPemasukan ?? 0,
        totalPengeluaran: resData.summary?.totalPengeluaran ?? 0,
      });

      const mapped: TransactionItem[] = (resData.data || []).map(
        (item: any) => ({
          id: item._id,
          title: item.Catatan_Transaksi,
          category: item.kategori,
          date: formatTanggal(item.tanggal),
          amount: item.tipe === "pemasukan" ? item.nominal : -item.nominal,
          type: item.tipe,
          icon: getIconForCategory(item.kategori),
          iconColor:
            item.kategori?.toLowerCase() === "tabungan"
              ? "text-[#2EC4B6]"
              : "text-[#e7ae3c]",
        }),
      );

      setTransactions(mapped);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchTransaksi();
    };
    loadData();
  }, []);

  const handleDeleteTransaksi = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (!res.ok) {
        throw new Error("Gagal menghapus transaksi.");
      }

      setDeleteId(null);
      await fetchTransaksi();
    } catch (err: unknown) {
      const errorObj = err as Error;
      alert(errorObj.message || "Terjadi kesalahan saat menghapus.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTransactions = transactions.filter((item) => {
    if (filterType === "pemasukan") return item.type === "pemasukan";
    if (filterType === "pengeluaran") return item.type === "pengeluaran";
    return true;
  });

  const groupedTransactions = filteredTransactions.reduce(
    (acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    },
    {} as Record<string, TransactionItem[]>,
  );

  const groupedDates = Object.keys(groupedTransactions);

  const totalPages = Math.ceil(groupedDates.length / datesPerPage) || 1;
  const startIndex = (currentPage - 1) * datesPerPage;
  const paginatedDates = groupedDates.slice(
    startIndex,
    startIndex + datesPerPage,
  );

  const handleFilterChange = (type: "semua" | "pemasukan" | "pengeluaran") => {
    setFilterType(type);
    setCurrentPage(1);
  };

  return (
    <div className="relative w-full h-full p-6 py-10 flex flex-col gap-4 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:max-w-6xl lg:mx-auto lg:w-full flex flex-col gap-4">

      <Header
        title="Catatan Keuangan"
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onProfileClick={() => router.push("/?mode=profile-edit")}
      />

      <NavCatatan />

      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-xl backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Ringkasan Saldo */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full cursor-pointer">
              <span className="material-icons text-[#2EC4B6]">wallet</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">
              {loading ? "..." : formatRupiah(summary.saldo)}
            </div>
            <div className="text-sm text-white/50 font-medium">
              Saldo Sekarang
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full cursor-pointer">
              <span className="material-icons text-[#2EC4B6]">north_east</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">
              {loading ? "..." : formatRupiah(summary.totalPemasukan)}
            </div>
            <div className="text-sm text-white/50 font-medium">Pemasukan</div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full col-span-2 sm:col-span-1">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full cursor-pointer">
              <span className="material-icons text-[#E74C3C]">south_west</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">
              {loading ? "..." : formatRupiah(summary.totalPengeluaran)}
            </div>
            <div className="text-sm text-white/50 font-medium">Pengeluaran</div>
          </div>
        </div>
      </div>

      {/* Filter Tipe Transaksi */}
      <div className="flex flex-row items-center gap-1 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => handleFilterChange("semua")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border border-gray-800 ${
            filterType === "semua"
              ? "bg-[#2EC4B6] text-[#101828]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Semua
        </button>
        <button
          type="button"
          onClick={() => handleFilterChange("pemasukan")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border border-gray-800 ${
            filterType === "pemasukan"
              ? "bg-[#05DF72] text-[#101828]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Pemasukan
        </button>
        <button
          type="button"
          onClick={() => handleFilterChange("pengeluaran")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border border-gray-800 ${
            filterType === "pengeluaran"
              ? "bg-[#E74C3C] text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Pengeluaran
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row items-center gap-2 w-fit p-1 -mt-5">
        <button
          type="button"
          onClick={onSwitchToScan}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-gray-800 shrink-0"
        >
          <span
            className="material-icons select-none leading-none text-[#2EC4B6]"
            style={{ fontSize: "13px", width: "13px", height: "13px" }}
          >
            qr_code_scanner
          </span>
          <span>Scan Struk</span>
        </button>

        <button
          type="button"
          onClick={onSwitchToAdd}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10 shrink-0"
        >
          <span
            className="material-icons select-none leading-none text-[#0A2E2A]"
            style={{ fontSize: "13px", width: "13px", height: "13px" }}
          >
            add
          </span>
          <span>Tambah</span>
        </button>
      </div>

      {/* List History Transaksi */}
      <div className="flex flex-col gap-5 w-full">
        {loading ? (
          <div className="py-8 text-center text-xs text-gray-500 bg-white/5 rounded-2xl border border-gray-800">
            Memuat data transaksi...
          </div>
        ) : paginatedDates.length > 0 ? (
          paginatedDates.map((dateKey) => {
            const items = groupedTransactions[dateKey];

            return (
              <div key={dateKey} className="flex flex-col gap-3">
                <h2 className="text-base font-bold text-white tracking-wide">
                  {dateKey}
                </h2>

                <div className="flex flex-col gap-3">
                  {items.map((item) => {
                    const isIncome = item.type === "pemasukan";
                    const formattedAmount = isIncome
                      ? `+Rp${item.amount.toLocaleString("id-ID")}`
                      : `-Rp${Math.abs(item.amount).toLocaleString("id-ID")}`;

                    return (
                      <div
                        key={item.id}
                        className="bg-white/5 border border-gray-800 rounded-2xl px-4 py-2 flex flex-row items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="flex items-center justify-center p-3 bg-white/5 rounded-full shrink-0">
                            <span
                              className={`material-icons text-xl ${item.iconColor}`}
                            >
                              {item.icon}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold truncate text-white">
                              {item.title}
                            </div>
                            <div className="text-xs text-white/40 truncate mt-0.5">
                              {item.category}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div
                            className={`text-sm font-bold text-right ${isIncome ? "text-[#05DF72]" : "text-[#E74C3C]"}`}
                          >
                            {formattedAmount}
                          </div>

                          <button
                            type="button"
                            onClick={() => onSwitchToEdit?.(item.id)}
                            className="text-white/40 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
                            title="Edit Transaksi"
                          >
                            <span className="material-icons text-lg">edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(item.id)}
                            className="text-red-400/60 hover:text-red-400 transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
                            title="Hapus Transaksi"
                          >
                            <span className="material-icons text-lg">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-gray-500 bg-white/5 rounded-2xl border border-gray-800">
            Tidak ada transaksi untuk kategori ini.
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/60 text-xs text-white/60">
            <div>
              Halaman{" "}
              <span className="font-bold text-white">{currentPage}</span> dari{" "}
              <span className="font-bold text-white">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-800 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="material-icons text-sm block select-none">
                  chevron_left
                </span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        currentPage === page
                          ? "bg-[#2EC4B6] text-[#101828]"
                          : "hover:bg-white/10 text-white/60"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-800 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="material-icons text-sm block select-none">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus Transaksi */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#101828] border border-gray-700/80 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-white">
                Hapus Transaksi?
              </h3>
              <p className="text-xs text-white/60">
                Apakah kamu yakin ingin menghapus catatan transaksi ini?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex flex-row items-center gap-3 mt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteId(null)}
                className="w-1/2 py-2.5 rounded-full border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteTransaksi}
                className="w-1/2 py-2.5 rounded-full bg-[#E74C3C] text-xs font-bold text-white hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
