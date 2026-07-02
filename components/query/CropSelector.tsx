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
                  ? "border-[#006432] bg-emerald-50 shadow-sm"
                  : "border-gray-100 bg-gray-50 hover:border-emerald-200"
              }`}
            >
              {crop.emoji}
            </div>
            <span
              className={`max-w-[72px] text-center text-[11px] font-semibold leading-tight ${
                isSelected ? "text-[#006432]" : "text-gray-600"
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
