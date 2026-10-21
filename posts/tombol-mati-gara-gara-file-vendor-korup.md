---
title: Tombol admin "mati" gara-gara satu file vendor korup
description: Dua tombol di halaman admin nggak bereaksi sama sekali. Penyebabnya bukan di kode tombolnya, dan cara nemuinnya ngajarin gua satu hal soal error JavaScript.
date: 2026-10-21
tags: [debugging, javascript, laravel]
draft: true
---

Bug yang gua temuin: dua tombol di halaman admin nggak ngapa-ngapain pas diklik. Nggak ada error di layar, nggak ada pesan, tombolnya cuma diem.

Insting pertama gua ngecek handler tombolnya. Kodenya benar. Jadi masalahnya bukan di situ.

## Yang sebenarnya kejadian

Buka tab Console di browser, ada satu `SyntaxError`. Asalnya dari file library upload (FilePond) yang dimuat halaman itu. Pas gua buka file-nya langsung, isinya bukan library. Isinya cuma teks `Redirecting to...`.

Urutan kejadiannya begini:

1. File vendor korup, jadi isinya teks biasa, bukan JavaScript.
2. Browser gagal parse, `FilePond` jadi `undefined`.
3. Kode inisialisasi manggil `FilePond.create()`, dan itu melempar error.
4. Semua eksekusi di blok `jQuery ready` berhenti di titik itu.
5. Click handler untuk tombol-tombol tadi ada **setelah** baris yang error, jadi nggak pernah ke-register.

Tombolnya nggak rusak. Tombolnya nggak pernah dikasih handler sama sekali.

## Perbaikannya

Download ulang asset aslinya, tentu. Tapi gua nggak berhenti di situ, karena kejadian yang sama bisa balik kalau library lain gagal dimuat.

Empat hal yang gua lakuin:

1. Download ulang asset yang asli.
2. Register click handler **duluan**, sebelum inisialisasi FilePond.
3. Bungkus inisialisasi FilePond dengan guard `typeof FilePond !== 'undefined'` dan `try/catch`, jadi kalau library gagal, fitur lain tetap jalan.
4. Audit asset lain di proyek untuk cari pola yang sama.

## Yang gua bawa pulang

- Tombol yang "mati" belum tentu salah di tombolnya. Cek dulu apakah ada error yang berhenti lebih awal di halaman yang sama.
- Satu error JavaScript yang nggak ketangkep bisa ngematiin semua kode setelahnya di blok yang sama.
- Buka file vendor-nya langsung di tab baru. Gua nemuin masalahnya cuma karena penasaran liat isi file itu.
