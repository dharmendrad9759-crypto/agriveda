export interface CommunityQuery {
  id: string;
  farmerName: string;
  crop: string;
  date: string;
  query: string;
  hasAudio: boolean;
  audioDuration: string;
  image?: string;
  expertResponse?: {
    expertName: string;
    date: string;
    preview: string;
    fullAnswer?: string;
  };
  isMine?: boolean;
}

export const communityQueries: CommunityQuery[] = [
  {
    id: "1",
    farmerName: "Farmer",
    crop: "Green Chilli",
    date: "12 May 2025",
    query: "What disease for this. Any bacterial or fungal infection? Leaves are curling and turning yellow from edges.",
    hasAudio: true,
    audioDuration: "0:15",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    expertResponse: {
      expertName: "Agriveda Expert",
      date: "13 May 2025",
      preview: "Namaste farmer Ji, from the photo this looks like leaf curl virus combined with thrips damage...",
      fullAnswer:
        "Namaste farmer Ji, from the photo this looks like leaf curl virus (Begomovirus) combined with thrips (Scirtothrips dorsalis) damage. The upward curling and yellowing from leaf edges is classic virus symptom — thrips are the vector. Immediate steps: (1) Remove and destroy severely affected plants to reduce virus source. (2) Spray Fipronil 0.3 ml/L or Diafenthiuron 1 g/L for thrips control — repeat after 10 days. (3) Apply balanced nutrition — avoid excess nitrogen which makes plants more susceptible. (4) Use yellow sticky traps @ 20/acre for monitoring. For virus-affected fields, use resistant varieties next season (e.g., Arka Gaurav for chilli).",
    },
  },
  {
    id: "2",
    farmerName: "Ramesh Kumar",
    crop: "Tomato",
    date: "10 May 2025",
    query: "Fruit cracking on tomato plants during heavy rainfall. How to prevent this?",
    hasAudio: false,
    audioDuration: "0:00",
    image: "https://images.unsplash.com/photo-1592840067980-057d97d26f4a?w=400&h=300&fit=crop",
    expertResponse: {
      expertName: "Agriveda Expert",
      date: "11 May 2025",
      preview: "Fruit cracking is often due to irregular watering. Maintain consistent soil moisture and apply calcium spray during fruit development...",
    },
  },
  {
    id: "3",
    farmerName: "Farmer",
    crop: "Paddy (Transplanted)",
    date: "8 May 2025",
    query: "Brown spots appearing on paddy leaves at tillering stage. Need urgent advice.",
    hasAudio: true,
    audioDuration: "0:22",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    isMine: true,
    expertResponse: {
      expertName: "Agriveda Expert",
      date: "9 May 2025",
      preview: "This appears to be brown spot disease. Apply a recommended fungicide and avoid excess nitrogen application...",
    },
  },
  {
    id: "4",
    farmerName: "Sunita Devi",
    crop: "Potato",
    date: "5 May 2025",
    query: "White powdery substance on potato leaves. What treatment should I use?",
    hasAudio: false,
    audioDuration: "0:00",
    expertResponse: {
      expertName: "Agriveda Expert",
      date: "6 May 2025",
      preview: "Powdery mildew is common in humid conditions. Improve air circulation and apply sulphur-based fungicide as per label dose...",
    },
  },
];

export const queryCrops = [
  { id: "potato", name: "Potato", emoji: "🥔" },
  { id: "tomato", name: "Tomato", emoji: "🍅" },
  { id: "paddy-t", name: "Paddy (Transplanted)", emoji: "🌾" },
  { id: "paddy-d", name: "Paddy (Dry Seeded)", emoji: "🌾" },
];

export const filterCrops = ["Potato", "Tomato", "Paddy", "Maize", "Chilli", "Wheat"];
