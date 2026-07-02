"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { CropManagementProfile } from "@/types/crop-management";
import CropManagementSowingTime from "@/components/crop-management/CropManagementSowingTime";
import CropManagementFertilizerSchedule from "@/components/crop-management/CropManagementFertilizerSchedule";
import CropManagementIrrigation from "@/components/crop-management/CropManagementIrrigation";
import { CropManagementCropProtection } from "@/components/crop-management/CropManagementPestManagement";
import CropManagementNutrientDeficiencies from "@/components/crop-management/CropManagementNutrientDeficiencies";
import CropManagementHarvesting from "@/components/crop-management/CropManagementHarvesting";
import CropManagementMarketInformation from "@/components/crop-management/CropManagementMarketInformation";

const TABS = [
  { id: "sowing", label: "Sowing" },
  { id: "fertilizer", label: "Fertilizer" },
  { id: "irrigation", label: "Irrigation" },
  { id: "protection", label: "Protection" },
  { id: "nutrition", label: "Nutrition" },
  { id: "harvest", label: "Harvest" },
  { id: "market", label: "Market" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface CropIntelTabsProps {
  profile: CropManagementProfile;
}

export default function CropIntelTabs({ profile }: CropIntelTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("sowing");

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-[0_0_16px_rgba(0,255,136,0.3)]"
                  : "border border-white/10 bg-black/30 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#030712] to-transparent" />
      </div>

      <div className="animate-fade-in">
        {activeTab === "sowing" && <CropManagementSowingTime profile={profile} />}
        {activeTab === "fertilizer" && <CropManagementFertilizerSchedule profile={profile} />}
        {activeTab === "irrigation" && <CropManagementIrrigation profile={profile} />}
        {activeTab === "protection" && <CropManagementCropProtection profile={profile} />}
        {activeTab === "nutrition" && <CropManagementNutrientDeficiencies profile={profile} />}
        {activeTab === "harvest" && <CropManagementHarvesting profile={profile} />}
        {activeTab === "market" && <CropManagementMarketInformation profile={profile} />}
      </div>
    </div>
  );
}
