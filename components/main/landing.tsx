"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface LandingPageProps {
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
}

export default function LandingPage({
  onNavigateToLogin,
  onNavigateToRegister,
}: LandingPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#101828] text-white flex flex-col font-sans selection:bg-[#2EC4B6] selection:text-[#101828]">

      <header className="fixed top-0 z-50 w-full bg-[#101828]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/sakusehaticon-removebg.png"
                alt="Saku Sehat"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Saku Sehat
            </span>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#fitur" className="hover:text-[#2EC4B6] transition-colors">
              Fitur Utama
            </a>
            <a href="#cara-kerja" className="hover:text-[#2EC4B6] transition-colors">
              Cara Kerja
            </a>
            <a href="#tentang" className="hover:text-[#2EC4B6] transition-colors">
              Tentang
            </a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onNavigateToLogin}
              className="px-5 py-2.5 text-sm font-semibold text-white hover:text-[#2EC4B6] transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={onNavigateToRegister}
              className="px-5 py-2.5 text-sm font-bold bg-[#2EC4B6] hover:bg-[#23a89b] text-[#101828] rounded-full shadow-md hover:shadow-[#2EC4B6]/20 transition-all active:scale-95 cursor-pointer"
            >
              Mulai Sekarang
            </button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 right-0 z-50 w-72 h-full bg-[#0B111D] border-l border-gray-800 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Header Mobile Sidebar */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-800">
            <span className="text-lg font-bold text-[#2EC4B6]">Menu</span>
            <button
              onClick={closeMobileMenu}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-5 mt-6 font-medium text-gray-300">
            <a
              href="#fitur"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-800/60 hover:text-[#2EC4B6] transition-all"
            >
              Fitur Utama
            </a>
            <a
              href="#cara-kerja"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-800/60 hover:text-[#2EC4B6] transition-all"
            >
              Cara Kerja
            </a>
            <a
              href="#tentang"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-800/60 hover:text-[#2EC4B6] transition-all"
            >
              Tentang
            </a>
          </nav>
        </div>

        {/* Action Buttons inside Sidebar */}
        <div className="flex flex-col gap-3 pt-6 border-t border-gray-800">
          <button
            onClick={() => {
              closeMobileMenu();
              onNavigateToLogin?.();
            }}
            className="w-full py-2.5 text-center font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 rounded-full transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => {
              closeMobileMenu();
              onNavigateToRegister?.();
            }}
            className="w-full py-2.5 text-center font-bold bg-[#2EC4B6] hover:bg-[#23a89b] text-[#101828] rounded-full shadow-lg transition-all"
          >
            Mulai Sekarang
          </button>
        </div>
      </aside>

      <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto overflow-hidden">
        {/* Glow Effect Background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2EC4B6]/15 rounded-full blur-3xl pointer-events-none" />

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight lg:leading-none">
          Kelola Keuangan Lebih Sehat, <br className="hidden sm:inline" />
          <span className="bg-linear-to-r from-[#2EC4B6] via-[#A5F3FC] to-[#BEEDE8] bg-clip-text text-transparent">
            Ambil Keputusan Lebih Bijak
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl font-normal leading-relaxed">
          Mengelola keuangan bukan sekadar mencatat pengeluaran, tapi juga memahami kondisi finansial agar bisa mengambil keputusan yang lebih tepat di masa depan.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onNavigateToRegister}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-bold bg-[#2EC4B6] hover:bg-[#23a89b] text-[#101828] rounded-full shadow-xl shadow-[#2EC4B6]/20 transition-all active:scale-95 cursor-pointer"
          >
            Mulai Sekarang &gt;
          </button>
          <button
            onClick={onNavigateToLogin}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-full transition-all cursor-pointer"
          >
            Sudah punya akun
          </button>
        </div>
      </section>

      <section id="fitur" className="px-6 py-20 bg-[#0B111D] border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#2EC4B6] text-xs font-extrabold uppercase tracking-widest bg-[#2EC4B6]/10 px-3.5 py-1.5 rounded-full border border-[#2EC4B6]/20">
              Fitur Utama
            </span>
            <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-gray-400">
              Mulai dari mencatat pengeluaran sampai mengecek risiko pinjaman, semua bisa dilakukan dalam satu tempat.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#101828] border border-gray-800 hover:border-[#2EC4B6]/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#2EC4B6]/10 border border-[#2EC4B6]/20 flex items-center justify-center text-[#2EC4B6] font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  📊
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Budgeting</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Atur budget bulanan sesuai kebutuhan dan lihat sisa anggaranmu secara real-time supaya pengeluaran tetap terkontrol.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#101828] border border-gray-800 hover:border-[#2EC4B6]/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#2EC4B6]/10 border border-[#2EC4B6]/20 flex items-center justify-center text-[#2EC4B6] font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Teman Hemat</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Punya pertanyaan soal keuangan? Tanya aja ke AI. Mulai dari cara hemat, ngatur uang bulanan, sampai tips soal pinjaman.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#101828] border border-gray-800 hover:border-[#2EC4B6]/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#2EC4B6]/10 border border-[#2EC4B6]/20 flex items-center justify-center text-[#2EC4B6] font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  ⚖️
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Before You Borrow</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Masih ragu mau pinjam uang atau pakai paylater? AI akan bantu menganalisis apakah keputusan itu aman sesuai kondisi keuanganmu.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-[#101828] border border-gray-800 hover:border-[#2EC4B6]/50 transition-all flex flex-col justify-between group md:col-span-1 lg:col-span-1">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#2EC4B6]/10 border border-[#2EC4B6]/20 flex items-center justify-center text-[#2EC4B6] font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Cari Aman</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Tempel pesan SMS atau WhatsApp yang mencurigakan, lalu AI akan membantu mengecek apakah itu penawaran pinjaman yang aman atau berpotensi penipuan.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-[#101828] border border-gray-800 hover:border-[#2EC4B6]/50 transition-all flex flex-col justify-between group md:col-span-2 lg:col-span-2">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#2EC4B6]/10 border border-[#2EC4B6]/20 flex items-center justify-center text-[#2EC4B6] font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  🩺
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Financial Health</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Dapatkan skor Financial Health lengkap dengan penjelasan dan saran terpersonalisasi yang bisa membantu kondisi keuanganmu jadi jauh lebih baik.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="cara-kerja" className="px-6 py-20 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#2EC4B6] text-xs font-extrabold uppercase tracking-widest bg-[#2EC4B6]/10 px-3.5 py-1.5 rounded-full border border-[#2EC4B6]/20">
            Cara Kerja
          </span>
          <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight">
            Mulai dalam 3 Langkah Mudah
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-gray-400">
            Nggak ribet, cukup beberapa langkah untuk mulai mengelola keuanganmu dengan lebih baik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-[#0B111D] border border-gray-800 flex flex-col relative overflow-hidden">
            <span className="text-5xl font-black text-[#2EC4B6]/20 absolute top-4 right-4 select-none">
              01
            </span>
            <h3 className="text-lg font-bold text-white mb-2 z-10">Buat Akun</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed z-10">
              Daftar, verifikasi email, lalu lengkapi profilmu.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-[#0B111D] border border-gray-800 flex flex-col relative overflow-hidden">
            <span className="text-5xl font-black text-[#2EC4B6]/20 absolute top-4 right-4 select-none">
              02
            </span>
            <h3 className="text-lg font-bold text-white mb-2 z-10">Catat Keuanganmu</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed z-10">
              Masukkan pemasukan, pengeluaran, target tabungan atau data pinjaman. Bisa manual atau scan struk.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-[#0B111D] border border-gray-800 flex flex-col relative overflow-hidden">
            <span className="text-5xl font-black text-[#2EC4B6]/20 absolute top-4 right-4 select-none">
              03
            </span>
            <h3 className="text-lg font-bold text-white mb-2 z-10">Lihat Analisis AI</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed z-10">
              Pantau Financial Health, cek rencana pinjaman, dan dapatkan rekomendasi yang sesuai dengan kondisi keuanganmu.
            </p>
          </div>

        </div>
      </section>

      <section className="px-6 py-16 bg-[#0B111D] border-t border-gray-800">
        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-linear-to-b from-[#090e16] to-[#182133] border border-gray-700 text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
          
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#2EC4B6]/10 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-xl leading-snug">
            Yuk, Mulai Kelola Keuanganmu dari Sekarang!
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
            Dengan Saku Sehat, kamu bisa lebih paham kondisi keuanganmu, lebih siap menghadapi kebutuhan mendadak, dan lebih bijak sebelum mengambil keputusan finansial.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onNavigateToRegister}
              className="px-8 py-3.5 text-sm font-bold bg-[#2EC4B6] hover:bg-[#23a89b] text-[#101828] rounded-full shadow-lg transition-all cursor-pointer"
            >
              Daftar Sekarang &gt;
            </button>
            <button
              onClick={onNavigateToLogin}
              className="px-6 py-3.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Masuk
            </button>
          </div>
        </div>
      </section>

      <footer id="tentang" className="py-8 px-6 border-t border-gray-800/60 bg-[#090e16] text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400">Saku Sehat</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-gray-400">
            <a href="#fitur" className="hover:text-[#2EC4B6] transition-colors">Fitur</a>
            <a href="#cara-kerja" className="hover:text-[#2EC4B6] transition-colors">Cara Kerja</a>
            <button onClick={onNavigateToLogin} className="hover:text-[#2EC4B6] transition-colors">Login</button>
          </div>
        </div>
      </footer>

    </div>
  );
}