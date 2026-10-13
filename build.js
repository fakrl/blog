// Static builder for notes.fakrul.dev
// posts/*.md + pages/*.md (front matter) -> dist/. Only dependency: marked.
const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const SITE = "https://notes.fakrul.dev";
const NAME = "Notes";
const TAGLINE = "Catatan soal ngoding, kuliah, dan hal yang lagi dipelajari.";
const AUTHOR = "Fakhrul Mukhlisin";
const PORTFOLIO = "https://fakrul.dev";
const OUT = process.env.OUT_DIR || path.join(__dirname, "dist");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmtDate = (d) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parse(file) {
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(file + ": front matter missing");
  const meta = {};
  m[1].split("\n").forEach((l) => {
    const i = l.indexOf(":");
    if (i < 0) return;
    let v = l.slice(i + 1).trim();
    if (v.startsWith("[")) v = v.slice(1, -1).split(",").map((x) => x.trim()).filter(Boolean);
    meta[l.slice(0, i).trim()] = v;
  });
  ["title", "description", "date"].forEach((k) => { if (!meta[k]) throw new Error(file + ": missing " + k); });
  if (meta.description.length > 170) console.warn(`! ${file}: description ${meta.description.length} chars (ideal <= 160)`);
  if (meta.title.length > 70) console.warn(`! ${file}: title ${meta.title.length} chars (ideal <= 60)`);
  meta.slug = path.basename(file, ".md");
  meta.tags = meta.tags || [];
  meta.html = marked.parse(m[2]);
  meta.words = m[2].split(/\s+/).length;
  return meta;
}

const ADS_CLIENT = process.env.ADSENSE_CLIENT || ""; // contoh: ca-pub-1234567890123456 (set di Netlify env saat AdSense aktif)

const css = `
:root{--bg:#f8f8f6;--fg:#0a0a0a;--sec:#555;--mut:#8a8a8a;--glass:rgba(255,255,255,.55);--glass-h:rgba(255,255,255,.85);--line:rgba(0,0,0,.08);--shadow:0 8px 32px rgba(0,0,0,.08);--shadow-h:0 16px 48px rgba(0,0,0,.13);--code:rgba(0,0,0,.05);--pill:rgba(255,255,255,.72);--tbtn:rgba(0,0,0,.06);--frame:#0a0a0a;--hov:rgba(0,0,0,.06)}
:root[data-theme=dark]{--bg:#080808;--fg:#f0f0f0;--sec:#a0a0a0;--mut:#666;--glass:rgba(255,255,255,.05);--glass-h:rgba(255,255,255,.09);--line:rgba(255,255,255,.1);--shadow:0 8px 32px rgba(0,0,0,.5);--shadow-h:0 16px 48px rgba(0,0,0,.65);--code:rgba(255,255,255,.07);--pill:rgba(18,18,18,.7);--tbtn:rgba(255,255,255,.07);--frame:#f0f0f0;--hov:rgba(255,255,255,.08)}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-padding-top:90px;overflow-x:hidden}
body{background:var(--bg);color:var(--fg);font:16.5px/1.75 'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;transition:background .5s ease,color .5s ease;min-height:100vh;padding-top:96px}
a{color:var(--fg);text-underline-offset:3px}
.msym{font-family:'Material Symbols Rounded';font-weight:normal;font-style:normal;line-height:1;letter-spacing:normal;text-transform:none;white-space:nowrap;direction:ltr;display:inline-block;-webkit-font-smoothing:antialiased;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-size:1.15em;vertical-align:-.18em;user-select:none;transition:transform .25s cubic-bezier(.2,0,0,1)}
.navbar{position:fixed;top:18px;left:50%;transform:translateX(-50%);width:auto;max-width:calc(100% - 2rem);padding:.5rem .7rem .5rem 1.5rem;display:flex;align-items:center;gap:1.8rem;z-index:1000;border-radius:999px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:var(--pill);border:1px solid var(--line);box-shadow:var(--shadow);transition:background .5s ease,border-color .5s ease}
.nav-logo{display:flex;align-items:center;text-decoration:none}.nav-logo img{height:32px;width:auto;object-fit:contain}
.nav-links{display:flex;gap:.2rem;list-style:none}
.nav-links a{text-decoration:none;font-weight:500;font-size:.85rem;letter-spacing:.2px;padding:.4rem .85rem;border-radius:999px;color:var(--sec);transition:color .2s,background .2s;display:inline-block}
.nav-links a:hover,.nav-links a.active{color:var(--fg);background:var(--hov)}
.hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:5px;z-index:1001}.hamburger span{width:22px;height:2px;background:var(--fg);transition:all .3s ease}
.hamburger.active span:nth-child(1){transform:rotate(45deg) translate(7px,7px)}.hamburger.active span:nth-child(2){opacity:0}.hamburger.active span:nth-child(3){transform:rotate(-45deg) translate(6px,-5px)}
.circ{position:fixed;border-radius:50%;border:1px solid var(--line);background:var(--tbtn);color:var(--fg);cursor:pointer;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:var(--shadow);z-index:1001;display:flex;align-items:center;justify-content:center;transition:all .3s ease;font-size:20px}
.theme-toggle{bottom:28px;right:28px;width:48px;height:48px}.theme-toggle:hover{transform:rotate(20deg) scale(1.08)}.theme-toggle:hover .msym{transform:rotate(18deg)}
.avatar-btn{top:18px;right:28px;width:var(--navbar-h,48px);height:var(--navbar-h,48px);font-size:26px}.avatar-btn:hover{transform:scale(1.08)}
.toast{position:fixed;top:calc(var(--navbar-h,48px) + 32px);right:28px;max-width:260px;background:var(--pill);border:1px solid var(--line);box-shadow:var(--shadow);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-radius:16px;padding:12px 16px;font-size:.85rem;line-height:1.5;color:var(--sec);z-index:1002;opacity:0;transform:translateY(-6px);pointer-events:none;transition:.25s}.toast.on{opacity:1;transform:none}
.wrap{max-width:1040px;margin:0 auto;padding:32px 5% 72px;display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:48px;align-items:start}
.wrap.solo,.wrap.nosb{grid-template-columns:minmax(0,720px);justify-content:center}
.hero h1{font-size:clamp(1.9rem,5vw,2.5rem);line-height:1.15;font-weight:800;letter-spacing:-.02em}.hero p{color:var(--sec);margin:8px 0 28px}
.crumbs{font-size:.82rem;color:var(--mut);margin-bottom:14px}.crumbs a{color:var(--sec);text-decoration:none}.crumbs a:hover{color:var(--fg)}
.note{display:grid;grid-template-columns:92px minmax(0,1fr) 132px;gap:18px;padding:22px 0;border-top:1px solid var(--line);text-decoration:none;align-items:start}
.note.nopic{grid-template-columns:92px minmax(0,1fr)}.note:last-child{border-bottom:1px solid var(--line)}.note time{color:var(--mut);font-size:.82rem;font-weight:600;padding-top:5px;line-height:1.4}
.note h2{font-size:1.2rem;line-height:1.35;font-weight:700;margin-bottom:4px;transition:opacity .2s}.note:hover h2{opacity:.65}
.note p{color:var(--sec);font-size:.95rem;line-height:1.65}.note .tags{margin-top:8px}
.frame{border:1.5px solid var(--frame);border-radius:16px;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;color:var(--frame);background:transparent;aspect-ratio:4/3}
.frame img{width:100%;height:100%;object-fit:cover;display:block;border-radius:0;border:0}
.frame .msym{font-size:30px;opacity:.85}.frame small{font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;opacity:.7;font-weight:600}
.frame.wide{aspect-ratio:16/9;border-radius:20px;margin:0 0 24px}.frame.wide .msym{font-size:44px}
.tag{display:inline-block;background:var(--code);border-radius:100px;padding:1px 11px;margin:0 6px 4px 0;font-size:.76rem;font-weight:600;color:var(--sec);text-decoration:none}a.tag:hover{background:var(--glass-h);color:var(--fg)}
.meta{color:var(--mut);font-size:.85rem;font-weight:500}
article h1{font-size:clamp(1.8rem,5vw,2.3rem);line-height:1.2;font-weight:800;letter-spacing:-.02em;margin:8px 0 14px}
article h2{font-size:1.35rem;margin:2em 0 .5em;font-weight:700}article p,article ul,article ol{margin:0 0 1.1em}article ul,article ol{padding-left:1.3em}article li{margin-bottom:.3em}
article .tags{margin:4px 0 22px}
article img{max-width:100%;height:auto;border:1.5px solid var(--frame);border-radius:16px;display:block;margin:0 0 1.1em}
pre{background:var(--code);padding:16px;border-radius:14px;overflow:auto;margin-bottom:1.2em;border:1px solid var(--line)}code{font-size:.88em;background:var(--code);padding:2px 6px;border-radius:6px}pre code{background:none;padding:0}
blockquote{border-left:3px solid var(--line);padding-left:16px;color:var(--sec);margin:0 0 1.1em}
.side{position:sticky;top:96px;display:flex;flex-direction:column;gap:16px}
.box{background:var(--glass);border:1px solid var(--line);border-radius:20px;padding:20px;box-shadow:var(--shadow);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.box h3{font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;color:var(--mut);margin-bottom:10px;font-weight:700}.box p{font-size:.92rem;color:var(--sec);line-height:1.65}.box a.more{display:inline-block;margin-top:8px;font-size:.88rem;font-weight:600}
.ad{display:block;width:100%;min-height:250px;overflow:hidden}.ad.tall{min-height:600px}
.mlist{list-style:none;padding:0}.mlist li{padding:6px 0;font-size:.92rem;line-height:1.45}.mlist a{text-decoration:none;color:var(--sec)}.mlist a:hover{color:var(--fg)}
.footer{text-align:center;padding:2rem 5% 5rem;width:100%;font-size:.85rem;color:var(--mut);background:var(--bg);border-top:1px solid var(--line);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}.footer a{color:var(--sec);text-decoration:none}.footer a:hover{color:var(--fg)}.footer-links{margin-top:.6rem}
.visitor-pill{display:none;align-items:center;gap:5px;margin-top:.6rem;padding:4px 12px;border-radius:100px;font-size:.75rem;font-weight:600;background:var(--code);color:var(--sec)}
@media(max-width:860px){.wrap{grid-template-columns:minmax(0,1fr);gap:32px}.side{position:static}.ad.tall{display:none}}
@media(max-width:768px){
body{padding-top:84px}
.hamburger{display:flex}
.navbar{top:14px;left:.75rem;transform:none;gap:.8rem;width:calc(100% - 1.5rem - var(--navbar-h,48px) - 24px);max-width:calc(100% - 1.5rem - var(--navbar-h,48px) - 24px);padding:.55rem .7rem .55rem 1.3rem;justify-content:space-between}
.avatar-btn{top:14px;right:12px}.toast{right:12px}
.nav-links{position:fixed;top:74px;left:50%;width:calc(100% - 1.5rem);flex-direction:column;padding:1rem;gap:.3rem;border-radius:18px;opacity:0;pointer-events:none;transform:translateX(-50%) translateY(-8px);transition:opacity .3s,transform .3s;z-index:999;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);background:var(--bg);border:1px solid var(--line);box-shadow:var(--shadow)}
.nav-links.active{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0)}
.nav-links li{width:100%;text-align:center}.nav-links a{display:block}
}
@media(max-width:520px){.note{grid-template-columns:minmax(0,1fr) 96px;gap:4px 14px}.note.nopic{grid-template-columns:1fr}.note time{grid-column:1/-1;padding:0}}
`;

function adSlot(id, tall) {
  // Tampil hanya kalau ADSENSE_CLIENT di-set (Netlify env). Tanpa itu: tidak ada slot sama sekali.
  if (!ADS_CLIENT) return "";
  return `<div class="ad${tall ? " tall" : ""}" role="complementary" aria-label="Iklan"><ins class="adsbygoogle" style="display:block" data-ad-client="${esc(ADS_CLIENT)}" data-ad-slot="${esc(id)}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>`;
}

function frameHtml(p, wide) {
  if (p.cover) return `<div class="frame${wide ? " wide" : ""}"><img src="${esc(p.cover)}" alt="${esc(p.coverAlt || p.title)}" ${wide ? "" : 'loading="lazy"'} width="${wide ? 1280 : 400}" height="${wide ? 720 : 300}"></div>`;
  return "";
}

function sidebar(posts, tags) {
  const recent = posts.slice(0, 5).map((p) => `<li><a href="/${p.slug}/">${esc(p.title)}</a></li>`).join("");
  const tagHtml = tags.map(([t, n]) => `<a class="tag" href="/tag/${slugify(t)}/">${esc(t)} <span style="opacity:.6">${n}</span></a>`).join("");
  return `<aside class="side">
<div class="box"><h3>Tentang</h3><p>Fakrul, mahasiswa Sistem Informasi dan Full Stack Engineer. Di sini gua nulis catatan dari yang gua kerjain dan pelajari.</p><a class="more" href="/about/">Selengkapnya &rarr;</a></div>
${adSlot("sidebar-top")}
<div class="box"><h3>Terbaru</h3><ul class="mlist">${recent}</ul></div>
<div class="box"><h3>Topik</h3>${tagHtml}</div>
${adSlot("sidebar-sticky", true)}
</aside>`;
}

function layout(ctx, { title, description, path: p, body, type = "website", jsonld = [], solo = false, noindex = false, active = "", image = "" }) {
  const url = SITE + p;
  const full = p === "/" ? `${NAME} | Catatan ngoding oleh Fakrul` : `${title} | ${NAME}`;
  const ld = jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n");
  const cur = (k) => (active === k ? ' class="active"' : "");
  const og = image ? `<meta property="og:image" content="${esc(image.startsWith("http") ? image : SITE + image)}">` : "";
  return `<!doctype html>
<html lang="id" data-theme="light"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${AUTHOR}">
${noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
<link rel="canonical" href="${url}">
<link rel="icon" type="image/webp" href="/favicon.webp">
<link rel="alternate" type="application/rss+xml" title="${esc(NAME)}" href="${SITE}/feed.xml">
<meta property="og:type" content="${type}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="${esc(NAME)}"><meta property="og:locale" content="id_ID">${og}
<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap">
<script>try{var t=localStorage.getItem("theme")||"light";document.documentElement.dataset.theme=t}catch(e){}</script>
<style>${css}</style>
${ADS_CLIENT ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(ADS_CLIENT)}" crossorigin="anonymous"></script>` : ""}
${ld}
</head><body>
<nav class="navbar" id="navbar" aria-label="Utama">
<a class="nav-logo" href="/" aria-label="Notes, beranda"><img src="/favicon.webp" alt="FM Logo" width="32" height="32"></a>
<button class="hamburger" id="hamburger" aria-label="Menu" type="button"><span></span><span></span><span></span></button>
<ul class="nav-links" id="navLinks"><li><a${cur("home")} href="/">Catatan</a></li><li><a${cur("about")} href="/about/">Tentang</a></li><li><a${cur("contact")} href="/contact/">Kontak</a></li><li><a href="${PORTFOLIO}">Portfolio</a></li></ul>
</nav>
<button class="circ avatar-btn" id="avatarBtn" aria-label="Akun" type="button"><span class="msym">account_circle</span></button>
<div class="toast" id="toast" role="status">Login untuk komentar segera hadir.</div>
<button class="circ theme-toggle" id="themeBtn" aria-label="Ganti tema" type="button"><span class="msym">dark_mode</span></button>
<div class="wrap${solo ? " solo" : ""}${!solo && !ctx.posts.length ? " nosb" : ""}"><main>${body}</main>${solo ? "" : sidebar(ctx.posts, ctx.tags)}</div>
<footer class="footer"><p>&copy; ${new Date().getFullYear()} ${AUTHOR}.</p><p class="footer-links"><a href="/about/">Tentang</a> &middot; <a href="/contact/">Kontak</a> &middot; <a href="/privacy/">Privasi</a> &middot; <a href="/feed.xml">RSS</a> &middot; <a href="${PORTFOLIO}">fakrul.dev</a></p><p class="visitor-pill" id="visitorPill"><span class="msym" style="font-size:1em;vertical-align:-2px">group</span> Dikunjungi <strong id="visitorCount">-</strong> orang</p></footer>
<script>
(function(){
var d=document.documentElement,b=document.getElementById("themeBtn"),n=document.getElementById("navbar");
function icon(){b.innerHTML='<span class="msym">'+(d.dataset.theme==="dark"?"light_mode":"dark_mode")+"</span>"}
icon();
b.onclick=function(){var t=d.dataset.theme==="dark"?"light":"dark";d.dataset.theme=t;try{localStorage.setItem("theme",t)}catch(e){}icon()};
function mh(){d.style.setProperty("--navbar-h",n.offsetHeight+"px")}mh();addEventListener("resize",mh);addEventListener("load",mh);
var h=document.getElementById("hamburger"),l=document.getElementById("navLinks");
h.onclick=function(){h.classList.toggle("active");l.classList.toggle("active")};
var a=document.getElementById("avatarBtn"),t=document.getElementById("toast"),tm;
a.onclick=function(){t.classList.add("on");clearTimeout(tm);tm=setTimeout(function(){t.classList.remove("on")},2600)};
// Penghitung pengunjung: path terpisah dari portfolio. Hanya tampil kalau baca/tulis ke DB berhasil.
var k=(location.pathname.replace(/^\\/|\\/$/g,"").replace(/[^a-z0-9-]+/gi,"_"))||"home",U="https://fakrul-feeeb-default-rtdb.asia-southeast1.firebasedatabase.app/stats/notes/"+k+"/count.json",p=document.getElementById("visitorPill"),c=document.getElementById("visitorCount");
try{var seen=localStorage.getItem("nv_"+k)==="1";
fetch(U).then(function(r){return r.json()}).then(function(cur){cur=typeof cur==="number"?cur:0;
if(seen){c.textContent=cur.toLocaleString("id-ID");p.style.display="inline-flex";return}
var nx=cur+1;return fetch(U,{method:"PUT",body:JSON.stringify(nx)}).then(function(r){if(!r.ok)throw 0;localStorage.setItem("nv_"+k,"1");c.textContent=nx.toLocaleString("id-ID");p.style.display="inline-flex"})
}).catch(function(){})}catch(e){}
})();
</script>
</body></html>`;
}

const w = (f, c) => { fs.mkdirSync(path.dirname(path.join(OUT, f)), { recursive: true }); fs.writeFileSync(path.join(OUT, f), c); };
const tagLinks = (tags) => tags.map((t) => `<a class="tag" href="/tag/${slugify(t)}/">${esc(t)}</a>`).join("");
const crumbLd = (items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE + u })) });
// draft: true di front matter = tidak diterbitkan. Post non-draft yang masih ada "[ISI" bikin build gagal.
const readDir = (d) => fs.readdirSync(path.join(__dirname, d)).filter((f) => f.endsWith(".md")).map((f) => {
  const raw = fs.readFileSync(path.join(__dirname, d, f), "utf8");
  const m = parse(path.join(__dirname, d, f));
  if (m.draft === "true") { console.log(`skip draft: ${d}/${f}`); return null; }
  if (/\[ISI/.test(raw)) throw new Error(`${d}/${f}: masih ada placeholder [ISI ...], isi dulu atau set draft: true`);
  return m;
}).filter(Boolean);

fs.rmSync(OUT, { recursive: true, force: true });
const posts = readDir("posts").sort((a, b) => new Date(b.date) - new Date(a.date));
const pages = readDir("pages");

const tagMap = {};
posts.forEach((p) => p.tags.forEach((t) => (tagMap[t] = (tagMap[t] || 0) + 1)));
const tags = Object.entries(tagMap).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const ctx = { posts, tags, pages };

const noteRow = (p) => `<a class="note${p.cover ? "" : " nopic"}" href="/${p.slug}/"><time datetime="${p.date}">${fmtDate(p.date)}</time><div><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p><div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div></div>${frameHtml(p, false)}</a>`;

// Home
w("index.html", layout(ctx, {
  title: NAME, description: TAGLINE, path: "/", active: "home",
  body: `<div class="hero"><h1>Notes</h1><p>${esc(TAGLINE)}</p></div>${posts.map(noteRow).join("")}`,
  jsonld: [{ "@context": "https://schema.org", "@type": "Blog", name: NAME, url: SITE + "/", description: TAGLINE, inLanguage: "id", author: { "@type": "Person", name: AUTHOR, url: PORTFOLIO } }],
}));

// Posts
posts.forEach((p, i) => {
  const next = posts[i + 1];
  const body = `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Catatan</a> / ${esc(p.title)}</nav><article><p class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time> &middot; ${Math.max(1, Math.round(p.words / 200))} menit baca</p><h1>${esc(p.title)}</h1><div class="tags">${tagLinks(p.tags)}</div>${frameHtml(p, true)}${p.html}</article>${next ? `<p class="meta" style="margin-top:32px">Sebelumnya: <a href="/${next.slug}/">${esc(next.title)}</a></p>` : ""}`;
  w(`${p.slug}/index.html`, layout(ctx, {
    title: p.title, description: p.description, path: `/${p.slug}/`, body, type: "article", image: p.cover || "",
    jsonld: [
      { "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.description, datePublished: p.date, dateModified: p.updated || p.date, inLanguage: "id", keywords: p.tags.join(", "), author: { "@type": "Person", name: AUTHOR, url: PORTFOLIO }, publisher: { "@type": "Person", name: AUTHOR }, mainEntityOfPage: `${SITE}/${p.slug}/` },
      crumbLd([["Catatan", "/"], [p.title, `/${p.slug}/`]]),
    ],
  }));
});

// Tags
tags.forEach(([t, n]) => {
  const list = posts.filter((p) => p.tags.includes(t));
  w(`tag/${slugify(t)}/index.html`, layout(ctx, {
    title: `Topik: ${t}`, description: `${n} catatan bertopik ${t} di Notes.`, path: `/tag/${slugify(t)}/`,
    body: `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Catatan</a> / Topik</nav><div class="hero"><h1>${esc(t)}</h1><p>${n} catatan</p></div>${list.map(noteRow).join("")}`,
    jsonld: [crumbLd([["Catatan", "/"], [t, `/tag/${slugify(t)}/`]])],
  }));
});

// Static pages
pages.forEach((p) => {
  w(`${p.slug}/index.html`, layout(ctx, {
    title: p.title, description: p.description, path: `/${p.slug}/`, solo: true, active: p.slug,
    body: `<article><h1>${esc(p.title)}</h1>${p.html}</article>`,
    jsonld: [crumbLd([["Catatan", "/"], [p.title, `/${p.slug}/`]])],
  }));
});

w("404.html", layout(ctx, { title: "404", description: "Halaman tidak ditemukan", path: "/404.html", solo: true, noindex: true, body: `<article><h1>404</h1><p>Halaman nggak ketemu. <a href="/">Balik ke beranda</a>.</p></article>` }));

const urls = [
  ["/", posts[0] && posts[0].date],
  ...posts.map((p) => [`/${p.slug}/`, p.updated || p.date]),
  ...tags.map(([t]) => [`/tag/${slugify(t)}/`, posts.find((p) => p.tags.includes(t)).date]),
  ...pages.map((p) => [`/${p.slug}/`, p.date]),
];
w("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `<url><loc>${SITE}${u}</loc><lastmod>${d}</lastmod></url>`).join("\n")}\n</urlset>\n`);

w("feed.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(NAME)}</title><link>${SITE}/</link><description>${esc(TAGLINE)}</description><language>id</language>\n${posts.map((p) => `<item><title>${esc(p.title)}</title><link>${SITE}/${p.slug}/</link><guid>${SITE}/${p.slug}/</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`).join("\n")}\n</channel></rss>\n`);

fs.cpSync(path.join(__dirname, "static"), OUT, { recursive: true });
console.log(`built ${posts.length} post(s), ${tags.length} tag(s), ${pages.length} page(s), ${urls.length} URLs`);
