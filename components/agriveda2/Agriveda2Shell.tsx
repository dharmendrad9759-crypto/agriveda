import AppShell from "@/components/shell/AppShell";
import { BRAND } from "@/lib/brand";
import type { ReactNode } from "react";

interface Agriveda2ShellProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  onBack?: () => void;
  badge?: string;
  children: ReactNode;
  premium?: boolean;
  hubTheme?: "default" | "amber" | "green";
}

/** @deprecated Use AppShell variant="hub" directly */
export default function Agriveda2Shell({
  title,
  subtitle,
  backHref = "/",
  onBack,
  badge = BRAND,
  children,
  premium = false,
  hubTheme = "default",
}: Agriveda2ShellProps) {
  return (
    <AppShell
      variant="hub"
      title={title}
      subtitle={subtitle}
      backHref={backHref}
      onBack={onBack}
      badge={badge}
      hubPremium={premium}
      hubTheme={hubTheme}
    >
      {children}
    </AppShell>
  );
}
