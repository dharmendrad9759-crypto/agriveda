"use client";

import AnalyticsBootstrap from "@/components/analytics/AnalyticsBootstrap";
import CapacitorBootstrap from "@/components/capacitor/CapacitorBootstrap";
import PushBootstrap from "@/components/capacitor/PushBootstrap";
import SqliteBootstrap from "@/components/capacitor/SqliteBootstrap";
import FarmCloudSyncBootstrap from "@/components/farm/FarmCloudSyncBootstrap";
import LaunchFlow from "@/components/launch/LaunchFlow";
import CapacitorNavigationFix from "@/components/capacitor/CapacitorNavigationFix";
import NativeAppEssentials from "@/components/capacitor/NativeAppEssentials";
import ForceUpdateGate from "@/components/capacitor/ForceUpdateGate";
import NativeFetchPatch from "@/components/capacitor/NativeFetchPatch";
import Footer from "@/components/footer";
import GoogleTranslateBootstrap from "@/components/i18n/GoogleTranslateBootstrap";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import BottomNav from "@/components/layout/BottomNav";
import OfflineBanner from "@/components/layout/OfflineBanner";
import PullToRefresh from "@/components/layout/PullToRefresh";
import LocationBootstrap from "@/components/location/LocationBootstrap";
import PageReveal from "@/components/motion/PageReveal";
import FarmerOnboardingGate from "@/components/onboarding/FarmerOnboardingGate";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import SecurityProtectionBootstrap from "@/components/security/SecurityProtectionBootstrap";
import FieldModeBootstrap from "@/components/settings/FieldModeBootstrap";
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
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export default function ClientProviders({ children }: { children: ReactNode }) {
  // Sync on first client paint — avoids enabling heavy motion then flipping off
  const [native] = useState(() =>
    typeof window !== "undefined" ? isCapacitorNative() : false
  );
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;
  const isFullScreenChat =
    pathname === "/ask-query" || pathname === "/ask" || pathname === "/expert-chat";

  return (
    <ThemeProvider>
      <LocaleProvider>
        <ToastProvider>
          {/* Native WebView: skip continuous Framer motion — major jank source on phones */}
          <MotionConfig
            reducedMotion={native ? "always" : "user"}
            transition={{ duration: MOTION.normal, ease: EASE_OUT }}
          >
            <SecurityProtectionBootstrap />
            <AnalyticsBootstrap />
            <CapacitorBootstrap />
            <FarmCloudSyncBootstrap />
            <NativeFetchPatch />
            <ForceUpdateGate />
            <NativeAppEssentials />
            <CapacitorNavigationFix />
            <ServiceWorkerRegister />
            <FieldModeBootstrap />
            <SqliteBootstrap />
            <GoogleTranslateBootstrap />
            {isAdminRoute ? (
              children
            ) : (
              <FarmerOnboardingGate>
                <LocationBootstrap />
                <PushBootstrap />
                <PullToRefresh>
                  <NavDrawerProvider>
                    <OfflineBanner />
                    <div className="app-premium-shell relative flex min-h-screen flex-col lg:flex-row">
                      <AppPremiumBackground />
                      <AppSidebar />
                      <div className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
                        <MobileShellTopBar />
                        <ShellTopBar />
                        <main
                          className={cn(
                            "min-w-0 flex-grow overflow-x-hidden bg-transparent text-[var(--foreground)] lg:pb-0",
                            isFullScreenChat ? "pb-0" : "pb-24"
                          )}
                        >
                          <PageReveal>{children}</PageReveal>
                        </main>
                        <Footer />
                        <BottomNav />
                      </div>
                    </div>
                  </NavDrawerProvider>
                </PullToRefresh>
              </FarmerOnboardingGate>
            )}
          </MotionConfig>
          {/* Outside MotionConfig so native reduced-motion doesn't kill splash CSS */}
          {!isAdminRoute ? <LaunchFlow /> : null}
        </ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
