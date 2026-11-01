---
title: Memecah form jadi beberapa bagian bisa menghapus data diam-diam
description: Satu form profil dipecah per bagian, dan menyimpan satu bagian malah menimpa bagian lain.
date: 2026-11-01
tags: [laravel, form, debugging]
draft: true
---

## Memecah form jadi beberapa bagian bisa menghapus data diam-diam

Gua mau berbagi sedikit pelajaran soal desain controller waktu memecah form profil. Ceritanya, ada form update profil yang awalnya menyatu, lalu dipecah jadi beberapa bagian. Tapi ternyata, perubahan ini memicu masalah yang bikin data terhapus diam-diam.

Penyebab utamanya ada di controller update profil yang lama. Controller tersebut dirancang dengan asumsi bahwa semua field selalu dikirim setiap kali proses simpan berjalan. Waktu form masih utuh, asumsi ini tidak menimbulkan kendala. Masalah baru kelihatan jelas setelah form tersebut dipecah per bagian.

Begitu form dipecah, data yang dikirim ke controller tentu cuma field yang ada di bagian yang sedang disubmit. Karena controller lama tetap menganggap semua field selalu dikirim, data dari bagian lain yang absen langsung bermasalah. Akibatnya, menyimpan satu bagian malah menimpa tautan tambahan dengan array kosong. Nggak cuma itu, nomor WA juga ikut tertimpa dengan null. Masalah lain yang muncul adalah username jadi wajib di semua bagian form. Jadi, validasi username tetap menuntut data ada, padahal user lagi menyimpan bagian form yang berbeda.

## Perbaikan yang dilakukan

Untuk mengatasi masalah ini, ada dua perbaikan utama yang dilakukan:

Pertama, tiap bagian sekarang punya method simpan sendiri. Dengan cara ini, controller tidak lagi memproses semua field sekaligus, melainkan hanya menangani data yang memang menjadi tanggung jawab dari bagian form tersebut.

Kedua, ada test isolasi yang ditambahkan. Test isolasi ini dibuat untuk memastikan bahwa menyimpan satu bagian benar-benar tidak mengubah bagian lain. Jadi, waktu satu bagian disimpan, data tautan tambahan tidak akan terhapus menjadi array kosong dan nomor WA tidak akan terisi null.

Dari sini gua belajar, memecah form bukan cuma soal tampilan di depan. Kalau controller update profil lama masih menganggap semua field selalu dikirim, data user bisa hilang tanpa disadari.
