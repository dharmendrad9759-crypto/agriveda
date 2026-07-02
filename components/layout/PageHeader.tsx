"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
}

export default function PageHeader({ title, subtitle, backHref = "/" }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[#030712]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
        <Link
          href={backHref}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:shadow-[0_0_12px_rgba(0,255,136,0.2)]"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          {title && <h1 className="text-base font-extrabold text-white">{title}</h1>}
          {subtitle && (
            <p className="text-[11px] font-medium text-emerald-400/60">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
