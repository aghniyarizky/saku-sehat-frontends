'use client';

import { useState, useEffect } from 'react';
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../../sidebar';

import Header from "../../../header";
import { useRouter } from "next/navigation";

interface EditTransaksiProps {
  transactionId: string | number | null;
  onSwitchToTransaction?: () => void;
}

export default function EditTransaksi({ transactionId, onSwitchToTransaction }: EditTransaksiProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [source, setSource] = useState("Gopay");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("pengeluaran"); 
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchDetailTransaksi = async () => {
      if (!transactionId) return;
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/${transactionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        const textRes = await res.text();
        let resData;
        try {
          resData = JSON.parse(textRes);
        } catch {
          throw new Error("Respon server bukan format JSON yang valid.");
        }

        if (!res.ok) {
          throw new Error(resData.message || "Gagal memuat detail transaksi.");
        }

        const item = resData.data;
        if (item) {
          setTitle(item.Catatan_Transaksi || "");
          setCategory(item.kategori || "Makanan");
          setSource(item.Sumber_Dana || "Gopay");
          setAmount(String(item.nominal || ""));
          if (item.tanggal) {
            setDate(item.tanggal.split("T")[0]);
          }
          setType(item.tipe || "pengeluaran");
        }
      } catch (err: unknown) {
        const errorObj = err as Error;
        setError(errorObj.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailTransaksi();
  }, [transactionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return;
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/${transactionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            Catatan_Transaksi: title,
            tipe: type,
            kategori: category,
            Sumber_Dana: source,
            nominal: Number(amount),
            tanggal: date ? new Date(date) : new Date(),
          }),
        }
      );

      const textRes = await res.text();
      let resData;
      try {
        resData = JSON.parse(textRes);
      } catch {
        throw new Error("Respon server bukan format JSON yang valid.");
      }

      if (!res.ok) {
        throw new Error(resData.message || "Gagal memperbarui transaksi.");
      }

      if (onSwitchToTransaction) {
        onSwitchToTransaction();
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || "Gagal menyimpan perubahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transactionId) return;
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/${transactionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        const textRes = await res.text();
        console.log("RAW RESPONSE DARI SERVER:", textRes); 

        let resData;
        try {
          resData = JSON.parse(textRes);
        } catch {
          throw new Error(`Server merespons bukan JSON. Isi respons: "${textRes}"`);
        }

        if (!res.ok) {
          throw new Error(resData.message || "Gagal memuat detail transaksi.");
        }

        if (onSwitchToTransaction) {
          onSwitchToTransaction();
        }
      } catch (err: unknown) {
        const errorObj = err as Error;
        setError(errorObj.message || "Terjadi kesalahan saat menghapus.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative w-full h-full p-6 py-10 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="lg:max-w-6xl lg:mx-auto lg:w-full flex flex-col gap-4">

      <Header
              title="Catatan Keuangan"
              onOpenSidebar={() => setIsSidebarOpen(true)}
               onProfileClick={() => router.push("/?mode=profile-edit")}
            />

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

      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-xl backdrop-blur-sm">
          {error}
        </div>
      )}

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
            <label className="text-xs text-white/80 font-medium">Tipe Transaksi</label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#101828]/50 border border-slate-700 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2EC4B6] appearance-none pr-10 cursor-pointer"
              >
                <option value="pengeluaran">Pengeluaran</option>
                <option value="pemasukan">Pemasukan</option>
              </select>
              <span className="material-icons absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none text-lg">
                expand_more
              </span>
            </div>
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
                <option value="Tabungan">Tabungan</option>
                <option value="Lainnya">Lainnya</option>
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
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#2EC4B6] text-[#0A2E2A] text-sm font-bold hover:bg-[#28b3a6] transition-colors cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="w-full py-3.5 rounded-full bg-[#E74C3C] text-white text-sm font-bold hover:bg-[#d63b2b] transition-colors cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Hapus Transaksi"}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}