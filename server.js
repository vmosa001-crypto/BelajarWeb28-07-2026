require('dotenv').config();
const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const multer   = require('multer');
const session  = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

const {
  getProducts, getProduct, addProduct,
  addOrder, getOrders,
  updateProduct, updateOrder,
  isSheetsConfigured
} = require('./lib/sheets');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Pastikan folder uploads ada ──────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── Multer: simpan file di public/uploads ────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype);
    cb(ok ? null : new Error('Hanya file gambar yang diperbolehkan'), ok);
  }
});

// ── Trust proxy (Railway / Heroku / Nginx — wajib agar secure cookie bekerja di HTTPS) ──
app.set('trust proxy', 1);

// ── Middleware dasar ─────────────────────────────────────────────────────────
app.use(express.json());

// ── Session ──────────────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'agas-secret-fallback',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: 'auto',   // 'auto' = secure jika HTTPS, tidak secure jika HTTP (dev lokal)
    sameSite: 'lax',  // aman untuk OAuth redirect flow
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
  }
}));

// ── Passport ─────────────────────────────────────────────────────────────────
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_CALLBACK_URL
}, (_accessToken, _refreshToken, profile, done) => {
  // Izinkan semua akun Google yang berhasil login
  const user = {
    id:     profile.id,
    name:   profile.displayName,
    email:  profile.emails?.[0]?.value || '',
    photo:  profile.photos?.[0]?.value || ''
  };
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());

// ── Middleware: wajib login ──────────────────────────────────────────────────
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.accepts('html')) return res.redirect('/login.html');
  res.status(401).json({ error: 'Unauthorized' });
}

// ── Auth routes ──────────────────────────────────────────────────────────────
// Mulai OAuth Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback setelah login Google
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html?error=oauth_failed' }),
  (req, res) => {
    // Redirect ke halaman yang dituju sebelum login, atau homepage
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  }
);

// Logout
app.get('/auth/logout', (req, res) => {
  req.logout(err => {
    if (err) console.error('Logout error:', err);
    res.redirect('/login.html');
  });
});

// Info user yang sedang login (untuk client-side check)
app.get('/auth/me', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not authenticated' });
  res.json(req.user);
});

// ── Middleware global: semua halaman wajib login ─────────────────────────────
// Pengecualian: login.html, /auth/*, favicon, dan CSS (untuk render login page)
app.use((req, res, next) => {
  const path_ = req.path;

  // Izinkan tanpa login
  const publicPaths    = ['/login.html', '/favicon.svg', '/favicon.ico'];
  const publicPrefixes = ['/auth/', '/css/'];

  if (publicPaths.includes(path_))                       return next();
  if (publicPrefixes.some(p => path_.startsWith(p)))    return next();

  // Semua yang lain wajib login
  if (!req.isAuthenticated()) {
    if (path_.startsWith('/api/'))
      return res.status(401).json({ error: 'Silakan login terlebih dahulu' });
    // Simpan halaman tujuan agar bisa redirect balik setelah login
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login.html');
  }
  next();
});

// ── Static files (sudah dilindungi middleware di atas) ────────────────────────
app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html' }));

// ── Status database ──────────────────────────────────────────────────────────
app.get('/api/status', (_req, res) => {
  res.json({ sheetsConnected: isSheetsConfigured() });
});

// ── Upload gambar (protected) ─────────────────────────────────────────────────
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Tidak ada file yang diupload' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

// ── Daftar produk (public) ───────────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let products = await getProducts();
    if (category)          products = products.filter(p => p.category === category);
    if (search)            products = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    if (featured === 'true') products = products.filter(p => p.featured);
    res.json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal mengambil data produk' });
  }
});

// ── Detail produk (public) ───────────────────────────────────────────────────
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: 'Gagal mengambil produk' });
  }
});

// ── Tambah produk (protected) ─────────────────────────────────────────────────
app.post('/api/products', requireAuth, async (req, res) => {
  try {
    const { name, category, description, price, stock, featured, sizes, image } = req.body;
    if (!name)  return res.status(400).json({ error: 'Nama produk tidak boleh kosong' });
    if (!price) return res.status(400).json({ error: 'Harga produk tidak boleh kosong' });
    const product = await addProduct({ name, category, description, price, stock, featured, sizes, image });
    res.status(201).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal menambahkan produk' });
  }
});

// ── Update produk (protected) ─────────────────────────────────────────────────
app.put('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const { name, category, description, price, stock, image, featured, sizes } = req.body;
    const updated = await updateProduct(req.params.id, { name, category, description, price, stock, image, featured, sizes });
    if (!updated) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal memperbarui produk' });
  }
});

// ── Daftar pesanan (protected) ────────────────────────────────────────────────
app.get('/api/orders', requireAuth, async (_req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal mengambil data pesanan' });
  }
});

// ── Update pesanan (protected) ────────────────────────────────────────────────
app.put('/api/orders/:id', requireAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updated = await updateOrder(req.params.id, { status, notes });
    if (!updated) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal memperbarui pesanan' });
  }
});

// ── Buat pesanan (public — pelanggan bisa checkout) ───────────────────────────
app.post('/api/orders', async (req, res) => {
  try {
    const { name, email, phone, address, city, items, total } = req.body;
    if (!name || !email || !phone || !address || !city || !items?.length || !total)
      return res.status(400).json({ error: 'Data pesanan tidak lengkap' });
    const order = await addOrder(req.body);
    res.json({ success: true, orderId: order.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal membuat pesanan' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SULAM Store berjalan di port ${PORT}`);
  console.log(`Google Sheets: ${isSheetsConfigured() ? 'Terhubung' : 'Belum dikonfigurasi (pakai mock data)'}`);
  console.log(`Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Dikonfigurasi' : 'BELUM dikonfigurasi'}`);
});
