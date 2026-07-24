"use client";

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';

interface ConditiontProps {
  email: string;
  onNext: () => void;
  onSkip: () => void;
  onSwitchToLogin: () => void;
}

export default function ConditionComponent({ 
  email, 
  onNext, 
  onSkip, 
  onSwitchToLogin 
}: ConditiontProps) {
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState("");
  const [sumberPemasukan, setSumberPemasukan] = useState("");

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
    <div className="w-full min-h-screen bg-[#101828] relative overflow-hidden">
      
      <div className="absolute top-6 left-0 right-0 w-full px-8">
        <div className="w-full">
          <div className="w-10 h-10 mb-4"> 
            <div 
              onClick={onSwitchToLogin}
              className="flex items-center justify-center w-full h-full bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <span className="material-icons text-lg text-white">arrow_back</span>
            </div>
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
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-400 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#2EC4B6] focus-within:border-transparent transition-all">
              <input 
                type="text" 
                name="sumberpemasukan" 
                value={sumberPemasukan}
                onChange={(e) => setSumberPemasukan(e.target.value)}
                placeholder="Contoh: Orang tua, Part time, dll" 
                className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                required 
              />
            </div>
          </div>
        </form>
      </div>

      <div className="absolute bottom-12 left-0 right-0 w-full px-8 flex flex-col gap-3">
        <button
          type="submit"
          form="condition-form" 
          disabled={loading}
          className="w-full py-3 bg-[#2EC4B6] hover:bg-[#23a89b] text-[#101828] font-bold rounded-full shadow-lg shadow-blue-950/50 transition-all active:scale-[0.98] cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
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