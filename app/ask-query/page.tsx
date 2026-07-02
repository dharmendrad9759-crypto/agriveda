"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Check, X, ChevronRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import CropSelector from "@/components/query/CropSelector";
import VoiceRecorderMock from "@/components/query/VoiceRecorderMock";
import { queryCrops } from "@/data/queries";

const MAX_CHARS = 256;

export default function AskQueryPage() {
  const [selectedCrop, setSelectedCrop] = useState(queryCrops[0].id);
  const [query, setQuery] = useState("");
  const [photoAdded, setPhotoAdded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-8 w-8 text-[#006432]" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">Query submitted!</h2>
        <p className="mt-2 text-sm text-gray-500">
          Our Agriveda Expert will review your query and respond soon.
        </p>
        <Link
          href="/community"
          className="mt-6 rounded-xl bg-[#88B498] px-8 py-3 text-sm font-bold text-white"
        >
          View community feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28">
      <PageHeader title="Ask query" backHref="/" />

      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-6 px-4 py-5">
        {/* Crop selection */}
        <section>
          <h2 className="mb-3 text-base font-bold text-gray-900">Select crop for query.</h2>
          <CropSelector
            crops={queryCrops}
            selectedId={selectedCrop}
            onSelect={setSelectedCrop}
          />
          <Link
            href="/crops"
            className="mt-2 flex items-center justify-end gap-0.5 text-sm font-semibold text-[#2D8A5B]"
          >
            Select another crop <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Query text */}
        <section>
          <h2 className="mb-3 text-base font-bold text-gray-900">Write your query.</h2>
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Write the issue you're facing with the crops."
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-[#2D8A5B] focus:ring-2 focus:ring-emerald-100"
            />
            <span className="absolute bottom-3 right-3 text-[11px] text-gray-400 tabular-nums">
              {query.length}/{MAX_CHARS}
            </span>
          </div>
          <div className="mt-3">
            <VoiceRecorderMock />
          </div>
        </section>

        {/* Upload guide */}
        <section>
          <h2 className="mb-3 text-base font-bold text-gray-900">Upload guide.</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden rounded-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&h=200&fit=crop"
                alt="Incorrect photo example"
                className="h-28 w-full object-cover opacity-80 blur-[1px]"
              />
              <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                <X className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=200&fit=crop"
                alt="Correct photo example"
                className="h-28 w-full object-cover"
              />
              <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#006432]">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Take clear photo of the damaged crop from a closer distance.
          </p>
          <button
            type="button"
            onClick={() => setPhotoAdded(!photoAdded)}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all ${
              photoAdded
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-gray-200 bg-white text-[#2D8A5B] hover:border-emerald-200"
            }`}
          >
            <Camera className="h-4 w-4" />
            {photoAdded ? "Photo added — tap to change" : "Upload photo"}
          </button>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={!query.trim()}
          className="fixed bottom-16 left-4 right-4 mx-auto max-w-lg rounded-xl bg-[#88B498] py-4 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-[#7aa88a] disabled:cursor-not-allowed disabled:opacity-50 md:bottom-8"
        >
          Submit query
        </button>
      </form>

      <BottomNav />
    </div>
  );
}
