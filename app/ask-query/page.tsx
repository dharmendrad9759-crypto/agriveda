"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Camera, Check, X, ChevronRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import PageBackground from "@/components/ui/PageBackground";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import CropSelector from "@/components/query/CropSelector";
import VoiceRecorderMock from "@/components/query/VoiceRecorderMock";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useToast } from "@/components/ui/Toast";
import { cropCatalog } from "@/data/crop-catalog";

const MAX_CHARS = 256;

export default function AskQueryPage() {
  const { crops, hydrated } = useMyCrops();
  const { addQuery } = useQueryHistory();
  const { profile } = useFarmerProfile();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableCrops = hydrated
    ? crops.map((c) => ({ id: c.slug, name: c.name, emoji: c.emoji }))
    : cropCatalog.slice(0, 4).map((c) => ({
        id: c.slug,
        name: c.name,
        emoji: c.emoji,
      }));

  const [selectedCrop, setSelectedCrop] = useState(availableCrops[0]?.id ?? "paddy");
  const [query, setQuery] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (availableCrops.length > 0 && !availableCrops.find((c) => c.id === selectedCrop)) {
      setSelectedCrop(availableCrops[0].id);
    }
  }, [availableCrops, selectedCrop]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
      showToast("Photo attached ✓");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const cropName = availableCrops.find((c) => c.id === selectedCrop)?.name ?? selectedCrop;
    addQuery({
      crop: selectedCrop,
      cropName,
      query: query.trim(),
      image: photoPreview ?? undefined,
      farmerName: profile.name || "You",
    });
    setSubmitted(true);
    showToast("Query भेजी गई ✓");
  };

  if (submitted) {
    return (
      <div className="agriveda-page flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <PageBackground />
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 shadow-[0_0_24px_rgba(0,255,136,0.3)]">
            <Check className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="mt-4 text-xl font-black theme-text-primary">Query भेज दी गई!</h2>
          <p className="mt-2 text-sm theme-text-muted">
            Agriveda Expert 24–48 घंटे में जवाब देगा। Community feed में देखें।
          </p>
          <Link
            href="/community"
            className="mt-6 inline-block rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-8 py-3 text-sm font-black text-emerald-400"
          >
            Community feed देखें
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="agriveda-page relative pb-28">
      <PageBackground />
      <PageHeader title="Ask query" subtitle="Field diagnostic submission" backHref="/" />

      <form onSubmit={handleSubmit} className="relative mx-auto max-w-lg space-y-6 px-4 py-5">
        <section>
          <SectionHeading title="Select crop for query." />
          {availableCrops.length > 0 ? (
            <CropSelector
              crops={availableCrops}
              selectedId={selectedCrop}
              onSelect={setSelectedCrop}
            />
          ) : (
            <GlassCard className="p-4 text-center text-sm theme-text-muted">
              Add crops from home screen first.
            </GlassCard>
          )}
        </section>

        <section>
          <SectionHeading title="Write your query." />
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, MAX_CHARS))}
              placeholder="फसल की समस्या विस्तार से लिखें..."
              rows={5}
              className="w-full resize-none rounded-2xl border border-emerald-500/20 bg-white px-4 py-3 text-sm theme-text-primary placeholder-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-black/40"
            />
            <span className="absolute bottom-3 right-3 text-[11px] theme-text-muted tabular-nums">
              {query.length}/{MAX_CHARS}
            </span>
          </div>
          <div className="mt-3">
            <VoiceRecorderMock />
          </div>
        </section>

        <section>
          <SectionHeading title="Upload photo (optional)." />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          {photoPreview && (
            <div className="mb-3 overflow-hidden rounded-2xl border border-emerald-500/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Upload" className="h-40 w-full object-cover" />
              {photoName && (
                <p className="px-3 py-2 text-xs font-medium text-emerald-600">{photoName}</p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm font-bold text-emerald-600"
          >
            <Camera className="h-4 w-4" />
            {photoPreview ? "Change photo" : "Upload photo"}
          </button>
        </section>

        <button
          type="submit"
          disabled={!query.trim()}
          className="fixed bottom-20 left-4 right-4 mx-auto max-w-lg rounded-2xl bg-[#006432] py-4 text-center text-sm font-black text-white shadow-lg disabled:opacity-40 md:bottom-8"
        >
          Submit query
        </button>
      </form>

      <BottomNav />
    </div>
  );
}
