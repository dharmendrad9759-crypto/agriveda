"use client";

import { useState, useRef, useEffect } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { Camera, Check, ImagePlus, Stethoscope, X } from "lucide-react";
import CropSelector from "@/components/query/CropSelector";
import VoiceInput from "@/components/query/VoiceInput";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useToast } from "@/components/ui/Toast";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cropCatalog } from "@/data/crop-catalog";
import { getCropEmoji, getCropHindiName } from "@/lib/crops/crop-display";
import {
  buildExpertQueryText,
  clearAiDoctorExpertReferral,
  readAiDoctorExpertReferral,
  type AiDoctorExpertReferral,
} from "@/lib/aiDoctorExpertReferral";
import { AV } from "@/lib/design/tokens";

const MAX_CHARS = 256;
const MAX_CHARS_REFERRAL = 1200;

export default function AskQueryPage() {
  const { crops, hydrated } = useMyCrops();
  const { addQuery } = useQueryHistory();
  const { profile } = useFarmerProfile();
  const { showToast } = useToast();
  const { t } = useLocale();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const referralAppliedRef = useRef(false);

  const availableCrops = hydrated
    ? crops.map((c) => ({ id: c.slug, name: c.name, emoji: c.emoji }))
    : cropCatalog.slice(0, 4).map((c) => ({
        id: c.slug,
        name: c.name,
        emoji: c.emoji,
      }));

  const [selectedCrop, setSelectedCrop] = useState(availableCrops[0]?.id ?? "paddy");
  const [query, setQuery] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [fromAiDoctor, setFromAiDoctor] = useState(false);
  const [referralCropName, setReferralCropName] = useState<string | null>(null);
  const [referralSummary, setReferralSummary] = useState<AiDoctorExpertReferral | null>(null);

  const maxChars = fromAiDoctor ? MAX_CHARS_REFERRAL : MAX_CHARS;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromDoctor = new URLSearchParams(window.location.search).get("from") === "ai-doctor";
    if (!fromDoctor) return;

    const referral = readAiDoctorExpertReferral();
    if (!referral) return;

    setFromAiDoctor(true);
    setReferralSummary(referral);
    setSelectedCrop(referral.cropSlug);
    setReferralCropName(referral.cropName);
    setQuery(buildExpertQueryText(referral));
    if (referral.photoDataUrl) {
      setPhotoPreview(referral.photoDataUrl);
      setPhotoName("ai-doctor-scan.jpg");
    }
    if (!referralAppliedRef.current) {
      referralAppliedRef.current = true;
      showToast("AI डॉक्टर निदान भर दिया गया ✓");
    }
  }, [showToast]);

  useEffect(() => {
    if (fromAiDoctor) return;
    if (availableCrops.length > 0 && !availableCrops.find((c) => c.id === selectedCrop)) {
      setSelectedCrop(availableCrops[0].id);
    }
  }, [availableCrops, selectedCrop, fromAiDoctor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose a photo file", "error");
      return;
    }
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    showToast("Photo attached ✓");
  };

  const openGallery = () => {
    showToast("Allow Photos / Files when your phone asks — then pick from gallery", "info");
    galleryInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const cropName =
      referralCropName ??
      availableCrops.find((c) => c.id === selectedCrop)?.name ??
      getCropHindiName(selectedCrop, selectedCrop) ??
      selectedCrop;
    addQuery({
      crop: selectedCrop,
      cropName,
      query: query.trim(),
      image: photoPreview ?? undefined,
      farmerName: profile.name || "You",
    });
    clearAiDoctorExpertReferral();
    setSubmitted(true);
    showToast("Saved on this phone — open AI Doctor for an answer");
  };

  const lockedCropLabel =
    referralCropName ??
    getCropHindiName(selectedCrop) ??
    availableCrops.find((c) => c.id === selectedCrop)?.name ??
    selectedCrop;

  if (submitted) {
    return (
      <AppShell
        title="Query saved"
        subtitle="Phone pe history me save. Expert community live nahi — AI Doctor se jawab lein."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Ask", href: "/ask-query" }]}
      >
        <DarkCard className="flex flex-col items-center py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--av-accent)]/40 bg-[var(--av-accent)]/15">
            <Check className="h-8 w-8 text-[var(--av-accent)]" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[var(--av-text-primary)]">Saved locally</h2>
          <p className="mt-2 max-w-sm text-sm text-[var(--av-text-muted)]">
            Community expert inbox abhi live nahi hai. AI Doctor se {lockedCropLabel} ke baare mein turant jawab
            milega.
          </p>
          <AppLink href="/ai-doctor" className={`mt-6 ${AV.btnPrimary}`}>
            Open AI Doctor
          </AppLink>
          <AppLink href="/ask-query" className={`mt-3 ${AV.btnSecondarySm}`}>
            Ask another
          </AppLink>
        </DarkCard>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={t("askExpertTitle")}
      subtitle={fromAiDoctor ? "AI डॉक्टर निदान भेजा गया — विशेषज्ञ से पुष्टि करें" : t("askExpertSubtitle")}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Ask Expert" }]}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
        {fromAiDoctor && referralSummary && (
          <DarkCard className="border border-emerald-600/25 bg-emerald-500/5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700/15 text-emerald-800">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/80">
                  AI फसल डॉक्टर से भेजा
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--av-text-primary)]">
                  {referralSummary.result.diseaseName}
                </p>
                <p className="mt-0.5 text-xs text-[var(--av-text-muted)]">
                  विश्वास {referralSummary.result.confidence}% · जोखिम {referralSummary.result.riskLevel} ·{" "}
                  {referralSummary.result.severity}
                </p>
                {referralSummary.result.visualObservations && (
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--av-text-muted)]">
                    {referralSummary.result.visualObservations
                      .replace(/\s*\([^)]*\)/g, "")
                      .replace(/\s{2,}/g, " ")
                      .trim()}
                  </p>
                )}
              </div>
            </div>
          </DarkCard>
        )}

        {fromAiDoctor ? (
          <DarkCard>
            <h3 className={AV.sectionTitle}>फसल</h3>
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-2)] px-3 py-3">
              <span className="text-2xl" aria-hidden>
                {getCropEmoji(selectedCrop)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[var(--av-text-primary)]">{lockedCropLabel}</p>
                <p className="text-[11px] text-[var(--av-text-muted)]">
                  AI डॉक्टर स्कैन से स्वतः चुनी — बदल नहीं सकते
                </p>
              </div>
            </div>
          </DarkCard>
        ) : (
          <DarkCard>
            <h3 className={AV.sectionTitle}>{t("selectCrop")}</h3>
            <div className="mt-3">
              {availableCrops.length > 0 ? (
                <CropSelector
                  crops={availableCrops}
                  selectedId={selectedCrop}
                  onSelect={setSelectedCrop}
                />
              ) : (
                <p className="text-center text-sm text-[var(--av-text-muted)]">{t("addCropsFirst")}</p>
              )}
            </div>
          </DarkCard>
        )}

        <DarkCard delay={1}>
          <h3 className={AV.sectionTitle}>{fromAiDoctor ? "संदेश / प्रश्न" : t("writeQuery")}</h3>
          <div className="relative mt-3">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, maxChars))}
              placeholder={t("queryPlaceholder")}
              rows={fromAiDoctor ? 10 : 5}
              className="av-input w-full resize-none"
            />
            <span className="absolute bottom-3 right-3 text-[11px] text-[var(--av-text-muted)] tabular-nums">
              {query.length}/{maxChars}
            </span>
          </div>
          <div className="mt-3">
            <VoiceInput
              compact
              onTranscript={(text) =>
                setQuery((q) => `${q}${q ? " " : ""}${text}`.slice(0, maxChars))
              }
            />
          </div>
        </DarkCard>

        <DarkCard delay={2}>
          <h3 className={AV.sectionTitle}>
            {fromAiDoctor ? "स्कैन फोटो" : t("addPhotoOptional")}
          </h3>
          <p className={`mt-1 ${AV.micro}`}>
            {fromAiDoctor
              ? "AI डॉक्टर वाली फोटो पहले से जुड़ी है — चाहें तो बदल सकते हैं"
              : t("photoPermission")}
          </p>

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          {photoPreview && (
            <div className="relative mb-3 mt-3 overflow-hidden rounded-xl border border-[var(--av-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Upload" className="h-40 w-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setPhotoPreview(null);
                  setPhotoName(null);
                }}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
              {photoName && (
                <p className="px-3 py-2 text-xs font-medium text-[var(--av-accent)]">{photoName}</p>
              )}
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={openGallery} className={`inline-flex justify-center gap-2 ${AV.btnSecondarySm}`}>
              <ImagePlus className="h-4 w-4" />
              {photoPreview ? t("changePhoto") : t("fromGallery")}
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className={`inline-flex justify-center gap-2 ${AV.btnSecondarySm}`}
            >
              <Camera className="h-4 w-4" />
              {t("takePhoto")}
            </button>
          </div>
        </DarkCard>

        <button type="submit" disabled={!query.trim()} className={`w-full ${AV.btnPrimary} disabled:opacity-40`}>
          {fromAiDoctor ? "विशेषज्ञ को भेजें" : t("submitQuery")}
        </button>
      </form>
    </AppShell>
  );
}
