"use client";

import Link from "next/link";
import { useRef, type ChangeEvent, type ReactNode } from "react";
import { Camera, ChevronRight, ListChecks, Mic, Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SolutionCard, { solutionFromIssue } from "@/components/agriveda2/SolutionCard";
import { SYMPTOM_CATEGORIES, getIssuesForCrop } from "@/data/symptom-solver";
import { useMyCrops } from "@/hooks/useMyCrops";
import { fileToDataUrl, savePendingAiScan } from "@/lib/pendingAiScan";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

export default function CropProblemHub() {
  const router = useRouter();
  const { showToast } = useToast();
  const { crops } = useMyCrops();
  const cropSlug = crops[0]?.slug ?? "tomato";
  const cameraRef = useRef<HTMLInputElement>(null);

  const sampleIssue = getIssuesForCrop("white-spots", cropSlug)[0] ?? SYMPTOM_CATEGORIES[2].issues[0];

  const onCamera = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      savePendingAiScan({
        dataUrl,
        fileName: file.name,
        cropSlug,
        autoScan: true,
      });
      router.push("/ai-doctor");
    } catch {
      showToast("Photo error", "error");
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm theme-text-muted">
        फसल → समस्या → समाधान → Doctor — AGRIVEDA का सबसे powerful flow
      </p>

      <div className="grid gap-3">
        <PathCard
          href="/ai-doctor"
          icon={<Camera className="h-6 w-6" />}
          title="Photo AI"
          desc="8 सेकंड में diagnosis — 94% confidence target"
          accent="from-violet-500/20 to-purple-500/10 border-violet-400/40"
          onClick={() => cameraRef.current?.click()}
        />
        <PathCard
          href="/pest-solver"
          icon={<ListChecks className="h-6 w-6" />}
          title="Symptom checklist"
          desc="लक्षण चुनें — Nitrogen, Stem Borer, Blight…"
          accent="from-fuchsia-500/20 to-pink-500/10 border-fuchsia-400/40"
        />
        <PathCard
          href="/kisan-saathi"
          icon={<Mic className="h-6 w-6" />}
          title="Voice / Chat"
          desc="बोलकर बताएँ — Kisan Saathi समझेगा"
          accent="from-emerald-500/20 to-teal-500/10 border-emerald-400/40"
        />
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={onCamera}
      />

      <GlassCard className="p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase text-emerald-600">
          <Sparkles className="h-4 w-4" />
          Sample Solution Card
        </p>
      </GlassCard>

      <SolutionCard data={solutionFromIssue(sampleIssue)} />
    </div>
  );
}

function PathCard({
  href,
  icon,
  title,
  desc,
  accent,
  onClick,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  desc: string;
  accent: string;
  onClick?: () => void;
}) {
  const className = `flex items-center gap-4 rounded-2xl border-2 bg-gradient-to-br p-4 ${accent}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${className} w-full text-left`}>
        <div className="text-emerald-700">{icon}</div>
        <div className="flex-1">
          <p className="font-extrabold theme-text-primary">{title}</p>
          <p className="text-xs theme-text-muted">{desc}</p>
        </div>
        <ChevronRight className="h-5 w-5 theme-text-muted" />
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      <div className="text-emerald-700">{icon}</div>
      <div className="flex-1">
        <p className="font-extrabold theme-text-primary">{title}</p>
        <p className="text-xs theme-text-muted">{desc}</p>
      </div>
      <ChevronRight className="h-5 w-5 theme-text-muted" />
    </Link>
  );
}
