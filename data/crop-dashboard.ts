export interface GrowthStageItem {
  id: string;
  name: string;
  dateRange: string;
  status: "completed" | "current" | "upcoming";
  emoji: string;
}

export interface PestDiseaseItem {
  id: string;
  name: string;
  image: string;
  stage: string;
}

export interface ExpertAdviceItem {
  id: string;
  farmerName: string;
  crop: string;
  location: string;
  date: string;
  query: string;
  expertName: string;
  expertDate: string;
  answerPreview: string;
}

export interface BestPracticeItem {
  id: string;
  title: string;
  image?: string;
  emoji?: string;
}

export interface CropDashboardData {
  slug: string;
  name: string;
  emoji: string;
  currentStage: string;
  growthStages: GrowthStageItem[];
  pestsAndDiseases: PestDiseaseItem[];
  expertAdvice: ExpertAdviceItem[];
  bestPractices: BestPracticeItem[];
}

export const myCrops = [
  { slug: "potato", name: "Potato", emoji: "🥔" },
  { slug: "tomato", name: "Tomato", emoji: "🍅" },
  { slug: "paddy", name: "Paddy (Transplanted)", emoji: "🌾" },
];

export const cropDashboardData: Record<string, CropDashboardData> = {
  paddy: {
    slug: "paddy",
    name: "Paddy (Transplanted)",
    emoji: "🌾",
    currentStage: "Tillering",
    growthStages: [
      { id: "1", name: "Field preparation", dateRange: "12 May – 10 Jun", status: "completed", emoji: "🚜" },
      { id: "2", name: "Transplanting", dateRange: "12 May – 10 Jun", status: "completed", emoji: "🌱" },
      { id: "3", name: "Tillering", dateRange: "12 May – 10 Jun", status: "current", emoji: "🌿" },
      { id: "4", name: "Panicle initiation", dateRange: "12 May – 10 Jun", status: "upcoming", emoji: "🌾" },
      { id: "5", name: "Flowering", dateRange: "12 May – 10 Jun", status: "upcoming", emoji: "🌸" },
      { id: "6", name: "Grain filling", dateRange: "12 May – 10 Jun", status: "upcoming", emoji: "🫘" },
      { id: "7", name: "Maturity", dateRange: "12 May – 10 Jun", status: "upcoming", emoji: "✅" },
    ],
    pestsAndDiseases: [
      { id: "1", name: "Army worm", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=200&fit=crop", stage: "Tillering" },
      { id: "2", name: "Ear cutting caterpillar", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", stage: "Tillering" },
      { id: "3", name: "Brown planthopper", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop", stage: "Tillering" },
      { id: "4", name: "Blast disease", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=200&fit=crop", stage: "Tillering" },
    ],
    expertAdvice: [
      {
        id: "1",
        farmerName: "Farmer",
        crop: "Paddy (Transplanted)",
        location: "Punjab",
        date: "12 May 2025",
        query: "leaf problem and fungal growth on paddy leaves during tillering stage. What should I spray?",
        expertName: "Agriveda Expert",
        expertDate: "13 May 2025",
        answerPreview: "Namaste farmer Ji, based on your description this appears to be sheath blight. Apply a recommended fungicide and avoid excess nitrogen...",
      },
    ],
    bestPractices: [
      { id: "1", title: "Climate requirement", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop" },
      { id: "2", title: "Soil requirement", emoji: "🌍" },
      { id: "3", title: "Irrigation schedule", emoji: "💧" },
    ],
  },
  tomato: {
    slug: "tomato",
    name: "Tomato",
    emoji: "🍅",
    currentStage: "Flowering",
    growthStages: [
      { id: "1", name: "Seedling", dateRange: "1 Mar – 25 Mar", status: "completed", emoji: "🌱" },
      { id: "2", name: "Vegetative", dateRange: "26 Mar – 15 Apr", status: "completed", emoji: "🍃" },
      { id: "3", name: "Flowering", dateRange: "16 Apr – 5 May", status: "current", emoji: "🌸" },
      { id: "4", name: "Fruiting", dateRange: "6 May – 30 May", status: "upcoming", emoji: "🍅" },
      { id: "5", name: "Harvest", dateRange: "1 Jun – 20 Jun", status: "upcoming", emoji: "✅" },
    ],
    pestsAndDiseases: [
      { id: "1", name: "Fruit borer", image: "https://images.unsplash.com/photo-1592840067980-057d97d26f4a?w=200&h=200&fit=crop", stage: "Flowering" },
      { id: "2", name: "Early blight", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=200&fit=crop", stage: "Flowering" },
      { id: "3", name: "Whitefly", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", stage: "Flowering" },
    ],
    expertAdvice: [
      {
        id: "1",
        farmerName: "Farmer",
        crop: "Tomato",
        location: "Maharashtra",
        date: "10 Apr 2025",
        query: "Yellowing leaves on lower branches during flowering. Is it a nutrient issue?",
        expertName: "Agriveda Expert",
        expertDate: "11 Apr 2025",
        answerPreview: "This could indicate nitrogen deficiency or early blight. Check for spots on leaves and apply balanced nutrition...",
      },
    ],
    bestPractices: [
      { id: "1", title: "Staking & pruning", emoji: "✂️" },
      { id: "2", title: "Fertigation guide", emoji: "🧪" },
    ],
  },
  potato: {
    slug: "potato",
    name: "Potato",
    emoji: "🥔",
    currentStage: "Tuber bulking",
    growthStages: [
      { id: "1", name: "Planting", dateRange: "15 Oct – 20 Oct", status: "completed", emoji: "🌱" },
      { id: "2", name: "Emergence", dateRange: "25 Oct – 10 Nov", status: "completed", emoji: "🍃" },
      { id: "3", name: "Tuber bulking", dateRange: "11 Nov – 30 Nov", status: "current", emoji: "🥔" },
      { id: "4", name: "Maturity", dateRange: "1 Dec – 15 Dec", status: "upcoming", emoji: "✅" },
    ],
    pestsAndDiseases: [
      { id: "1", name: "Late blight", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=200&fit=crop", stage: "Tuber bulking" },
      { id: "2", name: "Cut worm", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=200&fit=crop", stage: "Tuber bulking" },
    ],
    expertAdvice: [],
    bestPractices: [
      { id: "1", title: "Earthing up", emoji: "⛰️" },
      { id: "2", title: "Storage tips", emoji: "📦" },
    ],
  },
};

export function getCropDashboard(slug: string): CropDashboardData {
  return cropDashboardData[slug] ?? cropDashboardData.paddy;
}
