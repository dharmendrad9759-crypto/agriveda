"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Ruler,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Calculator,
  RefreshCw,
  Layers,
  ChevronRight,
  ShieldAlert,
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
    <div className="w-full h-[520px] bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white/80 gap-3 border border-slate-800">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-sm font-semibold">उपग्रह नक्शा लोड हो रहा है (Loading Satellite Map)...</div>
      <div className="text-xs text-slate-400">कृषि उपग्रह दृश्य तैयार किया जा रहा है</div>
    </div>
  ),
});

function FieldMeasureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const { data, addField, updateField } = useFarmData();

  const [coords, setCoords] = useState<LatLng[]>([]);
  const [selectedBighaId, setSelectedBighaId] = useState<string>("up");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [savedSuccessField, setSavedSuccessField] = useState<FarmField | null>(null);
  const [pinnedLocation, setPinnedLocation] = useState<LatLng | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // If editId is provided, populate initial field boundary
  const editingField = useMemo(() => {
    if (!editId || !data?.fields) return null;
    return data.fields.find((f) => f.id === editId) || null;
  }, [editId, data?.fields]);

  useEffect(() => {
    if (editingField?.boundary && editingField.boundary.length >= 3) {
      setCoords(editingField.boundary);
    }
  }, [editingField]);

  const activeBigha = useMemo(() => {
    return (
      REGIONAL_BIGHA_OPTIONS.find((b) => b.id === selectedBighaId) ||
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-white pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/my-farm"
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              title="वापस मेरे खेत"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-emerald-600" />
                {editingField ? `सीमा संशोधन: ${editingField.name}` : "अपना खेत नापें"}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                उपग्रह व GPS आधारित सटीक भू-गणितीय (WGS84) रकबा मापन व लोकेशन
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGuide((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">कैसे नापें? (Guide)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 pt-4 space-y-4">
        {/* Help Guide Banner */}
        {showGuide && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-lg border border-emerald-500/30 transition-all">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-200" />
                खेत नापने की 5 आसान विधियां:
              </h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-white/80 hover:text-white text-xs font-bold px-2 py-0.5 rounded bg-black/20"
              >
                बंद करें
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-50/90 pt-1">
              <div className="bg-white/10 p-2.5 rounded-xl">
                <b className="text-white block mb-0.5">1. खेत खोजें या GPS से जाएं:</b>
                सर्च बार में अपने गांव का नाम लिखें या नीले कंपास बटन से वर्तमान खेत पर जाएं।
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <b className="text-white block mb-0.5">2. मेड़ पर टैप करें या चलकर नापें:</b>
                खेत के हर कोने पर टैप करें। कोनों को खींचकर (Drag) ठीक मेड़ पर सेट करें।
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <b className="text-white block mb-0.5">3. सहेजें और खाद निकालें:</b>
                एकड़ व बीघा तुरंत देखें। सहेजने के बाद उर्वरक कैलकुलेटर में सीधे उपयोग करें।
              </div>
            </div>
          </div>
        )}

        {/* Success Modal / Banner */}
        {savedSuccessField && (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  खेत &apos;{savedSuccessField.name}&apos; सफलतापूर्वक सहेजा गया!
                </h3>
                <p className="text-xs text-emerald-800">
                  कुल रकबा: <b>{savedSuccessField.areaAcres} एकड़</b> ({savedSuccessField.bighaDisplay || "सहेजा गया"}) • {savedSuccessField.village}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href={`/services/fertilizer-calculator?acres=${savedSuccessField.areaAcres}&crop=${encodeURIComponent(
                  savedSuccessField.crop || ""
                )}`}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Calculator className="w-3.5 h-3.5" />
                खाद की गणना करें
              </Link>
              <Link
                href="/my-farm"
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1 transition"
              >
                मेरे खेत देखें
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Interactive Satellite Field Map */}
        <div className="w-full">
          <SmartFieldMap
            initialCoords={editingField?.boundary || []}
            mode="draw"
            onCoordsChange={(newCoords) => setCoords(newCoords)}
            onSaveLocationPin={(pos) => {
              setPinnedLocation(pos);
              if (coords.length < 3) {
                setCoords([pos]);
              }
              setIsSaveModalOpen(true);
            }}
            height="540px"
          />
        </div>

        {/* Live Calculation HUD */}
        <div className="w-full">
          <FieldHUD
            coords={coords}
            selectedBighaId={selectedBighaId}
            onBighaIdChange={(id) => setSelectedBighaId(id)}
            onSave={() => setIsSaveModalOpen(true)}
            canSave={coords.length >= 3}
          />
        </div>

        {/* Feature Cards / Integration Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">राज्य-अनुसार बीघा</h4>
              <p className="text-[11px] text-gray-500">
                UP, बिहार, राजस्थान, MP आदि के अनुसार सटीक बीघा रूपांतरण
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">कैलकुलेटर में ऑटो-फिल</h4>
              <p className="text-[11px] text-gray-500">
                नापे गए रकबे से खाद और कीटनाशक की सही मात्रा निकालें
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">सुरक्षित व निजी डेटा</h4>
              <p className="text-[11px] text-gray-500">
                खेत की सीमाएं और डेटा केवल आपके उपकरण में सुरक्षित हैं
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Save Field Modal Sheet */}
      <SaveFieldModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        coords={coords.length >= 3 ? coords : (pinnedLocation ? [pinnedLocation] : coords)}
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
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <FieldMeasureContent />
    </Suspense>
  );
}
