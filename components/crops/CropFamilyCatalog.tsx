"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  getCropFamilies,
  listFamilyCrops,
  type CropFamilyId,
} from "@/data/crop-families";
import { getCatalogCrop } from "@/data/crop-catalog";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface Props {
  /** Optional search query from parent listing */
  query?: string;
}

export default function CropFamilyCatalog({ query = "" }: Props) {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const families = getCropFamilies();
  const [familyId, setFamilyId] = useState<CropFamilyId | "all">("all");

  const cards = useMemo(() => {
    const slugs =
      familyId === "all"
        ? families.flatMap((f) => f.cropSlugs)
        : listFamilyCrops(familyId);
    const q = query.trim().toLowerCase();
    return slugs
      .map((slug) => {
        const cat = getCatalogCrop(slug);
        if (!cat) return null;
        const nameHi = cat.nameHi ?? cat.name;
        if (
          q &&
          !cat.name.toLowerCase().includes(q) &&
          !nameHi.toLowerCase().includes(q) &&
          !slug.includes(q)
        ) {
          return null;
        }
        return {
          slug,
          name: cat.name,
          nameHi,
          emoji: cat.emoji,
          image: resolveCropImage({ slug: cat.slug, name: cat.name }),
          family: families.find((f) => f.cropSlugs.includes(slug)),
        };
      })
      .filter(Boolean) as {
      slug: string;
      name: string;
      nameHi: string;
      emoji: string;
      image: string;
      family: (typeof families)[number] | undefined;
    }[];
  }, [families, familyId, query]);

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setFamilyId("all")}
          className={`shrink-0 rounded-md px-2.5 py-1.5 text-[10px] font-bold transition active:scale-95 ${
            familyId === "all"
              ? "bg-[var(--av-accent)] text-white"
              : "text-[var(--av-text-muted)] ring-1 ring-[var(--av-border)]"
          }`}
        >
          {isHi ? "सभी परिवार" : "All families"}
        </button>
        {families.map((f) => {
          const active = familyId === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFamilyId(f.id)}
              title={f.shortHi}
              className={`shrink-0 rounded-md px-2.5 py-1.5 text-[10px] font-bold transition active:scale-95 ${
                active
                  ? "bg-[var(--av-accent)] text-white"
                  : "text-[var(--av-text-muted)] ring-1 ring-[var(--av-border)]"
              }`}
            >
              {isHi ? f.nameHi : f.nameEn}
            </button>
          );
        })}
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
        {isHi ? `${cards.length} फसल` : `${cards.length} crops`}
        {familyId !== "all" && (
          <span className="ml-1.5 font-medium normal-case tracking-normal text-[var(--av-text-secondary)]">
            · {families.find((f) => f.id === familyId)?.shortHi}
          </span>
        )}
      </p>

      <motion.div
        layout
        className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {cards.map((crop, index) => (
            <motion.div
              key={crop.slug}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: Math.min(index * 0.02, 0.2) }}
            >
              <Link
                href={`/crops/${crop.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] transition active:scale-[0.98]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--av-surface-inset)]">
                  <Image
                    src={crop.image}
                    alt={crop.nameHi}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <span className="absolute left-2 top-2 rounded-md bg-black/55 px-1.5 py-0.5 text-sm backdrop-blur-sm">
                    {crop.emoji}
                  </span>
                </div>
                <div className="px-3 py-2.5">
                  <p className="truncate text-[15px] font-bold text-[var(--av-text-primary)]">
                    {isHi ? crop.nameHi : crop.name}
                  </p>
                  <p className="truncate text-[11px] text-[var(--av-text-muted)]">
                    {isHi ? crop.name : crop.nameHi}
                    {crop.family ? ` · ${isHi ? crop.family.nameHi : crop.family.nameEn}` : ""}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {cards.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-14 text-center">
          <p className="text-base font-bold text-[var(--av-text-primary)]">
            {isHi ? "कोई फसल नहीं मिली" : "No crops found"}
          </p>
        </div>
      )}
    </div>
  );
}
