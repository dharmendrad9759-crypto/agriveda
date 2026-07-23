"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Camera,
  CloudRain,
  CloudSun,
  Droplets,
  Leaf,
  ListChecks,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Sprout,
  Stethoscope,
  Thermometer,
  Wind,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmData } from "@/hooks/useFarmData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { DASHBOARD_FIELDS } from "@/data/mock/dashboard";
import type { FarmField } from "@/lib/farm/types";

const HERO_IMG = "/images/home/agriveda-hero-scan.jpg";
const HOME_DAY_ANCHOR_MS = Date.parse("2026-07-16T12:00:00Z");

const QUICK_ACTIONS: {
  label: string;
  labelHi: string;
  href: string;
  icon: LucideIcon;
  imageSrc?: string;
  tone: string;
  gradient: string;
}[] = [
  {
    label: "Crop Guide",
    labelHi: "फसल गाइड",
    href: "/crops",
    icon: BookOpen,
    tone: "from-emerald-500/15 to-teal-500/10",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    label: "Weather",
    labelHi: "मौसम",
    href: "/weather",
    icon: CloudSun,
    tone: "from-sky-500/15 to-cyan-500/10",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    label: "Spray Advisory",
    labelHi: "स्प्रे सलाह",
    href: "/weather/spray-advisory",
    icon: Droplets,
    tone: "from-lime-500/15 to-emerald-500/10",
    gradient: "from-lime-500 to-emerald-500",
  },
  {
    label: "Fertilizer Planner",
    labelHi: "खाद योजना",
    href: "/services/fertilizer-calculator",
    icon: Sprout,
    tone: "from-amber-500/15 to-yellow-500/10",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    label: "Pest & Disease",
    labelHi: "कीट-रोग",
    href: "/pest-diseases",
    icon: Leaf,
    tone: "from-rose-500/12 to-orange-500/10",
    gradient: "from-rose-500 to-orange-500",
  },
  {
    label: "Ask Community",
    labelHi: "समुदाय",
    href: "/community",
    icon: MessageCircle,
    tone: "from-teal-500/15 to-emerald-500/10",
    gradient: "from-teal-500 to-emerald-500",
  },
];

function daysSince(dateStr: string): number | null {
  if (!dateStr) return null;
  const d = Date.parse(dateStr);
  if (Number.isNaN(d)) return null;
  const diff = Math.floor((HOME_DAY_ANCHOR_MS - d) / 86_400_000);
  return diff >= 0 ? diff : null;
}

function cropLabel(slug: string | undefined, englishName: string): string {
  const hi = getCropHindiName(slug ?? englishName.toLowerCase());
  return hi ? `${hi} (${englishName})` : englishName;
}

function buildAdvice(opts: {
  isHi: boolean;
  rainChance: number;
  humidity: string;
  crop: string;
  stage: string;
}): { title: string; body: string; href: string; cta: string } {
  const { isHi, rainChance, crop, stage } = opts;
  if (rainChance >= 55) {
    return {
      title: isHi ? "आज स्प्रे न करें" : "Skip spray today",
      body: isHi
        ? `बारिश की संभावना ${rainChance}% है। ${crop} पर स्प्रे टालें — शाम के बाद मौसम फिर चेक करें।`
        : `${rainChance}% rain chance. Hold spray on ${crop} and recheck weather this evening.`,
      href: "/weather/spray-advisory",
      cta: isHi ? "स्प्रे सलाह देखें" : "Open spray advisory",
    };
  }
  return {
    title: isHi ? "आज का एक काम" : "One job for today",
    body: isHi
      ? `${crop} (${stage}) — पत्तों को ध्यान से देखें। पीले धब्बे या कीड़े दिखें तो AI Doctor से स्कैन करें।`
      : `${crop} is in ${stage}. Check leaves closely — scan with AI Doctor if you spot spots or pests.`,
    href: "/ai-doctor",
    cta: isHi ? "अभी स्कैन करें" : "Scan now",
  };
}

function buildRisk(opts: { isHi: boolean; humidityPct: number; rainChance: number }): {
  label: string;
  tone: string;
} {
  const { isHi, humidityPct, rainChance } = opts;
  if (humidityPct >= 80 || rainChance >= 60) {
    return {
      label: isHi ? "रोग का ज़्यादा खतरा" : "High disease risk",
      tone: "border-rose-400/40 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
    };
  }
  if (humidityPct >= 65 || rainChance >= 40) {
    return {
      label: isHi ? "सामान्य जोखिम" : "Moderate risk",
      tone: "border-amber-400/40 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
    };
  }
  return {
    label: isHi ? "कम जोखिम" : "Low risk",
    tone: "border-emerald-400/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  };
}

export default function AgriVedaHome() {
  const { isHi } = useLocale();
  const { fields, loading: fieldsLoading } = useFarmData();
  const { profile, loading: profileLoading } = useFarmerProfile();
  const { weather, loading: weatherLoading } = useLiveWeather();

  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  // Safely get the first active field
  const activeField = fields && fields.length > 0 ? fields[0] : undefined;
  const weatherData = weather && weather.length > 0 ? weather[0] : undefined;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldAnimate ? 0.08 : 0,
        delayChildren: shouldAnimate ? 0.1 : 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldAnimate ? 12 : 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldAnimate ? 0.5 : 0 },
    },
  };

  const cardHoverVariants = {
    rest: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
    hover: shouldAnimate ? { y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" } : {},
  };

  return (
    <motion.div
      className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-200/10 rounded-full blur-3xl dark:from-emerald-500/10 dark:to-teal-500/5" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-sky-200/20 to-cyan-200/10 rounded-full blur-3xl dark:from-sky-500/10 dark:to-cyan-500/5" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* ===== HEADER WITH GREETING ===== */}
        <motion.div variants={itemVariants} className="pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                {isHi ? "नमस्ते" : "Welcome back"}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {profileLoading ? (
                  <span className="animate-pulse">{isHi ? "लोड हो रहा है..." : "Loading..."}</span>
                ) : (
                  profile?.full_name || (isHi ? "किसान मित्र" : "Farmer Friend")
                )}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: shouldAnimate ? 1.05 : 1 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </div>
        </motion.div>

        {/* ===== WEATHER STATUS CARD ===== */}
        <motion.div variants={itemVariants}>
          <motion.div
            initial="rest"
            whileHover="hover"
            variants={cardHoverVariants}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-xl border border-emerald-200/40 dark:border-emerald-500/20 p-6 shadow-lg transition-all duration-300"
          >
            {/* Weather gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/5" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {isHi ? "आज का मौसम" : "Today's Weather"}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {weatherLoading ? (
                      <span className="animate-pulse">--°C</span>
                    ) : (
                      `${weatherData?.temperature || 28}°C`
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <motion.div
                    animate={{ rotate: shouldAnimate ? [0, 10, -10, 0] : 0 }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-sky-500 dark:text-sky-400"
                  >
                    <CloudSun className="w-12 h-12" />
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-200/40 dark:border-emerald-500/20">
                <div className="text-center space-y-1">
                  <div className="flex justify-center text-emerald-600 dark:text-emerald-400">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {isHi ? "नमी" : "Humidity"}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {weatherLoading ? "--" : `${weatherData?.humidity || 65}%`}
                  </p>
                </div>
                <div className="text-center space-y-1">
                  <div className="flex justify-center text-teal-600 dark:text-teal-400">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {isHi ? "बारिश" : "Rain Chance"}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {weatherLoading ? "--" : `${weatherData?.rainChance || 30}%`}
                  </p>
                </div>
                <div className="text-center space-y-1">
                  <div className="flex justify-center text-sky-600 dark:text-sky-400">
                    <Wind className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {isHi ? "हवा" : "Wind"}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {weatherLoading ? "--" : `${weatherData?.windSpeed || 12} km/h`}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ===== FARM SNAPSHOT ===== */}
        {activeField && (
          <motion.div variants={itemVariants}>
            <motion.div
              initial="rest"
              whileHover="hover"
              variants={cardHoverVariants}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-xl border border-emerald-200/40 dark:border-emerald-500/20 p-6 shadow-lg transition-all duration-300"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/5" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {isHi ? "वर्तमान फसल" : "Current Crop"}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {cropLabel(activeField.crop_slug, activeField.crop_name)}
                    </p>
                  </div>
                  <motion.div
                    animate={{ scale: shouldAnimate ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-emerald-200/40 dark:border-emerald-500/20">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {isHi ? "क्षेत्र" : "Area"}
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {activeField.area_acres} {isHi ? "एकड़" : "acres"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {isHi ? "अवस्था" : "Stage"}
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {activeField.growth_stage || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ===== ACTION GRID ===== */}
        <motion.div variants={itemVariants}>
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
              {isHi ? "तेज़ उपकरण" : "Quick Tools"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {QUICK_ACTIONS.map((action, idx) => (
              <motion.div
                key={action.href}
                variants={itemVariants}
                transition={{ delay: idx * 0.05 }}
                custom={idx}
              >
                <AppLink href={action.href}>
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    variants={cardHoverVariants}
                    className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-xl border border-emerald-200/40 dark:border-emerald-500/20 p-5 shadow-md transition-all duration-300 h-full flex flex-col items-start justify-between"
                  >
                    {/* Gradient overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 dark:opacity-0 dark:group-hover:opacity-10 transition-opacity duration-300`}
                    />

                    {/* Icon circle background */}
                    <div
                      className={`relative mb-3 w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} opacity-15 group-hover:opacity-25 transition-opacity duration-300 flex items-center justify-center`}
                    >
                      <action.icon
                        className={`w-5 h-5 bg-gradient-to-r ${action.gradient} bg-clip-text text-transparent`}
                      />
                    </div>

                    <div className="relative z-10 w-full">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {isHi ? action.labelHi : action.label}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 line-clamp-2">
                        {isHi ? action.labelHi : action.label}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <motion.div
                      className="relative z-10 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ x: shouldAnimate ? [0, 4, 0] : 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </motion.div>
                  </motion.div>
                </AppLink>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ===== STATS SECTION ===== */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: TrendingUp,
                label: isHi ? "उपज" : "Yield",
                value: "94%",
              },
              {
                icon: ShieldCheck,
                label: isHi ? "स्वास्थ्य" : "Health",
                value: "92%",
              },
              {
                icon: Zap,
                label: isHi ? "दक्षता" : "Efficiency",
                value: "88%",
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial="rest"
                whileHover="hover"
                variants={cardHoverVariants}
                className="relative overflow-hidden rounded-lg bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-xl border border-emerald-200/40 dark:border-emerald-500/20 p-4 shadow-sm transition-all duration-300 text-center"
              >
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ===== FOOTER SPACING ===== */}
        <motion.div variants={itemVariants} className="h-8" />
      </div>
    </motion.div>
  );
}
