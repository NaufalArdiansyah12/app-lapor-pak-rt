/**
 * Lapor Pak RT — Database Lokal (mode statis untuk GitHub Pages)
 * Semua data demo disimpan di localStorage; tidak butuh backend sama sekali.
 * Global object: window.RT
 */
(function () {
  'use strict';

  const DATA_KEY = 'lapor_rt_data_v1';
  const SESSION_KEY = 'lapor_rt_session_v1';

  const nowStr = function () {
    const d = new Date();
    const p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  };

  const SEED = {
    users: [
      { id_users: 1, nama_lengkap: 'Admin Sistem', nik: '3201000000000001', email: 'admin@laporrt.id', password: 'admin123', no_telepon: '081200000001', alamat: 'Kantor RT 05 / RW 03', no_kk: null, status_domisili: null, jumlah_anggota: 1, role: 'admin', status: 'aktif', created_at: '2026-08-01 08:00:00' },
      { id_users: 2, nama_lengkap: 'Bapak Sutarna (RT)', nik: '3201000000000002', email: 'rt@laporrt.id', password: 'rt123456', no_telepon: '081200000002', alamat: 'Jl. Melati No. 1 RT 05 RW 03', no_kk: '3201000000000001', status_domisili: 'Pemilik', jumlah_anggota: 4, role: 'rt', status: 'aktif', created_at: '2026-08-01 08:00:00' },
      { id_users: 3, nama_lengkap: 'Naufal Ardiansyah', nik: '3201000000000003', email: 'warga@laporrt.id', password: 'warga123', no_telepon: '081200000003', alamat: 'Jl. Melati No. 14 RT 05 RW 03', no_kk: '3201000000000002', status_domisili: 'Pemilik', jumlah_anggota: 5, role: 'warga', status: 'aktif', created_at: '2026-08-01 08:00:00' },
      { id_users: 4, nama_lengkap: 'Dewi Lestari', nik: '3201000000000004', email: 'dewi@laporrt.id', password: 'warga123', no_telepon: '081200000004', alamat: 'Jl. Melati No. 20 RT 05 RW 03', no_kk: '3201000000000002', status_domisili: 'Kontrak', jumlah_anggota: 3, role: 'warga', status: 'aktif', created_at: '2026-08-01 08:00:00' }
    ],
    categories: [
      { id_kategori: 1, nama_kategori: 'Keamanan', deskripsi: 'Gangguan keamanan, kejahatan, orang tak dikenal', ikon: 'shield-alert' },
      { id_kategori: 2, nama_kategori: 'Kebersihan', deskripsi: 'Sampah menumpuk, saluran kotor, limbah', ikon: 'trash-2' },
      { id_kategori: 3, nama_kategori: 'Fasilitas Umum', deskripsi: 'Fasilitas rusak: taman, lampu jalan, balai warga', ikon: 'lamp' },
      { id_kategori: 4, nama_kategori: 'Jalan & Drainase', deskripsi: 'Jalan rusak, lubang, banjir, drainase buntu', ikon: 'construction' },
      { id_kategori: 5, nama_kategori: 'Lainnya', deskripsi: 'Aduan lain yang belum masuk kategori', ikon: 'circle-dot' }
    ],
    reports: [
      { id_laporan: 1, kode_tiket: 'LPR-000001', id_warga: 3, id_kategori: 2, judul_laporan: 'Tumpukan sampah di ujung gang', isi_laporan: 'Sampah rumah tangga menumpuk di ujung gang sudah 3 hari dan menimbulkan bau tidak sedap.', foto: null, lokasi: 'Ujung Jl. Melati dekat musala', tgl_kejadian: '2026-08-28', status: 'selesai', created_at: '2026-08-28 07:30:00' },
      { id_laporan: 2, kode_tiket: 'LPR-000002', id_warga: 3, id_kategori: 4, judul_laporan: 'Jalan berlubang besar', isi_laporan: 'Ada lubang besar di tengah Jl. Melati yang membuat motor hampir tersenggol tiap lewat malam.', foto: null, lokasi: 'Depan rumah No. 8', tgl_kejadian: '2026-09-05', status: 'diproses', created_at: '2026-09-05 18:20:00' },
      { id_laporan: 3, kode_tiket: 'LPR-000003', id_warga: 4, id_kategori: 1, judul_laporan: 'Orang tidak dikenal masuk malam', isi_laporan: 'Malam ini ada orang asing bolak-balik di parkiran sekolah, mohon ditingkatkan ronda.', foto: null, lokasi: 'Parkiran sekolah dasar', tgl_kejadian: '2026-09-10', status: 'pending', created_at: '2026-09-10 22:05:00' }
    ],
    responses: [
      { id_tanggapan: 1, id_laporan: 1, id_petugas: 2, isi_tanggapan: 'Terima kasih laporannya. Petugas sampah sudah kami surat keluar, insya Allah dijemput besok pagi.', tgl_tanggapan: '2026-08-29 09:30:00' },
      { id_tanggapan: 2, id_laporan: 1, id_petugas: 2, isi_tanggapan: 'Sampah sudah diangkat kemarin. Status kami selesaikan.', tgl_tanggapan: '2026-08-30 16:00:00' },
      { id_tanggapan: 3, id_laporan: 2, id_petugas: 2, isi_tanggapan: 'Laporan diterima. Sudah diajukan ke RW untuk perbaikan jalan tahap berikutnya, mohon bersabar.', tgl_tanggapan: '2026-09-06 08:15:00' }
    ],
    announcements: [
      { id_pengumuman: 1, id_petugas: 2, judul: 'Kerja Bakti Mingguan', isi: 'Kerja bakti rutin digelar Minggu pagi pukul 07.00 di lapangan RT. Mohon warga berpartisipasi dan membawa alat masing-masing.', prioritas: 'normal', tgl_publikasi: '2026-09-12 09:00:00' },
      { id_pengumuman: 2, id_petugas: 2, judul: 'Pemadaman Listrik Terencana', isi: 'Selasa pukul 09.00–13.00 WIB ada pemadaman listrik untuk pemeriksaan jaringan. Mohon siapkan lampu emergency.', prioritas: 'penting', tgl_publikasi: '2026-09-14 10:30:00' },
      { id_pengumuman: 3, id_petugas: 2, judul: 'Agenda Ronda Malam Ini', isi: 'Untuk malam ini kelompok ronda 3 adalah keluarga di sisi Jl. Melati No. 10–20. Absensi di pos ronda pukul 22.00.', prioritas: 'darurat', tgl_publikasi: '2026-09-18 17:45:00' }
    ]
  };

  /* ---------- penyimpanan ---------- */

  let db;
  try {
    const raw = localStorage.getItem(DATA_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    db = parsed && parsed.users && parsed.users.length ? parsed : JSON.parse(JSON.stringify(SEED));
  } catch (e) {
    db = JSON.parse(JSON.stringify(SEED));
  }
  save();

  function save() {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(db));
    } catch (e) {
      /* kuota penuh (foto terlalu besar) — biarkan mode memori saja */
    }
  }

  /* ---------- helper ---------- */

  const nextId = function (arr, key) {
    return arr.reduce(function (m, r) { return Math.max(m, r[key] || 0); }, 0) + 1;
  };
  const isOfficerRole = function (r) { return r === 'rt' || r === 'admin'; };
  const findUser = function (id) {
    return db.users.find(function (u) { return u.id_users === id; }) || null;
  };
  const findCat = function (id) {
    return db.categories.find(function (c) { return c.id_kategori === id; }) || null;
  };

  /* ---------- sesi / auth ---------- */

  function sessionUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return findUser(JSON.parse(raw).userId);
    } catch (e) { return null; }
  }

  function login(email, password) {
    if (!email || !password) throw new Error('Email dan password wajib diisi.');
    const user = db.users.find(function (u) { return u.email === email; });
    if (!user || user.password !== password) throw new Error('Kombinasi email / password salah.');
    if (user.status !== 'aktif') throw new Error('Akun Anda sedang nonaktif. Hubungi pengurus RT.');
    try { localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id_users })); } catch (e) { /* abaikan */ }
    return { id: user.id_users, nama_lengkap: user.nama_lengkap, role: user.role };
  }

  function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* abaikan */ }
  }

  function register(data) {
    const required = ['nama_lengkap', 'nik', 'email', 'password', 'no_telepon', 'alamat'];
    for (let i = 0; i < required.length; i++) {
      if (!data[required[i]] || String(data[required[i]]).trim() === '') throw new Error('Semua field wajib diisi.');
    }
    if (!/^\d{16}$/.test(data.nik)) throw new Error('NIK harus terdiri dari 16 digit angka.');
    if (data.password.length < 8) throw new Error('Password minimal 8 karakter.');
    if (db.users.some(function (u) { return u.email === data.email || u.nik === data.nik; })) {
      throw new Error('Email atau NIK sudah terdaftar sebelumnya.');
    }
    db.users.push({
      id_users: nextId(db.users, 'id_users'),
      nama_lengkap: data.nama_lengkap, nik: data.nik, email: data.email,
      password: data.password, no_telepon: data.no_telepon, alamat: data.alamat,
      no_kk: null, status_domisili: null, jumlah_anggota: 1,
      role: 'warga', status: 'aktif', created_at: nowStr()
    });
    save();
    return 'Registrasi berhasil! Silakan masuk dengan akun baru Anda.';
  }

  function requireLogin() {
    const u = sessionUser();
    if (!u) throw new Error('Silakan login terlebih dahulu.');
    return u;
  }

  function requireOfficer() {
    const u = requireLogin();
    if (!isOfficerRole(u.role)) throw new Error('Hanya pengurus RT yang dapat melakukan aksi ini.');
    return u;
  }

  /* ---------- reports ---------- */

  function listReports(filters) {
    const me = sessionUser();
    if (!me) return [];
    const officer = isOfficerRole(me.role);
    const f = filters || {};
    let rows = db.reports.map(function (r) {
      const pelapor = findUser(r.id_warga);
      const kat = findCat(r.id_kategori);
      return Object.assign({}, r, {
        nama_pelapor: pelapor ? pelapor.nama_lengkap : '—',
        nama_kategori: kat ? kat.nama_kategori : '—',
        jumlah_tanggapan: db.responses.filter(function (t) { return t.id_laporan === r.id_laporan; }).length
      });
    });
    if (!officer) rows = rows.filter(function (r) { return r.id_warga === me.id_users; });
    if (f.status && f.status !== 'all') rows = rows.filter(function (r) { return r.status === f.status; });
    if (f.id_kategori && f.id_kategori !== 'all') rows = rows.filter(function (r) { return r.id_kategori === Number(f.id_kategori); });
    if (f.q) {
      const q = String(f.q).toLowerCase();
      rows = rows.filter(function (r) {
        return [r.judul_laporan, r.isi_laporan, r.kode_tiket].some(function (v) {
          return (v || '').toLowerCase().indexOf(q) !== -1;
        });
      });
    }
    rows.sort(function (a, b) { return (b.created_at || '').localeCompare(a.created_at || ''); });
    return rows.slice(0, 100);
  }

  function getReport(id) {
    const me = requireLogin();
    const officer = isOfficerRole(me.role);
    const r = db.reports.find(function (x) { return x.id_laporan === Number(id); });
    if (!r) throw new Error('Laporan tidak ditemukan.');
    if (!officer && r.id_warga !== me.id_users) {
      throw new Error('Anda hanya boleh melihat laporan milik Anda sendiri.');
    }
    const pelapor = findUser(r.id_warga);
    const kat = findCat(r.id_kategori);
    const responses = db.responses
      .filter(function (t) { return t.id_laporan === r.id_laporan; })
      .sort(function (a, b) { return (a.tgl_tanggapan || '').localeCompare(b.tgl_tanggapan || ''); })
      .map(function (t) {
        const pet = findUser(t.id_petugas);
        return Object.assign({}, t, { nama_petugas: pet ? pet.nama_lengkap : '—', role_petugas: pet ? pet.role : 'warga' });
      });
    return Object.assign({}, r, {
      nama_pelapor: pelapor ? pelapor.nama_lengkap : '—',
      telepon_pelapor: pelapor ? pelapor.no_telepon : '',
      nama_kategori: kat ? kat.nama_kategori : '—',
      responses: responses
    });
  }

  function createReport(fields, fotoDataURL) {
    const me = requireLogin();
    ['id_kategori', 'judul_laporan', 'isi_laporan', 'tgl_kejadian'].forEach(function (k) {
      if (!fields[k]) throw new Error('Field ' + k + ' wajib diisi.');
    });
    if (!findCat(Number(fields.id_kategori))) throw new Error('Kategori tidak valid.');
    const id = nextId(db.reports, 'id_laporan');
    db.reports.push({
      id_laporan: id,
      kode_tiket: 'LPR-' + String(id).padStart(6, '0'),
      id_warga: me.id_users,
      id_kategori: Number(fields.id_kategori),
      judul_laporan: fields.judul_laporan,
      isi_laporan: fields.isi_laporan,
      foto: fotoDataURL || null,
      lokasi: fields.lokasi || null,
      tgl_kejadian: fields.tgl_kejadian,
      status: 'pending',
      created_at: nowStr()
    });
    save();
    return db.reports[db.reports.length - 1];
  }

  function setReportStatus(id, status) {
    requireOfficer();
    if (['pending', 'diproses', 'selesai', 'ditolak'].indexOf(status) === -1) {
      throw new Error('Status tidak valid (pending, diproses, selesai, ditolak).');
    }
    const r = db.reports.find(function (x) { return x.id_laporan === Number(id); });
    if (!r) throw new Error('Laporan tidak ditemukan.');
    r.status = status;
    save();
    return r;
  }

  function deleteReport(id) {
    const me = requireLogin();
    const officer = isOfficerRole(me.role);
    const r = db.reports.find(function (x) { return x.id_laporan === Number(id); });
    if (!r) throw new Error('Laporan tidak ditemukan.');
    if (r.id_warga !== me.id_users && !officer) throw new Error('Anda tidak berhak menghapus laporan ini.');
    db.reports = db.reports.filter(function (x) { return x.id_laporan !== r.id_laporan; });
    db.responses = db.responses.filter(function (t) { return t.id_laporan !== r.id_laporan; });
    save();
  }

  function addResponse(idLaporan, isi) {
    const me = requireOfficer();
    if (!isi || !isi.trim()) throw new Error('Isi tanggapan tidak boleh kosong.');
    const t = {
      id_tanggapan: nextId(db.responses, 'id_tanggapan'),
      id_laporan: Number(idLaporan),
      id_petugas: me.id_users,
      isi_tanggapan: isi.trim(),
      tgl_tanggapan: nowStr()
    };
    db.responses.push(t);
    save();
    return Object.assign({}, t, { nama_petugas: me.nama_lengkap });
  }

  /* ---------- categories ---------- */

  function listCategories() {
    return db.categories.map(function (c) {
      return Object.assign({}, c, {
        jumlah_laporan: db.reports.filter(function (r) { return r.id_kategori === c.id_kategori; }).length
      });
    }).sort(function (a, b) { return a.nama_kategori.localeCompare(b.nama_kategori); });
  }

  function saveCategory(id, data) {
    requireOfficer();
    const nama = (data.nama_kategori || '').trim();
    if (!nama) throw new Error('Nama kategori wajib diisi.');
    const dup = db.categories.some(function (c) {
      return c.nama_kategori.toLowerCase() === nama.toLowerCase() && c.id_kategori !== Number(id);
    });
    if (dup) throw new Error('Kategori dengan nama tersebut sudah ada.');
    if (id) {
      const c = db.categories.find(function (x) { return x.id_kategori === Number(id); });
      if (!c) throw new Error('Kategori tidak ditemukan.');
      c.nama_kategori = nama;
      c.deskripsi = data.deskripsi || null;
      c.ikon = data.ikon || 'circle-dot';
      save();
      return c;
    }
    const c = {
      id_kategori: nextId(db.categories, 'id_kategori'),
      nama_kategori: nama, deskripsi: data.deskripsi || null, ikon: data.ikon || 'circle-dot'
    };
    db.categories.push(c);
    save();
    return c;
  }

  function deleteCategory(id) {
    requireOfficer();
    const used = db.reports.some(function (r) { return r.id_kategori === Number(id); });
    if (used) throw new Error('Kategori masih dipakai oleh laporan dan tidak dapat dihapus.');
    db.categories = db.categories.filter(function (c) { return c.id_kategori !== Number(id); });
    save();
  }

  /* ---------- announcements ---------- */

  function listAnnouncements(limit) {
    let rows = db.announcements.slice().sort(function (a, b) {
      return (b.tgl_publikasi || '').localeCompare(a.tgl_publikasi || '');
    });
    if (limit) rows = rows.slice(0, Number(limit));
    return rows.map(function (a) {
      const pet = findUser(a.id_petugas);
      return Object.assign({}, a, { nama_petugas: pet ? pet.nama_lengkap : '—' });
    });
  }

  function saveAnnouncement(id, data) {
    const me = requireOfficer();
    if (!data.judul || !data.judul.trim() || !data.isi || !data.isi.trim()) {
      throw new Error('Judul dan isi pengumuman wajib diisi.');
    }
    const prioritas = ['normal', 'penting', 'darurat'].indexOf(data.prioritas) !== -1 ? data.prioritas : 'normal';
    if (id) {
      const a = db.announcements.find(function (x) { return x.id_pengumuman === Number(id); });
      if (!a) throw new Error('Pengumuman tidak ditemukan.');
      a.judul = data.judul.trim();
      a.isi = data.isi.trim();
      a.prioritas = prioritas;
      save();
      return a;
    }
    const a = {
      id_pengumuman: nextId(db.announcements, 'id_pengumuman'),
      id_petugas: me.id_users,
      judul: data.judul.trim(), isi: data.isi.trim(),
      prioritas: prioritas, tgl_publikasi: nowStr()
    };
    db.announcements.push(a);
    save();
    return a;
  }

  function deleteAnnouncement(id) {
    requireOfficer();
    db.announcements = db.announcements.filter(function (a) { return a.id_pengumuman !== Number(id); });
    save();
  }

  /* ---------- users ---------- */

  function listUsers(filters) {
    requireOfficer();
    const f = filters || {};
    let rows = db.users.map(function (u) {
      return Object.assign({}, u, {
        jumlah_laporan: db.reports.filter(function (r) { return r.id_warga === u.id_users; }).length
      });
    });
    if (f.q) {
      const q = String(f.q).toLowerCase();
      rows = rows.filter(function (u) {
        return [u.nama_lengkap, u.nik, u.email, u.alamat].some(function (v) {
          return (v || '').toLowerCase().indexOf(q) !== -1;
        });
      });
    }
    if (f.role && f.role !== 'all') rows = rows.filter(function (u) { return u.role === f.role; });
    rows.sort(function (a, b) { return a.nama_lengkap.localeCompare(b.nama_lengkap); });
    return rows.slice(0, 200);
  }

  function updateUser(id, patch) {
    const me = requireOfficer();
    const tgt = findUser(Number(id));
    if (!tgt) throw new Error('Data warga tidak ditemukan.');
    if (tgt.id_users === me.id_users && patch.role && patch.role !== tgt.role) {
      throw new Error('Anda tidak dapat mengubah peran akun Anda sendiri.');
    }
    ['nama_lengkap', 'no_telepon', 'alamat', 'no_kk', 'status_domisili'].forEach(function (k) {
      if (patch[k] != null) tgt[k] = patch[k];
    });
    if (patch.jumlah_anggota != null) tgt.jumlah_anggota = Math.max(1, Number(patch.jumlah_anggota) || 1);
    if (patch.status != null) {
      if (['aktif', 'nonaktif'].indexOf(patch.status) === -1) throw new Error('Status tidak valid.');
      tgt.status = patch.status;
    }
    if (patch.role != null) {
      if (['warga', 'rt', 'admin'].indexOf(patch.role) === -1) throw new Error('Role tidak valid.');
      tgt.role = patch.role;
    }
    save();
  }

  function deleteUser(id) {
    const me = requireOfficer();
    if (Number(id) === me.id_users) throw new Error('Anda tidak dapat menghapus akun Anda sendiri.');
    db.users = db.users.filter(function (u) { return u.id_users !== Number(id); });
    db.reports = db.reports.filter(function (r) { return r.id_warga !== Number(id); });
    save();
  }

  /* ---------- stats ---------- */

  function stats() {
    const me = sessionUser();
    if (!me) return null;
    const officer = isOfficerRole(me.role);
    const mine = officer ? db.reports : db.reports.filter(function (r) { return r.id_warga === me.id_users; });
    const count = function (s) {
      return mine.filter(function (r) { return r.status === s; }).length;
    };
    const recent = mine.slice().sort(function (a, b) {
      return (b.created_at || '').localeCompare(a.created_at || '');
    }).slice(0, 5).map(function (r) {
      const pelapor = findUser(r.id_warga);
      const kat = findCat(r.id_kategori);
      return {
        id_laporan: r.id_laporan, kode_tiket: r.kode_tiket, judul_laporan: r.judul_laporan,
        status: r.status, created_at: r.created_at,
        nama_pelapor: pelapor ? pelapor.nama_lengkap : '—',
        nama_kategori: kat ? kat.nama_kategori : '—'
      };
    });
    return {
      total_laporan: mine.length,
      pending: count('pending'), diproses: count('diproses'),
      selesai: count('selesai'), ditolak: count('ditolak'),
      total_warga: db.users.filter(function (u) { return u.role === 'warga'; }).length,
      total_pengumuman: db.announcements.length,
      recent: recent
    };
  }

  /* ---------- reset ---------- */

  function resetData() {
    db = JSON.parse(JSON.stringify(SEED));
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(db));
      localStorage.removeItem(SESSION_KEY);
    } catch (e) { /* abaikan */ }
    return db;
  }

  window.RT = {
    sessionUser: sessionUser,
    login: login, logout: logout, register: register,
    requireLogin: requireLogin, requireOfficer: requireOfficer,
    isOfficerRole: isOfficerRole,
    findUser: findUser, findCat: findCat,
    listReports: listReports, getReport: getReport, createReport: createReport,
    setReportStatus: setReportStatus, deleteReport: deleteReport, addResponse: addResponse,
    listCategories: listCategories, saveCategory: saveCategory, deleteCategory: deleteCategory,
    listAnnouncements: listAnnouncements, saveAnnouncement: saveAnnouncement, deleteAnnouncement: deleteAnnouncement,
    listUsers: listUsers, updateUser: updateUser, deleteUser: deleteUser,
    stats: stats, resetData: resetData, nowStr: nowStr
  };
})();
