"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import RegisterComponent from "@/components/auth/register";
import VerifyOTPComponent from "@/components/auth/verify-otp";
import ProfileAuthComponent from "@/components/auth/profile-auth";
import ConditionComponent from "@/components/auth/condition";
import LoginPage from "@/components/auth/login";
import Dashboard from "@/components/main/dashboard";

type StepType = "register" | "otp" | "profile" | "condition" | "login" | "dashboard";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mengambil mode dari URL (?mode=...)
  const rawStep = searchParams.get("mode") || "register";
  
  // Menangani jika ada typo 'dasboard' tanpa huruf 'h' agar tetap dianggap 'dashboard'
  const step = rawStep === "dasboard" ? "dashboard" : rawStep;
  
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

      {/* Render Dashboard */}
      {step === "dashboard" && (
        <Dashboard />
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