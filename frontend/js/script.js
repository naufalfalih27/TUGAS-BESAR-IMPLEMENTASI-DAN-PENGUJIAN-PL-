// KkTF Landing Page - script.js

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

// 2. Tombol suka (hati) pada kartu produk
document.querySelectorAll(".like-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("is-liked");
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