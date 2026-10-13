---
title: Kenapa gua bikin blog statis sendiri, bukan pakai Blogger
description: Blogger gampang tapi layout dan SEO-nya terbatas. Ini alasan gua bikin blog statis sendiri dan apa yang gua dapat dari situ.
date: 2026-10-13
tags: [seo, blog, netlify]
---

Tugas SEO pertama gua jalan di Blogger. Cepat jadi, tapi dua hal bikin gua gerah: layout susah dikustom, dan banyak hal teknis SEO yang nggak bisa gua pegang.

## Yang gua mau kontrol

- **Meta tag per halaman**: title, description, canonical, dan Open Graph.
- **Structured data**: schema `BlogPosting` supaya mesin pencari paham isi halaman.
- **Sitemap dan RSS** yang dibuat otomatis setiap build.
- **Kecepatan**: halaman statis tanpa JavaScript berat.

## Cara kerjanya

Setiap tulisan adalah satu file markdown dengan front matter. Satu skrip Node (`build.js`) mengubahnya jadi HTML, lalu Netlify yang menyajikan. Nggak ada database di sisi pembaca.

## Yang belum enak

Nulis lewat file markdown di repo itu belum nyaman. Rencananya nanti ada halaman admin supaya gua bisa nulis dari browser, tapi hasil akhirnya tetap HTML statis supaya Google bisa baca langsung.
