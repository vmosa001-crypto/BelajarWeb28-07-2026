const { google } = require('googleapis');

// Mock data — dipakai saat Google Sheets belum dikonfigurasi
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

let MOCK_ORDERS = [
  {id:'ORD-2849',name:'Siti Nurbaya',    email:'siti@email.com',  phone:'081234567890',address:'Jl. Gajah Mada No.12', city:'Mataram',      items:'Kemeja Batik Modern',total:525000,status:'Pending',  date:'2025-01-15',notes:''},
  {id:'ORD-2848',name:'Budi Santoso',    email:'budi@email.com',  phone:'082345678901',address:'Jl. Pejanggik No.8',  city:'Mataram',      items:'Dress Tenun Ikat',   total:695000,status:'Diproses',date:'2025-01-14',notes:''},
  {id:'ORD-2847',name:'Dewi Rahayu',     email:'dewi@email.com',  phone:'083456789012',address:'Jl. Langko No.5',     city:'Praya',         items:'Jaket Bomber Klasik',total:580000,status:'Selesai', date:'2025-01-13',notes:''},
  {id:'ORD-2846',name:'Rizki Pratama',   email:'rizki@email.com', phone:'084456789012',address:'Jl. Sudirman No.22',  city:'Selong',        items:'Blouse Linen Kasual',total:365000,status:'Pending',  date:'2025-01-12',notes:''},
  {id:'ORD-2845',name:'Maya Kartika',    email:'maya@email.com',  phone:'085567890123',address:'Jl. Pemuda No.44',    city:'Gerung',        items:'Rok Midi Pleated',   total:420000,status:'Selesai', date:'2025-01-12',notes:''},
  {id:'ORD-2844',name:'Ahmad Fauzi',     email:'ahmad@email.com', phone:'084567890123',address:'Jl. Raya Selong No.3',city:'Selong',        items:'Celana Kulot Premium',total:420000,status:'Selesai',date:'2025-01-11',notes:''},
  {id:'ORD-2843',name:'Rina Wijaya',     email:'rina@email.com',  phone:'085678901234',address:'Jl. Airlangga No.17', city:'Mataram',      items:'Blouse Linen Kasual',total:365000,status:'Selesai', date:'2025-01-10',notes:''},
  {id:'ORD-2842',name:'Hendra Gunawan',  email:'hendra@email.com',phone:'086789012345',address:'Jl. Sukarno No.21',   city:'Gerung',        items:'Kemeja Batik Modern',total:485000,status:'Pending', date:'2025-01-10',notes:''},
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

// Tambah produk baru — FiTUR BARU
async function addProduct(data) {
  if (!isSheetsConfigured()) {
    const newId = String(Math.max(...MOCK_PRODUCTS.map(p => parseInt(p.id, 10)).filter(n => !isNaN(n)), 0) + 1);
    const product = {
      id: newId,
      name: data.name || '',
      category: data.category || 'Atasan',
      description: data.description || '',
      price: Number(data.price) || 0,
      stock: Number(data.stock) || 0,
      featured: !!data.featured,
      sizes: Array.isArray(data.sizes) ? data.sizes : (data.sizes ? data.sizes.split(',') : []),
      colors: Array.isArray(data.colors) ? data.colors : [],
      image: data.image || ''
    };
    MOCK_PRODUCTS.push(product);
    return product;
  }

  // Google Sheets: tambah baris baru ke sheet Produk
  const sheets = getSheetsClient();
  const newId = `PROD-${Date.now()}`;
  const sizes = Array.isArray(data.sizes) ? data.sizes.join(',') : (data.sizes || '');
  const colors = Array.isArray(data.colors) ? data.colors.join(',') : (data.colors || '');
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: 'Produk!A:K',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        newId, data.name || '', data.category || 'Atasan', data.description || '',
        Number(data.price) || 0, Number(data.stock) || 0,
        data.featured ? 'TRUE' : 'FALSE',
        sizes, colors, data.image || '', ''
      ]]
    }
  });
  return await getProduct(newId);
}

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
    if (updates.name        !== undefined) MOCK_PRODUCTS[idx].name        = updates.name;
    if (updates.category    !== undefined) MOCK_PRODUCTS[idx].category    = updates.category;
    if (updates.description !== undefined) MOCK_PRODUCTS[idx].description = updates.description;
    if (updates.price       !== undefined) MOCK_PRODUCTS[idx].price       = Number(updates.price);
    if (updates.stock       !== undefined) MOCK_PRODUCTS[idx].stock       = Number(updates.stock);
    if (updates.image       !== undefined) MOCK_PRODUCTS[idx].image       = updates.image;
    if (updates.featured    !== undefined) MOCK_PRODUCTS[idx].featured    = !!updates.featured;
    if (updates.sizes       !== undefined) MOCK_PRODUCTS[idx].sizes       = Array.isArray(updates.sizes) ? updates.sizes : [];
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
  const sheetRow = rowIdx + 2;

  const data = [];
  if (updates.name        !== undefined) data.push({ range: `Produk!B${sheetRow}`, values: [[updates.name]] });
  if (updates.category    !== undefined) data.push({ range: `Produk!C${sheetRow}`, values: [[updates.category]] });
  if (updates.description !== undefined) data.push({ range: `Produk!D${sheetRow}`, values: [[updates.description]] });
  if (updates.price       !== undefined) data.push({ range: `Produk!E${sheetRow}`, values: [[Number(updates.price)]] });
  if (updates.stock       !== undefined) data.push({ range: `Produk!F${sheetRow}`, values: [[Number(updates.stock)]] });
  if (updates.featured    !== undefined) data.push({ range: `Produk!G${sheetRow}`, values: [[updates.featured ? 'TRUE' : 'FALSE']] });
  if (updates.sizes       !== undefined) data.push({ range: `Produk!H${sheetRow}`, values: [[Array.isArray(updates.sizes) ? updates.sizes.join(',') : '']] });
  if (updates.image       !== undefined) data.push({ range: `Produk!J${sheetRow}`, values: [[updates.image]] });

  if (data.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      requestBody: { valueInputOption: 'USER_ENTERED', data }
    });
  }
  return await getProduct(id);
}

// ✅ PERBAIKAN BUG: updateOrder sekarang di-export!
module.exports = { getProducts, getProduct, addProduct, addOrder, getOrders, updateProduct, updateOrder, isSheetsConfigured };
