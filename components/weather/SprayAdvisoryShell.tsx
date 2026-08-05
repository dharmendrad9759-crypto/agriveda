"use client";

import AppShell from "@/components/shell/AppShell";
import SprayAdvisoryDetail from "@/components/weather/SprayAdvisoryDetail";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function SprayAdvisoryShell() {
  const { t } = useLocale();

  return (
    <AppShell
      className="!bg-transparent"
      title="स्प्रे सलाह"
      subtitle="आज स्प्रे करो या मत करो"
      breadcrumbs={[
        { label: t("navHome"), href: "/" },
        { label: "मौसम", href: "/weather" },
        { label: "स्प्रे सलाह" },
      ]}
    >
      <div className="relative mb-4 overflow-hidden rounded-[22px] border border-sky-500/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/jobs/job-spray.jpg"
          alt=""
          className="h-36 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[17px] font-bold text-white">स्प्रे विंडो</p>
          <p className="text-[12px] text-white/85">मौसम देखो — फिर दवा लगाओ</p>
        </div>
      </div>
      <SprayAdvisoryDetail embedded />
    </AppShell>
  );
}
