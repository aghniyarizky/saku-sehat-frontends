"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import RegisterComponent from "@/components/auth/register";
import VerifyOTPComponent from "@/components/auth/verify-otp";
import ProfileAuthComponent from "@/components/auth/profile-auth";
import ConditionComponent from "@/components/auth/condition";
import LoginPage from "@/components/auth/login";

type StepType = "register" | "otp" | "profile" | "condition" | "login";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil mode dari URL (?mode=...), default ke "register"
  const step = (searchParams.get("mode") as StepType) || "register";
  
  // State simpan email
  const [registeredEmail, setRegisteredEmail] = useState("user@gmail.com");

  // Helper untuk ubah URL di address bar
  const setStep = (newStep: StepType) => {
    router.push(`/?mode=${newStep}`);
  };

  // --- HANDLER NAVIGASI ---
  const handleRegisterSuccess = (email: string) => {
    setRegisteredEmail(email);
    setStep("otp");
  };

  const handleOTPSuccess = () => {
    setStep("profile");
  };

  const handleProfileNext = () => {
    setStep("condition");
  };

  const handleConditionFinish = () => {
    setStep("login");
  };

  return (
    <div className="w-full max-w-md min-h-screen flex flex-col justify-center relative overflow-hidden">
      
      {/* Step 1: Register */}
      {step === "register" && (
        <RegisterComponent 
          onRegisterSuccess={handleRegisterSuccess} 
          onSwitchToLogin={() => setStep("login")} 
        />
      )}

      {/* Step 2: Verify OTP */}
      {step === "otp" && (
        <VerifyOTPComponent 
          email={registeredEmail} 
          onSuccess={handleOTPSuccess} 
          onBackToRegister={() => setStep("register")}
        />
      )}

      {/* Step 3: Profile Auth (Lengkapi Profil - Opsional) */}
      {step === "profile" && (
        <ProfileAuthComponent 
          email={registeredEmail}
          onNext={handleProfileNext}
          onSkip={handleProfileNext}
          onSwitchToLogin={() => setStep("login")}
        />
      )}

      {/* Step 4: Condition (Kondisi Awal Financial/User) */}
      {step === "condition" && (
        <ConditionComponent 
          email={registeredEmail}
          onNext={handleConditionFinish}
          onSkip={handleConditionFinish}
          onSwitchToLogin={() => setStep("login")}
        />
      )}

      {/* Step 5: Login */}
      {step === "login" && (
        <LoginPage 
          onSwitchToRegister={() => setStep("register")} 
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