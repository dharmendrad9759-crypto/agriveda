"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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

const STAGES = [
  { id: "germination", label: "चरण 1: अंकुरण" },
  { id: "cri", label: "चरण 2: CRI" },
  { id: "tillering", label: "चरण 3: कल्ले" },
  { id: "stem_elongation", label: "चरण 4: गांठ" },
  { id: "booting", label: "चरण 5: गोभ" },
  { id: "heading", label: "चरण 6: बाली" },
  { id: "flowering", label: "चरण 7: फूल" },
  { id: "milking", label: "चरण 8: दूध" },
  { id: "dough", label: "चरण 9: सख्त" },
  { id: "ripening", label: "चरण 10: पकाव" },
];

interface Props {
  cropName: string;
  cropSlug: string;
}

export default function Wheat3DClient({ cropName, cropSlug }: Props) {
  const router = useRouter();
  const [activeStage, setActiveStage] = useState("germination");

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#04120d]">
      {/* Top Floating Stage Switcher */}
      <div className="absolute top-12 left-3 right-3 z-40 flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-1.5 backdrop-blur-md sm:top-4 sm:left-4 sm:right-auto">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
          title="वापस जाएं"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        {STAGES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveStage(s.id)}
            className={`shrink-0 rounded-xl px-2.5 py-1 text-[11px] font-bold transition ${
              activeStage === s.id
                ? "bg-emerald-500 text-black shadow-md font-black"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <WheatGermination3DViewer
        key={activeStage}
        stageId={activeStage}
        className="h-full w-full"
        variant="fullscreen"
        onClose={() => router.back()}
        initialDay={3.5}
      />
    </div>
  );
}
