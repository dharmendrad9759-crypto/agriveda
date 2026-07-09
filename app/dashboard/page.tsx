"use client";

import AppShell from "@/components/shell/AppShell";
import DesktopDashboard from "@/components/dashboard/DesktopDashboard";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="All fields · all crops · at a glance">
      <DesktopDashboard embedded />
    </AppShell>
  );
}
