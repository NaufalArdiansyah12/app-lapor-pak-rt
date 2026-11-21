# AGENTS.md — Lapor Pak RT

**Mode saat ini: Website Statis Multi-Page (HTML5 + Tailwind CSS CDN + JS Vanilla).**
Sangat ringan, 0 build-step, siap langsung untuk **GitHub Pages** (root folder).

## Arsitektur

- `index.html`, `login.html`, `register.html`, `reports.html`, `announcements.html`, `warga.html`, `categories.html` — Halaman individual di root repo.
- `assets/js/db.js` (`window.RT`) — Database lokal di `localStorage` (`lapor_rt_data_v1`, sesi di `lapor_rt_session_v1`). Menyimpan seed data pengguna, kategori, aduan, tanggapan, dan pengumuman.
- `assets/js/layout.js` (`window.Layout`) — Shell layout (sidebar responsif, sticky topbar profil, proteksi halaman/role). Dipanggil di tiap halaman lewat `window.Layout.init({ officerOnly?: boolean })`.
- `assets/js/ui.js` (`window.UI`) — Helper toast, modal popup, status/priority badge, input class strings, dan icon re-init.

## Menjalankan & Memverifikasi

```bash
# Buka via HTTP server sederhana apapun
python3 -m http.server 8080   # buka http://localhost:8080/login.html
```

Verifikasi logika data tanpa browser:
```bash
node -e "
const store = new Map();
globalThis.localStorage = { getItem: k=>store.get(k)??null, setItem:(k,v)=>store.set(k,v), removeItem:k=>store.delete(k) };
globalThis.window = globalThis;
require('./assets/js/db.js');
console.log('Seed OK:', window.RT.listCategories().length);
"
```

Verifikasi sintaks seluruh file JavaScript:
```bash
node -c assets/js/db.js && node -c assets/js/ui.js && node -c assets/js/layout.js
```

## Aturan & Konvensi

1. **GitHub Pages Friendly**: Semua tautan internal menggunakan path relatif langsung (`index.html`, `reports.html`, bukan `/reports`). Jangan gunakan leading slash (`/`) pada link atau asset path.
2. **CDN Only**: Tailwind CSS dan Lucide Icons dimuat lewat CDN (tanpa `npm install` atau bundler).
3. **Role & Guard**:
   - `warga` hanya bisa melihat & mengelola laporan miliknya.
   - `rt` dan `admin` (diperiksa via `window.RT.isOfficerRole(role)`) berhak mengelola semua laporan, mengubah status, memberi balasan, serta mengakses `warga.html` dan `categories.html`.
4. **Data Foto**: Foto diunggah pengguna dikonversi menjadi dataURL base64 oleh `FileReader` dan disimpan langsung di objek laporan `localStorage`.
5. **Akun Demo**:
   - `warga@laporrt.id` / `warga123`
   - `rt@laporrt.id` / `rt123456`
   - `admin@laporrt.id` / `admin123`
6. Reset data demo tersedia lewat dropdown profil pojok kanan atas (`window.RT.resetData()`).
