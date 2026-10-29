"use client";

import { useState, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Ruler,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Calculator,
  Layers,
  ChevronRight,
  ShieldAlert,
  X,
} from "lucide-react";
import { LatLng, getFieldMeasurement } from "@/lib/geo/fieldGeometry";
import { REGIONAL_BIGHA_OPTIONS } from "@/lib/bighaConversion";
import { useFarmData } from "@/hooks/useFarmData";
import FieldHUD from "@/components/farm/FieldHUD";
import SaveFieldModal from "@/components/farm/SaveFieldModal";
import type { FarmField } from "@/lib/farm/types";

// Dynamic import for Leaflet-based SmartFieldMap (no SSR)
const SmartFieldMap = dynamic(() => import("@/components/farm/SmartFieldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[440px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-muted)] sm:h-[520px]">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-emerald-600 border-t-transparent" />
      <p className="text-[11px] font-medium">उपग्रह नक्शा लोड हो रहा है…</p>
    </div>
  ),
});

const GUIDE_STEPS = [
  {
    title: "खेत खोजें या GPS से जाएं",
    body: "सर्च में गांव, पिन कोड या निर्देशांक लिखें, या कंपास बटन से अपनी वर्तमान लोकेशन पर पहुंचें।",
  },
  {
    title: "सीमा बनाएं या चलकर नापें",
    body: "नक्शे पर खेत के हर कोने पर टैप करें। कोनों को खींचकर मेड़ पर ठीक करें, या मेड़ पर चलकर सीमा दर्ज करें।",
  },
  {
    title: "रकबा देखें और सहेजें",
    body: "एकड़, बीघा और हेक्टेयर तुरंत देखें। खेत सहेजने के बाद सीधे खाद कैलकुलेटर में भेजें।",
  },
];

function FieldMeasureContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const { data, addField, updateField } = useFarmData();

  const [coords, setCoords] = useState<LatLng[]>([]);
  const [selectedBighaId, setSelectedBighaId] = useState<string>("up");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [savedSuccessField, setSavedSuccessField] =
    useState<FarmField | null>(null);
  const [pinnedLocation, setPinnedLocation] = useState<LatLng | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [hydratedEditId, setHydratedEditId] = useState<string | null>(null);

  // If editId is provided, populate initial field boundary
  const editingField = useMemo(() => {
    if (!editId || !data?.fields) return null;
    return data.fields.find((field) => field.id === editId) || null;
  }, [editId, data?.fields]);

  // Farm data hydrates after mount: adopt the stored boundary once it arrives.
  if (
    editingField &&
    editingField.id !== hydratedEditId &&
    (editingField.boundary?.length ?? 0) >= 3
  ) {
    setHydratedEditId(editingField.id);
    setCoords(editingField.boundary ?? []);
  }

  const activeBigha = useMemo(() => {
    return (
      REGIONAL_BIGHA_OPTIONS.find((option) => option.id === selectedBighaId) ||
      REGIONAL_BIGHA_OPTIONS[0]
    );
  }, [selectedBighaId]);

  const currentMeasurement = useMemo(() => {
    if (coords.length < 3) return null;
    return getFieldMeasurement(
      coords,
      activeBigha.acresPerBigha,
      activeBigha.label,
      activeBigha.note
    );
  }, [coords, activeBigha]);

  const handleSaveField = (fieldPayload: Omit<FarmField, "id">) => {
    if (editingField) {
      updateField(editingField.id, fieldPayload);
      setSavedSuccessField({ ...fieldPayload, id: editingField.id });
    } else {
      const newId = addField(fieldPayload);
      setSavedSuccessField({ ...fieldPayload, id: newId || `f-${Date.now()}` });
    }
  };

  const bighaDisplayString = currentMeasurement?.bigha
    ? `${currentMeasurement.bigha.value.toFixed(2)} बीघा (${activeBigha.state})`
    : undefined;

  return (
    <div className="min-h-screen bg-[var(--av-surface-inset)] pb-16 text-[var(--av-text-primary)]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--av-border)] bg-[var(--av-surface)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 pb-3 pt-3">
          <Link
            href="/my-farm"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)] transition hover:text-[var(--av-text-primary)] active:scale-95"
            aria-label="वापस मेरे खेत"
            title="वापस मेरे खेत"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-1.5 truncate text-[15px] font-semibold leading-tight text-[var(--av-text-primary)]">
              <Ruler className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" />
              {editingField
                ? `सीमा संशोधन: ${editingField.name}`
                : "अपना खेत नापें"}
            </h1>
            <p className="mt-0.5 hidden truncate text-[10.5px] text-[var(--av-text-muted)] sm:block">
              उपग्रह व GPS आधारित WGS84 रकबा मापन
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            aria-expanded={showGuide}
            aria-controls="field-measure-guide"
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2.5 py-1.5 text-[10.5px] font-semibold text-[var(--av-text-secondary)] transition hover:text-[var(--av-text-primary)] active:scale-95"
          >
            <HelpCircle className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
            <span className="hidden sm:inline">कैसे नापें?</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-3xl space-y-3 px-3 pt-3 sm:px-4">
        {/* Help Guide */}
        {showGuide ? (
          <section
            id="field-measure-guide"
            className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]"
          >
            <div className="flex items-start gap-2 border-b border-[var(--av-border-subtle)] px-3.5 py-2.5">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-300" />
              <h2 className="flex-1 text-[12px] font-semibold text-[var(--av-text-primary)]">
                खेत नापने के 3 आसान चरण
              </h2>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--av-text-muted)] transition hover:bg-[var(--av-surface-inset)] hover:text-[var(--av-text-primary)]"
                aria-label="गाइड बंद करें"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <ol className="grid gap-2 p-3 sm:grid-cols-3">
              {GUIDE_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-xl bg-[var(--av-surface-inset)] p-2.5"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="text-[10.5px] font-semibold text-[var(--av-text-primary)]">
                      {step.title}
                    </p>
                  </div>
                  <p className="mt-1 text-[10px] leading-snug text-[var(--av-text-muted)]">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* Success Banner */}
        {savedSuccessField ? (
          <section className="flex flex-col gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.08] p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-[12px] font-semibold text-[var(--av-text-primary)]">
                  खेत &apos;{savedSuccessField.name}&apos; सहेजा गया
                </h3>
                <p className="mt-0.5 text-[10.5px] text-[var(--av-text-muted)]">
                  {savedSuccessField.areaAcres} एकड़ ·{" "}
                  {savedSuccessField.bighaDisplay || "बीघा उपलब्ध नहीं"} ·{" "}
                  {savedSuccessField.village || "गांव दर्ज नहीं"}
                </p>
              </div>
            </div>

            <div className="flex w-full items-center gap-1.5 sm:w-auto">
              <Link
                href={`/services/fertilizer-calculator?acres=${savedSuccessField.areaAcres}&crop=${encodeURIComponent(
                  savedSuccessField.crop || ""
                )}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99] sm:flex-none"
              >
                <Calculator className="h-3.5 w-3.5" />
                खाद गणना
              </Link>
              <Link
                href="/my-farm"
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 text-[11px] font-semibold text-[var(--av-text-secondary)] transition hover:text-[var(--av-text-primary)] active:scale-[0.99] sm:flex-none"
              >
                मेरे खेत
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        ) : null}

        {/* Interactive Satellite Field Map */}
        <section className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--av-border-subtle)] px-3 py-2">
            <p className="flex min-w-0 items-center gap-1.5 text-[10.5px] font-medium text-[var(--av-text-muted)]">
              <MapPin className="h-3 w-3 shrink-0 text-emerald-700 dark:text-emerald-300" />
              <span className="truncate">
                {coords.length >= 3
                  ? `${coords.length} कोनों की सीमा तैयार`
                  : editingField
                    ? "पुरानी सीमा संशोधित करें"
                    : "नक्शे पर खेत के कोने दबाएं"}
              </span>
            </p>
            <span className="shrink-0 rounded-full bg-[var(--av-surface-inset)] px-2 py-0.5 text-[9px] font-semibold text-[var(--av-text-muted)]">
              {activeBigha.state}
            </span>
          </div>

          <SmartFieldMap
            key={editingField?.id ?? "new-field"}
            initialCoords={editingField?.boundary || []}
            mode="draw"
            onCoordsChange={(newCoords) => setCoords(newCoords)}
            onSaveLocationPin={(position) => {
              setPinnedLocation(position);
              if (coords.length < 3) {
                setCoords([position]);
              }
              setIsSaveModalOpen(true);
            }}
            height="clamp(420px, 62vh, 560px)"
          />
        </section>

        {/* Live Calculation HUD */}
        <FieldHUD
          coords={coords}
          selectedBighaId={selectedBighaId}
          onBighaIdChange={(id) => setSelectedBighaId(id)}
          onSave={() => setIsSaveModalOpen(true)}
          canSave={coords.length >= 3}
        />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-[var(--av-shadow-sm)]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <Layers className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h4 className="text-[11px] font-semibold text-[var(--av-text-primary)]">
                राज्य-अनुसार बीघा
              </h4>
              <p className="mt-0.5 text-[10px] leading-snug text-[var(--av-text-muted)]">
                UP, बिहार, राजस्थान, MP के सटीक बीघा मानक
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-[var(--av-shadow-sm)]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300">
              <Calculator className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h4 className="text-[11px] font-semibold text-[var(--av-text-primary)]">
                कैलकुलेटर में ऑटो-फिल
              </h4>
              <p className="mt-0.5 text-[10px] leading-snug text-[var(--av-text-muted)]">
                नापे गए रकबे से खाद व कीटनाशक की सही मात्रा
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-[var(--av-shadow-sm)]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h4 className="text-[11px] font-semibold text-[var(--av-text-primary)]">
                सुरक्षित व निजी डेटा
              </h4>
              <p className="mt-0.5 text-[10px] leading-snug text-[var(--av-text-muted)]">
                सीमाएं और दस्तावेज केवल आपके उपकरण में सुरक्षित
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Save Field Modal Sheet */}
      <SaveFieldModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        coords={
          coords.length >= 3 ? coords : pinnedLocation ? [pinnedLocation] : coords
        }
        bighaDisplay={bighaDisplayString}
        initialData={editingField || undefined}
        onSave={handleSaveField}
      />
    </div>
  );
}

export default function FieldMeasurePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--av-surface-inset)]">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <FieldMeasureContent />
    </Suspense>
  );
}
