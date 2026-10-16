const fs = require("fs");
const path = require("path");

const UA = "AgrivedaTargetSearch/3.0 (authentic agricultural field photography)";

async function searchCommons(query) {
  const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: "10",
    prop: "imageinfo",
    iiprop: "url|mime|size",
    iiurlwidth: "1280",
  });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  return pages.map(p => ({
    title: p.title,
    url: p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url
  })).filter(x => Boolean(x.url));
}

async function searchInat(term) {
  const url = `https://api.inaturalist.org/v1/observations?q=${encodeURIComponent(term)}&photos=true&per_page=6`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map(r => ({
    id: r.id,
    species: r.taxon?.name,
    common: r.taxon?.preferred_common_name,
    photo: r.photos?.[0]?.url?.replace("/square.", "/large.")
  })).filter(x => Boolean(x.photo));
}

async function test() {
  console.log("=== Cotton Alternaria ===");
  console.log("Commons:", await searchCommons("Alternaria cotton leaf"));
  console.log("iNat:", await searchInat("Alternaria cotton"));

  console.log("=== Banana Panama Disease ===");
  console.log("Commons:", await searchCommons("Panama disease banana"));
  console.log("iNat:", await searchInat("Fusarium banana"));

  console.log("=== Chickpea Ascochyta ===");
  console.log("Commons:", await searchCommons("Ascochyta chickpea"));
  console.log("iNat:", await searchInat("Ascochyta rabiei"));

  console.log("=== Okra Yellow Vein Mosaic ===");
  console.log("Commons:", await searchCommons("yellow vein mosaic okra"));
  console.log("iNat:", await searchInat("yellow vein mosaic Abelmoschus"));
}

test().catch(console.error);
