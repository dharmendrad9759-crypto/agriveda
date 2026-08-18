"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { SCHEMES_LEAVE_CONFIRM_EN, SCHEMES_LEAVE_CONFIRM_HI } from "@/data/schemes/schemeLegal";
import { AV, Z_INDEX } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

export function useOfficialLeave() {
  const [pending, setPending] = useState<{ url: string; title?: string } | null>(null);

  return {
    pending,
    requestLeave: (url: string, title?: string) => setPending({ url, title }),
    closeLeave: () => setPending(null),
    continueLeave: () => {
      if (!pending?.url) return;
      window.open(pending.url, "_blank", "noopener,noreferrer");
      setPending(null);
    },
  };
}

export default function OfficialLeaveConfirm({
  open,
  hi,
  url,
  title,
  onClose,
  onContinue,
}: {
  open: boolean;
  hi: boolean;
  url: string;
  title?: string;
  onClose: () => void;
  onContinue: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      style={{ zIndex: Z_INDEX.modal }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-agriveda-title"
    >
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-lg">
        <p id="leave-agriveda-title" className="text-[15px] font-bold text-[var(--av-text-primary)]">
          {hi ? "बाहरी आधिकारिक स्रोत" : "External official website"}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--av-text-secondary)]">
          {hi ? SCHEMES_LEAVE_CONFIRM_HI : SCHEMES_LEAVE_CONFIRM_EN}
        </p>
        {title ? (
          <p className="mt-2 text-[12px] font-semibold text-[var(--av-text-muted)]">{title}</p>
        ) : null}
        <p className="mt-1 break-all text-[11px] text-[var(--av-text-muted)]">{url}</p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose} className={cn("flex-1", AV.btnSecondary)}>
            {hi ? "रुकें" : "Stay"}
          </button>
          <button type="button" onClick={onContinue} className={cn("flex-1", AV.btnPrimary)}>
            <ExternalLink className="h-4 w-4" />
            {hi ? "जारी रखें" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
