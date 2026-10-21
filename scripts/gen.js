// Inti generator: item topik -> isi post Markdown lewat Gemini. Dipakai draft.js (antrean) dan from-issue.js (form).
const fs = require("fs");
const path = require("path");
const POSTS = path.join(__dirname, "..", "posts");
const IMG = path.join(__dirname, "..", "static", "img");
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const slugify = (s) => String(s).toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 70);

async function callGemini(prompt) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6 } }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const body = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim();
  if (!body) throw new Error("Respons Gemini kosong");
  return body;
}

// Unduh gambar ke static/img/<slug>/ supaya tidak bergantung URL luar.
async function saveImages(slug, images) {
  const out = [];
  let n = 0;
  for (const im of images) {
    try {
      const res = await fetch(im.url, { redirect: "follow" });
      if (!res.ok) throw new Error(res.status);
      const type = res.headers.get("content-type") || "";
      const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : type.includes("gif") ? "gif" : type.includes("jpeg") || type.includes("jpg") ? "jpg" : null;
      if (!ext) throw new Error("bukan gambar: " + type);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > 3 * 1024 * 1024) throw new Error("lebih dari 3 MB");
      const dir = path.join(IMG, slug);
      fs.mkdirSync(dir, { recursive: true });
      n += 1;
      const file = `${n}.${ext}`;
      fs.writeFileSync(path.join(dir, file), buf);
      out.push({ src: `/img/${slug}/${file}`, alt: im.caption || "" , caption: im.caption || "" });
    } catch (e) {
      console.warn("Lewati gambar", im.url, "-", e.message);
    }
  }
  return out;
}

async function generate(item, opts = {}) {
  const slug = item.slug || slugify(item.title);
  const file = path.join(POSTS, slug + ".md");
  if (fs.existsSync(file)) throw new Error("Slug sudah ada: " + slug);

  const links = (item.links || []).filter((l) => /^https?:\/\//.test(l.url));
  const images = await saveImages(slug, item.images || []);

  const prompt = `Tulis satu post blog (250-450 kata) dalam bahasa Indonesia santai, sudut pandang orang pertama ("gua"), untuk blog developer pribadi.

ATURAN KERAS:
- Pakai HANYA fakta di bagian FAKTA. Jangan menambah pengalaman, angka, nama perusahaan, tool, atau cerita yang tidak tertulis di sana.
- Kalau butuh detail yang tidak ada di FAKTA, tulis penanda [ISI: apa yang dibutuhkan] alih-alih mengarang.
- Jangan sebut klien, nama orang, data pribadi, atau rahasia kerja.
- Gaya jujur, tidak lebay, tidak promosi, jangan pakai em-dash berlebihan.
- Format Markdown, heading ##, tanpa H1, tanpa front matter.
${links.length ? "- Sisipkan tautan berikut secara natural di kalimat yang relevan, dengan format [teks](url):\n" + links.map((l) => `  * ${l.url} (teks tautan: ${l.anchor || "bacaan terkait"})`).join("\n") : ""}
${images.length ? "- Tulis penanda baris tunggal {{GAMBAR 1}}, {{GAMBAR 2}}, dst di tempat gambar paling pas (total " + images.length + " gambar, tiap penanda dipakai sekali, jangan menulis gambar sendiri).\n" : ""}
JUDUL: ${item.title}
SUDUT: ${item.angle || "pelajaran yang bisa dipakai pembaca"}
FAKTA:
${item.facts.map((f) => "- " + f).join("\n")}`;

  let body = await callGemini(prompt);

  // Gambar: ganti penanda; sisa gambar yang tidak dipakai ditaruh di akhir.
  const used = new Set();
  body = body.replace(/\{\{GAMBAR (\d+)\}\}/g, (_, i) => {
    const im = images[Number(i) - 1];
    if (!im || used.has(i)) return "";
    used.add(i);
    return `![${im.alt}](${im.src})` + (im.caption ? `\n*${im.caption}*` : "");
  });
  images.forEach((im, idx) => {
    if (!used.has(String(idx + 1))) body += `\n\n![${im.alt}](${im.src})` + (im.caption ? `\n*${im.caption}*` : "");
  });
  // Tautan: kalau Gemini tidak memasukkan, taruh di bagian Referensi.
  const missing = links.filter((l) => !body.includes(l.url));
  if (missing.length) body += `\n\n## Referensi\n\n` + missing.map((l) => `- [${l.anchor || l.url}](${l.url})`).join("\n");

  const hasPlaceholder = /\[ISI/.test(body);
  const publish = opts.publish && !hasPlaceholder;
  const today = new Date().toISOString().slice(0, 10);
  const q = (s) => String(s).replace(/\n/g, " ");
  const md = `---\ntitle: ${q(item.title)}\ndescription: ${q(item.description || item.title)}\ndate: ${today}\ntags: [${(item.tags || []).join(", ")}]\n${publish ? "" : "draft: true\n"}---\n\n${body}\n`;
  fs.writeFileSync(file, md);
  return { slug, file, published: publish, hasPlaceholder };
}

module.exports = { generate, slugify };
