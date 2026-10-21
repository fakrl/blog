// Bikin DRAFT post dari antrean topik (scripts/queue.json) pakai Gemini.
// Aturan: hanya boleh memakai "facts" yang kamu tulis sendiri. Hasil selalu draft: true.
// Pakai: GEMINI_API_KEY=... node scripts/draft.js
const fs = require("fs");
const path = require("path");

const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const QUEUE = path.join(__dirname, "queue.json");
const POSTS = path.join(__dirname, "..", "posts");

if (!KEY) { console.log("GEMINI_API_KEY kosong, lewati."); process.exit(0); }

const queue = JSON.parse(fs.readFileSync(QUEUE, "utf8"));
const item = queue.find((q) => !q.done && !fs.existsSync(path.join(POSTS, q.slug + ".md")));
if (!item) { console.log("Antrean kosong, tidak ada draft baru."); process.exit(0); }

const prompt = `Tulis satu post blog pendek (250-400 kata) dalam bahasa Indonesia santai, sudut pandang orang pertama ("gua"), untuk blog developer pribadi.

ATURAN KERAS:
- Pakai HANYA fakta di bagian FAKTA. Jangan menambah pengalaman, angka, nama perusahaan, tool, atau cerita yang tidak tertulis di sana.
- Kalau butuh detail yang tidak ada di FAKTA, tulis penanda [ISI: apa yang dibutuhkan] alih-alih mengarang.
- Jangan sebut klien, nama orang, data pribadi, atau rahasia kerja.
- Jangan pakai em-dash berlebihan. Gaya jujur, tidak lebay, tidak promosi.
- Format Markdown, pakai heading ##, tanpa heading H1. Jangan tulis front matter.

JUDUL: ${item.title}
SUDUT: ${item.angle || "pelajaran yang bisa dipakai pembaca"}
FAKTA:
${item.facts.map((f) => "- " + f).join("\n")}`;

(async () => {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6 } }),
  });
  if (!res.ok) { console.error("Gemini error", res.status, await res.text()); process.exit(1); }
  const data = await res.json();
  const body = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim();
  if (!body) { console.error("Respons kosong"); process.exit(1); }

  const today = new Date().toISOString().slice(0, 10);
  const q = (s) => String(s).replace(/\n/g, " ");
  const md = `---\ntitle: ${q(item.title)}\ndescription: ${q(item.description || item.title)}\ndate: ${today}\ntags: [${(item.tags || []).join(", ")}]\ndraft: true\n---\n\n${body}\n`;
  fs.writeFileSync(path.join(POSTS, item.slug + ".md"), md);
  item.done = true;
  fs.writeFileSync(QUEUE, JSON.stringify(queue, null, 2) + "\n");
  console.log("Draft dibuat: posts/" + item.slug + ".md");
})();
