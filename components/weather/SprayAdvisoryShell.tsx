"use client";

import AppShell from "@/components/shell/AppShell";
import SprayAdvisoryDetail from "@/components/weather/SprayAdvisoryDetail";

export default function SprayAdvisoryShell() {
  return (
    <AppShell
      className="!bg-transparent"
      title="Spray & Spread Advisory"
      subtitle="Live spray window, tank-mix compatibility & IRAC/FRAC recommendations"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Weather", href: "/weather" },
        { label: "Spray Advisory" },
      ]}
    >
      <SprayAdvisoryDetail embedded />
    </AppShell>
  );
}
