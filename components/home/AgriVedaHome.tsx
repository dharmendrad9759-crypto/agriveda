"use client";

import Image from "next/image";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bug,
  Calculator,
  Camera,
  ChevronRight,
  CloudRain,
  CloudSun,
  Droplets,
  FlaskConical,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  Users,
  Wind,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { useFarmData } from "@/hooks/useFarmData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLiveWeather } from "@/hooks/useLiveWeather";

const QUICK_ACTIONS = [
  {
    label: "Crop Guide",
    labelHi: "फसल गाइड",
    href: "/crops",
    icon: BookOpen,
    color: "bg-[#edf7ed] text-[#25813b]",
  },
  {
    label: "Weather",
    labelHi: "मौसम",
    href: "/weather",
    icon: CloudSun,
    color: "bg-[#fff7dd] text-[#d38a0e]",
  },
  {
    label: "Spray Advisory",
    labelHi: "स्प्रे सलाह",
    href: "/weather/spray-advisory",
    icon: FlaskConical,
    color: "bg-[#eaf7f5] text-[#188b78]",
  },
  {
    label: "Fertilizer",
    labelHi: "खाद प्लानर",
    href: "/services/fertilizer-calculator",
    icon: Calculator,
    color: "bg-[#f3edfb] text-[#7855a8]",
  },
  {
    label: "Pest & Disease",
    labelHi: "कीट व रोग",
    href: "/pest-diseases",
    icon: Bug,
    color: "bg-[#fff0e8] text-[#c46634]",
  },
  {
    label: "Community",
    labelHi: "किसान समुदाय",
    href: "/community",
    icon: Users,
    color: "bg-[#ebf2fb] text-[#3978ad]",
  },
] as const;

function daysSince(dateLabel?: string) {
  if (!dateLabel) return 42;
  const parsed = new Date(dateLabel).getTime();
  if (Number.isNaN(parsed)) return 42;
  return Math.max(1, Math.floor((Date.now() - parsed) / 86_400_000));
}

export default function AgriVedaHome() {
  const { profile } = useFarmerProfile();
  const { data: farm } = useFarmData();
  const { weather, loading: weatherLoading } = useLiveWeather();

  const firstName = profile.name.trim().split(/\s+/)[0] || "Kisan";
  const location = [profile.district, profile.state].filter(Boolean).join(", ") || "Sehore, Madhya Pradesh";
  const field = farm.fields[0];
  const cropName = field?.crop?.split("(")[0].trim() || "Paddy";
  const cropEmoji = field?.emoji || "🌾";
  const cropStage = field?.stage || "Vegetative stage";
  const cropDays = daysSince(field?.sowingDate);
  const rainChance = weather?.hourlyForecast.length
    ? Math.max(...weather.hourlyForecast.slice(0, 8).map((slot) => slot.rainChancePercent))
    : 20;
  const advice =
    rainChance >= 45
      ? `आज बारिश की संभावना ${rainChance}% है। स्प्रे और सिंचाई रोकें, खेत की जल निकासी साफ रखें।`
      : "आज शाम मिट्टी की नमी जाँचें। ऊपरी 2–3 सेमी परत सूखी हो, तभी हल्की सिंचाई करें।";

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-[#173c26] [color-scheme:light]">
      <header className="sticky top-0 z-40 border-b border-[#dce8dc]/80 bg-[#f9fbf7]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <AppLink href="/" className="flex min-w-0 items-center gap-2.5" aria-label="AgriVeda home">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#1d7a3f] to-[#07552d] text-white shadow-[0_7px_18px_rgba(18,100,52,0.23)]">
              <Leaf className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="min-w-0">
              <span className="block text-[19px] font-extrabold leading-none tracking-[-0.03em] text-[#124329]">
                Agri<span className="text-[#d79b2c]">Veda</span>
              </span>
              <span className="mt-1 flex items-center gap-1 truncate text-[10px] font-semibold text-[#718276]">
                <MapPin className="h-3 w-3 shrink-0 text-[#2d8548]" />
                {location}
              </span>
            </span>
          </AppLink>

          <div className="flex shrink-0 items-center gap-2">
            <AppLink
              href="/alerts"
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe9df] bg-white text-[#31523c] shadow-[0_3px_12px_rgba(24,65,38,0.06)]"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={2.1} />
              <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full border-2 border-white bg-[#e28f38]" />
            </AppLink>
            <AppLink
              href="/profile"
              aria-label="Open profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4efe2] text-sm font-extrabold text-[#22633a] ring-2 ring-white shadow-[0_3px_12px_rgba(24,65,38,0.09)]"
            >
              {firstName.slice(0, 1).toUpperCase()}
            </AppLink>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-8 pt-5 sm:px-6 sm:pt-7">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#627468]">Namaste, {firstName} ji 👋</p>
            <h1 className="mt-1 text-[25px] font-extrabold leading-[1.15] tracking-[-0.035em] text-[#163e27] sm:text-3xl">
              Aaj fasal ke liye kya karein?
            </h1>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full border border-[#ead6a4] bg-[#fff8e8] px-3 py-1.5 text-[11px] font-bold text-[#8a6415] xs:flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            1,240 Kisan Points
          </div>
        </div>

        <section className="relative min-h-[238px] overflow-hidden rounded-[26px] bg-[#0d542d] shadow-[0_18px_40px_-18px_rgba(8,75,37,0.55)] sm:min-h-[290px]">
          <Image
            src="/images/agriveda-hero-farmer.png"
            alt="Farmer scanning a crop leaf with the AgriVeda AI doctor"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover object-[64%_center] sm:object-[center_48%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,58,29,0.98)_0%,rgba(5,70,35,0.9)_38%,rgba(5,70,35,0.16)_72%,rgba(2,37,21,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,39,20,0.45)_0%,transparent_48%)]" />
          <div className="absolute -left-12 -top-16 h-44 w-44 rounded-full border border-white/10" />
          <div className="absolute left-16 top-5 h-32 w-32 rounded-full border border-white/[0.06]" />

          <div className="relative z-10 flex min-h-[238px] max-w-[66%] flex-col items-start px-5 py-5 sm:min-h-[290px] sm:max-w-[58%] sm:px-8 sm:py-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/12 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-[#ffd071]" />
              AI CROP DOCTOR
            </span>
            <h2 className="mt-4 max-w-[360px] text-[24px] font-extrabold leading-[1.08] tracking-[-0.035em] text-white sm:text-[34px]">
              Paudhe mein dikkat?
              <span className="mt-1 block text-[#d9f2b4]">Photo se pata karein.</span>
            </h2>
            <p className="mt-2 max-w-[285px] text-[11px] font-medium leading-relaxed text-white/75 sm:text-sm">
              रोग या कीट पहचानें और तुरंत सही उपचार पाएँ
            </p>
            <AppLink
              href="/ai-doctor"
              className="mt-auto inline-flex min-h-11 items-center gap-2 rounded-[14px] bg-white px-4 py-2.5 text-[13px] font-extrabold text-[#0f6433] shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            >
              <Camera className="h-4 w-4" strokeWidth={2.5} />
              Scan Problem
              <ArrowRight className="h-4 w-4" />
            </AppLink>
          </div>

          <div className="absolute bottom-4 right-4 z-10 hidden items-center gap-1.5 rounded-full border border-white/20 bg-[#082f1d]/55 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur-md xs:flex">
            <ShieldCheck className="h-3.5 w-3.5 text-[#b9e98b]" />
            Trusted AI · 30 sec
          </div>
        </section>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-[#ebdba9] bg-[#fff9e9] px-3.5 py-2.5 xs:hidden">
          <span className="flex items-center gap-2 text-xs font-bold text-[#74540f]">
            <ShieldCheck className="h-4 w-4 text-[#b47c0c]" />
            1,240 Kisan Points
          </span>
          <span className="text-[10px] font-semibold text-[#9b7d3c]">Trusted farmer rewards</span>
        </div>

        <section className="mt-6 sm:mt-7">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-[-0.02em] text-[#183e28]">Quick Actions</h2>
              <p className="text-[11px] font-medium text-[#7b8c80]">ज़रूरी सेवाएँ, बस एक tap में</p>
            </div>
            <AppLink href="/library" className="text-[11px] font-bold text-[#2b7b44]">
              View all
            </AppLink>
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
            {QUICK_ACTIONS.map(({ label, labelHi, href, icon: Icon, color }) => (
              <AppLink
                key={label}
                href={href}
                className="group flex min-h-[102px] flex-col items-center justify-center rounded-[20px] border border-[#e3ebe1] bg-white px-2 py-2.5 text-center shadow-[0_6px_20px_rgba(31,75,45,0.055)] transition hover:-translate-y-0.5 hover:border-[#c9ddca] hover:shadow-[0_10px_24px_rgba(31,75,45,0.09)] active:scale-[0.98] sm:min-h-[112px] sm:py-3"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-[15px] ${color}`}>
                  <Icon className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <span className="mt-2 text-[11px] font-extrabold leading-tight text-[#294a35]">{label}</span>
                <span className="mt-0.5 text-[9px] font-medium leading-tight text-[#89968d]">{labelHi}</span>
              </AppLink>
            ))}
          </div>
        </section>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="overflow-hidden rounded-[24px] border border-[#e3ebe1] bg-white shadow-[0_10px_30px_rgba(31,75,45,0.06)]">
            <div className="flex items-center justify-between border-b border-[#edf1eb] px-4 py-3.5">
              <div>
                <h2 className="text-[15px] font-extrabold text-[#1c422b]">Weather Today</h2>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-[#839087]">
                  <MapPin className="h-3 w-3" /> {location.split(",")[0]}
                </p>
              </div>
              <AppLink href="/weather" className="flex items-center gap-0.5 text-[10px] font-bold text-[#2d7e46]">
                Forecast <ChevronRight className="h-3.5 w-3.5" />
              </AppLink>
            </div>
            <div className="grid grid-cols-[1.2fr_2fr] items-center gap-2 p-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff5d8] text-[#e1a01c]">
                  <Sun className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[25px] font-extrabold leading-none tracking-[-0.04em] text-[#173e27]">
                    {weatherLoading ? "—°" : weather?.temp || "29°C"}
                  </p>
                  <p className="mt-1 max-w-20 truncate text-[10px] font-semibold capitalize text-[#829087]">
                    {weather?.condition || "Mostly sunny"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { icon: Droplets, label: "Humidity", value: weather?.humidity || "68%", color: "text-[#3a8faf]" },
                  { icon: Wind, label: "Wind", value: weather?.windSpeed || "12 km/h", color: "text-[#36836f]" },
                  { icon: CloudRain, label: "Rain", value: `${rainChance}%`, color: "text-[#5578a3]" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="min-w-0 rounded-xl bg-[#f6f8f4] px-1 py-2 text-center">
                    <Icon className={`mx-auto h-3.5 w-3.5 ${color}`} strokeWidth={2} />
                    <p className="mt-1 truncate text-[10px] font-extrabold text-[#36513e]">{value}</p>
                    <p className="mt-0.5 truncate text-[8px] font-semibold text-[#929d95]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[24px] border border-[#e3ebe1] bg-white shadow-[0_10px_30px_rgba(31,75,45,0.06)]">
            <div className="flex items-center justify-between border-b border-[#edf1eb] px-4 py-3.5">
              <div>
                <h2 className="text-[15px] font-extrabold text-[#1c422b]">My Fields</h2>
                <p className="mt-0.5 text-[10px] font-medium text-[#839087]">
                  {field ? field.name : "North Field"} · {field?.area || "2.5 acres"}
                </p>
              </div>
              <AppLink href="/my-farm" className="flex items-center gap-0.5 text-[10px] font-bold text-[#2d7e46]">
                Manage <ChevronRight className="h-3.5 w-3.5" />
              </AppLink>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="relative flex h-[70px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-[19px] bg-gradient-to-br from-[#eaf5dc] to-[#d4e9c0] text-[34px]">
                <span aria-hidden>{cropEmoji}</span>
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#54a455]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[16px] font-extrabold text-[#1c422b]">{cropName}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-[#65766b]">
                      <Sprout className="h-3.5 w-3.5 text-[#4c9857]" />
                      {cropStage}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#edf7ed] px-2 py-1 text-[9px] font-extrabold text-[#378047]">
                    HEALTHY
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e7eee5]">
                    <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-[#69ad5d] to-[#2f8a4c]" />
                  </div>
                  <span className="shrink-0 text-[10px] font-extrabold text-[#5e7064]">Day {cropDays}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-[-0.02em] text-[#183e28]">Today&apos;s Advice</h2>
              <p className="text-[11px] font-medium text-[#7b8c80]">आपकी फसल और मौसम के अनुसार</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[#e9f4e8] px-2.5 py-1 text-[9px] font-extrabold text-[#397b45]">
              <Sparkles className="h-3 w-3" /> SMART TIP
            </span>
          </div>
          <div className="relative overflow-hidden rounded-[24px] border border-[#dce8d8] bg-gradient-to-br from-[#eef7e9] via-[#f8faf3] to-[#fff9e9] p-4 shadow-[0_10px_30px_rgba(48,91,48,0.06)] sm:p-5">
            <div className="pointer-events-none absolute -right-6 -top-9 h-32 w-32 rounded-full bg-[#d8ebc7]/70" />
            <div className="relative flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2e8248] text-white shadow-[0_6px_16px_rgba(36,113,59,0.22)]">
                <Leaf className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-extrabold text-[#20492f]">
                  {rainChance >= 45 ? "आज स्प्रे रोकें" : "सिंचाई से पहले नमी जाँचें"}
                </p>
                <p className="mt-1 text-[12px] font-medium leading-[1.6] text-[#55695a]">{advice}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1.5 text-[10px] font-bold text-[#53725b] ring-1 ring-[#dae6d7]">
                    <CloudSun className="h-3.5 w-3.5 text-[#c89226]" />
                    Best time: 5:00–7:00 PM
                  </span>
                  <AppLink
                    href="/field-advisor"
                    className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#27733f]"
                  >
                    Full advice <ArrowRight className="h-3.5 w-3.5" />
                  </AppLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-[#7f8e83]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#4f9659]" />
          Advice reviewed with agronomy best practices
        </div>
      </main>
    </div>
  );
}
