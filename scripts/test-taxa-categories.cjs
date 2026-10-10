const UA = "AgrivedaFieldLibrary/3.0 (https://agriveda-theta.vercel.app; authentic field diagnostic photography)";

async function getCategoryMembers(cat) {
  const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
    action: "query",
    format: "json",
    generator: "categorymembers",
    gcmtitle: `Category:${cat}`,
    gcmtype: "file",
    gcmlimit: "30",
    prop: "imageinfo",
    iiprop: "url|mime|size",
    iiurlwidth: "1280",
  });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  return pages.map(p => {
    const info = p.imageinfo?.[0];
    return {
      title: p.title,
      url: info?.thumburl || info?.url,
      mime: info?.mime,
      size: info?.size
    };
  }).filter(p => p.url && (p.mime?.includes("jpeg") || p.mime?.includes("png")));
}

async function test() {
  const cats = [
    "Myzus persicae",
    "Liriomyza",
    "Ralstonia solanacearum",
    "Potato virus Y",
    "Streptomyces scabies"
  ];
  for (const cat of cats) {
    const files = await getCategoryMembers(cat);
    console.log(`\n=== Category:${cat} (${files.length} files) ===`);
    for (const f of files.slice(0, 5)) {
      console.log(` - ${f.title}`);
    }
  }
}

test();
