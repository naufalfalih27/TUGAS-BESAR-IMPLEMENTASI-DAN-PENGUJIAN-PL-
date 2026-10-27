// =========================================================
// KkTF - admin-menu.js (kelola menu)
// Tambah, ubah harga/deskripsi/foto/stok, dan hapus menu.
// =========================================================

(function () {
  "use strict";
  if (!window.Admin) return; // pengaman akses di admin.js belum lolos

  const A = window.Admin;
  const { Store, rupiah, el, CATEGORIES, toast } = A;
  const $ = (id) => document.getElementById(id);

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_MB = 5;

  const dialog = $("menuDialog");
  const form = $("menuForm");
  const confirmDialog = $("confirmDialog");

  let photoValue = ""; // alamat atau data gambar yang akan disimpan

  // ---------- Daftar menu ----------
  function imageSrc(path) {
    if (!path) return "";
    return path.indexOf("data:") === 0 ? path : encodeURI(path);
  }

  function stockBadge(m) {
    if (m.stock === 0) return el("span", "badge badge--bad", "Out");
    if (m.stock <= m.stockMin) return el("span", "badge badge--warn", "Low");
    return null;
  }

  function renderTable() {
    const rows = Store.getMenu();
    const q = $("searchMenu").value.trim().toLowerCase();
    const cat = $("filterCategory").value;
    const status = $("filterStatus").value;

    const filtered = rows.filter(
      (m) =>
        (!q || m.namaMenu.toLowerCase().includes(q)) &&
        (!cat || String(m.kategoriID) === cat) &&
        (!status || m.statusMenu === status)
    );

    const body = $("menuBody");
    body.textContent = "";

    filtered.forEach((m) => {
      const tr = el("tr");

      // Foto
      const thumb = el("div", "thumb");
      if (m.fotoMenu) {
        const img = document.createElement("img");
        img.src = imageSrc(m.fotoMenu);
        img.alt = "";
        img.loading = "lazy";
        img.addEventListener("error", () => {
          img.remove();
          thumb.textContent = m.namaMenu.charAt(0).toUpperCase();
        });
        thumb.appendChild(img);
      } else {
        thumb.textContent = m.namaMenu.charAt(0).toUpperCase();
      }
      const tdPhoto = el("td");
      tdPhoto.appendChild(thumb);

      // Nama dan deskripsi singkat
      const tdName = el("td");
      tdName.append(el("div", "cell-name", m.namaMenu), el("div", "cell-sub", m.satuan));

      // Stok
      const tdStock = el("td", "cell-num", m.stock + " ");
      const badge = stockBadge(m);
      if (badge) tdStock.appendChild(badge);

      // Status
      const tdStatus = el("td");
      tdStatus.appendChild(el("span", "badge " + (m.statusMenu === "Available" ? "badge--ok" : "badge--neutral"), m.statusMenu));

      // Tombol
      const edit = el("button", "a-btn a-btn--ghost a-btn--sm", "Edit");
      edit.type = "button";
      edit.dataset.action = "edit";
      edit.dataset.id = m.menuID;
      edit.setAttribute("aria-label", "Edit " + m.namaMenu);
      const del = el("button", "a-btn a-btn--danger a-btn--sm", "Delete");
      del.type = "button";
      del.dataset.action = "delete";
      del.dataset.id = m.menuID;
      del.setAttribute("aria-label", "Delete " + m.namaMenu);
      const tdActions = el("td");
      const actions = el("div", "cell-actions");
      actions.append(edit, del);
      tdActions.appendChild(actions);

      tr.append(
        tdPhoto,
        tdName,
        el("td", "", CATEGORIES[m.kategoriID] || "-"),
        el("td", "cell-num", rupiah(m.harga)),
        tdStock,
        tdStatus,
        tdActions
      );
      body.appendChild(tr);
    });

    $("menuEmpty").hidden = filtered.length > 0;
    $("menuCount").textContent = "Showing " + filtered.length + " of " + rows.length + " menu";
  }

  // ---------- Formulir ----------
  function setError(inputId, errorId, message) {
    const field = $(inputId).closest(".fld");
    field.classList.toggle("has-error", Boolean(message));
    $(errorId).textContent = message || "";
  }

  function clearErrors() {
    [["fName", "eName"], ["fDesc", "eDesc"], ["fPrice", "ePrice"], ["fStock", "eStock"], ["fStockMin", "eStockMin"], ["fPhoto", "ePhoto"]].forEach(
      (pair) => setError(pair[0], pair[1], "")
    );
  }

  function showPreview(src) {
    const box = $("photoPreview");
    box.textContent = "";
    if (!src) {
      box.textContent = "No photo";
      return;
    }
    const img = document.createElement("img");
    img.src = imageSrc(src);
    img.alt = "Photo preview";
    img.addEventListener("error", () => {
      box.textContent = "Photo not found";
    });
    box.appendChild(img);
  }

  function openForm(row) {
    clearErrors();
    form.reset();
    $("fPhoto").value = "";

    if (row) {
      $("menuDialogTitle").textContent = "Edit menu";
      $("fId").value = row.menuID;
      $("fName").value = row.namaMenu;
      $("fDesc").value = row.deskripsiMenu;
      $("fCategory").value = String(row.kategoriID);
      $("fUnit").value = row.satuan;
      $("fPrice").value = row.harga;
      $("fStatus").value = row.statusMenu;
      $("fStock").value = row.stock;
      $("fStockMin").value = row.stockMin;
      photoValue = row.fotoMenu || "";
    } else {
      $("menuDialogTitle").textContent = "Add menu";
      $("fId").value = "";
      $("fStock").value = 20;
      $("fStockMin").value = 5;
      photoValue = "";
    }
    showPreview(photoValue);
    dialog.showModal();
    $("fName").focus();
  }

  // Perkecil gambar supaya ringan (maks 800 px) dan simpan sebagai JPEG
  function processImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("read"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("decode"));
        img.onload = () => {
          const scale = Math.min(1, 800 / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff"; // latar putih untuk PNG transparan
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  $("fPhoto").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    setError("fPhoto", "ePhoto", "");
    if (!file) return;

    // NANTI: unggah file ke server, dan server memeriksa ulang jenis serta ukuran file.
    if (ALLOWED_TYPES.indexOf(file.type) === -1) {
      event.target.value = "";
      setError("fPhoto", "ePhoto", "Only JPG, PNG, or WebP images are allowed.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      event.target.value = "";
      setError("fPhoto", "ePhoto", "The image must be " + MAX_FILE_MB + " MB or smaller.");
      return;
    }
    try {
      photoValue = await processImage(file);
      showPreview(photoValue);
    } catch (e) {
      event.target.value = "";
      setError("fPhoto", "ePhoto", "This image could not be read. Try another file.");
    }
  });

  function isWholeNumber(text) {
    return /^\d+$/.test(text.trim());
  }

  function validate(rows) {
    let ok = true;
    const id = $("fId").value;

    const name = $("fName").value.trim();
    if (!name) {
      setError("fName", "eName", "Enter the menu name.");
      ok = false;
    } else if (rows.some((m) => m.namaMenu.toLowerCase() === name.toLowerCase() && String(m.menuID) !== id)) {
      setError("fName", "eName", "A menu with this name already exists.");
      ok = false;
    } else {
      setError("fName", "eName", "");
    }

    if ($("fDesc").value.length > 160) {
      setError("fDesc", "eDesc", "Description can be up to 160 characters.");
      ok = false;
    } else {
      setError("fDesc", "eDesc", "");
    }

    const price = $("fPrice").value;
    if (!isWholeNumber(price) || Number(price) < 1 || Number(price) > 1000000) {
      setError("fPrice", "ePrice", "Enter a price between 1 and 1.000.000.");
      ok = false;
    } else {
      setError("fPrice", "ePrice", "");
    }

    if (!isWholeNumber($("fStock").value) || Number($("fStock").value) > 100000) {
      setError("fStock", "eStock", "Enter a whole number of 0 or more.");
      ok = false;
    } else {
      setError("fStock", "eStock", "");
    }

    if (!isWholeNumber($("fStockMin").value) || Number($("fStockMin").value) > 100000) {
      setError("fStockMin", "eStockMin", "Enter a whole number of 0 or more.");
      ok = false;
    } else {
      setError("fStockMin", "eStockMin", "");
    }

    return ok;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const rows = Store.getMenu();
    if (!validate(rows)) return;

    const id = $("fId").value;
    const data = {
      kategoriID: Number($("fCategory").value),
      namaMenu: $("fName").value.trim(),
      deskripsiMenu: $("fDesc").value.trim(),
      harga: Number($("fPrice").value),
      satuan: $("fUnit").value,
      stockMin: Number($("fStockMin").value),
      stock: Number($("fStock").value),
      fotoMenu: photoValue,
      statusMenu: $("fStatus").value,
    };

    // NANTI: kirim ke backend (POST /api/menu atau PUT /api/menu/:id), lalu muat ulang daftar.
    let next;
    if (id) {
      next = rows.map((m) => (String(m.menuID) === id ? Object.assign({}, m, data) : m));
    } else {
      const newId = rows.reduce((max, m) => Math.max(max, m.menuID), 0) + 1;
      next = rows.concat(Object.assign({ menuID: newId }, data));
    }

    if (!Store.saveMenu(next)) return;
    dialog.close();
    renderTable();
    toast(id ? "Menu updated." : "Menu added.");
  });

  $("addMenuBtn").addEventListener("click", () => openForm(null));
  $("menuClose").addEventListener("click", () => dialog.close());
  $("menuCancel").addEventListener("click", () => dialog.close());

  // ---------- Konfirmasi dan hapus ----------
  function ask(title, text, okText) {
    return new Promise((resolve) => {
      $("confirmTitle").textContent = title;
      $("confirmText").textContent = text;
      $("confirmOk").textContent = okText;
      confirmDialog.returnValue = "cancel";
      confirmDialog.addEventListener("close", () => resolve(confirmDialog.returnValue === "ok"), { once: true });
      confirmDialog.showModal();
    });
  }

  async function removeMenu(id) {
    const rows = Store.getMenu();
    const row = rows.find((m) => String(m.menuID) === String(id));
    if (!row) return;

    // Menu yang pernah dipesan tidak boleh dihapus, supaya riwayat pesanan tetap utuh
    const hasHistory = Store.getOrders().some((o) => o.items.some((i) => i.menuID === row.menuID || i.name === row.namaMenu));

    if (hasHistory) {
      const yes = await ask(
        "Cannot delete this menu",
        row.namaMenu + " already appears in past orders, so deleting it would break order history. Set it to Unavailable instead?",
        "Set Unavailable"
      );
      if (!yes) return;
      Store.saveMenu(rows.map((m) => (m.menuID === row.menuID ? Object.assign({}, m, { statusMenu: "Unavailable" }) : m)));
      renderTable();
      toast(row.namaMenu + " is now unavailable.");
      return;
    }

    const yes = await ask("Delete menu?", "Delete " + row.namaMenu + "? This cannot be undone.", "Delete");
    if (!yes) return;
    // NANTI: DELETE /api/menu/:id
    Store.saveMenu(rows.filter((m) => m.menuID !== row.menuID));
    renderTable();
    toast("Menu deleted.");
  }

  // Tombol Edit dan Delete (satu pendengar untuk seluruh tabel)
  $("menuBody").addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) return;
    if (btn.dataset.action === "edit") {
      const row = Store.getMenu().find((m) => String(m.menuID) === btn.dataset.id);
      if (row) openForm(row);
    } else {
      removeMenu(btn.dataset.id);
    }
  });

  ["searchMenu", "filterCategory", "filterStatus"].forEach((id) => $(id).addEventListener("input", renderTable));

  renderTable();
})();