'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../sidebar';

interface MetricData {
  key: string;
  title: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  score: number;
  maxScore: number;
  barColor: string;
  scoreColor: string;
  nilaiLabel: string;
  badge: string;
  badgeColor: string;
  deskripsi: string;
  saran?: string[];
}

interface FinancialHealthData {
  totalScore: number;
  maxScore: number;
  grade: string;
  gradeColor: string;
  ringColor: string;
  statusText: string;
  lastUpdate: string;
  metrics: MetricData[];
}

// TODO: ganti data placeholder ini dengan hasil fetch dari BE saat endpoint sudah siap
// contoh: const { data } = await axios.get(`${API_URL}/api/financial-health`);
const DUMMY_DATA: FinancialHealthData = {
  totalScore: 87,
  maxScore: 100,
  grade: "Grade A",
  gradeColor: "text-[#34D399]",
  ringColor: "#34D399",
  statusText: "Kondisi Keuanganmu Hampir Sehat! 🎉",
  lastUpdate: "26/05/26 13:45",
  metrics: [
    {
      key: "target-nabung",
      title: "Target Nabung",
      icon: "savings",
      iconBg: "bg-[#34D399]/15",
      iconColor: "text-[#34D399]",
      score: 25,
      maxScore: 25,
      barColor: "bg-[#34D399]",
      scoreColor: "text-[#34D399]",
      nilaiLabel: "Nilai kamu: 58%",
      badge: "Excellent",
      badgeColor: "bg-[#34D399]/15 text-[#34D399]",
      deskripsi: "Kamu berhasil menyisihkan 58% dari pemasukan untuk ditabung. Pertahankan ya, ini bisa jadi dana darurat atau buat mencapai target finansialmu.",
    },
    {
      key: "disiplin-anggaran",
      title: "Disiplin Anggaran",
      icon: "track_changes",
      iconBg: "bg-red-500/15",
      iconColor: "text-red-400",
      score: 17,
      maxScore: 25,
      barColor: "bg-[#2EC4B6]",
      scoreColor: "text-[#2EC4B6]",
      nilaiLabel: "Nilai kamu: 5 dari 6 kategori",
      badge: "Good",
      badgeColor: "bg-[#2EC4B6]/15 text-[#2EC4B6]",
      deskripsi: "Semua pengeluaran bulan ini masih sesuai dengan batas anggaran yang kamu buat. Mantap, berarti kamu cukup disiplin dalam mengatur pengeluaran.",
      saran: [
        "Tetap catat setiap pengeluaran sekecil apa pun.",
        "Sisihkan uang tabungan di awal bulan, bukan di akhir.",
        "Kalau ada sisa budget, simpan ke tabungan daripada dihabiskan.",
      ],
    },
    {
      key: "pengelolaan-pinjaman",
      title: "Pengelolaan Pinjaman",
      icon: "credit_card",
      iconBg: "bg-white/10",
      iconColor: "text-white/80",
      score: 17,
      maxScore: 25,
      barColor: "bg-[#F5A623]",
      scoreColor: "text-[#F5A623]",
      nilaiLabel: "Nilai kamu: 40% dari pemasukan",
      badge: "Good",
      badgeColor: "bg-[#2EC4B6]/15 text-[#2EC4B6]",
      deskripsi: "Sekitar 40% pemasukanmu masih digunakan untuk membayar cicilan. Masih aman, tapi usahakan jangan bertambah supaya keuangan tetap sehat.",
      saran: [
        "Prioritaskan melunasi utang dengan bunga paling tinggi.",
        "Tunda ambil pinjaman baru kalau belum benar-benar perlu.",
        "Kalau ada uang lebih, coba bayar cicilan lebih awal.",
      ],
    },
  ],
};

export default function FinancialHealth() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const data = DUMMY_DATA;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = data.totalScore / data.maxScore;
  const dashOffset = circumference * (1 - progress);

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
            className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-icons text-2xl select-none">menu</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Financial Health</h1>
        </div>

        <div className="flex flex-row items-center gap-3">
          <button type="button" className="relative flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span className="material-icons text-xl select-none">notifications</span>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <button type="button" className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
            <span className="material-icons text-xl select-none">account_circle</span>
          </button>
        </div>
      </div>

      <div className="border border-white/10 rounded-3xl bg-white/5 p-6 flex flex-col items-center gap-2">
        <div className="relative w-44 h-44">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="9"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={data.ringColor}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold">{data.totalScore}</span>
            <span className="text-xs text-white/50">/ {data.maxScore}</span>
          </div>
        </div>

        <div className={`text-2xl font-extrabold ${data.gradeColor}`}>{data.grade}</div>
        <div className="text-sm font-semibold text-white text-center">{data.statusText}</div>
        <div className="text-xs text-white/40">Terakhir di update {data.lastUpdate}</div>
      </div>

      {data.metrics.map((metric) => {
        const barPercent = Math.min(100, (metric.score / metric.maxScore) * 100);
        return (
          <div key={metric.key} className="border border-white/10 rounded-3xl bg-white/5 p-6 flex flex-col gap-3">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                <div className={`flex items-center justify-center p-2.5 aspect-square rounded-full shrink-0 ${metric.iconBg}`}>
                  <span className={`material-icons select-none leading-none ${metric.iconColor}`}>
                    {metric.icon}
                  </span>
                </div>
                <div className="text-sm font-bold">{metric.title}</div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-lg font-extrabold ${metric.scoreColor}`}>{metric.score}</span>
                <span className="text-[10px] text-white/40">/ {metric.maxScore} pts</span>
              </div>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${metric.barColor}`}
                style={{ width: `${barPercent}%` }}
              />
            </div>

            <div className="flex flex-row items-center justify-between">
              <span className="text-[11px] text-white/40">{metric.nilaiLabel}</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${metric.badgeColor}`}>
                {metric.badge}
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-xs text-white/70 leading-relaxed">
                {metric.deskripsi}
              </div>
            </div>

            {metric.saran && metric.saran.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <div className="text-[10px] font-bold text-white/40 tracking-wide">SARAN PERKEMBANGAN</div>
                <div className="flex flex-col gap-1.5">
                  {metric.saran.map((item, idx) => (
                    <div key={idx} className="flex flex-row items-start gap-2">
                      <span
                        className="material-icons select-none leading-none text-[#2EC4B6] shrink-0 mt-0.5"
                        style={{ fontSize: '13px', width: '13px', height: '13px' }}
                      >
                        check
                      </span>
                      <span className="text-xs text-white/70 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

    </div>
  );
}