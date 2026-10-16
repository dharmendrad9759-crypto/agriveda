const fs = require("fs");

const UA = "AgrivedaAcademicResearch/3.0 (https://agriveda-theta.vercel.app; academic plant health research)";
async function run() {
  const url = "https://gd.eppo.int/taxon/ALTEMC/photos";
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const html = await res.text();
  const re = /href="([^"]+)"/gi;
  let m;
  const links = [];
  while ((m = re.exec(html)) !== null) {
    if (m[1].includes("/media/") || m[1].includes("/picture/")) {
      links.push(m[1]);
    }
  }
  console.log("EPPO links:", links);
}
run().catch(console.error);
