"use client";

import AppLink from "@/components/ui/AppLink";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import PageBackground from "@/components/ui/PageBackground";
import { BRAND } from "@/lib/brand";

interface Agriveda2ShellProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  badge?: string;
  children: ReactNode;
}

export default function Agriveda2Shell({
  title,
  subtitle,
  backHref = "/",
  badge = BRAND,
  children,
  premium = false,
}: Agriveda2ShellProps & { premium?: boolean }) {
  return (
    <div className={premium ? "agriveda-page-premium relative min-h-screen pb-28" : "agriveda-page relative min-h-screen pb-28"}>
      <PageBackground premium={premium} />
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${premium ? "border-amber-500/15 bg-stone-950/90" : "border-emerald-500/15 bg-[var(--background)]/92"}`}>
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3.5">
          <AppLink
            href={backHref}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border active:scale-95 ${premium ? "border-amber-500/25 bg-amber-500/5 text-amber-400" : "border-emerald-500/25 bg-emerald-500/5 text-emerald-600"}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </AppLink>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className={`h-3.5 w-3.5 ${premium ? "text-amber-500" : "text-emerald-500"}`} />
              <span className={`text-[10px] font-bold tracking-wide ${premium ? "text-amber-500" : "text-emerald-600"}`}>
                {badge}
              </span>
            </div>
            <h1 className={`truncate text-base font-extrabold ${premium ? "text-amber-50" : "theme-text-primary"}`}>{title}</h1>
            {subtitle && (
              <p className={`truncate text-[11px] ${premium ? "text-amber-200/60" : "theme-text-muted"}`}>{subtitle}</p>
            )}
          </div>
        </div>
      </header>
      <div className="relative mx-auto max-w-lg space-y-5 px-4 py-5">{children}</div>
    </div>
  );
}
