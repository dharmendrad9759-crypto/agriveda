"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import PageBackground from "@/components/ui/PageBackground";

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
  badge = "AGRIVEDA 2.0",
  children,
}: Agriveda2ShellProps) {
  return (
    <div className="agriveda-page relative min-h-screen pb-28">
      <PageBackground />
      <header className="sticky top-0 z-40 border-b border-emerald-500/15 bg-[var(--background)]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3.5">
          <Link
            href={backHref}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/5 text-emerald-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                {badge}
              </span>
            </div>
            <h1 className="truncate text-base font-extrabold theme-text-primary">{title}</h1>
            {subtitle && (
              <p className="truncate text-[11px] theme-text-muted">{subtitle}</p>
            )}
          </div>
        </div>
      </header>
      <div className="relative mx-auto max-w-lg space-y-5 px-4 py-5">{children}</div>
    </div>
  );
}
