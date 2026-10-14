/* ================= بيانات تجريبية (مشتركة بين المنيو وصفحة الكاشير) ================= */
// code = رقم الصنف في نظام المحاسبة (POS) — عدّله ليطابق نظام المطعم
const IMG = (id, w = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const categories = [
  { id: "shawarma", name: "شاورما",   icon: "🌯" },
  { id: "burgers",  name: "برغر",     icon: "🍔" },
  { id: "pizza",    name: "بيتزا",    icon: "🍕" },
  { id: "chicken",  name: "بروستد",   icon: "🍗" },
  { id: "sides",    name: "مقبلات",   icon: "🍟" },
  { id: "drinks",   name: "مشروبات",  icon: "🥤" },
  { id: "desserts", name: "حلويات",   icon: "🍩" },
];

const B = {
  best: ["best", "★ الأكثر طلباً"],
  hot:  ["hot",  "🌶 حار"],
  new:  ["new",  "جديد"],
  veg:  ["veg",  "🌱 نباتي"],
};

const menu = [
  // شاورما
  { id: 1,  code: 101, cat: "shawarma", name: "شاورما دجاج عربي", price: 35000, img: "1529006557810-274b9b2fc783", badge: B.best, kcal: 650, time: 7,
    desc: "شاورما دجاج متبّلة على الأصول مع بطاطا مقلية وثومية ومخلل، ملفوفة بخبز صاج ومحمّصة." },
  { id: 2,  code: 102, cat: "shawarma", name: "سندويشة شاورما لحمة", price: 45000, img: "1633321702518-7feccafb94d5", kcal: 720, time: 7,
    desc: "لحمة غنم طرية مع بندورة وبصل وبقدونس وطحينة، بخبز مرقوق طازج." },
  { id: 3,  code: 103, cat: "shawarma", name: "شيش طاووق", price: 55000, img: "1599487488170-d11ec9c172f0", badge: B.new, kcal: 580, time: 12,
    desc: "أسياخ دجاج مشوية على الفحم مع ثومية وبطاطا وخبز مشروح." },
  { id: 4,  code: 104, cat: "shawarma", name: "صحن فلافل مشكّل", price: 30000, img: "1561651823-34feb02250e4", badge: B.veg, kcal: 520, time: 8,
    desc: "أقراص فلافل مقرمشة مع طحينة وخضار طازجة ومخلل وخبز محمّص." },

  // برغر
  { id: 5,  code: 201, cat: "burgers", name: "برغر نور الشام", price: 65000, img: "1568901346375-23c9450c58cd", badge: B.best, kcal: 720, time: 10,
    desc: "قطعتا لحم مشوي، جبنة شيدر، بصل مكرمل، مخلل وصوص نور الشام الخاص بخبز بريوش." },
  { id: 6,  code: 202, cat: "burgers", name: "سموكي باربكيو", price: 80000, img: "1553979459-d2229ba7433b", badge: B.hot, kcal: 860, time: 12,
    desc: "ثلاث قطع لحم، بيف مقدد مقرمش، صوص باربكيو مدخّن، حلقات بصل وهالبينو." },
  { id: 7,  code: 203, cat: "burgers", name: "برغر الفطر والترافل", price: 90000, img: "1550547660-d9450f859349", badge: B.new, kcal: 690, time: 12,
    desc: "لحم أنغوس، فطر سوتيه، جبنة سويسرية، مايونيز الترافل وجرجير طازج." },
  { id: 8,  code: 204, cat: "burgers", name: "برغر الجبنة الذائبة", price: 70000, img: "1572802419224-296b0aeee0d9", kcal: 780, time: 10,
    desc: "قطعة لحم غنية مغمورة بصوص أربعة أجبان مع بصل مقرمش." },

  // بيتزا
  { id: 9,  code: 301, cat: "pizza", name: "مارغريتا", price: 60000, img: "1574071318508-1cdbab80d002", badge: B.veg, kcal: 820, time: 15,
    desc: "صلصة بندورة طازجة، موزاريلا، ريحان وزيت زيتون بكر." },
  { id: 10, code: 302, cat: "pizza", name: "بيبروني حارة", price: 85000, img: "1565299624946-b28f40a0ae38", badge: B.hot, kcal: 980, time: 15,
    desc: "بيبروني مضاعف، عسل بالفلفل الحار، موزاريلا وزعتر." },
  { id: 11, code: 303, cat: "pizza", name: "سوبريم", price: 95000, img: "1513104890138-7c749659a591", badge: B.best, kcal: 1050, time: 18,
    desc: "لحمة، فليفلة، زيتون، بصل، فطر وثلاثة أنواع من الأجبان." },

  // بروستد
  { id: 12, code: 401, cat: "chicken", name: "وجبة بروستد ٨ قطع", price: 120000, img: "1626082927389-6cd097cdc6ec", badge: B.best, kcal: 1200, time: 14,
    desc: "دجاج بروستد ذهبي مقرمش متبّل ٢٤ ساعة، مع بطاطا وثومية وكولسلو." },
  { id: 13, code: 402, cat: "chicken", name: "أجنحة بافلو", price: 70000, img: "1562967914-608f82629710", badge: B.hot, kcal: 640, time: 12,
    desc: "١٠ أجنحة مقرمشة بصوص البافلو الحار مع صوص الرانش." },
  { id: 14, code: 403, cat: "chicken", name: "راب زنجر", price: 50000, img: "1626700051175-6818013e1d4f", badge: B.new, kcal: 560, time: 8,
    desc: "دجاج زنجر حار، خس، ملفوف أحمر وصوص الثوم بخبز تورتيلا محمّص." },

  // مقبلات
  { id: 15, code: 501, cat: "sides", name: "بطاطا محمّلة", price: 35000, img: "1573080496219-bb080dd4f877", kcal: 520, time: 6,
    desc: "بطاطا مقرمشة مع صوص الجبنة وقطع البيف المقدد والبصل الأخضر." },
  { id: 16, code: 502, cat: "sides", name: "سلطة خضراء", price: 30000, img: "1512621776951-a57141f2eefd", badge: B.veg, kcal: 240, time: 5,
    desc: "خضار مشكّلة، بندورة كرزية، أفوكادو، خيار وصوص الليمون." },

  // مشروبات
  { id: 17, code: 601, cat: "drinks", name: "ليموناضة بالنعناع", price: 20000, img: "1544145945-f90425340c7e", kcal: 120, time: 3,
    desc: "ليمون معصور طازج مع أوراق النعناع والثلج المجروش." },
  { id: 18, code: 602, cat: "drinks", name: "ميلك شيك أوريو", price: 35000, img: "1572490122747-3968b75cc699", badge: B.best, kcal: 610, time: 4,
    desc: "آيس كريم فانيلا كثيف مع بسكويت أوريو وكريمة مخفوقة." },
  { id: 19, code: 603, cat: "drinks", name: "ميلك شيك فريز", price: 35000, img: "1577805947697-89e18249d767", kcal: 540, time: 4,
    desc: "فريز طبيعي مع آيس كريم الفانيلا والحليب الطازج." },

  // حلويات
  { id: 20, code: 701, cat: "desserts", name: "دونات مشكّل", price: 30000, img: "1551024601-bec78aea704b", badge: B.new, kcal: 450, time: 3,
    desc: "علبة ٣ قطع دونات بالشوكولا والفريز والكراميل." },
  { id: 21, code: 702, cat: "desserts", name: "آيس كريم صنداي", price: 25000, img: "1563805042-7684c019e1cb", kcal: 380, time: 3,
    desc: "آيس كريم فانيلا مع صوص الشوكولا الساخن والمكسرات وحبة كرز." },
  { id: 22, code: 703, cat: "desserts", name: "بارفيه التوت", price: 30000, img: "1488477181946-6428a0291777", kcal: 320, time: 3,
    desc: "طبقات من الكريمة والغرانولا والتوت الطازج." },
];

const sizes = [
  { id: "S", label: "عادي", add: 0 },
  { id: "M", label: "كبير", add: 10000 },
  { id: "L", label: "دبل",  add: 20000 },
];
const extras = [
  { id: "cheese", key: "c", code: 901, label: "جبنة إضافية",   price: 8000 },
  { id: "sauce",  key: "s", code: 902, label: "صوص نور الشام", price: 5000 },
  { id: "jalap",  key: "j", code: 903, label: "هالبينو",        price: 5000 },
];

/* ================= أدوات مساعدة ================= */
const $ = (s) => document.querySelector(s);
const num = (n) => Math.round(n).toLocaleString("ar-SY");
const money = (n) => `${num(n)} ل.س`;
const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g'><stop offset='0' stop-color='#ff5a1f'/><stop offset='1' stop-color='#ffb800'/></linearGradient></defs><rect width='100' height='100' fill='url(#g)'/><text x='50' y='62' font-size='40' text-anchor='middle'>🍔</text></svg>`
);
function imgEl(src, alt) {
  const im = new Image();
  im.loading = "lazy";
  im.alt = alt;
  im.onload = () => im.classList.add("loaded");
  im.onerror = () => { im.onerror = null; im.src = FALLBACK; };
  im.src = src;
  return im;
}

const unitPrice = (m, s, ex) => m.price + s.add + ex.reduce((a, x) => a + x.price, 0);

/* ================= ترميز الطلب داخل رابط الـ QR (بدون باك إند) =================
   كل سطر = رقم الصنف + الحجم + أحرف الإضافات + x + الكمية   مثال: 1Sx2-5Mcsx1
   الأسعار لا تُرسل في الرابط — تُحسب دائماً من هذا الملف عند الكاشير.          */
const ORDER_TYPES = { d: "صالة", t: "سفري" };

function encodeOrder(cart, { type = "d", note = "", table = "" } = {}) {
  const o = cart.map((l) =>
    l.id + l.size + l.extras.map((id) => extras.find((x) => x.id === id).key).sort().join("") + "x" + l.qty
  ).join("-");
  const p = new URLSearchParams({
    o,
    t: type,
    n: String(100 + Math.floor(Math.random() * 900)),          // رقم طلب قصير للمناداة
    ts: Math.floor(Date.now() / 1000).toString(36),             // وقت إنشاء الطلب
  });
  if (table) p.set("tb", table);
  if (note.trim()) p.set("m", note.trim().slice(0, 80));
  return p.toString();
}

function decodeOrder(str) {
  const p = new URLSearchParams(str.replace(/^#/, ""));
  const raw = p.get("o");
  if (!raw) return null;
  const lines = [];
  let unknown = 0;
  for (const part of raw.split("-")) {
    const mt = /^(\d+)([SML])([a-wyz]*)x(\d{1,2})$/.exec(part);
    const m = mt && menu.find((x) => x.id === +mt[1]);
    const s = mt && sizes.find((x) => x.id === mt[2]);
    const ex = mt ? [...mt[3]].map((k) => extras.find((x) => x.key === k)) : [];
    if (!m || !s || ex.includes(undefined) || !(+mt[4] > 0)) { unknown++; continue; }
    lines.push({ m, s, ex, qty: +mt[4], unit: unitPrice(m, s, ex) });
  }
  const ts = parseInt(p.get("ts") || "", 36);
  return {
    lines, unknown,
    type: ORDER_TYPES[p.get("t")] || ORDER_TYPES.d,
    number: p.get("n") || "—",
    table: p.get("tb") || "",
    note: p.get("m") || "",
    time: Number.isFinite(ts) ? new Date(ts * 1000) : null,
    id: `${p.get("n")}-${p.get("ts")}`,
  };
}
