import {
  SCHEMES_FARMER_CAUTION_EN,
  SCHEMES_FARMER_CAUTION_HI,
  SCHEMES_FOOTER_DISCLAIMER_EN,
  SCHEMES_FOOTER_DISCLAIMER_HI,
} from "@/data/schemes/schemeLegal";

export default function SchemeTrustAndSafety({ hi }: { hi: boolean }) {
  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5">
        <p className="text-[15px] font-bold text-[var(--av-text-primary)]">
          {hi ? "AgriVeda क्या नहीं करता?" : "What AgriVeda does not do"}
        </p>
        <ul className="mt-2 space-y-1.5 text-[12px] leading-snug text-[var(--av-text-secondary)]">
          <li>{hi ? "सरकारी लाभ approve नहीं करता" : "Does not approve government benefits"}</li>
          <li>{hi ? "subsidy जारी नहीं करता" : "Does not disburse subsidy"}</li>
          <li>{hi ? "loan sanction नहीं करता" : "Does not sanction loans"}</li>
          <li>{hi ? "application approval की guarantee नहीं देता" : "Does not guarantee application approval"}</li>
        </ul>
        <p className="mt-3 text-[15px] font-bold text-[var(--av-text-primary)]">
          {hi ? "AgriVeda क्या करता है?" : "What AgriVeda does"}
        </p>
        <ul className="mt-2 space-y-1.5 text-[12px] leading-snug text-[var(--av-text-secondary)]">
          <li>{hi ? "जानकारी देता है" : "Shares scheme information"}</li>
          <li>{hi ? "योजना समझने में मदद करता है" : "Helps you understand a scheme"}</li>
          <li>{hi ? "प्रारंभिक eligibility guidance देता है" : "Gives preliminary eligibility guidance"}</li>
          <li>{hi ? "official source तक पहुंचने में मदद करता है" : "Helps you reach the official source"}</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3.5">
        <p className="text-[14px] font-bold text-amber-950 dark:text-amber-50">
          {hi ? "किसान सावधानी" : "Farmer caution"}
        </p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-amber-950 dark:text-amber-50">
          {hi ? SCHEMES_FARMER_CAUTION_HI : SCHEMES_FARMER_CAUTION_EN}
        </p>
      </section>

      <p className="text-[11px] leading-relaxed text-[var(--av-text-muted)]">
        {hi ? SCHEMES_FOOTER_DISCLAIMER_HI : SCHEMES_FOOTER_DISCLAIMER_EN}
      </p>
    </div>
  );
}
