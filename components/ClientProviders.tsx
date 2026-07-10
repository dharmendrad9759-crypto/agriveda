"use client";

import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/shell/AppSidebar";
import { NavDrawerProvider } from "@/components/shell/NavDrawerProvider";
import ShellTopBar from "@/components/shell/ShellTopBar";
import MobileShellTopBar from "@/components/shell/MobileShellTopBar";
import Footer from "@/components/footer";
import BottomNav from "@/components/layout/BottomNav";
import OfflineBanner from "@/components/layout/OfflineBanner";
import CapacitorNavigationFix from "@/components/capacitor/CapacitorNavigationFix";
import CapacitorBootstrap from "@/components/capacitor/CapacitorBootstrap";
import BootSplash from "@/components/BootSplash";
import FarmerOnboardingGate from "@/components/onboarding/FarmerOnboardingGate";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import AppPremiumBackground from "@/components/ui/AppPremiumBackground";
import { MotionConfig } from "framer-motion";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { isCapacitorNative } from "@/lib/capacitorNav";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const native = typeof window !== "undefined" && isCapacitorNative();

  return (
    <ThemeProvider>
      <LocaleProvider>
        <ToastProvider>
          <MotionConfig
            reducedMotion={native ? "always" : "user"}
            transition={{ duration: MOTION.normal, ease: EASE_OUT }}
          >
            <CapacitorBootstrap />
            <BootSplash />
            <CapacitorNavigationFix />
            <FarmerOnboardingGate>
              <NavDrawerProvider>
              <OfflineBanner />
              <div className="app-premium-shell relative flex min-h-screen flex-col lg:flex-row">
                <AppPremiumBackground />
                <AppSidebar />
                <div className="relative z-10 flex min-h-screen flex-1 flex-col">
                  <MobileShellTopBar />
                  <Navbar />
                  <ShellTopBar />
                  <main className="flex-grow bg-transparent pb-24 text-[var(--foreground)] lg:pb-0">{children}</main>
                  <Footer />
                  <BottomNav />
                </div>
              </div>
              <LanguageSwitcher />
              </NavDrawerProvider>
            </FarmerOnboardingGate>
          </MotionConfig>
        </ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
