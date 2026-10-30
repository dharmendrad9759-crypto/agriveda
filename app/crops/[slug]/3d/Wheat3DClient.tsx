"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

const WheatGermination3DViewer = dynamic(
  () => import("@/components/farm/WheatGermination3DViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-[#04120d] text-emerald-300">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        <p className="text-sm font-semibold">3D बॉटनिकल मॉडल लोड हो रहा है…</p>
        <p className="text-xs text-emerald-200/50">Triticum aestivum (Wheat) 3D Anatomy</p>
      </div>
    ),
  }
);

interface Props {
  cropName: string;
  cropSlug: string;
}

export default function Wheat3DClient({ cropName, cropSlug }: Props) {
  const router = useRouter();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#04120d]">
      <WheatGermination3DViewer
        className="h-full w-full"
        onClose={() => router.back()}
        initialDay={3.5}
      />
    </div>
  );
}
