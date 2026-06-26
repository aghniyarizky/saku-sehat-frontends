"use client";

import { useState } from "react";
import RegisterComponent from "@/components/auth/register";
import VerifyOTPComponent from "@/components/auth/verify-otp";

export default function AuthPage() {
  const [step, setStep] = useState<"register" | "otp" | "login">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleRegisterSuccess = (email: string) => {
    setRegisteredEmail(email); // Simpan email ke state utama
    setStep("otp");            // Langsung ubah UI ke halaman OTP
  };

  const handleOTPSuccess = () => {
    setStep("login");          // Ubah UI ke halaman login
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans p-5">
      
      {step === "register" && (
        <RegisterComponent 
          onRegisterSuccess={handleRegisterSuccess} 
          onSwitchToLogin={() => setStep("login")} 
        />
      )}

      {step === "otp" && (
        <VerifyOTPComponent 
          email={registeredEmail} 
          onSuccess={handleOTPSuccess} 
        />
      )}

      {step === "login" && (
        <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Halaman Login</h2>
          <p className="text-sm text-gray-600 mb-6">Silakan masukkan akun yang sudah aktif.</p>
          
          <button onClick={() => setStep("register")} className="text-sm text-blue-600 hover:underline">
            Kembali ke Register
          </button>
        </div>
      )}

    </div>
  );
}