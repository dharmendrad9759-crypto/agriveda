"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

/** Page shell — global AppPremiumBackground is in ClientProviders */
export default function CropSectionPremiumShell({ children, className = "" }: Props) {
  return (
    <div className={`crop-premium-page relative min-h-screen pb-28 ${className}`}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
