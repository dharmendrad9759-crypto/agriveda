"use client";

import AppLink from "@/components/ui/AppLink";
import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Camera, ChevronRight, ListChecks, Mic, Sparkles, Loader2 } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import SafeThumbnail from "@/components/ui/SafeThumbnail";
import SolutionCard, { solutionFromIssue } from "@/components/agriveda2/SolutionCard";
import { SYMPTOM_CATEGORIES, getIssuesForCrop } from "@/data/symptom-solver";
import { useMyCrops } from "@/hooks/useMyCrops";
import { fileToDataUrl, savePendingAiScan } from "@/lib/pendingAiScan";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useToast } from "@/components/ui/Toast";
import { BRAND } from "@/lib/brand";

export default function CropProblemHub() {
  const navigate = useAppNavigate();
  const { showToast } = useToast();
  const { crops } = useMyCrops();
  const cropSlug = crops[0]?.slug ?? "tomato";
  const cameraRef = useRef<HTMLInputElement>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const sampleIssue = getIssuesForCrop("white-spots", cropSlug)[0] ?? SYMPTOM_CATEGORIES[2].issues[0];

  const onCamera = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhotoPreview(dataUrl);
      setPhotoDataUrl(dataUrl);
      setPhotoFileName(file.name);
      showToast("Photo select ho gayi — neeche scan karein");
    } catch {
      showToast("Photo error", "error");
    }
    e.target.value = "";
  };

  const analyzePhoto = async () => {
    if (!photoDataUrl || sending) return;
    setSending(true);
    try {
      savePendingAiScan({
        dataUrl: photoDataUrl,
        fileName: photoFileName || "crop-photo.jpg",
        cropSlug,
        autoScan: true,
      });
      navigate("/ai-doctor");
    } catch {
      showToast("Scan shuru nahi ho paya", "error");
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm theme-text-muted">
        फसल → समस्या → समाधान — {BRAND} का सबसे तेज़ flow
      </p>

      <div className="grid gap-3">
        <PathCard
          href="/ai-doctor"
          icon={<Camera className="h-6 w-6" />}
          title="Photo AI"
          desc="Photo chunein — yahin preview, phir scan"
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

      {photoPreview && (
        <DarkCard className="space-y-3 p-4">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-300">
            📷 Photo select ho gayi — preview
          </p>
          <SafeThumbnail
            src={photoPreview}
            alt="Selected crop"
            className="mx-auto max-h-48 w-full rounded-xl object-contain"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={analyzePhoto}
              disabled={sending}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              AI Doctor se scan karein
            </button>
            <button
              type="button"
              onClick={() => {
                setPhotoPreview(null);
                setPhotoDataUrl(null);
                setPhotoFileName("");
              }}
              className="rounded-xl border px-4 py-3 text-xs font-bold theme-text-muted"
            >
              Badlein
            </button>
          </div>
        </DarkCard>
      )}

      <DarkCard className="p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase text-emerald-600">
          <Sparkles className="h-4 w-4" />
          Sample Solution Card
        </p>
      </DarkCard>

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
    <AppLink href={href} className={className}>
      <div className="text-emerald-700">{icon}</div>
      <div className="flex-1">
        <p className="font-extrabold theme-text-primary">{title}</p>
        <p className="text-xs theme-text-muted">{desc}</p>
      </div>
      <ChevronRight className="h-5 w-5 theme-text-muted" />
    </AppLink>
  );
}
