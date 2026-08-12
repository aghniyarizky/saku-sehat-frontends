'use client';

import { useState, useRef } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../sidebar';
import { useRouter } from "next/navigation";

import Header from "../../header";

interface ScanStrukProps {
    onSwitchToTransaction: () => void;
    onSwitchToScan?: () => void;
    onSwitchToAdd?: () => void;
}

interface HasilScan {
    Catatan_Transaksi: string;
    tipe: "pengeluaran" | "pemasukan";
    kategori: string;
    Sumber_Dana: string;
    nominal: number;
    tanggal: string;
    createdAt?: string;
}

export default function ScanStruk({ onSwitchToTransaction, onSwitchToScan, onSwitchToAdd }: ScanStrukProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [hasilScan, setHasilScan] = useState<HasilScan | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Harap unggah file gambar (JPG/PNG).');
            return;
        }
        setImageFile(file);
        setSelectedImage(URL.createObjectURL(file));
        setHasilScan(null);
        setErrorMessage("");
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImageFile(null);
        setHasilScan(null);
        setErrorMessage("");
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            alert("Pilih gambar terlebih dahulu!");
            return;
        }

        setIsLoading(true);
        setHasilScan(null);
        setErrorMessage("");

        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/scan`, {
                method: "POST",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();

                let errorMessageParsed = "Gagal mengunggah gambar ke server.";
                try {
                    const parsedJson = JSON.parse(errorText);
                    errorMessageParsed = parsedJson.error || parsedJson.message || errorMessageParsed;
                } catch {
                    errorMessageParsed = errorText || `Error HTTP: ${response.status}`;
                }

                throw new Error(errorMessageParsed);
            }

            const reader = response.body!.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine.startsWith("data:")) continue;

                    const jsonStr = trimmedLine.replace("data:", "").trim();
                    try {
                        const parsed = JSON.parse(jsonStr);

                        if (parsed.type === "done") {
                            setHasilScan(parsed.result);
                        } else if (parsed.type === "error") {
                            setErrorMessage(parsed.text || "Terjadi kesalahan saat memproses gambar.");
                        }
                    } catch {
                    }
                }
            }
        } catch (error: any) {
            setErrorMessage(error.message || "Gagal terhubung ke server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full h-full p-6 py-10 flex flex-col gap-6 bg-[#101828] text-white overflow-y-auto overflow-x-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

      <div className="lg:max-w-6xl lg:mx-auto lg:w-full flex flex-col gap-4">

            <Header
                    title="Catatan Keuangan"
                    onOpenSidebar={() => setIsSidebarOpen(true)}
                     onProfileClick={() => router.push("/?mode=profile-edit")}
                  />

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

            <div className="flex flex-row gap-2 justify-center">
                <button
                    type="button"
                    onClick={onSwitchToScan}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] shadow-md shadow-[#2EC4B6]/10 shrink-0"
                >
                    <span
                        className="material-icons select-none leading-none text-[#0A2E2A]"
                        style={{ fontSize: '13px', width: '13px', height: '13px' }}
                    >
                        qr_code_scanner
                    </span>
                    <span>Scan Struk</span>
                </button>

                <button
                    type="button"
                    onClick={onSwitchToAdd}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-1.5 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-gray-800 shrink-0"
                >
                    <span
                        className="material-icons select-none leading-none text-[#2EC4B6]"
                        style={{ fontSize: '13px', width: '13px', height: '13px' }}
                    >
                        add
                    </span>
                    <span>Manual</span>
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 mt-2">
                    {!selectedImage ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`w-full min-h-[220px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
                            isDragging
                                ? 'border-[#2EC4B6] bg-[#2EC4B6]/10 scale-[1.01]'
                                : 'border-white/20 bg-white/5 hover:border-[#2EC4B6]/50 hover:bg-white/[0.07]'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-[#2EC4B6]/10 text-[#2EC4B6] flex items-center justify-center mb-3">
                                <span className="material-icons text-2xl">upload</span>
                            </div>
                            <p className="text-sm font-semibold text-white mb-1">Upload file kamu di sini</p>
                            <p className="text-xs text-gray-500 mb-4">JPG, PNG, PDF maks. 5MB</p>
                            <div className="p-2 border border-white/10 text-sm rounded-full px-4"> Browse Files </div>
                        </div>
                    ) : (
                        <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-white/5 p-3 flex flex-col items-center">
                            <div className="relative w-full max-h-[300px] overflow-hidden rounded-xl bg-black/40 flex items-center justify-center">
                                <img
                                    src={selectedImage}
                                    alt="Struk Preview"
                                    className="w-full h-auto max-h-[300px] object-contain"
                                />
                            </div>

                            <div className="flex flex-row justify-between items-center w-full mt-3 px-1">
                                <span className="text-xs text-gray-300 truncate max-w-[200px]">
                                    {imageFile?.name}
                                </span>

                                <div className="flex flex-row gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-2.5 py-1 rounded-lg bg-white/10 text-xs text-gray-200 hover:bg-white/20 transition-colors"
                                    >
                                        Ganti
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="px-2.5 py-1 rounded-lg bg-red-500/20 text-xs text-red-400 hover:bg-red-500/30 transition-colors"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!selectedImage || isLoading}
                        className={`w-full py-3 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                            !selectedImage || isLoading
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] cursor-pointer'
                        }`}
                    >
                        <span className="material-icons text-base">auto_awesome</span>
                        <span>{isLoading ? "Sedang Menganalisis..." : "Mulai Scan"}</span>
                    </button>

                    {errorMessage && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                            {errorMessage}
                        </div>
                    )}

                    {(hasilScan || isLoading) && (
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-3">
                            <span className="text-xs font-semibold text-[#2EC4B6]">Hasil Analisis AI:</span>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center gap-3 py-8">
                                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#2EC4B6] animate-spin" />
                                    <div className="text-xs text-white/60 text-center">AI sedang membaca dan menganalisis struk...</div>
                                </div>
                            ) : hasilScan ? (
                                <div className="flex flex-col gap-2">
                                    <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                                        <p className="text-gray-400 text-xs">Catatan Transaksi</p>
                                        <p className="font-semibold text-white text-sm">{hasilScan.Catatan_Transaksi}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                                            <p className="text-gray-400">Kategori</p>
                                            <p className="font-semibold text-white">{hasilScan.kategori}</p>
                                        </div>
                                        <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                                            <p className="text-gray-400">Sumber Dana</p>
                                            <p className="font-semibold text-white">{hasilScan.Sumber_Dana}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 p-2 rounded-lg border border-white/10 text-xs">
                                        <p className="text-gray-400">Tanggal</p>
                                        <p className="font-semibold text-white">{hasilScan.tanggal}</p>
                                    </div>

                                    <div className="bg-white/5 p-3 rounded-lg border border-[#2EC4B6]/30">
                                        <p className="text-gray-400 text-xs">Nominal Total</p>
                                        <p className="text-xl font-bold text-[#2EC4B6]">
                                            {formatRupiah(hasilScan.nominal)}
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </form>
        </div>
        </div>
    );
}