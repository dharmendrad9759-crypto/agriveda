"use client";

import { useRef } from "react";
import { Camera, ImageIcon } from "lucide-react";
import { readStorage, writeStorage } from "@/lib/storage";

interface FarmerPhotoUploadProps {
  storageKey: string;
  currentUrl: string | null;
  onUpload: (url: string) => void;
  compact?: boolean;
}

export default function FarmerPhotoUpload({
  storageKey,
  currentUrl,
  onUpload,
  compact = false,
}: FarmerPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      writeStorage(storageKey, dataUrl);
      onUpload(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const stored = typeof window !== "undefined" ? readStorage<string | null>(storageKey, null) : null;
  const displayUrl = currentUrl ?? stored;

  if (compact) {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 py-2 text-[11px] font-bold text-emerald-600 transition hover:bg-emerald-500/10"
        >
          <Camera className="h-3.5 w-3.5" />
          Upload your photo
        </button>
      </>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleChange}
      />
      {displayUrl ? (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayUrl} alt="Your field photo" className="h-48 w-full rounded-xl object-cover" />
          <p className="text-center text-xs font-semibold text-emerald-600">Your uploaded field photo</p>
        </div>
      ) : (
        <div className="flex flex-col items-center py-6 text-center">
          <ImageIcon className="h-10 w-10 text-emerald-400/60" />
          <p className="mt-2 text-sm font-bold theme-text-primary">अपनी खेत की photo upload करें</p>
          <p className="mt-1 text-xs theme-text-muted">
            सही diagnosis के लिए पत्ती/फल की साफ़ close-up photo लें
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#006432] py-3 text-sm font-bold text-white"
      >
        <Camera className="h-4 w-4" />
        {displayUrl ? "दूसरी photo upload करें" : "Upload photo for diagnosis"}
      </button>
    </div>
  );
}
