'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';
import NavCatatan from '../nav-catatan';

interface TransaksiProps {
  onSwitchToScan?: () => void;
  onSwitchToAdd?: () => void;
  onSwitchToEdit?: (id: number | string) => void;
}

interface TransactionItem {
  id: number;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: string;
  icon: string;
  iconColor: string;
}

const INITIAL_TRANSACTIONS: TransactionItem[] = [
    {
        id: 1,
        title: "Beli ayam geprek",
        category: "Makanan",
        date: "15 Jul 2026",
        amount: -12500,
        type: "pengeluaran",
        icon: "ramen_dining",
        iconColor: "text-[#e7ae3c]",
    },
    {
        id: 2,
        title: "Isi bensin",
        category: "Transportasi",
        date: "13 Jul 2026",
        amount: -30000,
        type: "pengeluaran",
        icon: "directions_car",
        iconColor: "text-[#e7ae3c]",
    },
    {
        id: 3,
        title: "Gaji freelance",
        category: "Freelance",
        date: "13 Jul 2026",
        amount: 150000,
        type: "pemasukan",
        icon: "work",
        iconColor: "text-[#e7ae3c]",
    },
    {
        id: 4,
        title: "Uang bulanan",
        category: "Uang Saku",
        date: "13 Jul 2026",
        amount: 1500000,
        type: "pemasukan",
        icon: "paid",
        iconColor: "text-[#e7ae3c]",
    },
    {
        id: 5,
        title: "Nonton Obsession",
        category: "Hiburan",
        date: "12 Jul 2026",
        amount: -50000,
        type: "pengeluaran",
        icon: "local_movies",
        iconColor: "text-[#e7ae3c]",
    },
    {
        id: 6,
        title: "Makan Siang",
        category: "Makanan",
        date: "12 Jul 2026",
        amount: -40000,
        type: "pengeluaran",
        icon: "ramen_dining",
        iconColor: "text-[#e7ae3c]",
    },
    {
        id: 7,
        title: "Shopee Paylater",
        category: "Cicilan",
        date: "12 Jul 2026",
        amount: -50000,
        type: "pengeluaran",
        icon: "paid",
        iconColor: "text-[#e7ae3c]",
    },
]

export default function Transaksi({ onSwitchToScan, onSwitchToAdd, onSwitchToEdit }: TransaksiProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState<"semua" | "pemasukan" | "pengeluaran">("semua");

  const [currentPage, setCurrentPage] = useState(1);
  const datesPerPage = 2; 

  const filteredTransactions = INITIAL_TRANSACTIONS.filter((item) => {
    if (filterType === "pemasukan") return item.type === "pemasukan";
    if (filterType === "pengeluaran") return item.type === "pengeluaran";
    return true; 
  });

  const groupedTransactions = filteredTransactions.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, TransactionItem[]>);

  const groupedDates = Object.keys(groupedTransactions);

  const totalPages = Math.ceil(groupedDates.length / datesPerPage) || 1;
  const startIndex = (currentPage - 1) * datesPerPage;
  const paginatedDates = groupedDates.slice(startIndex, startIndex + datesPerPage);

  const handleFilterChange = (type: "semua" | "pemasukan" | "pengeluaran") => {
    setFilterType(type);
    setCurrentPage(1);
  };

  return (
    <div className="relative w-full h-full p-6 py-8 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Header */}
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2.5">
          <button 
            className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer duration-500"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-icons text-2xl select-none">menu</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Catatan Keuangan</h1>
        </div>

        <div className="flex flex-row items-center gap-3">
          <button className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span className="material-icons text-xl select-none">notifications</span>
          </button>
          <button className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span className="material-icons text-xl select-none">account_circle</span>
          </button>
        </div>
      </div>

      <NavCatatan />

      {/* Saldo */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full cursor-pointer">
              <span className="material-icons text-[#2EC4B6]">wallet</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">Rp150.000</div>
            <div className="text-sm text-white/50 font-medium">Saldo Sekarang</div>
            <div className="text-xs text-white/20">sejak Jul 2026</div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full cursor-pointer">
              <span className="material-icons text-[#2EC4B6]">north_east</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">Rp30.000</div>
            <div className="text-sm text-white/50 font-medium">Pemasukan</div>
            <div className="text-xs text-white/20">sejak Jul 2026</div>
          </div>
        </div>

        <div className="bg-white/5 border border-gray-700/60 rounded-2xl p-4 py-5 w-full col-span-2 sm:col-span-1">
          <div className="flex flex-row items-start justify-between">
            <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full cursor-pointer">
              <span className="material-icons text-[#E74C3C]">south_west</span>
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <div className="text-xl font-extrabold">Rp150.000</div>
            <div className="text-sm text-white/50 font-medium">Pengeluaran</div>
            <div className="text-xs text-white/20">sejak Jul 2026</div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-1 p-1 rounded-xl w-fit">
        <button
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

      <div className="flex flex-row items-center gap-2 w-fit p-1 -mt-5">
        <button
          type="button"
          onClick={onSwitchToScan}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-gray-800 shrink-0"
        >
          <span 
            className="material-icons select-none leading-none text-[#2EC4B6]"
            style={{ fontSize: '13px', width: '13px', height: '13px' }}
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
            style={{ fontSize: '13px', width: '13px', height: '13px' }}
          >
            add
          </span>
          <span>Tambah</span>
        </button>
      </div>

      <div className="flex flex-col gap-5 w-full">
        {paginatedDates.length > 0 ? (
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
                            <span className={`material-icons text-xl ${item.iconColor}`}>
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

                        <div className="flex items-center gap-4 shrink-0">
                          <div className={`text-sm font-bold text-right ${isIncome ? "text-[#05DF72]" : "text-[#E74C3C]"}`}>
                            {formattedAmount}
                          </div>

                          <button 
                            type="button"
                            onClick={() => onSwitchToEdit?.(item.id)}
                            className="text-white/40 hover:text-white transition-colors cursor-pointer p-1"
                          >
                            <span className="material-icons text-lg">edit</span>
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/60 text-xs text-white/60">
            <div>
              Halaman <span className="font-bold text-white">{currentPage}</span> dari{" "}
              <span className="font-bold text-white">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-800 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="material-icons text-sm block select-none">chevron_left</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-[#2EC4B6] text-[#101828]"
                        : "hover:bg-white/10 text-white/60"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-800 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="material-icons text-sm block select-none">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}