import type { CropVariety } from "@/data/mock/crop-overview";

export interface MarketVarietyRec extends CropVariety {
  /** States where this variety sells / grows well */
  states: string[];
  marketNote: string;
}

const VARIETIES_BY_CROP: Record<string, MarketVarietyRec[]> = {
  paddy: [
    { name: "PB 1121", trait: "Long grain basmati, premium mandi rate", season: "Kharif", states: ["Haryana", "Punjab", "Uttar Pradesh"], marketNote: "Top basmati export & Delhi NCR mandi demand" },
    { name: "MTU-1010", trait: "High yield, medium slender", season: "Kharif", states: ["Andhra Pradesh", "Telangana", "Odisha"], marketNote: "Strong miller offtake in coastal AP" },
    { name: "PR-126", trait: "Salt tolerant, early", season: "Kharif", states: ["Punjab", "Haryana"], marketNote: "Good for water-scarce belts" },
    { name: "Swarna", trait: "Popular coarse grain", season: "Kharif", states: ["West Bengal", "Bihar", "Odisha", "Jharkhand"], marketNote: "Steady government procurement demand" },
  ],
  wheat: [
    { name: "HD 2967", trait: "High yield, lodging tolerant", season: "Rabi", states: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh"], marketNote: "MSP favourite — highest arrival volumes" },
    { name: "DBW 187", trait: "Yellow rust resistant", season: "Rabi", states: ["Punjab", "Haryana"], marketNote: "Preferred by NW India traders" },
    { name: "GW 322", trait: "Good chapati quality", season: "Rabi", states: ["Madhya Pradesh", "Gujarat", "Rajasthan"], marketNote: "Strong MP/RJ mandi offtake" },
  ],
  maize: [
    { name: "HQPM-1", trait: "Quality protein maize", season: "Kharif / Rabi", states: ["Bihar", "Karnataka", "Madhya Pradesh", "Rajasthan"], marketNote: "Feed mill + poultry demand rising" },
    { name: "Pusa HM-8", trait: "Hybrid high yield", season: "Kharif", states: ["Uttar Pradesh", "Bihar"], marketNote: "Good for industrial starch buyers" },
    { name: "DHM 117", trait: "Drought tolerant hybrid", season: "Kharif", states: ["Telangana", "Andhra Pradesh", "Maharashtra"], marketNote: "Preferred in rainfed belts" },
  ],
  soybean: [
    { name: "JS 335", trait: "Widely adapted, good oil%", season: "Kharif", states: ["Madhya Pradesh", "Maharashtra", "Rajasthan"], marketNote: "#1 MP Indore mandi arrivals" },
    { name: "JS 9305", trait: "Early maturity", season: "Kharif", states: ["Madhya Pradesh", "Rajasthan"], marketNote: "Popular with oil millers" },
    { name: "NRC 37", trait: "High yield under irrigation", season: "Kharif", states: ["Maharashtra", "Gujarat"], marketNote: "Growing crush demand" },
  ],
  tomato: [
    { name: "Pusa Ruby", trait: "Open pollinated, table use", season: "Rabi / Zaid", states: ["Maharashtra", "Karnataka", "Andhra Pradesh"], marketNote: "Steady wholesale vegetable mandi" },
    { name: "Arka Vikas", trait: "Firm fruits, transport tolerant", season: "Year-round", states: ["Karnataka", "Tamil Nadu"], marketNote: "Bengaluru / Hoskote hub favourite" },
    { name: "Hybrid 71", trait: "High yield hybrid", season: "Kharif / Rabi", states: ["Maharashtra", "Gujarat", "Madhya Pradesh"], marketNote: "Nashik/Indore trade volumes" },
  ],
  potato: [
    { name: "Kufri Jyoti", trait: "Table variety, wide adaption", season: "Rabi", states: ["Uttar Pradesh", "Bihar", "West Bengal", "Punjab"], marketNote: "Highest national mandi arrivals" },
    { name: "Kufri Bahar", trait: "Early, good storability", season: "Rabi", states: ["Uttar Pradesh", "Haryana"], marketNote: "Agra / Farrukhabad cold store trade" },
    { name: "Kufri Chipsona", trait: "Processing / chips", season: "Rabi", states: ["Gujarat", "Punjab", "Uttar Pradesh"], marketNote: "Industry contract premium" },
  ],
  chilli: [
    { name: "G-4 (LCA 334)", trait: "Red dry chilli, pungent", season: "Kharif / Rabi", states: ["Andhra Pradesh", "Telangana"], marketNote: "Guntur mandi — top spice trade" },
    { name: "Byadgi", trait: "Deep red colour, low heat", season: "Kharif", states: ["Karnataka"], marketNote: "Premium colour grade exports" },
    { name: "Teja", trait: "High pungency", season: "Kharif / Rabi", states: ["Andhra Pradesh", "Telangana", "Madhya Pradesh"], marketNote: "Export + powder industry demand" },
  ],
  cotton: [
    { name: "Bt Hybrid (BG II)", trait: "Bollworm protection, high lint", season: "Kharif", states: ["Maharashtra", "Gujarat", "Madhya Pradesh", "Telangana"], marketNote: "CCI / private ginners primary buy" },
    { name: "RCH 659 BG II", trait: "Popular private hybrid", season: "Kharif", states: ["Maharashtra", "Gujarat"], marketNote: "Strong NACOF/trader preference" },
  ],
  onion: [
    { name: "Agrifound Dark Red", trait: "Good storage, dark red", season: "Rabi", states: ["Maharashtra", "Karnataka", "Madhya Pradesh"], marketNote: "Lasalgaon / Pimpalgaon volumes" },
    { name: "N-53", trait: "Early kharif type", season: "Kharif", states: ["Maharashtra", "Gujarat"], marketNote: "Off-season premium prices" },
  ],
  mustard: [
    { name: "Pusa Bold", trait: "High oil, bold seed", season: "Rabi", states: ["Rajasthan", "Haryana", "Madhya Pradesh", "Uttar Pradesh"], marketNote: "Oil mill demand peaks seasonally" },
    { name: "RH 749", trait: "Yield + oil balance", season: "Rabi", states: ["Haryana", "Rajasthan"], marketNote: "Strong NW India mandi" },
  ],
  sugarcane: [
    { name: "Co 0238", trait: "High sucrose, early", season: "Year-round", states: ["Uttar Pradesh", "Haryana", "Bihar"], marketNote: "Sugar mill crushing preference" },
    { name: "Co 86032", trait: "Drought tolerant", season: "Year-round", states: ["Maharashtra", "Karnataka", "Tamil Nadu"], marketNote: "Peninsular mill contracts" },
  ],
  bajra: [
    { name: "HHB 67 Improved", trait: "Early hybrid, drought escape", season: "Kharif", states: ["Rajasthan", "Haryana", "Gujarat"], marketNote: "Feed + pearl millet mandi offtake" },
    { name: "ICTP 8203", trait: "Open pollinated, remuneative", season: "Kharif", states: ["Maharashtra", "Rajasthan"], marketNote: "Local trader + poultry feed" },
  ],
  cucumber: [
    { name: "Pusa Uday", trait: "Parthenocarpic, greenhouse ready", season: "Zaid / Protected", states: ["Haryana", "Maharashtra", "Karnataka"], marketNote: "Urban wholesale premium" },
    { name: "Poinsettee", trait: "Open field slicer", season: "Summer", states: ["Uttar Pradesh", "Bihar", "West Bengal"], marketNote: "Local mandi daily demand" },
  ],
  brinjal: [
    { name: "Pusa Purple Long", trait: "Long fruit, common market type", season: "Year-round", states: ["Uttar Pradesh", "Bihar", "West Bengal"], marketNote: "Steady vegetable mandi" },
    { name: "Arka Anand", trait: "Hybrid, bacterial wilt tolerant", season: "Kharif / Rabi", states: ["Karnataka", "Andhra Pradesh", "Tamil Nadu"], marketNote: "South India wholesale hubs" },
  ],
  moong: [
    { name: "SML 668", trait: "Short duration summer moong", season: "Zaid", states: ["Punjab", "Haryana", "Rajasthan"], marketNote: "Pulse mill & MSP interest" },
    { name: "IPM 02-3", trait: "Yellow mosaic tolerant", season: "Kharif", states: ["Uttar Pradesh", "Madhya Pradesh", "Rajasthan"], marketNote: "Good local trader demand" },
  ],
  moongfali: [
    { name: "GG 20", trait: "Most popular Gujarat bunch type", season: "Kharif / Summer", states: ["Gujarat", "Rajasthan"], marketNote: "Top Saurashtra farmer choice" },
    { name: "TG 37A", trait: "Spanish bunch, early, widely grown", season: "Kharif / Rabi", states: ["Gujarat", "Rajasthan", "Andhra Pradesh"], marketNote: "Oil + confectionery crush demand" },
    { name: "TAG 24", trait: "Bunch type, stable yield nationwide", season: "Kharif", states: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Gujarat"], marketNote: "Popular certified seed choice" },
    { name: "GJG 9", trait: "High yield for Gujarat", season: "Kharif", states: ["Gujarat"], marketNote: "Saurashtra mandi volumes" },
  ],
  groundnut: [
    { name: "GG 20", trait: "Most popular Gujarat bunch type", season: "Kharif / Summer", states: ["Gujarat", "Rajasthan"], marketNote: "Top Saurashtra farmer choice" },
    { name: "TG 37A", trait: "Spanish bunch, early, widely grown", season: "Kharif / Rabi", states: ["Gujarat", "Rajasthan", "Andhra Pradesh"], marketNote: "Oil + confectionery crush demand" },
    { name: "TAG 24", trait: "Bunch type, stable yield nationwide", season: "Kharif", states: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Gujarat"], marketNote: "Popular certified seed choice" },
    { name: "GJG 9", trait: "High yield for Gujarat", season: "Kharif", states: ["Gujarat"], marketNote: "Saurashtra mandi volumes" },
  ],
  cauliflower: [
    { name: "Pusa Snowball K-1", trait: "Snowball curd, winter crop", season: "Rabi", states: ["Uttar Pradesh", "Haryana", "Punjab", "Bihar"], marketNote: "North India wholesale favourite" },
    { name: "Pusa Sharad", trait: "Mid-season, compact head", season: "Rabi", states: ["Uttar Pradesh", "Madhya Pradesh", "Rajasthan"], marketNote: "Steady mandi arrivals" },
    { name: "Himani", trait: "Early hybrid type", season: "Rabi / Late kharif", states: ["Maharashtra", "Karnataka", "Gujarat"], marketNote: "Urban market premium" },
  ],
  bhindi: [
    { name: "Arka Anamika", trait: "Yellow vein mosaic tolerant", season: "Kharif / Summer", states: ["Karnataka", "Andhra Pradesh", "Tamil Nadu", "Maharashtra"], marketNote: "South + western veg mandis" },
    { name: "Pusa Sawani", trait: "Long pods, multipurpose", season: "Kharif / Summer", states: ["Uttar Pradesh", "Bihar", "Delhi"], marketNote: "North India daily market staple" },
    { name: "Varsha Uphar", trait: "Hybrid high yield", season: "Kharif", states: ["Gujarat", "Maharashtra", "Rajasthan"], marketNote: "Good trader offtake" },
  ],
  pulses: [
    { name: "ICPL 87119 (Asha)", trait: "Wilt resistant arhar/tur", season: "Kharif", states: ["Maharashtra", "Madhya Pradesh", "Karnataka", "Gujarat"], marketNote: "Dal mill preference — Tur" },
    { name: "Maruti (ICP 8863)", trait: "Widely adapted pigeonpea", season: "Kharif", states: ["Karnataka", "Andhra Pradesh", "Telangana"], marketNote: "Strong south India pulse trade" },
    { name: "UPAS 120", trait: "Early arhar for UP belt", season: "Kharif", states: ["Uttar Pradesh", "Bihar"], marketNote: "North pulse mandi demand" },
  ],
  mango: [
    { name: "Alphonso (Hapus)", trait: "Premium export variety", season: "Summer harvest", states: ["Maharashtra", "Gujarat", "Karnataka"], marketNote: "Highest premium rates" },
    { name: "Dashehari", trait: "North India table mango", season: "Summer harvest", states: ["Uttar Pradesh", "Bihar", "Uttarakhand"], marketNote: "Lucknow / Malihabad trade" },
    { name: "Kesar", trait: "Sweet, Saurashtra speciality", season: "Summer harvest", states: ["Gujarat"], marketNote: "Gujarat mandi + processing" },
  ],
  banana: [
    { name: "Grand Naine (G-9)", trait: "Tissue culture, export type", season: "Year-round", states: ["Maharashtra", "Gujarat", "Andhra Pradesh", "Tamil Nadu"], marketNote: "Main wholesale + ripener demand" },
    { name: "Robusta", trait: "Heavy bunch, local markets", season: "Year-round", states: ["Karnataka", "Tamil Nadu", "Kerala"], marketNote: "South India retail staple" },
    { name: "Nendran", trait: "Cooking banana, Kerala type", season: "Year-round", states: ["Kerala", "Tamil Nadu"], marketNote: "Chip / local cuisine premium" },
  ],
  grapes: [
    { name: "Thompson Seedless", trait: "Export table grape", season: "Winter / Spring", states: ["Maharashtra", "Karnataka"], marketNote: "Nashik export clusters" },
    { name: "Sharad Seedless", trait: "Black seedless, good shelf", season: "Winter", states: ["Maharashtra"], marketNote: "Domestic + export dual market" },
    { name: "Bangalore Blue", trait: "Juice / wine local type", season: "Year-round flushes", states: ["Karnataka"], marketNote: "Bengaluru processing demand" },
  ],
  capsicum: [
    { name: "Indira", trait: "Blocky green hybrid", season: "Protected / Rabi", states: ["Maharashtra", "Karnataka", "Haryana"], marketNote: "Urban wholesale premium" },
    { name: "Bombay", trait: "Open field green bell", season: "Rabi", states: ["Maharashtra", "Madhya Pradesh"], marketNote: "Steady vegetable mandi" },
  ],
};

const FALLBACK: MarketVarietyRec[] = [
  { name: "Certified local HYV", trait: "Use state seed corporation stock", season: "Main season", states: [], marketNote: "Ask nearest mandi which variety fetches best rate" },
];

function normalizeState(state?: string): string {
  return (state ?? "").trim().toLowerCase();
}

/** Per-crop varieties; prefer those matching farmer state for market tip ordering */
export function getVarietiesForCrop(cropSlug: string, state?: string): MarketVarietyRec[] {
  const slug = cropSlug.trim().toLowerCase();
  const aliased =
    slug === "groundnut" || slug === "mungfali"
      ? "moongfali"
      : slug === "arhar" || slug === "tur" || slug === "pigeonpea"
        ? "pulses"
        : slug === "rice" || slug === "dhaan"
          ? "paddy"
          : slug;

  const list = VARIETIES_BY_CROP[aliased] ?? FALLBACK;
  const s = normalizeState(state);
  if (!s) return list;
  const matched = list.filter((v) => v.states.some((st) => st.toLowerCase() === s));
  const rest = list.filter((v) => !v.states.some((st) => st.toLowerCase() === s));
  return matched.length ? [...matched, ...rest] : list;
}
