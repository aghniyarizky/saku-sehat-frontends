"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import RegisterComponent from "@/components/auth/register";
import VerifyOTPComponent from "@/components/auth/verify-otp";
import ProfileAuthComponent from "@/components/auth/profile-auth";
import ConditionComponent from "@/components/auth/condition";
import LoginPage from "@/components/auth/login";
import Dashboard from "@/components/main/dashboard";
import Transaksi from "@/components/main/catatan-keuangan/transaksi/transaksi";
import ScanStruk from "@/components/main/catatan-keuangan/transaksi/scan-struk";
import TambahTransaksi from "@/components/main/catatan-keuangan/transaksi/tambah-transaksi";
import Pinjaman from "@/components/main/catatan-keuangan/kelola-pinjaman/pinjaman";
import TambahPinjaman from "@/components/main/catatan-keuangan/kelola-pinjaman/tambah-pinjaman";
import KalkulatorBunga from "@/components/main/catatan-keuangan/kelola-pinjaman/kalkulator-bunga";

type StepType = 
  | "register" 
  | "otp" 
  | "profile" 
  | "condition" 
  | "login" 
  | "dashboard" 
  | "transaksi" 
  | "scanstruk"
  | "tambahtransaksi"
  | "kelolapinjaman"
  | "tambahpinjaman"
  | "kalkulator";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawStep = searchParams.get("mode") || "register";
  
  let step: StepType = "register";
  if (rawStep === "dashboard") {
    step = "dashboard";
  } else if (rawStep === "transaksi" || rawStep === "transaction") {
    step = "transaksi";
  } else if (rawStep === "scanstruk" || rawStep === "scan") {
    step = "scanstruk";
  } else if (rawStep === "tambahtransaksi" || rawStep === "tambah") { 
    step = "tambahtransaksi";
  } else if (rawStep === "kelolapinjaman" || rawStep === "pinjaman") { 
    step = "kelolapinjaman";
  } else if (rawStep === "tambahpinjaman" || rawStep === "tambahpeminjaman") {
    step = "tambahpinjaman";
  } else if (rawStep === "kalkulator") {
    step = "kalkulator";
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
          onRegisterSuccess={(data: any) => { 
            const emailStr = typeof data === "string" ? data : data.email;
            setRegisteredEmail(emailStr); 
            setStep("otp"); 
          }} 
          onSwitchToLogin={() => setStep("login")} 
        />
      )}

      {step === "login" && (
        <LoginPage 
          onSwitchToRegister={() => setStep("register")} 
          onLoginSuccess={(data: any) => {
            const emailStr = typeof data === "string" ? data : data.email;
            if (emailStr) setRegisteredEmail(emailStr);
            setStep("profile");
          }}
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
          onNext={() => setStep("dashboard")} 
          onSkip={() => setStep("dashboard")}
          onSwitchToProfileAuth={() => setStep("profile")}
        />
      )}

      {step === "dashboard" && <Dashboard />}

      {step === "transaksi" && (
        <Transaksi 
          onSwitchToScan={() => setStep("scanstruk")} 
          onSwitchToAdd={() => setStep("tambahtransaksi")} 
        />
      )}

      {step === "scanstruk" && (
        <ScanStruk 
          onSwitchToTransaction={() => setStep("transaksi")} 
          onSwitchToScan={() => setStep("scanstruk")}
          onSwitchToAdd={() => setStep("tambahtransaksi")}
        />
      )}

      {step === "tambahtransaksi" && (
        <TambahTransaksi 
          onSwitchToTransaction={() => setStep("transaksi")} 
          onSwitchToScan={() => setStep("scanstruk")}
          onSwitchToAdd={() => setStep("tambahtransaksi")}
        />
      )}

      {step === "kelolapinjaman" && (
        <Pinjaman 
          onSwitchToKalkulator={() => setStep("kalkulator")}
          onSwitchToAddPinjaman={() => setStep("tambahpinjaman")}
        />
      )}

      {step === "tambahpinjaman" && <TambahPinjaman onSwitchToKelolaPinjaman={() => setStep("kelolapinjaman")} />}
      {step === "kalkulator" && <KalkulatorBunga />}
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