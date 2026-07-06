"use client";

import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import FarmDashboard from "@/components/agriveda2/FarmDashboard";

export default function DashboardPage() {
  return (
    <Agriveda2Shell
      title="मेरा खेत Dashboard"
      subtitle="सभी खेत · सभी फसलें · एक नज़र में"
      backHref="/"
    >
      <FarmDashboard />
    </Agriveda2Shell>
  );
}
