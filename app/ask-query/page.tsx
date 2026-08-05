"use client";

import { useState, useRef, useEffect } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import {
  Camera,
  Check,
  Clock3,
  ImagePlus,
  Loader2,
  MessageCircle,
  Stethoscope,
  X,
} from "lucide-react";
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
import { getDeviceId } from "@/lib/deviceId";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

const MAX_CHARS = 256;
const MAX_CHARS_REFERRAL = 1200;

/** Shrink large camera photos before upload to expert inbox. */
async function compressDataUrlForUpload(dataUrl: string, maxSide = 960): Promise<string | null> {
  if (!dataUrl.startsWith("data:image/")) return null;
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("img"));
      el.src = dataUrl;
    });
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl.length <= 220_000 ? dataUrl : null;
    ctx.drawImage(img, 0, 0, w, h);
    let quality = 0.7;
    let out = canvas.toDataURL("image/jpeg", quality);
    while (out.length > 220_000 && quality > 0.4) {
      quality -= 0.1;
      out = canvas.toDataURL("image/jpeg", quality);
    }
    return out.length <= 280_000 ? out : null;
  } catch {
    return dataUrl.length <= 180_000 ? dataUrl : null;
  }
}

export default function AskQueryPage() {
  const { crops, hydrated } = useMyCrops();
  const { addQuery } = useQueryHistory();
  const { profile } = useFarmerProfile();
  const { showToast } = useToast();
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [ticketError, setTicketError] = useState<string | null>(null);
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
    const cropLabel =
      referral.cropSlug === "other" && referral.result.cropContext
        ? referral.result.cropContext
        : referral.cropName;
    setReferralCropName(cropLabel);
    setQuery(buildExpertQueryText({ ...referral, cropName: cropLabel }));
    if (referral.photoDataUrl) {
      setPhotoPreview(referral.photoDataUrl);
      setPhotoName("ai-doctor-scan.jpg");
    }
    if (!referralAppliedRef.current) {
      referralAppliedRef.current = true;
      showToast(isHi ? "AI डॉक्टर निदान भर दिया गया ✓" : "AI Doctor diagnosis filled ✓");
    }
  }, [showToast, isHi]);

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
      showToast(isHi ? "कृपया फोटो फ़ाइल चुनें" : "Please choose a photo file", "error");
      return;
    }
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    showToast(isHi ? "फोटो जुड़ गई ✓" : "Photo attached ✓");
  };

  const openGallery = () => {
    showToast(
      isHi
        ? "फ़ोन पूछे तो Photos / Files की अनुमति दें"
        : "Allow Photos / Files when your phone asks",
      "info"
    );
    galleryInputRef.current?.click();
  };

  const lockedCropLabel =
    referralCropName ??
    getCropHindiName(selectedCrop) ??
    availableCrops.find((c) => c.id === selectedCrop)?.name ??
    selectedCrop;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || submitting) return;

    const cropName = lockedCropLabel;
    // Expert-only path: AI Doctor answers only on /ai-doctor. Ask Query / referral → human expert.
    const queryTextForExpert = fromAiDoctor
      ? `${query.trim()}\n\n(किसान ने AI डॉक्टर निदान एक्सपर्ट से जाँचने को कहा है।)`
      : query.trim();

    setSubmitting(true);
    setTicketError(null);

    let createdTicketId: string | null = null;
    try {
      const deviceId = getDeviceId();
      const photoDataUrl = photoPreview
        ? await compressDataUrlForUpload(photoPreview)
        : null;

      const postTicket = async (photo: string | null) =>
        fetch("/api/expert-queries", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceId,
            farmerName: profile.name || undefined,
            farmerPhone: profile.phone || undefined,
            farmerVillage: profile.village || undefined,
            farmerDistrict: profile.district || undefined,
            farmerState: profile.state || undefined,
            cropSlug: selectedCrop,
            cropName,
            queryText: queryTextForExpert,
            photoDataUrl: photo,
            source: fromAiDoctor ? "ai-doctor" : "ask-query",
            aiDiagnosis: referralSummary
              ? {
                  diseaseName: referralSummary.result.diseaseName,
                  pathogen: referralSummary.result.pathogen,
                  confidence: referralSummary.result.confidence,
                  severity: referralSummary.result.severity,
                  riskLevel: referralSummary.result.riskLevel,
                  stage: referralSummary.result.stage,
                  treatments: referralSummary.result.treatments,
                  visualObservations: referralSummary.result.visualObservations,
                  cropContext: referralSummary.result.cropContext,
                }
              : null,
          }),
        });

      let ticketRes = await postTicket(photoDataUrl);
      if (!ticketRes.ok && photoDataUrl) {
        ticketRes = await postTicket(null);
      }
      const ticketData = (await ticketRes.json()) as {
        query?: { id?: string };
        error?: string;
      };
      if (ticketRes.ok && ticketData.query?.id) {
        createdTicketId = ticketData.query.id;
      } else {
        const detail =
          ticketData.error ||
          (isHi ? "एडमिन पैनल तक नहीं पहुँचा" : "Could not reach admin panel");
        setTicketError(detail);
        showToast(detail.slice(0, 120), "error");
      }
    } catch (err) {
      const detail =
        err instanceof Error
          ? err.message
          : isHi
            ? "नेटवर्क त्रुटि — फिर कोशिश करें"
            : "Network error — try again";
      setTicketError(detail);
      showToast(detail.slice(0, 120), "error");
    }

    const today = new Date().toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
    });

    if (createdTicketId) {
      addQuery({
        crop: selectedCrop,
        cropName,
        query: query.trim(),
        image: photoPreview ?? undefined,
        farmerName: profile.name || (isHi ? "आप" : "You"),
        expertResponse: {
          expertName: isHi ? "एक्सपर्ट (प्रतीक्षा)" : "Expert (pending)",
          date: today,
          preview: isHi
            ? "एक्सपर्ट जवाब की प्रतीक्षा — ऐप + WhatsApp/SMS।"
            : "Waiting for expert — app + WhatsApp/SMS.",
          fullAnswer: isHi
            ? "आपका सवाल एक्सपर्ट को भेज दिया गया है। जवाब “मेरे सवाल” में दिखेगा और नंबर पर WhatsApp/SMS भी जाएगा (कॉन्फ़िगर हो तो)। AI यहाँ जवाब नहीं देता।"
            : "Sent to expert. Reply appears in My queries and WhatsApp/SMS when messaging is configured. AI does not answer here.",
        },
      });
      clearAiDoctorExpertReferral();
      setTicketId(createdTicketId);
      setSubmitted(true);
      showToast(isHi ? "एक्सपर्ट को भेज दिया ✓" : "Sent to expert ✓");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <AppShell
        className="!bg-transparent"
        title={ticketId ? (isHi ? "भेज दिया ✓" : "Sent ✓") : isHi ? "भेजने में दिक्कत" : "Could not send"}
        subtitle={
          ticketId
            ? isHi
              ? "जवाब आने पर ऐप + WhatsApp पर मिलेगा"
              : "Reply will show in app + WhatsApp"
            : isHi
              ? "फिर से कोशिश करो"
              : "Please try again"
        }
        breadcrumbs={[
          { label: isHi ? "होम" : "Home", href: "/" },
          { label: isHi ? "पूछो" : "Ask", href: "/ask-query" },
        ]}
      >
        <div className="mx-auto max-w-lg space-y-3 pb-6">
          <div className="relative overflow-hidden rounded-[22px] border border-emerald-500/20 shadow-[var(--av-shadow-md)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/home/home-job-ask.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/70 to-emerald-800/40" />
            <div className="relative px-5 py-8 text-center text-white">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                {ticketId ? <Check className="h-7 w-7" /> : <Clock3 className="h-7 w-7" />}
              </div>
              <h2 className="mt-3 font-display text-xl font-bold">
                {ticketId
                  ? isHi
                    ? "एक्सपर्ट के पास गया"
                    : "Sent to expert"
                  : isHi
                    ? "नहीं पहुँचा"
                    : "Not sent"}
              </h2>
              <p className="mt-1.5 text-sm text-white/85">
                {ticketId
                  ? isHi
                    ? "जवाब “मेरे जवाब” में आएगा — WhatsApp पर भी भेज सकते हो"
                    : "Answer appears in My answers — share on WhatsApp too"
                  : ticketError?.slice(0, 100) ||
                    (isHi ? "नेटवर्क / लॉगिन चेक करो" : "Check network / login")}
              </p>
            </div>
          </div>

          {(photoPreview || query) && ticketId ? (
            <DarkCard className="!p-3">
              <div className="flex gap-3">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-xl object-cover border border-[var(--av-border)]"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
                    {isHi ? "आपका सवाल" : "Your question"}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[var(--av-text-primary)]">
                    {referralSummary?.result.diseaseName ?? lockedCropLabel}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-[var(--av-text-muted)]">
                    {query.slice(0, 120)}
                  </p>
                </div>
              </div>
            </DarkCard>
          ) : null}

          {ticketId ? (
            <div className="grid gap-2">
              <AppLink
                href="/my-queries"
                className="relative flex min-h-[54px] items-center justify-center overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/home/home-job-ask.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute inset-0 bg-emerald-950/70" />
                <span className="relative z-10 flex items-center gap-2 text-[15px] font-bold text-white">
                  <MessageCircle className="h-5 w-5" />
                  {isHi ? "जवाब देखो / WhatsApp" : "See answer / WhatsApp"}
                </span>
              </AppLink>
              <AppLink
                href="/"
                className={cn("inline-flex justify-center", AV.btnSecondarySm)}
              >
                {isHi ? "होम पर जाओ" : "Go home"}
              </AppLink>
            </div>
          ) : (
            <button
              type="button"
              className={cn("flex w-full justify-center", AV.btnPrimary)}
              onClick={() => {
                setSubmitted(false);
                setTicketError(null);
              }}
            >
              {isHi ? "फिर भेजो" : "Try again"}
            </button>
          )}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={t("askExpertTitle")}
      subtitle={
        fromAiDoctor
          ? isHi
            ? "AI निदान एक्सपर्ट को भेजें — जवाब एक्सपर्ट देगा"
            : "Send AI diagnosis to expert — expert will reply"
          : t("askExpertSubtitle")
      }
      breadcrumbs={[
        { label: isHi ? "होम" : "Home", href: "/" },
        { label: isHi ? "विशेषज्ञ" : "Ask Expert" },
      ]}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
        {ticketError ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-3 text-sm font-semibold text-amber-950 dark:text-amber-100">
            <p className="text-[11px] font-bold uppercase tracking-wide text-amber-800/80">
              {isHi ? "एक्सपर्ट तक नहीं पहुँचा" : "Could not reach expert"}
            </p>
            <p className="mt-1 text-xs leading-relaxed font-medium opacity-95">{ticketError}</p>
            <p className="mt-2 text-[11px] font-medium text-amber-900/80 dark:text-amber-200/80">
              {isHi
                ? "चेक: Vercel → SUPABASE_SERVICE_ROLE_KEY (service_role) + Redeploy · Supabase में expert_queries टेबल"
                : "Check: Vercel SUPABASE_SERVICE_ROLE_KEY (service_role) + Redeploy · expert_queries table"}
            </p>
          </div>
        ) : null}

        {fromAiDoctor && referralSummary && (
          <DarkCard className="border border-emerald-600/25 bg-emerald-500/5">
            <div className="flex items-start gap-3">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-xl object-cover border border-emerald-500/20"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700/15 text-emerald-800">
                  <Stethoscope className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/80">
                  {isHi ? "AI फसल डॉक्टर से भेजा" : "From AI Crop Doctor"}
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--av-text-primary)]">
                  {referralSummary.result.diseaseName}
                </p>
                <p className="mt-0.5 text-xs text-[var(--av-text-muted)]">
                  {lockedCropLabel} · {isHi ? "विश्वास" : "Confidence"}{" "}
                  {referralSummary.result.confidence}%
                </p>
              </div>
            </div>
          </DarkCard>
        )}

        {fromAiDoctor ? (
          <DarkCard>
            <h3 className={AV.sectionTitle}>{isHi ? "फसल" : "Crop"}</h3>
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-3">
              <span className="text-2xl" aria-hidden>
                {getCropEmoji(selectedCrop)}
              </span>
              <p className="text-sm font-bold text-[var(--av-text-primary)]">{lockedCropLabel}</p>
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
          <h3 className={AV.sectionTitle}>
            {fromAiDoctor ? (isHi ? "आपका सवाल" : "Your question") : t("writeQuery")}
          </h3>
          <div className="relative mt-3">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, maxChars))}
              placeholder={t("queryPlaceholder")}
              rows={fromAiDoctor ? 3 : 4}
              disabled={submitting}
              className="av-input w-full resize-none disabled:opacity-60"
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

        <DarkCard delay={2} className="!overflow-hidden !p-0">
          <div className="relative min-h-[100px] px-4 pb-3 pt-4">
            {!photoPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/home/home-job-photo.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute inset-0 bg-emerald-950/55" />
              </>
            ) : null}
            <div className={cn("relative z-10", !photoPreview && "text-white")}>
              <h3 className={cn("text-[15px] font-bold", photoPreview ? AV.sectionTitle : "text-white")}>
                {fromAiDoctor
                  ? isHi
                    ? "स्कैन फोटो"
                    : "Scan photo"
                  : isHi
                    ? "फोटो जोड़ो (ठीक है)"
                    : "Add photo (optional)"}
              </h3>
              <p
                className={cn(
                  "mt-1 text-[11px] font-medium",
                  photoPreview ? "text-[var(--av-text-muted)]" : "text-white/85"
                )}
              >
                {fromAiDoctor
                  ? isHi
                    ? "फोटो जुड़ी है — बदल भी सकते हो"
                    : "Photo attached — you can change it"
                  : isHi
                    ? "पत्ती दिखे तो जल्दी समझ आएगा"
                    : "A leaf photo helps the expert"}
              </p>
            </div>
          </div>

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
            <div className="relative mx-4 mb-3 overflow-hidden rounded-xl border border-[var(--av-border)]">
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
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 border-t border-[var(--av-border-subtle)] bg-[var(--av-surface)] p-3">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={submitting}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
              {isHi ? "कैमरा" : "Camera"}
            </button>
            <button
              type="button"
              onClick={openGallery}
              disabled={submitting}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-emerald-600/30 px-3 text-sm font-bold text-emerald-900 dark:text-emerald-100 active:scale-[0.98] disabled:opacity-50"
            >
              <ImagePlus className="h-4 w-4" />
              {isHi ? "गैलरी" : "Gallery"}
            </button>
          </div>
        </DarkCard>

        <button
          type="submit"
          disabled={!query.trim() || submitting}
          className={`flex w-full items-center justify-center gap-2 ${AV.btnPrimary} disabled:opacity-40`}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isHi ? "भेज रहे हैं…" : "Sending…"}
            </>
          ) : fromAiDoctor ? (
            isHi ? (
              "एक्सपर्ट को भेजो"
            ) : (
              "Send to expert"
            )
          ) : isHi ? (
            "सवाल भेजो"
          ) : (
            "Send question"
          )}
        </button>
      </form>
    </AppShell>
  );
}
