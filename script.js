import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, 
  increment, setDoc, deleteDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDV-O86ZWsnjT5ylWAvqCtVzia6gtVDcSQ",
  authDomain: "qotof-elbr.firebaseapp.com",
  projectId: "qotof-elbr",
  storageBucket: "qotof-elbr.firebasestorage.app",
  messagingSenderId: "102462001917",
  appId: "1:102462001917:web:90c140c1714f03afa66494",
  measurementId: "G-7FVJB2J87J"
};
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const perfumesCol = collection(db, "perfumes"); 
const ordersCol = collection(db, "orders");
const offersCol = collection(db, "offers");
const reviewsCol = collection(db, "reviews");

/* =========================================================
   قطوف البر — Vanilla JavaScript E-Commerce (Honey Edition)
   ========================================================= */

const products = [
  {
    id: 1,
    name: "Royal Mountain Sidr",
    nameAr: "عسل سدر جبلي ملكي",
    category: "men",
    categoryLabel: "Sidr Honey",
    categoryLabelAr: "سدر جبلي",
    price: 650,
    rating: 4.9,
    reviews: 148,
    description: "Pure wild Sidr honey with a rich aroma and proven therapeutic potency.",
    descriptionAr: "عسل سدر جبلي بري خام من أشجار السدر المعمرة، ذو كثافة عالية وطعم غني وخصائص علاجية مذهلة.",
    notes: ["Wild Sidr", "Raw Enzyme", "Dense Body"],
    notesAr: ["سدر جبلي", "إنزيمات حية", "خام مصفى على البارد"],
    badge: "Bestseller",
    badgeAr: "الأكثر طلباً",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85",
    featured: true,
    bestseller: true
  },
  {
    id: 2,
    name: "Wildflower & Black Seed",
    nameAr: "عسل حبة البركة والزهور البرية",
    category: "unisex",
    categoryLabel: "Propolis & Blends",
    categoryLabelAr: "زهور وحبة البركة",
    price: 420,
    rating: 4.8,
    reviews: 112,
    description: "Extracted from black seed blossoms, exceptionally rich in antioxidants.",
    descriptionAr: "مستخلص من رحيق أزهار حبة البركة البرية، معزز طبيعي للمناعة ومقاومة الإجهاد بنكهة عطرية أصيلة.",
    notes: ["Nigella Sativa", "Wild Blossom", "Immunity Booster"],
    notesAr: ["حبة البركة", "رحيق بري", "مقوي للمناعة"],
    badge: "New",
    badgeAr: "جديد الجني",
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=900&q=85",
    featured: true,
    bestseller: true
  },
  {
    id: 3,
    name: "Citrus Orange Blossom",
    nameAr: "عسل الموالح وزهر البرتقال",
    category: "women",
    categoryLabel: "Citrus & Floral",
    categoryLabelAr: "موالح وزهور",
    price: 340,
    rating: 4.9,
    reviews: 95,
    description: "Light, refreshing honey with natural Vitamin C, perfect for children and daily morning energy.",
    descriptionAr: "عسل خفيف نقي مستخلص من أزهار البرتقال والليمون، غني بفيتامين C ومهدئ للأعصاب ومثالي للأطفال.",
    notes: ["Orange Blossom", "Citrus Nectar", "Vitamin C"],
    notesAr: ["زهر البرتقال", "رحيق الموالح", "غني بفيتامين C"],
    badge: "Pure",
    badgeAr: "طبيعي 100%",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=85",
    featured: true,
    bestseller: true
  },
  {
    id: 4,
    name: "Royal Honey Comb",
    nameAr: "قرص شمع عسل السدر الطبيعي",
    category: "men",
    categoryLabel: "Sidr Honey",
    categoryLabelAr: "شمع عسل طبيعي",
    price: 580,
    rating: 4.8,
    reviews: 84,
    description: "Raw honeycomb straight from the hive, untouched and rich in pure propolis.",
    descriptionAr: "شمع عسل خام مقطوف طازجاً من خلايا النحل، يحتوي على خلاصة العكبر وحبوب اللقاح بكامل فوائدهما الخام.",
    notes: ["Raw Comb", "Virgin Wax", "Pure Propolis"],
    notesAr: ["شمع طبيعي", "عكبر حي", "خام طازج"],
    badge: "Special",
    badgeAr: "موسمي فاخر",
    image: "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=900&q=85",
    featured: true,
    bestseller: true
  },
  {
    id: 5,
    name: "Wild Marjoram Herbal Honey",
    nameAr: "عسل البردقوش والأعشاب الجبلية",
    category: "unisex",
    categoryLabel: "Propolis & Blends",
    categoryLabelAr: "أعشاب برية",
    price: 390,
    rating: 4.7,
    reviews: 73,
    description: "A soothing herbal honey sourced from wild mountain marjoram, great for digestion.",
    descriptionAr: "مستخلص من مراعي البردقوش الجبلية، ممتاز للجهاز الهضمي وتنظيم النوم ومسكن طبيعي هادئ.",
    notes: ["Mountain Marjoram", "Digestive Aid", "Herbal Aroma"],
    notesAr: ["بردقوش جبلي", "مريح للهضم", "أعشاب طبية"],
    badge: "",
    badgeAr: "",
    image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=900&q=85",
    featured: true,
    bestseller: false
  },
  {
    id: 6,
    name: "Royal Energy & Ginseng Blend",
    nameAr: "خلطة الطاقة الملكية (غذاء ملكات + حبوب لقاح)",
    category: "bestseller",
    categoryLabel: "Propolis & Blends",
    categoryLabelAr: "خلطة ملكية",
    price: 850,
    rating: 4.9,
    reviews: 165,
    description: "A potent vitality blend of Sidr honey, fresh royal jelly, ginseng and bee pollen.",
    descriptionAr: "توليفة فائقة القوة تجمع عسل السدر مع غذاء ملكات النحل الصافي وحبوب اللقاح وغبار الطلع لنشاط وحيوية قصوى.",
    notes: ["Fresh Royal Jelly", "Bee Pollen", "Pure Ginseng"],
    notesAr: ["غذاء ملكات خام", "حبوب لقاح", "عسل سدر جبلي"],
    badge: "Elite",
    badgeAr: "الأقوى فاعلية",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85",
    featured: false,
    bestseller: true
  }
];

/* =========================================================
   TRANSLATIONS (Honey Specific)
   ========================================================= */

const i18n = {
  ar: {
    reviews: "تقييم",
    quickView: "عرض التفاصيل",
    addToCart: "أضف إلى السلة",
    unavailable: "نفد من المناحل",
    unavailableText: "هذا المحصول غير متاح حالياً.",
    addedTitle: "تمت الإضافة إلى السلة",
    addedText: (name) => `تمت إضافة ${name} إلى سلتك العسلية.`,
    removedTitle: "تم الحذف",
    removedText: "تمت إزالة العبوة من سلتك.",
    wishlistAddedTitle: "أُضيف إلى المفضلة",
    wishlistAddedText: "يمكنك الرجوع لهذا الصنف في أي وقت.",
    wishlistRemovedTitle: "تحديث المفضلة",
    wishlistRemovedText: "تمت الإزالة من المفضلة.",
    emptyCartTitle: "سلتك العسلية فارغة",
    emptyCartText: "اختر من أجود أنواع العسل الطبيعي والمشتقات الملكية ما يدعم صحتك وطاقتك.",
    exploreFragrances: "تسوّق الأعسال",
    emptyCartToastTitle: "سلتك فارغة",
    emptyCartToastText: "يرجى اختيار عبوة عسل قبل إتمام الطلب.",
    addToWishlist: "أضف إلى المفضلة",
    removeFromWishlist: "أزل من المفضلة"
  },
  en: {
    reviews: "reviews",
    quickView: "View Details",
    addToCart: "Add to Cart",
    unavailable: "Out of Stock",
    unavailableText: "This harvest is currently unavailable.",
    addedTitle: "Added to cart",
    addedText: (name) => `${name} is now in your honey selection.`,
    removedTitle: "Removed",
    removedText: "The item was removed from your cart.",
    wishlistAddedTitle: "Saved to favorites",
    wishlistAddedText: "You can find this product here anytime.",
    wishlistRemovedTitle: "Wishlist updated",
    wishlistRemovedText: "Removed from your favorites.",
    emptyCartTitle: "Your honey cart is empty",
    emptyCartText: "Discover raw natural honey varieties crafted for your wellness.",
    exploreFragrances: "Shop Honey",
    emptyCartToastTitle: "Your cart is empty",
    emptyCartToastText: "Add a honey jar before checkout.",
    addToWishlist: "Add to wishlist",
    removeFromWishlist: "Remove from wishlist"
  }
};

/* =========================================================
   STATE & WEIGHT SPECIFIC MULTIPLIERS (250g, 500g, 1000g)
   ========================================================= */

let cart = loadCart();
let wishlist = loadWishlist();
let currentCategory = "all";
let currentSearch = "";
let currentSort = "featured";
let selectedProduct = null;
let currentPage = 1;
const PRODUCTS_PER_PAGE = 8;
let selectedSize = 50; // الحجم الافتراضي: نصف كيلو (500 جم)

// نسب تسعير أوزان العسل بناءً على سعر عبوة النصف كيلو (500 جم)
const SIZE_MULTIPLIERS = {
  30: 0.55,  // ربع كيلو (250 جم)
  50: 1.00,  // نصف كيلو (500 جم - السعر الأساسي)
  100: 1.85  // كيلو كامل (1000 جم - توفير)
};

function getSizeLabel(size) {
  const s = Number(size);
  if (s === 30) return "ربع كيلو (250 جم)";
  if (s === 50) return "نصف كيلو (500 جم)";
  if (s === 100) return "كيلو كامل (1000 جم)";
  return `${size} جم`;
}

function getPriceForSize(basePrice, size = 50) {
  return Math.round((basePrice * (SIZE_MULTIPLIERS[size] || 1)) / 10) * 10;
}

let toastTimeout;
let currentLang = loadLang();

/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const productsGrid = document.getElementById("productsGrid");
const noProducts = document.getElementById("noProducts");
const paginationEl = document.getElementById("pagination");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartFooter = document.getElementById("cartFooter");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const overlay = document.getElementById("overlay");

/* =========================================================
   HELPERS & STORAGE
   ========================================================= */

function t(key) {
  return i18n[currentLang][key];
}

function formatPrice(price) {
  const num = price.toLocaleString(currentLang === "ar" ? "ar-EG" : "en-EG");
  return currentLang === "ar" ? `${num} جنيه` : `${num} EGP`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function loadCart() {
  try {
    const saved = localStorage.getItem("qutoof-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("qutoof-cart", JSON.stringify(cart));
}

function loadWishlist() {
  try {
    const saved = localStorage.getItem("qutoof-wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveWishlist() {
  localStorage.setItem("qutoof-wishlist", JSON.stringify(wishlist));
}

function loadLang() {
  const saved = localStorage.getItem("qutoof-lang");
  return saved === "en" ? "en" : "ar";
}

function saveLang() {
  localStorage.setItem("qutoof-lang", currentLang);
}

function getProduct(id) {
  return products.find(product => String(product.id) === String(id));
}

function stars(rating) {
  return `★ ${rating.toFixed(1)}`;
}

function productName(product) {
  return currentLang === "ar" ? product.nameAr : product.name;
}

function productCategoryLabel(product) {
  return currentLang === "ar" ? product.categoryLabelAr : product.categoryLabel;
}

function productDescription(product) {
  return currentLang === "ar" ? product.descriptionAr : product.description;
}

function productNotes(product) {
  return currentLang === "ar" ? product.notesAr : product.notes;
}

function productBadge(product) {
  return currentLang === "ar" ? product.badgeAr : product.badge;
}

/* =========================================================
   LANGUAGE TOGGLE
   ========================================================= */

function applyLanguage() {
  document.documentElement.setAttribute("lang", currentLang);
  document.documentElement.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");

  document.querySelectorAll("[data-ar-html], [data-en-html]").forEach(el => {
    const html = currentLang === "ar" ? el.dataset.arHtml : el.dataset.enHtml;
    if (html !== undefined) el.innerHTML = html;
  });

  document.querySelectorAll("[data-ar], [data-en]").forEach(el => {
    const text = currentLang === "ar" ? el.dataset.ar : el.dataset.en;
    if (text !== undefined) el.textContent = text;
  });

  document.querySelectorAll("[data-ar-ph], [data-en-ph]").forEach(el => {
    const ph = currentLang === "ar" ? el.dataset.arPh : el.dataset.enPh;
    if (ph !== undefined) el.setAttribute("placeholder", ph);
  });

  const langBtnText = document.getElementById("langBtnText");
  if (langBtnText) langBtnText.textContent = currentLang === "ar" ? "EN" : "AR";

  renderProducts();
  updateCartUI();
  updateWishlistCountUI();
}

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  saveLang();
  applyLanguage();
}

/* =========================================================
   PRODUCT RENDERING (Honey Cards - 3 Sizes)
   ========================================================= */

function productCard(product) {
  const isFavorite = wishlist.some(favId => String(favId) === String(product.id));
  const badge = productBadge(product);

  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrap">
        ${badge ? `<span class="product-badge">${escapeHtml(badge)}</span>` : ""}

        <button
          type="button"
          class="wishlist-btn ${isFavorite ? "active" : ""}"
          data-action="wishlist"
          data-id="${product.id}"
          aria-label="${isFavorite ? escapeHtml(t("removeFromWishlist")) : escapeHtml(t("addToWishlist"))}"
        >${isFavorite ? "♥" : "♡"}</button>

        <button
          type="button"
          class="card-eye-btn"
          data-action="open-full-page"
          data-id="${product.id}"
          title="تفاصيل المحصول والفحص المعملي"
          aria-label="تفاصيل المحصول"
        >
          <svg viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>

        <img
          class="product-image"
          src="${product.image}"
          alt="${escapeHtml(productName(product))}"
          loading="lazy"
          data-action="open-full-page"
          data-id="${product.id}"
        >
      </div>

      <div class="product-info" data-action="open-full-page" data-id="${product.id}">
        <div class="product-meta">
          <span class="product-category">${escapeHtml(productCategoryLabel(product))}</span>
          <span class="rating">${stars(product.rating)}</span>
        </div>

        <h3 class="product-name">${escapeHtml(productName(product))}</h3>

        <p class="product-description">
          ${escapeHtml(productDescription(product))}
        </p>

        <!-- اختيار الأوزان الثلاثة مباشرة من الكارت -->
        <div class="card-sizes" onclick="event.stopPropagation()">
          <button type="button" class="card-size-btn" data-card-size="30" onclick="selectCardWeight(this, ${product.id}, 30)">ربع ك</button>
          <button type="button" class="card-size-btn active" data-card-size="50" onclick="selectCardWeight(this, ${product.id}, 50)">نصف ك</button>
          <button type="button" class="card-size-btn" data-card-size="100" onclick="selectCardWeight(this, ${product.id}, 100)">1 كجم</button>
        </div>

        <div class="product-bottom">
          <span class="product-price" id="cardPrice_${product.id}">${formatPrice(product.price)}</span>
          <span class="product-category">${product.reviews} ${escapeHtml(t("reviews"))}</span>
        </div>
      </div>
    </article>
  `;
}

window.selectCardWeight = function(btn, prodId, sizeWeight) {
  const card = btn.closest(".product-card");
  if (!card) return;

  card.querySelectorAll(".card-size-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const prod = getProduct(prodId);
  if (!prod) return;

  const priceEl = document.getElementById(`cardPrice_${prodId}`);
  const calculatedPrice = (prod.sizes && prod.sizes[sizeWeight]) 
    ? Number(prod.sizes[sizeWeight]) 
    : getPriceForSize(prod.price, sizeWeight);

  if (priceEl) priceEl.textContent = formatPrice(calculatedPrice);
};

function getFilteredProducts() {
  let filtered = [...products];

  if (currentCategory !== "all") {
    if (currentCategory === "bestseller") {
      filtered = filtered.filter(product => product.bestseller);
    } else if (currentCategory === "wishlist") {
      filtered = filtered.filter(product => wishlist.map(String).includes(String(product.id)));
    } else {
      filtered = filtered.filter(product => product.category === currentCategory);
    }
  }

  if (currentSearch.trim()) {
    const query = currentSearch.toLowerCase().trim();
    filtered = filtered.filter(product =>
      productName(product).toLowerCase().includes(query) ||
      productCategoryLabel(product).toLowerCase().includes(query) ||
      productDescription(product).toLowerCase().includes(query) ||
      productNotes(product).some(note => note.toLowerCase().includes(query))
    );
  }

  switch (currentSort) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      filtered.sort((a, b) => productName(a).localeCompare(productName(b)));
      break;
    default:
      filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return filtered;
}

function renderProducts() {
  const filtered = getFilteredProducts();
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    currentPage = 1;
  }

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  if (productsGrid) {
    productsGrid.innerHTML = paginated.map(productCard).join("");
  }

  if (filtered.length === 0) {
    noProducts?.classList.add("visible");
    if (paginationEl) paginationEl.innerHTML = "";
  } else {
    noProducts?.classList.remove("visible");
    renderPagination(totalPages);
  }
}

function renderPagination(totalPages) {
  if (!paginationEl) return;
  if (totalPages <= 1) {
    paginationEl.innerHTML = "";
    return;
  }

  let buttonsHtml = "";
  for (let i = 1; i <= totalPages; i++) {
    buttonsHtml += `
      <button class="page-num ${i === currentPage ? "active" : ""}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  paginationEl.innerHTML = buttonsHtml;

  paginationEl.querySelectorAll(".page-num").forEach(btn => {
    btn.addEventListener("click", () => {
      currentPage = Number(btn.dataset.page);
      renderProducts();
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* =========================================================
   CART LOGIC (Honey Weights & Special Offers)
   ========================================================= */

function getCartItemDetails(item) {
  if (item.isOffer || String(item.id).startsWith("offer_")) {
    return {
      id: item.id,
      name: item.name || "باقة قطوف البر الخاصة",
      price: Number(item.price || 0),
      image: item.image || "image/S1.png",
      size: item.size || "عرض مناحل خاص",
      categoryLabel: "عرض ترويجي 🍯"
    };
  }

  const prod = getProduct(item.id);
  if (!prod) return null;

  const sizeWeight = Number(item.size || 50);
  const price = (prod.sizes && prod.sizes[sizeWeight])
    ? Number(prod.sizes[sizeWeight])
    : getPriceForSize(prod.price, sizeWeight);

  return {
    id: prod.id,
    name: productName(prod),
    price: price,
    image: prod.image,
    size: getSizeLabel(sizeWeight),
    categoryLabel: productCategoryLabel(prod)
  };
}

function getCartCount() {
  return cart.reduce((total, item) => {
    return getCartItemDetails(item) ? total + Number(item.quantity || 1) : total;
  }, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const details = getCartItemDetails(item);
    return details ? total + (details.price * item.quantity) : total;
  }, 0);
}

function addToCart(id, quantity = 1, size = 50) {
  const product = getProduct(id);
  if (!product) return;

  const existing = cart.find(item => String(item.id) === String(product.id) && Number(item.size || 50) === Number(size));

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      quantity,
      size: Number(size)
    });
  }

  saveCart();
  updateCartUI();
  showToast("تمت الإضافة للسلة 🍯", `${productName(product)} (${getSizeLabel(size)})`);
}

function removeFromCart(id, size) {
  cart = cart.filter(item => !(String(item.id) === String(id) && String(item.size || '') === String(size || '')));
  saveCart();
  updateCartUI();
}

function changeQuantity(id, change, size) {
  const item = cart.find(item => String(item.id) === String(id) && String(item.size || '') === String(size || ''));
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(id, size);
    return;
  }

  saveCart();
  updateCartUI();
}

function updateCartUI() {
  cart = cart.filter(item => getCartItemDetails(item) && item.quantity > 0);
  saveCart();

  if (cartCount) cartCount.textContent = getCartCount();
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
<div class="cart-empty" style="text-align:center; padding:50px 20px;">
        <div style="font-size:48px; margin-bottom:12px;">🍯</div>
        <h3 style="font-size:18px; font-weight:800; color:var(--honey-gold); margin-bottom:6px;">سلتك فارغة حالياً</h3>
        <p style="font-size:12px; color:var(--text-muted); line-height:1.6; margin-bottom:18px;">لم تقم بإضافة أي عبوة عسل بعد. اختر من محاصيلنا الطبيعية ما يناسب صحتك.</p>
        <button class="btn btn-honey" id="continueShopping" style="font-size:12px; padding:8px 20px;">تصفح المحاصيل الآن</button>
      </div>
    `;
    if (cartFooter) cartFooter.style.display = "none";
    return;
  }

  if (cartFooter) cartFooter.style.display = "block";

  cartItems.innerHTML = cart.map(item => {
    const details = getCartItemDetails(item);
    if (!details) return "";

    return `
      <div class="cart-item">
        <img class="cart-item-image" src="${details.image}" alt="${escapeHtml(details.name)}" loading="lazy">
        <div class="cart-item-info">
          <span class="cart-item-category">${escapeHtml(details.categoryLabel)} · <strong style="color:var(--gold);">${details.size}</strong></span>
          <h3 class="cart-item-name">${escapeHtml(details.name)}</h3>
          <span class="cart-item-price">${formatPrice(details.price)}</span>
          <div class="cart-item-controls">
            <button class="cart-qty-btn" data-cart-action="decrease" data-id="${details.id}" data-size="${item.size || ''}">−</button>
            <span class="cart-qty">${item.quantity}</span>
            <button class="cart-qty-btn" data-cart-action="increase" data-id="${details.id}" data-size="${item.size || ''}">+</button>
          </div>
        </div>
        <button class="remove-item" data-cart-action="remove" data-id="${details.id}" data-size="${item.size || ''}">&times;</button>
      </div>
    `;
  }).join("");

  if (cartTotal) cartTotal.textContent = formatPrice(getCartTotal());
}

function openCart() {
  cartDrawer?.classList.add("active", "open");
  overlay?.classList.add("active", "open");
  document.body.classList.add("no-scroll", "cart-open");
  updateCartUI();
}

function closeCart() {
  cartDrawer?.classList.remove("active", "open");
  overlay?.classList.remove("active", "open");
  document.body.classList.remove("no-scroll", "cart-open");
}

/* =========================================================
   FULL HONEY PRODUCT PAGE VIEW
   ========================================================= */

const productFullPage = document.getElementById("productFullPage");
const closeProductPageBtn = document.getElementById("closeProductPage");
const pfpImage = document.getElementById("pfpImage");
const pfpCategory = document.getElementById("pfpCategory");
const pfpName = document.getElementById("pfpName");
const pfpRating = document.getElementById("pfpRating");
const pfpReviews = document.getElementById("pfpReviews");
const pfpDesc = document.getElementById("pfpDesc");
const pfpNotes = document.getElementById("pfpNotes");
const pfpPrice = document.getElementById("pfpPrice");
const pfpQtyVal = document.getElementById("pfpQtyVal");
const pfpAddBtn = document.getElementById("pfpAddBtn");
const pfpRelatedGrid = document.getElementById("pfpRelatedGrid");

let currentPfpProduct = null;
let currentPfpSize = 50; // الافتراضي نصف كيلو
let currentPfpQty = 1;

function updatePfpPriceDisplay() {
  if (!currentPfpProduct || !pfpPrice) return;
  const unitPrice = (currentPfpProduct.sizes && currentPfpProduct.sizes[currentPfpSize]) 
    ? Number(currentPfpProduct.sizes[currentPfpSize]) 
    : getPriceForSize(currentPfpProduct.price, currentPfpSize);
  
  pfpPrice.textContent = formatPrice(unitPrice * currentPfpQty);

  const stocks = currentPfpProduct.stocks || {};
  const sizeStock = stocks[currentPfpSize] !== undefined ? Number(stocks[currentPfpSize]) : 20;

  if (pfpAddBtn) {
    if (sizeStock <= 0) {
      pfpAddBtn.disabled = true;
      pfpAddBtn.style.opacity = "0.5";
      pfpAddBtn.style.cursor = "not-allowed";
      pfpAddBtn.innerHTML = `<span>❌</span><span>نفد وزن (${getSizeLabel(currentPfpSize)})</span>`;
    } else {
      pfpAddBtn.disabled = false;
      pfpAddBtn.style.opacity = "1";
      pfpAddBtn.style.cursor = "pointer";
      pfpAddBtn.innerHTML = `<span>🛒</span><span>أضف إلى السلة (متبقي ${sizeStock} عبوات)</span>`;
    }
  }
}

function openProductFullPage(id) {
  const prod = getProduct(id);
  if (!prod) return;

  const pageEl = document.getElementById("productFullPage");
  if (!pageEl) return;

  currentPfpProduct = prod;
  currentPfpSize = 50;
  currentPfpQty = 1;

  if (pfpImage) { pfpImage.src = prod.image || "image/S1.png"; pfpImage.alt = productName(prod); }
  if (pfpCategory) pfpCategory.textContent = productCategoryLabel(prod);
  if (pfpName) pfpName.textContent = productName(prod);

  const avgRating = Number(prod.rating || 5.0).toFixed(1);
  const totalRev = Number(prod.reviews || 1);
  if (pfpRating) pfpRating.textContent = `★ ${avgRating}`;
  if (pfpReviews) pfpReviews.textContent = `(${totalRev} تقييم)`;

  // تتبع المشاهدين الحقيقيين للعسل
  trackRealTimeViewers(prod.id);
  setupRatingInteraction(prod);
  
  if (pfpDesc) pfpDesc.textContent = productDescription(prod) || "";
  if (pfpQtyVal) pfpQtyVal.textContent = "1";

  document.querySelectorAll("#pfpSizes .pfp-size-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.size === "50");
  });

  if (pfpNotes) {
    const notesList = (currentLang === "ar" ? prod.notesAr : prod.notes) || ["عسل طبيعي بري", "إنزيمات حية", "خام"];
    pfpNotes.innerHTML = notesList.map(n => `<span>${escapeHtml(n)}</span>`).join("");
  }

  updatePfpPriceDisplay();
  renderRelatedProducts(prod);

  pageEl.style.setProperty("display", "block", "important");
  document.body.classList.add("no-scroll");
  pageEl.scrollTop = 0;
}

function closeProductFullPage() {
  if (!productFullPage) return;
  productFullPage.style.display = "none";
  document.body.classList.remove("no-scroll");
  currentPfpProduct = null;
  cleanupRealTimeViewers();
}

closeProductPageBtn?.addEventListener("click", closeProductFullPage);

document.getElementById("pfpSizes")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".pfp-size-btn");
  if (!btn || !currentPfpProduct) return;

  document.querySelectorAll("#pfpSizes .pfp-size-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  currentPfpSize = Number(btn.dataset.size);
  updatePfpPriceDisplay();
});

document.getElementById("pfpQtyMinus")?.addEventListener("click", () => {
  if (currentPfpQty > 1) {
    currentPfpQty--;
    if (pfpQtyVal) pfpQtyVal.textContent = currentPfpQty;
    updatePfpPriceDisplay();
  }
});

document.getElementById("pfpQtyPlus")?.addEventListener("click", () => {
  if (currentPfpQty < 30) {
    currentPfpQty++;
    if (pfpQtyVal) pfpQtyVal.textContent = currentPfpQty;
    updatePfpPriceDisplay();
  }
});

pfpAddBtn?.addEventListener("click", () => {
  if (!currentPfpProduct) return;

  addToCart(currentPfpProduct.id, currentPfpQty, currentPfpSize);

  pfpAddBtn.style.background = "#2ecc71";
  const label = pfpAddBtn.querySelector("span:last-child");
  if (label) label.textContent = "✓ تمت الإضافة لسلتك العسلية!";

  setTimeout(() => {
    pfpAddBtn.style.background = "linear-gradient(135deg, var(--gold), #d97706)";
    if (label) label.textContent = "أضف إلى السلة";
  }, 1800);
});

function renderRelatedProducts(mainProduct) {
  if (!pfpRelatedGrid) return;

  const related = products
    .filter(p => p.category === mainProduct.category && String(p.id) !== String(mainProduct.id))
    .slice(0, 4);

  const fallback = related.length > 0 
    ? related 
    : products.filter(p => String(p.id) !== String(mainProduct.id)).slice(0, 4);

  pfpRelatedGrid.innerHTML = fallback.map(productCard).join("");
}

/* =========================================================
   WISHLIST SYSTEM
   ========================================================= */

function updateWishlistCountUI() {
  const badge = document.getElementById("wishlistCount");
  if (badge) badge.textContent = wishlist.length;
}

function toggleWishlist(id) {
  const strId = String(id);
  const exists = wishlist.some(item => String(item) === strId);

  if (exists) {
    wishlist = wishlist.filter(item => String(item) !== strId);
    showToast(t("wishlistRemovedTitle"), t("wishlistRemovedText"));
  } else {
    wishlist.push(id);
    showToast(t("wishlistAddedTitle"), t("wishlistAddedText"));
  }

  saveWishlist();
  updateWishlistCountUI();
  renderProducts();
}

document.getElementById("wishlistNavBtn")?.addEventListener("click", () => {
  currentCategory = "wishlist";
  currentPage = 1;

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === "wishlist");
  });

  renderProducts();
  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
});

/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */

function showToast(title, text) {
  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toastTitle");
  const toastText = document.getElementById("toastText");
  if (!toast) return;

  if (toastTitle) toastTitle.textContent = title;
  if (toastText) toastText.textContent = text;

  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* =========================================================
   GLOBAL CLICK EVENT DELEGATION
   ========================================================= */

document.addEventListener("click", event => {
  const openPageTrigger = event.target.closest('[data-action="open-full-page"]');
  if (openPageTrigger && !event.target.closest('.wishlist-btn') && !event.target.closest('.card-sizes')) {
    const id = openPageTrigger.dataset.id;
    openProductFullPage(id);
    return;
  }

  const actionElement = event.target.closest("[data-action]");
  if (actionElement) {
    const action = actionElement.dataset.action;
    const id = actionElement.dataset.id;

    if (action === "wishlist") {
      toggleWishlist(id);
      return;
    }
  }

  const cartAction = event.target.closest("[data-cart-action]");
  if (cartAction) {
    const action = cartAction.dataset.cartAction;
    const id = cartAction.dataset.id;
    const size = Number(cartAction.dataset.size || 50);

    if (action === "increase") changeQuantity(id, 1, size);
    if (action === "decrease") changeQuantity(id, -1, size);
    if (action === "remove") {
      removeFromCart(id, size);
      showToast(t("removedTitle"), t("removedText"));
    }
    return;
  }

  if (event.target.id === "continueShopping") {
    closeCart();
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }
});

/* =========================================================
   FILTERS & SEARCH
   ========================================================= */

document.getElementById("categoryTabs")?.addEventListener("click", event => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");
  currentCategory = button.dataset.category;
  currentPage = 1;
  renderProducts();
});

document.getElementById("sortSelect")?.addEventListener("change", event => {
  currentSort = event.target.value;
  currentPage = 1;
  renderProducts();
});

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");

document.getElementById("searchBtn")?.addEventListener("click", () => {
  searchPanel?.classList.toggle("open");
  if (searchPanel?.classList.contains("open")) {
    setTimeout(() => searchInput?.focus(), 250);
  }
});

searchInput?.addEventListener("input", event => {
  currentSearch = event.target.value;
  currentPage = 1;
  renderProducts();
});

document.getElementById("clearSearch")?.addEventListener("click", () => {
  if (searchInput) searchInput.value = "";
  currentSearch = "";
  currentPage = 1;
  renderProducts();
  searchInput?.focus();
});

document.getElementById("cartBtn")?.addEventListener("click", openCart);
document.getElementById("closeCart")?.addEventListener("click", closeCart);
overlay?.addEventListener("click", closeCart);

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

mobileMenuBtn?.addEventListener("click", () => {
  const isOpen = mobileNav?.classList.toggle("open");
  mobileMenuBtn.classList.toggle("active", isOpen);
  mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
});

mobileNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    mobileMenuBtn?.classList.remove("active");
    mobileMenuBtn?.setAttribute("aria-expanded", "false");
  });
});

const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

document.getElementById("langBtn")?.addEventListener("click", toggleLanguage);

document.querySelectorAll(".collection-card").forEach(card => {
  card.addEventListener("click", () => {
    const collection = card.dataset.collection;
    currentCategory = collection;
    currentPage = 1;
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.category === collection);
    });
    renderProducts();
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  });
});

/* =========================================================
   CHECKOUT, LOCATION & WHATSAPP SUBMIT
   ========================================================= */

/* =========================================================
   CHECKOUT, LOCATION & WHATSAPP SUBMIT
   ========================================================= */

const checkoutModal = document.getElementById("checkoutModalBackdrop");
const checkoutClose = document.getElementById("checkoutClose");
const custGovSelect = document.getElementById("custGov");
const summarySubtotal = document.getElementById("summarySubtotal");
const summaryShipping = document.getElementById("summaryShipping");
const summaryTotal = document.getElementById("summaryTotal");
const btnLocation = document.getElementById("btnLocation");
const locationStatus = document.getElementById("locationStatus");
const custLocationMap = document.getElementById("custLocationMap");
const transferDetails = document.getElementById("transferDetails");
const checkoutForm = document.getElementById("checkoutForm");

let GOVERNORATES = [
  { name: "القاهرة", fee: 45 }, { name: "الجيزة", fee: 45 }, { name: "الإسكندرية", fee: 55 },
  { name: "القليوبية", fee: 50 }, { name: "الغربية", fee: 55 }, { name: "المنوفية", fee: 55 },
  { name: "الشرقية", fee: 55 }, { name: "الدقهلية", fee: 55 }, { name: "البحيرة", fee: 60 },
  { name: "كفر الشيخ", fee: 60 }, { name: "دمياط", fee: 60 }, { name: "بورسعيد", fee: 60 },
  { name: "الإسماعيلية", fee: 60 }, { name: "السويس", fee: 60 }, { name: "الفيوم", fee: 65 },
  { name: "بني سويف", fee: 70 }, { name: "المنيا", fee: 75 }, { name: "أسيوط", fee: 80 },
  { name: "سوهاج", fee: 85 }, { name: "قنا", fee: 90 }, { name: "الأقصر", fee: 95 },
  { name: "أسوان", fee: 95 }, { name: "البحر الأحمر", fee: 100 }, { name: "مطروح", fee: 90 },
  { name: "الوادي الجديد", fee: 100 }, { name: "شمال سيناء", fee: 110 }, { name: "جنوب سيناء", fee: 110 }
];

function populateGovSelect() {
  if (!custGovSelect) return;
  const currentVal = custGovSelect.value;
  custGovSelect.innerHTML = '<option value="" disabled selected>اختر المحافظة لمعرفة تكلفة الشحن</option>';
  GOVERNORATES.forEach(gov => {
    const opt = document.createElement("option");
    opt.value = gov.name;
    opt.textContent = `${gov.name} (${gov.fee} جنيه)`;
    if (gov.name === currentVal) opt.selected = true;
    custGovSelect.appendChild(opt);
  });
}
populateGovSelect();

// المزامنة التلقائية لأسعار الشحن المحددة من لوحة المشرف
onSnapshot(doc(db, "settings", "shippingRates"), (docSnap) => {
  if (!docSnap.exists()) return;
  const rates = docSnap.data().rates || {};
  GOVERNORATES = GOVERNORATES.map(g => ({
    name: g.name,
    fee: rates[g.name] !== undefined ? Number(rates[g.name]) : g.fee
  }));
  populateGovSelect();
  updateCheckoutSummary();
});

if (custGovSelect) {
  GOVERNORATES.forEach(gov => {
    const opt = document.createElement("option");
    opt.value = gov.name;
    opt.textContent = `${gov.name} (${gov.fee} جنيه)`;
    custGovSelect.appendChild(opt);
  });
}

function openCheckout() {
  if (cart.length === 0) {
    showToast("سلتك فارغة", "أضف عبوة عسل أولاً لتأكيد طلبك.");
    return;
  }
  closeCart();
  updateCheckoutSummary();
  checkoutModal?.classList.add("active");
  document.body.classList.add("no-scroll");
}

function closeCheckout() {
  checkoutModal?.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

document.getElementById("checkoutBtn")?.addEventListener("click", openCheckout);
checkoutClose?.addEventListener("click", closeCheckout);
checkoutModal?.addEventListener("click", (e) => {
  if (e.target === checkoutModal) closeCheckout();
});

function getShippingFee() {
  const subtotal = getCartTotal();
  if (subtotal >= 1500) return 0;
  const selectedGov = GOVERNORATES.find(g => g.name === custGovSelect?.value);
  return selectedGov ? selectedGov.fee : 0;
}

function updateCheckoutSummary() {
  const subtotal = getCartTotal();
  const shipping = getShippingFee();
  const total = subtotal + shipping;

  if (summarySubtotal) summarySubtotal.textContent = `${subtotal.toLocaleString("ar-EG")} جنيه`;
  if (summaryShipping) {
    if (subtotal >= 1500 && custGovSelect?.value) {
      summaryShipping.textContent = "مجاني (عرض المناحل فوق 1,500 ج)";
    } else {
      summaryShipping.textContent = custGovSelect?.value ? `${shipping.toLocaleString("ar-EG")} جنيه` : "اختر المحافظة";
    }
  }
  if (summaryTotal) summaryTotal.textContent = `${total.toLocaleString("ar-EG")} جنيه`;

  const alertBox = document.getElementById("shippingDepositAlert");
  const depositVal = document.getElementById("depositShippingVal");

  if (alertBox) {
    if (custGovSelect?.value && shipping > 0) {
      alertBox.style.display = "block";
      if (depositVal) depositVal.textContent = `${shipping} جنيه`;
    } else {
      alertBox.style.display = "none";
    }
  }
}

custGovSelect?.addEventListener("change", updateCheckoutSummary);

let selectedPaymentMethod = "cod";
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
  radio.addEventListener("change", (e) => {
    selectedPaymentMethod = e.target.value;
    if (transferDetails) {
      transferDetails.style.display = (selectedPaymentMethod === "instapay" || selectedPaymentMethod === "vodafone_cash") ? "flex" : "none";
    }
  });
});

document.getElementById("copyNumberBtn")?.addEventListener("click", () => {
  navigator.clipboard.writeText("01016118242").then(() => {
    showToast("تم النسخ", "تم نسخ رقم التحويل بنجاح.");
  });
});

btnLocation?.addEventListener("click", () => {
  if (!navigator.geolocation) {
    if (locationStatus) locationStatus.textContent = "المتصفح لا يدعم تحديد الموقع.";
    return;
  }
  if (locationStatus) locationStatus.textContent = "جاري التقاط إحداثيات موقعك للطرود...";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const mapLink = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
      if (custLocationMap) custLocationMap.value = mapLink;
      if (locationStatus) {
        locationStatus.textContent = "✓ تم التقاط موقعك بنجاح وسيرفق مع بوليصة التوصيل.";
        locationStatus.style.color = "#2ecc71";
      }
    },
    () => {
      if (locationStatus) {
        locationStatus.textContent = "تعذر تحديد الموقع تلقائياً. يرجى كتابة العنوان بالتفصيل.";
        locationStatus.style.color = "#e74c3c";
      }
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

function isValidEgyptianPhone(phone) {
  return /^01[0125][0-9]{8}$/.test(phone.trim());
}

checkoutForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const phone2 = document.getElementById("custPhone2").value.trim();
  const gov = custGovSelect.value;
  const address = document.getElementById("custAddress").value.trim();
  const locationMap = custLocationMap.value;
  const paymentMethod = selectedPaymentMethod;

  if (!isValidEgyptianPhone(phone)) {
    alert("رقم الهاتف الأساسي غير صحيح! يجب أن يتكون من 11 رقماً ويبدأ بـ (010 أو 011 أو 012 أو 015).");
    return;
  }

  if (phone2 && !isValidEgyptianPhone(phone2)) {
    alert("رقم الهاتف البديل غير صحيح! يجب أن يتكون من 11 رقماً ويبدأ بـ (010 أو 011 أو 012 أو 015).");
    return;
  }

  if (!gov) {
    alert("يرجى اختيار المحافظة لحساب تكلفة شحن طرد العسل.");
    return;
  }

  const submitBtn = document.getElementById("submitOrderBtn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "جاري تسجيل طلب العسل...";
  }

  const orderItems = cart.map(item => {
    const details = getCartItemDetails(item);
    return {
      id: item.id,
      name: details ? `${details.name} (${details.size})` : "عسل طبيعي",
      price: details ? details.price : 0,
      size: details ? details.size : "نصف كيلو",
      quantity: item.quantity
    };
  });

  const subtotal = getCartTotal();
  const shippingFee = getShippingFee();
  const total = subtotal + shippingFee;

  const orderData = {
    customer: {
      name,
      phone,
      secondaryPhone: phone2 || "غير محدد",
      governorate: gov,
      address,
      googleMapsUrl: locationMap || "لم يحدد موقع GPS"
    },
    items: orderItems,
    pricing: { subtotal, shippingFee, total },
    paymentMethod,
    paymentProof: paymentMethod === "cod" ? "دفع عند الاستلام بعد الفحص" : "سيرسل في شات الواتساب",
    status: "new",
    createdAt: new Date()
  };

  try {
    await addDoc(ordersCol, orderData);

    for (const item of cart) {
      try {
        if (!String(item.id).startsWith("offer_")) {
          const honeyDocRef = doc(db, "perfumes", String(item.id));
          const sizeNum = Number(item.size || 50);
          await updateDoc(honeyDocRef, {
            [`stocks.${sizeNum}`]: increment(-Number(item.quantity || 1)),
            stock: increment(-Number(item.quantity || 1))
          });
        }
      } catch (stockErr) {
        console.warn("Stock update skipped for honey item:", item.id);
      }
    }

    const paymentMethodsNames = {
      cod: "الدفع عند الاستلام (COD)",
      instapay: "انستا باي (InstaPay)",
      vodafone_cash: "فودافون كاش (Vodafone Cash)"
    };

    let receiptMessageText = "غير مطلوب (الدفع عند الاستلام وفحص العسل)";
    if (paymentMethod !== "cod") {
      receiptMessageText = "📸 سأقوم بإرفاق صورة إيصال التحويل (Screenshot) هنا في الشات الآن لتأكيد الشحن فوراً.";
    }

    const itemsSummary = orderItems
      .map(item => `• ${item.name} × ${item.quantity} (${(item.price * item.quantity).toLocaleString("ar-EG")} ج)`)
      .join("\n");

    const shippingNoteWa = shippingFee > 0 
      ? `🚚 *مصاريف الشحن (مطلوب تحويلها فودافون كاش لتأكيد طرد العسل):* ${shippingFee} جنيه\n💵 *المبلغ المتبقي عند الاستلام والفحص:* ${subtotal.toLocaleString("ar-EG")} جنيه`
      : `🚚 *مصاريف الشحن:* مجاني بالكامل 🔥\n💵 *المبلغ المطلوب عند الاستلام والفحص:* ${total.toLocaleString("ar-EG")} جنيه`;

    const waMessage = `*طلب جديد من مناحل قطوف البر — QUTOOF AL-BERR* 🍯
--------------------------------
👤 *اسم العميل:* ${name}
📱 *الهاتف الأساسي:* ${phone}
📞 *الهاتف البديل:* ${phone2 || "لا يوجد"}
📍 *المحافظة:* ${gov}
🏠 *العنوان بالتفصيل:* ${address}
🗺️ *موقع التسليم (خرائط جوجل):* ${locationMap ? locationMap : "لم يُحدد"}
--------------------------------
🍯 *تفاصيل عبوات العسل والمشتقات:*
${itemsSummary}
--------------------------------
💰 *قيمة المنتجات:* ${subtotal.toLocaleString("ar-EG")} جنيه
${shippingNoteWa}

💳 *طريقة الدفع:* ${paymentMethodsNames[paymentMethod]}
🧾 *إيصال التحويل:* 
${receiptMessageText}
--------------------------------
🌿 خاضع للضمان الذهبي للاسترجاع وفحص النقاء`;

    cart = [];
    saveCart();
    updateCartUI();
    closeCheckout();
    checkoutForm.reset();
    if (locationStatus) locationStatus.textContent = "";

    showToast("تم تأكيد طلب العسل بنجاح! 🍯", "جاري توجيهك إلى واتساب المنحل...");

    const waUrl = `https://wa.me/201016118242?text=${encodeURIComponent(waMessage)}`;
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1000);

  } catch (err) {
    console.error("Firebase Error: ", err);
    alert("حدث خطأ أثناء تأكيد الطلب، تأكد من اتصال الإنترنت وحاول مجدداً.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "تأكيد طلب العسل الآن";
    }
  }
});

/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeProductFullPage();
    mobileNav?.classList.remove("open");
    mobileMenuBtn?.classList.remove("active");
    mobileMenuBtn?.setAttribute("aria-expanded", "false");
  }
});

/* =========================================================
   FIRESTORE REALTIME LISTENER (Products)
   ========================================================= */

onSnapshot(perfumesCol, (snapshot) => {
  const firebaseProducts = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    firebaseProducts.push({
      id: docSnap.id,
      name: data.name,
      nameAr: data.name,
      category: data.category || "men",
      categoryLabel: data.category === 'men' ? 'Sidr Honey' : data.category === 'women' ? 'Floral' : 'Blends',
      categoryLabelAr: data.category === 'men' ? 'سدر جبلي' : data.category === 'women' ? 'موالح وزهور' : 'غذاء ملكات وعكبر',
      price: Number(data.price),
      sizes: data.sizes || null,
      stocks: data.stocks || null,
      rating: Number(data.rating || 5.0),
      reviews: Number(data.reviews || 1),
      description: data.desc || "",
      descriptionAr: data.desc || "",
      notes: ["طبيعي 100%", "مفحوص معملياً", "خام"],
      notesAr: ["طبيعي 100%", "مفحوص معملياً", "خام"],
      badge: "طبيعي 100%",
      badgeAr: "طبيعي 100%",
      image: data.image || "image/S1.png",
      featured: true,
      bestseller: false
    });
  });

  if (firebaseProducts.length > 0) {
    products.length = 0;
    products.push(...firebaseProducts);
  }

  applyLanguage();
});

/* =========================================================
   ADMIN SECRET AUTHENTICATION
   ========================================================= */

const ADMIN_PASS = "01016118242";
let logoClicks = 0;
let clickTimer;

function checkAdminAuth() {
  const pass = prompt("أدخل كلمة سر لوحة تحكم مناحل قطوف البر:");
  if (pass === ADMIN_PASS) {
    window.location.href = "admin.html";
  } else if (pass !== null) {
    alert("كلمة السر غير صحيحة!");
  }
}

function handleSecretLogoClicks(e) {
  logoClicks++;
  clearTimeout(clickTimer);
  if (logoClicks === 5) {
    e.preventDefault();
    logoClicks = 0;
    checkAdminAuth();
  } else {
    clickTimer = setTimeout(() => { logoClicks = 0; }, 2000);
  }
}

document.querySelector(".logo")?.addEventListener("click", handleSecretLogoClicks);
document.querySelector(".closed-logo")?.addEventListener("click", handleSecretLogoClicks);
document.querySelector(".logo-aura-wrap")?.addEventListener("click", handleSecretLogoClicks);

document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.ctrlKey && e.key.toLowerCase() === "a") {
    e.preventDefault();
    checkAdminAuth();
  }
});

/* =========================================================
   HEADER & SCROLL INTERSECTION
   ========================================================= */

const homeSec = document.getElementById("home");
const tickerWrap = document.querySelector(".ticker-wrap");
const navbarEl = document.getElementById("navbar");
const waBtn = document.querySelector(".whatsapp-btn");

if (homeSec) {
  const homeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const isHome = entry.isIntersecting;
      tickerWrap?.classList.toggle("hidden", !isHome);
      navbarEl?.classList.toggle("top-zero", !isHome);
      waBtn?.classList.toggle("hidden", !isHome);
    });
  }, { threshold: 0.15 });

  homeObserver.observe(homeSec);
}

/* =========================================================
   STORE CLOSED & ADMIN THEME LISTENER (تحكم المشرف في ألوان وحالة المتجر)
   ========================================================= */

const THEME_PALETTES = {
  "amber-honey": {
    bg: "#140d07",
    card: "#1f140a",
    text: "#fef3c7",
    gold: "#f59e0b",
    line: "rgba(245, 158, 11, 0.22)"
  },
  "golden-nectar": {
    bg: "#1a1007",
    card: "#26180c",
    text: "#fff8db",
    gold: "#fbbf24",
    line: "rgba(251, 191, 36, 0.25)"
  },
  "mountain-sidr": {
    bg: "#0c0703",
    card: "#180e06",
    text: "#f5e6d3",
    gold: "#d97706",
    line: "rgba(217, 119, 6, 0.25)"
  },
  "royal-propolis": {
    bg: "#140d06",
    card: "#221509",
    text: "#fffbeb",
    gold: "#eab308",
    line: "rgba(234, 179, 8, 0.25)"
  },
  "black-seed": {
    bg: "#070707",
    card: "#141414",
    text: "#f4f4f5",
    gold: "#f59e0b",
    line: "rgba(245, 158, 11, 0.2)"
  },
  "wild-forest": {
    bg: "#0e1109",
    card: "#181d0f",
    text: "#f2f5ea",
    gold: "#d4af37",
    line: "rgba(212, 175, 55, 0.25)"
  },
  "white-pure": {
    bg: "#ffffff",
    card: "#fdfbf7",
    text: "#2d180c",
    gold: "#b45309",
    line: "rgba(140, 83, 45, 0.15)"
  }
};

onSnapshot(doc(db, "settings", "storeConfig"), (docSnap) => {
  if (!docSnap.exists()) return;
  const cfg = docSnap.data();

  // 1. التحكم في فتح وإغلاق شاشة الصيانة وموسم الجني
  const closedScreen = document.getElementById("storeClosedScreen");
  if (closedScreen) {
    if (cfg.isClosed === true) {
      closedScreen.style.setProperty("display", "flex", "important");
      document.body.classList.add("no-scroll");
    } else {
      closedScreen.style.setProperty("display", "none", "important");
      document.body.classList.remove("no-scroll");
    }
  }

  // 2. تطبيق الثيم والألوان التي يحددها المشرف فوراً لجميع الزوار
  const selectedTheme = cfg.theme || "white-pure";
  const palette = THEME_PALETTES[selectedTheme] || THEME_PALETTES["amber-honey"];

  if (palette) {
    const root = document.documentElement;
    root.style.setProperty("--bg-main", palette.bg);
    root.style.setProperty("--bg-card", palette.card);
    root.style.setProperty("--text-main", palette.text);
    root.style.setProperty("--honey-gold", palette.gold);
    root.style.setProperty("--border-line", palette.line);

    // للتوافق مع المتغيرات العامة
    root.style.setProperty("--ivory", palette.bg);
    root.style.setProperty("--cream", palette.card);
    root.style.setProperty("--text", palette.text);
    root.style.setProperty("--gold", palette.gold);
    root.style.setProperty("--line", palette.line);
    document.body.style.background = palette.bg;
    document.body.style.color = palette.text;
  }
});

/* =========================================================
   3D HONEY OFFERS CAROUSEL & LIVE COUNTDOWN
   ========================================================= */

const offersSection = document.getElementById("offersShowcaseSection");
const offersTrack = document.getElementById("offersTrack");
const offersDots = document.getElementById("offersDots");
const offerPrevBtn = document.getElementById("offerPrevBtn");
const offerNextBtn = document.getElementById("offerNextBtn");
const offersWrapper = document.getElementById("offersCarouselWrapper");

let currentOfferIdx = 0;
let offersList = [];
let offerAutoSlideTimer = null;
let countdownInterval = null;

onSnapshot(offersCol, (snapshot) => {
  const firebaseOffers = [];
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (data.active !== false) {
      firebaseOffers.push({ id: docSnap.id, ...data });
    }
  });

  offersList = firebaseOffers;

  if (offersList.length === 0) {
    if (offersSection) offersSection.style.display = "none";
    clearInterval(offerAutoSlideTimer);
    clearInterval(countdownInterval);
    return;
  }

  if (offersSection) {
    offersSection.style.setProperty("display", "block", "important");
  }

  renderOffersCarousel();
  startOfferAutoSlide();
  startLiveCountdowns();
});

function renderOffersCarousel() {
  if (!offersTrack) return;

  offersTrack.innerHTML = offersList.map(o => {
    const isExpired = o.expiryDate && new Date(o.expiryDate) <= new Date();

    return `
      <div class="honey-offer-card">
        <!-- جانب صورة العرض الطبيعية -->
        <div class="honey-offer-img-box">
          <span class="honey-offer-badge">🍯 ${escapeHtml(o.tag || "باقة توفير خاصة")}</span>
          <img src="${o.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'}" alt="${escapeHtml(o.title)}">
        </div>

        <!-- جانب تفاصيل العرض والأسعار -->
        <div class="honey-offer-details">
          <div class="honey-offer-header">
            <span class="offer-producer-tag">🐝 من خلايا قطوف البر مباشرة</span>
            <h3 class="honey-offer-title">${escapeHtml(o.title)}</h3>
            <p class="honey-offer-desc">${escapeHtml(o.desc || "أعسال خام معتّقة مصفاة على البارد ومضمونة معملياً بالضمان الذهبي.")}</p>
          </div>

          <!-- عداد الوقت التنازلي الكلاسيكي -->
          ${o.expiryDate ? `
            <div class="honey-timer-wrap" id="timerBox_${o.id}">
              <span class="honey-timer-title">⏳ متبقي على انتهاء موسم العرض:</span>
              <div class="honey-timer-boxes" id="timerDigits_${o.id}">
                <div class="timer-unit"><strong id="days_${o.id}">00</strong><span>يوم</span></div>
                <span class="timer-sep">:</span>
                <div class="timer-unit"><strong id="hours_${o.id}">00</strong><span>ساعة</span></div>
                <span class="timer-sep">:</span>
                <div class="timer-unit"><strong id="mins_${o.id}">00</strong><span>دقيقة</span></div>
                <span class="timer-sep">:</span>
                <div class="timer-unit"><strong id="secs_${o.id}">00</strong><span>ثانية</span></div>
              </div>
            </div>
          ` : ''}

          <!-- الأسعار وزر الحجز -->
          <div class="honey-offer-action-bar">
            <div class="honey-pricing">
              <span class="current-price">${Number(o.price || 0).toLocaleString("ar-EG")} جنيه</span>
              ${o.oldPrice ? `<span class="prev-price">${Number(o.oldPrice).toLocaleString("ar-EG")} ج</span>` : ''}
            </div>

            ${isExpired ? `
              <div class="offer-expired-badge">انتهت باقات هذا العرض</div>
            ` : `
              <button type="button" class="honey-claim-btn" onclick="claimSpecialOffer('${o.id}')">
                <span>اطلب باقة العسل الآن</span>
                <span>🍯</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join("");

  if (offersDots) {
    offersDots.innerHTML = offersList.map((_, i) => `
      <span class="offer-dot ${i === 0 ? 'active' : ''}" onclick="goToOffer(${i})"></span>
    `).join("");
  }

  goToOffer(0);
}

function startLiveCountdowns() {
  clearInterval(countdownInterval);
  
  function updateTimers() {
    const now = new Date().getTime();

    offersList.forEach(o => {
      if (!o.expiryDate) return;

      const target = new Date(o.expiryDate).getTime();
      const diff = target - now;

      const dEl = document.getElementById(`days_${o.id}`);
      const hEl = document.getElementById(`hours_${o.id}`);
      const mEl = document.getElementById(`mins_${o.id}`);
      const sEl = document.getElementById(`secs_${o.id}`);

      if (diff <= 0) {
        const box = document.getElementById(`timerBox_${o.id}`);
        if (box) box.innerHTML = `<span class="offer-expired-badge">انتهى وقت العرض</span>`;
      } else if (dEl && hEl && mEl && sEl) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        dEl.textContent = `${days}ي`;
        hEl.textContent = `${String(hours).padStart(2, '0')}س`;
        mEl.textContent = `${String(mins).padStart(2, '0')}د`;
        sEl.textContent = `${String(secs).padStart(2, '0')}ث`;
      }
    });
  }

  updateTimers();
  countdownInterval = setInterval(updateTimers, 1000);
}

window.goToOffer = function(index) {
  if (offersList.length === 0) return;
  currentOfferIdx = (index + offersList.length) % offersList.length;
  
  if (offersTrack) {
    offersTrack.style.transform = `translateX(${currentOfferIdx * 100}%)`;
  }

  document.querySelectorAll(".offer-dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentOfferIdx);
  });
};

function startOfferAutoSlide() {
  clearInterval(offerAutoSlideTimer);
  if (offersList.length <= 1) return;

  offerAutoSlideTimer = setInterval(() => {
    goToOffer(currentOfferIdx + 1);
  }, 3500);
}

offersWrapper?.addEventListener("mouseenter", () => clearInterval(offerAutoSlideTimer));
offersWrapper?.addEventListener("mouseleave", () => startOfferAutoSlide());

offerPrevBtn?.addEventListener("click", () => {
  goToOffer(currentOfferIdx - 1);
  startOfferAutoSlide();
});

offerNextBtn?.addEventListener("click", () => {
  goToOffer(currentOfferIdx + 1);
  startOfferAutoSlide();
});

window.claimSpecialOffer = function(offerId) {
  const offer = offersList.find(o => String(o.id) === String(offerId));
  if (!offer) return;

  if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
    alert("عذراً، هذا العرض انتهى وقته المحدد!");
    return;
  }

  const cartItemId = `offer_${offer.id}`;
  const existing = cart.find(i => String(i.id) === cartItemId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: cartItemId,
      isOffer: true,
      name: `🔥 ${offer.title}`,
      price: Number(offer.price),
      image: offer.image || "image/S1.png",
      quantity: 1,
      size: "باقة عسل خاصة"
    });
  }

  saveCart();
  updateCartUI();
  showToast("تم حجز العرض! 🍯", `${offer.title} أُضيف إلى سلتك.`);
  openCart();
};

/* =========================================================
   REAL-TIME VIEWERS PRESENCE (Honey Edition)
   ========================================================= */

let viewerSessionId = sessionStorage.getItem("qutoof_viewer_session");
if (!viewerSessionId) {
  viewerSessionId = "usr_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
  sessionStorage.setItem("qutoof_viewer_session", viewerSessionId);
}

let activeViewerUnsubscribe = null;
let activeHeartbeatTimer = null;
let activeHoneyViewerDoc = null;

async function trackRealTimeViewers(honeyId) {
  cleanupRealTimeViewers();

  const label = document.getElementById("liveViewersCount");
  if (!label) return;

  const viewersColRef = collection(db, "perfumes", String(honeyId), "viewers");
  activeHoneyViewerDoc = doc(viewersColRef, viewerSessionId);

  try {
    await setDoc(activeHoneyViewerDoc, {
      lastSeen: Date.now()
    });
  } catch (err) {
    console.warn("Viewers tracking skipped:", err);
  }

  activeHeartbeatTimer = setInterval(async () => {
    try {
      if (activeHoneyViewerDoc) {
        await setDoc(activeHoneyViewerDoc, { lastSeen: Date.now() }, { merge: true });
      }
    } catch (e) {}
  }, 15000);

  activeViewerUnsubscribe = onSnapshot(viewersColRef, (snapshot) => {
    const now = Date.now();
    let activeCount = 0;

    snapshot.forEach((snap) => {
      const data = snap.data();
      if (data.lastSeen && (now - data.lastSeen) < 35000) {
        activeCount++;
      }
    });

    const finalCount = Math.max(1, activeCount);

    if (finalCount === 1) {
      label.textContent = "أنت تتصفح هذا العسل الآن 👁️";
    } else {
      label.textContent = `يشاهد هذا العسل الآن ${finalCount} أشخاص في نفس اللحظة 👁️`;
    }
  });
}

function cleanupRealTimeViewers() {
  if (activeHeartbeatTimer) {
    clearInterval(activeHeartbeatTimer);
    activeHeartbeatTimer = null;
  }
  if (activeViewerUnsubscribe) {
    activeViewerUnsubscribe();
    activeViewerUnsubscribe = null;
  }
  if (activeHoneyViewerDoc) {
    deleteDoc(activeHoneyViewerDoc).catch(() => {});
    activeHoneyViewerDoc = null;
  }
}

window.addEventListener("beforeunload", () => {
  cleanupRealTimeViewers();
});

/* =========================================================
   INTERACTIVE PROPORTIONAL RATING SYSTEM
   ========================================================= */

function setupRatingInteraction(prod) {
  const userRateBox = document.querySelector(".user-rate-action");
  const starsContainer = document.getElementById("starRatingWidget");
  const statusMsg = document.getElementById("rateStatusMsg");
  const pfpRatingEl = document.getElementById("pfpRating");
  const pfpRevEl = document.getElementById("pfpReviews");

  if (!starsContainer || !userRateBox) return;

  const storageKey = `rated_honey_${prod.id}`;
  const alreadyRated = localStorage.getItem(storageKey);

  if (alreadyRated) {
    userRateBox.style.display = "none";
    return;
  } else {
    userRateBox.style.display = "inline-flex";
    if (statusMsg) statusMsg.textContent = "";
  }

  starsContainer.querySelectorAll(".star-btn").forEach(star => {
    star.onclick = async () => {
      if (localStorage.getItem(storageKey)) return;

      const userScore = Number(star.dataset.star);
      localStorage.setItem(storageKey, userScore);

      const oldAvg = Number(prod.rating || 5.0);
      const oldReviews = Number(prod.reviews || 0);

      const newReviews = oldReviews + 1;
      const newAvg = Number((((oldAvg * oldReviews) + userScore) / newReviews).toFixed(1));

      prod.rating = newAvg;
      prod.reviews = newReviews;

      if (pfpRatingEl) pfpRatingEl.textContent = `★ ${newAvg.toFixed(1)}`;
      if (pfpRevEl) pfpRevEl.textContent = `(${newReviews} تقييم)`;

      userRateBox.style.display = "none";
      showToast("شكراً لتقييمك! ⭐", `تم تسجيل تقييمك لجودة العسل (${userScore} نجوم) بنجاح.`);

      try {
        const honeyDocRef = doc(db, "perfumes", String(prod.id));
        await updateDoc(honeyDocRef, {
          rating: newAvg,
          reviews: newReviews
        });
      } catch (err) {
        console.warn("Firestore rating sync skipped:", err);
      }
    };
  });
}

document.getElementById("copyDepositVodafoneBtn")?.addEventListener("click", () => {
  const num = document.getElementById("depositVodafoneNum")?.textContent || "01016118242";
  navigator.clipboard.writeText(num).then(() => {
    showToast("تم النسخ بنجاح 📋", `تم نسخ رقم فودافون كاش: ${num}`);
  });
});

/* =========================================================
   CUSTOMER REVIEWS & WHATSAPP FEEDBACK GALLERY
   ========================================================= */

let allCustomerReviews = [];

onSnapshot(reviewsCol, (snapshot) => {
  allCustomerReviews = [];
  snapshot.forEach(docSnap => allCustomerReviews.push({ id: docSnap.id, ...docSnap.data() }));

  allCustomerReviews.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  renderHomeReviews();
  renderFullReviewsGallery();
});

function renderHomeReviews() {
  const grid = document.getElementById("homeReviewsGrid");
  const moreBtnWrap = document.getElementById("moreReviewsBtnWrap");
  if (!grid) return;

  if (allCustomerReviews.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--muted); font-size:13px; padding:30px 0;">سيتم نشر آراء وتجارب عملاء المناحل قريباً.</div>`;
    if (moreBtnWrap) moreBtnWrap.style.display = "none";
    return;
  }

  const top4 = allCustomerReviews.slice(0, 4);

  grid.innerHTML = top4.map(r => `
    <div class="review-screen-card" onclick="openReviewLightbox('${r.image}')">
      <img src="${r.image}" class="review-screen-img" alt="${r.author || 'تجربة عميل'}">
      <div class="review-screen-caption">${r.author || 'رأي عميل عبر واتساب 💬'}</div>
    </div>
  `).join("");

  if (moreBtnWrap) {
    moreBtnWrap.style.display = allCustomerReviews.length > 4 ? "block" : "none";
  }
}

function renderFullReviewsGallery() {
  const gallery = document.getElementById("fullReviewsGallery");
  if (!gallery) return;

  gallery.innerHTML = allCustomerReviews.map(r => `
    <div class="review-screen-card" onclick="openReviewLightbox('${r.image}')">
      <img src="${r.image}" class="review-screen-img" style="height:350px;" alt="${r.author || 'تجربة عميل'}">
      <div class="review-screen-caption">${r.author || 'رأي عميل عبر واتساب 💬'}</div>
    </div>
  `).join("");
}

const allReviewsPage = document.getElementById("allReviewsPage");
document.getElementById("openAllReviewsBtn")?.addEventListener("click", () => {
  if (allReviewsPage) {
    allReviewsPage.style.display = "block";
    document.body.classList.add("no-scroll");
  }
});

document.getElementById("closeAllReviewsBtn")?.addEventListener("click", () => {
  if (allReviewsPage) {
    allReviewsPage.style.display = "none";
    document.body.classList.remove("no-scroll");
  }
});

window.openReviewLightbox = function(src) {
  const modal = document.getElementById("reviewLightbox");
  const img = document.getElementById("lightboxImg");
  if (modal && img) {
    img.src = src;
    modal.classList.add("open");
  }
};
