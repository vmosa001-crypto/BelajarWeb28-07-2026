const { google } = require('googleapis');

// Mock data — dipakai saat Google Sheets belum dikonfigurasi
const MOCK_PRODUCTS = [
  {
    id: '1', name: 'Kemeja Batik Modern', category: 'Atasan',
    description: 'Kemeja batik motif kontemporer dengan bahan katun premium. Nyaman dipakai seharian, cocok untuk casual maupun semi-formal.',
    price: 350000, stock: 25, featured: true,
    sizes: ['S','M','L','XL'], colors: ['Biru Navy','Hitam','Cokelat'],
    image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600&q=80'
  },
  {
    id: '2', name: 'Dress Tenun Ikat', category: 'Dress',
    description: 'Dress elegan dari kain tenun ikat NTT asli. Setiap helai menceritakan keindahan budaya Indonesia.',
    price: 520000, stock: 15, featured: true,
    sizes: ['S','M','L'], colors: ['Merah Marun','Biru Indigo'],
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80'
  },
  {
    id: '3', name: 'Celana Kulot Premium', category: 'Bawahan',
    description: 'Celana kulot potongan lebar dengan bahan linen berkualitas. Ringan, sejuk, dan stylish untuk berbagai kesempatan.',
    price: 280000, stock: 30, featured: false,
    sizes: ['S','M','L','XL'], colors: ['Krem','Abu-abu','Hitam'],
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f54?w=600&q=80'
  },
  {
    id: '4', name: 'Blouse Linen Kasual', category: 'Atasan',
    description: 'Blouse linen ringan dengan detail kancing kayu alami. Simpel namun memancarkan keanggunan tersendiri.',
    price: 210000, stock: 40, featured: false,
    sizes: ['S','M','L','XL','XXL'], colors: ['Putih','Sage Green','Dusty Pink'],
    image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80'
  },
  {
    id: '5', name: 'Jaket Bomber Klasik', category: 'Outer',
    description: 'Jaket bomber dengan material taslan anti-air. Desain timeless yang cocok dipadukan dengan berbagai outfit.',
    price: 450000, stock: 20, featured: true,
    sizes: ['S','M','L','XL'], colors: ['Olive','Hitam','Camel'],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'
  },
  {
    id: '6', name: 'Rok Midi Pleated', category: 'Bawahan',
    description: 'Rok midi dengan lipit halus dari bahan satin matte. Jatuh cantik di badan, sempurna untuk acara spesial.',
    price: 295000, stock: 18, featured: false,
    sizes: ['S','M','L'], colors: ['Champagne','Hitam','Dusty Rose'],
    image: 'https://images.unsplash.com/photo-1583496661160-fb5218db5a8a?w=600&q=80'
  }
];

// Cek apakah Google Sheets sudah dikonfigurasi
function isSheetsConfigured() {
  return !!(process.env.GOOGLE_SPREADSHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
}

// Buat Google Sheets client dari service account
function getSheetsClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth });
}

// Ambil semua produk
async function getProducts() {
  if (!isSheetsConfigured()) return MOCK_PRODUCTS;

  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: 'Produk!A2:K'
  });

  return (res.data.values || []).map(row => ({
    id: row[0], name: row[1], category: row[2], description: row[3],
    price: Number(row[4]), stock: Number(row[5]), featured: row[6] === 'TRUE',
    sizes: row[7] ? row[7].split(',') : [],
    colors: row[8] ? row[8].split(',') : [],
    image: row[9] || ''
  }));
}

// Ambil satu produk by ID
async function getProduct(id) {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

// Tambah pesanan ke Google Sheets
async function addOrder(data) {
  const orderId = `ORD-${Date.now()}`;
  const orderData = { ...data, id: orderId, date: new Date().toISOString(), status: 'Pending' };

  if (isSheetsConfigured()) {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Pesanan!A:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          orderId, orderData.date, data.name, data.email, data.phone,
          data.address, data.city, JSON.stringify(data.items),
          data.total, 'Pending'
        ]]
      }
    });
  }

  console.log('New order:', orderId, data.name, 'Rp', data.total);
  return orderData;
}

module.exports = { getProducts, getProduct, addOrder, isSheetsConfigured };
