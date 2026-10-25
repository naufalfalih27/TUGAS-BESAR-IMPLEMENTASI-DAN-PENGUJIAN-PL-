// KkTF - payment.js (checkout dan pembayaran)
// Data pesanan dibaca dari keranjang (localStorage "cart"), jenis pesanan dari "orderMode",
// dan meja dari "reservation" (kalau Dine-in).
// Metode pembayaran: QRIS dan Pay at the cashier.

(function () {
  "use strict";

  const TAX_RATE = 0.1;

  const METHODS = {
    qris: "QRIS",
    cashier: "Pay at the cashier",
  };

  const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  }

  // ---------- Data ----------
  const cart = (function () {
    const data = readJSON("cart", []);
    return Array.isArray(data) ? data : [];
  })();

  let mode = "dine-in";
  try {
    mode = localStorage.getItem("orderMode") === "takeaway" ? "takeaway" : "dine-in";
  } catch (e) {}

  const reservation = mode === "dine-in" ? readJSON("reservation", null) : null;

  let method = "qris";

  // ---------- Jenis pesanan ----------
  document.getElementById("orderTypeLabel").textContent =
    mode === "dine-in" ? "Dine-in" : "Takeaway";

  if (reservation && reservation.table) {
    const note = document.getElementById("orderTypeNote");
    note.textContent = "Table " + reservation.table + " \u00B7 " + reservation.zone;
    note.hidden = false;
  }

  // Tombol kembali: Dine-in ke pilih meja, Takeaway ke katalog
  document.getElementById("backLink").href = mode === "dine-in" ? "table.html" : "catalog.html";

  // ---------- Ringkasan ----------
  function describe(item) {
    const parts = [];
    if (item.serving === "Hot") parts.push("Hot");
    if (item.ice) parts.push(item.ice === "Normal" ? "Normal Ice" : item.ice);
    if (item.sugar) parts.push(item.sugar === "Normal" ? "Normal Sugar" : item.sugar);
    return parts.join(", ");
  }

  function totals() {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    return { subtotal: subtotal, tax: tax, total: subtotal + tax };
  }

  const itemsEl = document.getElementById("summaryItems");
  const emptyEl = document.getElementById("summaryEmpty");
  const payBtn = document.getElementById("payBtn");

  function renderItems() {
    itemsEl.textContent = "";
    cart.forEach((item) => {
      const li = el("li", "summary__item");

      const imgBox = el("div", "summary__img");
      const img = document.createElement("img");
      img.src = item.img || "";
      img.alt = item.name;
      imgBox.appendChild(img);

      const info = el("div", "summary__info");
      info.appendChild(el("p", "summary__name", item.name + " (" + item.qty + ")"));
      const opts = describe(item);
      if (opts) info.appendChild(el("p", "summary__opts", opts));

      li.append(imgBox, info, el("span", "summary__price", rupiah(item.price * item.qty)));
      itemsEl.appendChild(li);
    });

    emptyEl.hidden = cart.length > 0;
    itemsEl.hidden = cart.length === 0;
  }

  function renderTotals() {
    const t = totals();
    document.getElementById("sumSubtotal").textContent = rupiah(t.subtotal);
    document.getElementById("sumTax").textContent = rupiah(t.tax);
    document.getElementById("sumTotal").textContent = rupiah(t.total);

    payBtn.disabled = cart.length === 0;
  }

  // ---------- Metode pembayaran ----------
  const radios = document.querySelectorAll('input[name="pay"]');

  function renderMethod() {
    radios.forEach((r) => (r.checked = r.value === method));
  }

  radios.forEach((r) => {
    r.addEventListener("change", () => {
      method = r.value;
      renderMethod();
    });
  });

  // ---------- Pay Now ----------
  const done = document.getElementById("done");

  const qrisModal = document.getElementById("qrisModal");
  const qrisConfirm = document.getElementById("qrisConfirm");
  const qrisCancel = document.getElementById("qrisCancel");
  const qrisNote = document.getElementById("qrisNote");
  const qrisTimer = document.getElementById("qrisTimer");

  const QRIS_MINUTES = 15; // masa berlaku kode QR
  let timerId = null;

  function buildOrder() {
    const t = totals();
    return {
      id: "KKTF-" + Date.now().toString(36).toUpperCase(),
      mode: mode,
      table: reservation,
      items: cart,
      subtotal: t.subtotal,
      tax: t.tax,
      total: t.total,
      method: method,
      createdAt: new Date().toISOString(),
    };
  }

  // Pesanan selesai: simpan, kosongkan keranjang, tampilkan layar sukses
  function completeOrder(order) {
    try {
      localStorage.setItem("lastOrder", JSON.stringify(order));
      ["cart", "order", "reservation"].forEach((k) => localStorage.removeItem(k));
    } catch (e) {}

    // Perbarui badge keranjang (cart.js mendengarkan event ini)
    window.dispatchEvent(new StorageEvent("storage", { key: "cart" }));

    document.getElementById("doneId").textContent = order.id;
    document.getElementById("doneType").textContent =
      (mode === "dine-in" ? "Dine-in" : "Takeaway") +
      (reservation && reservation.table ? " \u00B7 Table " + reservation.table : "");
    document.getElementById("doneMethod").textContent = METHODS[order.method];
    document.getElementById("doneTotal").textContent = rupiah(order.total);
    document.getElementById("doneText").textContent =
      order.method === "cashier"
        ? "Please complete your payment at the cashier."
        : "Thank you! Your payment is being processed.";

    done.hidden = false;
    document.body.style.overflow = "hidden";
  }

  // ---------- QRIS ----------
  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer(seconds) {
    stopTimer();
    let left = seconds;

    function paint() {
      const m = String(Math.floor(left / 60)).padStart(2, "0");
      const s = String(left % 60).padStart(2, "0");
      qrisTimer.textContent = m + ":" + s;
    }

    paint();
    timerId = setInterval(() => {
      left -= 1;
      if (left <= 0) {
        stopTimer();
        qrisTimer.textContent = "00:00";
        qrisConfirm.disabled = true;
        qrisNote.textContent = "This QR code has expired. Please close and try again.";
        return;
      }
      paint();
    }, 1000);
  }

  let pendingOrder = null;

  function openQris(order) {
    pendingOrder = order;
    document.getElementById("qrisAmount").textContent = rupiah(order.total);
    document.getElementById("qrisOrderId").textContent = order.id;
    qrisNote.textContent = "";
    qrisConfirm.disabled = false;

    qrisModal.hidden = false;
    document.body.style.overflow = "hidden";
    startTimer(QRIS_MINUTES * 60);
    qrisConfirm.focus();
  }

  function closeQris() {
    stopTimer();
    qrisModal.hidden = true;
    pendingOrder = null;
    document.body.style.overflow = "";
    payBtn.focus();
  }

  qrisCancel.addEventListener("click", closeQris);

  // Klik area gelap di luar kotak menutup jendela
  qrisModal.addEventListener("click", (e) => {
    if (e.target === qrisModal) closeQris();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !qrisModal.hidden) closeQris();
  });

  // SEMENTARA: tombol "I have paid" langsung menyelesaikan pesanan.
  // Saat backend siap, pesanan baru dianggap lunas setelah server
  // menerima konfirmasi dari penyedia pembayaran (webhook atau polling status).
  qrisConfirm.addEventListener("click", () => {
    if (!pendingOrder) return;
    const order = pendingOrder;
    stopTimer();
    qrisModal.hidden = true;
    pendingOrder = null;
    completeOrder(order);
  });

  payBtn.addEventListener("click", () => {
    if (!cart.length) return;
    const order = buildOrder();

    if (method === "qris") {
      openQris(order);
    } else {
      completeOrder(order);
    }
  });

  // ---------- Mulai ----------
  renderItems();
  renderTotals();
  renderMethod();
})();