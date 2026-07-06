"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import SowingWindowClient from "@/components/agriveda2/SowingWindowClient";

function SowingInner() {
  const params = useSearchParams();
  const crop = params.get("crop") ?? undefined;
  return <SowingWindowClient initialCrop={crop} />;
}

export default function SowingWindowPage() {
  return (
    <Agriveda2Shell
      title="बुआई का सही समय"
      subtitle="मौसम नहीं, Science बताएगा कब बोएं"
      backHref="/dashboard"
    >
      <Suspense fallback={null}>
        <SowingInner />
      </Suspense>
    </Agriveda2Shell>
  );
}
