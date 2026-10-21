---
title: Segmentasi donatur di Google Apps Script: kenapa gua ganti dari multi-label ke hierarki
description: Desain awal segmentasi donatur gua ngasih hasil yang bikin bingung dibaca. Ini yang gua ubah dan alasannya.
date: 2026-10-22
tags: [google-apps-script, data, segmentasi]
draft: true
---

Di program OJT gua ada tugas bikin segmentasi donatur otomatis dari sheet transaksi yang isinya 16.000+ baris. Alatnya Google Apps Script, supaya tim yang nggak teknis tinggal pakai tanpa ngutak-ngatik rumus.

## Desain pertama: multi-label

Awalnya gua bikin satu donatur bisa punya lebih dari satu label sekaligus, misalnya "Loyal" dan "Aktif" dalam waktu yang sama. Secara logika kelihatan lengkap.

Masalahnya muncul pas hasilnya dibaca. Ada bug logika di desain multi-label itu yang bikin hasilnya membingungkan, dan satu donatur bisa nongol di beberapa segmen. Akibatnya jelas: tabelnya susah dipakai buat ambil keputusan.

## Desain kedua: hierarki

Gua ubah jadi hierarki, satu donatur cuma masuk satu segmen: Potensial, Loyal, Aktif, Baru, lalu Pasif.

Hasilnya lebih gampang dibaca karena tiap donatur cuma muncul sekali. Ada juga sub-status keaktifan (misalnya Sehat atau Berisiko) berdasarkan jumlah hari sejak donasi terakhir, jadi informasi itu nggak numpuk di label segmen yang sama.

Dashboard-nya juga gua revisi: pertumbuhan segmen dihitung kumulatif per bulan sejak Januari, bukan cuma bulan berjalan, karena tim butuh lihat histori.

## Kenapa Apps Script, bukan formula biasa

Formula bisa jalan, tapi rawan ke-edit atau ke-hapus orang. Dengan script ditambah trigger harian, hasilnya diperbarui otomatis dan tim tinggal baca.

## Yang gua pelajari

- Sebelum bikin logika yang rumit, tanya dulu: hasilnya mau dibaca siapa, dan buat keputusan apa?
- Kalau satu orang muncul di banyak kategori, angka per kategori susah dipercaya. Itu tanda desain kategorinya perlu dicek ulang.
- Bagian sepele kayak error `getUi()` yang muncul karena script jalan lewat trigger (bukan dari menu) makan waktu juga. Konteks eksekusi itu penting.
