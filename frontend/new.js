classDiagram
direction TB

class users {
  -int userID
  -string email
  -string username
  -string passwordHash
  -UserRole role
  -UserStatus statusUser
  +verifyPassword(rawPassword) Promise~boolean~
  +activate() void
  +deactivate() void
}

class kategori_menu {
  -int kategoriID
  -string namaKategori
  +rename(namaKategori) void
  +validate() boolean
}

class menu {
  -int menuID
  -int kategoriID
  -string namaMenu
  -string deskripsiMenu
  -Decimal harga
  -string satuan
  -int stockMin
  -int stock
  -string fotoMenu
  -MenuStatus statusMenu
  +changePrice(harga) void
  +decreaseStock(quantity) void
  +isAvailable() boolean
}

class fasilitas {
  -int fasilitasID
  -string namaFasilitas
  -string deskripsiFasilitas
  -string image
  +updateDescription(description) void
}

class meja {
  -int mejaID
  -int fasilitasID
  -string kodeMeja
  -int kapasitas
  -TableStatus statusMeja
  +reserve() void
  +release() void
  +canSeat(jumlahOrang) boolean
}

class penjualan {
  -int kodeJual
  -int userID
  -int mejaID
  -DateTime tglJual
  -OrderType tipePesanan
  -Decimal subtotal
  -Decimal pajak
  -Decimal diskon
  -Decimal total
  -SaleStatus statusPenjualan
  +addDetail(detail) void
  +calculateTotal() Decimal
  +complete() void
  +cancel() void
}

class penjualan_detail {
  -int kodeJual
  -int menuID
  -int quantity
  -Decimal hargaSatuan
  -Decimal subtotal
  +calculateSubtotal() Decimal
  +changeQuantity(quantity) void
}

class pembayaran {
  -int pembayaranID
  -int kodeJual
  -PaymentMethod metodePembayaran
  -Decimal jumlahBayar
  -Decimal jumlahKembalian
  -PaymentStatus statusPembayaran
  -DateTime tglPembayaran
  +process() Promise~void~
  +calculateChange(total) Decimal
  +markFailed() void
}

class events {
  -int eventID
  -string namaEvent
  -string deskripsi
  -Date tanggalEvent
  -Time waktuEvent
  -string image
  -EventStatus statusEvent
  +publish() void
  +close() void
}

class email_verification {
  -int verificationID
  -int userID
  -string verificationCode
  -DateTime expiresAt
  -boolean isUsed
  +isExpired() boolean
  +consume() void
}

class password_reset {
  -int resetID
  -int userID
  -string resetToken
  -DateTime expiresAt
  -boolean isUsed
  +isExpired() boolean
  +consume() void
}

kategori_menu "1" --> "many" menu : contains
fasilitas "1" --> "many" meja : provides
users "1" --> "many" penjualan : creates
meja "1" --> "many" penjualan : used by
penjualan "1" --> "many" penjualan_detail : has
menu "1" --> "many" penjualan_detail : selected in
penjualan "1" --> "1" pembayaran : paid by
users "1" --> "many" email_verification : receives
users "1" --> "many" password_reset : requests