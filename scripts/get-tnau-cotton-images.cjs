const fs = require("fs");

const UA = "Agriveda/3.0";
async function run() {
  const url = "https://agritech.tnau.ac.in/crop_protection/cotton_diseases/cotton_d6.html";
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  console.log(url, res.status);
  const html = await res.text();
  const imgs = [];
  const re = /src="([^"]+\.(?:jpg|jpeg|png|gif))/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    imgs.push(m[1]);
  }
  console.log("Images found in cotton_d6.html:", imgs);
}
run().catch(console.error);
