'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';

export default function Pengeluaran() {
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
            <div className="">
                <form action="">
                <div className="border-2 border-white/4 rounded-3xl bg-white/5 mb-4">
                    <div className="p-4">
                        <div className="text-sm"> 
                            <div className="flex flex-col gap-2">
                                <div className="px-2">
                                    <div className="text-xs font-semibold">Catatan Transaksi</div>
                                    <input 
                                        type="text"
                                        className="border border-white/15 rounded-full my-1 w-full text-xs px-3 p-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                        placeholder="Masukkan Catatan Transaksi"
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
                                        className="border border-white/15 rounded-full my-1 w-full text-xs px-3 p-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                        placeholder="Masukkan Nominal"
                                    />
                                </div>

                                <div className="px-2">
                                    <div className="text-xs font-semibold">Tanggal</div>
                                    <input 
                                        type="date"
                                        className="border border-white/15 rounded-full my-1 w-full text-xs px-3 p-1.5 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                        placeholder="Masukkan Catatan Transaksi"
                                    />
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

  );
}