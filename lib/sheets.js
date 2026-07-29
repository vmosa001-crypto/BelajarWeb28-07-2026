const { google } = require('googleapis');

// Mock data — dipakai saat Google Sheets belum dikonfigurasi
// Mutable so in-memory edits via updateProduct() persist for the session
let MOCK_PRODUCTS = [
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

// Mock pesanan — dipakai saat Google Sheets belum dikonfigurasi
let MOCK_ORDERS = [
  {id:'ORD-2847',name:'Siti Nurhaliza', email:'siti@email.com',  phone:'081234567890',address:'Jl. Pejanggik No.12',city:'Mataram',      items:'Kemeja Batik Modern',total:485000, status:'Selesai', date:'2025-01-12',notes:''},
  {id:'ORD-2846',name:'Budi Santoso',   email:'budi@email.com',  phone:'082345678901',address:'Jl. Hasanuddin No.5',city:'Lombok Tengah',items:'Dress Tenun Ikat',   total:1250000,status:'Pending',  date:'2025-01-12',notes:''},
  {id:'ORD-2845',name:'Dewi Lestari',   email:'dewi@email.com',  phone:'083456789012',address:'Jl. Pariwisata No.8', city:'Praya',         items:'Jaket Bomber Klasik',total:890000,status:'Diproses',date:'2025-01-11',notes:''},
  {id:'ORD-2844',name:'Ahmad Fauzi',    email:'ahmad@email.com', phone:'084567890123',address:'Jl. Raya Selong No.3',city:'Selong',        items:'Celana Kulot Premium',total:420000,status:'Selesai',date:'2025-01-11',notes:''},
  {id:'ORD-2843',name:'Rina Wijaya',    email:'rina@email.com',  phone:'085678901234',address:'Jl. Airlangga No.17', city:'Mataram',      items:'Blouse Linen Kasual',total:365000,status:'Selesai', date:'2025-01-10',notes:''},
  {id:'ORD-2842',name:'Hendra Gunawan', email:'hendra@email.com',phone:'086789012345',address:'Jl. Sukarno No.21',   city:'Gerung',        items:'Kemeja Batik Modern',total:485000,status:'Pending', date:'2025-01-10',notes:''},
];

// Tambah pesanan ke Google Sheets
async function addOrder(data) {
  const orderId = `ORD-${Date.now()}`;
  const orderData = { ...data, id: orderId, date: new Date().toISOString(), status: 'Pending', notes: '' };

  if (isSheetsConfigured()) {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Pesanan!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          orderId, orderData.date, data.name, data.email, data.phone,
          data.address, data.city, JSON.stringify(data.items),
          data.total, 'Pending', ''
        ]]
      }
    });
  } else {
    MOCK_ORDERS.unshift(orderData);
  }

  console.log('New order:', orderId, data.name, 'Rp', data.total);
  return orderData;
}

// Ambil semua pesanan
async function getOrders() {
  if (!isSheetsConfigured()) return MOCK_ORDERS;
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: 'Pesanan!A2:K'
  });
  return (res.data.values || []).map(row => ({
    id: row[0], date: row[1], name: row[2], email: row[3], phone: row[4],
    address: row[5], city: row[6], items: row[7], total: Number(row[8]),
    status: row[9] || 'Pending', notes: row[10] || ''
  }));
}

// Update pesanan (status + catatan)
async function updateOrder(id, updates) {
  if (!isSheetsConfigured()) {
    const idx = MOCK_ORDERS.findIndex(o => o.id === id);
    if (idx === -1) return null;
    if (updates.status !== undefined) MOCK_ORDERS[idx].status = updates.status;
    if (updates.notes  !== undefined) MOCK_ORDERS[idx].notes  = updates.notes;
    return MOCK_ORDERS[idx];
  }

  // Google Sheets: cari baris berdasarkan ID (kolom A)
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: 'Pesanan!A2:A'
  });
  const rows = res.data.values || [];
  const rowIdx = rows.findIndex(r => r[0] === id);
  if (rowIdx === -1) return null;
  const sheetRow = rowIdx + 2;

  const data = [];
  if (updates.status !== undefined) data.push({ range: `Pesanan!J${sheetRow}`, values: [[updates.status]] });
  if (updates.notes  !== undefined) data.push({ range: `Pesanan!K${sheetRow}`, values: [[updates.notes]] });

  if (data.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      requestBody: { valueInputOption: 'USER_ENTERED', data }
    });
  }
  const allOrders = await getOrders();
  return allOrders.find(o => o.id === id) || null;
}

// Update produk (nama, kategori, stok, gambar)
async function updateProduct(id, updates) {
  if (!isSheetsConfigured()) {
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx === -1) return null;
    if (updates.name     !== undefined) MOCK_PRODUCTS[idx].name     = updates.name;
    if (updates.category !== undefined) MOCK_PRODUCTS[idx].category = updates.category;
    if (updates.stock    !== undefined) MOCK_PRODUCTS[idx].stock    = Number(updates.stock);
    if (updates.image    !== undefined) MOCK_PRODUCTS[idx].image    = updates.image;
    return MOCK_PRODUCTS[idx];
  }

  // Google Sheets: cari baris berdasarkan ID (kolom A)
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: 'Produk!A2:A'
  });
  const rows = res.data.values || [];
  const rowIdx = rows.findIndex(r => r[0] === id);
  if (rowIdx === -1) return null;
  const sheetRow = rowIdx + 2; // 1-indexed, +1 untuk header

  const data = [];
  if (updates.name     !== undefined) data.push({ range: `Produk!B${sheetRow}`, values: [[updates.name]] });
  if (updates.category !== undefined) data.push({ range: `Produk!C${sheetRow}`, values: [[updates.category]] });
  if (updates.stock    !== undefined) data.push({ range: `Produk!F${sheetRow}`, values: [[Number(updates.stock)]] });
  if (updates.image    !== undefined) data.push({ range: `Produk!J${sheetRow}`, values: [[updates.image]] });

  if (data.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      requestBody: { valueInputOption: 'USER_ENTERED', data }
    });
  }
  return await getProduct(id);
}

module.exports = { getProducts, getProduct, addOrder, getOrders, updateProduct, isSheetsConfigured };
