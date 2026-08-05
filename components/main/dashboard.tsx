
//SUDAH CONNECT KE BACKEND, TAPI MASIH ADA BUG DI RENDER DASHBOARD, JADI SEMENTARA KITA KOMENTAR SEMUA KODE UNTUK DASHBOARD UNTUK SEMENTARA WAKTU. NANTI BISA DIBENERIN LAGI.

// 'use client';

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import 'material-icons/iconfont/material-icons.css';
// import Sidebar from './sidebar';
// import NativeFinancialChart from './grafik-keuangan';

// interface Summary {
//   saldo: number;
//   totalPemasukan: number;
//   totalPengeluaran: number;
// }

// interface TransactionItem {
//   id: string;
//   title: string;
//   category: string;
//   date: string;
//   amount: number;
//   type: string;
//   icon: string;
//   iconColor: string;
// }

// // Mapping icon berdasarkan kategori transaksi
// const CATEGORY_ICON: Record<string, string> = {
//   Makanan: "ramen_dining",
//   Transportasi: "directions_car",
//   Belanja: "shopping_bag",
//   Tagihan: "payments",
//   Hiburan: "local_movies",
//   Freelance: "work",
//   Gaji: "paid",
//   Kesehatan: "medical_services",
//   Investasi: "trending_up",
// };

// const getIconForCategory = (kategori: string) => CATEGORY_ICON[kategori] || "receipt_long";

// const formatTanggal = (isoDate: string) => {
//   try {
//     return new Intl.DateTimeFormat("id-ID", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     }).format(new Date(isoDate));
//   } catch {
//     return isoDate;
//   }
// };

// const formatRupiah = (val: number) => `Rp${Math.abs(val).toLocaleString("id-ID")}`;

// export default function Dashboard() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const router = useRouter();

//   // State untuk data Backend
//   const [summary, setSummary] = useState<Summary>({ saldo: 0, totalPemasukan: 0, totalPengeluaran: 0 });
//   const [recentTransactions, setRecentTransactions] = useState<TransactionItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Fetch Data dari Backend saat komponen dimuat di Client Side
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         // Safe check localStorage untuk hindari error SSR Next.js
//         const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//         console.log("TOKEN YANG DIKIRIM DARI FE:", token);

//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//         });

//         const teksResponse = await response.text();

//         if (!response.ok) {
//           console.error("ERROR DASHBOARD RESPONSE:", response.status, teksResponse);
//           try {
//             const parsedError = JSON.parse(teksResponse);
//             throw new Error(parsedError.message || "Gagal mengambil data dashboard.");
//           } catch {
//             throw new Error("Terjadi kesalahan pada server backend.");
//           }
//         }

//         const resData = JSON.parse(teksResponse);
//         console.log("DATA DARI BE UNTUK DASHBOARD:", resData);

//         // 1. Simpan Ringkasan Keuangan (Saldo, Pemasukan, Pengeluaran)
//         setSummary({
//           saldo: resData.summary?.saldo ?? 0,
//           totalPemasukan: resData.summary?.totalPemasukan ?? 0,
//           totalPengeluaran: resData.summary?.totalPengeluaran ?? 0,
//         });

//         // 2. Ambil 5 Transaksi Terakhir
//         const mapped: TransactionItem[] = (resData.data || []).slice(0, 5).map((item: any) => ({
//           id: item._id,
//           title: item.Catatan_Transaksi,
//           category: item.kategori,
//           date: formatTanggal(item.tanggal),
//           amount: item.tipe === "pemasukan" ? item.nominal : -item.nominal,
//           type: item.tipe,
//           icon: getIconForCategory(item.kategori),
//           iconColor: item.tipe === "pemasukan" ? "text-[#05DF72]" : "text-[#e7ae3c]",
//         }));

//         setRecentTransactions(mapped);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   return (
//     <div className="w-full h-full p-6 py-10 flex flex-col bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
//       <Sidebar 
//         isOpen={isSidebarOpen} 
//         onClose={() => setIsSidebarOpen(false)} 
//       />
      
//       <div>
//         {/* Header */}
//         <div className="w-full flex flex-row items-center justify-between">
//           <div className="flex flex-row items-center gap-2.5">
//             <button 
//               className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer duration-500"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <span className="material-icons text-2xl select-none">menu</span>
//             </button>
//             <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
//           </div>

//           <div className="flex flex-row items-center gap-3">
//             <button className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
//               <span className="material-icons text-xl select-none">notifications</span>
//             </button>
//             <button className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
//               <span className="material-icons text-xl select-none">account_circle</span>
//             </button>
//           </div>
//         </div>

//         {/* Greeting */}
//         <h2 className="mt-3 bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-3xl font-extrabold tracking-tight leading-snug">
//           Halo,{" "}
//           <span className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent text-3xl font-extrabold ">
//             JaneDoe!
//           </span> 
//         </h2>
//         <p className="text-gray-400 text-sm font-semibold">Pantau dan kelola kondisi finansialmu hari ini.</p>

//         {error && (
//           <div className="mt-4 p-3 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-xl backdrop-blur-sm">
//             {error}
//           </div>
//         )}

//         {/* Kartu Ringkasan (Saldo, Pemasukan, Pengeluaran, Pinjaman) */}
//         <div className="p-4 mt-4 gap-3 grid grid-cols-2">
//           {/* Saldo Sekarang */}
//           <div className="bg-white/7 border border-gray-700 rounded-2xl p-4 py-6 w-full">
//             <div className="flex flex-row items-start justify-between">
//               <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full cursor-pointer">
//                 <span className="material-icons text-[#2EC4B6]">wallet</span>
//               </div>
//             </div>
//             <div className="flex flex-col mt-3">
//               <div className="text-xl my-2 font-extrabold">
//                 {loading ? "..." : formatRupiah(summary.saldo)}
//               </div>
//               <div className="text-sm text-white/50 font-medium">Saldo Sekarang</div>
//             </div>
//           </div>

//           {/* Pemasukan */}
//           <div className="bg-white/7 border border-gray-700 rounded-2xl p-4 py-6 w-full">
//             <div className="flex flex-row items-start justify-between">
//               <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full cursor-pointer">
//                 <span className="material-icons text-[#2EC4B6]">north_east</span>
//               </div>
//             </div>
//             <div className="flex flex-col mt-3">
//               <div className="text-xl my-2 font-extrabold text-[#05DF72]">
//                 {loading ? "..." : formatRupiah(summary.totalPemasukan)}
//               </div>
//               <div className="text-sm text-white/50 font-medium">Pemasukan</div>
//             </div>
//           </div>

//           {/* Pengeluaran */}
//           <div className="bg-white/7 border border-gray-700 rounded-2xl p-4 py-6 w-full">
//             <div className="flex flex-row items-start justify-between">
//               <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full cursor-pointer">
//                 <span className="material-icons text-[#E74C3C]">south_west</span>
//               </div>
//             </div>
//             <div className="flex flex-col mt-3">
//               <div className="text-xl my-2 font-extrabold text-[#E74C3C]">
//                 {loading ? "..." : formatRupiah(summary.totalPengeluaran)}
//               </div>
//               <div className="text-sm text-white/50 font-medium">Pengeluaran</div>
//             </div>
//           </div>

//           {/* Pinjaman Aktif */}
//           <div className="bg-white/7 border border-gray-700 rounded-2xl p-4 py-6 w-full">
//             <div className="flex flex-row items-start justify-between">
//               <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full cursor-pointer">
//                 <span className="material-icons text-[#E74C3C]">volunteer_activism</span>
//               </div>
//             </div>
//             <div className="flex flex-col mt-3">
//               <div className="text-xl my-2 font-extrabold">2</div>
//               <div className="text-sm text-white/50 font-medium">Pinjaman Aktif</div>
//             </div>
//           </div>
//         </div>

//         {/* Financial Health */}
//         <div className="p-4 mt-[-18]">
//           <div className="w-full bg-white/7 border border-gray-700 rounded-2xl p-4">
//             <div className="flex flex-row gap-4">
//               <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
//                 <span className="material-icons text-[#2EC4B6] select-none leading-none">insights</span>
//               </div>
//               <div>
//                 <div className="text-lg text-white font-extrabold">Financial Health</div>
//                 <div className="text-xs text-white/30">Terakhir diupdate 26/05/2026 13:45</div>
//                 <div className="flex flex-row gap-0.5 items-end">
//                   <div className="text-3xl font-extrabold text-white py-3"> 87</div>
//                   <div className="text-medium font-semibold text-white/70 py-3"> /100</div>
//                 </div>
                
//                 <button 
//                   onClick={() => router.push("/?mode=financialhealth")}
//                   className="flex flex-row gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
//                 >
//                   <div className="text-xs text-[#2EC4B6] font-semibold">Detail</div>
//                   <span 
//                     className="material-icons select-none leading-none text-[#2EC4B6]" 
//                     style={{ fontSize: '11px', width: '11px', height: '11px' }}
//                   >
//                     arrow_forward
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div> 
//         </div>

//         {/* Grafik Keuangan */}
//         <div className="p-4 mt-[-18]">
//           <div className="w-full bg-white/1 border border-gray-800 rounded-2xl p-4">
//             <div className="flex flex-row gap-4 items-center justify-between">
//               <div>
//                 <div className="text-lg text-white font-extrabold">Grafik Keuangan Anda</div>
//                 <div className="text-xs text-white/40">7 Bulan Terakhir</div>
//               </div>
//               <div className="items-center justify-center p-1 px-2 text-xs aspect-video bg-[#2EC4B6]/15 rounded-2xl shrink-0 h-fit border border-[#2EC4B6]/30">
//                 <span className="text-[#2EC4B6] select-none leading-none">2026</span>
//               </div>
//             </div>
//             <NativeFinancialChart />
//           </div> 
//         </div>

//         {/* Pinjaman Aktif Summary */}
//         <div className="p-4 mt-[-18]">
//           <div className="w-full bg-white/1 border border-gray-800 rounded-2xl p-4">
//             <div className="flex flex-row gap-4 items-center justify-between">
//               <div className="text-lg text-white font-extrabold">Pinjaman Aktif</div>
//               <button onClick={() => router.push("/?mode=kelolapinjaman")} className="text-[#2EC4B6] text-sm hover:underline cursor-pointer">
//                 View all
//               </button>
//             </div>
//             <div className="py-2 gap-1 flex flex-col">
//               <div className="flex flex-col gap-1 py-1">
//                 <div className="flex flex-row items-center justify-between font-semibold">
//                   <div className="text-md">Shopee Paylater</div>
//                   <div className="text-xs text-white/30">16% paid</div>
//                 </div>
//                 <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden my-1">
//                   <div className="h-full bg-[#2EC4B6] rounded-full transition-all duration-300" style={{ width: '16%' }} />
//                 </div>
//                 <div className="flex flex-row items-center justify-between font-semibold">
//                   <div className="text-xs text-white/30">Rp50.000</div>
//                   <div className="text-xs text-white/30">Rp312.500</div>
//                 </div>
//               </div>
//             </div>
//           </div> 
//         </div>

//         {/* Transaksi Terakhir dari Backend */}
//         <div className="p-4 mt-[-18]">
//           <div className="w-full bg-white/1 border border-gray-800 rounded-2xl p-4">
//             <div className="flex flex-row gap-4 items-center justify-between mb-2">
//               <div className="text-lg text-white font-extrabold">Transaksi Terakhir</div>
//               <button 
//                 onClick={() => router.push("/?mode=transaksi")} 
//                 className="text-[#2EC4B6] text-sm hover:underline cursor-pointer"
//               >
//                 View all
//               </button>
//             </div>

//             {loading ? (
//               <div className="py-6 text-center text-xs text-gray-400">
//                 Memuat transaksi...
//               </div>
//             ) : recentTransactions.length > 0 ? (
//               recentTransactions.map((tx) => {
//                 const isIncome = tx.type === "pemasukan";
//                 const formattedAmount = isIncome
//                   ? `+${formatRupiah(tx.amount)}`
//                   : `-${formatRupiah(tx.amount)}`;

//                 return (
//                   <div key={tx.id} className="py-2.5 gap-3 flex flex-row items-center border-b border-gray-800/40 last:border-none">
//                     <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
//                       <span className={`material-icons ${tx.iconColor}`}>{tx.icon}</span>
//                     </div>
//                     <div className="flex flex-row gap-1 py-1 justify-between items-center w-full min-w-0">
//                       <div className="min-w-0 flex-1">
//                         <div className="text-md font-semibold truncate">{tx.title}</div>
//                         <div className="text-xs text-white/30 truncate">{tx.category} - {tx.date}</div>
//                       </div>
//                       <div className={`text-md font-bold shrink-0 ml-2 ${isIncome ? "text-[#05DF72]" : "text-[#E74C3C]"}`}>
//                         {formattedAmount}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="py-6 text-center text-xs text-gray-500">
//                 Belum ada transaksi recorded.
//               </div>
//             )}
//           </div> 
//         </div>

//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from './sidebar';
import NativeFinancialChart from './grafik-keuangan';

interface Summary {
  saldo: number;
  totalPemasukan: number;
  totalPengeluaran: number;
}

interface RawTransaksi {
  _id: string;
  Catatan_Transaksi: string;
  tipe: "pemasukan" | "pengeluaran";
  kategori: string;
  nominal: number;
  tanggal: string;
}

interface RecentTransaction {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: "pemasukan" | "pengeluaran";
  icon: string;
  iconColor: string;
}

interface ChartDataPoint {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

// mapping icon & warna berdasarkan kategori
const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  Makanan: { icon: "ramen_dining", color: "#e7ae3c" },
  makanan: { icon: "ramen_dining", color: "#e7ae3c" },
  Transportasi: { icon: "directions_car", color: "#3c92e7" },
  transport: { icon: "directions_car", color: "#3c92e7" },
  Belanja: { icon: "shopping_bag", color: "#e7ae3c" },
  belanja: { icon: "shopping_bag", color: "#e7ae3c" },
  Tagihan: { icon: "payments", color: "#e7ae3c" },
  tagihan: { icon: "payments", color: "#e7ae3c" },
  Hiburan: { icon: "local_movies", color: "#d29852" },
  hiburan: { icon: "local_movies", color: "#d29852" },
  Freelance: { icon: "work", color: "#2EC4B6" },
  freelance: { icon: "work", color: "#2EC4B6" },
  Gaji: { icon: "paid", color: "#05DF72" },
  uangsaku: { icon: "paid", color: "#05DF72" },
  dana: { icon: "account_balance_wallet", color: "#05DF72" },
};

const getCategoryMeta = (kategori: string) => CATEGORY_META[kategori] || { icon: "receipt_long", color: "#e7ae3c" };

const formatTanggal = (isoDate: string) => {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
};

const formatRupiah = (val: number) => `Rp${Math.abs(Math.round(val)).toLocaleString("id-ID")}`;

// Dummy Data untuk Demo Skenario
const DUMMY_RAW_TRANSACTIONS: RawTransaksi[] = [
  { _id: "1", Catatan_Transaksi: "Gaji Bulanan", tipe: "pemasukan", kategori: "Gaji", nominal: 5500000, tanggal: "2026-07-13" },
  { _id: "2", Catatan_Transaksi: "Makan Malam Ramen", tipe: "pengeluaran", kategori: "Makanan", nominal: 50000, tanggal: "2026-07-13" },
  { _id: "3", Catatan_Transaksi: "Beli Bensin Motor", tipe: "pengeluaran", kategori: "Transportasi", nominal: 30000, tanggal: "2026-07-12" },
  { _id: "4", Catatan_Transaksi: "Proyek Freelance UI/UX", tipe: "pemasukan", kategori: "Freelance", nominal: 1500000, tanggal: "2026-07-10" },
];

const buildChartData = (transaksi: RawTransaksi[]): ChartDataPoint[] => {
  const now = new Date();
  const buckets: ChartDataPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: d.toLocaleString("id-ID", { month: "short" }),
      pemasukan: 0,
      pengeluaran: 0,
    });
  }

  transaksi.forEach((item) => {
    const itemDate = new Date(item.tanggal);
    const monthsAgo = (now.getFullYear() - itemDate.getFullYear()) * 12 + (now.getMonth() - itemDate.getMonth());

    if (monthsAgo >= 0 && monthsAgo <= 6) {
      const bucketIndex = 6 - monthsAgo;
      if (item.tipe === "pemasukan") {
        buckets[bucketIndex].pemasukan += item.nominal;
      } else {
        buckets[bucketIndex].pengeluaran += item.nominal;
      }
    }
  });

  return buckets;
};

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const [summary, setSummary] = useState<Summary>({ saldo: 6920000, totalPemasukan: 7000000, totalPengeluaran: 80000 });
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        /*
        // DINOAKTIFKAN SEMENTARA UNTUK DEMO (OFFLINE MOCK MODE)
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/transaksi`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const teksResponse = await response.text();

        if (!response.ok) {
          throw new Error("Gagal mengambil data dashboard.");
        }

        const resData = JSON.parse(teksResponse);
        const rawList: RawTransaksi[] = resData.data || [];

        setSummary({
          saldo: resData.summary?.saldo ?? 0,
          totalPemasukan: resData.summary?.totalPemasukan ?? 0,
          totalPengeluaran: resData.summary?.totalPengeluaran ?? 0,
        });
        */

        const rawList = DUMMY_RAW_TRANSACTIONS;

        const sortedByDate = [...rawList].sort(
          (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        );

        const mappedRecent: RecentTransaction[] = sortedByDate.slice(0, 5).map((item) => {
          const meta = getCategoryMeta(item.kategori);
          return {
            id: item._id,
            title: item.Catatan_Transaksi,
            category: item.kategori,
            date: formatTanggal(item.tanggal),
            amount: item.tipe === "pemasukan" ? item.nominal : -item.nominal,
            type: item.tipe,
            icon: meta.icon,
            iconColor: meta.color,
          };
        });

        setRecentTransactions(mappedRecent);
        setChartData(buildChartData(rawList));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="w-full h-full p-6 py-10 flex flex-col bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div>
        {/* Navigation Bar Header */}
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2.5">
            <button 
              type="button"
              className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer duration-500"
              onClick={() => setIsSidebarOpen(true)}>
              <span className="material-icons text-2xl select-none">menu</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
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

        {/* Greeting Section */}
        <h2 className="mt-3 bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-3xl font-extrabold tracking-tight leading-snug">
          Halo,{" "}
          <span className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent text-3xl font-extrabold ">
            JaneDoe!
          </span> 
        </h2>

        <p className="text-gray-400 text-sm font-semibold">Pantau dan kelola kondisi finansialmu hari ini.</p>

        {error && (
          <div className="mt-4 p-3 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-xl backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Summary Ringkasan Saldo & Pemasukan */}
        <div className="p-4 mt-4 gap-3 grid grid-cols-2">
          {/* saldo */}
          <div className="bg-white/7 border border-gray-700 rounded-2xl p-4 py-6 w-full">
            <div className="flex flex-row items-start justify-between">
              <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full cursor-pointer">
                <span className="material-icons text-[#2EC4B6]">wallet</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xl my-2 font-extrabold">{loading ? "..." : formatRupiah(summary.saldo)}</div>
              <div className="text-sm text-white/50 font-medium">Saldo Sekarang</div>
            </div>
          </div>

          {/* pemasukan */}
          <div className="bg-white/7 border border-gray-700 rounded-2xl p-4 py-6 w-full">
            <div className="flex flex-row items-start justify-between">
              <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full cursor-pointer">
                <span className="material-icons text-[#2EC4B6]">north_east</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xl my-2 font-extrabold text-[#05DF72]">{loading ? "..." : formatRupiah(summary.totalPemasukan)}</div>
              <div className="text-sm text-white/50 font-medium">Pemasukan</div>
            </div>
          </div>

          {/* pengeluaran */}
          <div className="bg-white/7 border border-gray-700 rounded-2xl p-4 py-6 w-full">
            <div className="flex flex-row items-start justify-between">
              <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full cursor-pointer">
                <span className="material-icons text-[#E74C3C]">south_west</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xl my-2 font-extrabold text-[#E74C3C]">{loading ? "..." : formatRupiah(summary.totalPengeluaran)}</div>
              <div className="text-sm text-white/50 font-medium">Pengeluaran</div>
            </div>
          </div>

          {/* pinjaman aktif */}
          <div className="bg-white/7 border border-gray-700 rounded-2xl p-4 py-6 w-full">
            <div className="flex flex-row items-start justify-between">
              <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full cursor-pointer">
                <span className="material-icons text-[#E74C3C]">volunteer_activism</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xl my-2 font-extrabold">2</div>
              <div className="text-sm text-white/50 font-medium">Pinjaman Aktif</div>
              <div className="text-xs text-white/20">jatuh tempo 24/03/2026</div>
            </div>
          </div>
        </div>

        {/* Financial Health Widget */}
        <div className="p-4 mt-[-18]">
          <div className="w-full bg-white/7 border border-gray-700 rounded-2xl p-4">
            <div className="flex flex-row gap-4">
              <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
                <span className="material-icons text-[#2EC4B6] select-none leading-none">insights</span>
              </div>
              <div>
                <div className="text-lg text-white font-extrabold">Financial Health</div>
                <div className="text-xs text-white/30">Terakhir diupdate hari ini</div>
                <div className="flex flex-row gap-0.5 items-end">
                  <div className="text-3xl font-extrabold text-white py-3">87</div>
                  <div className="text-medium font-semibold text-white/70 py-3">/100</div>
                </div>
                
                <button 
                  type="button"
                  onClick={() => router.push("/?mode=financialhealth")}
                  className="flex flex-row gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="text-xs text-[#2EC4B6] font-semibold">Detail</div>
                  <span 
                    className="material-icons select-none leading-none text-[#2EC4B6]" 
                    style={{ fontSize: '11px', width: '11px', height: '11px' }}
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div> 
        </div>

        {/* Grafik Keuangan Section */}
        <div className="p-4 mt-[-18]">
          <div className="w-full bg-white/1 border border-gray-800 rounded-2xl p-4">
            <div className="flex flex-row gap-4 items-center justify-between mb-2">
              <div>
                <div className="text-lg text-white font-extrabold">Grafik Keuangan Anda</div>
                <div className="text-xs text-white/40">7 Bulan Terakhir</div>
              </div>
              <div className="items-center justify-center p-1 px-2 text-xs aspect-video bg-[#2EC4B6]/15 rounded-2xl shrink-0 h-fit border border-[#2EC4B6]/30">
                <span className="text-[#2EC4B6] select-none leading-none">{new Date().getFullYear()}</span>
              </div>
            </div>
            <NativeFinancialChart data={chartData} />
          </div> 
        </div>
        
        {/* Pinjaman Aktif List */}
        <div className="p-4 mt-[-18]">
          <div className="w-full bg-white/1 border border-gray-800 rounded-2xl p-4">
            <div className="flex flex-row gap-4 items-center justify-between">
              <div>
                <div className="text-lg text-white font-extrabold">Pinjaman Aktif</div>
              </div>
              <span className="text-[#2EC4B6] select-none leading-none text-sm cursor-pointer hover:underline" onClick={() => router.push("/?mode=kelolapinjaman")}>View all</span>
            </div>
            <div className="py-2 gap-1 flex flex-col">
              <div className="flex flex-col gap-1 py-1">
                <div className="flex flex-row items-center justify-between font-semibold">
                  <div className="text-md">Shopee Paylater</div>
                  <div className="text-xs text-white/30">16% paid</div>
                </div>
                
                <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden my-1">
                  <div 
                    className="h-full bg-[#2EC4B6] rounded-full transition-all duration-300"
                    style={{ width: '16%' }}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between font-semibold">
                  <div className="text-xs text-white/30">Rp50.000</div>
                  <div className="text-xs text-white/30">Rp312.500</div>
                </div>
              </div>

              <div className="flex flex-col gap-1 py-1">
                <div className="flex flex-row items-center justify-between font-semibold">
                  <div className="text-md">Easycash</div>
                  <div className="text-xs text-white/30">16% paid</div>
                </div>
                
                <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden my-1">
                  <div 
                    className="h-full bg-[#2EC4B6] rounded-full transition-all duration-300"
                    style={{ width: '16%' }}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between font-semibold">
                  <div className="text-xs text-white/30">Rp50.000</div>
                  <div className="text-xs text-white/30">Rp312.500</div>
                </div>
              </div>
            </div>
          </div> 
        </div>

        {/* Transaksi Terakhir Section */}
        <div className="p-4 mt-[-18]">
          <div className="w-full bg-white/1 border border-gray-800 rounded-2xl p-4">
            <div className="flex flex-row gap-4 items-center justify-between mb-2">
              <div>
                <div className="text-lg text-white font-extrabold">Transaksi Terakhir</div>
              </div>
              <button
                type="button"
                onClick={() => router.push("/?mode=transaksi")}
                className="text-[#2EC4B6] select-none leading-none text-sm cursor-pointer hover:opacity-80 transition-opacity"
              >
                View all
              </button>
            </div>

            {loading ? (
              <div className="py-6 text-center text-xs text-gray-500">Memuat transaksi terakhir...</div>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((item) => {
                const isIncome = item.type === "pemasukan";
                return (
                  <div key={item.id} className="py-2.5 gap-3 flex flex-row items-center border-b border-gray-800/40 last:border-none">
                    <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
                      <span className="material-icons text-xl" style={{ color: item.iconColor }}>{item.icon}</span>
                    </div>
                    <div className="flex flex-row gap-1 py-1 justify-between items-center w-full min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className="text-md font-semibold truncate">{item.title}</div>
                        <div className="text-xs text-white/30 truncate">{item.category} - {item.date}</div>
                      </div>
                      <div className={`text-md font-bold shrink-0 ml-2 ${isIncome ? "text-[#05DF72]" : "text-[#E74C3C]"}`}>
                        {isIncome ? "+" : "-"}{formatRupiah(item.amount)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-gray-500">Belum ada transaksi.</div>
            )}
          </div> 
        </div>
      </div>
    </div>
  );
}
