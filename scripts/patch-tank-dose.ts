import fs from 'fs';

const filePath = 'lib/crops/tankDose.ts';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update ApplicationMethod
const oldType = `  | "drench_irrigation"  // सिंचाई के पानी के साथ बहाना / जड़ों में ड्रेंचिंग\r\n  | "foliar_spray";`;
const oldTypeLF = `  | "drench_irrigation"  // सिंचाई के पानी के साथ बहाना / जड़ों में ड्रेंचिंग\n  | "foliar_spray";`;

const newType = `  | "drench_irrigation"  // सिंचाई के पानी के साथ बहाना / जड़ों में ड्रेंचिंग
  | "poison_bait"        // चोकर + गुड़ + कीटनाशक चारा विधि
  | "trap_device"        // फेरोमोन / फलमक्खी ट्रैप
  | "foliar_spray";`;

if (content.includes(oldType)) {
  content = content.replace(oldType, newType.replace(/\n/g, '\r\n'));
} else if (content.includes(oldTypeLF)) {
  content = content.replace(oldTypeLF, newType);
} else {
  console.log('Could not find oldType in tankDose.ts');
}

// 2. Add trap_device & poison_bait before foliar spray
const marker = '  // 4. Foliar Spray (पत्तियों पर 15L ढोलकी टंकी से छिड़काव)';
const trapAndBaitLogic = `  // 3b. Trap Device check (फेरोमोन / फलमक्खी ट्रैप / चिपचिपे कार्ड)
  const isTrap = /trap|ल्योर|ट्रैप|चिपचिपे|स्टीकी|fly trap/i.test(raw);
  if (isTrap) {
    const trapCountMatch = raw.match(/(\\d+(?:\\s*[-–से]\\s*\\d+)?\\s*ट्रैप)/i);
    const trapCount = trapCountMatch ? trapCountMatch[0] : "4–6 ट्रैप प्रति एकड़";

    return {
      method: "trap_device",
      methodLabel: "ट्रैप विधि (कीट आकर्षण व खात्मा)",
      isSpray: false,
      pill1: {
        icon: "🪤",
        label: "उपकरण प्रकार",
        value: "ट्रैप / ल्योर",
        subtext: "खेत में टांगें",
      },
      pill2: {
        icon: "🌾",
        label: "प्रति एकड़ संख्या",
        value: trapCount,
        subtext: "फसल से 1 फुट ऊपर",
      },
      pill3: {
        icon: "🎯",
        label: "प्रयोग विधि",
        value: "खेत में लगाएं",
        subtext: "कीटों की निगरानी व खात्मा",
      },
      useSticker: false,
      doctorTip: "ट्रैप को फसल की ऊंचाई से 1 फुट ऊपर लगाएं और समय-समय पर ल्यूर बदलते रहें।",
      voiceActionLine: \`खेत में \${trapCount} लगाएं ताकि कीट आकर्षित होकर फंस जाएं।\`,
      tankDose: "लागू नहीं (स्प्रे पंप में न भरें)",
      acreDose: trapCount,
      waterVolume: "पानी की आवश्यकता नहीं",
      perLitre: "लागू नहीं",
      raw,
    };
  }

  // 3c. Poison Bait check (चोकर + गुड़ चारा विधि)
  const isBait = /(?:चारा|गुड़|शीरा|चोकर|बेसन|bait)/i.test(raw) && !/लीटर\\s*पानी\\s*में\\s*घोलकर\\s*स्प्रे/i.test(raw);
  if (isBait) {
    return {
      method: "poison_bait",
      methodLabel: "चारा विधि (Poison Bait)",
      isSpray: false,
      pill1: {
        icon: "🪤",
        label: "प्रयोग की विधि",
        value: "चारा विधि",
        subtext: "ढेला बनाकर रखें",
      },
      pill2: {
        icon: "🥣",
        label: "मिश्रण सामग्री",
        value: "चोकर + गुड़ + दवा",
        subtext: "शाम के समय रखें",
      },
      pill3: {
        icon: "🌾",
        label: "प्रयोग क्षेत्र",
        value: "खेत में जगह-जगह रखें",
        subtext: "कीट आकर्षित होकर मरेंगे",
      },
      useSticker: false,
      doctorTip: "चोकर, गुड़ और कीटनाशक मिलाकर छोटे-छोटे ढेले बनाएं और शाम को खेत में पौधों के पास रखें।",
      voiceActionLine: "चोकर और गुड़ के साथ कीटनाशक मिलाकर शाम के समय खेत में जगह-जगह रखें।",
      tankDose: "लागू नहीं (स्प्रे पंप में न भरें)",
      acreDose: "10 किग्रा चोकर + 1 किग्रा गुड़",
      waterVolume: "हल्का पानी (गीला करने हेतु)",
      perLitre: "लागू नहीं",
      raw,
    };
  }

`;

if (content.includes(marker)) {
  content = content.replace(marker, trapAndBaitLogic + marker);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated lib/crops/tankDose.ts with trap_device and poison_bait!');
} else {
  console.log('Could not find marker in tankDose.ts');
}
