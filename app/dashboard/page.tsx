"use client";

import AppShell from "@/components/shell/AppShell";
import DesktopDashboard from "@/components/dashboard/DesktopDashboard";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <DesktopDashboard embedded />
    </AppShell>
  );
}
