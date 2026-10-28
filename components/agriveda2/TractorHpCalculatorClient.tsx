"use client";

import { useState, useMemo } from "react";
import {
  Tractor,
  Fuel,
  Gauge,
  Layers,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Share2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import AppLink from "@/components/ui/AppLink";

type SoilType = "light" | "medium" | "heavy";
type DriveType = "2wd" | "4wd";

interface ImplementRecommendation {
  nameHi: string;
  sizeHi: string;
  dieselRateHi: string;
  fieldCapacityHi: string;
  status: "perfect" | "marginal" | "not_recommended";
  noteHi: string;
}

export default function TractorHpCalculatorClient() {
  const [hp, setHp] = useState<number>(45);
  const [drive, setDrive] = useState<DriveType>("2wd");
  const [soil, setSoil] = useState<SoilType>("medium");
  const [copied, setCopied] = useState<boolean>(false);

  // Implement Recommendations Engine based on HP, Drive and Soil
  const matching = useMemo(() => {
    const effectiveHp = drive === "4wd" ? hp + 4 : hp; // 4WD gives higher draft grip
    const isHeavy = soil === "heavy";
    const isLight = soil === "light";

    const recs: ImplementRecommendation[] = [];

    // 1. रोटावेटर (Rotavator)
    let rotavatorSize = "";
    let rotavatorDiesel = "";
    let rotavatorCap = "";
    let rotavatorStatus: "perfect" | "marginal" | "not_recommended" = "perfect";
    let rotavatorNote = "";

    if (effectiveHp < 30) {
      rotavatorSize = "3 से 4 फीट (मिनी रोटावेटर - 24/30 ब्लेड)";
      rotavatorDiesel = "2.5 - 3.2 लीटर/घंटा";
      rotavatorCap = "0.4 - 0.6 एकड़/घंटा";
      rotavatorNote = "छोटे बागवानी व क्यारियों के लिए उत्तम।";
    } else if (effectiveHp <= 38) {
      rotavatorSize = isHeavy ? "4.5 से 5 फीट (36 ब्लेड)" : "5 फीट (36 ब्लेड)";
      rotavatorDiesel = "3.8 - 4.5 लीटर/घंटा";
      rotavatorCap = "0.6 - 0.8 एकड़/घंटा";
      rotavatorNote = "सामान्य दोमट मिट्टी में L-ब्लेड या J-ब्लेड के साथ बेहतरीन जुताई।";
    } else if (effectiveHp <= 48) {
      rotavatorSize = isHeavy ? "5.5 फीट (36-42 ब्लेड)" : "6 फीट (42 ब्लेड)";
      rotavatorDiesel = "4.5 - 5.5 लीटर/घंटा";
      rotavatorCap = "0.8 - 1.1 एकड़/घंटा";
      rotavatorNote = "भारतीय खेतों के लिए सबसे लोकप्रिय व संतुलित साइज।";
    } else if (effectiveHp <= 58) {
      rotavatorSize = isHeavy ? "6.5 फीट (42-48 ब्लेड)" : "7 फीट (48 ब्लेड)";
      rotavatorDiesel = "5.5 - 6.8 लीटर/घंटा";
      rotavatorCap = "1.0 - 1.4 एकड़/घंटा";
      rotavatorNote = "बड़े खेतों में तेजी से बारीक मिट्टी तैयार करने हेतु।";
    } else {
      rotavatorSize = "8 फीट (54 से 60 ब्लेड - हेवी ड्यूटी)";
      rotavatorDiesel = "6.8 - 8.2 लीटर/घंटा";
      rotavatorCap = "1.3 - 1.8 एकड़/घंटा";
      rotavatorNote = "व्यावसायिक व कस्टम हायरिंग हेतु सर्वोत्तम।";
    }
    recs.push({
      nameHi: "रोटावेटर (Rotavator)",
      sizeHi: rotavatorSize,
      dieselRateHi: rotavatorDiesel,
      fieldCapacityHi: rotavatorCap,
      status: rotavatorStatus,
      noteHi: rotavatorNote,
    });

    // 2. कल्टीवेटर (Cultivator / Tiller)
    let cultSize = "";
    let cultDiesel = "";
    let cultCap = "";
    if (effectiveHp < 32) {
      cultSize = "5 से 7 टाइन";
      cultDiesel = "2.2 - 2.8 लीटर/घंटा";
      cultCap = "0.8 - 1.0 एकड़/घंटा";
    } else if (effectiveHp <= 42) {
      cultSize = "9 टाइन (स्प्रिंग लोडेड / डकफुट)";
      cultDiesel = "3.2 - 4.2 लीटर/घंटा";
      cultCap = "1.2 - 1.6 एकड़/घंटा";
    } else if (effectiveHp <= 52) {
      cultSize = "11 टाइन (हेवी ड्यूटी)";
      cultDiesel = "4.2 - 5.2 लीटर/घंटा";
      cultCap = "1.5 - 2.0 एकड़/घंटा";
    } else {
      cultSize = "13 से 15 टाइन (डबल स्प्रिंग)";
      cultDiesel = "5.2 - 6.5 लीटर/घंटा";
      cultCap = "2.0 - 2.8 एकड़/घंटा";
    }
    recs.push({
      nameHi: "कल्टीवेटर (Cultivator)",
      sizeHi: cultSize,
      dieselRateHi: cultDiesel,
      fieldCapacityHi: cultCap,
      status: "perfect",
      noteHi: "गहरी जुताई व खरपतवार निकालने हेतु सबसे किफायती उपकरण।",
    });

    // 3. डिस्क हैरो (Disc Harrow)
    let harrowSize = "";
    let harrowDiesel = "";
    let harrowCap = "";
    let harrowStatus: "perfect" | "marginal" | "not_recommended" = "perfect";
    if (effectiveHp < 35) {
      harrowSize = "10 से 12 डिस्क (हल्का हैरो)";
      harrowDiesel = "2.8 - 3.5 लीटर/घंटा";
      harrowCap = "0.7 - 0.9 एकड़/घंटा";
    } else if (effectiveHp <= 45) {
      harrowSize = "14 या 16 डिस्क (गैंग हैरो)";
      harrowDiesel = "3.8 - 4.8 लीटर/घंटा";
      harrowCap = "1.1 - 1.4 एकड़/घंटा";
    } else if (effectiveHp <= 55) {
      harrowSize = "16 से 18 डिस्क (ट्रेलिंग / माउंटेड)";
      harrowDiesel = "4.8 - 6.0 लीटर/घंटा";
      harrowCap = "1.4 - 1.8 एकड़/घंटा";
    } else {
      harrowSize = "20 से 24 डिस्क (हैवी ड्यूटी हाइड्रोलिक)";
      harrowDiesel = "6.0 - 7.8 लीटर/घंटा";
      harrowCap = "1.8 - 2.4 एकड़/घंटा";
    }
    recs.push({
      nameHi: "डिस्क हैरो (Disc Harrow)",
      sizeHi: harrowSize,
      dieselRateHi: harrowDiesel,
      fieldCapacityHi: harrowCap,
      status: harrowStatus,
      noteHi: "कठोर मिट्टी के ढेले फोड़ने व पराली मिलाने में असरदार।",
    });

    // 4. सुपर सीडर (Super Seeder)
    let seederSize = "";
    let seederDiesel = "";
    let seederCap = "";
    let seederStatus: "perfect" | "marginal" | "not_recommended" = "perfect";
    let seederNote = "";
    if (effectiveHp < 45) {
      seederSize = "अनुशंसित नहीं (< 45 HP)";
      seederDiesel = "—";
      seederCap = "—";
      seederStatus = "not_recommended";
      seederNote = "सुपर सीडर चलाने के लिए न्यूनतम 50 HP 4WD या 50+ HP 2WD की आवश्यकता होती है।";
    } else if (effectiveHp < 50) {
      seederSize = "6 फीट (हल्की मिट्टी में)";
      seederDiesel = "6.5 - 7.5 लीटर/घंटा";
      seederCap = "0.7 - 0.9 एकड़/घंटा";
      seederStatus = "marginal";
      seederNote = "ट्रैक्टर पर अधिक लोड आ सकता है; 4WD होने पर बेहतर चलेगा।";
    } else if (effectiveHp <= 58) {
      seederSize = "7 फीट (11 टाइन - मानक)";
      seederDiesel = "6.0 - 7.5 लीटर/घंटा";
      seederCap = "0.9 - 1.2 एकड़/घंटा";
      seederStatus = "perfect";
      seederNote = "धान की पराली में बिना जलाए सीधे गेहूं बिजाई के लिए सर्वोत्तम।";
    } else {
      seederSize = "8 फीट (13 टाइन - सुपर हेवी)";
      seederDiesel = "7.2 - 8.8 लीटर/घंटा";
      seederCap = "1.2 - 1.6 एकड़/घंटा";
      seederStatus = "perfect";
      seederNote = "बड़े 4WD ट्रैक्टर पर अधिकतम कार्य क्षमता और न्यूनतम समय।";
    }
    recs.push({
      nameHi: "सुपर सीडर (Super Seeder)",
      sizeHi: seederSize,
      dieselRateHi: seederDiesel,
      fieldCapacityHi: seederCap,
      status: seederStatus,
      noteHi: seederNote,
    });

    // 5. एमबी प्लाउ (MB Plough - रिवर्सिबल हल)
    let mbSize = "";
    let mbDiesel = "";
    let mbCap = "";
    let mbStatus: "perfect" | "marginal" | "not_recommended" = "perfect";
    let mbNote = "";
    if (effectiveHp < 35) {
      mbSize = "1 बॉटम (छोटा हल)";
      mbDiesel = "2.8 - 3.4 लीटर/घंटा";
      mbCap = "0.3 - 0.5 एकड़/घंटा";
      mbNote = "गहरी मिट्टी पलटने हेतु।";
    } else if (effectiveHp <= 48) {
      mbSize = "2 बॉटम (मैकेनिकल या हाइड्रोलिक रिवर्सिबल)";
      mbDiesel = "4.2 - 5.4 लीटर/घंटा";
      mbCap = "0.5 - 0.8 एकड़/घंटा";
      mbNote = "गहरी जुताई से मिट्टी के रोगजनक कीट व फंगस धूप में नष्ट होते हैं।";
    } else {
      mbSize = "3 बॉटम हाइड्रोलिक रिवर्सिबल प्लाउ";
      mbDiesel = "6.0 - 7.8 लीटर/घंटा";
      mbCap = "0.8 - 1.2 एकड़/घंटा";
      mbNote = "4WD ट्रैक्टर के साथ बिना पहिया स्लिप हुए अधिकतम गहराई।";
    }
    recs.push({
      nameHi: "एमबी प्लाउ (MB Plough)",
      sizeHi: mbSize,
      dieselRateHi: mbDiesel,
      fieldCapacityHi: mbCap,
      status: mbStatus,
      noteHi: mbNote,
    });

    // 6. लेजर लैंड लेवलर (Laser Land Leveler)
    let laserSize = "";
    let laserDiesel = "";
    let laserCap = "";
    let laserStatus: "perfect" | "marginal" | "not_recommended" = "perfect";
    let laserNote = "";
    if (effectiveHp < 48) {
      laserSize = "अनुशंसित नहीं (< 48 HP)";
      laserDiesel = "—";
      laserCap = "—";
      laserStatus = "not_recommended";
      laserNote = "लेजर लेवलर बकेट खींचने के लिए न्यूनतम 50 HP (4WD उत्तम) आवश्यक है।";
    } else if (effectiveHp <= 55) {
      laserSize = "7 फीट बकेट लेवलर";
      laserDiesel = "6.5 - 7.8 लीटर/घंटा";
      laserCap = "0.8 - 1.2 एकड़/घंटा";
      laserStatus = "perfect";
      laserNote = "खेत को समतल कर 30% तक सिंचाई पानी की बचत करता है।";
    } else {
      laserSize = "8 फीट बकेट लेवलर (हैवी ड्यूटी)";
      laserDiesel = "7.5 - 9.0 लीटर/घंटा";
      laserCap = "1.2 - 1.6 एकड़/घंटा";
      laserStatus = "perfect";
      laserNote = "कस्टम हायरिंग ऑपरेटरों के लिए उच्चतम कार्य कुशलता।";
    }
    recs.push({
      nameHi: "लेजर लैंड लेवलर (Laser Leveler)",
      sizeHi: laserSize,
      dieselRateHi: laserDiesel,
      fieldCapacityHi: laserCap,
      status: laserStatus,
      noteHi: laserNote,
    });

    // 7. हाइड्रोलिक ट्रॉली ढुलाई (Trolley Transport)
    let trolleySize = "";
    let trolleyDiesel = "";
    let trolleyCap = "";
    if (effectiveHp < 35) {
      trolleySize = "3 से 4 टन (सिंगल एक्सल ट्रॉली)";
      trolleyDiesel = "2.5 - 3.2 लीटर/घंटा";
      trolleyCap = "मंडी व ईंट ढुलाई";
    } else if (effectiveHp <= 48) {
      trolleySize = "6 से 8 टन (हाइड्रोलिक टिपर ट्रॉली)";
      trolleyDiesel = "3.2 - 4.2 लीटर/घंटा";
      trolleyCap = "गन्ना व अनाज ढुलाई";
    } else {
      trolleySize = "10 से 15 टन (डबल एक्सल हाइड्रोलिक ट्रॉली)";
      trolleyDiesel = "4.2 - 5.5 लीटर/घंटा";
      trolleyCap = "भारी ढुलाई व व्यावसायिक कार्य";
    }
    recs.push({
      nameHi: "ट्रॉली ढुलाई (Trolley Transport)",
      sizeHi: trolleySize,
      dieselRateHi: trolleyDiesel,
      fieldCapacityHi: trolleyCap,
      status: "perfect",
      noteHi: "सड़क पर उच्च गियर में 18-20 PSI टायर प्रेशर रखें।",
    });

    return recs;
  }, [hp, drive, soil]);

  const handleShare = () => {
    const text = `🚜 *Agriveda ट्रैक्टर उपकरण व डीजल कैलकुलेटर*\n\n⚙️ *ट्रैक्टर क्षमता:* ${hp} HP (${drive.toUpperCase()})\n🌱 *मिट्टी का प्रकार:* ${soil === "light" ? "हल्की/बलुई" : soil === "medium" ? "मध्यम/दोमट" : "भारी/काली"}\n\n🛠️ *अनुशंसित उपकरण मैचिंग:*\n• रोटावेटर: ${matching[0]?.sizeHi} (डीजल: ${matching[0]?.dieselRateHi})\n• कल्टीवेटर: ${matching[1]?.sizeHi} (डीजल: ${matching[1]?.dieselRateHi})\n• सुपर सीडर: ${matching[3]?.sizeHi}\n\nसही उपकरण मैचिंग व डीजल बचत टिप्स के लिए Agriveda ऐप खोलें!`;
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleCopy = () => {
    const text = `${hp} HP (${drive.toUpperCase()}): रोटावेटर ${matching[0]?.sizeHi} | कल्टीवेटर ${matching[1]?.sizeHi} | सुपर सीडर ${matching[3]?.sizeHi}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Configuration Card */}
      <DarkCard className="p-4 border-amber-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Tractor className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold theme-text-primary">
              ट्रैक्टर HP व उपकरण मैचिंग कैलकुलेटर
            </h2>
          </div>
          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
            डीजल व कार्य क्षमता
          </span>
        </div>

        <p className="text-xs theme-text-muted mb-4 leading-relaxed">
          ट्रैक्टर की हॉर्सपावर (HP) के अनुसार सही साइज का रोटावेटर, कल्टीवेटर व सुपर सीडर चुनें ताकि डीजल की बर्बादी न हो और इंजन पर अतिरिक्त लोड न पड़े।
        </p>

        {/* 1. HP Selector Slider & Chips */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold theme-text-muted">
              ट्रैक्टर हॉर्सपावर (Horsepower)
            </label>
            <span className="text-lg font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
              {hp} HP
            </span>
          </div>

          <input
            type="range"
            min="25"
            max="75"
            step="1"
            value={hp}
            onChange={(e) => setHp(parseInt(e.target.value) || 45)}
            className="w-full accent-amber-500 h-2 bg-white/10 rounded-lg cursor-pointer"
          />

          {/* Quick HP Buttons */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {[25, 35, 40, 45, 50, 55, 65].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setHp(val)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  hp === val
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white/5 theme-text-muted hover:bg-white/10"
                }`}
              >
                {val} HP
              </button>
            ))}
          </div>
        </div>

        {/* 2. Drive & Soil Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
          <div>
            <label className="block text-xs font-bold theme-text-muted mb-1.5">
              ड्राइव प्रकार (Drive)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDrive("2wd")}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center ${
                  drive === "2wd"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white/5 theme-text-muted hover:bg-white/10"
                }`}
              >
                2WD (सामान्य पिछला व्हील)
              </button>
              <button
                type="button"
                onClick={() => setDrive("4wd")}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center ${
                  drive === "4wd"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white/5 theme-text-muted hover:bg-white/10"
                }`}
              >
                4WD (चारों पहिए ड्राइव)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold theme-text-muted mb-1.5">
              खेत की मिट्टी का प्रकार
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: "light", label: "हल्की / रेतीली" },
                { key: "medium", label: "मध्यम / दोमट" },
                { key: "heavy", label: "भारी / काली" },
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSoil(s.key as SoilType)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition text-center ${
                    soil === s.key
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white/5 theme-text-muted hover:bg-white/10"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Banner */}
        <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="text-xs">
            <span className="font-bold theme-text-primary">
              {hp} HP {drive.toUpperCase()} ट्रैक्टर
            </span>
            <span className="theme-text-muted">
              {" "}· {soil === "light" ? "हल्की मिट्टी" : soil === "medium" ? "दोमट मिट्टी" : "काली/मटियार मिट्टी"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-medium theme-text-primary transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "कॉपी हुआ" : "कॉपी"}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 rounded-lg bg-amber-600 hover:bg-amber-500 px-3 py-1 text-xs font-bold text-white transition shadow"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>शेयर</span>
            </button>
          </div>
        </div>
      </DarkCard>

      {/* Matched Implements Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-bold theme-text-primary">
            उपयुक्त उपकरण व अनुमानित डीजल खपत ({hp} HP)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {matching.map((item, idx) => {
            const isNotRec = item.status === "not_recommended";
            const isMarginal = item.status === "marginal";

            return (
              <DarkCard
                key={idx}
                className={`p-3.5 border transition ${
                  isNotRec
                    ? "border-rose-500/20 bg-rose-950/10 opacity-75"
                    : isMarginal
                    ? "border-amber-500/30 bg-amber-950/10"
                    : "border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-bold text-sm theme-text-primary flex items-center gap-1.5">
                    {item.nameHi}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isNotRec
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : isMarginal
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {isNotRec ? "उपयुक्त नहीं" : isMarginal ? "सावधानी से" : "सर्वोत्तम मैच"}
                  </span>
                </div>

                <div className="text-sm font-bold text-amber-400 mb-2">
                  {item.sizeHi}
                </div>

                {!isNotRec && (
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-white/5 my-2">
                    <div className="flex items-center gap-1.5">
                      <Fuel className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <div>
                        <div className="text-[10px] theme-text-muted">डीजल खपत</div>
                        <div className="font-semibold text-emerald-400">{item.dieselRateHi}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <div>
                        <div className="text-[10px] theme-text-muted">कार्य क्षमता</div>
                        <div className="font-semibold theme-text-primary">{item.fieldCapacityHi}</div>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-[11px] theme-text-muted leading-relaxed">
                  {item.noteHi}
                </p>
              </DarkCard>
            );
          })}
        </div>
      </div>

      {/* Diesel Saving Pro Tips */}
      <DarkCard className="p-4 border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <Fuel className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold theme-text-primary">
            ट्रैक्टर में 20% तक डीजल बचाने के 5 जरूरी नियम
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
            <span className="font-bold text-emerald-400 shrink-0">1.</span>
            <span className="theme-text-muted">
              <b>सही गियर चयन:</b> ट्रैक्टर को हमेशा उस उच्चतम गियर में चलाएं जिसमें इंजन पर काला धुआं न आए। कम गियर में ज्यादा रेस देने से डीजल फुकता है।
            </span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
            <span className="font-bold text-emerald-400 shrink-0">2.</span>
            <span className="theme-text-muted">
              <b>टायर का हवा दबाव (PSI):</b> खेत में जुताई के समय पिछले टायर में 12-14 PSI रखें ताकि पहिया स्लिप न हो। पक्की सड़क पर ढुलाई करते समय 18-20 PSI रखें।
            </span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
            <span className="font-bold text-emerald-400 shrink-0">3.</span>
            <span className="theme-text-muted">
              <b>540 RPM PTO का सही इस्तेमाल:</b> रोटावेटर और थ्रेशर चलाते समय इंजन को 1500–1700 RPM पर ही रखें, जिससे PTO को मानक 540 चक्कर मिले।
            </span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
            <span className="font-bold text-emerald-400 shrink-0">4.</span>
            <span className="theme-text-muted">
              <b>ड्राफ्ट और पोजीशन कंट्रोल:</b> कल्टीवेटर चलाते समय ड्राफ्ट लीवर का प्रयोग करें ताकि मिट्टी के उतार-चढ़ाव पर ट्रैक्टर स्वतः भार संभाल सके और पहिया न घूमे।
            </span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
            <span className="font-bold text-emerald-400 shrink-0">5.</span>
            <span className="theme-text-muted">
              <b>एयर क्लीनर की सफाई:</b> रोजाना काम शुरू करने से पहले एयर फिल्टर का धूल बाउल साफ करें। गंदा फिल्टर इंजन को सांस नहीं लेने देता जिससे डीजल खपत 15% बढ़ जाती है।
            </span>
          </div>
        </div>

        {/* Machinery Subsidy Link */}
        <div className="pt-2">
          <AppLink
            href="/schemes/smam"
            className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 hover:bg-amber-900/40 transition"
          >
            <div className="flex items-center gap-2.5">
              <Tractor className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-amber-400">
                  SMAM कृषि यंत्र अनुदान (40-50% सरकारी छूट)
                </div>
                <div className="text-[11px] theme-text-muted">
                  रोटावेटर, कल्टीवेटर, सीडर व ट्रैक्टर टोकन सब्सिडी की पूरी जानकारी देखें
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-amber-400 shrink-0" />
          </AppLink>
        </div>
      </DarkCard>
    </div>
  );
}
