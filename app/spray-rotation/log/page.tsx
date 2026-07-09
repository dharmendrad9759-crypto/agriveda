"use client";

import { useState, useMemo } from "react";
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

const SPRAY_CROPS = cropCatalog.filter((c) =>
  ["paddy", "cotton", "maize", "moongfali"].includes(c.slug)
);

export default function LogSprayPage() {
  const navigate = useAppNavigate();
  const { locale, setLocale } = useSprayLocale();
  const { fields, addField } = useSprayFields();
  const { addLog, isOnline } = useSprayLogs();
  const { showToast } = useToast();

  const [cropId, setCropId] = useState(SPRAY_CROPS[0]?.slug ?? "paddy");
  const [fieldId, setFieldId] = useState(fields[0]?.id ?? "");
  const [productQuery, setProductQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<SprayProduct | null>(null);
  const [sprayDate, setSprayDate] = useState(new Date().toISOString().slice(0, 10));
  const [dose, setDose] = useState("");
  const [growthStage, setGrowthStage] = useState("");
  const [pestId, setPestId] = useState("");
  const [diseaseId, setDiseaseId] = useState("");
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");

  const cropFields = fields.filter((f) => f.cropSlug === cropId || f.cropSlug === cropId);
  const activeFieldId = fieldId || cropFields[0]?.id || fields[0]?.id || "";

  const productResults = useMemo(
    () => searchProducts(productQuery, cropId === "moongfali" ? "moongfali" : cropId),
    [productQuery, cropId]
  );

  const pd = getCropPestDisease(cropId);

  const handleSave = () => {
    if (!selectedProduct || !activeFieldId || !dose.trim()) {
      showToast("Product, field, and dose required", "error");
      return;
    }
    addLog({
      cropId,
      fieldId: activeFieldId,
      productId: selectedProduct.id,
      sprayDate,
      doseUsed: dose,
      growthStageAtSpray: growthStage || "Not specified",
      pestId: pestId || undefined,
      diseaseId: diseaseId || undefined,
    });
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
      subtitle="IRAC rotation ke liye spray record karein"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Spray Rotation", href: "/spray-rotation" },
        { label: "Log Spray" },
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
              className="av-input mt-2 w-full"
            >
              {SPRAY_CROPS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.emoji} {c.name}
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
              className="av-input w-full py-2.5 pl-10"
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
              value={pestId || diseaseId}
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
              <option value="">—</option>
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
                placeholder="e.g. Tillering"
                className="av-input mt-2 w-full"
              />
            </label>
          </div>

          <label className="mt-3 block">
            <span className={AV.label}>{t(locale, "dose")}</span>
            <input
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder={selectedProduct?.doseHint ?? "e.g. 1 ml/L"}
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
