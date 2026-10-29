"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Ruler, Maximize2, MapPin } from "lucide-react";
import { LatLng, getFieldMeasurement } from "@/lib/geo/fieldGeometry";
import { REGIONAL_BIGHA_OPTIONS } from "@/lib/bighaConversion";
import { useFarmData } from "@/hooks/useFarmData";
import FieldHUD from "@/components/farm/FieldHUD";
import SaveFieldModal from "@/components/farm/SaveFieldModal";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import type { FarmField } from "@/lib/farm/types";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

const SmartFieldMap = dynamic(() => import("@/components/farm/SmartFieldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[380px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-emerald-600 border-t-transparent" />
      <p className="text-[11px] font-medium">उपग्रह नक्शा लोड हो रहा है…</p>
    </div>
  ),
});

interface HomeFieldMeasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (field: FarmField) => void;
}

export default function HomeFieldMeasureModal({
  isOpen,
  onClose,
  onSuccess,
}: HomeFieldMeasureModalProps) {
  const { addField } = useFarmData();
  const reduced = useReducedMotion();
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [selectedBighaId, setSelectedBighaId] = useState<string>("up");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [pinnedLocation, setPinnedLocation] = useState<LatLng | null>(null);

  const wasOpen = useRef(false);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      setCoords([]);
      setPinnedLocation(null);
      setIsSaveModalOpen(false);
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaveModalOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, isSaveModalOpen, onClose]);

  const activeBigha =
    REGIONAL_BIGHA_OPTIONS.find((option) => option.id === selectedBighaId) ||
    REGIONAL_BIGHA_OPTIONS[0];

  const currentMeasurement =
    coords.length >= 3
      ? getFieldMeasurement(
          coords,
          activeBigha.acresPerBigha,
          activeBigha.label,
          activeBigha.note
        )
      : null;

  const bighaDisplayString = currentMeasurement?.bigha
    ? `${currentMeasurement.bigha.value.toFixed(2)} बीघा (${activeBigha.state})`
    : undefined;

  const handleSaveField = (fieldPayload: Omit<FarmField, "id">) => {
    const newId = addField(fieldPayload);
    const createdField: FarmField = {
      ...fieldPayload,
      id: newId || `f-${Date.now()}`,
    };
    onSuccess?.(createdField);
    setIsSaveModalOpen(false);
    onClose();
  };

  const handlePinLocation = (position: LatLng) => {
    setPinnedLocation(position);
    if (coords.length < 3) {
      setCoords([position]);
    }
    setIsSaveModalOpen(true);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="home-field-measure"
          className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-4"
          style={{ zIndex: 9990 }}
          role="dialog"
          aria-modal="true"
          aria-label="अपना खेत नापें"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: MOTION.normal, ease: EASE_OUT }}
        >
          <motion.button
            type="button"
            aria-label="बंद करें"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[3px]"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION.fast }}
          />

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 48, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.99 }}
            transition={{ duration: MOTION.normal, ease: EASE_OUT }}
            className="relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-3xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-2xl sm:max-w-2xl sm:rounded-3xl"
          >
            <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-[var(--av-border)] sm:hidden" />

            <header className="flex items-start gap-3 border-b border-[var(--av-border-subtle)] px-4 pb-3 pt-3 sm:px-5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-700 dark:text-emerald-300">
                <Ruler className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-semibold leading-tight text-[var(--av-text-primary)]">
                  अपना खेत नापें
                </h2>
                <p className="mt-0.5 text-[11px] leading-snug text-[var(--av-text-muted)]">
                  उपग्रह से सीमा बनाएं या खेत पर चलकर सटीक रकबा नापें
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href="/my-farm/measure"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--av-text-muted)] transition hover:bg-[var(--av-surface-inset)] hover:text-[var(--av-text-primary)]"
                  title="पूरी स्क्रीन पर खोलें"
                  aria-label="पूरी स्क्रीन पर खोलें"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--av-text-muted)] transition hover:bg-[var(--av-surface-inset)] hover:text-[var(--av-text-primary)] active:scale-95"
                  aria-label="बंद करें"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="px-3 pt-3">
                <div className="overflow-hidden rounded-2xl border border-[var(--av-border)]">
                  <SmartFieldMap
                    initialCoords={coords}
                    mode="draw"
                    onCoordsChange={(newCoords) => setCoords(newCoords)}
                    onSaveLocationPin={handlePinLocation}
                    height="360px"
                  />
                </div>
              </div>

              <div className="p-3">
                <FieldHUD
                  coords={coords}
                  selectedBighaId={selectedBighaId}
                  onBighaIdChange={(id) => setSelectedBighaId(id)}
                  onSave={() => setIsSaveModalOpen(true)}
                  canSave={coords.length >= 3}
                />
              </div>

              <p className="flex items-start gap-1.5 px-4 pb-4 text-[10px] leading-snug text-[var(--av-text-muted)]">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-300" />
                यह WGS84 भू-गणितीय उपग्रह आधारित अनुमानित माप है — राजस्व या
                कानूनी सर्वेक्षण के लिए मान्य नहीं।
              </p>
            </div>
          </motion.div>

          <SaveFieldModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            coords={
              coords.length >= 3
                ? coords
                : pinnedLocation
                  ? [pinnedLocation]
                  : coords
            }
            bighaDisplay={bighaDisplayString}
            onSave={handleSaveField}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
