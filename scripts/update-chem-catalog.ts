import fs from 'fs';
import { CHEM_BOTTLE_CATALOG } from '../data/chem-bottle-catalog';

const existingSlugs = new Set(CHEM_BOTTLE_CATALOG.map(c => c.slug));

const newCatalogEntries: any[] = [
  // Fungicides
  { slug: "trifloxystrobin-25-wg", name: "Trifloxystrobin", formulation: "25% WG", category: "fungicide", aliases: ["trifloxystrobin", "flint"] },
  { slug: "metiram-70-wg", name: "Metiram", formulation: "70% WG", category: "fungicide", aliases: ["metiram", "polyram"] },
  { slug: "sulphur-65-wg", name: "Sulphur", formulation: "65% WG", category: "fungicide", aliases: ["sulphur 65", "sulphur 65% wg"] },
  { slug: "fluxapyroxad-250-sc", name: "Fluxapyroxad", formulation: "250 g/L SC", category: "fungicide", aliases: ["fluxapyroxad", "sercadis"] },
  { slug: "amisulbrom-17-7-sc", name: "Amisulbrom", formulation: "17.7% SC", category: "fungicide", aliases: ["amisulbrom", "lieto"] },
  { slug: "tetraconazole-3-8-ew", name: "Tetraconazole", formulation: "3.8% EW", category: "fungicide", aliases: ["tetraconazole", "domark"] },
  { slug: "metrafenone-50-sc", name: "Metrafenone", formulation: "50% SC", category: "fungicide", aliases: ["metrafenone", "vivando"] },
  { slug: "fenamidone-10-sc", name: "Fenamidone", formulation: "10% SC", category: "fungicide", aliases: ["fenamidone", "sectin", "fenamidone 10%"] },
  { slug: "propamocarb-53-2-sl", name: "Propamocarb", formulation: "53.2% SL", category: "fungicide", aliases: ["propamocarb", "previcur", "propamocarb 53.2%"] },
  { slug: "ametoctradin-dimethomorph-sc", name: "Ametoctradin + Dimethomorph", formulation: "525 SC", category: "fungicide", aliases: ["ametoctradin", "zampro", "ametoctradin dimethomorph"] },
  { slug: "benzovindiflupyr-100-ec", name: "Benzovindiflupyr", formulation: "100 EC", category: "fungicide", aliases: ["benzovindiflupyr", "elatus plus", "solatenol"] },
  { slug: "prothioconazole-37-8-sc", name: "Prothioconazole", formulation: "37.8% SC", category: "fungicide", aliases: ["prothioconazole", "proline"] },
  { slug: "oxathiapiprolin-10-1-od", name: "Oxathiapiprolin", formulation: "10.1% OD", category: "fungicide", aliases: ["oxathiapiprolin", "zorvec", "zorvec enicade"] },
  { slug: "cyflufenamid-5-ew", name: "Cyflufenamid", formulation: "5% EW", category: "fungicide", aliases: ["cyflufenamid", "nishiko"] },
  { slug: "pyraziflumid-20-sc", name: "Pyraziflumid", formulation: "20% SC", category: "fungicide", aliases: ["pyraziflumid", "parade"] },
  { slug: "inpyrfluxam-30-sc", name: "Inpyrfluxam", formulation: "30% SC", category: "fungicide", aliases: ["inpyrfluxam", "indiflin"] },
  { slug: "sedaxane-50-fs", name: "Sedaxane", formulation: "50 FS", category: "fungicide", aliases: ["sedaxane", "vibrance"] },
  { slug: "ipflufenoquin-20-sc", name: "Ipflufenoquin", formulation: "20% SC", category: "fungicide", aliases: ["ipflufenoquin"] },
  { slug: "quinofumelin-25-sc", name: "Quinofumelin", formulation: "25% SC", category: "fungicide", aliases: ["quinofumelin"] },
  { slug: "fluoxastrobin-480-sc", name: "Fluoxastrobin", formulation: "480 SC", category: "fungicide", aliases: ["fluoxastrobin", "evito"] },
  { slug: "penthiopyrad-20-sc", name: "Penthiopyrad", formulation: "20% SC", category: "fungicide", aliases: ["penthiopyrad", "fontelis"] },
  { slug: "fluoxapiprolin-10-sc", name: "Fluoxapiprolin", formulation: "10% SC", category: "fungicide", aliases: ["fluoxapiprolin"] },
  { slug: "pydiflumetofen-fludioxonil-sc", name: "Pydiflumetofen + Fludioxonil", formulation: "10% SC", category: "fungicide", aliases: ["pydiflumetofen fludioxonil", "miravis duo"] },

  // Insecticides & Miticides
  { slug: "chlorfenapyr-10-sc", name: "Chlorfenapyr", formulation: "10% SC", category: "insecticide", aliases: ["chlorfenapyr", "intrepid", "keiron"] },
  { slug: "etoxazole-10-sc", name: "Etoxazole", formulation: "10% SC", category: "insecticide", aliases: ["etoxazole", "baroque"] },
  { slug: "fenpyroximate-5-ec", name: "Fenpyroximate", formulation: "5% EC", category: "insecticide", aliases: ["fenpyroximate", "sedna", "pyrote"] },
  { slug: "hexythiazox-5-45-ec", name: "Hexythiazox", formulation: "5.45% EC", category: "insecticide", aliases: ["hexythiazox", "maiden"] },
  { slug: "beta-cyfluthrin-8-49-sc", name: "Beta-cyfluthrin", formulation: "8.49% SC", category: "insecticide", aliases: ["beta-cyfluthrin", "beta cyfluthrin", "solomon"] },
  { slug: "fenpropathrin-10-ec", name: "Fenpropathrin", formulation: "10% EC", category: "insecticide", aliases: ["fenpropathrin", "danitol", "meothrin"] },
  { slug: "fluxametamide-10-ec", name: "Fluxametamide", formulation: "10% EC", category: "insecticide", aliases: ["fluxametamide", "gracia"] },
  { slug: "isocycloseram-10-dc", name: "Isocycloseram", formulation: "10% DC", category: "insecticide", aliases: ["isocycloseram", "simodis", "incipio", "plinazolin"] },
  { slug: "broflanilide-20-sc", name: "Broflanilide", formulation: "20% SC", category: "insecticide", aliases: ["broflanilide", "cimegra"] },
  { slug: "tetraniliprole-200-sc", name: "Tetraniliprole", formulation: "200 g/L SC", category: "insecticide", aliases: ["tetraniliprole", "vayego"] },
  { slug: "flupyradifurone-17-09-sl", name: "Flupyradifurone", formulation: "17.09% SL", category: "insecticide", aliases: ["flupyradifurone", "sivanto", "sivanto prime"] },
  { slug: "sulfoxaflor-21-8-sc", name: "Sulfoxaflor", formulation: "21.8% SC", category: "insecticide", aliases: ["sulfoxaflor", "transform", "isoclast"] },
  { slug: "pyridalyl-10-ec", name: "Pyridalyl", formulation: "10% EC", category: "insecticide", aliases: ["pyridalyl", "pleora"] },
  { slug: "benzpyrimoxan-10-sc", name: "Benzpyrimoxan", formulation: "10% SC", category: "insecticide", aliases: ["benzpyrimoxan", "orchestra"] },
  { slug: "fluazaindolizine-500-sc", name: "Fluazaindolizine", formulation: "500 SC", category: "insecticide", aliases: ["fluazaindolizine", "reklemel"] },
  { slug: "dicloromezotiaz-10-sc", name: "Dicloromezotiaz", formulation: "10% SC", category: "insecticide", aliases: ["dicloromezotiaz", "simpyl"] },
  { slug: "flupyrimin-10-sc", name: "Flupyrimin", formulation: "10% SC", category: "insecticide", aliases: ["flupyrimin"] },
  { slug: "fluensulfone-480-ec", name: "Fluensulfone", formulation: "480 EC", category: "insecticide", aliases: ["fluensulfone", "nimitz"] },
  { slug: "cyflumetofen-20-sc", name: "Cyflumetofen", formulation: "20% SC", category: "insecticide", aliases: ["cyflumetofen", "nealta"] },
  { slug: "acynonapyr-20-sc", name: "Acynonapyr", formulation: "20% SC", category: "insecticide", aliases: ["acynonapyr", "pyranica"] },
  { slug: "pyrifluquinazon-20-sc", name: "Pyrifluquinazon", formulation: "20% SC", category: "insecticide", aliases: ["pyrifluquinazon", "colt"] },
  { slug: "cyhalodiamide-10-sc", name: "Cyhalodiamide", formulation: "10% SC", category: "insecticide", aliases: ["cyhalodiamide"] },
  { slug: "tioxazafen-500-fs", name: "Tioxazafen", formulation: "500 FS", category: "insecticide", aliases: ["tioxazafen"] },
  { slug: "tebufenpyrad-20-wp", name: "Tebufenpyrad", formulation: "20% WP", category: "insecticide", aliases: ["tebufenpyrad", "samurai"] },
  { slug: "methoxyfenozide-150-sc", name: "Methoxyfenozide", formulation: "150 SC", category: "insecticide", aliases: ["methoxyfenozide"] },
  { slug: "etofenprox-10-ew", name: "Etofenprox", formulation: "10% EW", category: "insecticide", aliases: ["etofenprox"] },
  { slug: "metaflumizone-24-sc", name: "Metaflumizone", formulation: "24% SC", category: "insecticide", aliases: ["metaflumizone"] },

  // Herbicides
  { slug: "florpyrauxifen-benzyl-2-7-ec", name: "Florpyrauxifen-benzyl", formulation: "2.7% EC", category: "herbicide", aliases: ["florpyrauxifen benzyl", "novect"] },
  { slug: "halauxifen-methyl-ec", name: "Halauxifen-methyl", formulation: "10% EC", category: "herbicide", aliases: ["halauxifen methyl", "elevore", "arylex"] },
  { slug: "tiafenacil-70-wg", name: "Tiafenacil", formulation: "70% WG", category: "herbicide", aliases: ["tiafenacil", "terrad'or"] },
  { slug: "triafamone-ethoxysulfuron-wg", name: "Triafamone + Ethoxysulfuron", formulation: "30% WG", category: "herbicide", aliases: ["triafamone ethoxysulfuron", "council activ"] },
  { slug: "flumioxazin-50-sc", name: "Flumioxazin", formulation: "50% SC", category: "herbicide", aliases: ["flumioxazin", "sumimax"] },
  { slug: "haloxyfop-r-methyl-10-5-ec", name: "Haloxyfop-R-methyl", formulation: "10.5% EC", category: "herbicide", aliases: ["haloxyfop r methyl", "gallant"] },
  { slug: "bicyclopyrone-ec", name: "Bicyclopyrone", formulation: "10% EC", category: "herbicide", aliases: ["bicyclopyrone", "acuron"] },
  { slug: "cinmethylin-ec", name: "Cinmethylin", formulation: "75% EC", category: "herbicide", aliases: ["cinmethylin", "luximo"] },
  { slug: "tetflupyrolimet-sc", name: "Tetflupyrolimet", formulation: "10% SC", category: "herbicide", aliases: ["tetflupyrolimet"] },
  { slug: "trifludimoxazin-wg", name: "Trifludimoxazin", formulation: "50% WG", category: "herbicide", aliases: ["trifludimoxazin", "tirexor"] },
  { slug: "saflufenacil-70-wg", name: "Saflufenacil", formulation: "70% WG", category: "herbicide", aliases: ["saflufenacil", "kixor"] },
  { slug: "indaziflam-500-sc", name: "Indaziflam", formulation: "500 SC", category: "herbicide", aliases: ["indaziflam", "alion"] },
  { slug: "cypyrafluone-sc", name: "Cypyrafluone", formulation: "10% SC", category: "herbicide", aliases: ["cypyrafluone"] },
  { slug: "tripyrasulfone-sc", name: "Tripyrasulfone", formulation: "10% SC", category: "herbicide", aliases: ["tripyrasulfone"] },
  { slug: "epyrifenacil-ec", name: "Epyrifenacil", formulation: "10% EC", category: "herbicide", aliases: ["epyrifenacil"] },
  { slug: "fenquinotrione-sc", name: "Fenquinotrione", formulation: "10% SC", category: "herbicide", aliases: ["fenquinotrione"] },
  { slug: "ethalfluralin-35-4-ec", name: "Ethalfluralin", formulation: "35.4% EC", category: "herbicide", aliases: ["ethalfluralin", "sonalan"] },
  { slug: "anilofos-30-ec", name: "Anilofos", formulation: "30% EC", category: "herbicide", aliases: ["anilofos"] },
  { slug: "trifluralin-48-ec", name: "Trifluralin", formulation: "48% EC", category: "herbicide", aliases: ["trifluralin"] },
  { slug: "alachlor-50-ec", name: "Alachlor", formulation: "50% EC", category: "herbicide", aliases: ["alachlor"] },
  { slug: "paraquat-dichloride-24-sl", name: "Paraquat Dichloride", formulation: "24% SL", category: "herbicide", aliases: ["paraquat", "paraquat dichloride"] },
  { slug: "nicosulfuron-75-wg", name: "Nicosulfuron", formulation: "75% WG", category: "herbicide", aliases: ["nicosulfuron"] },

  // Plant Growth Regulators
  { slug: "prohexadione-calcium-wdg", name: "Prohexadione-calcium", formulation: "10% WDG", category: "pgr", aliases: ["prohexadione calcium", "prohexadione"] },
  { slug: "homobrassinolide-0-04", name: "Homobrassinolide", formulation: "0.04%", category: "pgr", aliases: ["homobrassinolide"] },
  { slug: "seaweed-amino-acids", name: "Seaweed + Amino Acids", formulation: "Bio-stimulant", category: "pgr", aliases: ["seaweed amino acids", "seaweed viricide"] },
  { slug: "chlormequat-chloride-50-sl", name: "Chlormequat Chloride", formulation: "50% SL", category: "pgr", aliases: ["chlormequat chloride", "lihocin"] },
  { slug: "prohydrojasmon-5-sl", name: "Prohydrojasmon", formulation: "5% SL", category: "pgr", aliases: ["prohydrojasmon"] },
  { slug: "1-methylcyclopropene-1-mcp", name: "1-Methylcyclopropene", formulation: "3.3% VP", category: "pgr", aliases: ["1-methylcyclopropene", "1-mcp"] },
  { slug: "thidiazuron-50-wp", name: "Thidiazuron", formulation: "50% WP", category: "pgr", aliases: ["thidiazuron", "dropp"] },
];

const toAdd = newCatalogEntries.filter(e => !existingSlugs.has(e.slug));
console.log(`Adding ${toAdd.length} new entries to CHEM_BOTTLE_CATALOG`);

const catalogPath = 'data/chem-bottle-catalog.ts';
let catalogContent = fs.readFileSync(catalogPath, 'utf8');

const insertMarker = 'export const CHEM_BOTTLE_CATALOG: ChemBottleEntry[] = [';
const insertIdx = catalogContent.indexOf(insertMarker);

if (insertIdx === -1) {
  throw new Error('Could not find insertMarker in chem-bottle-catalog.ts');
}

const entriesStr = toAdd.map(e => `  {\n    slug: ${JSON.stringify(e.slug)},\n    name: ${JSON.stringify(e.name)},\n    formulation: ${JSON.stringify(e.formulation)},\n    category: ${JSON.stringify(e.category)},\n    aliases: ${JSON.stringify(e.aliases)},\n  },`).join('\n');

const newContent =
  catalogContent.substring(0, insertIdx + insertMarker.length) +
  '\n' +
  entriesStr +
  catalogContent.substring(insertIdx + insertMarker.length);

fs.writeFileSync(catalogPath, newContent, 'utf8');
console.log('Successfully updated data/chem-bottle-catalog.ts');
