// =========================================================
// KkTF - admin.js (bagian bersama semua halaman admin)
// Isi: pengaman akses, penyimpanan data contoh, fungsi bantu.
// Halaman lain memakainya lewat window.Admin.
// =========================================================

(function () {
  "use strict";

  // ---------- Pengaman akses ----------
  // CATATAN: ini hanya untuk tampilan. Keamanan sebenarnya ada di backend:
  // setiap permintaan ubah data harus diperiksa peran admin-nya di server.
  // SEMENTARA: peran dibaca dari localStorage "kktf_user". Saat backend siap,
  // ganti dengan pemanggilan API (misalnya GET /api/auth/me).
  let user = null;
  try{
    user = JSON.parse(localStorage.getItem("kktf_user") || "null");
  } catch (error) {
    user = null;
  }
  const userRole = String(user?.role || "").toLowerCase();
  if (!user || userRole !== "admin") {
    window.location.replace("login.html");
    return;
  }
  document.body.classList.remove("is-guarded");

  // ---------- Konstanta ----------
  const TAX_RATE = 0.1;

  const CATEGORIES = {
    1: "Tara Signature Coffee",
    2: "Tara Coffee Basic",
    3: "Basic Tea",
    4: "Basic Powder",
    5: "Jajanan Pasar",
  };
  const STATUS_LABEL = { new: "New", preparing: "Preparing", done: "Done", cancelled: "Cancelled" };
  const METHOD_LABEL = { qris: "QRIS", cashier: "Pay at the cashier" };
  const TYPE_LABEL = { "dine-in": "Dine-in", takeaway: "Takeaway" };

  // ---------- Fungsi bantu ----------
  const rupiah = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");

  // Format singkat untuk sumbu grafik: 1,5 jt, 250 rb
  function short(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + " jt";
    if (n >= 1e3) return Math.round(n / 1e3) + " rb";
    return String(Math.round(n));
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  const pad = (n) => String(n).padStart(2, "0");
  const fmtDay = (d) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  const fmtDateTime = (d) => fmtDay(d) + ", " + pad(d.getHours()) + ":" + pad(d.getMinutes());

  // Pesan singkat di bawah layar
  let toastEl = null;
  let toastTimer = null;
  function toast(message) {
    if (!toastEl) {
      toastEl = el("div", "toast");
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 2600);
  }

  // Unduh CSV. Sel yang diawali = + - @ diberi tanda kutip di depan
  // supaya tidak dijalankan sebagai rumus saat dibuka di Excel.
  function csvCell(value) {
    let s = String(value === null || value === undefined ? "" : value);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }
  function downloadCSV(filename, header, rows) {
    const lines = [header].concat(rows).map((r) => r.map(csvCell).join(","));
    const blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------- Perhitungan pesanan ----------
  function orderTotals(order) {
    const subtotal = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    return { subtotal: subtotal, tax: tax, total: subtotal + tax };
  }

  // Pesanan dihitung sebagai pendapatan kalau sudah dibayar dan tidak dibatalkan
  const isRevenue = (order) => order.status !== "cancelled" && order.paid === true;

  // =========================================================
  // DATA CONTOH (SEMENTARA)
  // Bentuk menu sama dengan baris tabel `menu` di database.
  // Saat backend siap, ganti isi Store dengan fetch ke API
  // (GET/POST/PUT/DELETE /api/menu, GET/PUT /api/orders), tanpa mengubah halaman lain.
  // =========================================================
  const KEY_MENU = "kktf_admin_menu";
  const KEY_ORDERS = "kktf_admin_orders";

  const SEED_MENU = [
    [1, "Ta Co Syuu", "Sweet milk coffee with a distinctive aroma, soft, and creamy taste.", 17000, "Gelas", 5, 30, "assets/menu/tacosyuu.jpg"],
    [2, "Kopi Tubruk", "Dark black tubruk coffee with a strong aroma and traditional taste.", 12000, "Gelas", 5, 25, "assets/menu/kopi tubruk.jpg"],
    [1, "Caramella", "Sweet caramel with milk coffee, soft, and satisfying taste.", 20000, "Gelas", 5, 30, "assets/menu/caramella.jpg"],
    [1, "Gendis", "Sweet gendis with rich palm sugar and naturally delicious taste.", 20000, "Gelas", 5, 30, "assets/menu/gendis.jpg"],
    [1, "Ta Co Brrr", "Refreshing basic cold brew with a strong coffee flavor.", 22000, "Gelas", 5, 25, "assets/menu/tacobrr.jpg"],
    [2, "Kopi Saring Susu", "Rich coffee with sweetened condensed milk and a soft taste.", 15000, "Gelas", 5, 25, "assets/menu/kopi saring susu.jpg"],
    [2, "Kopi Saring Butter", "Butter-filtered coffee with a rich and smooth taste.", 16000, "Gelas", 5, 25, "assets/menu/kopi saring butter.jpg"],
    [2, "Kopi Susu Tubruk", "Full-flavored milk coffee with a smooth sweetness.", 13000, "Gelas", 5, 25, "assets/menu/kopi susu tubruk.jpg"],
    [2, "Kopi Saring Hitam", "Dark black filtered coffee with a distinctive taste.", 14000, "Gelas", 5, 25, "assets/menu/kopi saring hitam.jpg"],
    [3, "Jasmine Tea", "Fragrant jasmine tea with a soothing floral note.", 12000, "Gelas", 5, 20, "assets/menu/jasmine tea.jpg"],
    [3, "Camomile", "Soothing chamomile flavor with a calming floral note.", 12000, "Gelas", 5, 20, "assets/menu/camomile.jpg"],
    [4, "Es Coklat", "Soft and creamy chocolate ice with a rich chocolate flavor.", 15000, "Gelas", 5, 15, "assets/menu/es coklat.jpg"],
    [4, "Cokelat Kopi", "Cold chocolate coffee with ice and a soft indulgent taste.", 22000, "Gelas", 5, 15, "assets/menu/cokelat kopi.jpg"],
    [4, "Greentea", "Refreshing green tea paired with smooth fresh milk.", 20000, "Gelas", 5, 20, "assets/menu/green tea.jpg"],
    [5, "Dimsum", "Soft chicken dimsum with a tender wrapper and aromatic taste.", 15000, "Porsi", 5, 15, "assets/menu/dimsum.jpg"],
    [5, "Gyoza", "Chicken gyoza with tender skin and savory flavor.", 15000, "Porsi", 5, 15, "assets/menu/gyoza.jpg"],
  ].map((r, i) => ({
    menuID: i + 1,
    kategoriID: r[0],
    namaMenu: r[1],
    deskripsiMenu: r[2],
    harga: r[3],
    satuan: r[4],
    stockMin: r[5],
    stock: r[6],
    fotoMenu: r[7],
    statusMenu: "Available",
  }));

  // Pengacak yang hasilnya selalu sama, supaya data contoh stabil
  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Pesanan 35 hari terakhir. Harga disimpan per pesanan (snapshot), jadi
  // mengubah harga menu tidak mengubah riwayat pesanan lama.
  function seedOrders() {
    const rand = mulberry32(2026);
    const now = new Date();
    const orders = [];
    let counter = 1000;

    for (let back = 34; back >= 0; back--) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - back);
      const weekend = day.getDay() === 0 || day.getDay() === 6;
      const count = 6 + Math.floor(rand() * 8) + (weekend ? 5 : 0);

      for (let n = 0; n < count; n++) {
        const hour = Math.floor(8 + 15 * Math.pow(rand(), 0.7)); // lebih ramai menjelang malam
        const when = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, Math.floor(rand() * 60));
        if (when > now) continue;

        // Menu urutan awal lebih laris
        const picked = [];
        const want = 1 + Math.floor(rand() * 3);
        while (picked.length < want) {
          const idx = Math.floor(Math.pow(rand(), 1.6) * SEED_MENU.length);
          if (!picked.includes(idx)) picked.push(idx);
        }
        const items = picked.map((idx) => ({
          menuID: SEED_MENU[idx].menuID,
          name: SEED_MENU[idx].namaMenu,
          price: SEED_MENU[idx].harga,
          qty: rand() < 0.25 ? 2 : 1,
        }));

        const mode = rand() < 0.65 ? "dine-in" : "takeaway";
        const method = rand() < 0.6 ? "qris" : "cashier";
        const minutesAgo = (now - when) / 60000;

        let status;
        if (back === 0) status = minutesAgo < 15 ? "new" : minutesAgo < 40 ? "preparing" : "done";
        else status = rand() < 0.06 ? "cancelled" : "done";

        let paid = false;
        if (status === "done") paid = true;
        else if (status !== "cancelled") paid = method === "qris" && rand() < 0.8;

        counter += 1;
        orders.push({
          id: "KKTF-" + counter.toString(36).toUpperCase(),
          createdAt: when.toISOString(),
          mode: mode,
          table: mode === "dine-in" ? "T-" + pad(1 + Math.floor(rand() * 12)) : null,
          items: items,
          method: method,
          status: status,
          paid: paid,
        });
      }
    }
    return orders;
  }

  function load(key, seed) {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(saved)) return saved;
    } catch (e) {}
    const data = seed();
    save(key, data);
    return data;
  }

  function save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      toast("Could not save: browser storage is full.");
      return false;
    }
  }

  const Store = {
    getMenu: () => load(KEY_MENU, () => SEED_MENU),
    saveMenu: (rows) => save(KEY_MENU, rows),
    getOrders: () => load(KEY_ORDERS, seedOrders),
    saveOrders: (orders) => save(KEY_ORDERS, orders),
    // Kembalikan semua data contoh ke awal (bisa dipanggil dari Console)
    reset: function () {
      localStorage.removeItem(KEY_MENU);
      localStorage.removeItem(KEY_ORDERS);
      location.reload();
    },
  };

  // ---------- Header: nama admin dan tombol logout ----------
  const nameEl = document.getElementById("adminName");
  if (nameEl) nameEl.textContent = user.username || "Admin";

  const logoutBtn = document.getElementById("adminLogout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Nanti tambahkan: fetch("/api/auth/logout", { method: "POST" })
      try {
        localStorage.removeItem("kktf_user");
      } catch (e) {}
      location.href = "index.html";
    });
  }

  window.Admin = {
    TAX_RATE: TAX_RATE,
    CATEGORIES: CATEGORIES,
    STATUS_LABEL: STATUS_LABEL,
    METHOD_LABEL: METHOD_LABEL,
    TYPE_LABEL: TYPE_LABEL,
    Store: Store,
    rupiah: rupiah,
    short: short,
    el: el,
    pad: pad,
    fmtDay: fmtDay,
    fmtDateTime: fmtDateTime,
    toast: toast,
    downloadCSV: downloadCSV,
    orderTotals: orderTotals,
    isRevenue: isRevenue,
  };
})();