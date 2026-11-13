"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PlantPart } from "@/lib/crops/plantAnatomy";

const PLATE: Record<string, string> = {
  wheat: "/images/xray/wheat.jpg",
  paddy: "/images/xray/paddy.jpg",
  banana: "/images/xray/banana.jpg",
  potato: "/images/xray/potato.jpg",
  tomato: "/images/xray/tomato.jpg",
};

/** Soil line as a percent of the plate, matched to each studio photo. */
const SOIL: Record<string, number> = {
  wheat: 67,
  paddy: 66,
  banana: 70,
  potato: 58,
  tomato: 63,
};

type Props = {
  cropId: string;
  selected: PlantPart | null;
  focus: { x: number; y: number } | null;
  xray: boolean;
  reducedMotion: boolean;
};

export default function CropPlantPlate({ cropId, selected, focus, xray, reducedMotion }: Props) {
  const src = PLATE[cropId] ?? "/images/xray/generic.jpg";
  const soil = SOIL[cropId] ?? 60;

  return (
    <div className="absolute inset-0" aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        priority
        quality={75}
        sizes="(max-width: 512px) 100vw, 480px"
        className="object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.5)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/12 to-transparent" />
      {xray ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#02110c]/75 via-[#02110c]/45 to-transparent"
          style={{ height: `${soil}%` }}
        />
      ) : null}
      {xray ? (
        <div
          className="pointer-events-none absolute inset-x-8 h-px bg-amber-100/80 shadow-[0_0_18px_rgba(253,230,138,0.85)]"
          style={{ top: `${soil}%` }}
        />
      ) : null}
      {xray && !reducedMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-amber-100/20 to-transparent"
          initial={{ top: "0%" }}
          animate={{ top: ["-8%", `${soil - 4}%`] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        />
      ) : null}
      {selected && focus ? (
        <div
          className="pointer-events-none absolute h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/25 blur-2xl"
          style={{ left: `${focus.x}%`, top: `${focus.y}%` }}
        />
      ) : null}
    </div>
  );
}
