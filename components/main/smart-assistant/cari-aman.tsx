'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../sidebar';

interface HasilAnalisis {
  riskScore: number;
  riskLevel: "aman" | "waspada" | "berbahaya";
  aiSummary: string;
  aiDetail: string;
  aiRecommendation: string;
  isOjkLegal?: string;
}

const normalizeRiskLevel = (raw: string | undefined): HasilAnalisis["riskLevel"] => {
  const lower = (raw || "").toLowerCase();
  if (lower.includes("aman") || lower.includes("rendah")) return "aman";
  if (lower.includes("bahaya") || lower.includes("tinggi")) return "berbahaya";
  return "waspada";
};

const getRiskCategoryInfo = (score: number) => {
  if (score <= 19) {
    return { label: "Skor Aman", text: "text-[#2EC4B6]", bar: "bg-[#2EC4B6]" };
  } else if (score <= 59) {
    return { label: "Skor Waspada", text: "text-[#F5A623]", bar: "bg-[#F5A623]" };
  } else {
    return { label: "Skor Bahaya", text: "text-red-400", bar: "bg-red-400" };
  }
};

const mapApiDataToHasil = (data: any): HasilAnalisis => ({
  riskScore: data?.riskScore ?? data?.risk_score ?? 0,
  riskLevel: normalizeRiskLevel(data?.riskLevel || data?.risk_level),
  aiSummary: data?.aiSummary || data?.ai_summary || "Tidak ada ringkasan",
  aiDetail: data?.aiDetail || data?.ai_detail || "Tidak ada detail analisis",
  aiRecommendation: data?.aiRecommendation || data?.ai_recommendation || "",
  isOjkLegal: data?.isOjkLegal || data?.is_ojk_legal,
});

export default function CariAman() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [pesan, setPesan] = useState<string>("");
  const [hasilAnalisis, setHasilAnalisis] = useState<HasilAnalisis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState("");
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      setLoadingInitial(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cariAman/output`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const teksResponse = await response.text();

        if (!response.ok) {
          throw new Error("Gagal mengambil data sebelumnya");
        }

        const resData = JSON.parse(teksResponse);

        if (resData.data) {
          setHasilAnalisis(mapApiDataToHasil(resData.data));
        }
      } catch (err) {
        setHasilAnalisis(null);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchLatest();
  }, []);

  const handleAnalisis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesan.trim()) return;

    setError("");
    setAnalyzing(true);
    setShowDetail(false);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cariAman`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: pesan }),
      });

      if (!response.ok || !response.body) {
        const teksResponse = await response.text();
        try {
          const parsedError = JSON.parse(teksResponse);
          throw new Error(parsedError.message || parsedError.error || "Gagal menganalisis pesan.");
        } catch {
          throw new Error("Terjadi kesalahan pada server backend.");
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;

          const jsonStr = part.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);

            if (parsed.type === "done") {
              setHasilAnalisis(mapApiDataToHasil(parsed.result));
            } else if (parsed.type === "error") {
              setError(parsed.text || parsed.error || "Gagal menganalisis pesan.");
            }
          } catch {
            continue;
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const riskColor = {
    aman: { text: "text-[#2EC4B6]", bar: "bg-[#2EC4B6]" },
    waspada: { text: "text-[#F5A623]", bar: "bg-[#F5A623]" },
    berbahaya: { text: "text-red-400", bar: "bg-red-400" },
  };

  const displaySkor = hasilAnalisis ? hasilAnalisis.riskScore : 60;
  const riskInfo = getRiskCategoryInfo(displaySkor);
  
  const displaySummary = hasilAnalisis
    ? hasilAnalisis.aiSummary
    : "Tempel pesan mencurigakan lalu klik \"Analisis Pesan\" untuk melihat hasil dari AI.";
  const displayRecommendation = hasilAnalisis?.riskLevel !== "aman" ? hasilAnalisis?.aiRecommendation : null;

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

      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-xl backdrop-blur-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleAnalisis} className="w-full space-y-4">
        <div className="border border-white/10 rounded-3xl bg-white/5 p-5">
          <div className="flex flex-col gap-3">
            <label className="text-xs text-gray-300 font-semibold">Tempel pesan mencurigakan</label>
            <textarea
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              rows={5}
              className="border border-white/15 rounded-2xl w-full text-xs px-4 py-3 focus:outline-none focus:border-[#2EC4B6] transition-colors placeholder:text-white/40 text-white resize-none"
              placeholder="Tempel pesan mencurigakan dari SMS, Email, atau Whatsapp kamu..."
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={analyzing}
          className="flex flex-row w-full bg-[#2EC4B6] hover:bg-[#28b0a3] p-3 rounded-full text-sm font-extrabold text-center text-[#101828] transition-colors cursor-pointer items-center gap-1.5 justify-center disabled:bg-gray-600"
        >
          <span
            className="material-icons select-none leading-none text-[15px] shrink-0"
            style={{ fontSize: '15px', width: '15px', height: '15px' }}
          >
            shield
          </span>
          {analyzing ? "Menganalisis..." : "Analisis Pesan"}
        </button>
      </form>

      <div className="border border-white/10 rounded-3xl bg-white/5 p-6 flex flex-col gap-3">
        <div className="text-sm font-semibold">{riskInfo.label}</div>

        {analyzing ? (
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <div className="w-12 h-12 border-4 border-white/10 border-t-[#2EC4B6] rounded-full animate-spin" />
            <div className="text-sm text-white/60 text-center">AI sedang membaca/menganalisis pesan...</div>
          </div>
        ) : (
          <>
            <div className="flex flex-row items-center justify-between">
              <div className={`text-3xl font-extrabold ${riskInfo.text}`}>{displaySkor}</div>
            </div>

            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${riskInfo.bar}`}
                style={{ width: `${displaySkor}%` }}
              />
            </div>

            <div className="text-xs text-white/70 leading-relaxed pt-1">
              {displaySummary}
            </div>

            {hasilAnalisis?.aiDetail && (
              <>
                <button
                  type="button"
                  onClick={() => setShowDetail((prev) => !prev)}
                  className="flex flex-row gap-2 items-center cursor-pointer pt-1"
                >
                  <div className="text-xs text-[#2EC4B6] font-semibold">Detail</div>
                  <span
                    className={`material-icons select-none leading-none text-[#2EC4B6] transition-transform duration-300 ${showDetail ? 'rotate-90' : ''}`}
                    style={{ fontSize: '11px', width: '11px', height: '11px' }}
                  >
                    arrow_forward
                  </span>
                </button>
                {showDetail && (
                  <div className="text-xs text-white/60 leading-relaxed border-t border-white/10 pt-2">
                    {hasilAnalisis.aiDetail}
                  </div>
                )}
              </>
            )}

            {displayRecommendation && (
              <div className="border border-red-500/30 bg-red-500/10 rounded-2xl p-4 mt-1">
                <div className="text-xs text-red-300 leading-relaxed">
                  <span className="font-bold">Rekomendasi: </span>
                  {displayRecommendation}
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}