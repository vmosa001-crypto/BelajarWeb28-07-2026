// ── User (cached) ──────────────────────────────────────
let _userPromise = null;
export function getUser() {
  if (!_userPromise) {
    _userPromise = fetch('/auth/me')
      .then(r => r.ok ? r.json() : null)
      .catch(() => null);
  }
  return _userPromise;
}

// ── Cart key (per-user, scoped ke email Google) ────────
let _cartKey = 'cart';

async function resolveCartKey() {
  const user = await getUser();
  if (!user?.email) return;
  const newKey = `cart_${user.email}`;
  if (newKey === _cartKey) return;

  // Migrasi cart guest → cart user (jika user cart belum ada)
  const guest = localStorage.getItem(_cartKey);
  if (guest && !localStorage.getItem(newKey)) {
    localStorage.setItem(newKey, guest);
  }
  if (_cartKey === 'cart') localStorage.removeItem('cart');
  _cartKey = newKey;

  // Re-render cart badge setelah key berubah
  updateCartCount();
}

// ── Cart ──────────────────────────────────────────────
export const Cart = {
  get()           { return JSON.parse(localStorage.getItem(_cartKey) || '[]'); },
  save(items)     { localStorage.setItem(_cartKey, JSON.stringify(items)); updateCartCount(); },
  count()         { return this.get().reduce((n, i) => n + i.qty, 0); },

  add(product, size, color, qty = 1) {
    const items = this.get();
    const key = `${product.id}-${size}-${color}`;
    const existing = items.find(i => i.key === key);
    if (existing) existing.qty += qty;
    else items.push({ key, id: product.id, name: product.name, price: product.price, image: product.image, size, color, qty });
    this.save(items);
  },

  remove(key)         { this.save(this.get().filter(i => i.key !== key)); },
  updateQty(key, qty) {
    if (qty < 1) return this.remove(key);
    const items = this.get();
    const item = items.find(i => i.key === key);
    if (item) { item.qty = qty; this.save(items); }
  },
  total() { return this.get().reduce((sum, i) => sum + i.price * i.qty, 0); },
  clear() { localStorage.removeItem(_cartKey); updateCartCount(); }
};

// ── Helpers ───────────────────────────────────────────
export const fmt = n => 'Rp ' + Number(n).toLocaleString('id-ID');

export function toast(msg, type = '') {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.className = `toast ${type}`;
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => el.classList.remove('show'), 2800);
}

export async function apiFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Cart count badge ──────────────────────────────────
function updateCartCount() {
  document.querySelectorAll('.cart-count').forEach(el => {
    const c = Cart.count();
    el.textContent = c;
    el.style.display = c ? 'inline' : 'none';
  });
}

// ── Inject user avatar + Dashboard link ke nav ────────
async function initUserNav() {
  const user = await getUser();
  if (!user) return;

  // Tambah link Dashboard ke <nav> jika belum ada
  const nav = document.querySelector('header nav');
  if (nav && !nav.querySelector('[href="/dashboard.html"]')) {
    const link = document.createElement('a');
    link.href = '/dashboard.html';
    link.textContent = 'Dashboard';
    if (window.location.pathname === '/dashboard.html') link.classList.add('active');
    nav.appendChild(link);
  }

  // Tambah avatar user ke .header-actions
  const actions = document.querySelector('.header-actions');
  if (actions && !actions.querySelector('.user-avatar-btn')) {
    const btn = document.createElement('a');
    btn.href = '/dashboard.html';
    btn.className = 'user-avatar-btn';
    btn.title = user.name;
    btn.innerHTML = user.photo
      ? `<img src="${user.photo}" alt="${user.name}" class="user-avatar-img">`
      : `<span class="user-avatar-initials">${user.name.charAt(0).toUpperCase()}</span>`;
    actions.insertBefore(btn, actions.firstChild);
  }
}

// ── Active nav link ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '/' && href === '/index.html')) {
      a.classList.add('active');
    }
  });

  // Inisialisasi user cart key & nav (paralel)
  resolveCartKey();
  initUserNav();
  updateCartCount();
});
