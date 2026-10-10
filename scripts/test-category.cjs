const UA = "AgrivedaFieldLibrary/2.0 (https://agriveda-theta.vercel.app; authentic farmer field education)";

async function getCategoryFiles(category) {
  const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
    action: "query",
    format: "json",
    generator: "categorymembers",
    gcmtitle: `Category:${category}`,
    gcmtype: "file",
    gcmlimit: "20",
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "1280",
  });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const pages = data.query?.pages || {};
  return Object.values(pages).map(p => {
    const info = p.imageinfo?.[0];
    return {
      title: p.title,
      url: info?.thumburl || info?.url,
      mime: info?.mime,
      size: info?.size,
      desc: info?.extmetadata?.ObjectName?.value || info?.extmetadata?.ImageDescription?.value || ""
    };
  }).filter(p => p.url && (p.mime?.includes("jpeg") || p.mime?.includes("png")));
}

async function test() {
  const testCats = ["Alternaria solani", "Puccinia triticina", "Spodoptera frugiperda", "Colletotrichum capsici"];
  for (const cat of testCats) {
    const files = await getCategoryFiles(cat);
    console.log(`\n=== Category:${cat} found ${files.length} files ===`);
    for (const f of files.slice(0, 4)) {
      console.log(` - ${f.title} (${f.mime})`);
    }
  }
}

test().catch(console.error);
