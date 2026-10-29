import fs from 'fs';

const filePath = 'components/crop-problems/CropProblemDetailClient.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `<p className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                            {isTankMix(c.technical)
                              ? "💡 खाद-बीज दुकान से दोनों टेक्निकल लेकर ऊपर लिखी अलग-अलग मात्रा अनुसार टंकी में घोलें।"
                              : "💡 खाद-बीज दुकान पर केवल यह टेक्निकल नाम बताएं। किसी भी अच्छी कंपनी का यह सॉल्ट खरीद सकते हैं。"}
                          </p>`;

// Replace with normalized whitespace
content = content.replace(
  /\{isTankMix\(c\.technical\)\s*\?\s*"💡 खाद-बीज दुकान से दोनों टेक्निकल लेकर ऊपर लिखी अलग-अलग मात्रा अनुसार टंकी में घोलें\."\s*:\s*"💡 खाद-बीज दुकान पर केवल यह टेक्निकल नाम बताएं। किसी भी अच्छी कंपनी का यह सॉल्ट खरीद सकते हैं\."\}/,
  `{/trap|ल्योर|ट्रैप|चिपचिपे|स्टीकी|fly trap/i.test(c.technical || c.nameHi || "")
                              ? "💡 कृषि सेवा केंद्र से यह ट्रैप/उपकरण खरीद कर खेत में फसल की ऊंचाई अनुसार लगाएं।"
                              : isTankMix(c.technical)
                                ? "💡 खाद-बीज दुकान से दोनों टेक्निकल लेकर ऊपर लिखी अलग-अलग मात्रा अनुसार टंकी में घोलें।"
                                : "💡 खाद-बीज दुकान पर केवल यह टेक्निकल नाम बताएं। किसी भी अच्छी कंपनी का यह सॉल्ट खरीद सकते हैं।"}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleanly patched CropProblemDetailClient.tsx');
