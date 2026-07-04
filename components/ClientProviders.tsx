"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import TranslatorFab from "@/components/layout/TranslatorFab";
import FloatingAiButton from "@/components/layout/FloatingAiButton";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
        <TranslatorFab />
        <FloatingAiButton />
        {/* Hidden Google Translate host — driven by TranslatorFab cookies */}
        <div id="google_translate_element" className="hidden" aria-hidden />
      </ToastProvider>
    </ThemeProvider>
  );
}
