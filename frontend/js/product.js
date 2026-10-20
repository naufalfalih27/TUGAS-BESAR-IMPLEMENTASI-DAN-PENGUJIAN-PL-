// KkTF - product.js (halaman detail produk)
// Data produk dikirim dari kartu lewat parameter URL (lihat script.js bagian 4).

(function () {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");

  // Kalau dibuka tanpa memilih produk, kembali ke katalog
  if (!name) {
    window.location.replace("catalog.html");
    return;
  }

  const desc = params.get("desc") || "";
  const price = parseInt(params.get("price"), 10) || 0;
  const oldPrice = parseInt(params.get("old"), 10) || 0;
  const img = params.get("img") || "";
  const series = params.get("series") || "Tara Signature Coffee";
  // serving: ice | hot | choose (pilih HOT atau ICE) | food (tanpa pilihan)
  const serving = params.get("serving") || "ice";
  const isFood = serving === "food";

  const rupiah = (n) => "IDR " + n.toLocaleString("id-ID");

  // ---------- Isi halaman ----------
  document.title = name + " | KkTF";
  document.getElementById("pSeries").textContent = series;
  document.getElementById("pName").textContent = name;
  document.getElementById("pPrice").textContent = rupiah(price);
  document.getElementById("pDesc").textContent = "\u201C" + desc + "\u201D";

  const pImage = document.getElementById("pImage");
  pImage.src = img;
  pImage.alt = name;

  if (oldPrice > price) {
    const old = document.getElementById("pOld");
    old.textContent = rupiah(oldPrice);
    old.hidden = false;
  }

  // Serving: food = semua pilihan disembunyikan, ice/hot = tetap, choose = pilih
  const iceGroup = document.getElementById("iceGroup");
  const fixedPill = document.getElementById("servingFixed");
  const choiceBox = document.getElementById("servingChoice");

  if (isFood) {
    document.getElementById("servingBox").hidden = true;
    document.getElementById("sugarGroup").hidden = true;
  } else if (serving === "choose") {
    fixedPill.hidden = true;
    choiceBox.hidden = false;
  } else {
    fixedPill.textContent = serving.toUpperCase();
  }

  // Kunci like sama dengan kartu produk, jadi angkanya sinkron (dibaca script.js)
  const likeBtn = document.getElementById("detailLike");
  likeBtn.dataset.key = name;
  likeBtn.setAttribute("aria-label", "Sukai " + name);

  // ---------- Pilihan es dan gula ----------
  const selected = {
    serving: serving === "hot" ? "Hot" : "Ice",
    ice: "Normal",
    sugar: "Normal",
  };

  // Tingkat es hanya muncul untuk minuman ICE
  function updateIceGroup() {
    iceGroup.hidden = isFood || selected.serving !== "Ice";
  }
  updateIceGroup();

  document.querySelectorAll(".serve").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".serve")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      selected.serving = btn.dataset.value;
      updateIceGroup();
    });
  });

  document.querySelectorAll(".opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.group;
      document
        .querySelectorAll('.opt[data-group="' + group + '"]')
        .forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      selected[group] = btn.dataset.value;
    });
  });

  // ---------- Tombol keranjang ----------
  const addBtn = document.getElementById("addCart");
  const addLabel = document.getElementById("addLabel");
  const defaultLabel = "Add to Cart \u2022 " + rupiah(price);
  addLabel.textContent = defaultLabel;

  addBtn.addEventListener("click", () => {
    const item = {
      name: name,
      price: price,
      img: img,
      serving: isFood ? null : selected.serving,
      ice: isFood || selected.serving !== "Ice" ? null : selected.ice,
      sugar: isFood ? null : selected.sugar,
    };

    // Keranjang dikelola cart.js (menggabungkan item sama dan memperbarui badge)
    if (window.KkTFCart) window.KkTFCart.add(item);

    addLabel.textContent = "Added to cart \u2713";
    setTimeout(() => {
      addLabel.textContent = defaultLabel;
    }, 1500);
  });
})();