const IMG = "/images/threats/threat-insect.jpg";
const IMG2 = "/images/threats/threat-disease.jpg";

export const MEDICINE_LIST_EXTRAS: Record<
  string,
  {
    pests: { id: string; name: string; scientificName: string; image: string; stage: string; iracGroup?: string; control?: string }[];
    diseases: { id: string; name: string; pathogen: string; image: string; stage: string; fracGroup?: string; control?: string }[];
  }
> = {
  cauliflower: {
    pests: [
      { id: "px1", name: "कटवर्म / कुतरने वाली सुंडी", scientificName: "agrotis ipsilon", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
    diseases: [
      { id: "dx1", name: "क्लबरूट / गांठ रोग", pathogen: "plasmodiophora brassicae", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "dx2", name: "सॉफ्ट रॉट / डंठल सड़न", pathogen: "pectobacterium carotovorum", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
  },
  brinjal: {
    pests: [
      { id: "px1", name: "माहूँ / एफिड", scientificName: "aphis gossypii", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
    diseases: [
      { id: "dx1", name: "अल्टरनेरिया पर्ण धब्बा", pathogen: "alternaria melongenae", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
  },
  chilli: {
    pests: [

    ],
    diseases: [
      { id: "dx1", name: "फाइटोफ्थोरा ब्लाइट / कॉलर व जड़ सड़न", pathogen: "phytophthora capsici", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
  },
  moongfali: {
    pests: [
      { id: "px1", name: "जैसिड / तेला / लीफहॉपर", scientificName: "empoasca kerri", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "px2", name: "माहूँ / एफिड", scientificName: "aphis craccivora", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
    diseases: [
      { id: "dx1", name: "अल्टरनेरिया पत्ती धब्बा / झुलसा", pathogen: "alternaria arachidis", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "dx2", name: "जड़ सड़न एवं एफ्लाटॉक्सिन प्रबंधन", pathogen: "aspergillus flavus", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
  },
  mustard: {
    pests: [
      { id: "px1", name: "हीरक पृष्ठ पतंगा / डीबीएम", scientificName: "plutella xylostella", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
    diseases: [

    ],
  },
  soybean: {
    pests: [
      { id: "px1", name: "एफिड / माहू", scientificName: "aphis glycines", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
    diseases: [
      { id: "dx1", name: "बैक्टीरियल पुस्ट्यूल / जीवाणु फफोला", pathogen: "xanthomonas axonopodis pv. glycines", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
  },
  chana: {
    pests: [
      { id: "px1", name: "एफिड / माहू", scientificName: "aphis craccivora", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "px2", name: "दाल का घुन / ब्रूकिड्स", scientificName: "callosobruchus chinensis", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
    diseases: [
      { id: "dx1", name: "सूखी जड़ सड़न", pathogen: "rhizoctonia bataticola", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "dx2", name: "कॉलर रॉट", pathogen: "sclerotium rolfsii", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "dx3", name: "बोट्राइटिस ग्रे मोल्ड", pathogen: "botrytis cinerea", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
  },
  masoor: {
    pests: [
      { id: "px1", name: "कटवर्म", scientificName: "agrotis ipsilon", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
    diseases: [
      { id: "dx1", name: "कॉलर रॉट एवं जड़ सड़न", pathogen: "sclerotium rolfsii", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "dx2", name: "एस्कोचाइटा झुलसा", pathogen: "ascochyta lentis", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
  },
  urad: {
    pests: [
      { id: "px1", name: "थ्रिप्स / फूल का थ्रिप्स", scientificName: "megalurothrips distalis", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "px2", name: "तंबाकू इल्ली एवं सेमीलूपर", scientificName: "spodoptera litura", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
    diseases: [
      { id: "dx1", name: "सर्कोस्पोरा पत्ती धब्बा", pathogen: "cercospora canescens", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "dx2", name: "जड़ सड़न एवं कॉलर रॉट", pathogen: "Macrophomina phaseolina", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "dx3", name: "एन्थ्रेक्नोज़ / फल झुलसा", pathogen: "colletotrichum lindemuthianum", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
  },
  ginger: {
    pests: [
      { id: "px1", name: "प्रकंद मक्खी / राइजोम फ्लाई", scientificName: "mimegralla coeruleifrons", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "px2", name: "जड़-गांठ सूत्रकृमि / नेमाटोड", scientificName: "meloidogyne incognita", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "px3", name: "शल्क कीट / स्केल", scientificName: "aspidiella hartii", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
    diseases: [
      { id: "dx1", name: "जीवाणु मुरझान", pathogen: "ralstonia solanacearum", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "dx2", name: "फ्यूज़ेरियम शुष्क प्रकंद सड़न", pathogen: "fusarium oxysporum f. sp. zingiberi", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
  },
  garlic: {
    pests: [
      { id: "px1", name: "कंद माइट / एरियोफिड माइट", scientificName: "aceria tulipae", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "px2", name: "कटवर्म / कुतरने वाली इल्ली", scientificName: "agrotis ipsilon", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "px3", name: "मैगट / मक्खी", scientificName: "delia antiqua", image: IMG, stage: "खेत", iracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
    diseases: [
      { id: "dx1", name: "स्टेम्फीलियम ब्लाइट", pathogen: "stemphylium vesicarium", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "dx2", name: "सफेद सड़न / व्हाइट रॉट", pathogen: "sclerotium cepivorum", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
      { id: "dx3", name: "डाउनी मिल्ड्यू", pathogen: "peronospora destructor", image: IMG2, stage: "खेत", fracGroup: "—", control: "खेत वाली पूरी दवा इसी पेज पर है" },
    ],
  },
};
