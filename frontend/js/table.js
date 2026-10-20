// KkTF - table.js (halaman pilih meja)
// Hijau = kosong, abu-abu = sudah ada orangnya, merah = dipilih customer.

(function () {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";

  //  Zona 
  // group = kelompok untuk menyorot saat kartu zona diklik
  const ZONES = {
    main: { label: "Indoor (Main)", group: "indoor" },
    indoor: { label: "Indoor", group: "indoor" },
    semi: { label: "Semi outdoor", group: "semi" },
    terrace: { label: "Semi outdoor terrace", group: "terrace" },
    outdoor: { label: "Outdoor", group: "outdoor" },
    coffee: { label: "Coffee Bar", group: "coffee" },
  };

  //  Data meja 
  // reserved: true = sudah ada orangnya (abu-abu).
  // Nanti bagian ini bisa diganti data dari backend (status tiap meja).
  // Koordinat mengikuti viewBox denah (906 x 867).
  const TABLES = [
    // Semi outdoor terrace
    { id: "S-01", zone: "terrace", x: 328, y: 102, w: 106, h: 110, seats: 6 },
    { id: "S-02", zone: "terrace", x: 458, y: 102, w: 95, h: 45, seats: 4 },
    { id: "S-03", zone: "terrace", x: 564, y: 102, w: 94, h: 45, seats: 4 },
    { id: "S-04", zone: "terrace", x: 458, y: 212, w: 210, h: 45, seats: 6, cap: "above" },

    // Outdoor
    { id: "O-01", zone: "outdoor", x: 692, y: 50, w: 166, h: 171, seats: 20, rotate: true, capFixed: "OUTDOOR" },

    // Indoor (Main)
    { id: "L-01", zone: "main", x: 90, y: 308, w: 126, h: 77, seats: 6 },
    { id: "L-02", zone: "main", x: 87, y: 451, w: 126, h: 77, seats: 4 },
    { id: "T-01", zone: "main", x: 329, y: 300, w: 78, h: 77, seats: 4 },
    { id: "T-02", zone: "main", x: 463, y: 299, w: 78, h: 77, seats: 4 },
    { id: "T-03", zone: "main", x: 596, y: 297, w: 78, h: 77, seats: 4 },
    { id: "T-04", zone: "main", x: 329, y: 410, w: 78, h: 77, seats: 4 },
    { id: "T-05", zone: "main", x: 463, y: 411, w: 78, h: 77, seats: 4 },
    { id: "T-06", zone: "main", x: 596, y: 410, w: 78, h: 77, seats: 4 },
    { id: "T-07", zone: "main", x: 327, y: 542, w: 175, h: 46, seats: 4, cap: "inside" },
    { id: "T-08", zone: "main", x: 502, y: 542, w: 175, h: 46, seats: 4, cap: "inside" },

    // Kursi coffee bar (lingkaran: x,y = titik tengah)
    { id: "B1", zone: "coffee", shape: "circle", x: 734, y: 302, r: 16, seats: 2 },
    { id: "B2", zone: "coffee", shape: "circle", x: 734, y: 363, r: 16, seats: 2 },
    { id: "B3", zone: "coffee", shape: "circle", x: 734, y: 428, r: 16, seats: 2 },
    { id: "B4", zone: "coffee", shape: "circle", x: 734, y: 493, r: 16, seats: 2 },
    { id: "B5", zone: "coffee", shape: "circle", x: 734, y: 558, r: 16, seats: 2 },

    // Indoor (bawah) dan Semi outdoor (bawah)
    { id: "J-01", zone: "indoor", x: 90, y: 621, w: 127, h: 65, seats: 4 },
    { id: "J-02", zone: "indoor", x: 90, y: 715, w: 126, h: 64, seats: 4 },
    { id: "J-03", zone: "semi", x: 386, y: 621, w: 91, h: 65, seats: 4 },
    { id: "J-04", zone: "semi", x: 386, y: 715, w: 91, h: 64, seats: 4 },
    { id: "J-05", zone: "semi", x: 686, y: 621, w: 135, h: 65, seats: 6 },
    { id: "J-06", zone: "semi", x: 685, y: 707, w: 134, h: 64, seats: 6 },
  ];

  //  Helper SVG 
  function svg(tag, attrs, text) {
    const node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach((k) => node.setAttribute(k, attrs[k]));
    if (text !== undefined) node.textContent = text;
    return node;
  }

  const layer = document.getElementById("tablesLayer");
  const nodes = {};
  let selectedId = null;

  //  Gambar meja 
  function draw(t) {
    const circle = t.shape === "circle";
    const cx = circle ? t.x : t.x + t.w / 2;
    const cy = circle ? t.y : t.y + t.h / 2;

    const g = svg("g", {
      class: "tbl-node",
      tabindex: "0",
      role: "button",
      "data-id": t.id,
      "data-group": ZONES[t.zone].group,
    });

    const shape = circle
      ? svg("circle", { cx: t.x, cy: t.y, r: t.r, class: "tbl-node__shape" })
      : svg("rect", { x: t.x, y: t.y, width: t.w, height: t.h, rx: 4, class: "tbl-node__shape" });
    g.appendChild(shape);

    // Label utama dan keterangan di bawah/atas/dalam
    let idEl;
    let capX = cx;
    let capY;

    if (circle) {
      idEl = svg("text", { x: cx, y: cy, class: "tbl-node__id tbl-node__id--small" }, t.id);
      capY = t.y + t.r + 14;
    } else if (t.rotate) {
      idEl = svg(
        "text",
        { x: cx, y: cy, class: "tbl-node__id tbl-node__id--plain", transform: "rotate(-90 " + cx + " " + cy + ")" },
        t.seats + " SEATER"
      );
      capY = t.y + t.h + 20;
    } else if (t.cap === "inside") {
      idEl = svg("text", { x: cx, y: t.y + 15, class: "tbl-node__id" }, t.id);
      capY = t.y + 35;
    } else {
      idEl = svg("text", { x: cx, y: cy, class: "tbl-node__id" }, t.id);
      capY = t.cap === "above" ? t.y - 13 : t.y + t.h + 14;
    }

    const cap = svg("text", { x: capX, y: capY, class: "tbl-node__cap" });
    g.append(idEl, cap);
    layer.appendChild(g);

    g.addEventListener("click", () => choose(t));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        choose(t);
      }
    });

    nodes[t.id] = { g: g, cap: cap };
  }

  // Status 
  function statusOf(t) {
    if (t.reserved) return "reserved";
    return t.id === selectedId ? "selected" : "available";
  }

  function captionOf(t, status) {
    if (t.capFixed) return t.capFixed;
    if (status === "reserved") return "RESERVED (" + t.seats + ")";
    if (status === "selected") return "SELECTED (" + t.seats + ")";
    return t.seats + " SEATER";
  }

  const STATUS_TEXT = { available: "tersedia", reserved: "sudah terisi", selected: "dipilih" };

  function refresh() {
    TABLES.forEach((t) => {
      const n = nodes[t.id];
      const status = statusOf(t);
      n.g.dataset.status = status;
      n.cap.textContent = captionOf(t, status);
      n.g.setAttribute("aria-pressed", String(status === "selected"));
      n.g.setAttribute("aria-disabled", String(status === "reserved"));
      n.g.setAttribute(
        "aria-label",
        "Meja " + t.id + ", " + t.seats + " kursi, " + STATUS_TEXT[status]
      );
    });
    updateInfo();
  }

  function choose(t) {
    if (t.reserved) return; // meja abu-abu tidak bisa dipilih
    selectedId = selectedId === t.id ? null : t.id;
    refresh();
  }

  // Selection Info 
  const infoZone = document.getElementById("infoZone");
  const infoTable = document.getElementById("infoTable");
  const infoTime = document.getElementById("infoTime");
  const confirmBtn = document.getElementById("confirmBtn");

  function clock() {
    const d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function updateInfo() {
    const t = TABLES.find((x) => x.id === selectedId);
    if (t) {
      infoZone.textContent = ZONES[t.zone].label;
      infoTable.textContent = t.id + " (" + t.seats + " Seater)";
      infoTime.textContent = clock() + " Today";
    } else {
      infoZone.textContent = "-";
      infoTable.textContent = "-";
      infoTime.textContent = "-";
    }
    confirmBtn.disabled = !t;
  }

  setInterval(updateInfo, 30000);

  // Confirm Reservation -> pembayaran 
  confirmBtn.addEventListener("click", () => {
    const t = TABLES.find((x) => x.id === selectedId);
    if (!t) return;

    const reservation = {
      table: t.id,
      seats: t.seats,
      zone: ZONES[t.zone].label,
      time: clock(),
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      localStorage.setItem("reservation", JSON.stringify(reservation));
      // Sisipkan juga ke data pesanan dari keranjang
      const order = JSON.parse(localStorage.getItem("order") || "null");
      if (order) {
        order.table = reservation;
        localStorage.setItem("order", JSON.stringify(order));
      }
    } catch (e) {}

    window.location.href = "payment.html";
  });

  // Sorot zona dari kartu zona 
  const zoneCards = document.querySelectorAll(".zone-card");
  let focusGroup = null;

  function applyFocus() {
    document.querySelectorAll(".tbl-node, .map-deco").forEach((el) => {
      const group = el.dataset.group;
      el.classList.toggle("is-dim", focusGroup !== null && group !== focusGroup);
    });
    zoneCards.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.group === focusGroup)));
  }

  zoneCards.forEach((card) => {
    card.addEventListener("click", () => {
      focusGroup = focusGroup === card.dataset.group ? null : card.dataset.group;
      applyFocus();
    });
  });

  // Mulai 
  TABLES.forEach(draw);
  refresh();
})();