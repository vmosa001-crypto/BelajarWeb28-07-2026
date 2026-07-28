require('dotenv').config();
const express = require('express');
const path = require('path');
const { getProducts, getProduct, addOrder, isSheetsConfigured } = require('./lib/sheets');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Status database
app.get('/api/status', (req, res) => {
  res.json({ sheetsConnected: isSheetsConfigured() });
});

// Daftar produk (dengan filter kategori & search)
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let products = await getProducts();
    if (category) products = products.filter(p => p.category === category);
    if (search) products = products.filter(p =>
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

// Detail satu produk
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: 'Gagal mengambil produk' });
  }
});

// Buat pesanan
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
