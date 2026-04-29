
// ─────────────────────────────────────────────
// DATA — Ganti dengan fetch() ke API teman lo
// ─────────────────────────────────────────────
const PRODUCTS_DATA = [
  { id: 1, name: "PEACE OF MIND", category: "fresh", notes: "Mirabelle · Bergamot · Lemon · Orange", price: 350000, badge: null , color: "#d4e4f0" },
  { id: 2, name: "VELVET BLOOM", category: "floral", notes: "Soft · Sweet · Irresistible", price: 350000, originalPrice: 780000, badge: "sale", color: "#e8d8e8" },
  { id: 3, name: "TOBACCO ROYALE", category: "woody", notes: "Tobacco Leaf", price: 350000, badge: "new", color: "#e8dfc8" },
  { id: 4, name: "GREEN ENCHANTMENT", category: "fresh", notes: "Green Tea", price: 350000, badge: null, color: "#d4e4f0" },
  { id: 5, name: "SCENT OF AMBITION", category: "oriental", notes: "Oud · Rose · Patchouli", price: 350000, badge: "new", color: "#eef0d8" },
  { id: 6, name: "Jasmin Blanc", category: "floral", notes: "Jasmine · Lily · Peach", price: 455000, badge: null, color: "#f0ece0" },
  { id: 7, name: "Sandalwood Ritual", category: "woody", notes: "Sandalwood · Tonka · Musk", price: 580000, badge: null, color: "#e8e0d4" },
  { id: 8, name: "Citrus Eden", category: "fresh", notes: "Orange · Grapefruit · Basil", price: 395000, badge: null, color: "#eef0d8" },
];

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let cart = [];
let activeFilter = "semua";

// ─────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────
function bottleSVG(color) {
  return `<svg viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="32" width="20" height="12" rx="2" fill="#c8aa7e"/>
    <rect x="46" y="22" width="28" height="14" rx="3" fill="#b89a6a"/>
    <rect x="50" y="17" width="20" height="10" rx="2" fill="#9a8055"/>
    <path d="M32 52 Q28 62 26 82 L26 148 Q26 162 60 162 Q94 162 94 148 L94 82 Q92 62 88 52 Z" fill="${color}"/>
    <path d="M32 52 Q28 62 26 82 L26 148 Q26 162 60 162 Q94 162 94 148 L94 82 Q92 62 88 52 Z" fill="rgba(184,154,106,0.12)"/>
    <path d="M32 68 Q28 78 26 98 L26 148 Q26 160 60 160 Q94 160 94 148 L94 98 Q92 78 88 68 Z" fill="rgba(184,154,106,0.22)"/>
    <rect x="38" y="95" width="44" height="52" rx="1" fill="rgba(255,255,255,0.8)"/>
    <line x1="42" y1="107" x2="78" y2="107" stroke="#b89a6a" stroke-width="0.4"/>
    <line x1="42" y1="138" x2="78" y2="138" stroke="#b89a6a" stroke-width="0.4"/>
    <text x="60" y="120" text-anchor="middle" font-family="serif" font-size="7" fill="#1a1612" font-style="italic">AURORE</text>
    <text x="60" y="130" text-anchor="middle" font-family="sans-serif" font-size="4" fill="#6b5f52" letter-spacing="1.5">PARFUM</text>
    <path d="M40 60 Q37 85 37 125" stroke="rgba(255,255,255,0.55)" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`;
}

function renderProducts(products) {
  const grid = document.getElementById("productsGrid");
  if (!products.length) {
    grid.innerHTML = `<p style="color:var(--mid);padding:2rem;grid-column:1/-1;text-align:center;">Tidak ada produk ditemukan.</p>`;
    return;
  }
  grid.innerHTML = products.map(p => `
    <div class="product-card" data-category="${p.category}" data-id="${p.id}">
      <div class="product-img" style="background:${p.color};">
        ${p.badge === "new" ? '<span class="badge-new">New</span>' : ''}
        ${p.badge === "sale" ? '<span class="badge-sale">Sale</span>' : ''}
        ${bottleSVG(p.color)}
      </div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-notes">${p.notes}</p>
        <div class="product-footer">
          <div class="product-price">
            ${p.originalPrice ? `<span class="original">Rp ${p.originalPrice.toLocaleString("id-ID")}</span>` : ""}
            Rp ${p.price.toLocaleString("id-ID")}
          </div>
          <button class="add-to-cart" onclick="addToCart(${p.id})" title="Tambah ke keranjang">+</button>
        </div>
      </div>
    </div>
  `).join("");
}

function filterProducts(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const filtered = cat === "semua" ? PRODUCTS_DATA : PRODUCTS_DATA.filter(p => p.category === cat);
  renderProducts(filtered);
}

// ─────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────
function addToCart(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(`${product.name} ditambahkan ke keranjang`);
}

function updateQty(productId, delta) {
  const item = cart.find(c => c.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = "Rp " + total.toLocaleString("id-ID");

  const itemsEl = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");

  if (!cart.length) {
    emptyEl.style.display = "flex";
    const existing = itemsEl.querySelectorAll(".cart-item");
    existing.forEach(e => e.remove());
    return;
  }
  emptyEl.style.display = "none";

  const existing = itemsEl.querySelectorAll(".cart-item");
  existing.forEach(e => e.remove());

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-img">${bottleSVG(item.color)}</div>
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Rp ${item.price.toLocaleString("id-ID")}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price">Rp ${(item.price * item.qty).toLocaleString("id-ID")}</div>
    `;
    itemsEl.appendChild(div);
  });
}

function toggleCart() {
  const overlay = document.getElementById("cartOverlay");
  const sidebar = document.getElementById("cartSidebar");
  overlay.classList.toggle("open");
  sidebar.classList.toggle("open");
}

function handleCheckout() {
  if (!cart.length) { showToast("Keranjang kosong!"); return; }
  /*
   * TODO (untuk teman backend):
   * POST /api/orders
   * Body: { items: cart.map(i => ({ product_id: i.id, qty: i.qty, price: i.price })) }
   * Response: { order_id, payment_url }
   */
  showToast("Menghubungkan ke pembayaran... (backend belum terhubung)");
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
renderProducts(PRODUCTS_DATA);
updateCartUI();

/*
 * ──────────────────────────────────────────────────
 * CATATAN UNTUK BACKEND (teman lo):
 *
 * 1. Ganti PRODUCTS_DATA dengan fetch ke GET /api/products
 *    Contoh:
 *      async function loadProducts() {
 *        const res = await fetch("/api/products");
 *        const data = await res.json();
 *        renderProducts(data);
 *      }
 *      loadProducts();
 *
 * 2. handleCheckout() → POST /api/orders dengan data cart
 *
 * 3. Semua fungsi render, cart, dan filter tidak perlu diubah sama sekali —
 *    cukup ganti data source di atas.
 * ──────────────────────────────────────────────────
 */