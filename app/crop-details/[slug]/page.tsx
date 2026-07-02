"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, AlertCircle, ChevronRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import CropTimeline from "@/components/crop/CropTimeline";
import ExpertAdviceCard from "@/components/query/ExpertAdviceCard";
import { getCropDashboard, myCrops } from "@/data/crop-dashboard";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CropDetailsPage({ params }: Props) {
  const { slug } = use(params);
  const crop = getCropDashboard(slug);

  if (!crop) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <PageHeader title="" backHref="/" />

      {/* Crop selector strip */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3 overflow-x-auto scrollbar-hide">
          {myCrops.map((c) => (
            <Link
              key={c.slug}
              href={`/crop-details/${c.slug}`}
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-xl transition-all ${
                c.slug === slug
                  ? "bg-white shadow-md ring-2 ring-[#006432]"
                  : "bg-gray-100 hover:bg-gray-50"
              }`}
            >
              {c.emoji}
            </Link>
          ))}
          <Link
            href="/crops"
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#006432] text-white transition-transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-6 px-4 py-5">
        <h1 className="text-2xl font-extrabold text-gray-900">{crop.name}</h1>

        {/* Growth stages */}
        <section>
          <h2 className="mb-3 text-base font-bold text-gray-900">Crop growth stages.</h2>
          <CropTimeline stages={crop.growthStages} />
        </section>

        {/* Pests and diseases */}
        <section>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Pests and diseases.</h2>
            <Link href={`/crops/${slug}`} className="text-sm font-semibold text-[#2D8A5B]">
              View all
            </Link>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            Showing results for <span className="font-semibold">{crop.currentStage}</span> stage
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {crop.pestsAndDiseases.map((pest) => (
              <div key={pest.id} className="flex w-28 flex-shrink-0 flex-col">
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pest.image}
                    alt={pest.name}
                    className="h-24 w-full object-cover"
                  />
                </div>
                <p className="mt-2 text-center text-xs font-semibold text-gray-800">{pest.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Videos placeholder */}
        <section>
          <h2 className="mb-3 text-base font-bold text-gray-900">Videos.</h2>
          <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
              <AlertCircle className="h-7 w-7 text-orange-500" />
            </div>
            <p className="mt-4 text-base font-bold text-gray-900">No data available.</p>
            <p className="mt-1 text-sm text-gray-500">
              Currently there is no data to show on this page.
            </p>
          </div>
        </section>

        {/* Expert advice */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Expert advice.</h2>
            <Link href="/community" className="text-sm font-semibold text-[#2D8A5B]">
              View all
            </Link>
          </div>
          {crop.expertAdvice.length > 0 ? (
            <div className="space-y-3">
              {crop.expertAdvice.map((advice) => (
                <ExpertAdviceCard key={advice.id} advice={advice} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
              <p className="text-sm text-gray-500">No expert advice yet for this crop.</p>
            </div>
          )}
          <Link
            href="/ask-query"
            className="mt-3 flex w-full items-center justify-center rounded-xl border-2 border-[#2D8A5B] py-3 text-sm font-bold text-[#2D8A5B] transition-colors hover:bg-emerald-50"
          >
            Ask query
          </Link>
        </section>

        {/* Best practices */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Best practices.</h2>
            <Link href={`/crops/${slug}`} className="text-sm font-semibold text-[#2D8A5B]">
              View all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {crop.bestPractices.map((practice) => (
              <div
                key={practice.id}
                className="relative h-32 w-40 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-200 shadow-sm"
              >
                {practice.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={practice.image}
                      alt={practice.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-xs font-bold text-white">{practice.title}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 bg-gray-100">
                    <span className="text-3xl">{practice.emoji}</span>
                    <p className="px-2 text-center text-xs font-semibold text-gray-700">
                      {practice.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
