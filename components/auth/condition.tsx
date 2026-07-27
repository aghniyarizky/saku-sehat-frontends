"use client";

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';

interface ConditionProps {
  email: string;
  onNext: () => void;
  onSkip: () => void;
  onSwitchToProfileAuth: () => void;
}

export default function ConditionComponent({ 
  email, 
  onNext, 
  onSkip, 
  onSwitchToProfileAuth 
}: ConditionProps) {
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState("");
  const [sumberPemasukan, setSumberPemasukan] = useState("");

  const sumberPemasukanList = [
    { id: "1", name: "Orang Tua/Wali" },
    { id: "2", name: "Beasiswa" },
    { id: "3", name: "Gaji Part Time" },
    { id: "4", name: "Magang" },
    { id: "5", name: "Freelance" },
    { id: "6", name: "Usaha/Bisnis" },
    { id: "7", name: "Investasi" },
    { id: "8", name: "Pasangan/Keluarga" },
    { id: "9", name: "Lainnya" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setTimeout(() => {
        setLoading(false);
        onNext();
      }, 1000);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#101828] relative overflow-hidden flex flex-col justify-between p-8">
      <div className="w-full">
        <div className="w-10 h-10 mb-4"> 
          <button 
            type="button"
            onClick={onSwitchToProfileAuth}
            className="flex items-center justify-center w-full h-full bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <span className="material-icons text-lg text-white leading-none">arrow_back</span>
          </button>
        </div>

        <div className="mt-6">
          <div className="w-full flex justify-between items-center gap-1 mb-2">
            <div className="w-1/2">
              <div className="p-1 bg-[#2EC4B6] rounded-full"></div>
            </div>
            <div className="w-1/2">
              <div className="p-1 bg-[#2EC4B6] rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white text-xs font-medium">Informasi Keuangan</span>
            <span className="text-white text-xs font-medium text-end">Langkah 2 dari 2</span>
          </div>
        </div>

        <div className="w-full text-start mt-6">
          <h2 className="bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-3xl font-extrabold tracking-tight leading-snug">
            Mulai Dari <br />
            <span className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent">
              Kondisimu!
            </span>
          </h2>

          <p className="text-sm mt-2 text-gray-300 font-medium leading-relaxed">
            Ceritain sedikit kondisi keuanganmu, dipakai buat bikin rekomendasi yang sesuai sama kebutuhanmu.
          </p>
        </div>

        <form id="condition-form" onSubmit={handleSubmit} className="w-full flex flex-col gap-4 my-6">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold tracking-wider text-white">
              Uang Saku Perbulan
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-400 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#2EC4B6] focus-within:border-transparent transition-all">
              <input 
                type="number" 
                name="income" 
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Contoh: 5000000" 
                className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                required 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold tracking-wider text-white">
              Sumber Pemasukan 
            </label>
            <div className="relative flex items-center px-4 py-2.5 rounded-full border border-gray-400 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#2EC4B6] focus-within:border-transparent transition-all">
              <select 
                name="sumberpemasukan" 
                value={sumberPemasukan}
                onChange={(e) => setSumberPemasukan(e.target.value)}
                className={`w-full bg-transparent px-2 text-xs focus:outline-none appearance-none cursor-pointer pr-6 ${
                  sumberPemasukan === "" ? "text-gray-400" : "text-white"
                }`}
                required 
              >
                <option value="" disabled hidden className="bg-[#101828] text-gray-400">
                  Pilih Sumber Pemasukan
                </option>
                {sumberPemasukanList.map((item) => (
                  <option key={item.id} value={item.name} className="bg-[#101828] text-white">
                    {item.name}
                  </option>
                ))}
              </select>
              <span className="material-icons absolute right-4 text-gray-400 pointer-events-none text-base">
                expand_more
              </span>
            </div>
          </div>

        </form>
      </div>

      <div className="w-full flex flex-col gap-3 pt-6">
        <button
          type="submit"
          form="condition-form" 
          disabled={loading}
          className="w-full py-3 bg-[#2EC4B6] hover:bg-[#23a89b] text-[#101828] font-bold text-sm rounded-full shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? "Menyimpan..." : "Lanjut"}
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="w-full py-3 text-sm text-[#2EC4B6] bg-transparent border border-[#2EC4B6] hover:border-gray-400 font-semibold rounded-full transition-all cursor-pointer"
        >
          Lewati
        </button>
      </div>

    </div>
  );
}