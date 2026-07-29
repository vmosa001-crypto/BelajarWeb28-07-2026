# SULAM Store — Agas Collection

Toko pakaian premium Indonesia. Express + Node.js backend, static HTML/CSS/JS frontend, Google Sheets sebagai database produk & pesanan.

## How to run

```
npm install
node server.js   # or: npm start
```

Runs on port 5000. Requires secrets: `GOOGLE_SPREADSHEET_ID` and `GOOGLE_SERVICE_ACCOUNT_JSON`. Falls back to mock data if Sheets is not configured.

## Stack

- **Backend**: Express (`server.js`), Google Sheets via `googleapis` (`lib/sheets.js`)
- **Frontend**: Static files in `public/` (index, products, product, cart, checkout)
- **Database**: Google Sheets — sheet `Produk!A2:K` for products, `Pesanan!A:J` for orders

## Ponytail coding rules

`AGENTS.md` at the project root injects the Ponytail ladder: YAGNI → reuse → stdlib → native → installed dep → one line → minimum that works.

## User preferences

- Write minimal code — always check the Ponytail ladder in `AGENTS.md` before writing anything.
- No boilerplate, no unused abstractions, no new dependencies unless necessary.
