"use client";

import { useState } from "react";
import { ChevronDown, Shield, AlertTriangle } from "lucide-react";
import {
  SCHEMES_FARMER_CAUTION_EN,
  SCHEMES_FARMER_CAUTION_HI,
  SCHEMES_FOOTER_DISCLAIMER_EN,
  SCHEMES_FOOTER_DISCLAIMER_HI,
} from "@/data/schemes/schemeLegal";

export default function SchemeTrustAndSafety({ hi }: { hi: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]/50 transition">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3.5 py-2.5 text-left active:opacity-80"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 shrink-0 text-emerald-700/80 dark:text-emerald-400" />
          <span className="text-[11px] font-bold text-[var(--av-text-muted)] hover:text-[var(--av-text-secondary)]">
            {hi ? "कानूनी अस्वीकरण एवं सुरक्षा दिशानिर्देश" : "Legal Disclaimer & Safety Guidelines"}
          </span>
        </span>
        <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--av-text-muted)]">
          <span>{open ? (hi ? "छिपाएँ" : "Hide") : (hi ? "पढ़ें" : "View")}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open && (
        <div className="space-y-2 border-t border-[var(--av-border)] px-3.5 py-3 text-[11px] leading-relaxed text-[var(--av-text-muted)]">
          <p className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>{hi ? "सुरक्षा चेतावनी: OTP, ATM PIN या पासवर्ड कभी किसी को न दें।" : "Never share OTP, ATM PIN, or passwords."}</span>
          </p>
          <p>{hi ? SCHEMES_FARMER_CAUTION_HI : SCHEMES_FARMER_CAUTION_EN}</p>
          <p>{hi ? SCHEMES_FOOTER_DISCLAIMER_HI : SCHEMES_FOOTER_DISCLAIMER_EN}</p>
        </div>
      )}
    </div>
  );
}

