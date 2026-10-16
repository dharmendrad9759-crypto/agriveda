const fs = require("fs");
const path = require("path");

const UA = "Agriveda/3.0";
async function check() {
  const url = "https://api.inaturalist.org/v1/observations?taxon_name=Cicer+arietinum&photos=true&per_page=15";
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const data = await res.json();
  for (const r of data.results || []) {
    console.log(r.id, "desc:", r.description || "(none)", "photos:", (r.photos || []).map(p => p.url?.replace("/square.", "/large.")));
  }
}
check().catch(console.error);
