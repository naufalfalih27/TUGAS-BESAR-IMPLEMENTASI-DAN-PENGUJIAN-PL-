// KkTF - cart.js
// Panel keranjang "Your Order", badge jumlah di ikon keranjang, dan tombol + di kartu produk.
// Dimuat di semua halaman (index, about, catalog, product).

(function () {
  "use strict";

  const KEY = "cart";
  const MODE_KEY = "orderMode";
  const ORDER_KEY = "order";
  const TAX_RATE = 0.1;

  const rupiah = (n) => "IDR " + n.toLocaleString("id-ID");

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Muat stylesheet panel otomatis, jadi tidak perlu menambah <link> di tiap halaman
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "css/cart.css";
  document.head.appendChild(css);

  // ---------- Data keranjang ----------
  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function save(cart) {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch (e) {}
  }

  function getMode() {
    try {
      return localStorage.getItem(MODE_KEY) === "takeaway" ? "takeaway" : "dine-in";
    } catch (e) {
      return "dine-in";
    }
  }

  let mode = getMode();

  function sameItem(a, b) {
    return (
      a.name === b.name &&
      (a.serving || null) === (b.serving || null) &&
      (a.ice || null) === (b.ice || null) &&
      (a.sugar || null) === (b.sugar || null)
    );
  }

  function describe(item) {
    const parts = [];
    if (item.serving === "Hot") parts.push("Hot");
    if (item.ice) parts.push(item.ice === "Normal" ? "Normal Ice" : item.ice);
    if (item.sugar) parts.push(item.sugar === "Normal" ? "Normal Sugar" : item.sugar);
    return parts.join(", ");
  }

  // ---------- Panel ----------
  const overlay = el("div", "cart-overlay");
  overlay.id = "cartOverlay";

  const drawer = el("aside", "cart-drawer");
  drawer.id = "cartDrawer";
  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-modal", "true");
  drawer.setAttribute("aria-label", "Pesanan Anda");
  drawer.setAttribute("aria-hidden", "true");
  drawer.innerHTML = `
    <header class="cart-drawer__head">
      <h2 class="cart-drawer__title">Your Order</h2>
      <button type="button" class="cart-drawer__close" aria-label="Tutup keranjang">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </header>

    <div class="cart-drawer__body">
      <ul class="cart-list"></ul>
      <p class="cart-empty" hidden>Keranjangmu masih kosong.</p>
      <a href="catalog.html" class="cart-more">+ Add More Items</a>
    </div>

    <footer class="cart-drawer__foot">
      <div class="cart-mode" role="group" aria-label="Pilih jenis pesanan">
        <button type="button" data-mode="dine-in">Dine-in</button>
        <button type="button" data-mode="takeaway">Takeaway</button>
      </div>

      <dl class="cart-sum">
        <div><dt>Subtotal</dt><dd data-sum="subtotal"></dd></div>
        <div><dt>Tax (10%)</dt><dd data-sum="tax"></dd></div>
        <div class="cart-sum__total"><dt>Total</dt><dd data-sum="total"></dd></div>
      </dl>

      <button type="button" class="cart-pay">
        Proceed to Payment
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </footer>
  `;

  // Disembunyikan dulu supaya tidak muncul sekilas sebelum cart.css selesai dimuat
  overlay.hidden = true;
  drawer.hidden = true;

  document.body.append(overlay, drawer);

  const list = drawer.querySelector(".cart-list");
  const emptyMsg = drawer.querySelector(".cart-empty");
  const moreLink = drawer.querySelector(".cart-more");
  const closeBtn = drawer.querySelector(".cart-drawer__close");
  const payBtn = drawer.querySelector(".cart-pay");
  const modeBtns = drawer.querySelectorAll(".cart-mode button");

  // ---------- Badge di ikon keranjang ----------
  // Ikon keranjang dikenali dari aria-label "Keranjang" atau link ke cart.html
  const cartLinks = document.querySelectorAll('[aria-label="Keranjang"], a[href$="cart.html"]');
  const badges = [];

  cartLinks.forEach((link) => {
    link.classList.add("cart-link");
    const badge = el("span", "cart-badge");
    badge.hidden = true;
    link.appendChild(badge);
    badges.push(badge);

    link.addEventListener("click", (e) => {
      e.preventDefault();
      open();
    });
  });

  function count(cart) {
    return cart.reduce((sum, i) => sum + i.qty, 0);
  }

  function updateBadges(bump) {
    const n = count(load());
    badges.forEach((b) => {
      b.textContent = n > 99 ? "99+" : String(n);
      b.hidden = n === 0;
      if (bump && n > 0) {
        b.classList.remove("is-bump");
        void b.offsetWidth; // ulangi animasi
        b.classList.add("is-bump");
      }
    });
  }

  // ---------- Tampilan ----------
  function render() {
    const cart = load();
    list.textContent = "";

    cart.forEach((item, index) => {
      const li = el("li", "cart-item");

      const imgBox = el("div", "cart-item__img");
      const img = document.createElement("img");
      img.src = item.img || "";
      img.alt = item.name;
      imgBox.appendChild(img);

      const info = el("div", "cart-item__info");
      const top = el("div", "cart-item__top");
      top.append(
        el("h3", "cart-item__name", item.name),
        el("span", "cart-item__price", rupiah(item.price * item.qty))
      );
      info.appendChild(top);

      const opts = describe(item);
      if (opts) info.appendChild(el("p", "cart-item__opts", opts));

      const qty = el("div", "cart-qty");
      const minus = el("button", "cart-qty__btn", "\u2212");
      minus.type = "button";
      minus.dataset.index = index;
      minus.dataset.delta = "-1";
      minus.setAttribute("aria-label", "Kurangi " + item.name);
      const num = el("span", "cart-qty__num", String(item.qty));
      const plus = el("button", "cart-qty__btn", "+");
      plus.type = "button";
      plus.dataset.index = index;
      plus.dataset.delta = "1";
      plus.setAttribute("aria-label", "Tambah " + item.name);
      qty.append(minus, num, plus);
      info.appendChild(qty);

      li.append(imgBox, info);
      list.appendChild(li);
    });

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + tax;

    drawer.querySelector('[data-sum="subtotal"]').textContent = rupiah(subtotal);
    drawer.querySelector('[data-sum="tax"]').textContent = rupiah(tax);
    drawer.querySelector('[data-sum="total"]').textContent = rupiah(total);

    emptyMsg.hidden = cart.length > 0;
    payBtn.disabled = cart.length === 0;

    modeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));

    updateBadges(false);
  }

  function changeQty(index, delta) {
    const cart = load();
    const item = cart[index];
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart.splice(index, 1);
    save(cart);
    render();
  }

  // ---------- Buka / tutup ----------
  function open() {
    render();
    overlay.hidden = false;
    drawer.hidden = false;
    void drawer.offsetWidth; // supaya animasi geser berjalan
    overlay.classList.add("is-open");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove("is-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!drawer.classList.contains("is-open")) {
        overlay.hidden = true;
        drawer.hidden = true;
      }
    }, 350);
  }

  overlay.addEventListener("click", close);
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) close();
  });

  // "Add More Items": di halaman katalog cukup tutup panel, di halaman lain buka katalog
  moreLink.addEventListener("click", (e) => {
    if (/catalog\.html$/.test(window.location.pathname)) {
      e.preventDefault();
      close();
    }
  });

  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".cart-qty__btn");
    if (!btn) return;
    changeQty(parseInt(btn.dataset.index, 10), parseInt(btn.dataset.delta, 10));
  });

  // ---------- Dine-in / Takeaway ----------
  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      mode = btn.dataset.mode;
      try {
        localStorage.setItem(MODE_KEY, mode);
      } catch (e) {}
      modeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    });
  });

  // ---------- Proceed to Payment ----------
  payBtn.addEventListener("click", () => {
    const cart = load();
    if (!cart.length) return;

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    try {
      localStorage.setItem(
        ORDER_KEY,
        JSON.stringify({ mode: mode, items: cart, subtotal: subtotal, tax: tax, total: subtotal + tax })
      );
    } catch (e) {}

    // Dine-in -> pilih meja dulu, Takeaway -> langsung pembayaran
    window.location.href = mode === "dine-in" ? "table.html" : "payment.html";
  });

  // ---------- Tambah item (dipakai halaman detail dan tombol +) ----------
  function add(item) {
    const cart = load();
    const found = cart.find((i) => sameItem(i, item));
    if (found) {
      found.qty += item.qty || 1;
    } else {
      cart.push(Object.assign({}, item, { qty: item.qty || 1 }));
    }
    save(cart);
    updateBadges(true);
    if (drawer.classList.contains("is-open")) render();
  }

  // Tombol + di kartu produk (homepage dan katalog): masuk dengan pilihan standar
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn");
    if (!btn) return;
    const card = btn.closest(".product-card");
    if (!card) return;

    const text = (sel) => {
      const node = card.querySelector(sel);
      return node ? node.textContent.trim() : "";
    };
    const name = text(".product-card__name");
    const imgEl = card.querySelector(".product-card__image");
    const panel = card.closest(".catalog__panel");
    const type = typeof servingFor === "function" ? servingFor(card, panel, name) : "ice";

    add({
      name: name,
      price: parseInt(text(".product-card__price").replace(/\D/g, ""), 10) || 0,
      img: imgEl ? imgEl.getAttribute("src") : "",
      serving: type === "food" ? null : type === "hot" ? "Hot" : "Ice",
      ice: type === "ice" || type === "choose" ? "Normal" : null,
      sugar: type === "food" ? null : "Normal",
      qty: 1,
    });
  });

  // Sinkron kalau keranjang diubah di tab lain
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) render();
  });

  window.KkTFCart = { add: add, open: open, close: close };

  render();
})();