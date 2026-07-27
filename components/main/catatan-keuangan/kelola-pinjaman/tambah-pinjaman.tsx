'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';

interface TambahPinjamanProps {
  onSwitchToKelolaPinjaman: () => void;
}

    export default function TambahPinjaman({ onSwitchToKelolaPinjaman }: TambahPinjamanProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
        const [selectedCategory, setSelectedCategory] = useState("");
        const [selectedSumberDana, setSelectedSumberDana] = useState("");
    
        const categories = [
            { id: "makanan", name: "Makanan & Minuman" },
            { id: "transport", name: "Transportasi" },
            { id: "belanja", name: "Belanja" },
            { id: "tagihan", name: "Cicilan" },
            { id: "hiburan", name: "Hiburan" },
        ];
    
        const sumberDana = [
            { id: "freelance", name: "Freelance" },
            { id: "uangsaku", name: "Uang Saku" },
            { id: "dana", name: "DANA" },
        ];
        

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

            <div className="flex flex-row gap-5 items-center">
                <button 
                type="button"
                onClick={onSwitchToKelolaPinjaman}
                className="flex items-center justify-center w-8 h-8 bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors shrink-0"
                >
                <span className="material-icons text-lg text-white leading-none">arrow_back</span>
                </button>
                <div className="text-lg font-semibold leading-none">Tambah Pinjaman</div>
            </div>

            <div className="">
                <form action="">
                <div className="border-2 border-white/4 rounded-3xl bg-white/5 mb-4">
                    <div className="p-4">
                        <div className="text-sm"> 
                            <div className="flex flex-col gap-2">
                                <div className="px-2">
                                    <div className="px-2">
                                        <label className="text-xs text-gray-300 mb-1 block font-semibold">Nama Platform</label>
                                        <div className="relative">
                                            <select 
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3 py-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                                                    selectedCategory === "" ? "text-white/50" : "text-white"
                                                }`}
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
                                        <label className="text-xs text-gray-300 mb-1 block font-semibold">Jenis Pinjaman</label>
                                        <div className="relative">
                                            <select 
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3 py-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                                                    selectedCategory === "" ? "text-white/50" : "text-white"
                                                }`}
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
                                    
                                    <div className="text-xs font-semibold">Total Pinjaman</div>
                                        <input 
                                            type="text"
                                            className="border border-white/15 rounded-full my-1 w-full text-xs px-3 p-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                            placeholder="Masukkan Catatan Transaksi"
                                        />
                                    </div>

                                    <div className="px-2">
                                        <label className="text-xs text-gray-300 mb-1 block font-semibold">Tenor Cicilan</label>
                                        <div className="relative">
                                            <select 
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3 py-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                                                    selectedCategory === "" ? "text-white/50" : "text-white"
                                                }`}
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
                                        <div className="text-xs font-semibold">Cicilan Perbulan</div>
                                        <input 
                                            type="text"
                                            className="border border-white/15 rounded-full my-1 w-full text-xs px-3 p-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                            placeholder="Masukkan Catatan Transaksi"
                                        />
                                    </div>

                                    <div className="px-2">
                                        <div className="text-xs font-semibold">Total yang Harus Dibayar</div>
                                        <input 
                                            type="text"
                                            className="border border-white/15 rounded-full my-1 w-full text-xs px-3 p-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                            placeholder="Masukkan Catatan Transaksi"
                                        />
                                    </div>

                                    <div className="px-2">
                                        <div className="text-xs font-semibold">Total yang Harus Dibayar</div>
                                        <input 
                                            type="date"
                                            className="border border-white/15 rounded-full my-1 w-full text-xs px-3 p-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                            placeholder="Masukkan Catatan Transaksi"
                                        />
                                    </div>

                                    <div className="px-2">
                                        <label className="text-xs text-gray-300 mb-1 block font-semibold">Status Pinjaman</label>
                                        <div className="relative">
                                            <select 
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3 py-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                                                    selectedCategory === "" ? "text-white/50" : "text-white"
                                                }`}
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
                            </div>
                        </div>
                    </div>
               </div> 

                <div className="w-full bg-[#2EC4B6] p-3 rounded-full text-sm font-extrabold text-center text-[#101828]">
                    Simpan
                </div>
                </form>
            </div>
        </div>
  );
}