---
title: Pasang domain sendiri dan email bisnis gratis di Lark
description: Pasang domain sendiri dan email bisnis gratis di Lark
date: 2026-10-21
tags: [domain, email, dns]
---

## Pasang Domain Sendiri dan Email Bisnis Gratis di Lark

Pakai alamat email dengan domain sendiri menurut gua terasa jauh lebih meyakinkan kalau dicantumkan di CV. Alamat email kustom bikin profil kita kelihatan rapi dan niat, apalagi kalau disandingkan langsung dengan tautan [portfolio gua](https://fakrul.dev). Kesannya jadi lebih profesional dibanding cuma mencantumkan alamat email biasa.

Baru-baru ini, gua pasang domain fakrul.dev di Lark Starter yang gratis. Alasan utamanya simpel, gua pengin punya email bisnis dengan domain sendiri tanpa perlu keluar biaya langganan.

Langkah awal yang gua lakukan adalah verifikasi domain lewat record TXT di panel DNS Name.com. Verifikasi ini diperlukan biar sistem Lark mengenali kepemilikan domain tersebut. Selain TXT, gua pasang record MX, SPF, dan DKIM di tempat yang sama. Pengaturan MX jelas wajib untuk jalur penerimaan email, sedangkan SPF dan DKIM disiapkan untuk kebutuhan autentikasi pengiriman. Setelah semua record terpasang rapi, status domain di Lark Admin sekarang Verified.

Begitu statusnya sudah beres, gua langsung mencoba pengujian. Hasilnya, mailbox hi@fakrul.dev berhasil kirim email ke Gmail. Pengiriman dasar dari domain sendiri ini berjalan lancar.

Meski demikian, pengaturannya belum seratus persen tuntas gua periksa. Untuk saat ini, DMARC belum gua tes. Gua masih harus meluangkan waktu lagi buat ngecek bagian itu nanti.

Pekerjaan rumah berikutnya ada di kenyamanan pemakaian. Sehari-hari gua jarang buka Lark Mail. Supaya pesan yang masuk ke alamat domain sendiri gak terlewat begitu saja, gua mau email masuk diteruskan ke Gmail. Dengan cara ini, komunikasi tetap terpusat di inbox yang rutin gua buka, sementara kontak yang terpampang di CV tetap terlihat meyakinkan.
