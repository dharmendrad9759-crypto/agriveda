"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface ComingSoonPageProps {
  title: string;
  subtitle?: string;
}

export default function ComingSoonPage({ title, subtitle }: ComingSoonPageProps) {
  return (
    <main className="agriveda-page crop-premium-page relative min-h-screen pb-28">

      <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 text-emerald-500"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-extrabold theme-text-primary">{title}</h1>
        </div>
      </header>

      <div className="relative mx-auto flex max-w-lg flex-col items-center px-5 pt-16 text-center">
        <GlassCard neon className="w-full p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-black theme-text-primary">Coming Soon</h2>
          <p className="mt-2 text-sm theme-text-muted">
            {subtitle ?? "Futuristic layout for this service is under build."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-2xl bg-[#006432] px-6 py-3 text-sm font-black text-white"
          >
            Back to Home
          </Link>
        </GlassCard>
      </div>
    </main>
  );
}
