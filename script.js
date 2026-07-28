(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WHATSAPP = '5492994155073';

  function showToast(msg) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
    const t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg><span></span>';
    t.querySelector('span').textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => { t.classList.add('hiding'); setTimeout(() => t.remove(), 240); }, 3400);
  }

  function initReveals() {
    const els = document.querySelectorAll('[data-animate],[data-animate-stagger]');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); document.querySelectorAll('.proc-line').forEach((l) => l.classList.add('drawn')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        if (el.hasAttribute('data-animate-stagger')) {
          [...el.children].forEach((ch, i) => { ch.style.transitionDelay = (i * 0.09) + 's'; });
        }
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));

    const line = document.querySelector('.proc-line');
    if (line) {
      const path = line.querySelector('path');
      if (path) path.setAttribute('pathLength', '1');
      const track = document.querySelector('.proc-track');
      const lio = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { line.classList.add('drawn'); lio.disconnect(); } }), { threshold: 0.35 });
      if (track) lio.observe(track);
    }
  }

  function initWspFloat() {
    const btn = document.getElementById('wsp-float');
    if (!btn) return;
    window.addEventListener('scroll', () => { btn.classList.toggle('visible', window.scrollY > 600); }, { passive: true });
  }

  function initNav() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    const closeBtn = document.getElementById('navClose');
    if (toggle && nav) {
      let bd = document.querySelector('.nav-backdrop');
      if (!bd) {
        bd = document.createElement('div'); bd.className = 'nav-backdrop';
        (document.querySelector('.site-header') || document.body).appendChild(bd);
      }
      const close = () => {
        nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
      };
      const open = () => {
        nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
        const a = nav.querySelector('a'); a && a.focus();
      };
      toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
      closeBtn && closeBtn.addEventListener('click', () => { close(); toggle.focus(); });
      bd.addEventListener('click', close);
      nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
    }
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = form.nombre.value.trim();
      const tel = form.tel.value.trim();
      const servicio = form.servicio.value.trim();
      const mensaje = form.mensaje.value.trim();
      if (!nombre || !tel) { showToast('Completá tu nombre y teléfono, por favor.'); return; }
      const lineas = [
        'Hola Segeym World, te escribo desde la web:',
        `Nombre: ${nombre}`,
        `Teléfono: ${tel}`,
        servicio ? `Servicio: ${servicio}` : '',
        mensaje ? `Mensaje: ${mensaje}` : '',
      ].filter(Boolean);
      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`;
      window.open(url, '_blank', 'noopener');
      showToast('¡Listo! Te llevamos a WhatsApp para enviar tu consulta.');
      form.reset();
    });
  }

  function initMap() {
    const el = document.getElementById('map');
    if (!el || typeof L === 'undefined') { if (el) el.style.display = 'none'; return; }
    const map = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([-38.5, -68.9], 9);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19,
    }).addTo(map);
    L.circle([-38.3486, -68.7947], { radius: 60000, color: '#1466c4', weight: 2, fillColor: '#1466c4', fillOpacity: 0.08 }).addTo(map);
    const icon = L.divIcon({ className: '', html: '<div style="width:22px;height:22px;border-radius:50%;background:#1466c4;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.3)"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
    L.marker([-38.3486, -68.7947], { icon }).addTo(map).bindPopup('<b>Segeym World Argentina</b><br>Vaca Muerta · Añelo · Plaza Huincul');
    setTimeout(() => map.invalidateSize(), 200);
  }

  function boot() { initReveals(); initWspFloat(); initNav(); initForm(); initMap(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
