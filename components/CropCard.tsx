"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cropCatalog } from "@/data/crop-catalog";
import { fadeUp } from "@/lib/motion/variants";
import type { Crop } from "@/types/crop";

const EMOJI_BY_SLUG = Object.fromEntries(cropCatalog.map((c) => [c.slug, c.emoji]));

/** Category accent — corner dot & subtle border tint only, no text */
const CATEGORY_ACCENT: Record<Crop["category"], string> = {
  Cereals: "#f59e0b",
  Vegetables: "#10b981",
  Pulses: "#14b8a6",
  Millets: "#84cc16",
  "Cash-Crops": "#f472b6",
};

interface CropCardProps {
  crop: Crop;
  index: number;
}

export default function CropCard({ crop, index }: CropCardProps) {
  const emoji = EMOJI_BY_SLUG[crop.slug] ?? "🌱";
  const accent = CATEGORY_ACCENT[crop.category];

  return (
    <motion.div
      layout
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      custom={index}
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >      <Link href={`/crops/${crop.slug}`} className="group block h-full">
        <article
          className="relative flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-[#1f2937] bg-[#111827] p-4 transition-[box-shadow,border-color] duration-200 ease-out group-hover:border-[#10b981]/50 group-hover:shadow-[0_8px_32px_rgba(16,185,129,0.15),0_0_0_1px_rgba(16,185,129,0.2)]"
          style={{
            boxShadow: `inset 0 0 0 1px ${accent}12`,
          }}
        >
          {/* Category accent — corner dot */}
          <span
            className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: accent, color: accent }}
            aria-hidden
          />

          {/* Subtle category glow on hover */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${accent}18, transparent 65%)`,
            }}
            aria-hidden
          />

          {/* Icon with shimmer */}
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full opacity-40 blur-md transition-opacity duration-200 group-hover:opacity-70"
              style={{ background: `linear-gradient(135deg, ${accent}40, transparent)` }}
              aria-hidden
            />
            <motion.span
              className="relative text-[2rem] leading-none select-none"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
            >
              {emoji}
            </motion.span>
          </div>

          {/* Name only */}
          <h3 className="px-2 text-center text-[18px] font-semibold leading-snug tracking-tight text-[#f1f5f9] transition-colors duration-200 group-hover:text-[#10b981] sm:text-[19px]">
            {crop.name}
          </h3>
        </article>
      </Link>
    </motion.div>
  );
}
