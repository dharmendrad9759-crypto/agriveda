/**
 * Machinery / tractor subsidy prep notes — sourced from public SMAM pattern
 * + known state ceiling examples. Never a guarantee of entitlement.
 *
 * Sources (farmer must re-check live portals):
 * - SMAM / FMDBT: https://agrimachinery.nic.in
 * - Typical SMAM assistance pattern (DAC & public notes): ~50% for SC/ST/SMF/Women
 *   and ~40% for others, subject to per-machine monetary ceiling.
 * - State tractor schemes (e.g. UP SC tractor anudan): news/dept. notices cite
 *   up to ₹3 lakh for eligible SC farmers (45 HP+) — lottery/selection apply.
 */

export type MachineryFarmerCategory =
  | "sc_st"
  | "small_marginal"
  | "women"
  | "general";

export type MachineryKind = "implement" | "tractor" | "residue" | "chc_hire";

export type SubsidyBand = {
  /** SMAM-style % band commonly published (cost of machine) */
  minPct: number;
  maxPct: number;
  /**
   * Monetary ceiling band often seen on tractors / major machines (₹).
   * Final ceiling is always state AAP / portal product list.
   */
  ceilingMinInr?: number;
  ceilingMaxInr?: number;
  hardPath?: boolean;
  noteHi: string;
  sourceHi: string;
};

export const MACHINERY_CATEGORY_OPTIONS: {
  id: MachineryFarmerCategory;
  labelHi: string;
}[] = [
  { id: "sc_st", labelHi: "SC / ST" },
  { id: "small_marginal", labelHi: "छोटा / सीमांत किसान" },
  { id: "women", labelHi: "महिला किसान (स्वयं आवेदक)" },
  { id: "general", labelHi: "सामान्य वर्ग" },
];

export const MACHINERY_KIND_OPTIONS: {
  id: MachineryKind;
  labelHi: string;
  hintHi: string;
}[] = [
  {
    id: "implement",
    labelHi: "इम्प्लीमेंट (रोटावेटर / ड्रिल / थ्रेशर आदि)",
    hintHi: "SMAM शैली — % + प्रति-यंत्र अधिकतम सीमा (ceiling)",
  },
  {
    id: "tractor",
    labelHi: "ट्रैक्टर",
    hintHi: "SMAM शैली % + राज्यवार सीलिंग; कई जगह लॉटरी",
  },
  {
    id: "residue",
    labelHi: "पराली / CRM यंत्र",
    hintHi: "मौसमी सूची + ceiling राज्य पोर्टल पर",
  },
  {
    id: "chc_hire",
    labelHi: "खरीद नहीं — CHC / यंत्र बैंक किराया",
    hintHi: "खरीद-सब्सिडी % नहीं",
  },
];

/**
 * Prep bands:
 * - % follows commonly cited SMAM pattern (40% others / 50% SC-ST-SMF-Women).
 * - Tractor ceiling band ₹1.5L–₹3L mirrors what farmers often hear and what
 *   several state notifications show as max assistance (e.g. up to ₹3L SC tractor
 *   schemes; SMAM list ceilings frequently in similar lakh range). Exact figure =
 *   your state portal product ceiling.
 */
export const MACHINERY_SUBSIDY_BANDS: Record<
  MachineryKind,
  Record<MachineryFarmerCategory, SubsidyBand>
> = {
  implement: {
    sc_st: {
      minPct: 50,
      maxPct: 50,
      ceilingMinInr: 40_000,
      ceilingMaxInr: 1_25_000,
      noteHi:
        "SMAM शैली: लागत का ~50%, पर प्रति यंत्र अधिकतम सीमा राज्य सूची की। रोटावेटर आदि पर सीलिंग अक्सर हज़ारों–एक लाख+ के आसपास।",
      sourceHi: "स्रोत शैली: SMAM / agrimachinery.nic.in — पक्की सूची राज्य पोर्टल",
    },
    small_marginal: {
      minPct: 50,
      maxPct: 50,
      ceilingMinInr: 40_000,
      ceilingMaxInr: 1_25_000,
      noteHi:
        "छोटे/सीमांत: सार्वजनिक रूप से ~50% + ceiling। ट्रैक्टर से पहले इम्प्लीमेंट आसान रास्ता हो सकता है।",
      sourceHi: "स्रोत शैली: SMAM — agrimachinery.nic.in",
    },
    women: {
      minPct: 50,
      maxPct: 50,
      ceilingMinInr: 40_000,
      ceilingMaxInr: 1_25_000,
      noteHi: "महिला आवेदक पर कई जगह ~50% + ceiling; फंड में महिलाओं के लिए कोटा भी उल्लेखित होता है।",
      sourceHi: "स्रोत शैली: SMAM — agrimachinery.nic.in",
    },
    general: {
      minPct: 40,
      maxPct: 40,
      ceilingMinInr: 30_000,
      ceilingMaxInr: 1_00_000,
      noteHi: "सामान्य वर्ग: सार्वजनिक रूप से ~40% + ceiling। सटीक राशि यंत्र की पोर्टल-सूची से।",
      sourceHi: "स्रोत शैली: SMAM — agrimachinery.nic.in",
    },
  },
  tractor: {
    sc_st: {
      minPct: 40,
      maxPct: 50,
      ceilingMinInr: 1_50_000,
      ceilingMaxInr: 3_00_000,
      hardPath: true,
      noteHi:
        "ट्रैक्टर: % + अधिकतम सीला (ceiling) — जो कम हो। कोटा/लॉटरी आम; सूची हर राज्य और वर्ष बदलती है।",
      sourceHi:
        "स्रोत: agrimachinery.nic.in (SMAM) · राज्य कृषि DBT (जैसे agriculture.up.gov.in) — पक्का आंकड़ा वहीँ",
    },
    small_marginal: {
      minPct: 40,
      maxPct: 50,
      ceilingMinInr: 1_50_000,
      ceilingMaxInr: 2_50_000,
      hardPath: true,
      noteHi:
        "छोटे/सीमांत: SMAM शैली % + ceiling। कोटा/लॉटरी आम — इम्प्लीमेंट या CHC किराया भी देखें।",
      sourceHi: "स्रोत: agrimachinery.nic.in · राज्य यंत्र पोर्टल",
    },
    women: {
      minPct: 40,
      maxPct: 50,
      ceilingMinInr: 1_50_000,
      ceilingMaxInr: 3_00_000,
      hardPath: true,
      noteHi:
        "महिला: % बैंड SC/SMF जैसा ऊँचा हो सकता है, पर ट्रैक्टर में सीलिंग व लॉटरी लागू। पोर्टल सूची देखें।",
      sourceHi: "स्रोत: agrimachinery.nic.in · राज्य पोर्टल",
    },
    general: {
      minPct: 40,
      maxPct: 40,
      ceilingMinInr: 1_00_000,
      ceilingMaxInr: 2_00_000,
      hardPath: true,
      noteHi:
        "सामान्य वर्ग: अक्सर ~40% + नीची/मध्यम सीलिंग। व्यक्तिगत ट्रैक्टर सब्सिडी सीमित हो सकती है।",
      sourceHi: "स्रोत: agrimachinery.nic.in · राज्य पोर्टल",
    },
  },
  residue: {
    sc_st: {
      minPct: 50,
      maxPct: 50,
      ceilingMinInr: 50_000,
      ceilingMaxInr: 1_50_000,
      noteHi: "पराली/CRM यंत्र: मौसमी विंडो + ~50% शैली + ceiling। राज्य CRM सूची चेक करें।",
      sourceHi: "स्रोत: राज्य कृषि / CRM पोर्टल · SMAM सूची",
    },
    small_marginal: {
      minPct: 50,
      maxPct: 50,
      ceilingMinInr: 50_000,
      ceilingMaxInr: 1_50_000,
      noteHi: "छोटे/सीमांत: ऊँचा % बैंड + ceiling; टोकन जल्दी लें।",
      sourceHi: "स्रोत: राज्य CRM / agrimachinery.nic.in",
    },
    women: {
      minPct: 50,
      maxPct: 50,
      ceilingMinInr: 50_000,
      ceilingMaxInr: 1_50_000,
      noteHi: "महिला: ~50% शैली + ceiling — सूची व विंडो राज्य अनुसार।",
      sourceHi: "स्रोत: राज्य CRM / SMAM",
    },
    general: {
      minPct: 40,
      maxPct: 40,
      ceilingMinInr: 40_000,
      ceilingMaxInr: 1_25_000,
      noteHi: "सामान्य: ~40% + ceiling। पराली-सीजन नियम अलग हो सकते हैं।",
      sourceHi: "स्रोत: राज्य CRM / SMAM",
    },
  },
  chc_hire: {
    sc_st: {
      minPct: 0,
      maxPct: 0,
      noteHi: "किराया मॉडल — खरीद सब्सिडी % लागू नहीं। CHC / यंत्र बैंक पर प्रति घंटा/एकड़ दर पूछें।",
      sourceHi: "स्रोत: जिला CHC सूची / कृषि कार्यालय",
    },
    small_marginal: {
      minPct: 0,
      maxPct: 0,
      noteHi: "किराया मॉडल — खरीद सब्सिडी % लागू नहीं।",
      sourceHi: "स्रोत: जिला CHC सूची",
    },
    women: {
      minPct: 0,
      maxPct: 0,
      noteHi: "किराया मॉडल — खरीद सब्सिडी % लागू नहीं।",
      sourceHi: "स्रोत: जिला CHC सूची",
    },
    general: {
      minPct: 0,
      maxPct: 0,
      noteHi: "किराया मॉडल — खरीद सब्सिडी % लागू नहीं।",
      sourceHi: "स्रोत: जिला CHC सूची",
    },
  },
};

export const MACHINERY_SUBSIDY_DISCLAIMER_HI =
  "यह तैयारी का अनुमान है। असल लाभ = (लागत × अनुमोदित %) और प्रति-यंत्र अधिकतम सीमा — दोनों में जो कम हो। सूची, HP, वर्ग, लॉटरी और बजट हर राज्य/वर्ष बदलते हैं। पक्का आंकड़ा केवल agrimachinery.nic.in या अपने राज्य कृषि DBT पोर्टल से लें। ऐप कोई सब्सिडी गारंटी नहीं देता।";
