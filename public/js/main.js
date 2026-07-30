// ── Cart (localStorage) ──────────────────────────────
export const Cart = {
  get() { return JSON.parse(localStorage.getItem('cart') || '[]'); },
  save(items) { localStorage.setItem('cart', JSON.stringify(items)); updateCartCount(); },
  count() { return this.get().reduce((n, i) => n + i.qty, 0); },

  add(product, size, color, qty = 1) {
    const items = this.get();
    const key = `${product.id}-${size}-${color}`;
    const existing = items.find(i => i.key === key);
    if (existing) existing.qty += qty;
    else items.push({ key, id: product.id, name: product.name, price: product.price, image: product.image, size, color, qty });
    this.save(items);
  },

  remove(key) { this.save(this.get().filter(i => i.key !== key)); },

  updateQty(key, qty) {
    if (qty < 1) return this.remove(key);
    const items = this.get();
    const item = items.find(i => i.key === key);
    if (item) { item.qty = qty; this.save(items); }
  },

  total() { return this.get().reduce((sum, i) => sum + i.price * i.qty, 0); },
  clear() { localStorage.removeItem('cart'); updateCartCount(); }
};

// ── Helpers ──────────────────────────────────────────
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
    el.textContent = Cart.count();
    el.style.display = Cart.count() ? 'inline' : 'none';
  });
}
document.addEventListener('DOMContentLoaded', updateCartCount);

// ── Active nav link ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === path || (path === '/' && a.getAttribute('href') === '/index.html')) {
      a.classList.add('active');
    }
  });
});
