'use client';

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: "dashboard", href: "#" },
    { name: "Catatan Keuangan", icon: "account_balance_wallet", href: "#" },
    { name: "Kalkulator Bunga", icon: "calculate", href: "#" },
    { name: "Smart Assistant", icon: "chat_bubble", href: "#" },
    { name: "Before You Borrow", icon: "menu_book", href: "#" },
    { name: "Settings", icon: "settings", href: "#" },
  ];

  return (
    <>
      {/* Container Utama Terikat Layout Mobile (max-w-md) */}
      <div className="fixed inset-0 z-50 mx-auto max-w-md pointer-events-none overflow-hidden">
        
        {/* 1. Backdrop Overlay (Mengisi max-w-md) */}
        <div 
          onClick={onClose}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* 2. Drawer Sidebar (Muncul dari kiri area max-w-md) */}
        <aside 
          className={`absolute top-0 left-0 h-full w-4/5 max-w-70 bg-[#020306] border-r border-gray-800 p-6 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out pointer-events-auto ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Bagian Atas: Header, Profil, & Navigasi */}
          <div>
            {/* Tombol Close */}
            <div className="flex justify-end mb-4">
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white cursor-pointer flex items-center justify-center p-1 rounded-lg hover:bg-white/5"
              >
                <span className="material-icons select-none">close</span>
              </button>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-3 my-2">
              <span 
                className="material-icons text-gray-500 select-none leading-none shrink-0"
                style={{ fontSize: '40px', width: '40px', height: '40px' }}
              >
                account_circle
              </span>

              <div className="flex flex-col min-w-0">
                <div className="text-sm font-semibold text-white leading-tight truncate">Jane Doe</div>
                <div className="text-xs text-white/40 truncate">JaneDoe@gmail.com</div>
              </div>
            </div>

            <hr className="border-gray-800/80 my-4" />

            {/* Navigasi Menu */}
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const isActive = activeMenu === item.name;

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setActiveMenu(item.name)}
                    className={`relative flex items-center gap-3 p-3 rounded-xl text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-[#2EC4B6]/15 text-[#2EC4B6] font-semibold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:bg-[#2EC4B6] before:rounded-r-full'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'
                    }`}
                  >
                    <span className="material-icons text-xl select-none leading-none">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </nav>

            {/*  Log Out */}
            <div className="pt-4 border-t border-gray-800/80">
                <button className="flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors w-full cursor-pointer">
                <span className="material-icons text-xl select-none leading-none">logout</span>
                <span className="text-sm font-semibold">Log Out</span>
                </button>
            </div>
        </div>

          
        </aside>

      </div>
    </>
  );
}