"use client";

import { useState, useRef, useEffect } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { Camera, Check, ImagePlus, X } from "lucide-react";
import CropSelector from "@/components/query/CropSelector";
import VoiceInput from "@/components/query/VoiceInput";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useToast } from "@/components/ui/Toast";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cropCatalog } from "@/data/crop-catalog";
import { AV } from "@/lib/design/tokens";

const MAX_CHARS = 256;

export default function AskQueryPage() {
  const { crops, hydrated } = useMyCrops();
  const { addQuery } = useQueryHistory();
  const { profile } = useFarmerProfile();
  const { showToast } = useToast();
  const { t } = useLocale();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (availableCrops.length > 0 && !availableCrops.find((c) => c.id === selectedCrop)) {
      setSelectedCrop(availableCrops[0].id);
    }
  }, [availableCrops, selectedCrop]);

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

    const cropName = availableCrops.find((c) => c.id === selectedCrop)?.name ?? selectedCrop;
    addQuery({
      crop: selectedCrop,
      cropName,
      query: query.trim(),
      image: photoPreview ?? undefined,
      farmerName: profile.name || "You",
    });
    setSubmitted(true);
    showToast("Saved on this phone — open AI Doctor for an answer");
  };

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
            Community expert inbox abhi live nahi hai. AI Doctor se {availableCrops.find((c) => c.id === selectedCrop)?.name ?? "crop"} ke baare mein turant jawab milega.
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
      subtitle={t("askExpertSubtitle")}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Ask Expert" }]}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
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

        <DarkCard delay={1}>
          <h3 className={AV.sectionTitle}>{t("writeQuery")}</h3>
          <div className="relative mt-3">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, MAX_CHARS))}
              placeholder={t("queryPlaceholder")}
              rows={5}
              className="av-input w-full resize-none"
            />
            <span className="absolute bottom-3 right-3 text-[11px] text-[var(--av-text-muted)] tabular-nums">
              {query.length}/{MAX_CHARS}
            </span>
          </div>
          <div className="mt-3">
            <VoiceInput
              compact
              onTranscript={(text) =>
                setQuery((q) => `${q}${q ? " " : ""}${text}`.slice(0, MAX_CHARS))
              }
            />
          </div>
        </DarkCard>

        <DarkCard delay={2}>
          <h3 className={AV.sectionTitle}>{t("addPhotoOptional")}</h3>
          <p className={`mt-1 ${AV.micro}`}>{t("photoPermission")}</p>

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
          {t("submitQuery")}
        </button>
      </form>
    </AppShell>
  );
}
