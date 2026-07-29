require('dotenv').config();
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const multer  = require('multer');

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
  limits: { fileSize: 5 * 1024 * 1024 }, // maks 5 MB
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype);
    cb(ok ? null : new Error('Hanya file gambar yang diperbolehkan'), ok);
  }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Status database ──────────────────────────────────────────────────────────
app.get('/api/status', (_req, res) => {
  res.json({ sheetsConnected: isSheetsConfigured() });
});

// ── Upload gambar → kembalikan URL ───────────────────────────────────────────
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Tidak ada file yang diupload' });
  const url = `/uploads/${req.file.filename}`;
  console.log('Image uploaded:', url);
  res.json({ url });
});

// ── Daftar produk (dengan filter kategori & search) ──────────────────────────
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

// ── Detail satu produk ───────────────────────────────────────────────────────
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: 'Gagal mengambil produk' });
  }
});

// ── Tambah produk baru ───────────────────────────────────────────────────────
app.post('/api/products', async (req, res) => {
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

// ── Update produk (nama, kategori, harga, stok, gambar, dll) ─────────────────
app.put('/api/products/:id', async (req, res) => {
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

// ── Daftar pesanan ───────────────────────────────────────────────────────────
app.get('/api/orders', async (_req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal mengambil data pesanan' });
  }
});

// ── Update pesanan (status + catatan) ────────────────────────────────────────
app.put('/api/orders/:id', async (req, res) => {
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

// ── Buat pesanan ─────────────────────────────────────────────────────────────
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
});
