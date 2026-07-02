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
    <header className="sticky top-0 z-40">
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 shadow-lg shadow-emerald-900/20">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
          <Link
            href={backHref}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            {title && <h1 className="text-lg font-extrabold tracking-tight text-white">{title}</h1>}
            {subtitle && <p className="text-[11px] font-medium text-emerald-100/80">{subtitle}</p>}
          </div>
        </div>
      </div>
    </header>
  );
}
