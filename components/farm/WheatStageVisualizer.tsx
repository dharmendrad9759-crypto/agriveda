"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CropStageDefinition } from "@/lib/farm/types";
import {
  Sprout,
  Droplets,
  Sun,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";

interface WheatStageVisualizerProps {
  currentStage: CropStageDefinition;
  selectedStage: CropStageDefinition;
  das: number;
  totalDays?: number;
  onSelectStage?: (stageId: string) => void;
  className?: string;
}

export default function WheatStageVisualizer({
  currentStage,
  selectedStage,
  das,
  totalDays = 135,
  onSelectStage,
  className = "",
}: WheatStageVisualizerProps) {
  // 360-degree completion angle calculation
  const progressPercent = Math.min(100, Math.max(0, Math.round((das / totalDays) * 100)));
  const strokeDashoffset = 100 - progressPercent;

  // Botanical Plant Illustration Generator based on Zadoks Stage
  const renderBotanicalPlant = useMemo(() => {
    const stageId = selectedStage.stageId;

    switch (stageId) {
      case "germination":
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-lg">
            {/* Soil Cross Section */}
            <rect x="0" y="160" width="200" height="80" fill="#3E2723" rx="4" opacity="0.85" />
            <line x1="0" y1="160" x2="200" y2="160" stroke="#8D6E63" strokeWidth="3" strokeDasharray="4 2" />
            <text x="10" y="180" fill="#D7CCC8" fontSize="9" fontWeight="bold">मिट्टी की सतह (Soil Surface)</text>

            {/* Seed */}
            <ellipse cx="100" cy="190" rx="9" ry="5" fill="#C6A66B" stroke="#8D6E63" strokeWidth="1.5" />
            {/* Primary Radicle Root */}
            <motion.path
              d="M 100 195 Q 100 220 95 235"
              fill="none"
              stroke="#FFFDD0"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            <path d="M 98 210 Q 88 220 82 228" fill="none" stroke="#FFFDD0" strokeWidth="1.5" />
            <path d="M 101 218 Q 112 225 118 232" fill="none" stroke="#FFFDD0" strokeWidth="1.5" />

            {/* Coleoptile Shoot */}
            <motion.path
              d="M 100 185 Q 100 150 102 120"
              fill="none"
              stroke="#7CB342"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2 }}
            />
            {/* Emerging Leaf tip */}
            <motion.path
              d="M 102 120 Q 112 105 120 100"
              fill="none"
              stroke="#8BC34A"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />

            {/* Callout */}
            <circle cx="100" cy="188" r="4" fill="#F59E0B" className="animate-ping" />
            <rect x="115" y="172" width="75" height="20" rx="4" fill="#064E3B" opacity="0.9" />
            <text x="120" y="185" fill="#E6FFFA" fontSize="8" fontWeight="bold">अंकुरित बीज (Seed)</text>
          </svg>
        );

      case "cri":
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
            {/* Soil */}
            <rect x="0" y="160" width="200" height="80" fill="#3E2723" rx="4" opacity="0.85" />
            <line x1="0" y1="160" x2="200" y2="160" stroke="#8D6E63" strokeWidth="2.5" strokeDasharray="4 2" />

            {/* Old Seed */}
            <ellipse cx="100" cy="205" rx="7" ry="4" fill="#A1887F" />
            <path d="M 100 209 Q 95 235 90 238" fill="none" stroke="#E0E0E0" strokeWidth="1.5" />

            {/* Sub-crown internode */}
            <line x1="100" y1="205" x2="100" y2="165" stroke="#8BC34A" strokeWidth="2.5" />

            {/* CROWN ROOT INITIATION ZONE (GLOWING GOLD/CYAN) */}
            <g className="animate-pulse">
              <circle cx="100" cy="165" r="7" fill="#F59E0B" opacity="0.4" />
              <circle cx="100" cy="165" r="4" fill="#F59E0B" />
              {/* Crown Roots sprouting vigorously */}
              <motion.path
                d="M 100 165 Q 80 185 70 215"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <motion.path
                d="M 100 165 Q 120 185 130 215"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <motion.path
                d="M 100 165 Q 105 190 108 230"
                fill="none"
                stroke="#FDE68A"
                strokeWidth="2"
              />
              <motion.path
                d="M 100 165 Q 92 190 88 230"
                fill="none"
                stroke="#FDE68A"
                strokeWidth="2"
              />
            </g>

            {/* 3-4 Vegetative Leaves */}
            <path d="M 100 165 Q 100 120 100 80" fill="none" stroke="#4CAF50" strokeWidth="3.5" />
            <path d="M 100 140 Q 60 110 45 105" fill="none" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 100 125 Q 140 95 155 90" fill="none" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 100 100 Q 80 60 70 50" fill="none" stroke="#81C784" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 100 90 Q 120 50 130 40" fill="none" stroke="#81C784" strokeWidth="2.5" strokeLinecap="round" />

            {/* Vital CRI Callout Badge */}
            <g transform="translate(10, 195)">
              <rect width="80" height="28" rx="6" fill="#B45309" stroke="#FBBF24" strokeWidth="1.5" />
              <text x="6" y="12" fill="#FEF3C7" fontSize="8" fontWeight="bold">🌟 ताज जड़ें (CRI)</text>
              <text x="6" y="22" fill="#FFFFFF" fontSize="7">पहला पानी आवश्यक</text>
            </g>
          </svg>
        );

      case "tillering":
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
            {/* Soil */}
            <rect x="0" y="170" width="200" height="70" fill="#3E2723" rx="4" opacity="0.85" />
            {/* Dense Roots */}
            <g stroke="#FDE68A" strokeWidth="1.8" fill="none">
              <path d="M 100 170 Q 75 195 65 235" />
              <path d="M 100 170 Q 85 200 80 238" />
              <path d="M 100 170 Q 100 205 102 240" />
              <path d="M 100 170 Q 115 200 120 238" />
              <path d="M 100 170 Q 125 195 135 235" />
            </g>

            {/* Multiple Vigorous Tillers */}
            {/* Central stem */}
            <path d="M 100 170 Q 100 110 100 50" fill="none" stroke="#2E7D32" strokeWidth="4" />
            {/* Left Tiller 1 */}
            <path d="M 98 170 Q 70 130 50 85" fill="none" stroke="#388E3C" strokeWidth="3.2" />
            <path d="M 85 145 Q 50 130 30 135" fill="none" stroke="#4CAF50" strokeWidth="2.5" />
            {/* Left Tiller 2 */}
            <path d="M 96 170 Q 55 150 35 120" fill="none" stroke="#43A047" strokeWidth="2.8" />
            {/* Right Tiller 1 */}
            <path d="M 102 170 Q 130 130 150 85" fill="none" stroke="#388E3C" strokeWidth="3.2" />
            <path d="M 115 145 Q 150 130 170 135" fill="none" stroke="#4CAF50" strokeWidth="2.5" />
            {/* Right Tiller 2 */}
            <path d="M 104 170 Q 145 150 165 120" fill="none" stroke="#43A047" strokeWidth="2.8" />

            {/* Lush Leaf tips */}
            <path d="M 100 100 Q 80 60 70 40" fill="none" stroke="#66BB6A" strokeWidth="2.5" />
            <path d="M 100 90 Q 120 60 130 40" fill="none" stroke="#66BB6A" strokeWidth="2.5" />
            <path d="M 100 70 Q 100 35 98 25" fill="none" stroke="#81C784" strokeWidth="2.5" />

            {/* Callout */}
            <g transform="translate(105, 18)">
              <rect width="85" height="26" rx="6" fill="#14532D" stroke="#4ADE80" strokeWidth="1" />
              <text x="6" y="11" fill="#DCFCE7" fontSize="8" fontWeight="bold">🌿 4-6 कल्ले (Tillers)</text>
              <text x="6" y="21" fill="#86EFAC" fontSize="7">यूरिया टॉपड्रेसिंग समय</text>
            </g>
          </svg>
        );

      case "stem_elongation":
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
            {/* Soil */}
            <rect x="0" y="195" width="200" height="45" fill="#3E2723" rx="4" opacity="0.85" />
            {/* Tall Sturdy Stem with Nodes (गांठें) */}
            <path d="M 100 195 L 100 30" fill="none" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" />

            {/* Nodes (Joints) */}
            <circle cx="100" cy="165" r="5" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="100" cy="125" r="4.5" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="100" cy="85" r="4" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />

            {/* Leaves emanating from nodes */}
            <path d="M 100 165 Q 40 140 25 155" fill="none" stroke="#43A047" strokeWidth="3" />
            <path d="M 100 125 Q 160 100 175 115" fill="none" stroke="#43A047" strokeWidth="3" />
            <path d="M 100 85 Q 50 65 35 80" fill="none" stroke="#66BB6A" strokeWidth="2.8" />
            <path d="M 100 55 Q 150 40 165 50" fill="none" stroke="#81C784" strokeWidth="2.5" />

            {/* Node Callout */}
            <line x1="105" y1="125" x2="140" y2="125" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" />
            <g transform="translate(142, 115)">
              <rect width="52" height="20" rx="4" fill="#78350F" />
              <text x="4" y="13" fill="#FEF3C7" fontSize="7.5" fontWeight="bold">गांठ (Node 2)</text>
            </g>
          </svg>
        );

      case "booting":
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
            {/* Soil */}
            <rect x="0" y="200" width="200" height="40" fill="#3E2723" rx="4" opacity="0.85" />
            <path d="M 100 200 L 100 45" fill="none" stroke="#2E7D32" strokeWidth="5" />

            {/* Swollen Boot Sheath containing Ear */}
            <motion.ellipse
              cx="100"
              cy="65"
              rx="9"
              ry="25"
              fill="#558B2F"
              stroke="#F59E0B"
              strokeWidth="2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            />
            <line x1="100" y1="42" x2="100" y2="88" stroke="#7CB342" strokeWidth="2" />

            {/* Prominent FLAG LEAF (झंडा पत्ती) */}
            <motion.path
              d="M 100 85 Q 150 60 175 80"
              fill="none"
              stroke="#33691E"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path d="M 100 130 Q 40 110 20 135" fill="none" stroke="#43A047" strokeWidth="3" />
            <path d="M 100 165 Q 160 150 175 170" fill="none" stroke="#43A047" strokeWidth="3" />

            {/* Flag Leaf & Boot Callouts */}
            <g transform="translate(120, 20)">
              <rect width="75" height="28" rx="6" fill="#1B4D3E" stroke="#86EFAC" strokeWidth="1" />
              <text x="5" y="12" fill="#86EFAC" fontSize="8" fontWeight="bold">🚩 झंडा पत्ती (Flag)</text>
              <text x="5" y="22" fill="#FFFFFF" fontSize="7">50% दाना पोषण इसी से</text>
            </g>
            <circle cx="100" cy="65" r="4" fill="#F59E0B" className="animate-ping" />
          </svg>
        );

      case "heading":
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
            {/* Soil */}
            <rect x="0" y="205" width="200" height="35" fill="#3E2723" rx="4" opacity="0.85" />
            <path d="M 100 205 L 100 80" fill="none" stroke="#2E7D32" strokeWidth="4.5" />

            {/* Emerged Green Wheat Ear (Spike) */}
            <g transform="translate(100, 45)">
              {/* Spikelets */}
              {[-30, -20, -10, 0, 10, 20].map((y, i) => (
                <g key={i}>
                  <ellipse cx="-5" cy={y} rx="5" ry="7" fill="#689F38" transform="rotate(-20)" />
                  <ellipse cx="5" cy={y - 4} rx="5" ry="7" fill="#689F38" transform="rotate(20)" />
                  {/* Long Awns */}
                  <line x1="-8" y1={y - 2} x2="-22" y2={y - 18} stroke="#8BC34A" strokeWidth="1.2" />
                  <line x1="8" y1={y - 6} x2="22" y2={y - 22} stroke="#8BC34A" strokeWidth="1.2" />
                </g>
              ))}
              {/* Apical spikelet and long awns */}
              <ellipse cx="0" cy="-38" rx="4" ry="6" fill="#7CB342" />
              <line x1="0" y1="-44" x2="0" y2="-70" stroke="#8BC34A" strokeWidth="1.5" />
              <line x1="-3" y1="-42" x2="-10" y2="-68" stroke="#8BC34A" strokeWidth="1.2" />
              <line x1="3" y1="-42" x2="10" y2="-68" stroke="#8BC34A" strokeWidth="1.2" />
            </g>

            {/* Flag leaf arching gracefully */}
            <path d="M 100 95 Q 160 85 175 110" fill="none" stroke="#33691E" strokeWidth="4" />
            <path d="M 100 140 Q 40 130 25 155" fill="none" stroke="#388E3C" strokeWidth="3" />

            {/* Callout */}
            <g transform="translate(115, 15)">
              <rect width="80" height="26" rx="6" fill="#14532D" stroke="#4ADE80" strokeWidth="1" />
              <text x="6" y="11" fill="#DCFCE7" fontSize="8" fontWeight="bold">🌾 हरी बालियां (Heading)</text>
              <text x="6" y="21" fill="#86EFAC" fontSize="7">हल्की सिंचाई (चौथी)</text>
            </g>
          </svg>
        );

      case "flowering":
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
            {/* Soil */}
            <rect x="0" y="205" width="200" height="35" fill="#3E2723" rx="4" opacity="0.85" />
            <path d="M 100 205 L 100 80" fill="none" stroke="#33691E" strokeWidth="4.5" />

            {/* Wheat Ear with Yellow Anthers (Pollen) */}
            <g transform="translate(100, 45)">
              {[-30, -20, -10, 0, 10, 20].map((y, i) => (
                <g key={i}>
                  <ellipse cx="-5" cy={y} rx="5" ry="7" fill="#7CB342" transform="rotate(-20)" />
                  <ellipse cx="5" cy={y - 4} rx="5" ry="7" fill="#7CB342" transform="rotate(20)" />
                  {/* Dangling Yellow Anthers */}
                  <line x1="-9" y1={y} x2="-14" y2={y + 6} stroke="#FDE047" strokeWidth="1.5" />
                  <circle cx="-14" cy={y + 6} r="2" fill="#FACC15" className="animate-pulse" />
                  <line x1="9" y1={y - 4} x2="14" y2={y + 2} stroke="#FDE047" strokeWidth="1.5" />
                  <circle cx="14" cy={y + 2} r="2" fill="#FACC15" className="animate-pulse" />
                  {/* Awns */}
                  <line x1="-8" y1={y - 2} x2="-22" y2={y - 18} stroke="#A3E635" strokeWidth="1.2" />
                  <line x1="8" y1={y - 6} x2="22" y2={y - 22} stroke="#A3E635" strokeWidth="1.2" />
                </g>
              ))}
              <ellipse cx="0" cy="-38" rx="4" ry="6" fill="#84CC16" />
              <line x1="0" y1="-44" x2="0" y2="-70" stroke="#A3E635" strokeWidth="1.5" />
            </g>

            {/* Pollen Dust Glow */}
            <circle cx="85" cy="50" r="1.5" fill="#FEF08A" opacity="0.8" />
            <circle cx="115" cy="40" r="1.5" fill="#FEF08A" opacity="0.8" />
            <circle cx="95" cy="25" r="1.5" fill="#FEF08A" opacity="0.8" />

            {/* Callout */}
            <g transform="translate(110, 15)">
              <rect width="85" height="26" rx="6" fill="#713F12" stroke="#FACC15" strokeWidth="1" />
              <text x="6" y="11" fill="#FEF08A" fontSize="8" fontWeight="bold">🌼 फूल व परागण (Anthesis)</text>
              <text x="6" y="21" fill="#FEF9C3" fontSize="7">पानी की कमी न होने दें</text>
            </g>
          </svg>
        );

      case "milking":
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
            {/* Soil */}
            <rect x="0" y="205" width="200" height="35" fill="#3E2723" rx="4" opacity="0.85" />
            <path d="M 100 205 L 100 80" fill="none" stroke="#558B2F" strokeWidth="4.5" />

            {/* Plump Swollen Milky Grain Ear */}
            <g transform="translate(100, 45)">
              {[-30, -20, -10, 0, 10, 20].map((y, i) => (
                <g key={i}>
                  {/* Swollen Grains */}
                  <ellipse cx="-6" cy={y} rx="6" ry="8" fill="#9CCC65" stroke="#689F38" strokeWidth="1" transform="rotate(-15)" />
                  <ellipse cx="6" cy={y - 4} rx="6" ry="8" fill="#9CCC65" stroke="#689F38" strokeWidth="1" transform="rotate(15)" />
                  {/* Awns starting to turn light amber */}
                  <line x1="-9" y1={y - 2} x2="-23" y2={y - 18} stroke="#C0CA33" strokeWidth="1.2" />
                  <line x1="9" y1={y - 6} x2="23" y2={y - 22} stroke="#C0CA33" strokeWidth="1.2" />
                </g>
              ))}
              <ellipse cx="0" cy="-38" rx="5" ry="7" fill="#AED581" />
              <line x1="0" y1="-44" x2="0" y2="-70" stroke="#DCE775" strokeWidth="1.5" />
            </g>

            {/* Milk Sap Drop Callout */}
            <g transform="translate(12, 50)">
              <rect width="78" height="32" rx="6" fill="#1E3A8A" stroke="#93C5FD" strokeWidth="1" />
              <text x="6" y="12" fill="#DBEAFE" fontSize="8" fontWeight="bold">🥛 दूधिया अवस्था (Milk)</text>
              <text x="6" y="22" fill="#FFFFFF" fontSize="7">दाने दबाने पर दूध निकलता है</text>
            </g>
          </svg>
        );

      case "dough":
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
            {/* Soil */}
            <rect x="0" y="205" width="200" height="35" fill="#3E2723" rx="4" opacity="0.85" />
            {/* Amber golden stem */}
            <path d="M 100 205 L 100 80" fill="none" stroke="#A1887F" strokeWidth="4.5" />

            {/* Golden-Green Hardening Ear */}
            <g transform="translate(100, 45)">
              {[-30, -20, -10, 0, 10, 20].map((y, i) => (
                <g key={i}>
                  <ellipse cx="-6" cy={y} rx="6" ry="8" fill="#D4AF37" stroke="#A1887F" strokeWidth="1" transform="rotate(-15)" />
                  <ellipse cx="6" cy={y - 4} rx="6" ry="8" fill="#D4AF37" stroke="#A1887F" strokeWidth="1" transform="rotate(15)" />
                  <line x1="-9" y1={y - 2} x2="-23" y2={y - 18} stroke="#F59E0B" strokeWidth="1.2" />
                  <line x1="9" y1={y - 6} x2="23" y2={y - 22} stroke="#F59E0B" strokeWidth="1.2" />
                </g>
              ))}
              <ellipse cx="0" cy="-38" rx="5" ry="7" fill="#E6C229" />
              <line x1="0" y1="-44" x2="0" y2="-70" stroke="#F59E0B" strokeWidth="1.5" />
            </g>

            {/* Turning Golden Callout */}
            <g transform="translate(108, 18)">
              <rect width="86" height="26" rx="6" fill="#78350F" stroke="#FBBF24" strokeWidth="1" />
              <text x="6" y="11" fill="#FEF3C7" fontSize="8" fontWeight="bold">🥖 दाना सख्त होना (Dough)</text>
              <text x="6" y="21" fill="#FDE68A" fontSize="7">अंतिम हल्की सिंचाई</text>
            </g>
          </svg>
        );

      case "ripening":
      default:
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
            {/* Soil */}
            <rect x="0" y="205" width="200" height="35" fill="#3E2723" rx="4" opacity="0.85" />
            {/* Golden Straw Stem */}
            <path d="M 100 205 L 100 80" fill="none" stroke="#C6A66B" strokeWidth="4.5" />

            {/* Rich Golden Heavy Drooping Ear */}
            <motion.g
              transform="translate(100, 50) rotate(12)"
              animate={{ rotate: [10, 14, 10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              {[-30, -20, -10, 0, 10, 20].map((y, i) => (
                <g key={i}>
                  <ellipse cx="-6" cy={y} rx="6.5" ry="8.5" fill="#DAA520" stroke="#B8860B" strokeWidth="1.2" transform="rotate(-15)" />
                  <ellipse cx="6" cy={y - 4} rx="6.5" ry="8.5" fill="#DAA520" stroke="#B8860B" strokeWidth="1.2" transform="rotate(15)" />
                  <line x1="-9" y1={y - 2} x2="-25" y2={y - 18} stroke="#D4AF37" strokeWidth="1.4" />
                  <line x1="9" y1={y - 6} x2="25" y2={y - 22} stroke="#D4AF37" strokeWidth="1.4" />
                </g>
              ))}
              <ellipse cx="0" cy="-38" rx="5.5" ry="7.5" fill="#FFD700" />
              <line x1="0" y1="-44" x2="0" y2="-72" stroke="#FFD700" strokeWidth="1.6" />
            </motion.g>

            {/* Golden Sun & Sickle Harvest Callout */}
            <g transform="translate(15, 30)">
              <rect width="80" height="28" rx="6" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="6" y="12" fill="#FEF3C7" fontSize="8" fontWeight="bold">🌾 पकी सुनहरी फसल</text>
              <text x="6" y="22" fill="#FFFFFF" fontSize="7">कटाई के लिए तैयार (12-14% नमी)</text>
            </g>
          </svg>
        );
    }
  }, [selectedStage.stageId]);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-b from-[#103C32] via-[#0d2e26] to-[#071b17] text-white p-5 shadow-2xl ${className}`}
    >
      {/* Background Subtle Sun & Atmosphere Glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

      {/* Top Telemetry Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <Sprout className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                360° बॉटनिकल ग्रोथ सिमुलेटर
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/70">
              FAO / Zadoks Phenological Model • ICAR-IIWBR
            </p>
          </div>
        </div>

        {/* 360-degree Radial Circular Progress Ring */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Background Track */}
              <path
                className="text-emerald-950/80"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Animated Progress Arc */}
              <motion.path
                className="text-amber-400"
                strokeDasharray="100, 100"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-black text-amber-300 leading-none">
                {progressPercent}%
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-black text-white">{das} DAS</span>
            <p className="text-[9px] text-emerald-300/80">कुल {totalDays} दिन</p>
          </div>
        </div>
      </div>

      {/* Main Botanical Stage Visual Canvas */}
      <div className="relative my-4 flex flex-col items-center justify-center min-h-[260px] rounded-2xl bg-gradient-to-b from-black/40 via-black/20 to-black/50 border border-emerald-500/20 p-4 overflow-hidden">
        {/* Stage Status Badge floating top-left */}
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-emerald-500/40 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold text-white">
              {selectedStage.stageNameHi}
            </span>
            <span className="text-[10px] font-bold text-amber-300 ml-1">
              ({selectedStage.zadoksCode})
            </span>
          </div>
        </div>

        {/* Live Plant Animated Illustration */}
        <div className="w-full max-w-[280px] h-[240px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStage.stageId}
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex items-center justify-center"
            >
              {renderBotanicalPlant}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stage Agronomic Timeline Range Pill */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-emerald-950/80 backdrop-blur-md border border-emerald-400/30 text-[11px] font-bold text-emerald-200">
            अवधि: {selectedStage.typicalDaysRange[0]} - {selectedStage.typicalDaysRange[1]} दिन
          </div>
        </div>
      </div>

      {/* "आपकी फसल अभी यहाँ है" Indicator */}
      {selectedStage.stageId === currentStage.stageId && (
        <div className="mb-3 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-400/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span className="font-extrabold text-amber-200">
              आपकी वास्तविक फसल वर्तमान में इसी अवस्था में है!
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black">
            वर्तमान (Active)
          </span>
        </div>
      )}

      {/* Interactive Step-by-Step Stage Scrubber / Switcher */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300">
          <span>विकास क्रम (Z00 से Z99)</span>
          <span className="text-[10px] text-emerald-200/70">टैप करके किसी भी चरण का पौधा देखें</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "germination", label: "अंकुरण", zadoks: "Z00" },
            { id: "cri", label: "CRI जड़ें", zadoks: "Z13" },
            { id: "tillering", label: "कल्ले फूट", zadoks: "Z21" },
            { id: "stem_elongation", label: "गांठें", zadoks: "Z30" },
            { id: "booting", label: "गोभ", zadoks: "Z45" },
            { id: "heading", label: "बाली", zadoks: "Z55" },
            { id: "flowering", label: "फूल", zadoks: "Z65" },
            { id: "milking", label: "दूधिया", zadoks: "Z75" },
            { id: "dough", label: "सख्त दाना", zadoks: "Z85" },
            { id: "ripening", label: "पकाव", zadoks: "Z92" },
          ].map((item) => {
            const isSelected = item.id === selectedStage.stageId;
            const isCurrent = item.id === currentStage.stageId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectStage?.(item.id)}
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl text-center transition-all ${
                  isSelected
                    ? "bg-amber-400 text-black font-black shadow-lg shadow-amber-500/30 scale-105"
                    : isCurrent
                    ? "bg-emerald-600/60 border border-emerald-400 text-white font-bold"
                    : "bg-white/10 hover:bg-white/15 text-emerald-200 border border-white/10"
                }`}
              >
                <div className="text-[9px] font-extrabold opacity-80">{item.zadoks}</div>
                <div className="text-[11px] leading-tight truncate max-w-[65px]">{item.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
