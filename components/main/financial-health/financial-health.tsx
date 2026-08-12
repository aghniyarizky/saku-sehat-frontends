"use client";

import { useState, useEffect, useCallback } from "react";
import "material-icons/iconfont/material-icons.css";
import { useRouter } from "next/navigation";
import Sidebar from "../sidebar";

interface SubScoreAPI {
  skor: number;
  maksimal: number;
  persentase: number;
  status: "Excellent" | "Good" | "Perlu Perhatian" | "Buruk";
  ringkasan: string;
  saranPerkembangan: string[];
}

interface FinancialHealthAPI {
  skorTotal: number;
  grade: "A" | "B" | "C" | "D" | "E";
  targetNabung: SubScoreAPI;
  disiplinAnggaran: SubScoreAPI;
  pengelolaanPinjaman: SubScoreAPI;
  updatedAt: string;
}

const METRIC_CONFIG = {
  targetNabung: {
    key: "target-nabung",
    title: "Target Nabung",
    icon: "savings",
    iconBg: "bg-[#34D399]/15",
    iconColor: "text-[#34D399]",
    barColor: "bg-[#34D399]",
    scoreColor: "text-[#34D399]",
  },
  disiplinAnggaran: {
    key: "disiplin-anggaran",
    title: "Disiplin Anggaran",
    icon: "track_changes",
    iconBg: "bg-red-500/15",
    iconColor: "text-red-400",
    barColor: "bg-[#2EC4B6]",
    scoreColor: "text-[#2EC4B6]",
  },
  pengelolaanPinjaman: {
    key: "pengelolaan-pinjaman",
    title: "Pengelolaan Pinjaman",
    icon: "credit_card",
    iconBg: "bg-white/10",
    iconColor: "text-white/80",
    barColor: "bg-[#F5A623]",
    scoreColor: "text-[#F5A623]",
  },
} as const;

const STATUS_BADGE_COLOR: Record<SubScoreAPI["status"], string> = {
  Excellent: "bg-[#34D399]/15 text-[#34D399]",
  Good: "bg-[#2EC4B6]/15 text-[#2EC4B6]",
  "Perlu Perhatian": "bg-[#F5A623]/15 text-[#F5A623]",
  Buruk: "bg-red-500/15 text-red-400",
};

const GRADE_COLOR: Record<string, { text: string; ring: string }> = {
  A: { text: "text-[#34D399]", ring: "#34D399" },
  B: { text: "text-[#2EC4B6]", ring: "#2EC4B6" },
  C: { text: "text-[#F5A623]", ring: "#F5A623" },
  D: { text: "text-orange-400", ring: "#FB923C" },
  E: { text: "text-red-400", ring: "#F87171" },
};

const STATUS_TEXT_BY_GRADE: Record<string, string> = {
  A: "Kondisi Keuanganmu Sangat Sehat! 🎉",
  B: "Kondisi Keuanganmu Hampir Sehat! 🎉",
  C: "Kondisi Keuanganmu Cukup Stabil 👍",
  D: "Kondisi Keuanganmu Perlu Perbaikan ⚠️",
  E: "Kondisi Keuanganmu Berisiko Tinggi ⚠️",
};

const formatTanggalWaktu = (isoString: string) => {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
};

export default function FinancialHealth() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<FinancialHealthAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<number>(1);
  const router = useRouter();
  

  const getToken = () => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  };

  const fetchLatestData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const token = getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/financial-health`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.message || "Gagal mengambil data Financial Health",
        );
      }

      setData(json.data || null);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setErrorMsg(errorObj.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestData();
  }, [fetchLatestData]);

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    setErrorMsg(null);
    setLoadingStep(1);

    try {
      const token = getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/financial-health/output`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.body) throw new Error("Response body tidak tersedia");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const parsed = JSON.parse(line.slice(6));

          if (parsed.type === "step") {
            if (parsed.step === "targetNabung") setLoadingStep(1);
            else if (parsed.step === "disiplinAnggaran") setLoadingStep(2);
            else if (parsed.step === "pengelolaanPinjaman") setLoadingStep(3);
          } else if (parsed.type === "done") {
            setLoadingStep(3);
            setTimeout(() => {
              setData(parsed.data);
              setIsRecalculating(false);
            }, 500);
          } else if (parsed.type === "error") {
            setErrorMsg(parsed.message || "Gagal menghitung Financial Health");
            setIsRecalculating(false);
          }
        }
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setErrorMsg(
        errorObj.message || "Terjadi kesalahan saat menghitung ulang",
      );
      setIsRecalculating(false);
    }
  };

  const totalMaxScore = 100;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = data ? data.skorTotal / totalMaxScore : 0;
  const dashOffset = circumference * (1 - progress);
  const gradeStyle = data ? GRADE_COLOR[data.grade] : GRADE_COLOR.E;

  return (
    <div className="relative w-full h-full p-6 py-10 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <HeaderBar onOpenSidebar={() => setIsSidebarOpen(true)} />

      {isRecalculating && <AILoadingModal step={loadingStep} />}

      {errorMsg && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-3 text-xs lg:text-sm text-red-300">
          {errorMsg}
        </div>
      )}

      {isLoading ? (
        <SkeletonLoader />
      ) : !data ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center my-auto">
          <span className="material-icons text-5xl text-white/30">
            insights
          </span>
          <p className="text-white/60 text-sm lg:text-base max-w-xs">
            Belum ada data Financial Health. Yuk hitung kondisi keuanganmu
            sekarang.
          </p>
          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="px-5 py-2.5 rounded-full bg-[#2EC4B6] text-sm lg:text-base font-bold cursor-pointer disabled:opacity-50"
          >
            Hitung Sekarang
          </button>
        </div>
      ) : (
        <>
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
                  stroke={gradeStyle.ring}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl lg:text-5xl font-extrabold">
                  {data.skorTotal}
                </span>
                <span className="text-xs lg:text-sm text-white/50">/ {totalMaxScore}</span>
              </div>
            </div>

            <div className={`text-2xl lg:text-3xl font-extrabold ${gradeStyle.text}`}>
              Grade {data.grade}
            </div>
            <div className="text-sm lg:text-base font-semibold text-white text-center">
              {STATUS_TEXT_BY_GRADE[data.grade]}
            </div>
            <div className="text-xs lg:text-sm text-white/40">
              Terakhir di update {formatTanggalWaktu(data.updatedAt)}
            </div>

            <button
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className="mt-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs lg:text-sm font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <span className="material-icons text-sm">refresh</span>
              Hitung Ulang
            </button>
          </div>

          {(
            ["targetNabung", "disiplinAnggaran", "pengelolaanPinjaman"] as const
          ).map((metricKey) => {
            const subScore = data[metricKey];
            const config = METRIC_CONFIG[metricKey];
            const barPercent = Math.min(
              100,
              (subScore.skor / subScore.maksimal) * 100,
            );

            return (
              <div
                key={config.key}
                className="border border-white/10 rounded-3xl bg-white/5 p-6 flex flex-col gap-3"
              >
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-3">
                    <div
                      className={`flex items-center justify-center p-2.5 aspect-square rounded-full shrink-0 ${config.iconBg}`}
                    >
                      <span
                        className={`material-icons select-none leading-none ${config.iconColor}`}
                      >
                        {config.icon}
                      </span>
                    </div>
                    <div className="text-sm lg:text-base font-bold">{config.title}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-lg lg:text-xl font-extrabold ${config.scoreColor}`}
                    >
                      {subScore.skor}
                    </span>
                    <span className="text-[10px] lg:text-xs text-white/40">
                      / {subScore.maksimal} pts
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
                    style={{ width: `${barPercent}%` }}
                  />
                </div>

                <div className="flex flex-row items-center justify-between">
                  <span className="text-[11px] lg:text-xs text-white/40">
                    Nilai kamu: {subScore.persentase}%
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold ${STATUS_BADGE_COLOR[subScore.status]}`}
                  >
                    {subScore.status}
                  </span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs lg:text-sm text-white/70 leading-relaxed">
                    {subScore.ringkasan}
                  </div>
                </div>

                {subScore.saranPerkembangan &&
                  subScore.saranPerkembangan.length > 0 && (
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="text-[10px] lg:text-xs font-bold text-white/40 tracking-wide">
                        SARAN PERKEMBANGAN
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {subScore.saranPerkembangan.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-row items-start gap-2"
                          >
                            <span
                              className="material-icons select-none leading-none text-[#2EC4B6] shrink-0 mt-0.5"
                              style={{
                                fontSize: "13px",
                                width: "13px",
                                height: "13px",
                              }}
                            >
                              check
                            </span>
                            <span className="text-xs lg:text-sm text-white/70 leading-relaxed">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function AILoadingModal({ step }: { step: number }) {
  const steps = [
    { title: "Target Nabung", desc: "Memeriksa pencapaian target tabungan..." },
    {
      title: "Disiplin Anggaran",
      desc: "Menganalisis kepatuhan batas pengeluaran...",
    },
    {
      title: "Pengelolaan Pinjaman",
      desc: "Menghitung rasio hutang & cicilan...",
    },
  ];

  const currentStep = Math.min(Math.max(step, 1), 3);
  const progressPercent = Math.round((currentStep / 3) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm p-6 bg-[#182232]/90 border border-gray-700/60 rounded-3xl shadow-2xl flex flex-col gap-5 text-white backdrop-blur-md">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-3 bg-[#2EC4B6]/15 rounded-full text-[#2EC4B6] animate-pulse">
            <span className="material-icons text-3xl">auto_awesome</span>
          </div>
          <h3 className="text-lg lg:text-xl font-bold">AI Sedang Menganalisis</h3>
          <p className="text-xs lg:text-sm text-gray-300">
            Mohon tunggu, sistem sedang memproses kondisi keuanganmu.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] lg:text-xs font-semibold text-gray-300 mb-1">
            <span>Progress Analisis</span>
            <span className="text-[#2EC4B6]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2EC4B6] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 py-1">
          {steps.map((st, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                  isCurrent
                    ? "bg-[#2EC4B6]/15 border-[#2EC4B6]/50"
                    : isDone
                      ? "bg-white/10 border-white/15"
                      : "bg-transparent border-transparent opacity-40"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isDone ? (
                    <span className="material-icons text-sm text-[#34D399] bg-[#34D399]/20 p-1 rounded-full">
                      check
                    </span>
                  ) : isCurrent ? (
                    <span className="material-icons text-sm text-[#2EC4B6] animate-spin">
                      sync
                    </span>
                  ) : (
                    <span className="material-icons text-sm text-gray-400">
                      radio_button_unchecked
                    </span>
                  )}
                </div>

                <div className="flex flex-col text-left">
                  <span
                    className={`text-xs lg:text-sm font-bold ${
                      isCurrent
                        ? "text-[#2EC4B6]"
                        : isDone
                          ? "text-white"
                          : "text-gray-400"
                    }`}
                  >
                    Tahap {stepNum}: {st.title}
                  </span>
                  <span className="text-[11px] lg:text-xs text-gray-300">{st.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeaderBar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <div className="w-full flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2.5">
        <button
          type="button"
          className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
          onClick={onOpenSidebar}
        >
          <span className="material-icons text-2xl select-none">menu</span>
        </button>
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Financial Health</h1>
      </div>

      <div className="flex flex-row items-center gap-3">
        <button
          type="button"
          className="relative flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-icons text-xl select-none">
            notifications
          </span>
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <button
          type="button"
          className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-icons text-xl select-none">
            account_circle
          </span>
        </button>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="border border-white/10 rounded-3xl bg-white/5 p-6 h-72" />
      <div className="border border-white/10 rounded-3xl bg-white/5 p-6 h-48" />
      <div className="border border-white/10 rounded-3xl bg-white/5 p-6 h-48" />
      <div className="border border-white/10 rounded-3xl bg-white/5 p-6 h-48" />
    </div>
  );
}