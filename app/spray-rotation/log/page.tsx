"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { Plus, Search } from "lucide-react";
import { useSprayLogs } from "@/hooks/useSprayLogs";
import { useSprayFields } from "@/hooks/useSprayFields";
import { useSprayLocale } from "@/hooks/useSprayLocale";
import { useToast } from "@/components/ui/Toast";
import { t, LOCALE_OPTIONS } from "@/lib/i18n/spray-rotation";
import { searchProducts } from "@/lib/sprayRotation";
import { getCropPestDisease } from "@/data/pest-disease";
import { cropCatalog } from "@/data/crop-catalog";
import type { SprayProduct } from "@/types/spray-rotation";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { clearSprayDraft, readSprayDraft } from "@/lib/sprayDraft";

const SPRAY_CROPS = cropCatalog;

function LogSprayForm() {
  const { t: uiT } = useLocale();
  const navigate = useAppNavigate();
  const searchParams = useSearchParams();
  const { locale, setLocale } = useSprayLocale();
  const { fields, addField } = useSprayFields();
  const { addLog, isOnline } = useSprayLogs();
  const { showToast } = useToast();

  const paramCrop = searchParams?.get("crop");
  const paramStage = searchParams?.get("stage");
  const paramProblem = searchParams?.get("problem");
  const paramMed = searchParams?.get("med");
  const paramDose = searchParams?.get("dose");
  const fromMixAdvisor = searchParams?.get("from") === "mix-advisor";
  const draft = fromMixAdvisor ? readSprayDraft() : null;

  const initialCrop = useMemo(() => {
    const asked = draft?.crop || paramCrop;
    if (!asked) return SPRAY_CROPS[0]?.slug ?? "paddy";
    const found = SPRAY_CROPS.find(
      (c) =>
        c.slug.toLowerCase() === asked.toLowerCase() ||
        (c.nameHi && c.nameHi.toLowerCase() === asked.toLowerCase()) ||
        c.name.toLowerCase() === asked.toLowerCase()
    );
    return found ? found.slug : asked;
  }, [draft?.crop, paramCrop]);

  const [cropId, setCropId] = useState(initialCrop);
  const [fieldId, setFieldId] = useState("");
  const [productQuery, setProductQuery] = useState(draft?.med || paramMed || "");
  const [selectedProduct, setSelectedProduct] = useState<SprayProduct | null>(null);
  const [sprayDate, setSprayDate] = useState(new Date().toISOString().slice(0, 10));
  const [dose, setDose] = useState(draft?.dose || paramDose || "");
  const [growthStage, setGrowthStage] = useState(draft?.stage || paramStage || "");
  const [pestId, setPestId] = useState("");
  const [diseaseId, setDiseaseId] = useState("");
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");

  const cropFields = fields.filter((f) => f.cropSlug === cropId);
  const activeFieldId = cropFields.some((f) => f.id === fieldId)
    ? fieldId
    : (cropFields[0]?.id ?? "");
  const cropLabel =
    SPRAY_CROPS.find((c) => c.slug === cropId)?.nameHi || cropId;

  const productResults = useMemo(() => {
    const res = searchProducts(productQuery, cropId === "moongfali" ? "moongfali" : cropId);
    if (res.length > 0 || !productQuery.trim()) return res;
    return searchProducts(productQuery);
  }, [productQuery, cropId]);

  const pd = getCropPestDisease(cropId);

  // Auto-fill parameters if arriving via query params
  useEffect(() => {
    const askedCrop = draft?.crop || paramCrop;
    const askedStage = draft?.stage || paramStage;
    const askedDose = draft?.dose || paramDose;
    const askedMed = draft?.med || paramMed;
    if (askedCrop) {
      const found = SPRAY_CROPS.find(
        (c) =>
          c.slug.toLowerCase() === askedCrop.toLowerCase() ||
          (c.nameHi && c.nameHi.toLowerCase() === askedCrop.toLowerCase()) ||
          c.name.toLowerCase() === askedCrop.toLowerCase()
      );
      if (found) setCropId(found.slug);
    }
    if (askedStage) setGrowthStage(askedStage);
    if (askedDose) setDose(askedDose);
    if (askedMed) {
      setProductQuery(askedMed);
      const matches = searchProducts(askedMed);
      if (matches.length > 0) {
        setSelectedProduct(matches[0]);
      }
    }
  }, [draft?.crop, draft?.dose, draft?.med, draft?.stage, paramCrop, paramStage, paramDose, paramMed]);

  useEffect(() => {
    const matching = fields.filter((f) => f.cropSlug === cropId);
    setFieldId((current) => {
      if (current && matching.some((f) => f.id === current)) return current;
      return matching[0]?.id ?? "";
    });
  }, [cropId, fields]);

  // Try matching pest/disease
  useEffect(() => {
    const askedProblem = draft?.problem || paramProblem;
    if (!askedProblem) return;
    const norm = askedProblem.toLowerCase();
    const foundPest = pd.pests.find(
      (p) =>
        p.name.toLowerCase().includes(norm) ||
        norm.includes(p.name.toLowerCase()) ||
        p.id === askedProblem
    );
    if (foundPest) {
      setPestId(foundPest.id);
      setDiseaseId("");
      return;
    }
    const foundDisease = pd.diseases.find(
      (d) =>
        d.name.toLowerCase().includes(norm) ||
        norm.includes(d.name.toLowerCase()) ||
        d.id === askedProblem
    );
    if (foundDisease) {
      setDiseaseId(foundDisease.id);
      setPestId("");
    }
  }, [draft?.problem, paramProblem, pd]);

  const handleSave = () => {
    const field = activeFieldId;
    if (!field) {
      setShowAddField(true);
      if (!newFieldName.trim()) setNewFieldName(`${cropLabel} का खेत`);
      showToast(
        locale === "hi"
          ? `${cropLabel} का खेत चुनें या नया जोड़ें`
          : `Add a ${cropLabel} field first`,
        "error"
      );
      return;
    }

    const prod =
      selectedProduct ||
      (productQuery.trim()
        ? {
            id: `custom-${Date.now()}`,
            productName: productQuery.trim(),
            activeIngredient: productQuery.trim(),
            category: "insecticide" as const,
            moaType: "IRAC" as const,
            moaGroup: "Tank-Mix",
            cropRecommended: [cropId],
            doseHint: dose.trim(),
          }
        : null);

    if (!prod || !dose.trim()) {
      showToast(locale === "hi" ? "दवा और सटीक खुराक दर्ज करें" : "Product and dose required", "error");
      return;
    }

    addLog({
      cropId,
      fieldId: field,
      productId: prod.id,
      sprayDate,
      doseUsed: dose,
      growthStageAtSpray: growthStage || "Not specified",
      pestId: pestId || undefined,
      diseaseId: diseaseId || undefined,
      technical: prod.activeIngredient || prod.productName,
      moaGroups: prod.moaGroup
        ? prod.moaGroup.split("+").map((g) => g.trim()).filter(Boolean)
        : undefined,
    });
    clearSprayDraft();
    showToast(t(locale, "saved"));
    if (!isOnline) showToast(t(locale, "offlineNote"), "info");
    navigate("/spray-rotation");
  };

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    const f = addField(newFieldName.trim(), cropId);
    setFieldId(f.id);
    setShowAddField(false);
    setNewFieldName("");
  };

  return (
    <AppShell
      title={t(locale, "logSpray")}
      backHref={fromMixAdvisor ? "/mix-advisor" : "/spray-rotation"}
      breadcrumbs={[
        { label: uiT("navHome"), href: "/" },
        { label: uiT("sprayRotation"), href: "/spray-rotation" },
        { label: uiT("sprayLogSpray") },
      ]}
    >
      <DarkCard>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {LOCALE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLocale(opt.code)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                locale === opt.code
                  ? "bg-[var(--av-accent)] text-[#0a0f1a]"
                  : "border border-[var(--av-border)] text-[var(--av-text-muted)]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </DarkCard>

      <div className="mt-4 space-y-4">
        <DarkCard delay={1}>
          <label className="block">
            <span className={AV.label}>{t(locale, "selectCrop")}</span>
            <select
              value={cropId}
              onChange={(e) => {
                setCropId(e.target.value);
                setSelectedProduct(null);
                setPestId("");
                setDiseaseId("");
              }}
              className="av-input mt-2 w-full font-bold"
            >
              {SPRAY_CROPS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.emoji} {c.nameHi ? `${c.nameHi} (${c.name})` : c.name}
                </option>
              ))}
            </select>
          </label>
        </DarkCard>

        <DarkCard delay={2}>
          <span className={AV.label}>{t(locale, "selectField")}</span>
          {cropFields.length === 0 ? (
            <p className="mt-2 text-[13px] font-semibold text-[var(--av-text-secondary)]">
              {cropLabel} का कोई खेत नहीं है। नया {cropLabel} का खेत जोड़ें।
            </p>
          ) : (
            <select
              value={activeFieldId}
              onChange={(e) => setFieldId(e.target.value)}
              className="av-input mt-2 w-full"
            >
              {cropFields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({cropLabel})
                </option>
              ))}
            </select>
          )}
          {showAddField ? (
            <div className="mt-2 flex gap-2">
              <input
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder={t(locale, "fieldName")}
                className="av-input flex-1"
              />
              <button type="button" onClick={handleAddField} className={AV.btnPrimarySm}>
                OK
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddField(true)}
              className="mt-2 flex items-center gap-1 text-xs font-bold text-[var(--av-accent)]"
            >
              <Plus className="h-3.5 w-3.5" /> {t(locale, "addField")}
            </button>
          )}
        </DarkCard>

        <DarkCard delay={3}>
          <span className={AV.label}>{t(locale, "searchProduct")}</span>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
            <input
              value={productQuery}
              onChange={(e) => {
                setProductQuery(e.target.value);
                setSelectedProduct(null);
              }}
              placeholder="दवा का नाम या टेक्निकल..."
              className="av-input av-input--icon w-full py-2.5"
            />
          </div>
          {!selectedProduct && productResults.length > 0 && (
            <ul className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-1">
              {productResults.map((prod) => (
                <li key={prod.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setProductQuery(prod.productName);
                    }}
                    className="w-full px-3 py-2.5 text-left text-sm text-[var(--av-text-primary)] hover:bg-[var(--av-accent-soft)]"
                  >
                    <span className="font-bold">{prod.productName}</span>
                    <span className="ml-2 text-[10px] text-[var(--av-text-muted)]">
                      {prod.moaType} {prod.moaGroup} • {prod.activeIngredient}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selectedProduct && (
            <div className="mt-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-accent-soft)] p-3">
              <p className="text-sm font-bold text-[var(--av-accent)]">{selectedProduct.productName}</p>
              <p className="text-xs text-[var(--av-text-muted)]">
                {selectedProduct.moaType} {selectedProduct.moaGroup} — {selectedProduct.activeIngredient}
              </p>
            </div>
          )}
        </DarkCard>

        <DarkCard delay={4}>
          <label className="block">
            <span className={AV.label}>{t(locale, "targetPest")}</span>
            <select
              value={pestId ? `p-${pestId}` : diseaseId ? `d-${diseaseId}` : ""}
              onChange={(e) => {
                const v = e.target.value;
                if (v.startsWith("p-")) {
                  setPestId(v.slice(2));
                  setDiseaseId("");
                } else if (v.startsWith("d-")) {
                  setDiseaseId(v.slice(2));
                  setPestId("");
                } else {
                  setPestId("");
                  setDiseaseId("");
                }
              }}
              className="av-input mt-2 w-full"
            >
              <option value="">— {paramProblem ? `चयनित: ${paramProblem}` : "समस्या चुनें"} —</option>
              {pd.pests.map((p) => (
                <option key={p.id} value={`p-${p.id}`}>
                  🐛 {p.name}
                </option>
              ))}
              {pd.diseases.map((d) => (
                <option key={d.id} value={`d-${d.id}`}>
                  🦠 {d.name}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className={AV.label}>{t(locale, "sprayDate")}</span>
              <input
                type="date"
                value={sprayDate}
                onChange={(e) => setSprayDate(e.target.value)}
                className="av-input mt-2 w-full"
              />
            </label>
            <label className="block">
              <span className={AV.label}>{t(locale, "growthStage")}</span>
              <input
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                placeholder="उदा. फलन अवस्था"
                className="av-input mt-2 w-full"
              />
            </label>
          </div>

          <label className="mt-3 block">
            <span className={AV.label}>{t(locale, "dose")}</span>
            <textarea
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              rows={Math.min(6, Math.max(2, dose.split("\n").length))}
              placeholder={selectedProduct?.doseHint ?? "उदा. 15L टंकी में 35 ग्राम"}
              className="av-input mt-2 w-full min-h-[4.5rem] whitespace-pre-wrap"
            />
          </label>
        </DarkCard>

        <button type="button" onClick={handleSave} className={`w-full ${AV.btnPrimary}`}>
          {t(locale, "save")}
        </button>
      </div>
    </AppShell>
  );
}

export default function LogSprayPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-sm font-bold text-emerald-800">लोड हो रहा है...</div>}>
      <LogSprayForm />
    </Suspense>
  );
}
