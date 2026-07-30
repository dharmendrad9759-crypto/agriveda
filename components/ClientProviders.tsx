"use client";

import AnalyticsBootstrap from "@/components/analytics/AnalyticsBootstrap";
import BootSplash from "@/components/BootSplash";
import CapacitorBootstrap from "@/components/capacitor/CapacitorBootstrap";
import CapacitorNavigationFix from "@/components/capacitor/CapacitorNavigationFix";
import NativeAppEssentials from "@/components/capacitor/NativeAppEssentials";
import Footer from "@/components/footer";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import BottomNav from "@/components/layout/BottomNav";
import OfflineBanner from "@/components/layout/OfflineBanner";
import PullToRefresh from "@/components/layout/PullToRefresh";
import LocationBootstrap from "@/components/location/LocationBootstrap";
import PageReveal from "@/components/motion/PageReveal";
import Navbar from "@/components/Navbar";
import FarmerOnboardingGate from "@/components/onboarding/FarmerOnboardingGate";
import AppSidebar from "@/components/shell/AppSidebar";
import MobileShellTopBar from "@/components/shell/MobileShellTopBar";
import { NavDrawerProvider } from "@/components/shell/NavDrawerProvider";
import ShellTopBar from "@/components/shell/ShellTopBar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AppPremiumBackground from "@/components/ui/AppPremiumBackground";
import { ToastProvider } from "@/components/ui/Toast";
import { isCapacitorNative } from "@/lib/capacitorNav";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { MotionConfig } from "framer-motion";
import { useState, type ReactNode } from "react";

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
            <AnalyticsBootstrap />
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
                        <PageReveal>{children}</PageReveal>
                      </main>
                      <Footer />
                      <BottomNav />
                    </div>
                  </div>
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
