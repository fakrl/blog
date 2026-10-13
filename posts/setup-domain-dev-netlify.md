---
title: Setup domain .dev gratis dari GitHub Student Pack ke Netlify
description: Catatan pasang domain fakrul.dev dari Student Pack ke Netlify, termasuk DNS, HTTPS, dan Google Search Console.
date: 2026-10-12
tags: [domain, netlify, dns, seo]
---

Catatan ini dari proses gua pasang `fakrul.dev` buat portfolio. Intinya ada tiga bagian: DNS, HTTPS, dan verifikasi Search Console.

## DNS

Di registrar, gua arahkan record `A` untuk root domain ke Netlify dan `CNAME` untuk `www` ke alamat `netlify.app` milik site. Setelah itu tekan "Verify DNS configuration" di Netlify.

## HTTPS

Netlify menerbitkan sertifikat Let's Encrypt otomatis begitu DNS terverifikasi. Domain `.dev` ada di daftar HSTS preload, jadi browser memaksa HTTPS. Artinya kalau sertifikatnya belum aktif, situs nggak bisa dibuka sama sekali, bukan sekadar muncul peringatan.

## Search Console

Gua pakai properti tipe Domain, jadi cukup satu verifikasi lewat record TXT dan semua subdomain ikut terverifikasi. Setelah itu gua submit `sitemap.xml`. Statusnya sempat "Tidak dapat mengambil peta situs" karena sitemap belum ter-deploy, lalu berubah jadi berhasil setelah situs live.

## Pelajaran

Harga perpanjangan domain bisa jauh di atas harga promo tahun pertama. Catat tanggal perpanjangannya dari awal.
