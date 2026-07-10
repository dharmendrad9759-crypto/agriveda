"use client";

import AppShell from "@/components/shell/AppShell";
import DesktopDashboard from "@/components/dashboard/DesktopDashboard";

export default function Home() {
  return (
    <AppShell className="!bg-transparent">
      <DesktopDashboard />
    </AppShell>
  );
}
