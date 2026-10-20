    CREATE DATABASE IF NOT EXISTS tara_db;
    USE tara_db;

    -- Tabel users
    CREATE TABLE users (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        namaUser VARCHAR(100) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Cashier', 'Owner') NOT NULL,
        statusUser ENUM('Active', 'Inactive') DEFAULT 'Active'
    );

    -- Tabel kategori menu
    CREATE TABLE kategori_menu (
        kategoriID INT AUTO_INCREMENT PRIMARY KEY,
        namaKategori VARCHAR(100) NOT NULL
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
        statusMenu ENUM('Available', 'Unavailable') DEFAULT 'Available',
        FOREIGN KEY (kategoriID) REFERENCES kategori_menu(kategoriID)
    );

    -- Tabel meja
    CREATE TABLE meja (
        mejaID INT AUTO_INCREMENT PRIMARY KEY,
        nomorMeja VARCHAR(10) NOT NULL,
        kapasitas INT NOT NULL,
        lokasiMeja ENUM('Indoor', 'Outdoor', 'Bar', 'Semi Outdoor') NOT NULL,
        statusMeja ENUM('Available', 'Selected', 'Reserved') DEFAULT 'Available'
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
        statusPenjualan ENUM('Processing', 'Completed', 'Cancelled') DEFAULT 'Processing',
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
        statusPembayaran ENUM('Pending', 'Success', 'Failed') DEFAULT 'Pending',
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
        statusEvent ENUM('Available', 'Fully booked') DEFAULT 'Available'
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
    ('Ana', 'anana', 'ana123', 'Cashier', 'Active'),
    ('Putri', 'putt3', 'putri123', 'Cashier', 'Active'),
    ('Tari', 'tariri', 'tari123', 'Admin', 'Active'),
    ('Putra', 'putraa', 'putra123', 'Cashier', 'Active'),
    ('Tara', 'tarara', 'tara123', 'Owner', 'Active'),
    ('Tata', 'tatata', 'tata123', 'Cashier', 'Active');

    -- Data tabel kategori_menu
    INSERT INTO kategori_menu
    (namaKategori)
    VALUES
    ('Tara Signature Coffee'),
    ('Tara Coffee Basic'),
    ('Basic Tea'),
    ('Basic Powder'),
    ('Jajanan Pasar');

    -- Data tabel menu
    INSERT INTO menu (kategoriID, namaMenu, deskripsiMenu, harga, satuan, stockMin, stock, fotoMenu, statusMenu) 
    VALUES
    (1, 'Ta Co Syuu', 'Sweet milk coffee with a distinctive aroma, soft, and creamy taste.', 17000, 'Gelas', 5, 30, 'assets/menu/tacosyuu.jpg', 'Available'),
    (2, 'Kopi Tubruk', 'Dark black tubruk coffee with a strong aroma and traditional taste.', 12000, 'Gelas', 5, 25, 'assets/menu/kopi tubruk.jpg', 'Available'),
    (1, 'Caramella', 'Sweet caramel with milk coffee, soft, and satisfying taste.', 20000, 'Gelas', 5, 30, 'assets/menu/caramella.jpg', 'Available'),
    (1, 'Gendis', 'Sweet gendis with rich palm sugar and naturally delicious taste.', 20000, 'Gelas', 5, 30, 'assets/menu/gendis.jpg', 'Available'),
    (1, 'Ta Co Brrr', 'Refreshing basic cold brew with a strong coffee flavor.', 22000, 'Gelas', 5, 25, 'assets/menu/tacobrr.jpg', 'Available'),
    (2, 'Kopi Saring Susu', 'Rich coffee with sweetened condensed milk and a soft taste.', 15000, 'Gelas', 5, 25, 'assets/menu/kopi saring susu.jpg', 'Available'),
    (2, 'Kopi Saring Butter', 'Butter-filtered coffee with a rich and smooth taste.', 16000, 'Gelas', 5, 25, 'assets/menu/kopi saring butter.jpg', 'Available'),
    (2, 'Kopi Susu Tubruk', 'Full-flavored milk coffee with a smooth sweetness.', 13000, 'Gelas', 5, 25, 'assets/menu/kopi susu tubruk.jpg', 'Available'),
    (2, 'Kopi Saring Hitam', 'Dark black filtered coffee with a distinctive taste.', 14000, 'Gelas', 5, 25, 'assets/menu/kopi saring hitam.jpg', 'Available'),
    (3, 'Jasmine Tea', 'Fragrant jasmine tea with a soothing floral note.', 12000, 'Gelas', 5, 20, 'assets/menu/jasmine tea.jpg', 'Available'),
    (3, 'Camomile', 'Soothing chamomile flavor with a calming floral note.', 12000, 'Gelas', 5, 20, 'assets/menu/camomile.jpg', 'Available'),
    (4, 'Es Coklat', 'Soft and creamy chocolate ice with a rich chocolate flavor.', 15000, 'Gelas', 5, 15, 'assets/menu/es coklat.jpg', 'Available'),
    (4, 'Cokelat Kopi', 'Cold chocolate coffee with ice and a soft indulgent taste.', 22000, 'Gelas', 5, 15, 'assets/menu/cokelat kopi.jpg', 'Available'),
    (4, 'Greentea', 'Refreshing green tea paired with smooth fresh milk.', 20000, 'Gelas', 5, 20, 'assets/menu/green tea.jpg', 'Available'),
    (5, 'Dimsum', 'Soft chicken dimsum with a tender wrapper and aromatic taste.', 15000, 'Porsi', 5, 15, 'assets/menu/dimsum.jpg', 'Available'),
    (5, 'Gyoza', 'Chicken gyoza with tender skin and savory flavor.', 15000, 'Porsi', 5, 15, 'assets/menu/gyoza.jpg', 'Available');

    -- Data tabel penjualan
    INSERT INTO penjualan
    (userID, mejaID, tglJual, tipePesanan, subtotal, pajak, diskon, total, statusPenjualan)
    VALUES
    (1, 1, '2026-10-19 09:00:00', 'Dine In', 34000, 3400, 0, 37400, 'Completed'),
    (2, 2, '2026-10-19 10:15:00', 'Dine In', 24000, 2400, 0, 26400, 'Completed'),
    (3, NULL, '2026-10-19 11:30:00', 'Take Away', 15000, 1500, 0, 16500, 'Completed'),
    (4, 3, '2026-10-19 13:00:00', 'Dine In', 32000, 3200, 2000, 33200, 'Completed'),
    (5, NULL, '2026-10-19 14:20:00', 'Take Away', 8000, 800, 0, 8800, 'Processing');

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
    (1, 'QRIS', 37400, 0, 'Success'),
    (2, 'Cash', 30000, 3600, 'Success'),
    (3, 'E-Wallet', 16500, 0, 'Success'),
    (4, 'QRIS', 33200, 0, 'Success'),
    (5, 'Cash', 10000, 1200, 'Pending');

    -- Data tabel events
    INSERT INTO events
    (namaEvent, deskripsi, tanggalEvent, waktuEvent, image, statusEvent)
    VALUES
    ('Coffee Brewing Class', 'Kelas membuat kopi untuk pemula', '2026-11-05', '10:00:00', 'brewing-class.jpg', 'Available'),
    ('Live Acoustic Night', 'Pertunjukan musik akustik', '2026-11-12', '19:00:00', 'acoustic-night.jpg', 'Available'),
    ('Coffee Talk', 'Diskusi mengenai kopi lokal', '2026-11-20', '15:00:00', 'coffee-talk.jpg', 'Fully booked'),
    ('Latte Art Workshop', 'Pelatihan dasar latte art', '2026-11-25', '13:00:00', 'latte-art.jpg', 'Available'),
    ('Community Gathering', 'Pertemuan komunitas kopi', '2026-12-01', '16:00:00', 'community.jpg', 'Fully booked');

    -- Data tabel fasilitas
<<<<<<< HEAD
    INSERT INTO fasilitas (namaFasilitas, deskripsiFasilitas, image) VALUES
    ('Indoor', 'Cozy atmosphere with warm interiors, ideal for meetings or simply enjoying your favorite coffee.', 'indoor.jpg'),
    ('Semi outdoor', 'An open yet comfortable atmosphere, great for casual meetings or quality time with friends.', 'semi-outdoor.jpg'),
    ('The Bar', 'Sit at the bar and watch our baristas craft your special coffee with passion and expertise.', 'the-bar.jpg'),
    ('Coffee Bar', 'Perfect for solo coffee enthusiasts who love watching the craft of brewing up close.', 'coffee-bar.jpg'),
    ('Semi outdoor terrace', 'Enjoy the sunset while sipping your coffee, an unforgettable coffee experience!', 'semi-outdoor-terrace.jpg'),
    ('Outdoor', 'Coffee under the open sky, experience the freedom and tranquility of nature.', 'outdoor.jpg');

     -- Data tabel meja
    INSERT INTO meja (fasilitasID, kodeMeja, kapasitas, statusMeja) VALUES
    (1, 'L-01', 4, 'Selected'),
    (2, 'S-02', 2, 'Reserved'),
    (3, 'B-01', 2, 'Available'),
    (4, 'S-04', 1, 'Available'),
    (5, 'S-01', 4, 'Reserved');
=======
    INSERT INTO fasilitas
    (namaFasilitas, deskripsi, kapasitas, image)
    VALUES
    ('Indoor Area', 'Ruangan ber-AC untuk bekerja dan bersantai', 30, 'indoor.jpg'),
    ('Outdoor Area', 'Area terbuka dengan suasana nyaman', 20, 'outdoor.jpg'),
    ('Wi-Fi', 'Internet gratis untuk pelanggan', 100, 'wifi.jpg'),
    ('Meeting Room', 'Ruangan khusus untuk rapat kecil', 8, 'meeting-room.jpg'),
    ('Live Music Stage', 'Area pertunjukan musik dan event', 50, 'live-music.jpg');
>>>>>>> a97c7f8ad4448cdb18a726849e9e2ed065390689
