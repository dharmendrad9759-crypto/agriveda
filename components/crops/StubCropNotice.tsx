import AppLink from "@/components/ui/AppLink";

export default function StubCropNotice({ hi }: { hi: boolean }) {
  return (
    <div
      role="note"
      className="mb-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-3 text-amber-950 dark:text-amber-100"
    >
      <p className="text-sm font-black">{hi ? "⚠️ संक्षिप्त गाइड" : "⚠️ Brief guide"}</p>
      <p className="mt-1 text-xs font-medium leading-snug">
        {hi
          ? "इस फसल की पूरी जानकारी अभी तैयार नहीं है। बुवाई, खाद और दवा की मात्रा के लिए अपने कृषि विज्ञान केंद्र या कृषि अधिकारी से पक्का करें।"
          : "Full details for this crop are not ready yet. Confirm sowing, fertilizer and spray doses with your KVK or agriculture officer."}
      </p>
      <AppLink
        href="/ask-query"
        className="mt-2 inline-flex rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-bold text-emerald-800 dark:bg-black/30 dark:text-emerald-200"
      >
        {hi ? "एक्सपर्ट से पूछें" : "Ask an expert"}
      </AppLink>
    </div>
  );
}
