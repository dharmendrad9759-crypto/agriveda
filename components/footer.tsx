import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/appMeta";

export default function Footer() {
  return (
    <footer className="mt-16 hidden w-full border-t border-[var(--panel-border)] bg-[var(--panel-bg)] py-8 backdrop-blur-md md:block">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs theme-text-muted sm:px-6 lg:flex-row lg:px-8">
        <div className="flex items-center gap-2">
          <span className="agriveda-gradient-text font-bold">{BRAND}</span>
          <span>© 2026 सर्वाधिकार सुरक्षित।</span>
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
        <p className="text-[10px] theme-text-muted">किसान की स्मार्ट सलाह</p>
      </div>
    </footer>
  );
}
