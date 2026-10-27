// =========================================================
// KkTF - admin-orders.js (daftar pesanan)
// Ubah status pesanan dan tandai pembayaran lunas.
// =========================================================

(function () {
  "use strict";
  if (!window.Admin) return; // pengaman akses di admin.js belum lolos

  const A = window.Admin;
  const { Store, rupiah, el, orderTotals, fmtDateTime, STATUS_LABEL, METHOD_LABEL, TYPE_LABEL, toast } = A;
  const $ = (id) => document.getElementById(id);

  const PAGE_SIZE = 50;
  let statusFilter = "";
  let visible = PAGE_SIZE;

  const STATUS_BADGE = { new: "warn", preparing: "warn", done: "ok", cancelled: "neutral" };

  // ---------- Daftar ----------
  function sortedOrders() {
    return Store.getOrders().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function renderCounts(orders) {
    const counts = { all: orders.length, new: 0, preparing: 0, done: 0, cancelled: 0 };
    orders.forEach((o) => (counts[o.status] = (counts[o.status] || 0) + 1));
    document.querySelectorAll("[data-count]").forEach((node) => {
      node.textContent = "(" + (counts[node.dataset.count] || 0) + ")";
    });
  }

  function itemsText(order) {
    return order.items.map((i) => i.name + " ×" + i.qty).join(", ");
  }

  function render() {
    const orders = sortedOrders();
    renderCounts(orders);

    const q = $("searchOrder").value.trim().toLowerCase();
    const filtered = orders.filter((o) => (!statusFilter || o.status === statusFilter) && (!q || o.id.toLowerCase().includes(q)));
    const shown = filtered.slice(0, visible);

    const body = $("orderBody");
    body.textContent = "";

    shown.forEach((o) => {
      const tr = el("tr");

      const tdId = el("td");
      tdId.appendChild(el("div", "cell-name", o.id));

      const tdTime = el("td", "cell-num", fmtDateTime(new Date(o.createdAt)));

      const tdType = el("td");
      tdType.append(el("div", "", TYPE_LABEL[o.mode] || o.mode));
      if (o.table) tdType.appendChild(el("div", "cell-sub", "Table " + o.table));

      const tdItems = el("td", "", itemsText(o));

      const tdTotal = el("td", "cell-num", rupiah(orderTotals(o).total));

      // Pembayaran: metode, status lunas, dan tombol konfirmasi
      const tdPay = el("td");
      tdPay.appendChild(el("div", "", METHOD_LABEL[o.method] || o.method));
      if (o.status === "cancelled") {
        tdPay.appendChild(el("span", "badge badge--neutral", "Cancelled"));
      } else if (o.paid) {
        tdPay.appendChild(el("span", "badge badge--ok", "Paid"));
      } else {
        const wrap = el("div", "cell-actions");
        wrap.style.justifyContent = "flex-start";
        wrap.appendChild(el("span", "badge badge--warn", "Unpaid"));
        const pay = el("button", "a-btn a-btn--ghost a-btn--sm", "Mark as paid");
        pay.type = "button";
        pay.dataset.action = "pay";
        pay.dataset.id = o.id;
        pay.setAttribute("aria-label", "Mark order " + o.id + " as paid");
        wrap.appendChild(pay);
        tdPay.appendChild(wrap);
      }

      // Status: pilihan yang bisa diubah admin
      const select = el("select", "status-select");
      select.dataset.id = o.id;
      select.setAttribute("aria-label", "Status of order " + o.id);
      Object.keys(STATUS_LABEL).forEach((key) => {
        const opt = el("option", "", STATUS_LABEL[key]);
        opt.value = key;
        opt.selected = key === o.status;
        select.appendChild(opt);
      });
      const tdStatus = el("td");
      tdStatus.appendChild(select);

      tr.append(tdId, tdTime, tdType, tdItems, tdTotal, tdPay, tdStatus);
      body.appendChild(tr);
    });

    $("orderEmpty").hidden = filtered.length > 0;
    $("orderCount").textContent = "Showing " + shown.length + " of " + filtered.length + " orders";
    $("moreOrders").hidden = filtered.length <= shown.length;
  }

  // ---------- Ubah data ----------
  function updateOrder(id, changes) {
    const orders = Store.getOrders();
    const next = orders.map((o) => (o.id === id ? Object.assign({}, o, changes) : o));
    // NANTI: PUT /api/orders/:id
    return Store.saveOrders(next);
  }

  $("orderBody").addEventListener("change", (event) => {
    const select = event.target.closest("select[data-id]");
    if (!select) return;
    const status = select.value;
    const changes = { status: status };
    // Pesanan yang dibatalkan tidak dihitung sebagai pendapatan
    if (updateOrder(select.dataset.id, changes)) {
      render();
      toast("Status changed to " + STATUS_LABEL[status] + ".");
    }
  });

  $("orderBody").addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action='pay']");
    if (!btn) return;
    if (updateOrder(btn.dataset.id, { paid: true })) {
      render();
      toast("Payment confirmed.");
    }
  });

  // ---------- Penyaring ----------
  document.querySelectorAll("#statusTabs .seg__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      statusFilter = btn.dataset.status;
      visible = PAGE_SIZE;
      document.querySelectorAll("#statusTabs .seg__btn").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      render();
    });
  });

  $("searchOrder").addEventListener("input", () => {
    visible = PAGE_SIZE;
    render();
  });

  $("moreOrders").addEventListener("click", () => {
    visible += PAGE_SIZE;
    render();
  });

  render();
})();

admin-orders.js