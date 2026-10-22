"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/appMeta";

const HIDE_FOOTER_ROUTES = [
  "/mix-advisor",
  "/my-farm",
  "/spray-rotation",
  "/ai-doctor",
  "/kisan-saathi",
  "/field-advisor",
  "/crop-calendar",
  "/alerts",
  "/crops",
  "/crop-problems",
  "/deficiencies",
  "/settings",
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname && HIDE_FOOTER_ROUTES.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return (
    <footer className="mt-6 w-full border-t border-[var(--panel-border)] bg-[var(--panel-bg)] py-4 backdrop-blur-md sm:mt-12 sm:py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs theme-text-muted sm:gap-4 sm:px-6 lg:flex-row lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="agriveda-gradient-text font-bold">{BRAND}</span>
          <span>© 2026 · 18+</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold">
          <Link href="/privacy" className="hover:text-[var(--av-accent)] hover:underline">
            गोपनीयता
          </Link>
          <Link href="/terms" className="hover:text-[var(--av-accent)] hover:underline">
            नियम
          </Link>
          <a href={SUPPORT_MAILTO} className="hover:text-[var(--av-accent)] hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </nav>
        <p className="text-[10px] theme-text-muted">AI सुझाव — दवा लेबल से मिलाएँ</p>
      </div>
    </footer>
  );
}
