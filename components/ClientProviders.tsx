"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import QuickDial from "@/components/layout/QuickDial";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
        <QuickDial />
      </ToastProvider>
    </ThemeProvider>
  );
}
