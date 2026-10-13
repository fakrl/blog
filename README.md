# notes.fakrul.dev

Static blog. Tulis `posts/<slug>.md` dengan front matter (`title`, `description`, `date`, `tags`), lalu `npm run build` -> `dist/`.
Netlify: build `npm run build`, publish `dist`. Custom domain: `notes.fakrul.dev` (CNAME `blog` -> `<nama-site>.netlify.app`).
"# blog" 

## Foto
Tambah `cover: /img/nama.webp` dan `coverAlt: deskripsi` di front matter post (file taruh di `static/img/`). Tanpa cover, tampil bingkai outline placeholder.

## Iklan
Default tidak ada slot iklan. Set env var `ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx` di Netlify, lalu redeploy: skrip AdSense dan slot sidebar muncul otomatis. Ganti `data-ad-slot` (id slot) di `build.js` sesuai slot AdSense kamu.
