"use client";

import AppShell from "@/components/shell/AppShell";

export default function CropsPageShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      title="Crops"
      subtitle="Explore crop guides, schedules, pests, diseases & more"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Crops" }]}
    >
      {children}
    </AppShell>
  );
}
