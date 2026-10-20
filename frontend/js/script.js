// KkTF Landing Page - script.js

// 0. Top Tier Lineup berjalan terus ke kiri (hanya di halaman yang punya .lineup__grid)
const lineupGrid = document.querySelector(".lineup__grid");

if (
  lineupGrid &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const cards = Array.from(lineupGrid.children);
  const track = document.createElement("div");
  track.className = "lineup__track";

  // Set asli, lalu salinannya supaya putarannya mulus tanpa jeda
  cards.forEach((card) => track.appendChild(card));
  cards.forEach((card) => {
    const copy = card.cloneNode(true);
    copy.dataset.clone = "true";
    copy.setAttribute("aria-hidden", "true");
    copy.querySelectorAll("button, a").forEach((el) => (el.tabIndex = -1));
    track.appendChild(copy);
  });

  lineupGrid.appendChild(track);
  lineupGrid.classList.add("is-marquee");

  // Kecepatan dalam piksel per detik (kecilkan angkanya untuk memperlambat)
  const LINEUP_SPEED = 35;
  const setLineupSpeed = () => {
    track.style.animationDuration = track.scrollWidth / 2 / LINEUP_SPEED + "s";
  };
  setLineupSpeed();
  window.addEventListener("resize", setLineupSpeed);
}

// 1. Mode gelap / terang
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

// 2. Tombol suka (hati), tersimpan di browser
function loadLikes() {
  try {
    return JSON.parse(localStorage.getItem("likes")) || {};
  } catch (e) {
    return {};
  }
}

function saveLikes(data) {
  try {
    localStorage.setItem("likes", JSON.stringify(data));
  } catch (e) {}
}

// Kunci like = nama produk. Di halaman detail, product.js mengisi data-key.
function likeKey(btn) {
  const card = btn.closest(".product-card");
  const nameEl = card && card.querySelector(".product-card__name");
  return (
    btn.dataset.key ||
    (nameEl ? nameEl.textContent.trim() : btn.getAttribute("aria-label"))
  );
}

const likes = loadLikes();

document.querySelectorAll(".like-btn").forEach((btn) => {
  const key = likeKey(btn);
  const counter = btn.querySelector("span");

  // Pulihkan kondisi yang tersimpan
  const saved = likes[key] || { count: 0, liked: false };
  btn.classList.toggle("is-liked", saved.liked);
  if (counter) counter.textContent = saved.count;

  btn.addEventListener("click", () => {
    const current = likes[key] || { count: 0, liked: false };
    current.liked = !current.liked;
    current.count = Math.max(0, current.count + (current.liked ? 1 : -1));
    likes[key] = current;

    // Perbarui semua tombol untuk produk yang sama (termasuk salinan di lineup berjalan)
    document.querySelectorAll(".like-btn").forEach((other) => {
      if (likeKey(other) !== key) return;
      other.classList.toggle("is-liked", current.liked);
      const c = other.querySelector("span");
      if (c) c.textContent = current.count;
    });

    saveLikes(likes);
  });
});

// 3. Ganti kategori di halaman katalog
const catButtons = document.querySelectorAll(".cat-btn");
const catPanels = document.querySelectorAll(".catalog__panel");

function showCategory(id) {
  const target = document.getElementById(id);
  if (!target) return;
  catButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.target === id));
  catPanels.forEach((p) => p.classList.toggle("is-active", p.id === id));
  try { localStorage.setItem("category", id); } catch (e) {}
}

catButtons.forEach((btn) => {
  btn.addEventListener("click", () => showCategory(btn.dataset.target));
});

if (catButtons.length) {
  showCategory(localStorage.getItem("category") || catButtons[0].dataset.target);
}

// 4. Klik kartu produk -> halaman detail

// Serving per kategori: ice, hot, choose (pilih HOT atau ICE), food (tanpa pilihan)
const SERVING_BY_PANEL = {
  signature: "ice",
  basic: "hot",
  tea: "choose",
  powder: "choose",
  jajanan: "food",
};

// Cadangan untuk kartu di homepage (tidak berada di panel katalog)
const SERVING_BY_NAME = {
  "Kopi Tubruk": "hot",
  Caramella: "ice",
  "Cokelat Kopi": "ice",
  "Ta Co Syuu": "ice",
  Camomile: "choose",
  Dimsum: "food",
  Gyoza: "food",
};

function servingFor(card, panel, name) {
  return (
    card.dataset.serving ||
    (panel && SERVING_BY_PANEL[panel.id]) ||
    SERVING_BY_NAME[name] ||
    "ice"
  );
}

document.querySelectorAll(".product-card").forEach((card) => {
  card.style.cursor = "pointer";
  // Salinan di lineup berjalan tidak ikut urutan tab
  card.tabIndex = card.dataset.clone ? -1 : 0;

  function openDetail() {
    const get = (sel) => {
      const el = card.querySelector(sel);
      return el ? el.textContent.trim() : "";
    };
    const imgEl = card.querySelector(".product-card__image");
    const panel = card.closest(".catalog__panel");
    const titleEl = panel && panel.querySelector(".catalog__title");
    const name = get(".product-card__name");

    const params = new URLSearchParams({
      name: name,
      desc: get(".product-card__desc"),
      price: get(".product-card__price").replace(/\D/g, ""),
      img: imgEl ? imgEl.getAttribute("src") : "",
      series: titleEl ? titleEl.textContent.trim() : "Tara Signature Coffee",
      serving: servingFor(card, panel, name),
    });

    // Opsional: harga coret, tulis di HTML kartu: data-old-price="20000"
    if (card.dataset.oldPrice) params.set("old", card.dataset.oldPrice);

    window.location.href = "product.html?" + params.toString();
  }

  card.addEventListener("click", (e) => {
    if (e.target.closest(".like-btn, .add-btn")) return;
    openDetail();
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target === card) openDetail();
  });
});

// ---------- Status login ----------
// SEMENTARA: saat backend siap, ganti isi getUser() dengan
// pemanggilan API (misalnya GET /api/auth/me).
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("kktf_user"));
  } catch {
    return null;
  }
}

function logout() {
  // Nanti tambahkan: fetch("/api/auth/logout", { method: "POST" })
  localStorage.removeItem("kktf_user");
  window.location.href = "index.html";
}

function renderAuth() {
  const loggedIn = Boolean(getUser());
  document.querySelectorAll('[data-auth="guest"]').forEach((el) => {
    el.hidden = loggedIn;
  });
  document.querySelectorAll('[data-auth="user"]').forEach((el) => {
    el.hidden = !loggedIn;
  });
}

renderAuth();