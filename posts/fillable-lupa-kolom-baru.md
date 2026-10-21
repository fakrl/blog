---
title: Lupa masukin kolom baru ke $fillable: bug Laravel yang berulang di proyek gua
description: Kolom baru yang ditulis dari method model bisa bikin MassAssignmentException atau data hilang diam-diam. Ini kebiasaan yang gua pakai sekarang buat nangkepnya.
date: 2026-10-24
tags: [laravel, eloquent, debugging]
draft: true
---

Ini bug yang paling sering gua temui di proyek Laravel gua sendiri. Gejalanya beda-beda, akarnya sama: kolom baru nggak masuk daftar `fillable`.

## Dua wajah bug-nya

Di lingkungan dev, kolom yang nggak ada di `fillable` bisa memunculkan `MassAssignmentException`. Kelihatan jelas, tinggal diperbaiki.

Yang lebih jahat kalau proteksi untuk itu belum diaktifkan: atribut yang nggak ada di `fillable` dibuang **diam-diam**, dan di production datanya hilang tanpa jejak.

Kolom yang paling gampang kelewat adalah timestamp seperti `*_at` yang diisi dari method di model (misalnya saat status berubah), bukan dari form. Karena nggak ada form-nya, nggak ada yang ngingetin.

## Yang gua lakukan sekarang

1. Aktifin `Model::preventSilentlyDiscardingAttributes()` supaya data yang dibuang jadi error yang kelihatan, bukan hilang.
2. Tiap nambah kolom, grep model-nya dan cek `fillable` sebelum commit.
3. Tulis test untuk method yang menulis kolom itu, bukan cuma untuk request dari form. Di proyek gua, beberapa method seperti itu sebelumnya sama sekali nggak ada test-nya, jadi lolos lama.

## Catatan

Audit ngajarin gua bahwa bug ini nggak terkunci di satu model. Pas gua cek menyeluruh, ada beberapa model sekaligus dengan masalah yang sama. Kalau ketemu satu, cek semuanya.
