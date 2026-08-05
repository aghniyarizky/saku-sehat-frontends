'use client';

import { useState, useEffect } from 'react';
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../../sidebar';

interface EditTransaksiProps {
  transactionId: string | number | null;
  onSwitchToTransaction?: () => void;
}

const INITIAL_TRANSACTIONS = [
  {
    id: 1,
    title: "Beli ayam geprek",
    category: "Makanan",
    source: "Gopay",
    date: "2026-07-13",
    amount: 12500,
    type: "pengeluaran",
  },
  {
    id: 2,
    title: "Isi Bensin",
    category: "Transportasi",
    source: "Cash",
    date: "2026-07-13",
    amount: 30000,
    type: "pengeluaran",
  },
  {
    id: 3,
    title: "Gaji Freelance",
    category: "Freelance",
    source: "Bank BCA",
    date: "2026-07-12",
    amount: 150000,
    type: "pemasukan",
  },
  {
    id: 4,
    title: "Uang bulanan",
    category: "Uang Saku",
    source: "Bank BCA",
    date: "2026-07-12",
    amount: 1500000,
    type: "pemasukan",
  },
  {
    id: 5,
    title: "Nonton Obsession",
    category: "Hiburan",
    source: "Gopay",
    date: "2026-07-12",
    amount: -50000,
    type: "pengeluaran",
  },
  {
    id: 6,
    title: "Makan Siang",
    category: "Makanan",
    source: "Gopay",
    date: "2026-07-12",
    amount: -40000,
    type: "pengeluaran",
  },
  {
    id: 7,
    title: "Shopee Paylater",
    category: "Cicilan",
    source: "Gopay",
    date: "2026-07-12",
    amount: -50000,
    type: "pengeluaran",
  },
];

export default function EditTransaksi({ transactionId, onSwitchToTransaction }: EditTransaksiProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [source, setSource] = useState("Gopay");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (transactionId) {
      const foundItem = INITIAL_TRANSACTIONS.find(
        (item) => String(item.id) === String(transactionId)
      );

      if (foundItem) {
        setTitle(foundItem.title);
        setCategory(foundItem.category);
        setSource(foundItem.source || "Gopay");
        setAmount(String(foundItem.amount));
        setDate(foundItem.date);
      }
    }
  }, [transactionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Memperbarui Transaksi ID:", transactionId, {
      title,
      category,
      source,
      amount,
      date,
    });


    if (onSwitchToTransaction) {
      onSwitchToTransaction();
    }
  };

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      console.log("Menghapus Transaksi ID:", transactionId);

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

      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2.5">
          <button 
            type="button"
            className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer duration-500"
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

      <div className="flex flex-row items-center gap-3">
        <button 
          type="button"
          onClick={onSwitchToTransaction}
          className="flex items-center justify-center p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-icons text-xl select-none">arrow_back</span>
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-tight">Edit Transaksi</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-1 w-full">
        <div className="border border-slate-700/60 rounded-3xl bg-white/5 p-5 flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/80 font-medium">Catatan Transaksi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#101828]/50 border border-slate-700 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2EC4B6]"
              placeholder="Masukkan catatan..."
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/80 font-medium">Kategori</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#101828]/50 border border-slate-700 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2EC4B6] appearance-none pr-10 cursor-pointer"
              >
                <option value="Makanan">Makanan</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Freelance">Freelance</option>
                <option value="Uang Saku">Uang Saku</option>
                <option value="Hiburan">Hiburan</option>
              </select>
              <span className="material-icons absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none text-lg">
                expand_more
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/80 font-medium">Sumber Dana</label>
            <div className="relative">
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#101828]/50 border border-slate-700 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2EC4B6] appearance-none pr-10 cursor-pointer"
              >
                <option value="Gopay">Gopay</option>
                <option value="Cash">Cash</option>
                <option value="Bank BCA">Bank BCA</option>
                <option value="OVO">OVO</option>
                <option value="ShopeePay">ShopeePay</option>
              </select>
              <span className="material-icons absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none text-lg">
                expand_more
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/80 font-medium">Nominal</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-sm font-semibold text-white/90">Rp</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#101828]/50 border border-slate-700 rounded-full pl-12 pr-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-[#2EC4B6]"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/80 font-medium">Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#101828]/50 border border-slate-700 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2EC4B6] scheme-dark cursor-pointer"
              required
            />
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