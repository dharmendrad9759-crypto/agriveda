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
import { cropCatalog } from "@/data/crop-catalog";

const MAX_CHARS = 256;

export default function AskQueryPage() {
  const { crops, hydrated } = useMyCrops();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableCrops = hydrated
    ? crops.map((c) => ({
        id: c.slug,
        name: c.name,
        emoji: c.emoji,
      }))
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
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="agriveda-page flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <PageBackground />
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 shadow-[0_0_24px_rgba(0,255,136,0.3)]">
            <Check className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="mt-4 text-xl font-black text-white">Query transmitted!</h2>
          <p className="mt-2 text-sm text-slate-400">
            Agriveda Expert will analyze your query and respond soon.
          </p>
          <Link
            href="/community"
            className="mt-6 inline-block rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-8 py-3 text-sm font-black text-emerald-400"
          >
            View community feed
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
            <GlassCard className="p-4 text-center text-sm text-slate-400">
              Add crops from home screen first.
            </GlassCard>
          )}
          <Link
            href="/"
            className="mt-2 flex items-center justify-end gap-0.5 text-sm font-bold text-emerald-400"
          >
            Manage my crops <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        <section>
          <SectionHeading title="Write your query." />
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Write the issue you're facing with the crops."
              rows={5}
              className="w-full resize-none rounded-2xl border border-emerald-500/20 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none backdrop-blur-sm transition-all focus:border-emerald-400/50 focus:shadow-[0_0_16px_rgba(0,255,136,0.1)]"
            />
            <span className="absolute bottom-3 right-3 text-[11px] text-slate-500 tabular-nums">
              {query.length}/{MAX_CHARS}
            </span>
          </div>
          <div className="mt-3">
            <VoiceRecorderMock />
          </div>
        </section>

        <section>
          <SectionHeading title="Upload guide." />
          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden rounded-2xl border border-red-500/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&h=200&fit=crop"
                alt="Incorrect photo example"
                className="h-28 w-full object-cover opacity-60 blur-[1px]"
              />
              <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                <X className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=200&fit=crop"
                alt="Correct photo example"
                className="h-28 w-full object-cover"
              />
              <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(0,255,136,0.6)]">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Take clear photo of the damaged crop from a closer distance.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          {photoPreview && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-emerald-500/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Uploaded crop damage" className="h-40 w-full object-cover" />
              {photoName && (
                <p className="px-3 py-2 text-xs font-medium text-emerald-400">{photoName}</p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-bold transition-all ${
              photoPreview
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-emerald-500/20 bg-black/30 text-emerald-400 hover:border-emerald-400/40 hover:shadow-[0_0_16px_rgba(0,255,136,0.1)]"
            }`}
          >
            <Camera className="h-4 w-4" />
            {photoPreview ? "Change photo" : "Upload photo"}
          </button>
        </section>

        <button
          type="submit"
          disabled={!query.trim()}
          className="fixed bottom-20 left-4 right-4 mx-auto max-w-lg rounded-2xl border border-emerald-500/40 bg-emerald-500/20 py-4 text-center text-sm font-black text-emerald-400 shadow-[0_0_24px_rgba(0,255,136,0.15)] transition-all hover:shadow-[0_0_32px_rgba(0,255,136,0.25)] disabled:cursor-not-allowed disabled:opacity-40 md:bottom-8"
        >
          Submit query
        </button>
      </form>

      <BottomNav />
    </div>
  );
}
