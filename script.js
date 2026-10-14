/* ================= رقم الطاولة من رمز QR ‏(?table=12) ================= */
// إذا كان رابط المنيو يحتوي ?table=12 يظهر رقم الطاولة ويُرسل مع الطلب، وإلا يُخفى
const tableRaw = (new URLSearchParams(location.search).get("table") || "").replace(/\D/g, "").slice(0, 4);
if (tableRaw) $("#tablePill").textContent = `طاولة ${num(+tableRaw)}`;
else $("#tablePill").hidden = true;

/* ================= الوضع الفاتح / الداكن ================= */
const root = document.documentElement;
try { if (localStorage.getItem("theme") === "light") root.dataset.theme = "light"; } catch {}
$("#themeBtn").onclick = () => {
  const light = root.dataset.theme !== "light";
  light ? (root.dataset.theme = "light") : delete root.dataset.theme;
  try { localStorage.setItem("theme", light ? "light" : "dark"); } catch {}
};

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ================= حركات الواجهة (Hero) ================= */
// عدّاد الأرقام — عدد الأصناف مأخوذ من البيانات مباشرة
document.querySelector('[data-count="40"]').dataset.count = menu.length;
function countUp(el) {
  const target = +el.dataset.count, dec = +(el.dataset.dec || 0), prefix = el.dataset.prefix || "";
  const fmt = (v) => prefix + v.toLocaleString("ar-SY", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  if (reduceMotion) return (el.textContent = fmt(target));
  const start = performance.now(), dur = 1400;
  const step = (t) => {
    const p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 4);
    el.textContent = fmt(target * e);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
setTimeout(() => document.querySelectorAll("[data-count]").forEach(countUp), 900);

// الكلمة المتبدّلة في العنوان
const rotWords = [...document.querySelectorAll("#rotator b")];
let rotIdx = 0;
if (!reduceMotion) setInterval(() => {
  const cur = rotWords[rotIdx];
  cur.classList.replace("on", "out");
  setTimeout(() => cur.classList.remove("out"), 700);
  rotIdx = (rotIdx + 1) % rotWords.length;
  rotWords[rotIdx].classList.add("on");
}, 2600);

// زر تصفّح المنيو
$("#heroCta").onclick = () => scrollToY($("#stickyNav").getBoundingClientRect().top + scrollY - stickyTop());

/* ================= التمرير: بارالاكس + الشريط العلوي + القسم الحالي ================= */
const hero = $("#hero"), heroMedia = $("#heroMedia"), heroContent = $("#heroContent");
const stickyNav = $("#stickyNav");
const stickyTop = () => parseFloat(getComputedStyle(stickyNav).top) || 0;
const navOffset = () => stickyTop() + stickyNav.offsetHeight;

let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const y = scrollY;
    $("#topbar").classList.toggle("scrolled", y > 40);
    stickyNav.classList.toggle("stuck", stickyNav.getBoundingClientRect().top <= stickyTop() + 1);

    const h = hero.offsetHeight;
    if (!reduceMotion && y < h) {
      const p = y / h;
      heroMedia.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
      heroContent.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(${1 - p * 0.06})`;
      heroContent.style.opacity = Math.max(0, 1 - p * 1.4);
    }
    updateActiveChip();
  });
}, { passive: true });

// تمرير ناعم مع إيقاف تحديث الأقسام أثناء الحركة
let spyLock = false, lockTimer;
function scrollToY(y) {
  spyLock = true;
  clearTimeout(lockTimer);
  window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? "auto" : "smooth" });
  const release = () => { spyLock = false; updateActiveChip(); };
  if ("onscrollend" in window) addEventListener("scrollend", release, { once: true });
  lockTimer = setTimeout(release, 1200);
}

/* ================= أزرار الأقسام (مرتبطة بالبيانات) ================= */
const chipsEl = $("#chips");
const indicator = document.createElement("i");
indicator.className = "chip-indicator";
chipsEl.appendChild(indicator);

categories.forEach((c) => {
  const b = document.createElement("button");
  b.className = "chip";
  b.dataset.cat = c.id;
  b.innerHTML = `<span>${c.icon}</span>${c.name}<em>${num(menu.filter((m) => m.cat === c.id).length)}</em>`;
  b.onclick = () => {
    const sec = document.getElementById(c.id);
    if (!sec) return;
    setActiveChip(c.id);
    scrollToY(sec.getBoundingClientRect().top + scrollY - navOffset() + 4);
    sec.classList.remove("flash"); void sec.offsetWidth; sec.classList.add("flash");
  };
  chipsEl.appendChild(b);
});

let activeCat = null;
function setActiveChip(id) {
  if (id === activeCat) return;
  activeCat = id;
  const chips = chipsEl.querySelectorAll(".chip");
  chips.forEach((ch) => ch.classList.toggle("active", ch.dataset.cat === id));
  moveIndicator();
  // توسيط الزر النشط داخل الشريط الأفقي بدون تحريك الصفحة
  const ch = chipsEl.querySelector(`.chip[data-cat="${id}"]`);
  if (ch) {
    const cr = ch.getBoundingClientRect(), pr = chipsEl.getBoundingClientRect();
    chipsEl.scrollBy({ left: cr.left + cr.width / 2 - (pr.left + pr.width / 2), behavior: reduceMotion ? "auto" : "smooth" });
  }
}
function moveIndicator() {
  const ch = chipsEl.querySelector(".chip.active:not([hidden])");
  if (!ch) { indicator.style.opacity = 0; return; }
  indicator.style.opacity = 1;
  indicator.style.width = ch.offsetWidth + "px";
  // الفرق بين موضعي الزر والمؤشر في نفس نظام الإحداثيات (يعمل مع RTL)
  indicator.style.transform = `translateX(${ch.offsetLeft - indicator.offsetLeft}px)`;
}
addEventListener("resize", moveIndicator);
document.fonts?.ready.then(moveIndicator);

function updateActiveChip() {
  if (spyLock) return;
  const secs = [...document.querySelectorAll(".section")];
  if (!secs.length) return;
  const line = navOffset() + 24;
  let cur = secs[0];
  for (const s of secs) if (s.getBoundingClientRect().top <= line) cur = s;
  // في نهاية الصفحة فعّل آخر قسم
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = secs[secs.length - 1];
  setActiveChip(cur.id);
}

const reveal = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); }
  });
}, { threshold: 0.12 });

function renderMenu(query = "") {
  const q = query.trim();
  const menuEl = $("#menu");
  menuEl.innerHTML = "";
  let total = 0;
  const counts = {};

  categories.forEach((c) => {
    const items = menu.filter((m) => m.cat === c.id &&
      (!q || m.name.includes(q) || m.desc.includes(q) || c.name.includes(q)));
    counts[c.id] = items.length;
    if (!items.length) return;
    total += items.length;

    const sec = document.createElement("section");
    sec.className = "section";
    sec.id = c.id;
    sec.innerHTML = `<div class="section-head"><h2>${c.icon} ${c.name}</h2><small>${num(items.length)} أصناف</small></div><div class="grid"></div>`;
    const grid = sec.querySelector(".grid");

    items.forEach((m, i) => {
      const card = document.createElement("article");
      card.className = "card";
      card.style.animationDelay = `${(i % 3) * 70}ms`;
      card.innerHTML = `
        <div class="card-img">${m.badge ? `<span class="badge ${m.badge[0]}">${m.badge[1]}</span>` : ""}</div>
        <div class="card-body">
          <h3>${m.name}</h3>
          <p>${m.desc}</p>
          <div class="card-meta"><span>🔥 ${num(m.kcal)} سعرة</span><span>⏱ ${num(m.time)} د</span></div>
          <div class="card-foot">
            <span class="price">${num(m.price)}<small>ل.س</small></span>
            <button class="add-btn" aria-label="أضف ${m.name}">+</button>
          </div>
        </div>`;
      card.querySelector(".card-img").prepend(imgEl(IMG(m.img, 600), m.name));
      card.onclick = () => openItem(m);
      card.querySelector(".add-btn").onclick = (e) => {
        e.stopPropagation();
        addToCart(m, sizes[0], [], 1);
      };
      grid.appendChild(card);
      reveal.observe(card);
    });
    menuEl.appendChild(sec);
  });

  $("#emptyState").hidden = total > 0;
  syncChips(counts);
}

// مزامنة أزرار الأقسام مع نتائج المنيو: إخفاء الأقسام الفارغة وتحديث العدد
function syncChips(counts) {
  chipsEl.querySelectorAll(".chip").forEach((ch) => {
    const n = counts[ch.dataset.cat] || 0;
    ch.hidden = n === 0;
    ch.querySelector("em").textContent = num(n);
  });
  activeCat = null;
  updateActiveChip();
  moveIndicator();
}

let searchTimer;
$("#searchInput").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    renderMenu(e.target.value);
    // إذا كان المستخدم أسفل المنيو، أعده لبداية النتائج بنعومة
    const menuTop = $("#menu").getBoundingClientRect().top + scrollY - navOffset();
    if (scrollY > menuTop) scrollToY(menuTop);
  }, 180);
});

/* ================= نافذة تفاصيل الصنف ================= */
let current = null, size = sizes[0], qty = 1;

function openItem(m) {
  current = m; size = sizes[0]; qty = 1;
  const img = $("#sheetImg");
  img.onerror = () => { img.onerror = null; img.src = FALLBACK; };
  img.src = IMG(m.img, 1000);
  img.alt = m.name;
  $("#sheetTitle").textContent = m.name;
  $("#sheetDesc").textContent = m.desc;
  $("#sheetBadges").innerHTML = m.badge ? `<span class="badge ${m.badge[0]}">${m.badge[1]}</span>` : "";
  $("#sheetInfo").innerHTML = `<span>🔥 ${num(m.kcal)} سعرة</span><span>⏱ ${num(m.time)} دقيقة</span><span>⭐ ٤٫${num((m.id * 7) % 4 + 6)}</span>`;

  $("#sizeOptions").innerHTML = sizes.map((s, i) =>
    `<button class="opt${i === 0 ? " active" : ""}" data-size="${s.id}">${s.label}<small>${s.add ? "+" + money(s.add) : "مشمول"}</small></button>`
  ).join("");
  $("#sizeOptions").querySelectorAll(".opt").forEach((b) => b.onclick = () => {
    size = sizes.find((s) => s.id === b.dataset.size);
    $("#sizeOptions").querySelectorAll(".opt").forEach((x) => x.classList.toggle("active", x === b));
    updateSheetPrice();
  });

  $("#extraOptions").innerHTML = extras.map((x) =>
    `<label class="extra"><input type="checkbox" value="${x.id}"><span class="box"></span>${x.label}<em>+${money(x.price)}</em></label>`
  ).join("");
  $("#extraOptions").querySelectorAll("input").forEach((i) => i.onchange = updateSheetPrice);

  $("#qtyVal").textContent = num(qty);
  updateSheetPrice();
  openSheet("#itemSheet");
}

const chosenExtras = () => [...$("#extraOptions").querySelectorAll("input:checked")].map((i) => extras.find((x) => x.id === i.value));

function updateSheetPrice() {
  $("#sheetPrice").textContent = money(unitPrice(current, size, chosenExtras()) * qty);
}
$("#qtyMinus").onclick = () => { qty = Math.max(1, qty - 1); $("#qtyVal").textContent = num(qty); updateSheetPrice(); };
$("#qtyPlus").onclick  = () => { qty = Math.min(20, qty + 1); $("#qtyVal").textContent = num(qty); updateSheetPrice(); };
$("#addToCart").onclick = () => { addToCart(current, size, chosenExtras(), qty); closeSheets(); };

/* ================= فتح / إغلاق النوافذ ================= */
function openSheet(sel) {
  closeSheets(true);
  $(sel).classList.add("show");
  $(sel).scrollTop = 0;
  $("#backdrop").classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeSheets(keepBackdrop) {
  document.querySelectorAll(".sheet").forEach((s) => s.classList.remove("show"));
  wakeLock?.release().catch(() => {});
  wakeLock = null;
  if (!keepBackdrop) {
    $("#backdrop").classList.remove("show");
    document.body.style.overflow = "";
  }
}
$("#backdrop").onclick = () => closeSheets();
document.querySelectorAll("[data-close]").forEach((b) => b.onclick = () => closeSheets());
addEventListener("keydown", (e) => e.key === "Escape" && closeSheets());

/* ================= سلة الطلب ================= */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("noor-cart") || "[]"); } catch { cart = []; }
cart = cart.filter((l) => menu.some((m) => m.id === l.id));

function addToCart(m, s, ex, q) {
  const key = `${m.id}-${s.id}-${ex.map((x) => x.id).sort().join(",")}`;
  const line = cart.find((l) => l.key === key);
  if (line) line.qty += q;
  else cart.push({ key, id: m.id, size: s.id, extras: ex.map((x) => x.id), qty: q });
  saveCart();
  toast(`✓ تمت إضافة ${m.name}`);
  const bar = $("#cartBar");
  bar.classList.remove("bump"); void bar.offsetWidth; bar.classList.add("bump");
}

function lineInfo(l) {
  const m = menu.find((x) => x.id === l.id);
  const s = sizes.find((x) => x.id === l.size);
  const ex = l.extras.map((id) => extras.find((x) => x.id === id));
  return { m, s, ex, unit: unitPrice(m, s, ex) };
}

function saveCart() {
  try { localStorage.setItem("noor-cart", JSON.stringify(cart)); } catch {}
  renderCart();
}

function renderCart() {
  const count = cart.reduce((a, l) => a + l.qty, 0);
  const sub = cart.reduce((a, l) => a + lineInfo(l).unit * l.qty, 0);

  $("#cartCount").textContent = num(count);
  $("#cartTotal").textContent = money(sub);
  $("#cartBar").classList.toggle("show", count > 0);
  $("#sumCount").textContent = num(count);
  $("#sumTotal").textContent = money(sub);

  const list = $("#cartList");
  if (!cart.length) { list.innerHTML = `<div class="cart-empty">طلبك فارغ حالياً 🍟</div>`; return; }
  list.innerHTML = "";
  cart.forEach((l, i) => {
    const { m, s, ex, unit } = lineInfo(l);
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="ci-info">
        <h5>${m.name}</h5>
        <small>${s.label}${ex.length ? " · " + ex.map((x) => x.label).join("، ") : ""}</small>
        <div class="ci-price">${money(unit * l.qty)}</div>
      </div>
      <div class="qty"><button data-a="+">+</button><span>${num(l.qty)}</span><button data-a="-">−</button></div>`;
    row.prepend(imgEl(IMG(m.img, 200), m.name));
    row.querySelectorAll("button").forEach((b) => b.onclick = () => {
      l.qty += b.dataset.a === "+" ? 1 : -1;
      if (l.qty <= 0) cart.splice(i, 1);
      saveCart();
    });
    list.appendChild(row);
  });
}

$("#cartBar").onclick = () => openSheet("#cartSheet");
/* ================= نوع الطلب: صالة / سفري ================= */
let orderType = "d";
document.querySelectorAll("#orderType button").forEach((b) => b.onclick = () => {
  orderType = b.dataset.type;
  document.querySelectorAll("#orderType button").forEach((x) => x.classList.toggle("active", x === b));
});

/* ================= إنشاء رمز QR للطلب (بدون باك إند) ================= */
let wakeLock = null;
$("#placeOrder").onclick = () => {
  if (!cart.length) return toast("أضف صنفاً أولاً 🍔");
  if (typeof qrcode !== "function") return toast("تعذّر تحميل مولّد الرمز، تأكد من الاتصال بالإنترنت");

  const hash = encodeOrder(cart, { type: orderType, note: $("#orderNote").value, table: tableRaw });
  const url = new URL("order.html#" + hash, location.href).href;
  const order = decodeOrder(hash);

  $("#qrCode").innerHTML = qrSvg(url);
  $("#qrNumber").textContent = "#" + num(+order.number);
  $("#qrType").textContent = order.type + (tableRaw ? ` · طاولة ${num(+tableRaw)}` : "");
  $("#qrItems").textContent = `${num(order.lines.reduce((a, l) => a + l.qty, 0))} قطعة`;
  $("#qrTotal").textContent = money(order.lines.reduce((a, l) => a + l.unit * l.qty, 0));
  $("#qrLink").href = url;
  openSheet("#qrSheet");

  // إبقاء الشاشة مضاءة أثناء عرض الرمز للكاشير
  navigator.wakeLock?.request("screen").then((l) => (wakeLock = l)).catch(() => {});
};

// رسم الـ QR كـ SVG حاد وواضح بأي حجم
function qrSvg(text) {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount(), q = 2;
  let d = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) d += `M${c + q} ${r + q}h1v1h-1z`;
  return `<svg viewBox="0 0 ${n + q * 2} ${n + q * 2}" shape-rendering="crispEdges" role="img" aria-label="رمز الطلب"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#111"/></svg>`;
}

$("#qrEdit").onclick = () => openSheet("#cartSheet");
$("#qrNew").onclick = () => {
  cart = [];
  $("#orderNote").value = "";
  saveCart();
  closeSheets();
  toast("بدأنا طلباً جديداً ✨");
};

/* ================= إشعار ================= */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ================= تشغيل ================= */
// تحقّق: كل صنف يجب أن ينتمي لقسم موجود
menu.filter((m) => !categories.some((c) => c.id === m.cat))
  .forEach((m) => console.warn(`الصنف "${m.name}" مرتبط بقسم غير موجود: ${m.cat}`));

renderMenu();
renderCart();
