# Agas Collection — Sulam Store

Toko pakaian premium Indonesia. Backend Express + Node.js, frontend static HTML/CSS/JS, database Google Sheets, autentikasi Google OAuth.

---

## Alur Kerja (PENTING untuk agent baru)

```
Edit kode di Replit  →  Push ke GitHub  →  Railway auto-deploy
```

- **Replit** = tempat edit kode saja, bukan tempat jalankan app
- **Railway** = tempat app beneran berjalan (production)
- **GitHub** = `https://github.com/vmosa001-crypto/BelajarWeb28-07-2026` (branch: main)
- Semua env vars sudah diset di Railway — TIDAK perlu diisi di Replit

Setelah selesai edit, push ke GitHub:
```bash
git add .
git commit -m "deskripsi perubahan"
git push origin main
```
Railway akan otomatis redeploy setelah push.

---

## Cara Jalankan Lokal (opsional, untuk testing)

```bash
npm install
# Buat .env dari .env.example lalu isi nilainya
node server.js   # port 5000
```

Tanpa env vars, server tetap jalan tapi pakai **mock data** (tidak menyentuh Google Sheets).

---

## Stack

| Lapisan | Teknologi |
|---------|-----------|
| Server  | Node.js + Express 4, port `$PORT` (default 5000) |
| Auth    | Google OAuth 2.0 via `passport-google-oauth20` |
| Session | `cookie-session` — tersimpan di browser, tahan 30 hari |
| Database | Google Sheets via `googleapis` (`lib/sheets.js`) |
| Upload  | `multer` — simpan ke `public/uploads/` |
| Frontend | Static HTML/CSS/JS di `public/` |
| Deploy  | Railway (Nixpacks builder, `node server.js`) |

---

## Struktur File

```
server.js          ← Entry point utama — semua route & middleware
lib/sheets.js      ← Semua operasi Google Sheets (+ mock data fallback)
public/
  index.html       ← Halaman utama (katalog produk)
  products.html    ← Halaman daftar produk + filter
  product.html     ← Detail produk
  cart.html        ← Keranjang belanja
  checkout.html    ← Form checkout
  login.html       ← Halaman login Google (satu-satunya halaman publik)
  admin.html       ← Dashboard admin (kelola produk & pesanan)
  css/style.css    ← Styling utama
  js/main.js       ← Logic frontend
  uploads/         ← Gambar produk yang diupload
railway.json       ← Konfigurasi deploy Railway
nixpacks.toml      ← Build config Railway
.env.example       ← Template env vars (nilai asli ada di Railway)
```

---

## Env Vars (diset di Railway, bukan di Replit)

| Key | Keterangan |
|-----|-----------|
| `PORT` | Otomatis diset Railway |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → OAuth 2.0 Client Secret |
| `GOOGLE_CALLBACK_URL` | `https://<domain-railway>/auth/google/callback` |
| `GOOGLE_SPREADSHEET_ID` | ID spreadsheet Google Sheets (dari URL) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Isi JSON service account (1 baris) |
| `SESSION_SECRET` | String rahasia panjang untuk enkripsi cookie |

---

## API Endpoints

| Method | Path | Auth | Keterangan |
|--------|------|------|-----------|
| GET | `/api/status` | — | Cek koneksi Google Sheets |
| GET | `/api/products` | — | Daftar produk (query: `category`, `search`, `featured`) |
| GET | `/api/products/:id` | — | Detail produk |
| POST | `/api/products` | ✅ | Tambah produk |
| PUT | `/api/products/:id` | ✅ | Update produk |
| GET | `/api/orders` | ✅ | Daftar pesanan |
| POST | `/api/orders` | — | Buat pesanan baru (checkout pelanggan) |
| PUT | `/api/orders/:id` | ✅ | Update status pesanan |
| POST | `/api/upload` | ✅ | Upload gambar produk |
| GET | `/auth/google` | — | Mulai login Google |
| GET | `/auth/google/callback` | — | Callback OAuth Google |
| GET | `/auth/logout` | — | Logout |
| GET | `/auth/me` | — | Info user yang sedang login |

**Auth ✅** = wajib login Google. Tanpa login → redirect ke `/login.html`.

---

## Google Sheets — Struktur

Sheet `Produk` (kolom A–K):
```
A: id | B: name | C: category | D: description | E: price
F: stock | G: featured | H: sizes | I: colors | J: image | K: createdAt
```

Sheet `Pesanan` (kolom A–J):
```
A: id | B: name | C: email | D: phone | E: address
F: city | G: items | H: total | I: status | J: date | (K: notes)
```

---

## Logika Auth

- **Semua halaman wajib login** kecuali: `/login.html`, `/css/*`, `/auth/*`, favicon
- Login via Google OAuth → session cookie 30 hari di browser
- Setelah login → redirect ke halaman yang dituju sebelumnya (`req.session.returnTo`)
- `requireAuth` middleware dipakai di route POST/PUT (edit data)

---

## Mock Data Fallback

Jika `GOOGLE_SPREADSHEET_ID` / `GOOGLE_SERVICE_ACCOUNT_JSON` tidak diset, `lib/sheets.js` otomatis pakai data dummy in-memory. Berguna untuk testing lokal tanpa koneksi Sheets.

---

## User Preferences

- Deploy selalu ke Railway, bukan ke Replit
- Semua env vars diset di Railway dashboard
- Edit kode di Replit → push ke GitHub → Railway auto-deploy
- Kode minimal sesuai prinsip Ponytail di `AGENTS.md`
