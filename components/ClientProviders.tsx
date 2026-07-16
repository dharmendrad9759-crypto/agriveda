"use client";

import { useState, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/shell/AppSidebar";
import { NavDrawerProvider } from "@/components/shell/NavDrawerProvider";
import ShellTopBar from "@/components/shell/ShellTopBar";
import MobileShellTopBar from "@/components/shell/MobileShellTopBar";
import Footer from "@/components/footer";
import BottomNav from "@/components/layout/BottomNav";
import OfflineBanner from "@/components/layout/OfflineBanner";
import PullToRefresh from "@/components/layout/PullToRefresh";
import CapacitorNavigationFix from "@/components/capacitor/CapacitorNavigationFix";
import CapacitorBootstrap from "@/components/capacitor/CapacitorBootstrap";
import NativeAppEssentials from "@/components/capacitor/NativeAppEssentials";
import BootSplash from "@/components/BootSplash";
import FarmerOnboardingGate from "@/components/onboarding/FarmerOnboardingGate";
import LocationBootstrap from "@/components/location/LocationBootstrap";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import GoogleTranslateBootstrap from "@/components/i18n/GoogleTranslateBootstrap";
import AppPremiumBackground from "@/components/ui/AppPremiumBackground";
import PageReveal from "@/components/motion/PageReveal";
import { MotionConfig } from "framer-motion";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { isCapacitorNative } from "@/lib/capacitorNav";

export default function ClientProviders({ children }: { children: ReactNode }) {
  // Sync on first client paint — avoids enabling heavy motion then flipping off
  const [native] = useState(() =>
    typeof window !== "undefined" ? isCapacitorNative() : false
  );

  return (
    <ThemeProvider>
      <LocaleProvider>
        <ToastProvider>
          {/* Native WebView: skip continuous Framer motion — major jank source on phones */}
          <MotionConfig
            reducedMotion={native ? "always" : "user"}
            transition={{ duration: MOTION.normal, ease: EASE_OUT }}
          >
            <GoogleTranslateBootstrap />
            <CapacitorBootstrap />
            <NativeAppEssentials />
            <CapacitorNavigationFix />
            <FarmerOnboardingGate>
              <LocationBootstrap />
              <PullToRefresh>
                <NavDrawerProvider>
                  <OfflineBanner />
                  <div className="app-premium-shell relative flex min-h-screen flex-col lg:flex-row">
                    <AppPremiumBackground />
                    <AppSidebar />
                    <div className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
                      <MobileShellTopBar />
                      <Navbar />
                      <ShellTopBar />
                      <main className="min-w-0 flex-grow overflow-x-hidden bg-transparent pb-24 text-[var(--foreground)] lg:pb-0">
                        {native ? children : <PageReveal>{children}</PageReveal>}
                      </main>
                      <Footer />
                      <BottomNav />
                    </div>
                  </div>
                  <LanguageSwitcher />
                </NavDrawerProvider>
              </PullToRefresh>
            </FarmerOnboardingGate>
          </MotionConfig>
          {/* Outside MotionConfig so phone UI jank-fix doesn't kill the open animation */}
          <BootSplash />
        </ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
