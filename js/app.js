/* ==========================================================
   app.js — Donde Javier | Bootstrap y utilidades globales
   ========================================================== */

/* ── Toast utility ── */
const Toast = (() => {
  const container = () => document.getElementById('toast-container');

  function show(msg, type = 'default') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container().appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 300);
    }, 2800);
  }

  return { show };
})();

/* ── Logo Lightbox ── */
function openLogoLightbox() {
  document.getElementById('logo-lightbox')?.classList.add('open');
}
function closeLogoLightbox() {
  document.getElementById('logo-lightbox')?.classList.remove('open');
}

/* ── App init ── */
document.addEventListener('DOMContentLoaded', () => {

  /* Init modules */
  Menu.init();
  Cart.init();

  /* Keyboard: close modals on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      Menu.forceCloseModal();
      Cart.close();
      Checkout.close();
      closeLogoLightbox();
    }
  });

  /* Footer animations - already visible, no scroll needed */
  const unifiedFooter = document.getElementById('about');
  if (unifiedFooter) {
    const ufBg = unifiedFooter.querySelector('.uf-bg-img');
    if (ufBg) {
      ufBg.style.opacity = '0';
      ufBg.style.transition = 'opacity 1s ease';
      setTimeout(() => { ufBg.style.opacity = '1'; }, 100);
    }
    const sections = unifiedFooter.querySelectorAll('.uf-section');
    sections.forEach((sec, i) => {
      sec.style.animation = `reveal-up 0.6s ease forwards`;
      sec.style.animationDelay = `${i * 0.15}s`;
    });
  }

  /* Stagger card entrance on first paint */
  requestAnimationFrame(() => {
    document.querySelectorAll('.product-card').forEach((el, i) => {
      el.style.animationDelay = `${i * 55}ms`;
    });
  });

});