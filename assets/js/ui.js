/**
 * Lapor Pak RT — helper UI: toast, modal, badge, formatter, escape.
 * Global object: window.UI
 */
(function () {
  'use strict';

  /* ---------- util ---------- */

  function esc(v) {
    if (v === null || v === undefined) return '';
    return String(v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function fmtDateTime(v) {
    if (!v) return '';
    const d = new Date(String(v).replace(' ', 'T'));
    if (isNaN(d.getTime())) return v;
    return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  }

  function fmtDate(v) {
    if (!v) return '';
    const d = new Date(String(v) + 'T00:00:00');
    if (isNaN(d.getTime())) return v;
    return d.toLocaleDateString('id-ID', { dateStyle: 'long' });
  }

  function icons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) { /* abaikan */ }
    }
  }

  /* ---------- toast ---------- */

  const TONES = {
    success: 'bg-emerald-600 text-white shadow-lg',
    info: 'bg-slate-900 text-white shadow-lg',
    error: 'bg-rose-600 text-white shadow-lg'
  };
  let toastTimer = null;

  function toast(text, tone) {
    let el = document.getElementById('app-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'app-toast';
      el.setAttribute('role', 'status');
      el.className = 'fixed bottom-6 right-6 z-[70] rounded-full px-4 py-2.5 text-xs font-semibold shadow-2xl transition-all duration-300';
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.className = 'fixed bottom-6 right-6 z-[70] rounded-full px-4 py-2.5 text-xs font-semibold shadow-2xl transition-all duration-300 ' + (TONES[tone || 'info']);
    el.style.transform = 'translateY(0)';
    el.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.style.transform = 'translateY(1.5rem)';
      el.style.opacity = '0';
    }, 2800);
  }

  /* ---------- meta status ---------- */

  const STATUS_META = {
    pending: { label: 'Diajukan', cls: 'bg-amber-50 text-amber-700 border border-amber-200/60', dot: 'bg-amber-500' },
    diproses: { label: 'Diproses', cls: 'bg-sky-50 text-sky-700 border border-sky-200/60', dot: 'bg-sky-500' },
    selesai: { label: 'Selesai', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60', dot: 'bg-emerald-500' },
    ditolak: { label: 'Ditolak', cls: 'bg-rose-50 text-rose-700 border border-rose-200/60', dot: 'bg-rose-500' }
  };

  const PRIORITY_META = {
    normal: { label: 'Normal', cls: 'bg-slate-100 text-slate-600 border border-slate-200/60' },
    penting: { label: 'Penting', cls: 'bg-amber-50 text-amber-700 border border-amber-200/60' },
    darurat: { label: 'Darurat', cls: 'bg-rose-50 text-rose-700 border border-rose-200/60' }
  };

  function statusBadge(status) {
    const m = STATUS_META[status] || { label: esc(status), cls: 'bg-slate-100 text-slate-600 border border-slate-200/60', dot: 'bg-slate-400' };
    return '<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ' + m.cls + '">' +
      '<span class="h-1.5 w-1.5 rounded-full ' + m.dot + '"></span>' + esc(m.label) + '</span>';
  }

  function priorityBadge(priority) {
    const m = PRIORITY_META[priority] || PRIORITY_META.normal;
    return '<span class="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ' + m.cls + '">' + esc(m.label) + '</span>';
  }

  /* ---------- modal ---------- */

  function openModal(title, bodyHTML, opts) {
    const o = opts || {};
    closeModal();
    const wrap = document.createElement('div');
    wrap.id = 'app-modal';
    wrap.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm';
    wrap.innerHTML =
      '<div class="w-full ' + (o.maxWidth || 'max-w-md') + ' max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl" data-card>' +
        '<div class="mb-4 flex items-center justify-between">' +
          '<h3 class="text-base font-extrabold text-slate-900">' + esc(title) + '</h3>' +
          '<button type="button" data-close aria-label="Tutup" class="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700">' +
            '<i data-lucide="x" class="h-5 w-5" stroke-width="2.5"></i>' +
          '</button>' +
        '</div>' +
        '<div data-body>' + bodyHTML + '</div>' +
      '</div>';
    wrap.addEventListener('mousedown', function (e) {
      if (e.target === wrap) closeModal();
    });
    const closeBtn = wrap.querySelector('[data-close]');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    document.body.appendChild(wrap);
    icons();
    return wrap;
  }

  function closeModal() {
    const el = document.getElementById('app-modal');
    if (el) el.remove();
  }

  /* ---------- shared input classes ---------- */

  const INPUT_CLS = 'w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-2.5 text-xs font-semibold text-slate-800 placeholder:font-medium placeholder:text-slate-400 transition-all focus:border-sky-500/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20';
  const LABEL_CLS = 'mb-1.5 block text-[11px] font-bold text-slate-700';
  const PRIMARY_BTN = 'inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-sky-200 transition-all hover:bg-sky-600 active:scale-95 disabled:opacity-60';
  const OUTLINE_BTN = 'inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-95';

  window.UI = {
    esc: esc,
    fmtDateTime: fmtDateTime,
    fmtDate: fmtDate,
    icons: icons,
    toast: toast,
    STATUS_META: STATUS_META,
    PRIORITY_META: PRIORITY_META,
    statusBadge: statusBadge,
    priorityBadge: priorityBadge,
    openModal: openModal,
    closeModal: closeModal,
    INPUT_CLS: INPUT_CLS,
    LABEL_CLS: LABEL_CLS,
    PRIMARY_BTN: PRIMARY_BTN,
    OUTLINE_BTN: OUTLINE_BTN
  };
})();
