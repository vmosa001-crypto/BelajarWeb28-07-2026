// ── Theme ─────────────────────────────────────────────
const THEME_KEY = 'store-theme';

export function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  _syncThemeIcon();
}

function _syncThemeIcon() {
  const btn = document.querySelector('.hdr-theme-btn');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.title = isDark ? 'Mode Terang' : 'Mode Gelap';
  btn.innerHTML = isDark
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
}

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

// ── Cart key per-user ─────────────────────────────────
let _cartKey = 'cart';
let _cartReadyResolve;
export const cartReady = new Promise(res => { _cartReadyResolve = res; });

async function resolveCartKey() {
  const user = await getUser();
  if (!user?.email) {
    _cartReadyResolve(); // guest — pakai key 'cart' langsung
    return;
  }
  const newKey = `cart_${user.email}`;
  if (newKey !== _cartKey) {
    // Migrasi: pindahkan cart guest ke cart user (jika belum ada)
    const guest = localStorage.getItem(_cartKey);
    if (guest && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, guest);
    }
    if (_cartKey === 'cart') localStorage.removeItem('cart');
    _cartKey = newKey;
  }
  _cartReadyResolve(); // baru resolve setelah key benar
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
    el.style.display = c ? 'flex' : 'none';
  });
}

// ── Inject theme toggle + user avatar ke header ───────
async function initUserNav() {
  const actions = document.querySelector('.header-actions');
  if (!actions) return;

  // 1. Tambah theme toggle button
  if (!actions.querySelector('.hdr-theme-btn')) {
    const btn = document.createElement('button');
    btn.className = 'hdr-icon-btn hdr-theme-btn';
    btn.onclick = toggleTheme;
    actions.insertBefore(btn, actions.firstChild);
    _syncThemeIcon();
  }

  // 2. Tambah avatar user jika login
  const user = await getUser();
  if (!user) return;

  const nav = document.querySelector('header nav');
  if (nav && !nav.querySelector('[href="/dashboard.html"]')) {
    const link = document.createElement('a');
    link.href = '/dashboard.html';
    link.textContent = 'Dashboard';
    if (window.location.pathname === '/dashboard.html') link.classList.add('active');
    nav.appendChild(link);
  }

  if (!actions.querySelector('.user-avatar-btn')) {
    const btn = document.createElement('a');
    btn.href = '/dashboard.html';
    btn.className = 'user-avatar-btn';
    btn.title = user.name;
    btn.innerHTML = user.photo
      ? `<img src="${user.photo}" alt="${user.name}" class="user-avatar-img">`
      : `<span class="user-avatar-initials">${user.name.charAt(0).toUpperCase()}</span>`;
    // Insert sebelum cart icon
    const cart = actions.querySelector('.hdr-cart');
    actions.insertBefore(btn, cart || null);
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

  resolveCartKey();   // async — sets _cartKey lalu resolve cartReady
  initUserNav();
  updateCartCount();
});
