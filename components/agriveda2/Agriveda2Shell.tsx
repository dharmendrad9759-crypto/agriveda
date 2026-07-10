import AppShell from "@/components/shell/AppShell";
import { BRAND } from "@/lib/brand";
import type { ReactNode } from "react";

interface Agriveda2ShellProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  badge?: string;
  children: ReactNode;
  premium?: boolean;
}

/** @deprecated Use AppShell variant="hub" directly */
export default function Agriveda2Shell({
  title,
  subtitle,
  backHref = "/",
  badge = BRAND,
  children,
  premium = false,
}: Agriveda2ShellProps) {
  return (
    <AppShell
      variant="hub"
      title={title}
      subtitle={subtitle}
      backHref={backHref}
      badge={badge}
      hubPremium={premium}
    >
      {children}
    </AppShell>
  );
}
