/**
 * Lapor Pak RT — Layout Shell (Sidebar + Topbar + Auth Guard)
 * Global object: window.Layout
 */
(function () {
  'use strict';

  // Inject critical transition and layout styles
  function injectLayoutStyles() {
    if (typeof document === 'undefined' || !document.head || !document.createElement) return;
    if (document.getElementById('rt-layout-style')) return;
    const style = document.createElement('style');
    style.id = 'rt-layout-style';
    style.textContent =
      '@view-transition { navigation: auto; }\n' +
      'html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; }\n' +
      '#app:not([data-ready="true"]) { opacity: 0; visibility: hidden; }\n' +
      '#app[data-ready="true"] { opacity: 1; visibility: visible; transition: opacity 0.16s ease-out; }\n' +
      '@keyframes pageEnterAnim { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }\n' +
      '.page-content-enter { animation: pageEnterAnim 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards; }\n' +
      '.page-exit { opacity: 0 !important; transform: translateY(-4px) !important; transition: opacity 0.12s ease-in, transform 0.12s ease-in !important; }\n';
    document.head.appendChild(style);
  }
  injectLayoutStyles();

  const NAV_ITEMS = [
    { href: 'index.html', label: 'Dashboard', icon: 'layout-grid' },
    { href: 'reports.html', label: 'Pengaduan', icon: 'megaphone' },
    { href: 'announcements.html', label: 'Pengumuman', icon: 'bell' },
    { href: 'warga.html', label: 'Data Warga', icon: 'users', officerOnly: true },
    { href: 'categories.html', label: 'Kategori', icon: 'tags', officerOnly: true }
  ];

  const ROLE_LABEL = { warga: 'Warga', rt: 'Pengurus RT', admin: 'Admin' };

  function currentPage() {
    const p = window.location.pathname.split('/').pop() || 'index.html';
    return p === '' ? 'index.html' : p;
  }

  function formatCurrentDate() {
    const d = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear();
  }

  function init(opts) {
    const o = opts || {};
    const page = currentPage();
    const user = window.RT.sessionUser();

    // Guard auth
    if (!user) {
      window.location.replace('login.html');
      return null;
    }
    if (o.officerOnly && !window.RT.isOfficerRole(user.role)) {
      window.location.replace('index.html');
      return null;
    }

    const isOfficer = window.RT.isOfficerRole(user.role);
    const roleLabel = ROLE_LABEL[user.role] || user.role;
    const initial = (user.nama_lengkap || 'W')[0].toUpperCase();
    const shortName = (user.nama_lengkap || 'Warga').split(' ')[0];

    // Render nav items
    const navHTML = NAV_ITEMS
      .filter(function (it) { return !it.officerOnly || isOfficer; })
      .map(function (it) {
        const isActive = page === it.href;
        return (
          '<a href="' + it.href + '" class="nav-item group flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm transition-all active:scale-95 ' +
            (isActive
              ? 'border border-slate-200/80 bg-slate-100 font-bold text-slate-900 shadow-sm'
              : 'font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-800') + '">' +
            '<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ' +
              (isActive ? 'bg-white text-slate-900 shadow-sm' : 'bg-transparent text-slate-400 group-hover:text-slate-700') + '">' +
              '<i data-lucide="' + it.icon + '" class="h-4 w-4" stroke-width="2.2"></i>' +
            '</span>' +
            '<span>' + it.label + '</span>' +
          '</a>'
        );
      }).join('');

    // Shell template
    const root = document.getElementById('app');
    if (!root) return null;

    const pageContent = root.innerHTML;

    root.innerHTML =
      '<div class="fixed inset-0 flex overflow-hidden bg-[#F8FAFC]">' +
        // Mobile backdrop
        '<div id="mobile-overlay" class="pointer-events-none fixed inset-0 z-40 bg-slate-900/40 opacity-0 backdrop-blur-sm transition-opacity lg:hidden"></div>' +

        // Sidebar: Always fixed in viewport, never scrolls with page
        '<aside id="sidebar" class="fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 -translate-x-full transform flex-col justify-between overflow-y-auto border-r border-slate-100/90 bg-white px-5 py-7 custom-scrollbar transition-transform duration-300 ease-in-out lg:translate-x-0">' +
          '<div>' +
            '<div class="mb-8 flex items-center justify-between px-2">' +
              '<a href="index.html" class="group flex cursor-pointer items-center gap-2.5">' +
                '<div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm transition-transform group-hover:scale-105">' +
                  '<i data-lucide="layout-grid" class="h-4 w-4 text-sky-400" stroke-width="2.5"></i>' +
                '</div>' +
                '<span class="text-lg font-black tracking-tight text-slate-900">Lapor Pak RT</span>' +
              '</a>' +
              '<button id="close-sidebar-btn" type="button" aria-label="Tutup menu" class="rounded-xl p-1.5 text-slate-400 hover:text-slate-700 lg:hidden">' +
                '<i data-lucide="x" class="h-5 w-5" stroke-width="2.5"></i>' +
              '</button>' +
            '</div>' +

            '<nav class="space-y-1.5">' +
              navHTML +
              '<button id="btn-logout" type="button" class="group flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-95">' +
                '<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-transparent text-slate-400 group-hover:text-rose-600">' +
                  '<i data-lucide="log-out" class="h-4 w-4" stroke-width="2.2"></i>' +
                '</span>' +
                '<span>Keluar</span>' +
              '</button>' +
            '</nav>' +
          '</div>' +

          // Bottom CTA Card (matches Upgrade to Pro card from reference image)
          '<div class="relative mt-8 pt-2">' +
            '<div class="relative overflow-visible rounded-3xl border border-slate-100/90 bg-slate-50/90 p-5 text-center shadow-sm">' +
              '<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 shadow-sm">' +
                '<i data-lucide="megaphone" class="h-5 w-5" stroke-width="2.2"></i>' +
              '</div>' +
              '<p class="mb-1 text-xs font-black tracking-tight text-slate-900">' +
                (isOfficer ? 'Aduan warga menunggu?' : 'Punya kendala lingkungan?') +
              '</p>' +
              '<p class="mb-3 text-[11px] font-medium leading-relaxed text-slate-400">' +
                (isOfficer ? 'Tanggapi keluhan warga dengan cepat' : 'Laporkan aduan & pantau langsung penanganannya') +
              '</p>' +
              '<a href="' + (isOfficer ? 'reports.html' : 'reports.html?new=1') + '" class="block w-full rounded-full bg-sky-500 py-2.5 px-4 text-xs font-bold text-white shadow-sm shadow-sky-200 transition-all hover:bg-sky-600 active:scale-95">' +
                (isOfficer ? 'Kelola Aduan' : 'Lapor Sekarang') +
              '</a>' +
            '</div>' +
          '</div>' +
        '</aside>' +

        // Main View Area: offset by sidebar width on desktop with lg:ml-64
        '<div class="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#F8FAFC] lg:ml-64">' +
          // Mobile header (only below lg)
          '<header class="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 py-4 lg:hidden">' +
            '<div class="flex items-center gap-2.5">' +
              '<div class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">' +
                '<i data-lucide="layout-grid" class="h-3.5 w-3.5 text-sky-400" stroke-width="2.5"></i>' +
              '</div>' +
              '<span class="text-base font-extrabold tracking-tight text-slate-900">Lapor Pak RT</span>' +
            '</div>' +
            '<button id="mobile-menu-btn" type="button" aria-label="Buka menu" class="rounded-xl bg-slate-50 p-2 text-slate-700 transition-colors hover:bg-slate-100 active:scale-95">' +
              '<i data-lucide="menu" class="h-5 w-5" stroke-width="2.5"></i>' +
            '</button>' +
          '</header>' +

          // Main scrollable content
          '<main id="main-content" class="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-[#F8FAFC] custom-scrollbar">' +
            // Sticky topbar
            '<section class="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-4 border-b border-slate-100/80 bg-white/85 px-5 py-3.5 backdrop-blur-md sm:px-8 lg:px-9">' +
              '<div class="hidden items-center gap-2.5 lg:flex">' +
                '<p class="text-sm font-extrabold text-slate-900">Halo, ' + window.UI.esc(shortName) + '!</p>' +
                '<span class="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-700">' +
                  window.UI.esc(roleLabel) +
                '</span>' +
              '</div>' +

              '<div class="flex items-center gap-3">' +
                // Date pill badge matching reference image (16 May, 2023 [calendar])
                '<div class="hidden items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm sm:flex">' +
                  '<i data-lucide="calendar" class="h-3.5 w-3.5 text-slate-400" stroke-width="2.2"></i>' +
                  '<span>' + formatCurrentDate() + '</span>' +
                '</div>' +

                '<a href="announcements.html" aria-label="Pengumuman" class="relative rounded-xl border border-slate-200/70 bg-white p-2 text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95">' +
                  '<i data-lucide="bell" class="h-4 w-4" stroke-width="2.2"></i>' +
                  '<span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>' +
                '</a>' +

                // User menu chip (avatar ring styled like Megan Norton)
                '<div class="relative">' +
                  '<button id="user-chip-btn" type="button" class="flex items-center gap-2.5 rounded-full border border-slate-200/70 bg-white py-1 pl-1 pr-3.5 shadow-sm transition-all hover:border-slate-300 hover:shadow active:scale-95">' +
                    '<span class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-slate-900 ring-2 ring-white shadow-sm">' +
                      window.UI.esc(initial) +
                    '</span>' +
                    '<span class="hidden flex-col text-left sm:flex">' +
                      '<span class="text-xs font-bold leading-tight text-slate-800">' + window.UI.esc(user.nama_lengkap) + '</span>' +
                      '<span class="text-[10px] font-semibold leading-tight text-slate-400">' + window.UI.esc(user.email) + '</span>' +
                    '</span>' +
                    '<i data-lucide="chevron-down" class="h-3.5 w-3.5 text-slate-400" stroke-width="2.2"></i>' +
                  '</button>' +

                  // Dropdown
                  '<div id="user-dropdown" class="hidden absolute right-0 mt-2 w-52 rounded-3xl border border-slate-100 bg-white py-1.5 shadow-xl z-30">' +
                    '<div class="border-b border-slate-50 px-4 py-2">' +
                      '<p class="text-[11px] font-bold text-slate-800">' + window.UI.esc(roleLabel) + '</p>' +
                      '<p class="text-[10px] font-medium text-slate-400">' + window.UI.esc(user.nik) + '</p>' +
                      '<p class="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-600">Mode demo — data lokal</p>' +
                    '</div>' +
                    '<button id="btn-reset-demo" type="button" class="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900">' +
                      '<i data-lucide="rotate-ccw" class="h-3.5 w-3.5 text-slate-400" stroke-width="2.5"></i> Reset Data Demo' +
                    '</button>' +
                    '<button id="btn-dropdown-logout" type="button" class="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50">' +
                      '<i data-lucide="log-in" class="h-3.5 w-3.5 rotate-180 text-rose-600" stroke-width="2.5"></i> Keluar' +
                    '</button>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</section>' +

            // Content inject with smooth entrance
            '<div id="page-content" class="page-content-enter flex flex-col gap-6 p-5 sm:p-8 lg:p-9">' +
              pageContent +
            '</div>' +
          '</main>' +
        '</div>' +
      '</div>';

    // Wiring events
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-sidebar-btn');

    function toggleDrawer(open) {
      if (open) {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        overlay.classList.remove('pointer-events-none', 'opacity-0');
        overlay.classList.add('opacity-100');
      } else {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.remove('opacity-100');
        overlay.classList.add('pointer-events-none', 'opacity-0');
      }
    }

    if (menuBtn) menuBtn.addEventListener('click', function () { toggleDrawer(true); });
    if (closeBtn) closeBtn.addEventListener('click', function () { toggleDrawer(false); });
    if (overlay) overlay.addEventListener('click', function () { toggleDrawer(false); });

    // Dropdown profile
    const chipBtn = document.getElementById('user-chip-btn');
    const dropdown = document.getElementById('user-dropdown');
    if (chipBtn && dropdown) {
      chipBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });
      document.addEventListener('click', function () {
        dropdown.classList.add('hidden');
      });
    }

    function doLogout() {
      window.RT.logout();
      window.UI.toast('Anda telah keluar dari akun.');
      setTimeout(function () { window.location.replace('login.html'); }, 300);
    }

    const btnLogout = document.getElementById('btn-logout');
    const btnDropdownLogout = document.getElementById('btn-dropdown-logout');
    if (btnLogout) btnLogout.addEventListener('click', doLogout);
    if (btnDropdownLogout) btnDropdownLogout.addEventListener('click', doLogout);

    const btnReset = document.getElementById('btn-reset-demo');
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        if (confirm('Kembalikan semua data ke kondisi awal (seed demo)?')) {
          window.RT.resetData();
          window.location.reload();
        }
      });
    }

    window.UI.icons();

    // Mark root ready to reveal smoothly without layout shift / flicker
    root.setAttribute('data-ready', 'true');

    return user;
  }

  // Global smooth navigation interceptor for internal links
  document.addEventListener('click', function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
      return;
    }
    if (href.endsWith('.html') || href.includes('.html?') || href.includes('.html#')) {
      const currentBase = window.location.pathname.split('/').pop() || 'index.html';
      const targetBase = href.split('?')[0].split('#')[0].split('/').pop() || 'index.html';

      // Same page navigation: smoothly scroll to top
      if (currentBase === targetBase && !href.includes('?')) {
        e.preventDefault();
        const main = document.getElementById('main-content');
        if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Smooth exit transition
      e.preventDefault();
      const content = document.getElementById('page-content') || document.getElementById('app');
      if (content) content.classList.add('page-exit');
      setTimeout(function () {
        window.location.href = href;
      }, 100);
    }
  });

  window.Layout = { init: init };
})();
