"use client";

interface CropSelectorProps {
  crops: { id: string; name: string; emoji: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function CropSelector({ crops, selectedId, onSelect }: CropSelectorProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {crops.map((crop) => {
        const isSelected = crop.id === selectedId;
        return (
          <button
            key={crop.id}
            type="button"
            onClick={() => onSelect(crop.id)}
            className="flex flex-shrink-0 flex-col items-center gap-1.5"
          >
            <div
              className={`flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-2 text-3xl transition-all ${
                isSelected
                  ? "border-emerald-400/60 bg-emerald-500/15 shadow-[0_0_16px_rgba(0,255,136,0.25)]"
                  : "border-white/10 bg-black/30 hover:border-emerald-500/30"
              }`}
            >
              {crop.emoji}
            </div>
            <span
              className={`max-w-[72px] text-center text-[11px] font-bold leading-tight ${
                isSelected ? "text-emerald-400" : "text-slate-500"
              }`}
            >
              {crop.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
