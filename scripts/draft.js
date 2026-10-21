// Draft dari antrean (scripts/queue.json). Selalu draft: true. Pakai: GEMINI_API_KEY=... node scripts/draft.js
const fs = require("fs");
const path = require("path");
const { generate } = require("./gen");
if (!process.env.GEMINI_API_KEY) { console.log("GEMINI_API_KEY kosong, lewati."); process.exit(0); }
const QUEUE = path.join(__dirname, "queue.json");
const queue = JSON.parse(fs.readFileSync(QUEUE, "utf8"));
const item = queue.find((q) => !q.done && !fs.existsSync(path.join(__dirname, "..", "posts", q.slug + ".md")));
if (!item) { console.log("Antrean kosong, tidak ada draft baru."); process.exit(0); }
generate(item, { publish: false })
  .then((r) => { item.done = true; fs.writeFileSync(QUEUE, JSON.stringify(queue, null, 2) + "\n"); console.log("Draft dibuat:", r.slug); })
  .catch((e) => { console.error(e.message); process.exit(1); });
