    CREATE DATABASE IF NOT EXISTS tara_db;
    USE tara_db;

    -- Tabel users
    CREATE TABLE users (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        namaUser VARCHAR(100) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Kasir', 'Owner') NOT NULL,
        statusUser ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif'
    );

    -- Tabel kategori menu
    CREATE TABLE kategori_menu (
        kategoriID INT AUTO_INCREMENT PRIMARY KEY,
        namaKategori VARCHAR(100) NOT NULL,
        deskripsiKategori TEXT
    );

    -- Tabel menu
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

    -- Tabel meja
    CREATE TABLE meja (
        mejaID INT AUTO_INCREMENT PRIMARY KEY,
        nomorMeja VARCHAR(10) NOT NULL,
        kapasitas INT NOT NULL,
        lokasiMeja ENUM('Indoor', 'Outdoor', 'Bar', 'Semi Outdoor') NOT NULL,
        statusMeja ENUM('Tersedia', 'Terisi', 'Tidak Digunakan') DEFAULT 'Tersedia'
    );

    -- Tabel penjualan
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

    -- Tabel detail penjualan
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

    -- Tabel pembayaran
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

    -- Tabel events
    CREATE TABLE events (
        eventID INT AUTO_INCREMENT PRIMARY KEY,
        namaEvent VARCHAR(100) NOT NULL,
        deskripsi TEXT,
        tanggalEvent DATE NOT NULL,
        waktuEvent TIME,
        image VARCHAR(255),
        statusEvent ENUM('AVAILABLE', 'FULLY BOOKED') DEFAULT 'AVAILABLE'
    );

    -- Tabel fasilitas
    CREATE TABLE fasilitas (
        fasilitasID INT AUTO_INCREMENT PRIMARY KEY,
        namaFasilitas VARCHAR(100) NOT NULL,
        deskripsi TEXT,
        kapasitas INT,
        image VARCHAR(255)
    );

    -- Data tabel user
    INSERT INTO users
    (namaUser, username, password, role, statusUser)
    VALUES
    ('Andi Pratama', 'andi', 'hash_password_andi', 'Kasir', 'Aktif'),
    ('Budi Santoso', 'budi', 'hash_password_budi', 'Kasir', 'Aktif'),
    ('Citra Lestari', 'citra', 'hash_password_citra', 'Admin', 'Aktif'),
    ('Deni Saputra', 'deni', 'hash_password_deni', 'Kasir', 'Aktif'),
    ('Eka Putri', 'eka', 'hash_password_eka', 'Owner', 'Aktif');

    -- Data tabel kategori_menu
    INSERT INTO kategori_menu
    (namaKategori, deskripsiKategori)
    VALUES
    ('Tara Signature Coffee', 'Menu kopi khas Tara Coffee'),
    ('Tara Coffee Basic', 'Menu kopi dasar dan tradisional'),
    ('Basic Tea', 'Aneka minuman teh'),
    ('Basic Powder', 'Minuman berbahan dasar bubuk'),
    ('Jajanan Pasar', 'Makanan ringan tradisional');

    -- Data tabel menu
    INSERT INTO menu (kategoriID, namaMenu, deskripsiMenu, harga, satuan, stockMin, stock, fotoMenu, statusMenu) 
    VALUES
    (1, 'Ta Co Syuu', 'Sweet milk coffee with a distinctive aroma, soft, and creamy taste.', 17000, 'Gelas', 5, 30, 'assets/menu/tacosyuu.jpg', 'Tersedia'),
    (2, 'Kopi Tubruk', 'Dark black tubruk coffee with a strong aroma and traditional taste.', 12000, 'Gelas', 5, 25, 'assets/menu/kopi tubruk.jpg', 'Tersedia'),
    (1, 'Caramella', 'Sweet caramel with milk coffee, soft, and satisfying taste.', 20000, 'Gelas', 5, 30, 'assets/menu/caramella.jpg', 'Tersedia'),
    (1, 'Gendis', 'Sweet gendis with rich palm sugar and naturally delicious taste.', 20000, 'Gelas', 5, 30, 'assets/menu/gendis.jpg', 'Tersedia'),
    (1, 'Ta Co Brrr', 'Refreshing basic cold brew with a strong coffee flavor.', 22000, 'Gelas', 5, 25, 'assets/menu/tacobrr.jpg', 'Tersedia'),
    (2, 'Kopi Saring Susu', 'Rich coffee with sweetened condensed milk and a soft taste.', 15000, 'Gelas', 5, 25, 'assets/menu/kopi saring susu.jpg', 'Tersedia'),
    (2, 'Kopi Saring Butter', 'Butter-filtered coffee with a rich and smooth taste.', 16000, 'Gelas', 5, 25, 'assets/menu/kopi saring butter.jpg', 'Tersedia'),
    (2, 'Kopi Susu Tubruk', 'Full-flavored milk coffee with a smooth sweetness.', 13000, 'Gelas', 5, 25, 'assets/menu/kopi susu tubruk.jpg', 'Tersedia'),
    (2, 'Kopi Saring Hitam', 'Dark black filtered coffee with a distinctive taste.', 14000, 'Gelas', 5, 25, 'assets/menu/kopi saring hitam.jpg', 'Tersedia'),
    (3, 'Jasmine Tea', 'Fragrant jasmine tea with a soothing floral note.', 12000, 'Gelas', 5, 20, 'assets/menu/jasmine tea.jpg', 'Tersedia'),
    (3, 'Camomile', 'Soothing chamomile flavor with a calming floral note.', 12000, 'Gelas', 5, 20, 'assets/menu/camomile.jpg', 'Tersedia'),
    (4, 'Es Coklat', 'Soft and creamy chocolate ice with a rich chocolate flavor.', 15000, 'Gelas', 5, 15, 'assets/menu/es coklat.jpg', 'Tersedia'),
    (4, 'Cokelat Kopi', 'Cold chocolate coffee with ice and a soft indulgent taste.', 22000, 'Gelas', 5, 15, 'assets/menu/cokelat kopi.jpg', 'Tersedia'),
    (4, 'Greentea', 'Refreshing green tea paired with smooth fresh milk.', 20000, 'Gelas', 5, 20, 'assets/menu/green tea.jpg', 'Tersedia'),
    (5, 'Dimsum', 'Soft chicken dimsum with a tender wrapper and aromatic taste.', 15000, 'Porsi', 5, 15, 'assets/menu/dimsum.jpg', 'Tersedia'),
    (5, 'Gyoza', 'Chicken gyoza with tender skin and savory flavor.', 15000, 'Porsi', 5, 15, 'assets/menu/gyoza.jpg', 'Tersedia');

    -- Data tabel meja
    INSERT INTO meja
    (nomorMeja, kapasitas, lokasiMeja, statusMeja)
    VALUES
    ('M01', 2, 'Indoor', 'Tersedia'),
    ('M02', 4, 'Indoor', 'Tersedia'),
    ('M01', 4, 'Outdoor', 'Tersedia'),
    ('M01', 6, 'Semi Outdoor', 'Terisi'),
    ('M01', 2, 'Bar', 'Tersedia');

    -- Data tabel penjualan
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

    -- Data tabel events
    INSERT INTO events
    (namaEvent, deskripsi, tanggalEvent, waktuEvent, image, statusEvent)
    VALUES
    ('Coffee Brewing Class', 'Kelas membuat kopi untuk pemula', '2026-11-05', '10:00:00', 'brewing-class.jpg', 'AVAILABLE'),
    ('Live Acoustic Night', 'Pertunjukan musik akustik', '2026-11-12', '19:00:00',  'acoustic-night.jpg', 'AVAILABLE'),
    ('Coffee Talk', 'Diskusi mengenai kopi lokal', '2026-11-20', '15:00:00', 'coffee-talk.jpg', 'FULLY BOOKED'),
    ('Latte Art Workshop', 'Pelatihan dasar latte art', '2026-11-25', '13:00:00', 'latte-art.jpg', 'AVAILABLE'),
    ('Community Gathering', 'Pertemuan komunitas kopi', '2026-12-01', '16:00:00', 'community.jpg', 'FULLY BOOKED');

    -- Data tabel fasilitas
    INSERT INTO fasilitas
    (namaFasilitas, deskripsi, kapasitas, image)
    VALUES
    ('Indoor Area', 'Ruangan ber-AC untuk bekerja dan bersantai', 30, 'indoor.jpg'),
    ('Outdoor Area', 'Area terbuka dengan suasana nyaman', 20, 'outdoor.jpg'),
    ('Wi-Fi', 'Internet gratis untuk pelanggan', 100, 'wifi.jpg'),
    ('Meeting Room', 'Ruangan khusus untuk rapat kecil', 8, 'meeting-room.jpg'),
    ('Live Music Stage', 'Area pertunjukan musik dan event', 50, 'live-music.jpg');
