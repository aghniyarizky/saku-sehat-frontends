"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Landing from "@/components/main/landing";
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
import EditTransaksi from "@/components/main/catatan-keuangan/transaksi/[id]/page";
import EditPinjaman from "@/components/main/catatan-keuangan/kelola-pinjaman/[id]/page";
import Budgeting from "@/components/main/catatan-keuangan/budgeting/budgeting";
import TambahBudgeting from "@/components/main/catatan-keuangan/budgeting/tambah-budgeting";
import EditBudgeting from "@/components/main/catatan-keuangan/budgeting/[id]/page";
import TargetNabung from "@/components/main/catatan-keuangan/target-nabung/target-nabung";
import TambahTargetNabung from "@/components/main/catatan-keuangan/target-nabung/tambah-target";
import EditTargetNabung from "@/components/main/catatan-keuangan/target-nabung/[id]/page";
import BeforeYouBorrow from "@/components/main/before-you-borrow/before-you-borrow";
import CariAman from "@/components/main/smart-assistant/cari-aman";
import FinancialHealth from "@/components/main/financial-health/financial-health";
import EditProfile from "@/components/main/profile-user";

type StepType =
  | "landing"
  | "register"
  | "otp"
  | "profile"
  | "condition"
  | "login"
  | "dashboard"
  | "transaksi"
  | "scanstruk"
  | "tambahtransaksi"
  | "edittransaksi"
  | "kelolapinjaman"
  | "tambahpinjaman"
  | "editpinjaman"
  | "kalkulator"
  | "budgeting"
  | "tambahbudgeting"
  | "editbudgeting"
  | "targetnabung"
  | "tambahtargetnabung"
  | "edittargetnabung"
  | "beforeyouborrow"
  | "cariaman"
  | "financialhealth"
  | "profileedit";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawStep = (searchParams.get("mode") || "").trim().toLowerCase();

  const id = searchParams.get("id");
  const transactionId = id;
  const pinjamanId = id;
  const budgetingId = id;
  const targetNabungId = id;

  const getStep = (): StepType => {
    if (!rawStep) return "landing";
    if (rawStep === "landing") return "landing";

    if (rawStep === "dashboard") return "dashboard";
    if (["transaksi", "transaction"].includes(rawStep)) return "transaksi";
    if (["scanstruk", "scan"].includes(rawStep)) return "scanstruk";
    if (["tambahtransaksi", "tambah"].includes(rawStep))
      return "tambahtransaksi";
    if (
      ["edittransaksi", "edit-transaksi", "detailtransaksi"].includes(rawStep)
    )
      return "edittransaksi";
    if (["kelolapinjaman", "pinjaman"].includes(rawStep))
      return "kelolapinjaman";
    if (["tambahpinjaman", "tambahpeminjaman"].includes(rawStep))
      return "tambahpinjaman";
    if (["editpinjaman", "edit-pinjaman", "detailpinjaman"].includes(rawStep))
      return "editpinjaman";
    if (rawStep === "kalkulator") return "kalkulator";
    if (["beforeyouborrow", "before-you-borrow", "borrow"].includes(rawStep))
      return "beforeyouborrow";
    if (["cariaman", "cari-aman"].includes(rawStep)) return "cariaman";
    if (["financialhealth", "financial-health"].includes(rawStep)) return "financialhealth";

    if (["budgeting", "budget"].includes(rawStep)) return "budgeting";
    if (["tambahbudgeting", "tambahbudget"].includes(rawStep))
      return "tambahbudgeting";
    if (["editbudgeting", "editbudget"].includes(rawStep))
      return "editbudgeting";

    if (["targetnabung", "target"].includes(rawStep)) return "targetnabung";
    if (["tambahtargetnabung", "tambahtarget"].includes(rawStep))
      return "tambahtargetnabung";
    if (["edittargetnabung", "edittarget"].includes(rawStep))
      return "edittargetnabung";

    if (
      ["register", "otp", "profile", "condition", "login"].includes(rawStep)
    ) {
      return rawStep as StepType;
    }

    if (["profileedit", "profile-edit", "edit-profile"].includes(rawStep)) {
      return "profileedit";
    }

    return "register";

  };

  const step = getStep();
  const [registeredEmail, setRegisteredEmail] = useState("user@gmail.com");

  const setStep = (newStep: StepType) => {
    router.push(`/?mode=${newStep}`);
  };

  const handleSave = (updatedData: any) => {
  console.log("Data profil berhasil diupdate:", updatedData);
  setStep("dashboard");
};
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#101828] relative overflow-x-hidden">
      {step === "landing" && (
        <Landing
          onNavigateToLogin={() => setStep("login")}
          onNavigateToRegister={() => setStep("register")}
        />
      )}

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
            setStep("dashboard");
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
          onSwitchToEdit={(id: number | string) =>
            router.push(`/?mode=edittransaksi&id=${id}`)
          }
        />
      )}

      {step === "edittransaksi" && (
        <EditTransaksi
          transactionId={transactionId}
          onSwitchToTransaction={() => setStep("transaksi")}
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
          onSwitchToEdit={(id: number | string) =>
            router.push(`/?mode=editpinjaman&id=${id}`)
          }
        />
      )}

      {step === "tambahpinjaman" && (
        <TambahPinjaman
          onSwitchToKelolaPinjaman={() => setStep("kelolapinjaman")}
        />
      )}

      {step === "editpinjaman" && (
        <EditPinjaman
          pinjamanId={pinjamanId}
          onSwitchToTransaction={() => setStep("kelolapinjaman")}
        />
      )}

      {step === "kalkulator" && <KalkulatorBunga />}
      {step === "beforeyouborrow" && <BeforeYouBorrow />}
      {step === "cariaman" && <CariAman />}
      {step === "financialhealth" && <FinancialHealth />}
      {step === "budgeting" && (
        <Budgeting
          onSwitchToAddBudget={() => setStep("tambahbudgeting")}
          onSwitchToEditBudget={(id: number | string) =>
            router.push(`/?mode=editbudgeting&id=${id}`)
          }
        />
      )}

      {step === "tambahbudgeting" && (
        <TambahBudgeting onSwitchToBudgeting={() => setStep("budgeting")} />
      )}

      {step === "editbudgeting" && (
        <EditBudgeting
          budgetingId={budgetingId}
          onSwitchToBudgeting={() => setStep("budgeting")}
        />
      )}

      {step === "targetnabung" && (
        <TargetNabung
          onSwitchToAddTarget={() => setStep("tambahtargetnabung")}
          onSwitchToEditTarget={(id: number | string) =>
            router.push(`/?mode=edittargetnabung&id=${id}`)
          }
        />
      )}

      {step === "tambahtargetnabung" && (
        <TambahTargetNabung
          onSwitchToTargetNabung={() => setStep("targetnabung")}
        />
      )}

      {step === "edittargetnabung" && (
        <EditTargetNabung
          targetId={targetNabungId}
          onSwitchToTargetNabung={() => setStep("targetnabung")}
        />
      )}

      {step === "profileedit" && (
        <EditProfile 
          isOpen={true} 
          onClose={() => setStep("dashboard")}
          onBack={() => setStep("dashboard")}
          userData={{ username: "", email: "", fullName: "", fotoProfilUrl: "", sumberPemasukan: "" }} 
          onSave={handleSave}
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