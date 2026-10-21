---
title: Pasang komentar Giscus di blog statis, dan error yang gua temuin di tengah jalan
description: Giscus pakai GitHub Discussions buat komentar. Ini langkah yang gua pakai, error yang muncul, dan cara bikin tampilannya ikut tema blog.
date: 2026-10-25
tags: [giscus, blog, github]
draft: true
---

Blog ini statis, jadi nggak ada database buat nyimpen komentar. Pilihan gua: Giscus, yang nyimpen komentar sebagai GitHub Discussions di repo blog. Cocok karena pembaca blog ini kebanyakan sesama developer yang sudah punya akun GitHub.

## Langkah dasarnya

1. Aktifin **Discussions** di repo blog.
2. Install GitHub app milik Giscus di repo itu.
3. Buka giscus.app, isi nama repo, pilih kategori (gua pakai Announcements), lalu salin script yang dihasilkan.
4. Tempel script itu di template halaman post.

Setting pentingnya: mapping pakai `pathname`, jadi tiap post punya thread sendiri berdasarkan URL-nya.

## Error yang gua temui

Waktu pertama coba, giscus.app nolak dengan pesan "Cannot use giscus on this repository". Penyebabnya dua hal dari daftar di atas yang belum gua lakukan: Discussions belum nyala dan app belum terpasang. Setelah dua-duanya beres, halaman konfigurasinya langsung ngasih centang hijau.

## Bikin tampilannya ikut blog

Defaultnya kotak komentarnya kelihatan "tempelan". Giscus bisa dikasih tema custom lewat file CSS yang di-host di situs sendiri, lalu dipanggil lewat atribut tema. Gua bikin versi terang dan gelap, dan tombol ganti tema di blog gua kirim pesan ke iframe Giscus supaya ikut berubah.

Beberapa elemen yang gua sembunyiin lewat CSS karena nggak perlu: tab Tulis/Pratinjau dan tautan panduan Markdown.

## Catatan jujur

Kekurangannya jelas: pembaca harus punya akun GitHub buat komentar. Buat blog teknis gua itu wajar. Buat blog umum, mungkin bukan pilihan yang pas.
