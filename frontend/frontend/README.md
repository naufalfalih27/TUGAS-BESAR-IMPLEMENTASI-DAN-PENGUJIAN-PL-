# KkTF — Website & Admin Frontend

Frontend statis untuk website KkTF/Tara Coffee berdasarkan referensi visual yang dikirim: halaman detail produk, katalog menu, dan galeri **Vibes & Happenings**, dengan portal admin lama tetap disertakan.

## Menjalankan secara lokal

1. Ekstrak folder proyek, lalu buka folder `frontend` di VS Code.
2. Pasang ekstensi **Live Server** (Ritwick Dey) bila belum tersedia.
3. Klik kanan `index.html` → **Open with Live Server**.
4. Website publik terbuka di browser. Gunakan menu atas untuk membuka katalog, detail produk, event, keranjang, dan About Us.
5. Portal admin tersedia melalui `login.html` dan dashboard pada `admin.html`.

Tidak perlu `npm install`, Node.js, framework, atau `node_modules`; proyek ini menggunakan HTML, CSS, dan JavaScript vanilla. Google Fonts akan dimuat jika koneksi internet tersedia; fallback font sistem tetap disediakan.

## Halaman website publik

- `index.html` — beranda KkTF dengan highlight menu dan event.
- `catalog.html` — katalog 12 menu, pencarian, dan filter kategori.
- `product.html?id=kopi-tubruk` — detail produk, pilihan serving/es/gula, tombol suka demo, dan tambah ke keranjang. Parameter ID mengikuti ID produk; tautan detail dibuat dari katalog.
- `events.html` — galeri Vibes & Happenings dari gambar event yang diberikan.
- `cart.html` — ringkasan keranjang, ubah kuantitas, hapus item, kosongkan keranjang.
- `about.html` — informasi singkat KkTF dan kontak.

## Portal admin yang dipertahankan

- `login.html` — halaman login demo.
- `admin.html` — dashboard admin.
- `admin-catalog.html` — manajemen katalog menu.
- `admin-product.html`, `admin-about.html`, `payment.html`, `staff.html`, `roastery.html`, `table.html`, `chat.html`, `reports.html`, `documents.html`, `settings.html`, `logs.html`, `register.html` — halaman operasional admin.

## Struktur penting

```text
frontend/
├── assets/
│   ├── brand-mark.svg
│   ├── favicon.svg
│   ├── products/       # foto menu hasil crop dari referensi yang dikirim
│   └── events/         # gambar galeri event dari referensi yang dikirim
├── css/
│   ├── style.css       # portal admin
│   └── store.css       # website publik
├── js/
│   ├── app.js          # portal admin
│   ├── login.js
│   └── store.js        # katalog, detail produk, event, dan cart demo
├── index.html
├── catalog.html
├── product.html
├── events.html
├── cart.html
└── ...
```

## Menu yang tersedia

1. Kopi Tubruk — IDR 12.000
2. Kopi Saring Susu — IDR 15.000
3. Kopi Saring Butter — IDR 16.000
4. Kopi Susu Tubruk — IDR 13.000
5. Kopi Saring Hitam — IDR 14.000
6. Jasmine Tea — IDR 12.000
7. Camomile — IDR 12.000
8. Es Cokelat — IDR 15.000
9. Cokelat Kopi — IDR 22.000
10. Greentea — IDR 20.000
11. Dimsum — IDR 15.000
12. Gyoza — IDR 15.000

Harga dan deskripsi mengikuti screenshot referensi detail produk. Foto produk menggunakan crop dari screenshot yang kamu sediakan, bukan file foto asli terpisah.

## Interaksi dan batasan

- Pencarian dan filter katalog berfungsi.
- Pilihan penyajian dan gula dapat dipilih di halaman detail; keranjang disimpan menggunakan `localStorage` browser.
- Galeri event menampilkan sembilan gambar yang disediakan. Judul beberapa kartu merupakan deskripsi visual ringkas karena tidak semua nama acara terbaca jelas di referensi.
- Login dan checkout masih demo frontend. Tidak ada autentikasi server, database, payment gateway, atau pemrosesan pesanan sesungguhnya.

## Upload ke GitHub

Letakkan isi folder ini ke folder `frontend` repository. Bila dashboard admin yang lama ingin dibuka secara langsung, akses `admin.html`. Jika GitHub Pages diarahkan ke folder `frontend`, beranda publik akan dimulai dari `index.html`.

```bash
git add frontend
git commit -m "Build KkTF menu and events frontend"
git push
```
