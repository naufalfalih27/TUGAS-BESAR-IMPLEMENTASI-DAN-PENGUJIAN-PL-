// KkTF - payment.js (checkout dan pembayaran)
// Data pesanan dibaca dari keranjang (localStorage "cart"), jenis pesanan dari "orderMode",
// dan meja dari "reservation" (kalau Dine-in).

(function () {
  "use strict";

  const TAX_RATE = 0.1;

  // Kode voucher contoh. Nanti validasi voucher dipindah ke backend.
  const VOUCHERS = {
    KKTF10: { type: "percent", value: 10, label: "10% off" },
    HEMAT5K: { type: "fixed", value: 5000, label: "Rp 5.000 off" },
  };

  const METHODS = {
    qris: "QRIS",
    cashier: "Pay at the cashier",
    gopay: "GoPay",
    ovo: "OVO",
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
  let voucherCode = null;

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

  function discountFor(subtotal) {
    const v = voucherCode && VOUCHERS[voucherCode];
    if (!v) return 0;
    if (v.type === "percent") return Math.round((subtotal * v.value) / 100);
    return Math.min(v.value, subtotal);
  }

  function totals() {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = discountFor(subtotal);
    const tax = Math.round((subtotal - discount) * TAX_RATE);
    return { subtotal: subtotal, discount: discount, tax: tax, total: subtotal - discount + tax };
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

    const row = document.getElementById("rowDiscount");
    row.hidden = t.discount === 0;
    document.getElementById("sumDiscountLabel").textContent =
      voucherCode ? "Discount (" + voucherCode + ")" : "Discount";
    document.getElementById("sumDiscount").textContent = "- " + rupiah(t.discount);

    payBtn.disabled = cart.length === 0;
  }

  // ---------- Metode pembayaran ----------
  const radios = document.querySelectorAll('input[name="pay"]');
  const walletBtns = document.querySelectorAll(".wallet-btn");

  function renderMethod() {
    radios.forEach((r) => (r.checked = r.value === method));
    walletBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.wallet === method)));
  }

  radios.forEach((r) => {
    r.addEventListener("change", () => {
      method = r.value;
      renderMethod();
    });
  });

  walletBtns.forEach((b) => {
    b.addEventListener("click", () => {
      method = b.dataset.wallet;
      renderMethod();
    });
  });

  // ---------- Voucher ----------
  const voucherForm = document.getElementById("voucherForm");
  const voucherInput = document.getElementById("voucherInput");
  const voucherMsg = document.getElementById("voucherMsg");

  function say(text, type) {
    voucherMsg.textContent = text;
    voucherMsg.className = "voucher__msg" + (type ? " is-" + type : "");
  }

  voucherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = voucherInput.value.trim().toUpperCase();

    if (!code) {
      voucherCode = null;
      say("", "");
    } else if (VOUCHERS[code]) {
      voucherCode = code;
      say("Voucher " + code + " applied: " + VOUCHERS[code].label + ".", "ok");
    } else {
      voucherCode = null;
      say("Voucher code is not valid.", "error");
    }
    renderTotals();
  });

  // ---------- Pay Now ----------
  const done = document.getElementById("done");

  payBtn.addEventListener("click", () => {
    if (!cart.length) return;
    const t = totals();

    const order = {
      id: "KKTF-" + Date.now().toString(36).toUpperCase(),
      mode: mode,
      table: reservation,
      items: cart,
      subtotal: t.subtotal,
      discount: t.discount,
      voucher: voucherCode,
      tax: t.tax,
      total: t.total,
      method: method,
      createdAt: new Date().toISOString(),
    };

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
    document.getElementById("doneMethod").textContent = METHODS[method];
    document.getElementById("doneTotal").textContent = rupiah(t.total);
    document.getElementById("doneText").textContent =
      method === "cashier"
        ? "Please complete your payment at the cashier."
        : "Thank you! Your payment is being processed.";

    done.hidden = false;
    document.body.style.overflow = "hidden";
  });

  // ---------- Mulai ----------
  renderItems();
  renderTotals();
  renderMethod();
})();