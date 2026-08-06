"use client";

import type { CropManagementWithDossier } from "@/types/crop-dossier";
import { AlertTriangle } from "lucide-react";

export function DossierSourceBanner({
  profile,
  hi,
}: {
  profile: CropManagementWithDossier | null | undefined;
  hi: boolean;
}) {
  if (!profile?.dossierSource) return null;
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-[11px] leading-relaxed text-amber-950 dark:text-amber-100">
      <p className="flex items-start gap-1.5 font-bold">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {hi ? "रिसर्च डोसियर डेटा" : "Research dossier data"}
      </p>
      <p className="mt-1 opacity-90">{profile.dossierLegalNote}</p>
      {profile.dossierTankMixIncompatible?.length ? (
        <p className="mt-1.5 font-semibold">
          {hi ? "न मिलाएँ: " : "Do not mix: "}
          {profile.dossierTankMixIncompatible.slice(0, 2).join(" · ")}
        </p>
      ) : null}
    </div>
  );
}
