'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubMenuItem {
  name: string;
  href: string;
  icon?: string;
}

interface MenuItem {
  name: string;
  icon: string;
  href?: string;
  subItems?: SubMenuItem[];
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const searchParams = useSearchParams();
  const currentMode = searchParams.get("mode") || "dashboard";

  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: "dashboard", href: "?mode=dashboard" },
    { 
      name: "Catatan Keuangan", 
      icon: "trending_up", 
      subItems: [
        { name: "Transaksi", icon: "trending_up", href: "?mode=transaksi" },
        { name: "Kelola Pinjaman", icon: "payments", href: "?mode=kelolapinjaman" },
        { name: "Budgeting", icon: "attach_money", href: "#" },
        { name: "Target Nabung", icon: "adjust", href: "#" },
      ]
    },
    { name: "Kalkulator Bunga", icon: "calculate", href: "?mode=kalkulator" },
    { 
      name: "Smart Assistant", 
      icon: "chat_bubble", 
      subItems: [
        { name: "AI Financial Coach", icon: "chat_bubble", href: "#" },
        { name: "Cari Aman", icon: "shield", href: "?mode=cariaman" },
      ]
    },
    { name: "Before You Borrow", icon: "menu_book", href: "?mode=beforeyouborrow" },
    { name: "Settings", icon: "settings", href: "#" },
  ];

  useEffect(() => {
    const queryHref = `?mode=${currentMode}`;

    let foundMatch = false;

    menuItems.forEach((item) => {
      if (item.subItems) {
        const matchedSub = item.subItems.find((sub) => sub.href === queryHref);
        if (matchedSub) {
          setActiveMenu(matchedSub.name);
          setOpenSubmenu(item.name);
          foundMatch = true;
        }
      } else if (item.href === queryHref) {
        setActiveMenu(item.name);
        foundMatch = true;
      }
    });

    if (!foundMatch && currentMode === "dashboard") {
      setActiveMenu("Dashboard");
    }
  }, [currentMode]);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(prev => prev === name ? null : name);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 mx-auto max-w-md pointer-events-none overflow-hidden">
        <div 
          onClick={onClose}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        <aside 
          className={`absolute top-0 left-0 h-full w-4/5 max-w-70 bg-[#020306] border-r border-gray-800 p-6 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out pointer-events-auto ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-end mb-4">
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-white cursor-pointer flex items-center justify-center p-1 rounded-lg hover:bg-white/5"
                >
                  <span className="material-icons select-none">close</span>
                </button>
              </div>

              {/* profile */}
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

              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isSubmenuOpen = openSubmenu === item.name;
                  const isAnySubActive = item.subItems?.some(sub => sub.name === activeMenu);
                  const isActive = activeMenu === item.name || isAnySubActive;

                  const activeStyles = isActive
                    ? 'bg-[#2EC4B6]/10 text-[#2EC4B6] font-semibold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:bg-[#2EC4B6] before:rounded-r-full'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium';

                  return (
                    <div key={item.name} className="flex flex-col">
                      {hasSubItems ? (
                        <button
                          onClick={() => toggleSubmenu(item.name)}
                          className={`relative flex items-center justify-between p-3 rounded-xl text-sm w-full transition-all duration-300 cursor-pointer ${activeStyles}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-icons text-xl select-none leading-none">
                              {item.icon}
                            </span>
                            <span>{item.name}</span>
                          </div>
                          <span className={`material-icons text-lg transition-transform duration-300 select-none ${
                            isSubmenuOpen ? 'rotate-180 text-white' : 'text-gray-500'
                          }`}>
                            expand_more
                          </span>
                        </button>
                      ) : (
                        <Link
                          href={item.href || "#"}
                          onClick={() => {
                            setActiveMenu(item.name);
                            onClose();
                          }}
                          className={`relative flex items-center justify-between p-3 rounded-xl text-sm w-full transition-all duration-300 cursor-pointer ${activeStyles}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-icons text-xl select-none leading-none">
                              {item.icon}
                            </span>
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      )}

                      {hasSubItems && (
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isSubmenuOpen 
                              ? 'grid-rows-[1fr] opacity-100 mt-1 mb-1' 
                              : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="flex flex-col pl-7 pr-2 py-1 gap-1 border-l border-gray-800 ml-5">
                              {item.subItems?.map((sub) => {
                                const isSubActive = activeMenu === sub.name;
                                return (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={() => {
                                      setActiveMenu(sub.name);
                                      onClose();
                                    }}
                                    className={`flex items-center gap-2.5 p-2 rounded-lg text-xs transition-colors ${
                                      isSubActive
                                        ? 'text-[#2EC4B6] font-semibold bg-[#2EC4B6]/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
                                    }`}
                                  >
                                    {sub.icon && (
                                      <span className="material-icons text-base select-none leading-none opacity-80">
                                        {sub.icon}
                                      </span>
                                    )}
                                    <span>{sub.name}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* logout */}
              <div className="pt-4 border-t border-gray-800/80 mt-4">
                <button className="flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors w-full cursor-pointer">
                  <span className="material-icons text-xl select-none leading-none">logout</span>
                  <span className="text-sm font-semibold">Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}