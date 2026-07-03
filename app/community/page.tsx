"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import QueryCard from "@/components/query/QueryCard";
import { communityQueries, filterCrops } from "@/data/queries";
import { useQueryHistory } from "@/hooks/useQueryHistory";

type Tab = "all" | "mine";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const { queries: userQueries, hydrated } = useQueryHistory();

  const allQueries = hydrated
    ? [...userQueries, ...communityQueries.filter((q) => !userQueries.some((u) => u.id === q.id))]
    : communityQueries;

  const filteredQueries = allQueries.filter((q) => {
    if (activeTab === "mine" && !q.isMine) return false;
    if (activeFilter && !q.crop.toLowerCase().includes(activeFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 dark:bg-gray-950">
      <PageHeader title="Krishi Expert" backHref="/" />

      <div className="border-b border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
        <div className="mx-auto flex max-w-lg">
          {(["all", "mine"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[#2D8A5B] text-[#006432]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "all" ? "All queries" : "My queries"}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-gray-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-gray-900">
        <div className="mx-auto flex max-w-lg gap-2 overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              showFilters
                ? "border-[#006432] bg-emerald-50 text-[#006432]"
                : "border-gray-200 bg-white text-gray-700"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </button>
          {showFilters &&
            filterCrops.map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() => setActiveFilter(activeFilter === crop ? null : crop)}
                className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeFilter === crop
                    ? "border-[#006432] bg-emerald-50 text-[#006432]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-emerald-200"
                }`}
              >
                {crop}
              </button>
            ))}
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
        {filteredQueries.length > 0 ? (
          filteredQueries.map((query) => <QueryCard key={query.id} query={query} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center dark:border-white/10 dark:bg-gray-900">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No queries found</p>
            <p className="mt-1 text-xs text-gray-500">Ask a new query to get expert help.</p>
            <Link
              href="/ask-query"
              className="mt-4 inline-block rounded-xl bg-[#006432] px-6 py-2 text-sm font-bold text-white"
            >
              Ask query
            </Link>
          </div>
        )}
      </div>

      <Link
        href="/ask-query"
        className="fixed bottom-20 right-4 z-50 flex items-center gap-1.5 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 md:bottom-8"
      >
        <Plus className="h-4 w-4" />
        Ask query
      </Link>

      <BottomNav />
    </div>
  );
}
