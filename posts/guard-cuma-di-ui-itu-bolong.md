---
title: Guard yang cuma ada di UI itu bolong: pelajaran dari audit proyek Laravel gua
description: Tombolnya disembunyiin, tapi servernya masih nerima apa saja. Ini cara gua nemuin dan nutup celah itu.
date: 2026-10-23
tags: [laravel, keamanan, testing]
draft: true
---

Di proyek tugas akhir gua (sistem Laravel dengan beberapa peran), gua sempat audit semua aksi yang "dibatasi". Temuan yang paling sering: pembatasannya cuma ada di tampilan.

Contohnya, tombol sebuah aksi disembunyiin dari peran tertentu. Kelihatannya aman. Tapi servernya masih nerima permintaan apa saja kalau URL aksinya ditembak langsung.

## Kenapa ini bahaya

Menyembunyikan tombol itu urusan kenyamanan, bukan keamanan. Siapa pun yang bisa buka dev tools atau kirim request sendiri bisa lewatin UI sepenuhnya.

## Yang gua ubah

1. Aturan "siapa boleh ngapain" dicek di sisi server, bukan cuma lewat tombol yang disembunyiin di view.
2. Tiap aksi yang dibatasi dikasih test yang **menembak URL langsung** dan memastikan permintaan yang nggak seharusnya diterima ditolak.
3. Aturan waktu dan kepemilikan ikut dicek di server. Contoh temuan di audit gua: menambah honor oleh peran yang nggak berhak, absen untuk tanggal yang belum tiba, absen di proyek orang lain, dan penambahan tanggal shooting dari klien.

## Cara gua mikir sekarang

Waktu nambah fitur, gua tanya dua hal: tombolnya disembunyiin dari siapa, dan kalau orang itu tetap kirim requestnya, apa yang terjadi? Kalau jawaban yang kedua "diproses", berarti belum selesai.

Test yang nembak URL langsung itu murah ditulis dan nangkep hal yang nggak pernah kelihatan dari klik-klik manual.
