CREATE DATABASE IF NOT EXISTS tara_db;
USE tara_db;

-- -- 1. Tabel toko
-- CREATE TABLE toko (
--     tokoID INT AUTO_INCREMENT PRIMARY KEY,
--     namaToko VARCHAR(100) NOT NULL,
--     alamat TEXT NOT NULL,
--     nomorTelepon VARCHAR(20),
--     jamOperasional VARCHAR(100)
-- );

-- 2. Tabel users
CREATE TABLE users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    tokoID INT NOT NULL,
    namaUser VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Kasir', 'Owner') NOT NULL,
    statusUser ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
    FOREIGN KEY (tokoID) REFERENCES toko(tokoID)
);

-- 3. Tabel kategori menu
CREATE TABLE kategori_menu (
    kategoriID INT AUTO_INCREMENT PRIMARY KEY,
    namaKategori VARCHAR(100) NOT NULL,
    deskripsiKategori TEXT,
);

-- 4. Tabel menu
CREATE TABLE menu (
    menuID INT AUTO_INCREMENT PRIMARY KEY,
    kategoriID INT NOT NULL,
    namaMenu VARCHAR(100) NOT NULL,
    deskripsiMenu TEXT,
    harga DECIMAL(12,2) NOT NULL,
    satuan VARCHAR(30) DEFAULT 'Porsi',
    stockMin INT DEFAULT 0,
    stock INT DEFAULT 0,
    fotoMenu VARCHAR(255),
    statusMenu ENUM('Tersedia', 'Habis', 'Nonaktif') DEFAULT 'Tersedia',
    FOREIGN KEY (kategoriID) REFERENCES kategori_menu(kategoriID)
);

-- 5. Tabel meja
CREATE TABLE meja (
    mejaID INT AUTO_INCREMENT PRIMARY KEY,
    tokoID INT NOT NULL,
    nomorMeja VARCHAR(10) NOT NULL,
    kapasitas INT NOT NULL,
    lokasiMeja ENUM('Indoor', 'Outdoor', 'Bar', 'Semi Outdoor') NOT NULL,
    statusMeja ENUM('Tersedia', 'Terisi', 'Tidak Digunakan') DEFAULT 'Tersedia',
    FOREIGN KEY (tokoID) REFERENCES toko(tokoID)
);

-- 6. Tabel penjualan
CREATE TABLE penjualan (
    kodeJual INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    mejaID INT NULL,
    tglJual DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipePesanan ENUM('Dine In', 'Take Away') NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    pajak DECIMAL(12,2) DEFAULT 0,
    diskon DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    statusPenjualan ENUM('Diproses', 'Selesai', 'Dibatalkan') DEFAULT 'Diproses',
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (mejaID) REFERENCES meja(mejaID)
);

-- 7. Tabel detail penjualan
CREATE TABLE penjualan_detail (
    kodeJual INT NOT NULL,
    menuID INT NOT NULL,
    quantity INT NOT NULL,
    hargaSatuan DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (kodeJual, menuID),
    FOREIGN KEY (kodeJual) REFERENCES penjualan(kodeJual),
    FOREIGN KEY (menuID) REFERENCES menu(menuID)
);

-- 8. Tabel pembayaran
CREATE TABLE pembayaran (
    pembayaranID INT AUTO_INCREMENT PRIMARY KEY,
    kodeJual INT NOT NULL,
    metodePembayaran ENUM('QRIS', 'Cash', 'E-Wallet', 'Transfer') NOT NULL,
    jumlahBayar DECIMAL(12,2) NOT NULL,
    jumlahKembalian DECIMAL(12,2) DEFAULT 0,
    statusPembayaran ENUM('Menunggu', 'Berhasil', 'Gagal') DEFAULT 'Menunggu',
    tglPembayaran DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kodeJual) REFERENCES penjualan(kodeJual)
);

-- 9. Tabel events
CREATE TABLE events (
    eventID INT AUTO_INCREMENT PRIMARY KEY,
    namaEvent VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    tanggalEvent DATE NOT NULL,
    waktuEvent TIME,
    image VARCHAR(255),
    statusEvent ENUM('AVAILABLE', 'FULLY BOOKED') DEFAULT 'AVAILABLE'
);

-- 10. Tabel fasilitas
CREATE TABLE fasilitas (
    fasilitasID INT AUTO_INCREMENT PRIMARY KEY,
    namaFasilitas VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    kapasitas INT,
    image VARCHAR(255)
);

-- Data tabel toko
-- INSERT INTO toko
-- (namaToko, alamat, nomorTelepon, jamOperasional)
-- VALUES
-- ('Tara Coffee Kemanggisan', 'Jl. Kemanggisan Raya No. 10, Jakarta', '081234567801', '08:00-22:00'),
-- ('Tara Coffee Alam Sutera', 'Jl. Alam Sutera No. 20, Tangerang', '081234567802', '08:00-23:00'),
-- ('Tara Coffee Bandung', 'Jl. Dago No. 15, Bandung', '081234567803', '09:00-22:00'),
-- ('Tara Coffee Bogor', 'Jl. Pajajaran No. 25, Bogor', '081234567804', '08:00-21:00'),
-- ('Tara Coffee Depok', 'Jl. Margonda Raya No. 30, Depok', '081234567805', '09:00-22:00');

-- Data tabel user
INSERT INTO users
(tokoID, namaUser, username, password, role, statusUser)
VALUES
(1, 'Andi Pratama', 'andi', 'hash_password_andi', 'Kasir', 'Aktif'),
(2, 'Budi Santoso', 'budi', 'hash_password_budi', 'Kasir', 'Aktif'),
(3, 'Citra Lestari', 'citra', 'hash_password_citra', 'Admin', 'Aktif'),
(4, 'Deni Saputra', 'deni', 'hash_password_deni', 'Kasir', 'Aktif'),
(5, 'Eka Putri', 'eka', 'hash_password_eka', 'Owner', 'Aktif');

-- Data tabel kategori_menu, harusnya ga ush pake status kategori gasih?
INSERT INTO kategori_menu
(namaKategori, deskripsiKategori)
VALUES
('Tara Signature Coffee', 'Menu kopi khas Tara Coffee'),
('Tara Coffee Basic', 'Menu kopi dasar dan tradisional'),
('Basic Tea', 'Aneka minuman teh'),
('Basic Powder', 'Minuman berbahan dasar bubuk'),
('Jajanan Pasar', 'Makanan ringan tradisional');

-- Data tabel menu
INSERT INTO menu
(kategoriID, namaMenu, deskripsiMenu, harga, satuan, stockMin, stock, fotoMenu, statusMenu)
VALUES
(1, 'Ta Co Syuu', 'Kopi signature khas Tara Coffee', 17000, 'Gelas', 5, 30, 'ta-co-syuu.jpg', 'Tersedia'),
(2, 'Kopi Tubruk', 'Kopi hitam tradisional dengan aroma kuat', 12000, 'Gelas', 5, 25, 'kopi-tubruk.jpg', 'Tersedia'),
(3, 'Thai Tea', 'Minuman teh susu khas Thailand', 15000, 'Gelas', 5, 20, 'thai-tea.jpg', 'Tersedia'),
(4, 'Cokelat Creamy', 'Minuman cokelat dengan tekstur creamy', 16000, 'Gelas', 5, 15, 'cokelat-creamy.jpg', 'Tersedia'),
(5, 'Klepon', 'Jajanan tradisional dengan rasa gula merah', 8000, 'Porsi', 3, 12, 'klepon.jpg', 'Tersedia');

-- Data tabel meja
INSERT INTO meja
(tokoID, nomorMeja, kapasitas, lokasiMeja, statusMeja)
VALUES
(1, 'M01', 2, 'Indoor', 'Tersedia'),
(1, 'M02', 4, 'Indoor', 'Tersedia'),
(2, 'M01', 4, 'Outdoor', 'Tersedia'),
(3, 'M01', 6, 'Semi Outdoor', 'Terisi'),
(4, 'M01', 2, 'Bar', 'Tersedia');

-- Data tabel penjualan, ini untuk pov owner/kasir kah?
INSERT INTO penjualan
(userID, mejaID, tglJual, tipePesanan, subtotal, pajak, diskon, total, statusPenjualan)
VALUES
(1, 1, '2026-10-19 09:00:00', 'Dine In', 34000, 3400, 0, 37400, 'Selesai'),
(2, 2, '2026-10-19 10:15:00', 'Dine In', 24000, 2400, 0, 26400, 'Selesai'),
(3, NULL, '2026-10-19 11:30:00', 'Take Away', 15000, 1500, 0, 16500, 'Selesai'),
(4, 3, '2026-10-19 13:00:00', 'Dine In', 32000, 3200, 2000, 33200, 'Selesai'),
(5, NULL, '2026-10-19 14:20:00', 'Take Away', 8000, 800, 0, 8800, 'Diproses');

-- Data tabel penjualan_detail
INSERT INTO penjualan_detail
(kodeJual, menuID, quantity, hargaSatuan, subtotal)
VALUES
(1, 1, 2, 17000, 34000),
(2, 2, 2, 12000, 24000),
(3, 3, 1, 15000, 15000),
(4, 4, 2, 16000, 32000),
(5, 5, 1, 8000, 8000);

-- Data tabel pembayaran
INSERT INTO pembayaran
(kodeJual, metodePembayaran, jumlahBayar, jumlahKembalian, statusPembayaran)
VALUES
(1, 'QRIS', 37400, 0, 'Berhasil'),
(2, 'Cash', 30000, 3600, 'Berhasil'),
(3, 'E-Wallet', 16500, 0, 'Berhasil'),
(4, 'QRIS', 33200, 0, 'Berhasil'),
(5, 'Cash', 10000, 1200, 'Menunggu');

-- Data tabel events, ga ada statusnya, hanya menampilkan adanya event bulanan 
INSERT INTO events
(namaEvent, deskripsi, tanggalEvent, waktuEvent, image, statusEvent)
VALUES
('Coffee Brewing Class', 'Kelas membuat kopi untuk pemula', '2026-11-05', '10:00:00', 'brewing-class.jpg', ''),
('Live Acoustic Night', 'Pertunjukan musik akustik', '2026-11-12', '19:00:00',  'acoustic-night.jpg', 'Aktif'),
('Coffee Talk', 'Diskusi mengenai kopi lokal', '2026-11-20', '15:00:00', 'coffee-talk.jpg', 'Aktif'),
('Latte Art Workshop', 'Pelatihan dasar latte art', '2026-11-25', '13:00:00', 'latte-art.jpg', 'Draft'),
('Community Gathering', 'Pertemuan komunitas kopi', '2026-12-01', '16:00:00', 'community.jpg', 'Aktif');

-- Data tabel fasilitas
INSERT INTO fasilitas
(namaFasilitas, deskripsi, kapasitas, image)
VALUES
('Indoor Area', 'Ruangan ber-AC untuk bekerja dan bersantai', 30, 'indoor.jpg'),
('Outdoor Area', 'Area terbuka dengan suasana nyaman', 20, 'outdoor.jpg'),
('Wi-Fi', 'Internet gratis untuk pelanggan', 100, 'wifi.jpg'),
('Meeting Room', 'Ruangan khusus untuk rapat kecil', 8, 'meeting-room.jpg'),
('Live Music Stage', 'Area pertunjukan musik dan event', 50, 'live-music.jpg');