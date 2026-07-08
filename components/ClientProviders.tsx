"use client";

import Navbar from "@/components/Navbar";
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
              <OfflineBanner />
              <Navbar />
              <main className="flex-grow pb-24 md:pb-0">{children}</main>
              <Footer />
              <BottomNav />
              <LanguageSwitcher />
            </FarmerOnboardingGate>
          </MotionConfig>
        </ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
