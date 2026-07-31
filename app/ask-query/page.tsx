"use client";

import { useState, useRef, useEffect } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import {
  Camera,
  Check,
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
import { clientKisanSaathiFallback } from "@/lib/kisanSaathiClient";
import { getDeviceId } from "@/lib/deviceId";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

const MAX_CHARS = 256;
const MAX_CHARS_REFERRAL = 1200;

function previewText(full: string, max = 180): string {
  const clean = full.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

/** Shrink large camera photos before upload to expert inbox. */
async function compressDataUrlForUpload(dataUrl: string, maxSide = 1280): Promise<string> {
  if (!dataUrl.startsWith("data:image/") || dataUrl.length < 180_000) return dataUrl;
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
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.72);
  } catch {
    return dataUrl;
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
  const [expertAnswer, setExpertAnswer] = useState<string | null>(null);
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
    const cropSlug = selectedCrop === "other" ? undefined : selectedCrop;
    const lastDiagnosis = referralSummary
      ? [
          referralSummary.result.diseaseName,
          `${referralSummary.result.confidence}%`,
          referralSummary.result.severity,
          referralSummary.result.riskLevel,
        ]
          .filter(Boolean)
          .join(" · ")
      : undefined;

    const context = {
      cropSlug,
      cropName,
      district: profile.district || undefined,
      state: profile.state || undefined,
      village: profile.village || undefined,
      lastDiagnosis,
      replyLanguage: (isHi ? "hi" : "en") as "hi" | "en",
    };

    const userMessage = fromAiDoctor
      ? `${query.trim()}\n\n(कृपया AI डॉक्टर निदान की पुष्टि करें — सही/गलत बताएँ, और खेत के हिसाब से स्पष्ट अगला कदम दें।)`
      : query.trim();

    setSubmitting(true);
    setTicketError(null);
    let reply = "";
    try {
      const res = await fetch("/api/kisan-saathi/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage }],
          context,
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (res.ok && data.reply?.trim()) {
        reply = data.reply.trim();
      } else {
        reply = clientKisanSaathiFallback(userMessage, context);
      }
    } catch {
      reply = clientKisanSaathiFallback(userMessage, context);
    }

    // Parallel: send ticket to admin expert inbox
    let createdTicketId: string | null = null;
    try {
      const deviceId = getDeviceId();
      const photoDataUrl = photoPreview
        ? await compressDataUrlForUpload(photoPreview)
        : null;
      const ticketRes = await fetch("/api/expert-queries", {
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
          queryText: query.trim(),
          photoDataUrl,
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
      const ticketData = (await ticketRes.json()) as {
        query?: { id?: string };
        error?: string;
      };
      if (ticketRes.ok && ticketData.query?.id) {
        createdTicketId = ticketData.query.id;
      } else {
        setTicketError(ticketData.error || (isHi ? "एडमिन पैनल तक नहीं पहुँचा" : "Could not reach admin panel"));
      }
    } catch {
      setTicketError(isHi ? "नेटवर्क से एडमिन पैनल तक नहीं पहुँचा" : "Network error sending to admin");
    }

    const today = new Date().toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
    });

    addQuery({
      crop: selectedCrop,
      cropName,
      query: query.trim(),
      image: photoPreview ?? undefined,
      farmerName: profile.name || (isHi ? "आप" : "You"),
      expertResponse: {
        expertName: isHi ? "Agriveda AI सलाह" : "Agriveda AI advice",
        date: today,
        preview: previewText(reply),
        fullAnswer: reply,
      },
    });
    clearAiDoctorExpertReferral();
    setTicketId(createdTicketId);
    setExpertAnswer(reply);
    setSubmitted(true);
    setSubmitting(false);
    showToast(
      createdTicketId
        ? isHi
          ? "एडमिन को भेज दिया · AI सलाह भी तैयार ✓"
          : "Sent to admin · AI advice ready ✓"
        : isHi
          ? "AI सलाह तैयार (एडमिन सिंक बाद में)"
          : "AI advice ready (admin sync pending)"
    );
  };

  if (submitted && expertAnswer) {
    return (
      <AppShell
        className="!bg-transparent"
        title={isHi ? "सलाह मिल गई" : "Advice ready"}
        subtitle={
          fromAiDoctor
            ? isHi
              ? "AI डॉक्टर निदान की पुष्टि / अगला कदम"
              : "Confirmation of AI Doctor diagnosis"
            : isHi
              ? "आपके सवाल का जवाब"
              : "Answer to your question"
        }
        breadcrumbs={[
          { label: isHi ? "होम" : "Home", href: "/" },
          { label: isHi ? "पूछें" : "Ask", href: "/ask-query" },
        ]}
      >
        <div className="mx-auto max-w-lg space-y-4 pb-6">
          <DarkCard className="flex flex-col items-center py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15">
              <Check className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="mt-3 font-display text-xl font-bold text-[var(--av-text-primary)]">
              {isHi ? "सलाह + एडमिन को भेजा" : "Advice + sent to admin"}
            </h2>
            <p className="mt-1.5 max-w-sm text-sm text-[var(--av-text-muted)]">
              {ticketId
                ? isHi
                  ? "आपका सवाल Expert Admin पैनल पर पहुँच गया। जवाब आने पर “मेरे सवाल” में दिखेगा।"
                  : "Your query reached the Expert Admin panel. Replies appear in My queries."
                : isHi
                  ? "नीचे तुरंत AI सलाह है। एडमिन सिंक: " + (ticketError || "बाद में कोशिश करें")
                  : `AI advice below. Admin sync: ${ticketError || "try later"}`}
            </p>
            {ticketId ? (
              <p className="mt-2 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
                Ticket · {ticketId.slice(0, 8)}…
              </p>
            ) : null}
          </DarkCard>

          {(photoPreview || fromAiDoctor) && (
            <DarkCard className="!p-3">
              <div className="flex gap-3">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-xl object-cover border border-[var(--av-border)]"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/80">
                    {fromAiDoctor
                      ? isHi
                        ? "AI डॉक्टर संदर्भ"
                        : "AI Doctor context"
                      : isHi
                        ? "आपका सवाल"
                        : "Your question"}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[var(--av-text-primary)]">
                    {referralSummary?.result.diseaseName ?? lockedCropLabel}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-[var(--av-text-muted)]">
                    {referralSummary
                      ? `${referralSummary.result.confidence}% · ${referralSummary.result.severity}`
                      : query.slice(0, 120)}
                  </p>
                </div>
              </div>
            </DarkCard>
          )}

          <DarkCard>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700">
                <Stethoscope className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-[var(--av-text-primary)]">
                  {isHi ? "Agriveda विशेषज्ञ" : "Agriveda Expert"}
                </p>
                <p className="text-[11px] text-[var(--av-text-muted)]">
                  {isHi ? "AI आधारित पुष्टि सलाह" : "AI-assisted confirmation"}
                </p>
              </div>
            </div>
            <div className="mt-3 whitespace-pre-wrap rounded-xl border border-emerald-500/15 bg-[var(--av-surface-inset)] px-3.5 py-3 text-sm leading-relaxed text-[var(--av-text-secondary)]">
              {expertAnswer}
            </div>
          </DarkCard>

          <div className="grid gap-2 sm:grid-cols-2">
            <AppLink href="/my-queries" className={cn("inline-flex justify-center gap-2", AV.btnPrimary)}>
              <MessageCircle className="h-4 w-4" />
              {isHi ? "मेरे सवाल / जवाब" : "My queries / replies"}
            </AppLink>
            <AppLink
              href={fromAiDoctor ? "/ai-doctor" : "/ask-query"}
              className={cn("inline-flex justify-center", AV.btnSecondarySm)}
            >
              {fromAiDoctor
                ? isHi
                  ? "AI डॉक्टर पर वापस"
                  : "Back to AI Doctor"
                : isHi
                  ? "और पूछें"
                  : "Ask another"}
            </AppLink>
          </div>
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
            ? "AI डॉक्टर निदान भेजा गया — पुष्टि सलाह लें"
            : "AI Doctor diagnosis shared — get confirmation"
          : t("askExpertSubtitle")
      }
      breadcrumbs={[
        { label: isHi ? "होम" : "Home", href: "/" },
        { label: isHi ? "विशेषज्ञ" : "Ask Expert" },
      ]}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
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

        <DarkCard delay={2}>
          <h3 className={AV.sectionTitle}>
            {fromAiDoctor
              ? isHi
                ? "स्कैन फोटो"
                : "Scan photo"
              : t("addPhotoOptional")}
          </h3>
          <p className={`mt-1 ${AV.micro}`}>
            {fromAiDoctor
              ? isHi
                ? "AI डॉक्टर वाली फोटो पहले से जुड़ी है — चाहें तो बदल सकते हैं"
                : "AI Doctor photo is attached — you can change it"
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
            <button
              type="button"
              onClick={openGallery}
              disabled={submitting}
              className={`inline-flex justify-center gap-2 ${AV.btnSecondarySm}`}
            >
              <ImagePlus className="h-4 w-4" />
              {photoPreview ? t("changePhoto") : t("fromGallery")}
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={submitting}
              className={`inline-flex justify-center gap-2 ${AV.btnSecondarySm}`}
            >
              <Camera className="h-4 w-4" />
              {t("takePhoto")}
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
              {isHi ? "सलाह आ रही है…" : "Getting advice…"}
            </>
          ) : fromAiDoctor ? (
            isHi ? (
              "पुष्टि सलाह लें"
            ) : (
              "Get confirmation advice"
            )
          ) : (
            t("submitQuery")
          )}
        </button>
      </form>
    </AppShell>
  );
}
