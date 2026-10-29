"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { X, Ruler, Maximize2, CheckCircle2, MapPin } from "lucide-react";
import { LatLng, getFieldMeasurement } from "@/lib/geo/fieldGeometry";
import { REGIONAL_BIGHA_OPTIONS } from "@/lib/bighaConversion";
import { useFarmData } from "@/hooks/useFarmData";
import FieldHUD from "@/components/farm/FieldHUD";
import SaveFieldModal from "@/components/farm/SaveFieldModal";
import type { FarmField } from "@/lib/farm/types";

const SmartFieldMap = dynamic(() => import("@/components/farm/SmartFieldMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white/80 gap-3 border border-slate-800">
      <div className="w-9 h-9 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-xs font-semibold">उपग्रह नक्शा लोड हो रहा है (Loading Satellite)...</div>
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
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [selectedBighaId, setSelectedBighaId] = useState<string>("up");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [pinnedLocation, setPinnedLocation] = useState<LatLng | null>(null);

  if (!isOpen) return null;

  const activeBigha =
    REGIONAL_BIGHA_OPTIONS.find((b) => b.id === selectedBighaId) ||
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
    const createdField: FarmField = { ...fieldPayload, id: newId || `f-${Date.now()}` };
    onSuccess?.(createdField);
    setIsSaveModalOpen(false);
    onClose();
  };

  const handlePinLocation = (pos: LatLng) => {
    setPinnedLocation(pos);
    if (coords.length < 3) {
      setCoords([pos]);
    }
    setIsSaveModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-emerald-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-600/10 via-emerald-500/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-1.5">
                अपना खेत नापें
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  GPS व उपग्रह
                </span>
              </h2>
              <p className="text-[11px] text-gray-500">
                उपग्रह से मेड़ बनाएं या खेत पर चलकर सटीक रकबा नापें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/my-farm/measure"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
              title="पूरी स्क्रीन पर खोलें (Full Screen)"
            >
              <Maximize2 className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="p-3 bg-slate-900">
          <SmartFieldMap
            initialCoords={coords}
            mode="draw"
            onCoordsChange={(newCoords) => setCoords(newCoords)}
            onSaveLocationPin={handlePinLocation}
            height="380px"
          />
        </div>

        {/* Live HUD */}
        <div className="p-3 bg-white">
          <FieldHUD
            coords={coords}
            selectedBighaId={selectedBighaId}
            onBighaIdChange={(id) => setSelectedBighaId(id)}
            onSave={() => setIsSaveModalOpen(true)}
            canSave={coords.length >= 3}
          />
        </div>

        {/* Save Field Modal Form */}
        <SaveFieldModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          coords={coords.length >= 3 ? coords : (pinnedLocation ? [pinnedLocation] : coords)}
          bighaDisplay={bighaDisplayString}
          onSave={handleSaveField}
        />
      </div>
    </div>
  );
}
