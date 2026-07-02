"use client";

import { useState } from "react";
import RegisterComponent from "@/components/auth/register";
import VerifyOTPComponent from "@/components/auth/verify-otp";
import LoginPage from "@/components/auth/login";

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
  <div className="flex justify-center items-center min-h-screen bg-[#0b0f19] font-sans">
    
    <div className="w-full max-w-md min-h-screen flex flex-col justify-center relative overflow-hidden">
      
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
        <LoginPage 
          onSwitchToRegister={() => setStep("register")} 
        />
      )}

    </div>
  </div>
);
}