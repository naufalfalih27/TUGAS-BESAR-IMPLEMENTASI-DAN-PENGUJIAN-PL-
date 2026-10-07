# SPESIFIKASI KEBUTUHAN PERANGKAT LUNAK DAN DESKRIPSI

## WEBSITE PROFILE KEDAI KOPI TARA

---

# 1. Pendahuluan

## 1.1. Tujuan Penulisan

Tujuan penulisan dokumen Spesifikasi Kebutuhan Perangkat Lunak (SKPL) dan Deskripsi Perancangan Perangkat Lunak (DPPL) adalah untuk mendokumentasikan kebutuhan serta rancangan sistem website CAFFEE KkTF secara terstruktur dan jelas. Dokumen ini menjelaskan tujuan pengembangan sistem, ruang lingkup, kebutuhan fungsional dan nonfungsional, fitur utama, rancangan antarmuka, struktur data, alur navigasi, serta fitur rekomendasi menu berbasis AI. Selain itu, dokumen ini menjadi pedoman bagi tim pengembang dalam menerjemahkan kebutuhan pengguna ke dalam desain dan implementasi sistem. Dokumen menjadi acuan dalam perancangan, pengembangan, dan pengujian website agar sesuai dengan tujuan branding kedai dan kebutuhan pengunjung.

## 1.2. Latar Belakang

Perkembangan teknologi digital telah mengubah cara masyarakat mencari informasi mengenai produk dan layanan, termasuk dalam industri kuliner dan minuman. Website dapat menjadi media bagi UMKM kedai kopi untuk memperkenalkan identitas usaha, menampilkan produk, dan menjangkau calon pelanggan. Melalui penyajian informasi yang terstruktur, calon pelanggan dapat mengenal karakteristik kedai dan mempertimbangkan pilihan menu sebelum berkunjung.

Kedai Kopi Tara sebagai salah satu UMKM di bidang kedai kopi membutuhkan media digital yang dapat memperkuat branding serta menyampaikan informasi usaha secara lebih lengkap. Informasi mengenai profil kedai, katalog menu, bahan baku, fasilitas, dan kegiatan perlu disajikan dalam satu platform yang mudah diakses. Ketersediaan informasi tersebut dapat membantu calon pelanggan memahami keunikan kedai dan memilih produk sesuai kebutuhan serta preferensi mereka.

Untuk memenuhi kebutuhan tersebut, dikembangkan website profil Kedai Kopi Tara dengan identitas CAFFEE KkTF. Website ini menyediakan informasi mengenai cerita dan nilai usaha, katalog menu beserta harga dan deskripsi produk, bahan baku, fasilitas, event, lokasi, serta kontak kedai. Website berfungsi sebagai media informasi dan promosi yang membantu calon pelanggan mengenal kedai sebelum melakukan kunjungan.

Selain menyajikan informasi, website dilengkapi fitur kecerdasan buatan atau Artificial Intelligence (AI) untuk memberikan rekomendasi menu berdasarkan preferensi pengunjung. Melalui fitur ini, pengunjung dapat memperoleh saran menu sesuai karakteristik rasa atau jenis minuman yang diinginkan. Fitur tersebut diharapkan mempermudah proses pemilihan menu sekaligus meningkatkan interaktivitas website.

Pengembangan website ini bertujuan untuk memperkuat branding Kedai Kopi Tara, memperluas jangkauan informasi, serta memudahkan calon pelanggan mengakses informasi produk dan fasilitas. Sebagai tahap awal pengembangan, wawancara dan diskusi dengan pemilik usaha dilakukan untuk mengidentifikasi kebutuhan bisnis serta menentukan konten dan fitur yang relevan. Hasil kegiatan tersebut menjadi dasar perancangan website agar sesuai dengan karakteristik usaha dan kebutuhan pengunjung.

## 1.3. Ruang Lingkup

Ruang lingkup pengembangan website CAFFEE KkTF meliputi pembuatan website profil kedai kopi yang berfungsi sebagai media informasi dan promosi digital. Sistem mencakup halaman beranda yang menampilkan identitas dan branding kedai, halaman About Us yang berisi cerita usaha dan nilai produk, katalog menu berdasarkan kategori, serta halaman detail menu yang memuat nama, foto, harga, deskripsi, dan informasi bahan baku. Selain itu, website menyediakan informasi mengenai fasilitas kedai, suasana, event, lokasi, jam operasional, serta kontak yang dapat dihubungi oleh pengunjung. Sistem juga mencakup fitur AI untuk memberikan rekomendasi menu berdasarkan preferensi pengunjung, seperti jenis minuman, rasa, tingkat kemanisan, dan suhu minuman. Website dirancang secara responsif agar dapat diakses melalui laptop, tablet, dan smartphone.

Pengembangan website ini tidak mencakup fitur login atau registrasi pengguna, pemesanan online, keranjang belanja, pembayaran digital, reservasi meja, voucher pelanggan, pengelolaan pengiriman, maupun sistem kasir. Website hanya menyediakan informasi dan rekomendasi menu, sedangkan proses pemesanan atau transaksi dilakukan melalui kontak atau secara langsung di kedai.

## 1.4. Istilah

| Istilah | Keterangan |
| ------- | ---------- |
|         |            |

---

# 2. Deskripsi Umum Sistem

## 2.1. Gambaran Umum Sistem

Website KkTF adalah platform informasi berbasis web yang dapat diakses melalui browser. Sistem menampilkan konten profil kedai dan menyediakan rekomendasi menu berbasis AI. Pengunjung tidak perlu membuat akun untuk membaca informasi atau menggunakan rekomendasi.

## 2.2. Tujuan Pengembangan

Pengembangan website KkTF bertujuan untuk meningkatkan branding dan kehadiran digital Kedai Kopi Tara melalui media informasi yang mudah diakses oleh masyarakat. Website ini dirancang untuk menyajikan informasi mengenai identitas kedai, katalog menu, bahan baku, fasilitas, event, lokasi, dan kontak secara terstruktur. Selain itu, website dilengkapi fitur rekomendasi berbasis AI yang membantu pengunjung menemukan menu sesuai dengan selera dan preferensi mereka. Dengan adanya website ini, pengunjung dapat memperoleh informasi mengenai Kedai Kopi Tara secara cepat dan lengkap sebelum melakukan kunjungan.

## 2.3. Aktor Sistem

Aktor yang terlibat dalam sistem website KkTF terdiri atas pengunjung dan admin atau pemilik kedai. Pengunjung merupakan pengguna yang mengakses website untuk melihat profil Kedai Kopi Tara, katalog dan detail menu, fasilitas, lokasi, kontak, promo, serta event yang tersedia. Pengunjung juga dapat menggunakan fitur rekomendasi berbasis AI dengan memasukkan preferensi menu untuk memperoleh saran produk yang sesuai. Admin atau owner merupakan pihak yang bertanggung jawab mengelola dan memperbarui informasi website, seperti profil kedai, kategori dan data menu, harga, bahan baku, fasilitas, promo, event, lokasi, kontak, serta data yang digunakan dalam fitur rekomendasi AI.

## 2.4. Asumsi dan Batasan

Website KkTF diasumsikan digunakan oleh pengunjung yang memiliki perangkat seperti smartphone, tablet, atau laptop, browser yang mendukung, serta koneksi internet. Informasi profil kedai, menu, harga, bahan baku, fasilitas, promo, event, lokasi, dan kontak diperbarui oleh admin atau owner agar tetap sesuai dengan kondisi terbaru. Fitur AI hanya digunakan untuk memberikan rekomendasi menu berdasarkan data menu dan preferensi yang dimasukkan oleh pengunjung. Website ini tidak menyediakan fitur login, registrasi, pemesanan online, keranjang belanja, pembayaran, reservasi meja, pengiriman, maupun transaksi secara langsung. Apabila pengunjung ingin melakukan pemesanan atau memperoleh informasi lebih lanjut, komunikasi dilakukan melalui kontak kedai yang tersedia pada website.

---

# 3. Kebutuhan Fungsional

| ID | Fungsi | Spesifikasi | Output |
| -- | ------ | ----------- | ------ |
| FR-01 | Landing Page | • Sistem menampilkan hero section dan tagline brand serta navigation bar (Home, About Us, Catalog Menu).<br>• Sistem menampilkan promo card yang dapat digeser (swipe) yang berisi penawaran aktif.<br>• Sistem menampilkan carousel "Top Tier Lineup" berisi menu rekomendasi yang ditampilkan secara acak, disertai tombol See All Menu.<br>• Sistem menampilkan galeri dokumentasi dan footer yang berisi alamat, jam operasional, kontak WhatsApp, serta tautan Instagram, TikTok, dan Google Maps. | Pengguna mengenali brand dan dapat berpindah halaman. |
| FR-02 | About Us | • Sistem menampilkan halaman About Us yang berisi cerita brand, informasi kualitas bahan.<br>• Sistem menampilkan Monthly Events berupa kalender event (judul, tanggal, status, lokasi, thumbnail) dengan aksi book yang terhubung dengan tautan WhatsApp. | Informasi profil kedai tampil lengkap. |
| FR-03 | Catalog Menu | • Sistem menampilkan catalog menu dalam kartu produk (gambar, nama, deskripsi singkat, harga) yang dikelompokkan dalam kategori pada sidebar. | Pengguna dapat menjelajah menu. |
| FR-04 | Detail Menu | • Sistem menampilkan deskripsi rasa, bahan baku, serving, dan informasi produk. | Pengguna memahami karakteristik menu. |
| FR-05 | AI Recommendation | • Sistem menyediakan antarmuka chat AI Assistant (sapaan, suggestion prompt chip, kolom input, chat bubble, kartu rekomendasi produk) yang merekomendasikan menu berdasarkan preferensi pengguna dengan mempertahankan konteks percakapan. | Daftar rekomendasi beserta alasan singkat ditampilkan. |
| FR-06 | Informasi Fasilitas | • Sistem menampilkan fasilitas kedai, area, suasana, jam operasional. | Pengguna memperoleh informasi sebelum datang ke Caffee. |
| FR-07 | Lokasi dan Kontak | • Sistem menampilkan alamat, WhatsApp, media sosial, dan jam operasional. | Pengguna dapat menghubungi atau menemukan lokasi kedai. |
| FR-08 | Event dan Promo | • Sistem menampilkan informasi event/promo aktif dan arsip yang relevan. | Pengguna mengetahui kegiatan kedai. |
| FR-09 | Administrasi Konten | • Admin dapat menambah, mengubah, dan menghapus data profil, menu, fasilitas, promo, event, serta parameter rekomendasi. | Konten website selalu dapat diperbarui. |

---

# 4. Kebutuhan Non-Fungsional

| ID | Kategori | Spesifikasi | Output |
| -- | -------- | ----------- | ------ |
| NFR-01 | Kinerja | • Target pemuatan halaman utama maksimal 3 detik pada kondisi pengujian yang ditentukan.<br>• Gambar dioptimalkan agar tidak memperlambat halaman. | Halaman website dapat dimuat dengan cepat dan pengguna mengetahui proses yang sedang berlangsung. |
| NFR-02 | Kemudahan Penggunaan | • Navigasi sederhana dan konsisten.<br>• Nama menu dan tombol mudah dipahami.<br>• Informasi utama mudah ditemukan.<br>• Petunjuk penggunaan AI jelas. | Pengguna mudah menjelajahi website dan menggunakan fitur AI. |
| NFR-03 | Responsivitas | • Tampilan menyesuaikan hp, tablet, dan desktop.<br>• Teks dan gambar tidak terpotong.<br>• Tombol mudah digunakan. | Tampilan tetap rapi dan dapat digunakan pada berbagai ukuran layar. |
| NFR-04 | Kompatibilitas | • Fungsi utama berjalan konsisten pada browser yang digunakan.<br>• Tampilan tidak bergantung pada satu jenis browser. | Website dapat digunakan melalui berbagai browser. |
| NFR-05 | Aksesibilitas | • Teks mudah dibaca dan dapat diperbesar.<br>• Warna memiliki kontras yang memadai.<br>• Gambar informatif.<br>• Informasi tidak disampaikan melalui warna saja. | |
| NFR-06 | Keamanan | • Input fitur AI divalidasi.<br>• Kredensial layanan AI tidak ditampilkan pada browser.<br>• Akses pengelolaan konten dibatasi bagi pihak berwenang. | Sistem dan konfigurasi terlindungi dari akses yang tidak sah. |
| NFR-07 | Keandalan | • Halaman informasi dapat diakses secara stabil.<br>• Gangguan AI tidak menghambat akses halaman lainnya.<br>• Data yang gagal dimuat tidak ditampilkan sebagai informasi valid. | Informasi utama tetap dapat diakses meskipun fitur AI mengalami gangguan. |
| NFR-08 | Penanganan Kesalahan | • Pesan kesalahan menggunakan bahasa yang mudah dipahami.<br>• Sistem memberi informasi ketika data tidak ditemukan.<br>• Pengunjung dapat mencoba kembali jika proses AI gagal.<br>• Pesan kesalahan tidak menampilkan informasi teknis sensitif. | Pengunjung memahami kendala dan tindakan yang dapat dilakukan. |
| NFR-09 | Privasi | • Fitur AI tidak mewajibkan data pribadi yang tidak diperlukan.<br>• Input dibatasi pada preferensi yang relevan.<br>• Jika preferensi disimpan, tujuan penyimpanannya dijelaskan kepada pengguna. | Pengguna memperoleh rekomendasi dengan pengumpulan data yang terbatas. |
| NFR-10 | Pemeliharaan | • Konten menu, harga, fasilitas, promo, dan event mudah diperbarui.<br>• Data menu dipisahkan dari logika aplikasi.<br>• Perubahan konten tidak memerlukan perubahan keseluruhan sistem. | Informasi website dapat diperbarui secara efisien. |
| NFR-11 | Kualitas Rekomendasi AI | • Rekomendasi mengacu pada menu yang terdaftar.<br>• Hasil mempertimbangkan preferensi pengunjung.<br>• Nama menu, harga, dan bahan baku sesuai data kedai.<br>• Alasan rekomendasi disampaikan secara jelas.<br>• Sistem menyatakan jika tidak ditemukan menu yang sesuai. | Pengunjung memperoleh rekomendasi yang relevan dan sesuai data kedai. |

---

# 5. Kebutuhan Data

| Data | Informasi Utama |
| ---- | --------------- |
| Profil Kedai Kopi | Nama kedai kopi, logo, tagline, sejarah, visi, misi, nilai usaha, dan deskripsi singkat KkTF. |
| Branding | Warna identitas, jenis huruf, slogan, foto kedai, konsep visual, dan karakter brand. |
| Kategori Menu | Nama kategori, deskripsi kategori, urutan tampilan, dan status kategori. |
| Menu | Nama menu, kategori, harga, foto, deskripsi, status ketersediaan, dan informasi singkat produk. |
| Bahan Baku | Nama bahan, komposisi, asal bahan, karakteristik rasa, serta informasi tambahan yang relevan. |
| Karakteristik Menu | Jenis menu, rasa, tingkat kemanisan, suhu penyajian. |
| Preferensi Pengunjung | Pilihan kategori, rasa, suhu, tingkat kemanisan, dan tujuan konsumsi yang dimasukkan ke fitur AI. |
| Rekomendasi AI | Aturan pencocokan, bobot preferensi, hubungan antara karakteristik menu dan preferensi, serta alasan rekomendasi. |
| Fasilitas | Nama fasilitas, deskripsi, kapasitas, lokasi area, foto, dan ketentuan penggunaan. |
| Event | Nama event, deskripsi, tanggal, waktu, lokasi, poster, status, dan informasi pendaftaran jika ada. |
| Promo | Nama promo, deskripsi, periode berlaku, syarat dan ketentuan, gambar, serta status promo. |
| Lokasi | Alamat lengkap, titik lokasi, peta, patokan lokasi, jam operasional, dan informasi akses. |
| Kontak Kedai Kopi | Nomor WhatsApp, email, media sosial, tautan peta, dan kontak alternatif kedai. |
| Media | Foto menu, foto kedai, foto fasilitas, poster event, dan gambar pendukung lainnya. |
| Admin | Nama admin, informasi akun pengelola, hak akses, dan catatan perubahan konten. |

---

# 6. Spesifikasi Use Case

| ID | Nama Use Case | Prasyarat | Alur Utama | Hasil | Aktor |
| -- | ------------- | --------- | ---------- | ----- | ----- |
| UC-01 | Melihat Landing Page | Pengguna membuka alamat website melalui browser, dan perangkat terhubung internet. | 1. Pengguna membuka website KkTF.<br>2. Sistem menampilkan navbar (Home, About Us, Catalog Menu, ikon AI) dan hero "Crafted for the Soul".<br>3. Sistem menampilkan promo card yang dapat digeser.<br>4. Pengunjung menggeser promo untuk melihat penawaran lain.<br>5. Sistem menampilkan carousel Top Tier Lineup (menu dengan Love terbanyak).<br>6. Sistem menampilkan carousel Top Tier Lineup (menampilkan menu secara random).<br>7. Pengguna memilih navigasi, mis. About Us, Catalog Menu, See All Menu, atau tautan media sosial.<br><br>**Alternatif:** Data promo/menu unggulan gagal dimuat → bagian tersebut disembunyikan, dengan halaman lain tetap tampil. | Pengguna memperoleh gambaran brand, promo aktif, dan menu unggulan, serta dapat menuju halaman lain. | Pengguna |
| UC-02 | Melihat About Us dan Event | Pengunjung berada di website dan membuka menu About Us. | 1. Pengunjung menekan About Us pada navbar atau tombol "Selengkapnya".<br>2. Sistem menampilkan hero cerita brand dan informasi kualitas.<br>3. Pengunjung menggulir; sistem menampilkan "The Art of the Roast", Signature Blend, dan "A Space for Connection".<br>4. Sistem menampilkan Monthly Events berupa kalender dan card event (judul, tanggal, status, lokasi).<br>5. Pengunjung memilih tanggal atau card event untuk melihat informasi.<br><br>**Alternatif:** Tidak ada event pada bulan terpilih → sistem menampilkan pesan "Belum ada event". | Pengguna memahami cerita brand dan mengetahui jadwal serta status event kedai. | Pengguna |
| UC-03 | Melihat Catalog Menu | Pengguna membuka halaman Catalog Menu dari navbar atau tombol See All Menu. | 1. Sistem menampilkan sidebar kategori dan kartu menu kategori pertama.<br>2. Pengunjung memilih kategori lain; sistem menampilkan menu kategori tersebut dan memindahkan penanda aktif (merah).<br>3. Pengunjung dapat menekan ikon hati untuk memberi Love.<br><br>**Alternatif:** Menu tidak tersedia → kartu diberi penanda "Habis"; kategori kosong → pesan "Menu segera hadir". | Pengunjung melihat daftar menu per kategori beserta harga dan jumlah Love. | Pengguna |
| UC-04 | Melihat Detail Produk | Pengguna berada di Catalog Menu, Top Tier Lineup, atau kartu rekomendasi AI. | 1. Pengguna menekan kartu menu.<br>2. Sistem menampilkan halaman detail: gambar, nama, kategori, harga, deskripsi rasa, bahan baku, kalori/informasi penyajian.<br>3. Pengguna dapat menekan tombol Love.<br>4. Pengguna menekan Back untuk kembali ke daftar sebelumnya.<br><br>**Alternatif:** Menu telah dihapus admin → sistem menampilkan pesan dan mengarahkan ke katalog. | Pengunjung mengetahui komposisi dan informasi lengkap menu (harga bersifat informasi; pemesanan di kedai). | Pengguna |
| UC-05 | Berinteraksi dengan AI Assistant | Pengguna membuka AI Assistant dari ikon AI pada navbar.<br>Layanan AI dapat dijangkau oleh server. | 1. Sistem menampilkan sapaan dan suggestion chips (mis. rekomendasi minuman).<br>2. Pengguna mengetik atau memilih pertanyaan, mis. "kopi susu yang tidak terlalu manis".<br>3. Sistem mengirim pertanyaan, riwayat sesi, menu tersedia, dan basis pengetahuan ke layanan AI melalui server.<br>4. Sistem menampilkan jawaban AI beserta kartu rekomendasi produk.<br>5. Pengguna menekan kartu untuk membuka detail produk, atau melanjutkan bertanya.<br><br>**Alternatif:** Layanan AI gagal atau batas penggunaan terlampaui → pesan ramah dan tautan ke katalog; pertanyaan di luar topik kedai → AI menolak dengan sopan. | Pengguna menerima rekomendasi menu atau informasi kedai; percakapan tersimpan pada sesi anonim. | Pengguna |
| UC-06 | Login Admin dan Hak Akses | Admin/Owner sudah memiliki akun yang dibuat Owner. | 1. Admin membuka halaman login admin.<br>2. Admin mengisi username/email dan password.<br>3. Sistem memverifikasi kredensial dan menentukan peran (Admin atau Owner).<br>4. Sistem menampilkan dashboard; menu statistik dan pengelolaan akun hanya tampil untuk Owner.<br><br>**Alternatif:** Kredensial salah → pesan kesalahan; percobaan berulang dibatasi sementara. | Sesi admin aktif dengan hak akses sesuai peran. | Admin, Owner |
| UC-07 | Kelola Menu dan Stok | Admin sudah login. | 1. Admin membuka halaman Menu & Stok; sistem menampilkan tabel menu.<br>2. Admin menekan Tambah atau memilih menu untuk diubah.<br>3. Admin mengisi nama, kategori, harga, deskripsi, bahan baku, kalori, gambar, dan status ketersediaan.<br>4. Admin menyimpan; sistem memvalidasi dan menyimpan perubahan.<br>5. Admin dapat menandai menu "Habis" atau menghapusnya (dengan konfirmasi).<br><br>**Alternatif:** Data wajib kosong atau harga tidak valid → pesan kesalahan, data tidak disimpan. | Katalog publik menampilkan data menu dan ketersediaan terbaru. | Admin, Owner |
| UC-08 | Kelola Promo dan Event | Admin sudah login. | 1. Admin membuka halaman Promo & Event.<br>2. Admin menambah atau mengubah promo/event (judul, deskripsi, gambar, tanggal, lokasi, status).<br>3. Admin memilih Publish atau Draft.<br>4. Admin menyimpan; sistem memvalidasi dan menyimpan.<br><br>**Alternatif:** Tanggal selesai sebelum tanggal mulai → pesan kesalahan. | Promo tampil pada landing page dan event tampil pada About Us sesuai periode dan status publikasi. | Admin, Owner |
