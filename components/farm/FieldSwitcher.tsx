"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Tractor, Plus, MapPin, Check } from "lucide-react";
import { FarmField } from "@/lib/farm/types";

interface FieldSwitcherProps {
  fields: FarmField[];
  selectedFieldId: string;
  onSelectField: (fieldId: string) => void;
  className?: string;
}

export default function FieldSwitcher({
  fields,
  selectedFieldId,
  onSelectField,
  className = "",
}: FieldSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentField = fields.find((f) => f.id === selectedFieldId) || fields[0];

  if (!currentField) return null;

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 hover:bg-white text-gray-900 border border-emerald-200/80 shadow-sm transition active:scale-95"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
          <Tractor className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <div className="text-xs font-black text-gray-900 truncate max-w-[130px] sm:max-w-[180px]">
            {currentField.name}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold truncate max-w-[130px]">
            {currentField.crop} • {currentField.areaAcres ? `${currentField.areaAcres} एकड़` : currentField.area}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-emerald-100 z-[101] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              मेरे सहेजे गए खेत ({fields.length})
            </div>

            <div className="max-h-64 overflow-y-auto py-1">
              {fields.map((f) => {
                const isSelected = f.id === selectedFieldId;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      onSelectField(f.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center justify-between text-left transition ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-950 font-bold"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold truncate flex items-center gap-1.5">
                        <span>{f.name}</span>
                        {f.village && (
                          <span className="text-[10px] text-gray-400 font-normal truncate">
                            ({f.village})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {f.crop} • {f.areaAcres ? `${f.areaAcres} एकड़` : f.area}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-gray-100 bg-gray-50">
              <Link
                href="/my-farm/measure"
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>नया खेत नापें व जोड़ें</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
