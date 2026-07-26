'use client';

import { useState, useRef } from "react";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../sidebar';

interface ScanStrukProps {
    onSwitchToTransaction: () => void;
    onSwitchToScan?: () => void;
    onSwitchToAdd?: () => void;
}

export default function ScanStruk({ onSwitchToTransaction, onSwitchToScan, onSwitchToAdd }: ScanStrukProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

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
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

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
                    type="button"
                    // disabled={!selectedImage}
                    className={`w-full py-3 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                        'bg-[#2EC4B6] text-[#0A2E2A] hover:bg-[#28b3a6] cursor-pointer' 
                    }`}
                >
                    {/* <span className="material-icons text-base">auto_awesome</span> */}
                    <span>Mulai Scan</span>
                </button>
            </div>
        </div>
    );
}