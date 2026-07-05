"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import BottomNav from "@/components/layout/BottomNav";
import OfflineBanner from "@/components/layout/OfflineBanner";
import CapacitorNavigationFix from "@/components/capacitor/CapacitorNavigationFix";
import FarmerOnboardingGate from "@/components/onboarding/FarmerOnboardingGate";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <ToastProvider>
          <CapacitorNavigationFix />
          <FarmerOnboardingGate>
            <OfflineBanner />
            <Navbar />
            <main className="flex-grow pb-24 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
            <LanguageSwitcher />
          </FarmerOnboardingGate>
        </ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
