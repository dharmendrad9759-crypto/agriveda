"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import FarmSheet from "@/components/farm/FarmSheet";
import { INDIAN_STATES } from "@/lib/india-locations";
import { fieldPlaceFor, stateLabelHi, type FieldPlace } from "@/lib/farm/placeProfile";

export type PlaceHint = {
  label: string;
  state: string;
  district?: string;
};

interface StatePlaceSheetProps {
  open: boolean;
  onClose: () => void;
  hints?: PlaceHint[];
  onPick: (place: FieldPlace) => void;
}

export default function StatePlaceSheet({
  open,
  onClose,
  hints = [],
  onPick,
}: StatePlaceSheetProps) {
  const [query, setQuery] = useState("");

  const states = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INDIAN_STATES.filter((state) => {
      if (!q) return true;
      return (
        state.toLowerCase().includes(q) ||
        stateLabelHi(state).toLowerCase().includes(q)
      );
    });
  }, [query]);

  const choose = (state: string, district?: string) => {
    onPick(fieldPlaceFor(state, district));
    setQuery("");
    onClose();
  };

  const suggestions = hints
    .filter((hint) => hint.state && INDIAN_STATES.includes(hint.state))
    .map((hint) => ({
      label: hint.label,
      place: fieldPlaceFor(hint.state, hint.district),
    }));

  return (
    <FarmSheet
      open={open}
      onClose={onClose}
      title="राज्य चुनें"
      icon={<MapPin className="h-4 w-4" />}
      size="lg"
      level={10020}
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="राज्य खोजें — जैसे उत्तर प्रदेश"
        className="mb-3 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5 text-sm text-[var(--av-text-primary)] outline-none focus:border-emerald-500"
      />

      {suggestions.map(({ label, place }) => (
        <button
          key={`${label}-${place.stateEn}-${place.district || ""}`}
          type="button"
          onClick={() => choose(place.stateEn, place.district)}
          className="mb-3 w-full rounded-2xl border border-emerald-600/40 bg-emerald-500/10 px-3 py-3 text-left"
        >
          <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-200">
            {label}
          </p>
          <p className="mt-0.5 text-sm font-extrabold text-[var(--av-text-primary)]">
            {place.district ? `${place.district}, ` : ""}
            {place.stateHi}
          </p>
          <p className="mt-1 text-[12px] font-semibold text-[var(--av-text-secondary)]">
            {place.soil || "मिट्टी जिले के हिसाब से चुनें"}
            {" · "}
            {place.climateHi}
          </p>
          <p className="mt-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
            इसी राज्य को चुनें
          </p>
        </button>
      ))}

      <ul className="max-h-[46vh] space-y-1.5 overflow-y-auto">
        {states.map((state) => {
          const place = fieldPlaceFor(state);
          return (
            <li key={state}>
              <button
                type="button"
                onClick={() => choose(state)}
                className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-left active:scale-[0.99]"
              >
                <p className="text-sm font-extrabold text-[var(--av-text-primary)]">
                  {place.stateHi}
                </p>
                <p className="mt-0.5 text-[12px] font-semibold leading-snug text-[var(--av-text-secondary)]">
                  {place.bighaLineHi}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </FarmSheet>
  );
}
