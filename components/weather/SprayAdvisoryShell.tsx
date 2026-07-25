"use client";

import AppShell from "@/components/shell/AppShell";
import SprayAdvisoryDetail from "@/components/weather/SprayAdvisoryDetail";

export default function SprayAdvisoryShell() {
  return (
    <AppShell
      className="!bg-transparent"
      title="स्प्रे सलाह"
      subtitle="स्प्रे विंडो, टैंक-मिक्स जाँच और अनुशंसित खुराक"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "मौसम", href: "/weather" },
        { label: "स्प्रे सलाह" },
      ]}
    >
      <SprayAdvisoryDetail embedded />
    </AppShell>
  );
}
