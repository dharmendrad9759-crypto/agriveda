"use client";

import AppShell from "@/components/shell/AppShell";
import DesktopDashboard from "@/components/dashboard/DesktopDashboard";

export default function Home() {
  return (
    <AppShell className="!bg-[#f5f8f2]">
      <DesktopDashboard />
    </AppShell>
  );
}
