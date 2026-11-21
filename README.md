# Lapor Pak RT — Sistem Informasi Layanan & Pengaduan RT/RW Digital

Aplikasi web **HTML5 + Tailwind CSS** statis (siap dideploy ke **GitHub Pages** tanpa build step atau backend server).

> Tugas Rekayasa Perangkat Lunak — Naufal Ardiansyah, XII RPL 1, Absen 22

---

## Struktur File (GitHub Pages Ready)

```
app-lapor-rt/
├── index.html            # Dashboard (hero banner, 4 KPI, aduan terbaru, edaran)
├── login.html            # Masuk akun (tombol cepat akun demo)
├── register.html         # Form pendaftaran akun warga baru
├── reports.html          # Pengaduan (filter status/kategori, buat aduan + foto, tanggapan RT)
├── announcements.html    # Papan pengumuman digital (prioritas normal/penting/darurat)
├── warga.html            # Manajemen data warga RT (role RT/Admin)
├── categories.html       # Manajemen kategori aduan (role RT/Admin)
├── assets/
│   └── js/
│       ├── db.js         # Mock database di localStorage (CRUD warga, laporan, edaran)
│       ├── layout.js     # Shell sidebar, topbar profil, proteksi rute (auth guard)
│       └── ui.js         # Helper toast notifikasi, modal dialog, status badge
```

---

## Cara Menjalankan

### Opsi 1: Buka Langsung di Browser (Paling Mudah)
Cukup klik ganda file `login.html` atau `index.html` dari file manager, atau jalankan local server sederhana:

```bash
# Python
python3 -m http.server 8080

# PHP built-in
php -S localhost:8080

# Node (npx)
npx serve .
```

Lalu buka <http://localhost:8080/login.html>.

### Opsi 2: Deploy ke GitHub Pages (1 Menit)
1. Push repositori ini ke GitHub pada branch `main`.
2. Buka menu **Settings** repository → pilih tab **Pages**.
3. Pada bagian **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main` / folder `/ (root)`
4. Klik **Save**. Dalam hitungan detik website sudah online di URL:
   `https://<username>.github.io/<repo-name>/`

---

## Akun Demo

Tersedia tombol isi cepat pada halaman `login.html`:

| Peran | Email | Kata Sandi |
|-------|-------|------------|
| **Warga** | `warga@laporrt.id` | `warga123` |
| **Pak RT** | `rt@laporrt.id` | `rt123456` |
| **Admin** | `admin@laporrt.id` | `admin123` |

Semua perubahan data (buat aduan, tambah edaran, ubah status) tersimpan otomatis di `localStorage` peramban. Jika ingin mengembalikan data ke kondisi awal bersih, klik menu profil di pojok kanan atas lalu pilih **Reset Data Demo**.

---

## Fitur Utama

- 🎨 **Tema Tailwind persis desain referensi**: palet coral `#FF6B57`, teal `#4EBA9F`, font Plus Jakarta Sans, ikon Lucide.
- 📱 **Layout layar penuh**: Sidebar responsif (drawer pada layar mobile), topbar sticky, scrolling internal yang rapi.
- 🔐 **Autentikasi & proteksi peran**: Warga hanya melihat aduannya sendiri; Pak RT dan Admin bisa mengelola seluruh aduan, mengubah status, memberi balasan, serta mengakses menu Data Warga dan Kategori.
- 🚨 **Pelaporan aduan berfoto**: Unggah foto bukti (disimpan sebagai dataURL), titik lokasi kejadian, tanggal kronologi, dan kode tiket `LPR-xxxxxx`.
- 🔄 **Pelacak status 4 tahap**: Diajukan → Diproses → Selesai / Ditolak.
- 📢 **Papan pengumuman warga**: Filter prioritas (Normal, Penting, Darurat) dan edaran tersemat (*pinned*).
- 👥 **Manajemen kependudukan**: Nomor KK, NIK, alamat, status domisili (Pemilik/Kontrak), dan jumlah anggota keluarga.
