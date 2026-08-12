'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';

interface PemasukanProps {
  onSuccess?: () => void;
}

export default function Pemasukan({ onSuccess }: PemasukanProps) {
    const [catatanTransaksi, setCatatanTransaksi] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSumberDana, setSelectedSumberDana] = useState("");
    const [nominal, setNominal] = useState("");
    const [tanggal, setTanggal] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const categories = [
        { id: "Uang-Saku", name: "Uang Saku" },
        { id: "Part-time", name: "Part-time" },
        { id: "Freelance", name: "Freelance" },
        { id: "Beasiswa", name: "Beasiswa" },
        { id: "Bisnis Kecil", name: "Bisnis Kecil" },
        { id: "Lainnya", name: "Lainnya" },
    ];

    const sumberDana = [
        { id: "Tunai", name: "Tunai" },
        { id: "Gopay", name: "Gopay" },
        { id: "DANA", name: "DANA" },
        { id: "ShopeePay", name: "ShopeePay" },
        { id: "Bank Mandiri", name: "Bank Mandiri" },
        { id: "BSI", name: "BSI" },
        { id: "BRI", name: "BRI" },
        { id: "BTN", name: "BTN" },
        { id: "BSA", name: "BSA" },
        { id: "OVO", name: "OVO" },
        { id: "Lainnya", name: "Lainnya" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/transaksi`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    Catatan_Transaksi: catatanTransaksi,
                    tipe: "pemasukan", 
                    kategori: selectedCategory,
                    Sumber_Dana: selectedSumberDana,
                    nominal: Number(nominal),
                    tanggal: tanggal || undefined,
                }),
            });

            const teksResponse = await response.text();

            if (!response.ok) {
                console.error("ISI ERROR TAMBAH PEMASUKAN DARI SERVER:", teksResponse);
                try {
                    const parsedError = JSON.parse(teksResponse);
                    throw new Error(parsedError.message || "Gagal menyimpan transaksi.");
                } catch {
                    throw new Error("Terjadi kesalahan pada server backend.");
                }
            }

            setSuccess(true);
            setCatatanTransaksi("");
            setSelectedCategory("");
            setSelectedSumberDana("");
            setNominal("");
            setTanggal("");

            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            {error && (
                <div className="p-3 mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-xl backdrop-blur-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 mb-4 text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-900 rounded-xl backdrop-blur-sm">
                    Transaksi pemasukan berhasil disimpan!
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="border-2 border-white/4 rounded-3xl bg-white/5 mb-4">
                    <div className="p-4">
                        <div className="text-sm"> 
                            <div className="flex flex-col gap-2">
                                <div className="px-2">
                                    <div className="text-xs font-semibold">Catatan Transaksi</div>
                                    <input 
                                        type="text"
                                        value={catatanTransaksi}
                                        onChange={(e) => setCatatanTransaksi(e.target.value)}
                                        className="border border-white/15 rounded-full my-1 w-full text-xs px-3 p-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                        placeholder="Masukkan Catatan Transaksi"
                                        required
                                    />
                                </div>

                                <div className="px-2">
                                    <label className="text-xs text-gray-300 mb-1 block font-semibold">Kategori</label>
                                    <div className="relative">
                                        <select 
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3 py-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                                                selectedCategory === "" ? "text-white/50" : "text-white"
                                            }`}
                                            required
                                        >
                                            <option value="" disabled hidden>Pilih Kategori Transaksi</option>
                                            
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id} className="bg-[#101828] text-white">
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>

                                        <span className="material-icons absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                <div className="px-2">
                                    <label className="text-xs text-gray-300 mb-1 block font-semibold">Sumber Dana</label>
                                    <div className="relative">
                                        <select 
                                            value={selectedSumberDana}
                                            onChange={(e) => setSelectedSumberDana(e.target.value)}
                                            className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3 py-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                                                selectedSumberDana === "" ? "text-white/50" : "text-white"
                                            }`}
                                            required
                                        >
                                            <option value="" disabled hidden>Pilih Sumber Dana</option>
                                            
                                            {sumberDana.map((dana) => (
                                                <option key={dana.id} value={dana.id} className="bg-[#101828] text-white">
                                                    {dana.name}
                                                </option>
                                            ))}
                                        </select>

                                        <span className="material-icons absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                <div className="px-2">
                                    <div className="text-xs font-semibold">Nominal</div>
                                    <input 
                                        type="text"
                                        inputMode="numeric"
                                        value={nominal}
                                        onChange={(e) => setNominal(e.target.value.replace(/[^0-9]/g, ""))}
                                        className="border border-white/15 rounded-full my-1 w-full text-xs px-3 p-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                        placeholder="Masukkan Nominal"
                                        required
                                    />
                                </div>

                                <div className="px-2">
                                    <div className="text-xs font-semibold">Tanggal</div>
                                    <input 
                                        type="date"
                                        value={tanggal}
                                        onChange={(e) => setTanggal(e.target.value)}
                                        className="border border-white/15 rounded-full my-1 w-full text-xs px-3 p-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2EC4B6] hover:bg-[#28b0a3] p-3 rounded-full text-sm font-extrabold text-center text-[#101828] transition-colors cursor-pointer disabled:bg-gray-600"
                >
                    {loading ? "Menyimpan..." : "Simpan"}
                </button>
            </form>
        </div>
    );
}