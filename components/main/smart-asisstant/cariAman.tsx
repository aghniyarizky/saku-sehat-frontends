'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../sidebar';

interface HasilAnalisis {
  skorBahaya: number;
  deskripsi: string;
  rekomendasi: string | null;
}

export default function CariAman() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [pesan, setPesan] = useState<string>("");
  const [hasilAnalisis, setHasilAnalisis] = useState<HasilAnalisis | null>(null);

  // TODO: ganti logic ini dengan pemanggilan API BE saat endpoint sudah siap
  // contoh: const { data } = await axios.post(`${API_URL}/api/cari-aman/analisis`, { pesan });
  const KATA_KUNCI_MENCURIGAKAN = [
    "segera", "mendesak", "cair cepat", "tanpa jaminan", "tanpa bi checking",
    "klik link", "transfer dulu", "biaya admin", "data ktp", "menang undian",
    "hadiah", "limit tinggi", "bunga rendah", "proses cepat", "verifikasi akun",
  ];

  const analisisPesan = (teks: string): HasilAnalisis => {
    const lower = teks.toLowerCase();
    const cocok = KATA_KUNCI_MENCURIGAKAN.filter((kw) => lower.includes(kw));

    const skorBahaya = Math.min(100, cocok.length * 22 + (cocok.length > 0 ? 15 : 5));

    let deskripsi = "Pesan tidak menunjukkan indikasi mencurigakan yang signifikan berdasarkan pola umum penipuan pinjaman online.";
    let rekomendasi: string | null = null;

    if (skorBahaya >= 60) {
      deskripsi = "Pesan menunjukkan beberapa indikasi yang patut diwaspadai, seperti penggunaan bahasa yang mendesak dan penawaran pinjaman tanpa informasi yang jelas mengenai legalitas penyedia layanan.";
      rekomendasi = "JANGAN mengajukan pinjaman sebelum memastikan legalitas penyedia melalui daftar resmi OJK. Hindari memberikan data pribadi maupun melakukan transaksi apabila identitas penyedia tidak dapat diverifikasi.";
    } else if (skorBahaya >= 30) {
      deskripsi = "Pesan memiliki beberapa ciri yang umum ditemukan pada penawaran pinjaman, namun belum cukup kuat untuk dipastikan sebagai penipuan. Tetap perlu kehati-hatian.";
      rekomendasi = "Verifikasi nama platform di daftar penyelenggara fintech lending berizin OJK sebelum melanjutkan komunikasi lebih jauh.";
    }

    return { skorBahaya, deskripsi, rekomendasi };
  };

  const handleAnalisis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesan.trim()) return;
    setHasilAnalisis(analisisPesan(pesan));
  };

  const skorColor = hasilAnalisis
    ? hasilAnalisis.skorBahaya >= 60
      ? "text-red-400"
      : hasilAnalisis.skorBahaya >= 30
      ? "text-[#F5A623]"
      : "text-[#2EC4B6]"
    : "text-[#F5A623]";

  const barColor = hasilAnalisis
    ? hasilAnalisis.skorBahaya >= 60
      ? "bg-red-400"
      : hasilAnalisis.skorBahaya >= 30
      ? "bg-[#F5A623]"
      : "bg-[#2EC4B6]"
    : "bg-[#F5A623]";

  const displaySkor = hasilAnalisis ? hasilAnalisis.skorBahaya : 60;
  const displayDeskripsi = hasilAnalisis
    ? hasilAnalisis.deskripsi
    : "Pesan menunjukkan beberapa indikasi yang patut diwaspadai, seperti penggunaan bahasa yang mendesak dan penawaran pinjaman tanpa informasi yang jelas mengenai legalitas penyedia layanan.";
  const displayRekomendasi = hasilAnalisis
    ? hasilAnalisis.rekomendasi
    : "JANGAN mengajukan pinjaman sebelum memastikan legalitas penyedia melalui daftar resmi OJK. Hindari memberikan data pribadi maupun melakukan transaksi apabila identitas penyedia tidak dapat diverifikasi.";

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
          <h1 className="text-xl font-bold tracking-tight">Smart Assistant</h1>
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

      <div className="flex flex-row gap-2">
        <button
          type="button"
          onClick={() => router.push("/?mode=temanhemat")}
          className="flex flex-row items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <span className="material-icons select-none leading-none" style={{ fontSize: '14px', width: '14px', height: '14px' }}>
            chat_bubble
          </span>
          Teman Hemat
        </button>
        <button
          type="button"
          className="flex flex-row items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#2EC4B6] text-[#101828] cursor-pointer"
        >
          <span className="material-icons select-none leading-none" style={{ fontSize: '14px', width: '14px', height: '14px' }}>
            shield
          </span>
          Cari Aman
        </button>
      </div>

      <form onSubmit={handleAnalisis} className="w-full space-y-4">
        <div className="border border-white/10 rounded-3xl bg-white/5 p-5">
          <div className="flex flex-col gap-3">
            <label className="text-xs text-gray-300 font-semibold">Tempel pesan mencurigakan</label>
            <textarea
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              rows={5}
              className="border border-white/15 rounded-2xl w-full text-xs px-4 py-3 bg-[#0b0f19] focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/40 text-white resize-none"
              placeholder="Tempel pesan mencurigakan dari SMS, Email, atau Whatsapp kamu..."
              required
            />
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
            shield
          </span>
          Analisis Pesan
        </button>
      </form>

      <div className="border border-white/10 rounded-3xl bg-white/5 p-6 flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-semibold">Skor Bahaya</div>
          <div className={`text-3xl font-extrabold ${skorColor}`}>{displaySkor}</div>
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${displaySkor}%` }}
          />
        </div>

        <div className="text-xs text-white/70 leading-relaxed pt-1">
          {displayDeskripsi}
        </div>

        <div className="flex flex-row gap-2 items-center cursor-pointer pt-1">
          <div className="text-xs text-[#2EC4B6] font-semibold">Detail</div>
          <span
            className="material-icons select-none leading-none text-[#2EC4B6]"
            style={{ fontSize: '11px', width: '11px', height: '11px' }}
          >
            arrow_forward
          </span>
        </div>

        {displayRekomendasi && (
          <div className="border border-red-500/20 bg-red-500/10 rounded-2xl p-4 mt-1">
            <div className="text-xs text-red-300 leading-relaxed">
              <span className="font-bold">Rekomendasi: </span>
              {displayRekomendasi}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}