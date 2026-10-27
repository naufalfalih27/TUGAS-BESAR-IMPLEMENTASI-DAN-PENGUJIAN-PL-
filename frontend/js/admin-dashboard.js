// =========================================================
// KkTF - admin-dashboard.js (ringkasan penjualan)
// =========================================================

(function () {
  "use strict";
  if (!window.Admin) return; // pengaman akses di admin.js belum lolos

  const A = window.Admin;
  const { Store, rupiah, short, el, pad, fmtDay, orderTotals, isRevenue, CATEGORIES, METHOD_LABEL, TYPE_LABEL } = A;
  const $ = (id) => document.getElementById(id);

  let range = 7; // jumlah hari

  // ---------- Rentang tanggal ----------
  function bounds(days, offsetDays) {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1 - (offsetDays || 0));
    const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - days);
    return { start: start, end: end };
  }

  function ordersIn(orders, b) {
    return orders.filter((o) => {
      const t = new Date(o.createdAt);
      return t >= b.start && t < b.end;
    });
  }

  function sumSubtotal(list) {
    return list.reduce((s, o) => s + orderTotals(o).subtotal, 0);
  }

  // ---------- Pembantu tampilan ----------
  // Daftar dengan batang kecil. mode "share": persentase dari total, "max": relatif ke yang terbesar.
  function renderBars(host, entries, format, mode) {
    host.textContent = "";
    if (!entries.length) {
      host.appendChild(el("p", "panel__empty", "No data in this period."));
      return;
    }
    const total = entries.reduce((s, e) => s + e.value, 0);
    const max = Math.max.apply(null, entries.map((e) => e.value));

    entries.forEach((entry) => {
      const row = el("div", "bd__row");
      const top = el("div", "bd__top");
      const share = total > 0 ? Math.round((entry.value / total) * 100) : 0;
      const valueText = format(entry.value) + (mode === "share" ? " (" + share + "%)" : "");
      top.append(el("span", "bd__label", entry.label), el("span", "bd__value", valueText));

      const track = el("div", "bd__track");
      const fill = el("span", "bd__fill");
      const pct = mode === "share" ? share : max > 0 ? (entry.value / max) * 100 : 0;
      fill.style.width = Math.max(pct, entry.value > 0 ? 2 : 0) + "%";
      track.appendChild(fill);

      row.append(top, track);
      host.appendChild(row);
    });
  }

  function svgEl(name, attrs) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.keys(attrs || {}).forEach((k) => node.setAttribute(k, attrs[k]));
    return node;
  }

  function niceCeil(value) {
    if (value <= 0) return 1;
    const mag = Math.pow(10, Math.floor(Math.log10(value)));
    const n = value / mag;
    const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return nice * mag;
  }

  // ---------- Grafik batang ----------
  function buildBuckets(list, days, start) {
    let buckets;
    if (days === 1) {
      buckets = Array.from({ length: 24 }, (_, h) => ({ label: pad(h), title: pad(h) + ":00", value: 0 }));
      list.forEach((o) => {
        if (isRevenue(o)) buckets[new Date(o.createdAt).getHours()].value += orderTotals(o).subtotal;
      });
    } else {
      buckets = Array.from({ length: days }, (_, i) => {
        const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        return { label: fmtDay(d), title: fmtDay(d), value: 0 };
      });
      list.forEach((o) => {
        if (!isRevenue(o)) return;
        const t = new Date(o.createdAt);
        const day = new Date(t.getFullYear(), t.getMonth(), t.getDate());
        const index = Math.round((day - start) / 86400000);
        if (buckets[index]) buckets[index].value += orderTotals(o).subtotal;
      });
    }
    return buckets;
  }

  function drawChart(host, buckets) {
    host.textContent = "";
    const W = 640;
    const H = 240;
    const padL = 56;
    const padR = 8;
    const padT = 12;
    const padB = 28;
    const innerH = H - padT - padB;

    const max = Math.max.apply(null, buckets.map((b) => b.value));
    const top = niceCeil(max);

    const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, class: "chart__svg", role: "img" });
    svg.setAttribute("aria-label", "Bar chart of revenue, highest value " + rupiah(max));

    // Garis bantu dan angka sumbu Y
    for (let i = 0; i <= 4; i++) {
      const y = padT + innerH * (1 - i / 4);
      svg.appendChild(svgEl("line", { x1: padL, x2: W - padR, y1: y, y2: y, class: "grid-line" }));
      const label = svgEl("text", { x: padL - 8, y: y + 4, "text-anchor": "end", class: "axis" });
      label.textContent = short((top * i) / 4);
      svg.appendChild(label);
    }

    const slot = (W - padL - padR) / buckets.length;
    const barW = Math.max(2, slot * 0.62);
    const step = Math.ceil(buckets.length / 8); // label sumbu X tidak saling tumpuk

    buckets.forEach((b, i) => {
      const h = innerH * (b.value / top);
      const x = padL + slot * i + (slot - barW) / 2;
      const rect = svgEl("rect", { x: x, y: H - padB - h, width: barW, height: Math.max(h, 0), rx: 2, class: "bar" });
      const tip = svgEl("title", {});
      tip.textContent = b.title + ": " + rupiah(b.value);
      rect.appendChild(tip);
      svg.appendChild(rect);

      if (i % step === 0) {
        const t = svgEl("text", { x: x + barW / 2, y: H - 8, "text-anchor": "middle", class: "axis" });
        t.textContent = b.label;
        svg.appendChild(t);
      }
    });

    host.appendChild(svg);
  }

  // ---------- Isi dashboard ----------
  function render() {
    const all = Store.getOrders();
    const menu = Store.getMenu();
    const now = bounds(range, 0);
    const prev = bounds(range, range);

    const list = ordersIn(all, now);
    const counted = list.filter(isRevenue);
    const prevCounted = ordersIn(all, prev).filter(isRevenue);

    const revenue = sumSubtotal(counted);
    const prevRevenue = sumSubtotal(prevCounted);
    const tax = counted.reduce((s, o) => s + orderTotals(o).tax, 0);

    $("statRevenue").textContent = rupiah(revenue);
    $("statOrders").textContent = String(counted.length);
    $("statAvg").textContent = rupiah(counted.length ? revenue / counted.length : 0);
    $("statTax").textContent = rupiah(tax);

    // Perbandingan dengan periode sebelumnya
    const hint = $("statRevenueHint");
    const label = range === 1 ? "yesterday" : "previous " + range + " days";
    hint.className = "stat__hint";
    if (prevRevenue > 0) {
      const pct = ((revenue - prevRevenue) / prevRevenue) * 100;
      hint.textContent = (pct >= 0 ? "+" : "") + pct.toFixed(0) + "% vs " + label;
      hint.classList.add(pct >= 0 ? "is-up" : "is-down");
    } else {
      hint.textContent = "No data in the " + label;
    }

    // Grafik
    $("chartTitle").textContent = range === 1 ? "Revenue per hour" : "Revenue per day";
    $("chartEmpty").hidden = counted.length > 0;
    $("chart").hidden = counted.length === 0;
    if (counted.length) drawChart($("chart"), buildBuckets(list, range, now.start));

    // Hitung penjualan per menu
    const byMenu = {};
    menu.forEach((m) => (byMenu[m.namaMenu] = { qty: 0, revenue: 0, category: m.kategoriID }));
    counted.forEach((o) =>
      o.items.forEach((i) => {
        if (!byMenu[i.name]) byMenu[i.name] = { qty: 0, revenue: 0, category: 0 };
        byMenu[i.name].qty += i.qty;
        byMenu[i.name].revenue += i.qty * i.price;
      })
    );
    const menuRows = Object.keys(byMenu).map((name) => Object.assign({ name: name }, byMenu[name]));

    const top = menuRows.filter((m) => m.qty > 0).sort((a, b) => b.qty - a.qty).slice(0, 5);
    renderBars($("topMenu"), top.map((m) => ({ label: m.name, value: m.qty })), (v) => v + " sold", "max");

    const slow = menuRows
      .filter((m) => menu.some((x) => x.namaMenu === m.name && x.statusMenu === "Available"))
      .sort((a, b) => a.qty - b.qty)
      .slice(0, 5);
    renderBars($("slowMenu"), slow.map((m) => ({ label: m.name, value: m.qty })), (v) => v + " sold", "max");

    // Per kategori
    const byCat = {};
    menuRows.forEach((m) => {
      const name = CATEGORIES[m.category] || "Other";
      byCat[name] = (byCat[name] || 0) + m.revenue;
    });
    renderBars(
      $("byCategory"),
      Object.keys(byCat).map((k) => ({ label: k, value: byCat[k] })).filter((e) => e.value > 0).sort((a, b) => b.value - a.value),
      rupiah,
      "share"
    );

    // Per metode bayar dan jenis pesanan
    const byMethod = {};
    const byType = {};
    counted.forEach((o) => {
      const sub = orderTotals(o).subtotal;
      byMethod[METHOD_LABEL[o.method] || o.method] = (byMethod[METHOD_LABEL[o.method] || o.method] || 0) + sub;
      byType[TYPE_LABEL[o.mode] || o.mode] = (byType[TYPE_LABEL[o.mode] || o.mode] || 0) + sub;
    });
    const toEntries = (obj) => Object.keys(obj).map((k) => ({ label: k, value: obj[k] })).sort((a, b) => b.value - a.value);
    renderBars($("byMethod"), toEntries(byMethod), rupiah, "share");
    renderBars($("byType"), toEntries(byType), rupiah, "share");

    renderLowStock(menu);
  }

  function renderLowStock(menu) {
    const host = $("lowStock");
    host.textContent = "";
    const low = menu.filter((m) => m.stock <= m.stockMin);

    if (!low.length) {
      host.appendChild(el("li", "low__ok", "All stock levels are healthy."));
      return;
    }
    low.forEach((m) => {
      const li = el("li");
      const left = el("span", "", m.namaMenu + (m.stock === 0 ? " is out of stock" : " has " + m.stock + " left"));
      const link = el("a", "admin-link", "Update stock (min " + m.stockMin + ")");
      link.href = "admin-menu.html";
      li.append(left, link);
      host.appendChild(li);
    });
  }

  // ---------- Rentang waktu ----------
  document.querySelectorAll(".seg__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      range = Number(btn.dataset.range);
      document.querySelectorAll(".seg__btn").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      render();
    });
  });

  // ---------- Unduh CSV ----------
  $("exportCsv").addEventListener("click", () => {
    const list = ordersIn(Store.getOrders(), bounds(range, 0)).filter(isRevenue);
    if (!list.length) {
      A.toast("No paid orders in this period.");
      return;
    }
    const header = ["Order", "Date", "Time", "Type", "Table", "Payment", "Status", "Items", "Subtotal", "Tax", "Total"];
    const rows = list
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((o) => {
        const t = orderTotals(o);
        const d = new Date(o.createdAt);
        const dateText = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
        return [
          o.id, dateText, pad(d.getHours()) + ":" + pad(d.getMinutes()),
          TYPE_LABEL[o.mode] || o.mode, o.table || "", METHOD_LABEL[o.method] || o.method, o.status,
          o.items.map((i) => i.name + " x" + i.qty).join("; "), t.subtotal, t.tax, t.total,
        ];
      });
    A.downloadCSV("kktf-sales-" + range + "d.csv", header, rows);
  });

  render();
})();