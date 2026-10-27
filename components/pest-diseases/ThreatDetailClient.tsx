"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import {
  Bug,
  Leaf,
  ShieldAlert,
  Shield,
  Sprout,
  Eye,
  FlaskConical,
  ZoomIn,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import type { EnrichedThreat } from "@/types/pest-disease-ui";
import EtlGuideCard from "@/components/shell/EtlGuideCard";
import { parseRemediationBuckets, shortRotationTip } from "@/lib/pest/farmerSpray";
import { getCropHindiName } from "@/lib/crops/crop-display";
import {
  formatFarmerChemicalLine,
  formatFarmerDoseSummary,
  stripMoaCodes,
} from "@/lib/crops/farmerSprayDose";
import { bilingualAgriName } from "@/lib/crops/bilingualAgriName";
import { farmerSpeak } from "@/lib/crops/farmerSpeak";
import { farmerThreatDisplayName } from "@/lib/crops/farmerThreatTitle";
import { getWeedProgramForCrop } from "@/lib/crops/weedAbioticBridge";
import { useLocale } from "@/components/i18n/LocaleProvider";
import SpeakButton from "@/components/ui/SpeakButton";
import { getWeedStageImages, getWeedCardImage } from "@/lib/weeds/weedStageImages";
import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import { isChemicalMention } from "@/lib/crops/medicineParser";
import CropSprayMedicineList from "@/components/crops/CropSprayMedicineList";
import { technicalFromSprayLine } from "@/lib/crops/chemBottle";
import { getCropManagementProfile } from "@/data/crop-management";
import { buildThreatSprayList } from "@/lib/crops/modernTechnicalBridge";
import { findFieldMedicine } from "@/lib/crops/fieldMedicine";
import { ALL_FIELD_MEDICINE } from "@/data/field-medicine-all";
import FieldMedicinePanel from "@/components/crops/FieldMedicinePanel";
import ImageLightbox from "@/components/ui/ImageLightbox";
import ThreatPhotoGallery from "@/components/crops/ThreatPhotoGallery";

type PestTab = "identify" | "spray" | "control";

function farmerSymptomLine(s: string, hi: boolean): string {
  const cleaned = stripMoaCodes(s).trim();
  if (!cleaned) return "";
  if (!hi) return cleaned;
  return farmerSpeak(
    cleaned
      .replace(/\bDead hearts?\b/gi, "डेडहार्ट (सूखा मुख्य तना)")
      .replace(/\bWhite ears?\b/gi, "सफ़ेद बालियाँ")
      .replace(/\bcentral shoot\b/gi, "बीच का तना")
      .replace(/\bempty chaffy panicle\b/gi, "खाली फूस वाली बाली")
      .replace(/\bbore holes\b/gi, "छेद")
      .replace(/\bfrass\b/gi, "कीट की विष्ठा / बुरादा")
      .replace(/\bheading\s*पर\b/gi, "बालियाँ निकलते समय")
      .replace(/\bheading\b/gi, "बालियाँ निकलते समय")
      .replace(/\bStem\b/g, "तना")
      .replace(/Leaf\s*sheaths?\s*पर\s*oval\s*greenish[-\s]*grey\s*lesions/gi, "पत्ती के खोल (शीथ) पर अंडाकार हरे-धूसर धब्बे")
      .replace(/Leaf\s*sheaths?\b/gi, "पत्ती का खोल (शीथ)")
      .replace(/oval\s*greenish[-\s]*grey\s*lesions/gi, "अंडाकार हरे-धूसर धब्बे")
      .replace(/Lesions\s*मिलकर\s*sheath\s*और\s*leaves\s*सूखती\s*हैं/gi, "धब्बे आपस में मिलकर खोल और पत्तियों को सुखा देते हैं")
      .replace(/Unfilled\s*grains\s*और\s*lodging/gi, "बालियों में दाने नहीं भरते और फसल गिर जाती है")
      .replace(/Leaf\s*margins?\s*पर\s*water[-\s]*soaked\s*lesions\s*yellow\s*फिर\s*white/gi, "पत्तियों के किनारों पर पानी भीगे जैसे धब्बे, जो पहले पीले फिर सफेद पड़ते हैं")
      .replace(/Kresek\s*phase\s*[—\-–]\s*पूरे\s*seedling\s*clump\s*का\s*wilting/gi, "क्रेसक अवस्था — पूरा पौधा सूखकर मुरझा जाता है")
      .replace(/सुबह\s*lesion\s*surface\s*पर\s*milky\s*bacterial\s*ooze/gi, "सुबह के समय धब्बों की सतह पर दूधिया चिपचिपा जीवाणु स्राव दिखता है")
      .replace(/Grey\s*centre\s*brown\s*margin\s*वाले\s*diamond[-\s]*shaped\s*lesions/gi, "बीच धूसर / किनारा भूरा — हीरे जैसे धब्बे (Diamond spots)")
      .replace(/diamond[-\s]*shaped\s*lesions?/gi, "हीरे जैसे धब्बे")
      .replace(/Grey\s*centre\s*brown\s*margin/gi, "बीच धूसर, किनारा भूरा")
      .replace(/\bNeck\s*rot\b/gi, "गर्दन सड़न (Neck rot)")
      .replace(/blackened\s*panicle\s*neck/gi, "बाली की गर्दन काली पड़ना")
      .replace(/chaffy\s*grains?/gi, "खोखले दाने")
      .replace(/\bNode\s*rot\b/gi, "गाँठ सड़न (Node rot)")
      .replace(/plant\s*breakage/gi, "पौधा टूटना")
      .replace(/water[-\s]*soaked\s*lesions?/gi, "पानी भीगे जैसे धब्बे")
      .replace(/\blesions?\b/gi, "धब्बे")
      .replace(/\bwindow[-\s]*pane feeding\b/gi, "पत्ती पर खिड़की जैसे सफेद धब्बे")
      .replace(/\bwhorl\b/gi, "चोँगा (गोभ)")
      .replace(/\bleaf axils\b/gi, "पत्ती के कोने")
      .replace(/\bragged holes\b/gi, "फटे छेद")
      .replace(/\bseedling stage\b/gi, "अंकुर अवस्था")
      .replace(/\btassel\b/gi, "नर मंजरी")
      .replace(/\bcob damage\b/gi, "भुट्टे को नुकसान")
      .replace(/\byoung leaves\b/gi, "नई पत्तियाँ")
      .replace(/\bdamping[-\s]*off\b/gi, "आर्द्र गलन (पौध सड़न)")
      .replace(/\bwilting\b/gi, "मुरझाना")
      .replace(/\byellowing\b/gi, "पीलापन")
      .replace(/\bcurling\b/gi, "पत्तियों का मुड़ना (मरोड़िया)")
      .replace(/\bpowdery mildew\b/gi, "सफेद चूर्णी फफूंद (छाछिया)")
      .replace(/\bdowny mildew\b/gi, "डाउनी मिल्ड्यू (रोमिल फफूंद)")
      .replace(/\bwaterlogging\b/gi, "जलभराव")
  );
}

function splitDisplayName(name: string): { primary: string; secondary?: string } {
  const m = name.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (m?.[1] && m[2]) return { primary: m[1].trim(), secondary: m[2].trim() };
  return { primary: name };
}

function weedIdentifyTips(threat: EnrichedThreat, hi: boolean): string[] {
  const name = hi && threat.nameHi ? threat.nameHi : threat.name;
  const sci = threat.scientificName;
  const typeHint = /sedge|cyperus/i.test(`${name} ${sci}`)
    ? hi
      ? "तनों के कोने तीखे — घास जैसी लेकिन किनारे तेज"
      : "Triangular stems — grass-like but sharp edges"
    : /broad|leaf|monochoria|amaranth|कुंदरू|पत्ती/i.test(`${name} ${sci}`)
      ? hi
        ? "चौड़ी पत्तियाँ — फसल से अलग दिखती हैं"
        : "Broad leaves — stands out from the crop"
      : hi
        ? "पतली पत्ती / घास जैसी — फसल में मिल जाती है"
        : "Narrow grassy leaves — mixes with the crop";

  return hi
    ? [
        typeHint,
        `खरपतवार निकालने का सबसे ज़रूरी समय: ${threat.stage || "2–4 पत्ती / शुरू के 30–45 दिन"}`,
        "जड़ या गांठ निकालकर अपनी फसल से मिलाओ",
        "शक हो तो साफ फोटो AI Doctor को भेजो",
      ]
    : [
        typeHint,
        `Critical period: ${threat.stage || "2–4 leaf / first 30–45 days"}`,
        "Pull root/tiller and compare with your crop",
        "If unsure, send a clear photo to AI Doctor",
      ];
}

function weedChemCards(
  lines: string[],
  hi: boolean,
  threat?: EnrichedThreat
): {
  technical: string;
  dose: string;
  stage: string;
  timing: string;
  group: "pre" | "post";
}[] {
  const threatName = `${threat?.name || ""} ${threat?.scientificName || ""}`.toLowerCase();

  // Wheat Gullidanda (Phalaris minor)
  if (/phalaris|गुल्ली/i.test(threatName) && threat?.cropSlug === "wheat") {
    return [
      {
        technical: "Pendimethalin 30% EC (पेंडीमेथालिन 30% EC - जैसे Stomp)",
        dose: hi ? "1.0–1.3 लीटर प्रति एकड़ | 200 लीटर पानी" : "1.0–1.3 L/acre in 200 L water",
        stage: hi ? "बुवाई के 0–3 दिन अंदर (उगने से पहले)" : "0–3 DAS (before emergence)",
        timing: hi ? "उगने से पहले (PRE)" : "Pre-emergence (PRE)",
        group: "pre",
      },
      {
        technical: "Pyroxasulfone 85% WG (पाइरॉक्सासल्फोन 85% WG - जैसे Yamato)",
        dose: hi ? "60 ग्राम प्रति एकड़ | 150 लीटर पानी" : "60 g/acre | 150 L water",
        stage: hi ? "बुवाई के 0–3 दिन अंदर (उगने से पहले)" : "0–3 DAS (PRE)",
        timing: hi ? "उगने से पहले (PRE)" : "Pre-emergence (PRE)",
        group: "pre",
      },
      {
        technical: "Clodinafop-propargyl 15% WP (क्लोडिनाफॉप 15% WP - जैसे Topik)",
        dose: hi ? "160 ग्राम प्रति एकड़ (8 पाउच) | 120–150 लीटर पानी" : "160 g/acre | 120–150 L water",
        stage: hi ? "पहली सिंचाई के बाद (30–35 दिन, 2–4 पत्ती)" : "30–35 DAS (2–4 leaf)",
        timing: hi ? "उगने के बाद (POST)" : "Post-emergence (POST)",
        group: "post",
      },
      {
        technical: "Sulfosulfuron 75% WG (सल्फोसल्फ्यूरॉन 75% WG - जैसे Leader)",
        dose: hi ? "13.5 ग्राम प्रति एकड़ | 120–150 लीटर पानी" : "13.5 g/acre | 120–150 L water",
        stage: hi ? "पहली सिंचाई के बाद (25–30 दिन, 2–4 पत्ती)" : "25–30 DAS (2–4 leaf)",
        timing: hi ? "उगने के बाद (POST)" : "Post-emergence (POST)",
        group: "post",
      },
    ];
  }

  // Bathua (Chenopodium album) - single clean Pendimethalin PRE + Metsulfuron/2,4-D POST
  if (/chenopodium|बथुआ|bathua/i.test(threatName)) {
    return [
      {
        technical: "Pendimethalin 30% EC (पेंडीमेथालिन 30% EC - जैसे Stomp)",
        dose: hi ? "1.0–1.2 लीटर प्रति एकड़ | 200 लीटर पानी" : "1.0–1.2 L/acre | 200 L water",
        stage: hi ? "बुवाई के तुरंत बाद (0–3 दिन अंदर)" : "0–3 DAS (Pre-emergence)",
        timing: hi ? "उगने से पहले (PRE)" : "Pre-emergence (PRE)",
        group: "pre",
      },
      {
        technical: "Metsulfuron-methyl 20% WP (मेटसल्फ्यूरॉन 20% WP - जैसे Algrip)",
        dose: hi ? "8 ग्राम प्रति एकड़ | 150 लीटर पानी" : "8 g/acre | 150 L water",
        stage: hi ? "बुवाई के 30–35 दिन बाद (2–4 पत्ती अवस्था)" : "30–35 DAS (2–4 leaf)",
        timing: hi ? "उगने के बाद (POST)" : "Post-emergence (POST)",
        group: "post",
      },
      {
        technical: "2,4-D Amine Salt 58% SL (2,4-डी अमीन 58% SL)",
        dose: hi ? "400 मिली प्रति एकड़ | 150 लीटर पानी" : "400 ml/acre | 150 L water",
        stage: hi ? "बुवाई के 32–35 दिन बाद (कल्ले फूटने के बाद)" : "32–35 DAS (after tillering)",
        timing: hi ? "उगने के बाद (POST)" : "Post-emergence (POST)",
        group: "post",
      },
    ];
  }

  // Motha / Nagarmotha (Cyperus rotundus) - single Pretilachlor PRE (paddy) + Halosulfuron/Ethoxysulfuron POST
  if (/cyperus|मोथा|मोटा|nagarmotha|nutsedge/i.test(threatName)) {
    const isPaddy = threat?.cropSlug === "paddy";
    const cards: {
      technical: string;
      dose: string;
      stage: string;
      timing: string;
      group: "pre" | "post";
    }[] = [];

    if (isPaddy) {
      cards.push({
        technical: "Pretilachlor 50% EC (प्रेटिलाक्लोर 50% EC - जैसे Rifit)",
        dose: hi ? "500 मिली प्रति एकड़ | 150 लीटर पानी" : "500 ml/acre | 150 L water",
        stage: hi ? "रोपाई के 0–3 दिन अंदर (पानी भरा हो)" : "0–3 DAT (standing water)",
        timing: hi ? "उगने से पहले (PRE)" : "Pre-emergence (PRE)",
        group: "pre",
      });
      cards.push({
        technical: "Ethoxysulfuron 15% WDG (इथोक्सीसल्फ्यूरॉन 15% WDG - जैसे Sunrice)",
        dose: hi ? "50 ग्राम प्रति एकड़ | 150 लीटर पानी" : "50 g/acre | 150 L water",
        stage: hi ? "रोपाई के 15–20 दिन बाद (सक्रिय वृद्धि)" : "15–20 DAT (active growth)",
        timing: hi ? "उगने के बाद (POST)" : "Post-emergence (POST)",
        group: "post",
      });
    }

    cards.push({
      technical: "Halosulfuron-methyl 75% WG (हैलोसल्फ्यूरॉन 75% WG - जैसे Sempra)",
      dose: hi ? "36 ग्राम प्रति एकड़ | 150 लीटर पानी" : "36 g/acre | 150 L water",
      stage: hi ? "मोथा की 3–4 पत्ती अवस्था (20–25 दिन)" : "3–4 leaf stage (20–25 DAS)",
      timing: hi ? "उगने के बाद (POST)" : "Post-emergence (POST)",
      group: "post",
    });

    return cards;
  }

  const rawCards = lines.slice(0, 6).map((line) => {
    const cleanLine = line
      .replace(/^रासायनिक\s*[—–:]\s*(?:(?:Pre|Post)-emergence)?\s*[:—–]?\s*/i, "")
      .replace(/^Chemical:\s*(?:(?:Pre|Post)-emergence)?\s*[:—–]?\s*/i, "")
      .trim();

    const formatted = formatFarmerChemicalLine(cleanLine, hi);
    const doseMatch =
      formatted.match(
        /(\d+(?:\.\d+)?(?:\s*[–\-]\s*\d+(?:\.\d+)?)?\s*(?:ml|g|ली|लीटर|ग्राम)(?:\/लीटर\s*पानी|\/L\s*water|\/एकड़|\/acre)?)/i
      ) || formatted.match(/@\s*([^—(·]+)/i);
    const stageMatch = line.match(/\(([^)]+)\)/);

    const isPre = /pre-emergence|PRE\b|बुवाई के (?:तुरंत|0[–-]3)|0[–-]3\s*DAS/i.test(line);

    const technical = stripMoaCodes(
      formatted
        .split(/·|@/)[0]
        ?.replace(/^Chemical:\s*/i, "")
        .replace(/—.*$/, "")
        .trim() || formatted.slice(0, 40)
    );

    return {
      technical: technical.slice(0, 56),
      dose: doseMatch?.[1]?.trim() || doseMatch?.[0]?.trim() || (hi ? "लेबल अनुसार" : "Follow label"),
      stage: isPre
        ? hi
          ? "बुवाई के तुरंत बाद (0–3 दिन, खरपतवार उगने से पहले)"
          : "0–3 DAS (Pre-emergence)"
        : hi
        ? "2–4 पत्ती अवस्था (15–30 दिन)"
        : "2–4 leaf stage (15–30 DAS)",
      timing: stripMoaCodes(
        stageMatch?.[1]?.trim() ||
          (isPre
            ? hi
              ? "उगने से पहले (PRE)"
              : "Pre-emergence (PRE)"
            : hi
            ? "उगने के बाद (POST)"
            : "Post-emergence (POST)")
      ),
      group: isPre ? ("pre" as const) : ("post" as const),
    };
  });

  // Deduplicate active ingredients
  const seenTechnical = new Set<string>();
  const out: typeof rawCards = [];
  for (const c of rawCards) {
    const norm = c.technical.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);
    if (seenTechnical.has(norm)) continue;
    seenTechnical.add(norm);
    out.push(c);
  }
  return out;
}

function chemicalLinesForWeed(threat: EnrichedThreat): string[] {
  const buckets = parseRemediationBuckets(
    threat.remediation.map((r) =>
      /^(pre|post)-emergence/i.test(r) ? `Chemical: ${r}` : r
    )
  );
  const fromThreat = [
    ...buckets.chemical,
    ...threat.remediation.filter((r) =>
      /pre-emergence|post-emergence|EC|WP|SC|kg|g\/|ml\/|herbicide|@/i.test(r)
    ),
  ];

  const program =
    getCropManagementProfile(threat.cropSlug)?.weedProgram ??
    getWeedProgramForCrop(threat.cropSlug);
  const fromProgram =
    program?.chemical.map((c) => {
      const parts = [
        c.technical,
        c.dose && `@ ${c.dose}`,
        c.timing && `(${c.timing})`,
        c.targets && `→ ${c.targets}`,
        c.note && `· ${c.note}`,
      ].filter(Boolean);
      return parts.join(" ");
    }) ?? [];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of [...fromThreat, ...fromProgram]) {
    const key = line.toLowerCase().replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    if (/cultural control|maintain weed-free|follow field/i.test(key)) continue;
    seen.add(key);
    out.push(line.trim());
  }
  return out;
}

function controlSectionsForPest(
  threat: EnrichedThreat,
  hi: boolean
): { key: string; title: string; icon: typeof Sprout; items: string[] }[] {
  const buckets = parseRemediationBuckets(threat.remediation);
  const speak = (line: string) => (hi ? farmerSpeak(stripMoaCodes(line)) : stripMoaCodes(line));
  const sections: { key: string; title: string; icon: typeof Sprout; items: string[] }[] = [];
  if (buckets.prevention.length) {
    sections.push({
      key: "prevention",
      title: hi ? "पहले से बचाव (Prevention)" : "Prevention",
      icon: Shield,
      items: buckets.prevention.slice(0, 4).map(speak),
    });
  }
  if (buckets.cultural.length) {
    sections.push({
      key: "cultural",
      title: hi ? "खेत का तरीका (Cultural)" : "Cultural control",
      icon: Sprout,
      items: buckets.cultural.slice(0, 4).map(speak),
    });
  }
  if (buckets.mechanical.length) {
    sections.push({
      key: "mechanical",
      title: hi ? "हाथ / मशीन से (Mechanical)" : "Mechanical",
      icon: Sprout,
      items: buckets.mechanical.slice(0, 4).map(speak),
    });
  }
  if (buckets.biological.length) {
    sections.push({
      key: "biological",
      title: hi ? "मित्र जीव से (Biological)" : "Biological",
      icon: Leaf,
      items: buckets.biological.slice(0, 4).map(speak),
    });
  }
  return sections;
}

export default function ThreatDetailClient({ threat }: { threat: EnrichedThreat }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const isWeed = threat.type === "weed";
  const isPest = threat.type === "pest";

  const TypeIcon = isPest ? Bug : threat.type === "disease" ? ShieldAlert : Leaf;
  const cropHi = getCropHindiName(threat.cropSlug);
  const riskHigh = threat.category === "insect" || isPest;
  const names = (() => {
    const soft = farmerThreatDisplayName(
      isWeed && threat.nameHi ? `${threat.nameHi} (${threat.name})` : threat.name,
      threat.scientificName
    );
    if (soft.primary) {
      return { primary: soft.primary, secondary: soft.english };
    }
    return splitDisplayName(
      isWeed && hi && threat.nameHi ? threat.nameHi : threat.name
    );
  })();

  const weedChems = useMemo(
    () => (isWeed ? chemicalLinesForWeed(threat) : []),
    [isWeed, threat]
  );
  const pestControls = useMemo(
    () => (isWeed ? [] : controlSectionsForPest(threat, hi)),
    [isWeed, threat, hi]
  );

  const sprayProducts = useMemo(
    () =>
      buildThreatSprayList({
        profile: getCropManagementProfile(threat.cropSlug),
        type: threat.type,
        name: threat.name,
        scientific: threat.scientificName,
        stageSprays: threat.stageSprays,
        hi,
      }),
    [threat.cropSlug, threat.type, threat.name, threat.scientificName, threat.stageSprays, hi]
  );

  const rotationTip = useMemo(
    () => shortRotationTip(stripMoaCodes(threat.rotationNotes || "") || undefined, hi),
    [threat.rotationNotes, hi]
  );

  const fieldMedicine = findFieldMedicine(
    threat.cropSlug,
    threat.type,
    threat.name,
    `${threat.scientificName} ${threat.pathogen ?? ""}`,
    ALL_FIELD_MEDICINE
  );

  const hasSpray =
    Boolean(fieldMedicine) ||
    Boolean(threat.stageSprays?.length) ||
    Boolean(threat.activeIngredient) ||
    parseRemediationBuckets(threat.remediation).chemical.length > 0 ||
    sprayProducts.length > 0;

  const identifyTips = useMemo(() => {
    if (isWeed) return [];
    const fromSymptoms = (threat.symptoms || [])
      .map((s) => farmerSymptomLine(s, hi))
      .filter(Boolean);
    if (fromSymptoms.length) return fromSymptoms.slice(0, 6);
    const desc = farmerSymptomLine(threat.description || "", hi);
    return desc ? [desc] : [];
  }, [isWeed, threat.symptoms, threat.description, hi]);

  const router = useRouter();
  const defaultPestTab: PestTab = hasSpray
    ? "spray"
    : identifyTips.length
      ? "identify"
      : "control";
  const [pestTab, setPestTab] = useState<PestTab>(defaultPestTab);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const cropTab =
    threat.type === "weed"
      ? "weeds"
      : threat.type === "disease"
        ? "diseases"
        : "pests";
  const backHref = `/crops/${threat.cropSlug}/care/${cropTab}`;
  const cropListLabel = cropHi
    ? `${threat.cropName} (${cropHi})`
    : threat.cropName;

  const pestTabs = (
    [
      { id: "spray" as const, label: hi ? "दवा" : "Spray", show: hasSpray },
      {
        id: "identify" as const,
        label: hi ? "पहचान" : "ID",
        show: identifyTips.length > 0 || Boolean(fieldMedicine?.tips?.length),
      },
      {
        id: "control" as const,
        label: hi ? "बचाव" : "Prevention",
        show: true,
      },
    ] as const
  ).filter((t) => t.show);

  const activePestTab = pestTabs.some((t) => t.id === pestTab)
    ? pestTab
    : pestTabs[0]?.id ?? "spray";

  const switchTab = (nextTab: PestTab) => {
    if (nextTab === pestTab) return;
    setPestTab(nextTab);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${nextTab}`);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hashTab = window.location.hash.replace("#", "") as PestTab;
      if (["identify", "spray", "control"].includes(hashTab) && hashTab !== pestTab) {
        setPestTab(hashTab);
      }
    }
  }, []);

  const chemCards = useMemo(() => weedChemCards(weedChems, hi, threat), [weedChems, hi, threat]);
  const preCards = useMemo(() => chemCards.filter((c) => c.group === "pre"), [chemCards]);
  const postCards = useMemo(() => chemCards.filter((c) => c.group === "post"), [chemCards]);

  const farmerChemLines = useMemo(() => {
    if (isWeed) return [];
    return parseRemediationBuckets(threat.remediation)
      .chemical.slice(0, 6)
      .map((c) => formatFarmerChemicalLine(c, hi));
  }, [isWeed, threat.remediation, hi]);

  const farmerAiDose = useMemo(() => {
    if (!threat.activeIngredient) return null;
    return formatFarmerDoseSummary(threat.activeIngredient, "", hi);
  }, [threat.activeIngredient, hi]);

  return (
    <AppShell
      backHref={backHref}
      breadcrumbs={[
        { label: hi ? "होम" : "Home", href: "/" },
        { label: cropListLabel, href: `/crops/${threat.cropSlug}` },
        {
          label: isWeed ? (hi ? "खरपतवार" : "Weeds") : hi ? "कीट-रोग" : "Pests",
          href: backHref,
        },
        { label: names.primary },
      ]}
    >
      {/* ─── PEST / DISEASE — field dossier ─── */}
      {!isWeed ? (
        <div className="mx-auto w-full max-w-2xl space-y-5">
          {/* Title block — category + name + scientific */}
          <header className="space-y-2.5 px-0.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-800 dark:text-emerald-300">
                {cropHi || threat.cropName} · {isPest ? (hi ? "कीट प्रबंधन" : "Pest Control") : (hi ? "रोग प्रबंधन" : "Disease Control")}
              </span>
            </div>
            <h1 className="font-display text-[1.85rem] font-black leading-[1.12] tracking-tight text-[var(--av-text-primary)] sm:text-[2.15rem]">
              {names.primary}
            </h1>
            {names.secondary ? (
              <p className="text-[14.5px] font-semibold text-[var(--av-text-secondary)]">
                {names.secondary}
              </p>
            ) : null}
            <SpeakButton
              hi={hi}
              text={
                hi
                  ? `राम-राम किसान भाई! ${cropHi || threat.cropName} में ${names.primary} के लिए डॉक्टर की सलाह: ${
                      sprayProducts[0]
                        ? `सबसे पहले टेक्निकल ${sprayProducts[0].technical} का स्प्रे करें। ${sprayProducts[0].doseAcre ? `मात्रा ${sprayProducts[0].doseAcre} रखें।` : ""}`
                        : farmerAiDose
                          ? `अनुशंसित दवा ${farmerAiDose} का प्रयोग करें।`
                          : "दवा टैब में दिए गए पहले विकल्प का छिड़काव करें।"
                    } साथ में 5 मिली सिलिकॉन स्टीकर चिपको ज़रूर मिलाएँ। 3 से 4 दिन में इसका असर दिखेगा और कीट व रोग पर नियंत्रण होगा। तेज धूप में छिड़काव न करें।`
                  : `${names.primary}. Doctor's advice for ${threat.cropName}: start with the first recommended spray, use sticker and spray during cool morning or evening hours.`
              }
            />
          </header>

          {/* Crop-specific high-resolution identification gallery */}
          <ThreatPhotoGallery
            primaryImage={threat.image}
            title={names.primary}
            subtitle={names.secondary || threat.scientificName || undefined}
            cropLabel={cropHi || threat.cropName}
            tagLabel={isPest ? (hi ? "कीट" : "Pest") : (hi ? "रोग" : "Disease")}
            hi={hi}
          />

          {/* Segmented field tabs */}
          {pestTabs.length > 1 ? (
            <div
              role="tablist"
              className="grid gap-1 rounded-2xl bg-[var(--av-surface-inset)] p-1"
              style={{
                gridTemplateColumns: `repeat(${pestTabs.length}, minmax(0, 1fr))`,
              }}
            >
              {pestTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={activePestTab === t.id}
                  onClick={() => switchTab(t.id)}
                  className={
                    activePestTab === t.id
                      ? "rounded-[0.9rem] bg-[var(--av-surface)] px-2 py-2.5 text-[13px] font-bold text-[var(--av-text-primary)] shadow-[0_8px_20px_-12px_rgba(0,0,0,0.4)]"
                      : "rounded-[0.9rem] px-2 py-2.5 text-[13px] font-semibold text-[var(--av-text-muted)]"
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          ) : null}

          {activePestTab === "identify" ? (
            <section className="space-y-4">
              <div className="flex items-end justify-between gap-2 pt-2">
                <h2 className="font-display text-[1.2rem] font-bold tracking-tight text-[var(--av-text-primary)]">
                  {hi ? "खेत में लक्षण व पहचान" : "Field Symptoms & Identification"}
                </h2>
                <Eye className="mb-1 h-5 w-5 text-emerald-800/45" />
              </div>
              <ol className="space-y-0">
                {identifyTips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex gap-3 border-t border-[var(--av-border)] py-3 first:border-t-0 first:pt-0"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-950 text-[11px] font-black text-emerald-100">
                      {i + 1}
                    </span>
                    <p className="min-w-0 flex-1 pt-0.5 text-[13px] leading-snug text-[var(--av-text-secondary)]">
                      {tip}
                    </p>
                  </li>
                ))}
              </ol>

              {/* Field Experience & Detailed Symptoms (Moved from medicine tab as requested by farmer) */}
              {fieldMedicine?.tips && fieldMedicine.tips.length > 0 && (
                <div className="mt-4 space-y-2 rounded-2xl border border-emerald-800/20 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/30 p-3.5 dark:border-emerald-800/40 dark:from-stone-900 dark:to-emerald-950/20 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌾</span>
                    <h3 className="text-[14px] font-black text-emerald-950 dark:text-emerald-100">
                      {hi ? "खेत के अनुभव व विशेष पहचान" : "Field Diagnosis & Detailed Symptoms"}
                    </h3>
                  </div>
                  <div className="space-y-2 pt-1">
                    {fieldMedicine.tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-emerald-600/20 bg-white/95 p-3 text-[13px] font-medium leading-relaxed text-stone-800 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-200 shadow-2xs"
                      >
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasSpray ? (
                <button
                  type="button"
                  onClick={() => switchTab("spray")}
                  className="w-full rounded-2xl border border-emerald-800/15 bg-emerald-950/[0.04] px-4 py-3 text-[13px] font-bold text-emerald-950 dark:text-emerald-100"
                >
                  {hi ? "दवा और मात्रा देखें →" : "See medicine & dose →"}
                </button>
              ) : null}
            </section>
          ) : null}

          {activePestTab === "spray" ? (
            <section className="space-y-3">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <h2 className="font-display text-[1.2rem] font-bold tracking-tight text-[var(--av-text-primary)]">
                    {hi ? "दवा और मात्रा" : "Medicine & dose"}
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[var(--av-text-muted)]">
                    {fieldMedicine
                      ? hi
                        ? "सब दवाएँ नीचे हैं — शुरू की रोकथाम से तेज़ प्रकोप तक"
                        : "Every dose is below, from early prevention to heavy attack"
                      : hi
                        ? "ऊपर वाली पहली पसंद से शुरू करें"
                        : "Start with the first pick"}
                  </p>
                </div>
                <FlaskConical className="mb-1 h-5 w-5 text-emerald-800/45" />
              </div>

              {fieldMedicine ? (
                <FieldMedicinePanel guide={fieldMedicine} hi={hi} />
              ) : sprayProducts.length > 0 ? (
                <CropSprayMedicineList
                  products={sprayProducts}
                  hi={hi}
                  initialVisible={2}
                  shareCrop={cropHi || threat.cropSlug}
                  shareProblem={names.primary}
                />
              ) : (
                <div className="space-y-2">
                  {farmerAiDose ? (
                    <div className="flex overflow-hidden rounded-2xl border border-emerald-800/15 bg-[var(--av-surface)]">
                      <ChemBottleThumb
                        technical={technicalFromSprayLine(farmerAiDose)}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1 px-3 py-2.5">
                        <p className="text-[10px] font-bold text-emerald-800">
                          {hi ? "विकल्प 1" : "Option 1"}
                        </p>
                        <p className="mt-1 text-sm font-bold text-[var(--av-text-primary)]">
                          {farmerAiDose}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {farmerChemLines.map((c, i) => {
                    const isChem = isChemicalMention(c);
                    return (
                      <div
                        key={i}
                        className="flex overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]"
                      >
                        {isChem ? (
                          <ChemBottleThumb technical={technicalFromSprayLine(c)} size="sm" />
                        ) : (
                          <div className="flex w-16 shrink-0 items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="h-6 w-6" />
                          </div>
                        )}
                        <p className="min-w-0 flex-1 px-3 py-2.5 text-xs leading-snug text-[var(--av-text-secondary)]">
                          <span className="mr-1 font-bold text-[var(--av-text-primary)]">
                            {farmerAiDose ? i + 2 : i + 1}.
                          </span>
                          {c}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {rotationTip ? (
                <p className="rounded-2xl border border-amber-600/20 bg-amber-50 px-3 py-2.5 text-[11px] font-medium leading-snug text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
                  {rotationTip}
                </p>
              ) : null}

              {(threat.etl || isPest) && (
                <div className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]">
                  <EtlGuideCard etl={threat.etl} pestName={names.primary} compact />
                </div>
              )}
            </section>
          ) : null}

          {activePestTab === "control" ? (
            <section className="space-y-3.5">
              <div className="pt-0.5 pb-1">
                <p className="text-[13px] font-bold text-emerald-950 dark:text-emerald-200">
                  {hi
                    ? "बुवाई/रोपाई पूर्व बचाव, खेत की स्वच्छता एवं जैविक मित्र कीट"
                    : "Early protection, field sanitation, and biological defense"}
                </p>
              </div>

              {pestControls.length > 0 ? (
                <div className="space-y-3">
                  {pestControls.map((section, si) => {
                    const Icon = section.icon;
                    return (
                      <div
                        key={section.key}
                        className="overflow-hidden rounded-xl border border-emerald-700/25 bg-emerald-50/60 p-3 dark:border-emerald-800/50 dark:bg-emerald-950/20 shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <h4 className="text-[13px] font-black text-emerald-950 dark:text-emerald-100">
                            {si + 1}. {section.title}
                          </h4>
                        </div>
                        <ul className="mt-2.5 space-y-2 pl-1">
                          {section.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-[12.5px] font-medium leading-relaxed text-stone-800 dark:text-stone-200"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="rounded-xl border border-emerald-700/25 bg-emerald-50/60 p-3 dark:border-emerald-800/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                        <Shield className="h-3.5 w-3.5" />
                      </span>
                      <h4 className="text-[13px] font-black text-emerald-950 dark:text-emerald-100">
                        1. {hi ? "प्रमाणित एवं रोगमुक्त पौध/बीज" : "Certified Healthy Seed/Seedlings"}
                      </h4>
                    </div>
                    <p className="mt-2 text-[12.5px] font-medium text-stone-700 dark:text-stone-300">
                      {hi
                        ? "बुवाई पूर्व बीज उपचार करें और नर्सरी से केवल स्वस्थ व रोगमुक्त पौधे ही मुख्य खेत में रोपित करें।"
                        : "Use certified disease-free planting material and treat seeds before sowing."}
                    </p>
                  </div>

                  <div className="rounded-xl border border-teal-700/25 bg-teal-50/60 p-3 dark:border-teal-800/50 dark:bg-teal-950/20">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
                        <Sprout className="h-3.5 w-3.5" />
                      </span>
                      <h4 className="text-[13px] font-black text-teal-950 dark:text-teal-100">
                        2. {hi ? "खेत की स्वच्छता व फसल चक्र" : "Field Sanitation & Rotation"}
                      </h4>
                    </div>
                    <p className="mt-2 text-[12.5px] font-medium text-stone-700 dark:text-stone-300">
                      {hi
                        ? "मेड़ों और नालियों से खरपतवार हटाएं ताकि कीटों को छिपने का आश्रय न मिले। एक ही कुल की फसल लगातार न लगाएं।"
                        : "Keep field borders clean of weeds that act as alternate hosts and practice crop rotation."}
                    </p>
                  </div>

                  <div className="rounded-xl border border-green-700/25 bg-green-50/60 p-3 dark:border-green-800/50 dark:bg-green-950/20">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white">
                        <Leaf className="h-3.5 w-3.5" />
                      </span>
                      <h4 className="text-[13px] font-black text-green-950 dark:text-green-100">
                        3. {hi ? "मित्र कीट व जैविक संरक्षण" : "Beneficial Predators & Biological Care"}
                      </h4>
                    </div>
                    <p className="mt-2 text-[12.5px] font-medium text-stone-700 dark:text-stone-300">
                      {hi
                        ? "लेडीबर्ड भृंग, सिरफिड मक्खी और मकड़ियों जैसे प्राकृतिक मित्र कीटों को संरक्षित रखें। बिना ईटीएल पार किए भारी रासायनिक कीटनाशक न डालें।"
                        : "Conserve natural predators like ladybird beetles and spiders by avoiding broad-spectrum sprays."}
                    </p>
                  </div>
                </div>
              )}
            </section>
          ) : null}
        </div>
      ) : (
        /* ─── WEED PATH (kept, lightly cleaned) ─── */
        <div className="mt-1 space-y-3.5">
          {(() => {
            const stages = getWeedStageImages(threat.scientificName);
            const soft = farmerThreatDisplayName(
              threat.nameHi ? `${threat.nameHi} (${threat.name})` : threat.name,
              threat.scientificName
            );
            const displayName = soft.primary;
            const displaySecondary = soft.english;
            const heroSrc =
              stages?.late ||
              stages?.early ||
              getWeedCardImage(threat.scientificName) ||
              "/images/threats/threat-weed.jpg";
            return (
              <>
                <div className="relative min-h-[152px] overflow-hidden rounded-[1.35rem] border border-lime-500/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-r from-lime-950/90 via-black/55 to-transparent" />
                  <div className="relative z-10 flex min-h-[152px] flex-col justify-between p-4">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-lime-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-lime-950">
                      <Leaf className="h-3 w-3" />
                      {hi ? "खरपतवार" : "Weed"}
                    </span>
                    <div>
                      <p className="font-display text-[22px] font-bold leading-tight text-white">
                        {displayName}
                      </p>
                      {displaySecondary ? (
                        <p className="mt-0.5 text-[13px] font-semibold text-white/85">
                          {displaySecondary}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {stages ? (
                  <div>
                    <p className="mb-2 px-0.5 text-sm font-bold text-[var(--av-text-primary)]">
                      {hi ? "दो अवस्था" : "2 stages"}
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(
                        [
                          {
                            key: "early",
                            src: stages.early,
                            titleHi: "छोटा पौधा",
                            titleEn: "Young plant",
                            ring: "border-emerald-400/40",
                            badge: "bg-emerald-500 text-white",
                            tint: "from-emerald-950/85 via-emerald-950/35 to-transparent",
                            n: "1",
                          },
                          {
                            key: "late",
                            src: stages.late,
                            titleHi: "बड़ा पौधा",
                            titleEn: "Grown plant",
                            ring: "border-amber-400/40",
                            badge: "bg-amber-400 text-amber-950",
                            tint: "from-amber-950/85 via-amber-950/40 to-transparent",
                            n: "2",
                          },
                        ] as const
                      ).map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setLightbox(s.src)}
                          className={`relative min-h-[158px] overflow-hidden rounded-2xl border text-left ${s.ring} active:scale-[0.99]`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.src}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <span className={`absolute inset-0 bg-gradient-to-t ${s.tint}`} />
                          <span
                            className={`absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-black shadow ${s.badge}`}
                          >
                            {s.n}
                          </span>
                          <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                            <ZoomIn className="h-4 w-4" />
                          </span>
                          <div className="relative z-10 flex h-full min-h-[158px] flex-col justify-end p-3">
                            <p className="text-[15px] font-extrabold text-white">
                              {hi ? s.titleHi : s.titleEn}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            );
          })()}

          <div>
            <p className="mb-2 flex items-center gap-1.5 px-0.5 text-sm font-bold text-[var(--av-text-primary)]">
              <Eye className="h-4 w-4 text-emerald-600" />
              {hi ? "खेत में कैसे पहचानें" : "How to spot in the field"}
            </p>
            <ul className="space-y-2">
              {weedIdentifyTips(threat, hi).map((tip, i) => (
                <li
                  key={tip}
                  className="flex gap-3 overflow-hidden rounded-2xl border border-emerald-500/20 bg-[var(--av-surface)] p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-[13px] font-semibold leading-snug text-[var(--av-text-primary)]">
                    {tip}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3.5">
            <p className="flex items-center gap-1.5 px-0.5 text-sm font-bold text-[var(--av-text-primary)]">
              <FlaskConical className="h-4 w-4 text-emerald-700" />
              {hi ? "रासायनिक खरपतवार नाशक दवा (सही समय व खुराक)" : "Chemical weed spray guide"}
            </p>

            {chemCards.length > 0 ? (
              <div className="space-y-4">
                {preCards.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-xl border border-teal-600/25 bg-teal-50/80 px-3 py-1.5 dark:bg-teal-950/40">
                      <span className="text-[12px] font-black text-teal-950 dark:text-teal-200">
                        🌱 {hi ? "1. उगने से पहले (Pre-emergence)" : "1. Pre-emergence"}
                      </span>
                      <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300">
                        {hi ? "बुवाई के 0–3 दिन अंदर" : "0–3 DAS"}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {preCards.map((card, i) => (
                        <li
                          key={`${card.technical}-${i}`}
                          className="flex gap-3 overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]"
                        >
                          <div className="relative shrink-0 overflow-hidden bg-emerald-50">
                            <ChemBottleThumb technical={card.technical} size="sm" />
                          </div>
                          <div className="min-w-0 flex-1 py-3 pr-3">
                            <span className="inline-block rounded-md bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 text-[10px] font-extrabold text-teal-900 dark:text-teal-200">
                              {hi ? "उगने से पहले" : "Pre-emergence"}
                            </span>
                            <p className="mt-1 text-[14px] font-extrabold leading-snug text-[var(--av-text-primary)]">
                              {hi ? bilingualAgriName(card.technical) : card.technical}
                            </p>
                            <p className="mt-1.5 text-[12px] font-bold text-emerald-800 dark:text-emerald-300">
                              {hi ? "खुराक" : "Dose"}: {card.dose}
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold text-[var(--av-text-secondary)]">
                              {hi ? "अवस्था" : "Stage"}: {card.stage}
                            </p>
                            <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
                              {hi ? "समय" : "When"}: {card.timing}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {postCards.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-xl border border-emerald-600/25 bg-emerald-50/80 px-3 py-1.5 dark:bg-emerald-950/40">
                      <span className="text-[12px] font-black text-emerald-950 dark:text-emerald-200">
                        🌿 {hi ? "2. उगने के बाद (Post-emergence)" : "2. Post-emergence"}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                        {hi ? "2–4 पत्ती / पहली सिंचाई बाद" : "2–4 leaf / post-irrigation"}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {postCards.map((card, i) => (
                        <li
                          key={`${card.technical}-${i}`}
                          className="flex gap-3 overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]"
                        >
                          <div className="relative shrink-0 overflow-hidden bg-emerald-50">
                            <ChemBottleThumb technical={card.technical} size="sm" />
                          </div>
                          <div className="min-w-0 flex-1 py-3 pr-3">
                            <span className="inline-block rounded-md bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900 dark:text-emerald-200">
                              {hi ? "उगने के बाद" : "Post-emergence"}
                            </span>
                            <p className="mt-1 text-[14px] font-extrabold leading-snug text-[var(--av-text-primary)]">
                              {hi ? bilingualAgriName(card.technical) : card.technical}
                            </p>
                            <p className="mt-1.5 text-[12px] font-bold text-emerald-800 dark:text-emerald-300">
                              {hi ? "खुराक" : "Dose"}: {card.dose}
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold text-[var(--av-text-secondary)]">
                              {hi ? "अवस्था" : "Stage"}: {card.stage}
                            </p>
                            <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
                              {hi ? "समय" : "When"}: {card.timing}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-[var(--av-border)] px-3 py-4 text-center text-xs text-[var(--av-text-muted)]">
                {hi
                  ? "इस फसल के लिए स्थानीय KVK / लेबल सलाह देखें।"
                  : "Follow local KVK / label advice for this crop."}
              </p>
            )}
          </div>
        </div>
      )}

      <ImageLightbox
        src={lightbox}
        onClose={() => setLightbox(null)}
        closeLabel={hi ? "बंद करें" : "Close"}
      />
    </AppShell>
  );
}
