"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PestDiseasesContent from "@/components/pest-diseases/PestDiseasesContent";

function Loading() {
  return (
    <div className="agriveda-page flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  );
}

export default function PestDiseasesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PestDiseasesContent />
    </Suspense>
  );
}
