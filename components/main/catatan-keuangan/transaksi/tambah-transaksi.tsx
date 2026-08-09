'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';
import Pengeluaran from './pengeluaran';
import Pemasukan from './pemasukan'; 

interface TambahTransaksiProps {
  onSwitchToTransaction: () => void;
  onSwitchToScan?: () => void;
  onSwitchToAdd?: () => void;
}

export default function TambahTransaksi({ 
  onSwitchToTransaction, 
  onSwitchToScan, 
  onSwitchToAdd 
}: TambahTransaksiProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'pengeluaran' | 'pemasukan'>('pengeluaran');

  // Callback saat pembuatan transaksi berhasil disimpan
  const handleSuccessSave = () => {
    if (onSwitchToTransaction) {
      onSwitchToTransaction();
    }
  };

  return (
    <div className="relative w-full h-full p-6 py-8 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    
      {/* Header Utama */}
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2.5">
          <button 
            type="button"
            className="flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer duration-500"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-icons text-2xl select-none">menu</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Catatan Keuangan</h1>
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

      {/* Title & Back Button */}
      <div className="flex flex-row gap-5 items-center">
        <button 
          type="button"
          onClick={onSwitchToTransaction}
          className="flex items-center justify-center w-8 h-8 bg-[#3E3E3E] rounded-full border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors shrink-0"
        >
          <span className="material-icons text-lg text-white leading-none">arrow_back</span>
        </button>
        <div className="text-lg font-semibold leading-none">Tambah Transaksi</div>
      </div>

      {/* Switch Input Mode: Scan Struk vs Manual */}
      <div className="flex flex-row gap-2 justify-center">
        <button
          type="button"
          onClick={onSwitchToScan}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-gray-800 shrink-0"
        >
          <span 
            className="material-icons select-none leading-none text-[#2EC4B6]"
            style={{ fontSize: '13px', width: '13px', height: '13px' }}
          >
            qr_code_scanner
          </span>
          <span>Scan Struk</span>
        </button>

        <button
          type="button"
          onClick={onSwitchToAdd}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10 shrink-0"
        >
          <span 
            className="material-icons select-none leading-none text-[#0A2E2A]"
            style={{ fontSize: '13px', width: '13px', height: '13px' }}
          >
            add
          </span>
          <span>Manual</span>
        </button>
      </div>

      {/* Tab Selector: Pengeluaran vs Pemasukan */}
      <div className="flex flex-row w-full gap-2 justify-center text-center px-2">
        <button
          type="button"
          onClick={() => setTransactionType('pengeluaran')}
          className={`w-1/2 px-3.5 py-1.5 rounded-lg border-2 text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center justify-center gap-1.5 shrink-0 ${
            transactionType === 'pengeluaran'
              ? 'border-[#FB2C3666] bg-[#FB2C3626] text-white'
              : 'border-white/15 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span 
            className={`material-icons select-none leading-none ${
              transactionType === 'pengeluaran' ? 'text-[#FB2C36]' : 'text-white/40'
            }`}
            style={{ fontSize: '13px', width: '13px', height: '13px' }}
          >
            remove
          </span>
          <span>Pengeluaran</span>
        </button>

        <button
          type="button"
          onClick={() => setTransactionType('pemasukan')}
          className={`w-1/2 px-3.5 py-1.5 rounded-lg border-2 text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center justify-center gap-1.5 shrink-0 ${
            transactionType === 'pemasukan'
              ? 'border-[#05DF7266] bg-[#05DF7226] text-[#05DF72]'
              : 'border-white/15 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span 
            className={`material-icons select-none leading-none ${
              transactionType === 'pemasukan' ? 'text-[#05DF72]' : 'text-white/40'
            }`}
            style={{ fontSize: '13px', width: '13px', height: '13px' }}
          >
            add
          </span>
          <span>Pemasukan</span>
        </button>
      </div>

      {/* Render Form Berdasarkan Tab Active & Forwarding onSuccess Callback */}
      {transactionType === 'pengeluaran' ? (
        <Pengeluaran onSuccess={handleSuccessSave} />
      ) : (
        <Pemasukan onSuccess={handleSuccessSave} />
      )}
    </div>
  );
}