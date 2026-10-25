// KkTF - chat.js (halaman asisten chatbot)
// Jawaban bot SEMENTARA dibuat di browser dari kata kunci dan data menu lokal.
// Saat backend siap, ganti isi fungsi askBot() di bawah dengan fetch ke API.


(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const rupiah = (n) => "IDR " + n.toLocaleString("id-ID");

  //  Elemen 
  const chat = document.getElementById("chat");
  const messages = document.getElementById("messages");
  const composer = document.getElementById("composer");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const chips = document.querySelectorAll(".chip");
  const backLink = document.getElementById("backLink");

  //  Tombol kembali: kembali ke halaman sebelumnya kalau ada 
  if (backLink) {
    backLink.addEventListener("click", (event) => {
      const cameFromSite = document.referrer && new URL(document.referrer).origin === location.origin;
      if (cameFromSite && history.length > 1) {
        event.preventDefault();
        history.back();
      }
    });
  }

  // DATA MENU (SEMENTARA)
  // Samakan nama file gambar dengan yang ada di assets/images.
  // Nanti data ini datang dari backend.
 
  const MENU = [
    { id: "tacosyuu", name: "Ta Co Syuu", price: 17000, likes: "1.2k", img: "assets/images/ta-co-syuu.png",
      desc: "Sweet milk coffee with a distinctive aroma, soft, and tempting taste." },
    { id: "gendis", name: "Gendis", price: 20000, likes: "451", img: "assets/images/gendis.png",
      desc: "Sweet gendis with rich palm sugar, a naturally delightful treat." },
    { id: "caramella", name: "Caramella", price: 20000, likes: "200", img: "assets/images/caramella.png",
      desc: "Sweet caramel with thick milk coffee, soft, and savory taste." },
    { id: "cokelatkopi", name: "Cokelat Kopi", price: 22000, likes: "128", img: "assets/images/cokelat-kopi.png",
      desc: "Cold chocolate coffee with ice, soft, and indulgent for the tongue." },
    { id: "camomile", name: "Camomile", price: 12000, likes: "245", img: "assets/images/camomile.png",
      desc: "Soothing chamomile flavor with a calming floral note and delicate taste." },
    { id: "dimsum", name: "Dimsum", price: 15000, likes: "610", img: "assets/images/dimsum.png",
      desc: "Soft chicken dimsum, soft wrapping, aromatic, and savory bites." },
    { id: "gyoza", name: "Gyoza", price: 16000, likes: "310", img: "assets/images/gyoza.png",
      desc: "Crispy pan-fried gyoza with a juicy, savory filling." },
    { id: "kopitubruk", name: "Kopi Tubruk", price: 12000, likes: "1.2k", img: "assets/images/kopi-tubruk.png",
      desc: "Dark black tubruk coffee, strong aroma, full of delicious taste." },
    { id: "saringsusu", name: "Kopi Saring Susu", price: 15000, likes: "631", img: "assets/images/kopi-saring-susu.png",
      desc: "Rich coffee with sweetened condensed milk, soft, and refreshing." },
    { id: "saringbutter", name: "Kopi Saring Butter", price: 16000, likes: "1.2k", img: "assets/images/kopi-saring-butter.png",
      desc: "Butter-filtered coffee that is rich with a smooth, aromatic, and indulgent taste." },
    { id: "susutubruk", name: "Kopi Susu Tubruk", price: 13000, likes: "1.2k", img: "assets/images/kopi-susu-tubruk.png",
      desc: "Full-flavored milk coffee with a smooth sweetness in the mouth." },
    { id: "saringhitam", name: "Kopi Saring Hitam", price: 14000, likes: "1.2k", img: "assets/images/kopi-saring-hitam.png",
      desc: "Dark black filtered coffee with a distinctive taste and captivating aroma." },
  ];
  const byId = Object.fromEntries(MENU.map((m) => [m.id, m]));

  // "A", "A atau B", "A, B, atau C" (dalam bahasa Inggris: or)
  function orList(names) {
    if (names.length <= 1) return names.join("");
    if (names.length === 2) return names[0] + " or " + names[1];
    return names.slice(0, -1).join(", ") + ", or " + names[names.length - 1];
  }


  // ATURAN JAWABAN (SEMENTARA)
  // Tanda ** mengapit teks yang dicetak tebal.
  // Urutan penting: aturan yang lebih spesifik ditaruh lebih dulu.
 
  const RULES = [
    {
      test: /\b(hot|panas|warm|hangat)\b/,
      ids: ["kopitubruk", "saringsusu", "saringbutter", "susutubruk", "saringhitam"],
      text: (n) => `Yes, of course. We provide a variety of hot drink options. You can enjoy our ${n}. Here is a look at the menu.`,
    },
    {
      test: /\b(milk|susu|creamy|latte)\b/,
      ids: ["gendis", "tacosyuu"],
      text: (n) => `Of course! For a coffee with milk, I highly recommend our ${n}, both of which offer a delicious, creamy balance. Here is a look at our menu.`,
    },
    {
      test: /\b(cold|iced?|dingin|segar|refreshing)\b/,
      ids: ["caramella", "cokelatkopi", "tacosyuu", "gendis"],
      text: (n) => `For something cold and refreshing, you can try our ${n}. Here is a look at the menu.`,
    },
    {
      test: /\b(tea|teh|camomile|chamomile|relax|calm|tenang)\b/,
      ids: ["camomile"],
      text: (n) => `Feeling like unwinding? Our ${n} has a calming floral note that is perfect for a slow moment.`,
    },
    {
      test: /\b(snack|food|eat|hungry|makan|lapar|jajanan|pasar|cemilan)\b/,
      ids: ["dimsum", "gyoza"],
      text: (n) => `Hungry? Pair your drink with our ${n}. Here is a look at the menu.`,
    },
    {
      test: /\b(strong|black|hitam|pahit|bold|kuat)\b/,
      ids: ["kopitubruk", "saringhitam"],
      text: (n) => `If you like it bold, I recommend our ${n}. Both are strong, aromatic, and unsweetened by default.`,
    },
    {
      test: /\b(sweet|manis|sugar|gula|caramel)\b/,
      ids: ["caramella", "gendis", "cokelatkopi"],
      text: (n) => `Got a sweet tooth? Try our ${n}. Here is a look at the menu.`,
    },
    {
      test: /\b(cheap|murah|budget|hemat|affordable)\b/,
      ids: () => [...MENU].sort((a, b) => a.price - b.price).slice(0, 3).map((m) => m.id),
      text: (n) => `Here are our most budget-friendly picks: ${n}.`,
    },
    {
      test: /^\s*(hi|hello|hai|halo|hey|selamat)\b/,
      ids: [],
      text: () => "Hello! I can help you find your perfect cup. Tell me your mood or what you are craving, for example a hot drink, coffee with milk, tea, or a snack.",
    },
  ];

  const FALLBACK =
    "Hmm, I’m not sure I caught that. Tell me your mood or what you are craving, for example hot drinks, coffee with milk, tea, or a snack.";

  function getReply(input) {
    const lower = input.toLowerCase();

    // 1. Kalau pengguna menyebut nama menu, tampilkan menu itu
    const named = MENU.filter((m) => lower.includes(m.name.toLowerCase()));
    if (named.length) {
      const names = orList(named.map((m) => "**" + m.name + "**"));
      return { text: `Great choice! Here is what I found for you: ${names}.`, items: named };
    }

    // 2. Cocokkan kata kunci
    for (const rule of RULES) {
      if (!rule.test.test(lower)) continue;
      const ids = typeof rule.ids === "function" ? rule.ids() : rule.ids;
      const items = ids.map((id) => byId[id]);
      return { text: rule.text(orList(items.map((m) => "**" + m.name + "**"))), items };
    }

    return { text: FALLBACK, items: [] };
  }

  // PANGGIL BOT
  // TODO backend: ganti isi fungsi ini dengan fetch ke API, contoh:
  //   const res = await fetch("http://localhost:3000/api/chat", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ message: text }),
  //   });
  //   return await res.json(); // bentuk: { text: "...", items: [ {name, desc, price, likes, img} ] }
  // Kunci API layanan AI tidak boleh ditaruh di frontend, simpan di server.

  async function askBot(text) {
    await wait(700); // meniru waktu menjawab
    return getReply(text);
  }


  // TAMPILAN
 
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Teks dengan **tebal**, dibuat lewat DOM supaya aman dari kode HTML
  function renderRich(parent, text) {
    text.split("**").forEach((part, index) => {
      if (!part) return;
      if (index % 2 === 1) {
        parent.appendChild(el("strong", "", part));
      } else {
        parent.appendChild(document.createTextNode(part));
      }
    });
  }

  function buildCard(item) {
    const card = el("article", "chat-card");
    card.dataset.id = item.id || "";

    const likes = el("div", "chat-card__likes");
    const heart = document.createElement("img");
    heart.src = "assets/icons/heart.svg";
    heart.alt = "";
    likes.append(heart, el("span", "", item.likes));
    likes.setAttribute("aria-label", item.likes + " suka");

    const img = document.createElement("img");
    img.className = "chat-card__img";
    img.src = item.img;
    img.alt = item.name;
    img.loading = "lazy";

    card.append(
      likes,
      img,
      el("h3", "chat-card__name", item.name),
      el("p", "chat-card__desc", item.desc),
      el("p", "chat-card__price", rupiah(item.price))
    );
    return card;
  }

  function buildBot(reply) {
    const bubble = el("div", "bubble bubble--bot");
    const text = el("p", "bubble__text");
    renderRich(text, reply.text);
    bubble.appendChild(text);

    if (reply.items && reply.items.length) {
      bubble.classList.add("bubble--cards");
      const grid = el("div", "chat-cards");
      reply.items.forEach((item) => grid.appendChild(buildCard(item)));
      bubble.appendChild(grid);
    }
    return bubble;
  }

  function buildTyping() {
    const bubble = el("div", "bubble bubble--bot");
    bubble.setAttribute("role", "status");
    bubble.setAttribute("aria-label", "Asisten sedang mengetik");
    const dots = el("span", "typing");
    dots.append(el("span"), el("span"), el("span"));
    bubble.appendChild(dots);
    return bubble;
  }

  function scrollToComposer() {
    composer.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "end" });
  }

 
  // KIRIM PESAN
 
  let busy = false;

  function setBusy(state) {
    busy = state;
    sendBtn.disabled = state;
    chips.forEach((chip) => (chip.disabled = state));
    messages.setAttribute("aria-busy", String(state));
  }

  async function send(raw, fromForm) {
    const text = raw.trim();
    if (!text || busy) return;

    setBusy(true);
    chat.classList.remove("chat--empty");

    messages.appendChild(el("div", "bubble bubble--user", text));
    input.value = "";

    const typing = buildTyping();
    messages.appendChild(typing);
    scrollToComposer();

    try {
      const reply = await askBot(text);
      typing.replaceWith(buildBot(reply));
    } catch (error) {
      typing.replaceWith(buildBot({ text: "Sorry, something went wrong. Please try again.", items: [] }));
    }

    setBusy(false);
    scrollToComposer();
    if (fromForm) input.focus();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    send(input.value, true);
  });

  chips.forEach((chip) => {
    chip.title = chip.dataset.text;
    chip.addEventListener("click", () => send(chip.dataset.text, false));
  });
})();