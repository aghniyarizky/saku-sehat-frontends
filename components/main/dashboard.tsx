'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from './sidebar';

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
    <div className="w-full h-full p-6 py-10 flex flex-col bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
        <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
        />
        <div>
        <div className="w-full flex flex-row items-center justify-between">
          
          {/* Dashboard */}
          <div className="flex flex-row items-center gap-2.5">
            <button 
                className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer duration:500"
                onClick={() => setIsSidebarOpen(true)}>
                <span className="material-icons text-2xl select-none">menu</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          </div>

          <div className="flex flex-row items-center gap-3">
            <button className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
              <span className="material-icons text-xl select-none">notifications</span>
            </button>
            <button className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
              <span className="material-icons text-xl select-none">account_circle</span>
            </button>
          </div>

        </div>

        <h2 className="mt-3 bg-linear-to-r from-[#B4B4B5] to-white bg-clip-text text-transparent text-3xl font-extrabold tracking-tight leading-snug">
            Halo,{" "}
            <span className="bg-linear-to-r from-[#2EC4B6] to-[#BEEDE8] bg-clip-text text-transparent text-3xl font-extrabold ">
              JaneDoe!
            </span> 
        </h2>

        <p className="text-gray-400 text-sm font-semibold">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        <div className="p-4 mt-4 gap-3 grid grid-cols-2">
            {/* saldo */}
            <div className="bg-white/7 border border-gray-700 rounded-2xl p-4 py-6 w-full">
                <div className="flex flex-row items-start justify-between">
                    <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full cursor-pointer">
                        <span className="material-icons text-[#2EC4B6]">wallet</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#05DF72]">
                        <span 
                            className="material-icons select-none leading-none" 
                            style={{ fontSize: '11px', width: '11px', height: '11px' }}
                        >
                            north_east
                        </span>
                        <h4 className="font-bold text-xs leading-none">+12.5%</h4>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="text-xl my-2 font-extrabold"> Rp150.000</div>
                    <div className="text-sm text-white/50 font-medium"> Saldo Sekarang</div>
                    <div className="text-xs text-white/20"> sejak Jul 2026</div>
                </div>
            </div>

            {/* pemasukan */}
            <div className="bg-white/7 border border-gray-700 rounded-2xl p-4 py-6 w-full">
                <div className="flex flex-row items-start justify-between">
                    <div className="p-2 flex items-center justify-center bg-[#2EC4B6]/15 rounded-full cursor-pointer">
                        <span className="material-icons text-[#2EC4B6]">north_east</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#05DF72]">
                        <span 
                            className="material-icons select-none leading-none" 
                            style={{ fontSize: '11px', width: '11px', height: '11px' }}
                        >
                            north_east
                        </span>
                        <h4 className="font-bold text-xs leading-none">+12.5%</h4>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="text-xl my-2 font-extrabold"> Rp150.000</div>
                    <div className="text-sm text-white/50 font-medium"> Pemasukan </div>
                    <div className="text-xs text-white/20"> sejak Jul 2026</div>
                </div>
            </div>

            {/* pengeluaran */}
            <div className="bg-white/7 border border-gray-700 rounded-2xl p-4 py-6 w-full">
                <div className="flex flex-row items-start justify-between">
                    <div className="p-2 flex items-center justify-center bg-[#E74C3C]/15 rounded-full cursor-pointer">
                        <span className="material-icons text-[#E74C3C]">south_west</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#E74C3C]">
                        <span 
                            className="material-icons select-none leading-none" 
                            style={{ fontSize: '11px', width: '11px', height: '11px' }}
                        >
                            south_west
                        </span>
                        <h4 className="font-bold text-xs leading-none">-3.5%</h4>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="text-xl my-2 font-extrabold"> Rp75.000</div>
                    <div className="text-sm text-white/50 font-medium"> Pengeluaran</div>
                    <div className="text-xs text-white/20"> sejak Jul 2026</div>
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
                    <div className="text-xl my-2 font-extrabold"> 2</div>
                    <div className="text-sm text-white/50 font-medium"> Pinjaman Aktif</div>
                    <div className="text-xs text-white/20"> jatuh tempo 24/03/2026</div>
                </div>
            </div>
        </div>

        {/* financial health */}
        <div className="p-4 mt-[-18]">
            <div className="w-full bg-white/7 border border-gray-700 rounded-2xl p-4">
                <div className="flex flex-row gap-4">
                    <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
                        <span className="material-icons text-[#2EC4B6] select-none leading-none">insights</span>
                    </div>
                    <div className="">
                        <div className="text-lg text-white font-extrabold">Financial Health</div>
                        <div className="text-xs text-white/30"> Terakhir diupdate 26/05/2026 13:45 </div>
                        <div className="flex flex-row gap-0.5 items-end">
                            <div className="text-3xl font-extrabold text-white py-3"> 87</div>
                            <div className="text-medium font-semibold text-white/70 py-3"> /100</div>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="text-xs text-[#2EC4B6] font-semibold">Detail</div>
                            <span 
                                className="material-icons select-none leading-none text-[#2EC4B6]" 
                                style={{ fontSize: '11px', width: '11px', height: '11px' }}
                            >
                                arrow_forward
                            </span>
                        </div>
                    </div>
                </div>
            </div> 
        </div>

        {/* grafik */}
        <div className="p-4 mt-[-18]">
            <div className="w-full bg-white/1 border border-gray-800 rounded-2xl p-4">
                <div className="flex flex-row gap-4 items-center justify-between">
                    <div className="">
                        <div className="text-lg text-white font-extrabold">Grafik Keuangan Anda</div>
                        <div className="text-xs text-white/40"> 7 Bulan Terakhir </div>
                    </div>
                    <div className="items-center justify-center p-1 px-2 text-xs aspect-video bg-[#2EC4B6]/15 rounded-2xl shrink-0 h-fit border border-[#2EC4B6]/30">
                        <span className="text-[#2EC4B6] select-none leading-none">2026</span>
                    </div>
                </div>
            </div> 
        </div>

        {/* pinjaman aktif */}
        <div className="p-4 mt-[-18]">
            <div className="w-full bg-white/1 border border-gray-800 rounded-2xl p-4">
                <div className="flex flex-row gap-4 items-center justify-between">
                    <div className="">
                        <div className="text-lg text-white font-extrabold">Pinjaman Aktif</div>
                    </div>
                    <span className="text-[#2EC4B6] select-none leading-none text-sm">View all</span>
                </div>
                <div className="py-2 gap-1 flex flex-col">
                    <div className="flex flex-col gap-1 py-1">
                        <div className="flex flex-rowm items-center justify-between font-semibold">
                            <div className="text-md">Shopee Paylater</div>
                            <div className="text-xs text-white/30">16% paid</div>
                        </div>
                        
                        <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden my-1">
                            <div 
                                className="h-full bg-[#2EC4B6] rounded-full transition-all duration-300"
                                style={{ width: '16%' }}
                            />
                        </div>
                        
                        <div className="flex flex-rowm items-center justify-between font-semibold">
                            <div className="text-xs text-white/30">Rp50.000</div>
                            <div className="text-xs text-white/30">Rp312.500</div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 py-1">
                        <div className="flex flex-rowm items-center justify-between font-semibold">
                            <div className="text-md">Easycash</div>
                            <div className="text-xs text-white/30">16% paid</div>
                        </div>
                        
                        <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden my-1">
                            <div 
                                className="h-full bg-[#2EC4B6] rounded-full transition-all duration-300"
                                style={{ width: '16%' }}
                            />
                        </div>
                        
                        <div className="flex flex-rowm items-center justify-between font-semibold">
                            <div className="text-xs text-white/30">Rp50.000</div>
                            <div className="text-xs text-white/30">Rp312.500</div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>

        {/* transaksi terakhir */}
        <div className="p-4 mt-[-18]">
            <div className="w-full bg-white/1 border border-gray-800 rounded-2xl p-4">
                <div className="flex flex-row gap-4 items-center justify-between">
                    <div className="">
                        <div className="text-lg text-white font-extrabold">Transaksi Terakhir</div>
                    </div>
                    <span className="text-[#2EC4B6] select-none leading-none text-sm">View all</span>
                </div>

                <div className="py-2 gap-3 flex flex-row items-center">
                    <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
                        <span className="material-icons text-[#e7ae3c]">ramen_dining</span>
                    </div>
                    <div className="flex flex-row gap-1 py-1 justify-between items-center w-full">
                        <div className="flex flex-row items-center justify-between font-semibold">
                            <div className="items-center justify-between font-semibold">
                                <div className="text-md">Beli ayam geprek</div>
                                <div className="text-xs text-white/30">Makanan - 13 Jul 2026</div>
                            </div>
                        </div>
                        <div className="text-md font-bold text-[#E74C3C]">-Rp12.500</div>
                    </div>
                </div>

                <div className="py-2 gap-3 flex flex-row items-center">
                    <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
                        <span className="material-icons text-[#3c92e7]">directions_car</span>
                    </div>
                    <div className="flex flex-row gap-1 py-1 justify-between items-center w-full">
                        <div className="flex flex-row items-center justify-between font-semibold">
                            <div className="items-center justify-between font-semibold">
                                <div className="text-md">Isi bensin</div>
                                <div className="text-xs text-white/30">Transportasi - 13 Jul 2026</div>
                            </div>
                        </div>
                        <div className="text-md font-bold text-[#E74C3C]">-Rp30.000</div>
                    </div>
                </div>

                <div className="py-2 gap-3 flex flex-row items-center">
                    <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
                        <span className="material-icons text-[#504124]">work</span>
                    </div>
                    <div className="flex flex-row gap-1 py-1 justify-between items-center w-full">
                        <div className="flex flex-row items-center justify-between font-semibold">
                            <div className="items-center justify-between font-semibold">
                                <div className="text-md">Gaji freelance</div>
                                <div className="text-xs text-white/30">Freelance - 13 Jul 2026</div>
                            </div>
                        </div>
                        <div className="text-md font-bold text-[#05DF72]">+Rp150.000</div>
                    </div>
                </div>

                <div className="py-2 gap-3 flex flex-row items-center">
                    <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
                        <span className="material-icons text-[#03a120]">paid</span>
                    </div>
                    <div className="flex flex-row gap-1 py-1 justify-between items-center w-full">
                        <div className="flex flex-row items-center justify-between font-semibold">
                            <div className="items-center justify-between font-semibold">
                                <div className="text-md">Uang bulanan</div>
                                <div className="text-xs text-white/30">Uang Saku - 12 Jul 2026</div>
                            </div>
                        </div>
                        <div className="text-md font-bold text-[#05DF72]">+Rp1.500.000</div>
                    </div>
                </div>

                <div className="py-2 gap-3 flex flex-row items-center">
                    <div className="flex items-center justify-center p-2.5 aspect-square bg-[#2EC4B6]/15 rounded-full shrink-0 h-fit">
                        <span className="material-icons text-[#d29852]">local_movies</span>
                    </div>
                    <div className="flex flex-row gap-1 py-1 justify-between items-center w-full">
                        <div className="flex flex-row items-center justify-between font-semibold">
                            <div className="items-center justify-between font-semibold">
                                <div className="text-md">Nonton Obsession</div>
                                <div className="text-xs text-white/30">Hiburan - 13 Jul 2026</div>
                            </div>
                        </div>
                        <div className="text-md font-bold text-[#E74C3C]">-Rp50.000</div>
                    </div>
                </div>
            </div> 

            
        </div>
      </div>
    </div>
  );
}