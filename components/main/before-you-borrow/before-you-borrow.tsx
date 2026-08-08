'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../sidebar';

interface HasilAsesmen {
  score: number;
  riskLevel: "Rendah" | "Sedang" | "Tinggi";
  alasan: string;
  rekomendasi: string;
  saranAlternatif: string;
}

const TUJUAN_OPTIONS = [
  { id: "kebutuhan-mendesak", name: "Kebutuhan Mendesak" },
  { id: "modal-usaha", name: "Modal Usaha" },
  { id: "pendidikan", name: "Pendidikan" },
  { id: "konsumtif", name: "Konsumtif" },
  { id: "lainnya", name: "Lainnya" },
];

export default function BeforeYouBorrow() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [namaPlatform, setNamaPlatform] = useState<string>("");
  const [tujuanMeminjam, setTujuanMeminjam] = useState<string>("");
  const [jumlahPinjaman, setJumlahPinjaman] = useState<string>("");
  const [pemasukanPerbulan, setPemasukanPerbulan] = useState<string>("");
  const [pengeluaranPerbulan, setPengeluaranPerbulan] = useState<string>("");
  const [nominalDibayarSaatIni, setNominalDibayarSaatIni] = useState<string>("");

  const [hasilAsesmen, setHasilAsesmen] = useState<HasilAsesmen | null>(null);

  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (name: string) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

  const hitungAsesmen = (): HasilAsesmen => {
    const pemasukan = parseFloat(pemasukanPerbulan) || 0;
    const pengeluaran = parseFloat(pengeluaranPerbulan) || 0;
    const cicilanSaatIni = parseFloat(nominalDibayarSaatIni) || 0;

    const sisaPemasukan = pemasukan - pengeluaran;
    const rasioBeban = pemasukan > 0 ? (cicilanSaatIni / pemasukan) * 100 : 100;

    let score = 100;
    score -= Math.min(rasioBeban, 60);
    if (sisaPemasukan <= 0) score -= 20;

    score = Math.max(0, Math.min(100, Math.round(score)));

    let riskLevel: HasilAsesmen["riskLevel"] = "Rendah";
    let alasan = "Rasio cicilan terhadap penghasilan bulananmu masih tergolong sehat, dan sisa penghasilan setelah pengeluaran masih positif.";
    let rekomendasi = "Kamu masih memiliki ruang untuk mengambil pinjaman ini selama pembayaran dilakukan tepat waktu setiap bulan.";
    let saranAlternatif = "Pertimbangkan menyisihkan dana darurat sebelum menambah cicilan baru.";

    if (score < 70 && score >= 40) {
      riskLevel = "Sedang";
      alasan = "Beban cicilan terhadap penghasilan bulananmu cukup signifikan, sehingga ruang gerak keuanganmu menjadi lebih terbatas.";
      rekomendasi = "Pertimbangkan untuk menurunkan nominal pinjaman atau memperpanjang tenor agar cicilan bulanan lebih ringan.";
      saranAlternatif = "Coba bandingkan dengan platform lain yang menawarkan bunga lebih rendah untuk kebutuhan yang sama.";
    } else if (score < 40) {
      riskLevel = "Tinggi";
      alasan = "Total pengeluaran dan cicilanmu saat ini mendekati atau melebihi penghasilan bulanan, sehingga risiko gagal bayar meningkat.";
      rekomendasi = "Sebaiknya tunda pengajuan pinjaman baru sampai rasio pengeluaran terhadap penghasilan membaik.";
      saranAlternatif = "Pertimbangkan opsi non-pinjaman terlebih dahulu, seperti menabung bertahap atau mencari sumber penghasilan tambahan.";
    }

    return { score, riskLevel, alasan, rekomendasi, saranAlternatif };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasil = hitungAsesmen();
    setHasilAsesmen(hasil);
    setOpenSection(null);
  };

  const riskColor = {
    Rendah: { text: "text-[#2EC4B6]", bg: "bg-[#2EC4B6]/10", ring: "#2EC4B6" },
    Sedang: { text: "text-[#F5A623]", bg: "bg-[#F5A623]/10", ring: "#F5A623" },
    Tinggi: { text: "text-red-400", bg: "bg-red-400/10", ring: "#F87171" },
  };

  const activeRisk = hasilAsesmen ? riskColor[hasilAsesmen.riskLevel] : riskColor.Sedang;
  const displayScore = hasilAsesmen ? hasilAsesmen.score : 68;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const segmentGap = 10;
  const segmentLength = circumference / 4 - segmentGap;
  const filledSegments = Math.round((displayScore / 100) * 4);

  const detailSections = [
    { key: "alasan", label: "Alasan Penilaian", content: hasilAsesmen?.alasan },
    { key: "rekomendasi", label: "Rekomendasi", content: hasilAsesmen?.rekomendasi },
    { key: "saran", label: "Saran Alternatif", content: hasilAsesmen?.saranAlternatif },
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
            className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-icons text-2xl select-none">menu</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Before You Borrow</h1>
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

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="border border-white/10 rounded-3xl bg-white/5 p-5">
          <div className="flex flex-col gap-4">

            <div>
              <div className="text-sm font-semibold pb-1">Asesmen Pinjaman</div>
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Nama Platform</label>
              <input
                type="text"
                value={namaPlatform}
                onChange={(e) => setNamaPlatform(e.target.value)}
                className="border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                placeholder="Contoh: Shopee PayLater, EasyCash"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Tujuan Meminjam</label>
              <div className="relative">
                <select
                  value={tujuanMeminjam}
                  onChange={(e) => setTujuanMeminjam(e.target.value)}
                  className={`appearance-none border border-white/15 rounded-full w-full text-xs px-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors cursor-pointer pr-8 ${
                    tujuanMeminjam === "" ? "text-white/50" : "text-white"
                  }`}
                  required
                >
                  <option value="" disabled hidden>Pilih Tujuan Meminjam</option>
                  {TUJUAN_OPTIONS.map((item) => (
                    <option key={item.id} value={item.id} className="bg-[#101828] text-white">
                      {item.name}
                    </option>
                  ))}
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">
                  expand_more
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Jumlah Pinjaman</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-white/50 pointer-events-none">Rp</span>
                <input
                  type="number"
                  value={jumlahPinjaman}
                  onChange={(e) => setJumlahPinjaman(e.target.value)}
                  className="border border-white/15 rounded-full w-full text-xs pl-8 pr-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                  placeholder="Contoh: 300.000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-300 mb-1 block font-semibold">Pemasukan Perbulan</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-white/50 pointer-events-none">Rp</span>
                  <input
                    type="number"
                    value={pemasukanPerbulan}
                    onChange={(e) => setPemasukanPerbulan(e.target.value)}
                    className="border border-white/15 rounded-full w-full text-xs pl-8 pr-3 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                    placeholder="Rp"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-300 mb-1 block font-semibold">Pengeluaran Perbulan</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-white/50 pointer-events-none">Rp</span>
                  <input
                    type="number"
                    value={pengeluaranPerbulan}
                    onChange={(e) => setPengeluaranPerbulan(e.target.value)}
                    className="border border-white/15 rounded-full w-full text-xs pl-8 pr-3 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                    placeholder="Rp"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block font-semibold">Nominal Pinjaman yang Harus Dibayar Saat Ini</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-white/50 pointer-events-none">Rp</span>
                <input
                  type="number"
                  value={nominalDibayarSaatIni}
                  onChange={(e) => setNominalDibayarSaatIni(e.target.value)}
                  className="border border-white/15 rounded-full w-full text-xs pl-8 pr-3.5 py-2 bg-[#101828] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/50 text-white"
                  placeholder="Contoh: 300.000"
                />
              </div>
            </div>

          </div>
        </div>

        <button
          type="submit"
          className="flex flex-row w-full bg-[#2EC4B6] hover:bg-[#28b0a3] p-3 rounded-full text-sm font-extrabold text-center text-[#101828] transition-colors cursor-pointer items-center gap-1.5 justify-center"
        >
          <span
            className="material-icons select-none leading-none text-[15px] shrink-0"
            style={{ fontSize: '15px', width: '15px', height: '15px' }}
          >
            bar_chart
          </span>
          Dapatkan Asesmen
        </button>
      </form>

      <div className="border border-white/10 rounded-3xl bg-white/5 p-6 flex flex-col gap-5">
        <div className="text-base font-bold">Your Borrowing Score</div>

        <div className="flex justify-center py-2">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              {[0, 1, 2, 3].map((i) => {
                const dashOffset = -(i * (segmentLength + segmentGap));
                const isFilled = i < (hasilAsesmen ? filledSegments : 3);
                return (
                  <circle
                    key={i}
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={isFilled ? activeRisk.ring : "rgba(255,255,255,0.1)"}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                    strokeDashoffset={dashOffset}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold">{displayScore}</span>
              <span className="text-[10px] text-white/50">/ 100</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className={`px-5 py-1.5 rounded-full text-xs font-bold ${activeRisk.bg} ${activeRisk.text}`}>
            Risiko {hasilAsesmen ? hasilAsesmen.riskLevel : "Sedang"}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {detailSections.map((section) => {
            const isOpen = openSection === section.key;
            return (
              <div key={section.key} className="border border-white/10 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span>{section.label}</span>
                  <span className={`material-icons text-base transition-transform duration-300 select-none ${isOpen ? 'rotate-180 text-[#2EC4B6]' : 'text-gray-500'}`}>
                    expand_more
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 text-xs text-white/70 text-justify leading-relaxed">
                      {section.content || "Isi form dan klik \"Dapatkan Asesmen\" untuk melihat detail ini."}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}