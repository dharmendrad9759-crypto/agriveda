/**
 * Illustrative Scale of Finance (₹ / hectare) for KCC prep estimates only.
 * Real SoF is fixed by DLTC/SLTC — never present as bank-approved limit.
 *
 * Drawing-limit formula (RBI Master Directions — KCC):
 * SoF × area + 10% (post-harvest/household) + 20% (repairs/agri services)
 * + insurance premiums (not estimated here).
 */

export type KccSofCrop = {
  id: string;
  nameHi: string;
  /** Illustrative ₹ per hectare — not DLTC */
  sofPerHaInr: number;
};

/** Mid-range cultivation working-capital style figures for prep education. */
export const KCC_SOF_CROPS: KccSofCrop[] = [
  { id: "paddy", nameHi: "धान", sofPerHaInr: 55_000 },
  { id: "wheat", nameHi: "गेहूँ", sofPerHaInr: 45_000 },
  { id: "maize", nameHi: "मक्का", sofPerHaInr: 40_000 },
  { id: "soybean", nameHi: "सोयाबीन", sofPerHaInr: 35_000 },
  { id: "cotton", nameHi: "कपास", sofPerHaInr: 60_000 },
  { id: "sugarcane", nameHi: "गन्ना", sofPerHaInr: 90_000 },
  { id: "potato", nameHi: "आलू", sofPerHaInr: 70_000 },
  { id: "chilli", nameHi: "मिर्च", sofPerHaInr: 80_000 },
  { id: "tomato", nameHi: "टमाटर", sofPerHaInr: 75_000 },
  { id: "onion", nameHi: "प्याज", sofPerHaInr: 65_000 },
  { id: "moongfali", nameHi: "मूंगफली", sofPerHaInr: 40_000 },
  { id: "other", nameHi: "अन्य / मिला-जुला", sofPerHaInr: 45_000 },
];

export const KCC_SOF_DISCLAIMER_HI =
  "यह आंकड़ा तैयारी का अनुमान है — आपके जिले की DLTC / बैंक Scale of Finance अलग हो सकती है। पक्की लिमिट शाखा तय करेगी। बीमा प्रीमियम यहाँ शामिल नहीं।";

/** Official-style note on concessional interest (MISS) — not a fixed “10% discount”. */
export const KCC_TIMELY_REPAY_OFFICIAL_HI =
  "सरकारी Modified Interest Subvention (MISS / RBI परिपत्र): अल्पकालिक कृषि ऋण (KCC) पर अक्सर ~7% ब्याज; समय पर चुकाने पर अतिरिक्त ~3% प्रोत्साहन से प्रभावी दर ~4% तक गिर सकती है — सीमा आमतौर पर ₹3 लाख प्रति वर्ष तक। पक्की शर्त अपनी बैंक शाखा से पूछें। ऐप कोई फिक्स्ड दर गारंटी नहीं देता।";
