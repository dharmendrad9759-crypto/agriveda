"use client";

import { useState } from "react";
import { ChevronDown, Shield } from "lucide-react";
import {
  SCHEMES_FARMER_CAUTION_EN,
  SCHEMES_FARMER_CAUTION_HI,
  SCHEMES_FOOTER_DISCLAIMER_EN,
  SCHEMES_FOOTER_DISCLAIMER_HI,
} from "@/data/schemes/schemeLegal";

export default function SchemeTrustAndSafety({ hi }: { hi: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <Shield className="h-3.5 w-3.5 shrink-0 text-amber-600" />
        <span className="flex-1 text-[11px] font-bold text-[var(--av-text-muted)]">
          {hi ? "सावधानी · OTP मत दो" : "Caution · Never share OTP"}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[var(--av-text-muted)] transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div className="space-y-2 border-t border-[var(--av-border)] px-3 py-2.5 text-[11px] leading-relaxed text-[var(--av-text-muted)]">
          <p className="font-bold text-amber-800 dark:text-amber-200">
            {hi ? "OTP / PIN किसी को मत दो।" : "Never share OTP / PIN."}
          </p>
          <p>{hi ? SCHEMES_FARMER_CAUTION_HI : SCHEMES_FARMER_CAUTION_EN}</p>
          <p>{hi ? SCHEMES_FOOTER_DISCLAIMER_HI : SCHEMES_FOOTER_DISCLAIMER_EN}</p>
        </div>
      ) : null}
    </div>
  );
}
