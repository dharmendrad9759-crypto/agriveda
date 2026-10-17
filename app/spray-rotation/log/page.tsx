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

  const initialCrop = useMemo(() => {
    if (!paramCrop) return SPRAY_CROPS[0]?.slug ?? "paddy";
    const found = SPRAY_CROPS.find(
      (c) =>
        c.slug.toLowerCase() === paramCrop.toLowerCase() ||
        (c.nameHi && c.nameHi.toLowerCase() === paramCrop.toLowerCase()) ||
        c.name.toLowerCase() === paramCrop.toLowerCase()
    );
    return found ? found.slug : paramCrop;
  }, [paramCrop]);

  const [cropId, setCropId] = useState(initialCrop);
  const [fieldId, setFieldId] = useState(fields[0]?.id ?? "");
  const [productQuery, setProductQuery] = useState(paramMed || "");
  const [selectedProduct, setSelectedProduct] = useState<SprayProduct | null>(null);
  const [sprayDate, setSprayDate] = useState(new Date().toISOString().slice(0, 10));
  const [dose, setDose] = useState(paramDose || "");
  const [growthStage, setGrowthStage] = useState(paramStage || "");
  const [pestId, setPestId] = useState("");
  const [diseaseId, setDiseaseId] = useState("");
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");

  const cropFields = fields.filter((f) => f.cropSlug === cropId);
  const activeFieldId = fieldId || cropFields[0]?.id || fields[0]?.id || "";

  const productResults = useMemo(() => {
    const res = searchProducts(productQuery, cropId === "moongfali" ? "moongfali" : cropId);
    if (res.length > 0 || !productQuery.trim()) return res;
    return searchProducts(productQuery);
  }, [productQuery, cropId]);

  const pd = getCropPestDisease(cropId);

  // Auto-fill parameters if arriving via query params
  useEffect(() => {
    if (paramCrop) {
      const found = SPRAY_CROPS.find(
        (c) =>
          c.slug.toLowerCase() === paramCrop.toLowerCase() ||
          (c.nameHi && c.nameHi.toLowerCase() === paramCrop.toLowerCase()) ||
          c.name.toLowerCase() === paramCrop.toLowerCase()
      );
      if (found) setCropId(found.slug);
    }
    if (paramStage) setGrowthStage(paramStage);
    if (paramDose) setDose(paramDose);
    if (paramMed) {
      setProductQuery(paramMed);
      const matches = searchProducts(paramMed);
      if (matches.length > 0) {
        setSelectedProduct(matches[0]);
      }
    }
  }, [paramCrop, paramStage, paramDose, paramMed]);

  // Try matching pest/disease
  useEffect(() => {
    if (!paramProblem) return;
    const norm = paramProblem.toLowerCase();
    const foundPest = pd.pests.find(
      (p) =>
        p.name.toLowerCase().includes(norm) ||
        norm.includes(p.name.toLowerCase()) ||
        p.id === paramProblem
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
        d.id === paramProblem
    );
    if (foundDisease) {
      setDiseaseId(foundDisease.id);
      setPestId("");
    }
  }, [paramProblem, pd]);

  const handleSave = () => {
    let field = activeFieldId;
    if (!field) {
      const f = addField("खेत 1 (Main Field)", cropId);
      field = f.id;
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
    });
    showToast(t(locale, "saved"));
    if (!isOnline) showToast(t(locale, "offlineNote"), "info");

    if (fromMixAdvisor) {
      navigate("/mix-advisor?step=guide");
    } else {
      navigate("/spray-rotation");
    }
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
      backHref={fromMixAdvisor ? "/mix-advisor?step=guide" : "/spray-rotation"}
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
        {fromMixAdvisor && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-[12px] font-bold text-emerald-950 dark:text-emerald-100 flex items-center justify-between">
            <span>✨ टैंक-मिक्स से जानकारी स्वतः भर दी गई है</span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">Auto-filled</span>
          </div>
        )}

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
          <select
            value={activeFieldId}
            onChange={(e) => setFieldId(e.target.value)}
            className="av-input mt-2 w-full"
          >
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.cropSlug})
              </option>
            ))}
            {fields.length === 0 && <option value="">खेत 1 (Main Field)</option>}
          </select>
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
            <input
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder={selectedProduct?.doseHint ?? "उदा. 15L टंकी में 35 ग्राम"}
              className="av-input mt-2 w-full"
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
