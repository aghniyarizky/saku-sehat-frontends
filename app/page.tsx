"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import RegisterComponent from "@/components/auth/register";
import VerifyOTPComponent from "@/components/auth/verify-otp";
import ProfileAuthComponent from "@/components/auth/profile-auth";
import ConditionComponent from "@/components/auth/condition";
import LoginPage from "@/components/auth/login";
import Dashboard from "@/components/main/dashboard";
import Transaksi from "@/components/main/catatan-keuangan/transaksi";
import ScanStruk from "@/components/main/catatan-keuangan/scan-struk";
import TambahTransaksi from "@/components/main/catatan-keuangan/tambah-transaksi";

type StepType = 
  | "register" 
  | "otp" 
  | "profile" 
  | "condition" 
  | "login" 
  | "dashboard" 
  | "transaksi" 
  | "scanstruk"
  | "tambahtransaksi";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawStep = searchParams.get("mode") || "register";
  
  let step: StepType = "register";
  if (rawStep === "dasboard" || rawStep === "dashboard") {
    step = "dashboard";
  } else if (rawStep === "transaksi" || rawStep === "transaction") {
    step = "transaksi";
  } else if (rawStep === "scanstruk" || rawStep === "scan") {
    step = "scanstruk";
  } else if (rawStep === "tambahtransaksi" || rawStep === "tambah") { 
    step = "tambahtransaksi";
  } else if (["register", "otp", "profile", "condition", "login"].includes(rawStep)) {
    step = rawStep as StepType;
  }
  
  const [registeredEmail, setRegisteredEmail] = useState("user@gmail.com");

  const setStep = (newStep: StepType) => {
    router.push(`/?mode=${newStep}`);
  };

  return (
    <div className="w-full max-w-md h-screen flex flex-col bg-[#101828] relative overflow-hidden">
      
      {step === "register" && (
        <RegisterComponent 
          onRegisterSuccess={(email) => { setRegisteredEmail(email); setStep("otp"); }} 
          onSwitchToLogin={() => setStep("login")} 
        />
      )}

      {step === "otp" && (
        <VerifyOTPComponent 
          email={registeredEmail} 
          onSuccess={() => setStep("profile")} 
          onBackToRegister={() => setStep("register")}
        />
      )}

      {step === "profile" && (
        <ProfileAuthComponent 
          email={registeredEmail}
          onNext={() => setStep("condition")}
          onSkip={() => setStep("condition")}
          onSwitchToLogin={() => setStep("login")}
        />
      )}

      {step === "condition" && (
        <ConditionComponent 
          email={registeredEmail}
          onNext={() => setStep("login")}
          onSkip={() => setStep("login")}
          onSwitchToLogin={() => setStep("login")}
        />
      )}

      {step === "login" && (
        <LoginPage 
          onSwitchToRegister={() => setStep("register")} 
          onLoginSuccess={() => setStep("dashboard")}
        />
      )}

      {step === "dashboard" && (
        <Dashboard />
      )}

      {step === "transaksi" && (
        <Transaksi 
          onSwitchToScan={() => setStep("scanstruk")} 
          onSwitchToAdd={() => setStep("tambahtransaksi")} 
        />
      )}

      {/* Render Scan Struk */}
      {step === "scanstruk" && (
        <ScanStruk 
          onSwitchToTransaction={() => setStep("transaksi")} 
          onSwitchToScan={() => setStep("scanstruk")}
          onSwitchToAdd={() => setStep("tambahtransaksi")}
        />
      )}

      {/* Render Tambah Transaksi */}
      {step === "tambahtransaksi" && (
        <TambahTransaksi 
          onSwitchToTransaction={() => setStep("transaksi")} 
          onSwitchToScan={() => setStep("scanstruk")}
          onSwitchToAdd={() => setStep("tambahtransaksi")}
        />
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0b0f19] font-sans">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <AuthContent />
      </Suspense>
    </div>
  );
}