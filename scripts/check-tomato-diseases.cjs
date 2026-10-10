async function main() {
  const res = await fetch("http://127.0.0.1:3000/crops/tomato/care/diseases");
  const html = await res.text();
  const imgs = [...html.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
  console.log("Images on tomato care diseases page:", imgs);
}
main().catch(console.error);
