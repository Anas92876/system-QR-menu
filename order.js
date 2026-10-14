/* ================= صفحة الكاشير: قراءة الطلب من رابط الـ QR ================= */
try { if (localStorage.getItem("theme") === "light") document.documentElement.dataset.theme = "light"; } catch {}
const app = $("#app");
const STORE = "noor-received";            // الطلبات المستلمة على هذا الجهاز (لمنع الإدخال المكرر)
const OLD_AFTER = 3 * 60 * 60 * 1000;     // تنبيه إذا كان الطلب أقدم من ٣ ساعات

const received = () => { try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch { return {}; } };
function markReceived(id) {
  const all = received();
  all[id] = Date.now();
  // الاحتفاظ بآخر ٢٠٠ طلب فقط
  const keep = Object.entries(all).sort((a, b) => b[1] - a[1]).slice(0, 200);
  try { localStorage.setItem(STORE, JSON.stringify(Object.fromEntries(keep))); } catch {}
}

const rtf = new Intl.RelativeTimeFormat("ar", { numeric: "auto" });
function ago(date) {
  const min = Math.round((date - Date.now()) / 60000);
  if (Math.abs(min) < 60) return rtf.format(min, "minute");
  return rtf.format(Math.round(min / 60), "hour");
}
const clock = (d) => d.toLocaleTimeString("ar-SY", { hour: "numeric", minute: "2-digit" });
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function render() {
  const order = decodeOrder(location.hash);

  if (!order || !order.lines.length) {
    app.innerHTML = `
      <section class="c-empty">
        <div class="c-empty-ico">⚠️</div>
        <h1>الرمز غير صالح</h1>
        <p class="muted">لم نتمكن من قراءة الطلب. اطلب من الزبون إنشاء رمز جديد من المنيو.</p>
      </section>`;
    return;
  }

  // ترتيب الأسطر حسب رقم الصنف في نظام المحاسبة لتسريع الإدخال
  const lines = [...order.lines].sort((a, b) => a.m.code - b.m.code);
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const total = lines.reduce((a, l) => a + l.unit * l.qty, 0);
  const doneAt = received()[order.id];
  const isOld = order.time && Date.now() - order.time > OLD_AFTER;

  app.innerHTML = `
    <section class="c-head">
      <div>
        <span class="muted">طلب رقم</span>
        <h1 dir="ltr">#${num(+order.number)}</h1>
      </div>
      <div class="c-tags">
        <span class="c-tag type">${order.type === "سفري" ? "🛍" : "🍽"} ${order.type}</span>
        ${order.table ? `<span class="c-tag">طاولة ${num(+order.table)}</span>` : ""}
        ${order.time ? `<span class="c-tag" title="${order.time.toLocaleString("ar-SY")}">🕒 ${clock(order.time)} · ${ago(order.time)}</span>` : ""}
      </div>
    </section>

    ${doneAt ? `<div class="c-alert warn">⚠️ هذا الطلب تم إدخاله مسبقاً على هذا الجهاز ${ago(new Date(doneAt))}. تأكد قبل إدخاله مرة ثانية.</div>` : ""}
    ${isOld ? `<div class="c-alert warn">⏳ هذا الرمز قديم (أُنشئ ${ago(order.time)}).</div>` : ""}
    ${order.unknown ? `<div class="c-alert err">❌ ${num(order.unknown)} صنف غير معروف في الرمز — قد يكون المنيو تغيّر.</div>` : ""}

    <div class="c-progress">
      <span id="progText"></span>
      <div class="bar"><i id="progBar"></i></div>
    </div>

    <ul class="c-lines" id="lines">
      ${lines.map((l, i) => `
        <li class="c-line" data-i="${i}" style="--d:${i * 60}ms">
          <button class="c-check" aria-label="تم إدخال الصنف"></button>
          <span class="c-code" dir="ltr">${l.m.code}</span>
          <div class="c-info">
            <h3>${l.m.name}</h3>
            <div class="c-mods">
              <span>${l.s.label}${l.s.add ? ` <em>+${money(l.s.add)}</em>` : ""}</span>
              ${l.ex.map((x) => `<span><b dir="ltr">${x.code}</b> ${x.label}</span>`).join("")}
            </div>
          </div>
          <div class="c-qty">
            <strong>×${num(l.qty)}</strong>
            <small>${money(l.unit * l.qty)}</small>
          </div>
        </li>`).join("")}
    </ul>

    ${order.note ? `<div class="c-note"><span>📝 ملاحظة الزبون</span><p>${esc(order.note)}</p></div>` : ""}

    <section class="c-total">
      <div><span>عدد القطع</span><strong>${num(count)}</strong></div>
      <div class="sum"><span>المجموع حسب المنيو</span><strong>${money(total)}</strong></div>
      <p class="muted">السعر النهائي حسب نظام المحاسبة.</p>
    </section>

    <div class="c-actions">
      <button class="btn-ghost" id="printBtn">🖨 طباعة</button>
      <button class="btn-primary" id="doneBtn">${doneAt ? "✓ تم الإدخال" : "تم إدخال الطلب ✓"}</button>
    </div>`;

  // تأشير الأصناف أثناء إدخالها على نظام المحاسبة
  const items = [...app.querySelectorAll(".c-line")];
  const update = () => {
    const done = items.filter((li) => li.classList.contains("done")).length;
    $("#progText").textContent = `تم إدخال ${num(done)} من ${num(items.length)}`;
    $("#progBar").style.width = `${(done / items.length) * 100}%`;
  };
  items.forEach((li) => li.onclick = () => { li.classList.toggle("done"); update(); });
  if (doneAt) items.forEach((li) => li.classList.add("done"));
  update();

  $("#printBtn").onclick = () => print();
  $("#doneBtn").onclick = () => {
    items.forEach((li) => li.classList.add("done"));
    update();
    markReceived(order.id);
    $("#doneBtn").textContent = "✓ تم الإدخال";
    toast("تم حفظ الطلب كمُدخل ✓");
    navigator.vibrate?.(40);
  };
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

addEventListener("hashchange", render);
render();
