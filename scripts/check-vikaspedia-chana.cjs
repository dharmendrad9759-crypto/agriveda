const fs = require("fs");

const UA = "AgrivedaAcademicResearch/3.0 (https://agriveda-theta.vercel.app; academic agriculture research)";
async function test() {
  const url = "https://vikaspedia.in/agriculture/crop-production/integrated-pest-management/ipm-for-pulses/chana-ka-uktha-rog";
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  console.log("Vikaspedia chana:", res.status);
  const text = await res.text();
  const re = /src="([^"]+\.(?:jpg|jpeg|png))/gi;
  let m;
  const imgs = [];
  while ((m = re.exec(text)) !== null) {
    imgs.push(m[1]);
  }
  console.log("Imgs:", imgs);
}
test().catch(console.error);
