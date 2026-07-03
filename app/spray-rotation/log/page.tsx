"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Search } from "lucide-react";
import PageBackground from "@/components/ui/PageBackground";
import BottomNav from "@/components/layout/BottomNav";
import GlassCard from "@/components/ui/GlassCard";
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

const SPRAY_CROPS = cropCatalog.filter((c) =>
  ["paddy", "cotton", "maize", "moongfali"].includes(c.slug)
);

export default function LogSprayPage() {
  const router = useRouter();
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
    router.push("/spray-rotation");
  };

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    const f = addField(newFieldName.trim(), cropId);
    setFieldId(f.id);
    setShowAddField(false);
    setNewFieldName("");
  };

  return (
    <div className="agriveda-page relative min-h-screen pb-28">
      <PageBackground />

      <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
          <Link
            href="/spray-rotation"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 text-emerald-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-extrabold theme-text-primary">{t(locale, "logSpray")}</h1>
        </div>
      </header>

      <div className="relative mx-auto max-w-lg space-y-4 px-4 py-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {LOCALE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLocale(opt.code)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                locale === opt.code
                  ? "bg-emerald-600 text-white"
                  : "border border-gray-200 theme-text-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="text-xs font-bold theme-text-muted">{t(locale, "selectCrop")}</span>
          <select
            value={cropId}
            onChange={(e) => {
              setCropId(e.target.value);
              setSelectedProduct(null);
              setPestId("");
              setDiseaseId("");
            }}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-black/30"
          >
            {SPRAY_CROPS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="text-xs font-bold theme-text-muted">{t(locale, "selectField")}</span>
          <select
            value={activeFieldId}
            onChange={(e) => setFieldId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-black/30"
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
                className="flex-1 rounded-xl border px-3 py-2 text-sm"
              />
              <button type="button" onClick={handleAddField} className="rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white">
                OK
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddField(true)}
              className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600"
            >
              <Plus className="h-3.5 w-3.5" /> {t(locale, "addField")}
            </button>
          )}
        </div>

        <div>
          <span className="text-xs font-bold theme-text-muted">{t(locale, "searchProduct")}</span>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={productQuery}
              onChange={(e) => {
                setProductQuery(e.target.value);
                setSelectedProduct(null);
              }}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm dark:border-white/10 dark:bg-black/30"
            />
          </div>
          {!selectedProduct && productResults.length > 0 && (
            <ul className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
              {productResults.map((prod) => (
                <li key={prod.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setProductQuery(prod.productName);
                    }}
                    className="w-full px-3 py-2.5 text-left text-sm hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                  >
                    <span className="font-bold">{prod.productName}</span>
                    <span className="ml-2 text-[10px] theme-text-muted">
                      {prod.moaType} {prod.moaGroup} • {prod.activeIngredient}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selectedProduct && (
            <GlassCard className="mt-2 p-3">
              <p className="text-sm font-bold text-emerald-700">{selectedProduct.productName}</p>
              <p className="text-xs theme-text-muted">
                {selectedProduct.moaType} {selectedProduct.moaGroup} — {selectedProduct.activeIngredient}
              </p>
            </GlassCard>
          )}
        </div>

        <label className="block">
          <span className="text-xs font-bold theme-text-muted">{t(locale, "targetPest")}</span>
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
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
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

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-bold theme-text-muted">{t(locale, "sprayDate")}</span>
            <input
              type="date"
              value={sprayDate}
              onChange={(e) => setSprayDate(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold theme-text-muted">{t(locale, "growthStage")}</span>
            <input
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              placeholder="e.g. Tillering"
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-bold theme-text-muted">{t(locale, "dose")}</span>
          <input
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder={selectedProduct?.doseHint ?? "e.g. 1 ml/L"}
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
          />
        </label>

        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-2xl bg-[#006432] py-4 text-sm font-black text-white shadow-lg"
        >
          {t(locale, "save")}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
