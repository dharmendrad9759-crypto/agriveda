"use client";

import { Ruler } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import FarmSheet from "@/components/farm/FarmSheet";
import { measureFieldHref } from "@/components/farm/MeasureFieldButton";

export default function MeasureAfterAddPrompt({
  fieldId,
  isHi,
  onDismiss,
}: {
  fieldId: string | null;
  isHi: boolean;
  onDismiss: () => void;
}) {
  return (
    <FarmSheet
      open={Boolean(fieldId)}
      onClose={onDismiss}
      title={isHi ? "खेत जुड़ गया" : "Field added"}
      subtitle={isHi ? "नक्शे पर नापना ज़रूरी नहीं — चाहें तो अभी नापें" : "Measuring is optional — you can do it now"}
      icon={<Ruler className="h-5 w-5" />}
    >
      <div className="space-y-2.5">
        <p className="text-[13px] font-medium leading-relaxed text-[var(--av-text-secondary)]">
          {isHi
            ? "फसल और बुवाई सेव हो गई। सटीक एकड़ चाहिए तो नक्शे पर चार कोने लगाकर नाप लें।"
            : "Crop and sowing are saved. Measure the four corners if you want exact acres."}
        </p>
        <AppLink
          href={fieldId ? measureFieldHref(fieldId) : "/my-farm/measure"}
          onClick={onDismiss}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white"
        >
          <Ruler className="h-4 w-4" />
          {isHi ? "हाँ, खेत नापें" : "Yes, measure field"}
        </AppLink>
        <button
          type="button"
          onClick={onDismiss}
          className="flex w-full items-center justify-center rounded-xl border border-[var(--av-border)] py-2.5 text-sm font-bold text-[var(--av-text-secondary)]"
        >
          {isHi ? "बाद में" : "Later"}
        </button>
      </div>
    </FarmSheet>
  );
}
