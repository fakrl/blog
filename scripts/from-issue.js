// Baca isi Issue Form (env ISSUE_BODY) -> buat post. Output ke $GITHUB_OUTPUT: slug, published, placeholder.
const fs = require("fs");
const { generate, slugify } = require("./gen");

const body = process.env.ISSUE_BODY || "";
const fields = {};
body.split(/^### /m).slice(1).forEach((blk) => {
  const [head, ...rest] = blk.split("\n");
  const v = rest.join("\n").trim();
  fields[head.trim()] = v === "_No response_" ? "" : v;
});

const lines = (s) => (s || "").split("\n").map((l) => l.trim()).filter(Boolean);
const title = fields["Judul"];
if (!title) { console.error("Judul kosong"); process.exit(1); }

const images = [];
for (const l of lines(fields["Gambar"])) {
  // Bentuk: ![alt](url) atau <img src="url"> (hasil drag-drop GitHub) atau "url | keterangan"
  let m = l.match(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/);
  if (m) { images.push({ url: m[2], caption: m[1] && !/^image$/i.test(m[1]) ? m[1] : "" }); continue; }
  m = l.match(/<img[^>]*src="([^"]+)"[^>]*>/i);
  if (m) { images.push({ url: m[1], caption: "" }); continue; }
  m = l.match(/^(https?:\/\/\S+)(?:\s*\|\s*(.+))?$/);
  if (m) images.push({ url: m[1], caption: (m[2] || "").trim() });
}
const links = lines(fields["Tautan (backlink)"]).map((l) => {
  const [url, anchor] = l.split("|").map((s) => s.trim());
  return { url, anchor };
});

const item = {
  title,
  slug: slugify(fields["Slug (opsional)"] || title),
  description: fields["Deskripsi singkat (opsional)"] || "",
  tags: (fields["Tag (pisah koma)"] || "").split(",").map((t) => t.trim()).filter(Boolean),
  angle: fields["Sudut / pesan utama (opsional)"] || "",
  facts: lines(fields["Fakta (dari pengalaman lu sendiri)"]).map((l) => l.replace(/^[-*]\s*/, "")),
  images, links,
};
if (!item.facts.length) { console.error("Fakta kosong"); process.exit(1); }
const wantPublish = /terbitkan/i.test(fields["Mode"] || "");

generate(item, { publish: wantPublish }).then((r) => {
  console.log("Post dibuat:", r.slug, "published:", r.published, "placeholder:", r.hasPlaceholder);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `slug=${r.slug}\npublished=${r.published}\nplaceholder=${r.hasPlaceholder}\n`);
}).catch((e) => { console.error(e.message); process.exit(1); });
