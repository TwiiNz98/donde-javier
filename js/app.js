/* ==========================================================
   app.js — Donde Javier | Bootstrap y utilidades globales
   ========================================================== */

/* ═══════════════════════════════════════════════════════
   HORARIO LOCAL (Abierto/Cerrado dinámico)
   ═══════════════════════════════════════════════════════ */
const HorarioLocal = (() => {
  const horarios = {
    0: { inicio: 12, fin: 21 },  // Domingo
    1: { inicio: 10, fin: 21 },  // Lunes
    2: { inicio: 10, fin: 21 },  // Martes
    3: { inicio: 10, fin: 21 },  // Miércoles
    4: { inicio: 10, fin: 21 },  // Jueves
    5: { inicio: 10, fin: 22 },  // Viernes
    6: { inicio: 10, fin: 22 }   // Sábado
  };

  function estaAbierto() {
    const ahora = new Date();
    const dia = ahora.getDay();
    const hora = ahora.getHours();
    const h = horarios[dia];
    return hora >= h.inicio && hora < h.fin;
  }

  function actualizar() {
    const pill = document.querySelector('.status-pill');
    const dot = document.querySelector('.status-dot');
    const text = document.querySelector('.status-pill-text');
    if (pill && dot && text) {
      const abierto = estaAbierto();
      dot.style.background = abierto ? 'var(--green)' : '#C41831';
      text.textContent = abierto ? 'Abierto' : 'Cerrado';
    }
  }

  function init() {
    actualizar();
    setInterval(actualizar, 60000);
  }

  return { init, estaAbierto };
})();

/* ═══════════════════════════════════════════════════════
   HERO SLIDER LOGIC
   ═══════════════════════════════════════════════════════ */
const HeroSlider = (() => {
  const totalSlides = 5;
  const state = { current: 1, interval: null };

  function init() {
    const slider = document.getElementById('hero-slider');
    if (!slider) return;
    initDots(slider);
    startAutoPlay(slider);
  }

  function initDots(slider) {
    const dots = slider.querySelectorAll('.hero-dot');
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(slider, i + 1));
    });
  }

  function goToSlide(slider, slideNum) {
    if (slideNum === state.current) return;
    
    const slides = slider.querySelectorAll('.hero-slide');
    const direction = slideNum > state.current ? 1 : -1;
    
    slides[state.current - 1].classList.remove('active');
    slides[state.current - 1].classList.add(direction > 0 ? 'exit-left' : 'exit-right');
    
    slides[slideNum - 1].classList.add('active');
    slides[slideNum - 1].classList.add(direction > 0 ? 'enter-right' : 'enter-left');
    
    setTimeout(() => {
      slides.forEach(s => s.classList.remove('exit-left', 'exit-right', 'enter-left', 'enter-right'));
    }, 500);
    
    updateText(slideNum);
    updateDots(slider, slideNum);
    state.current = slideNum;
  }

  function updateText(slideNum) {
    const titles = document.querySelectorAll('#hero-slider .hero-text');
    const subs = document.querySelectorAll('#hero-slider .hero-subtext');
    const separator = document.querySelector('#hero-slider .hero-separator');
    
    if (separator) {
      separator.classList.add('hiding');
      separator.classList.remove('showing');
      setTimeout(() => {
        titles.forEach(el => el.classList.remove('active'));
        subs.forEach(el => el.classList.remove('active'));
        
        const title = document.querySelector(`#hero-slider .hero-text[data-text="${slideNum}"]`);
        const sub = document.querySelector(`#hero-slider .hero-subtext[data-sub="${slideNum}"]`);
        
        if (title) title.classList.add('active');
        if (sub) sub.classList.add('active');
        
        separator.classList.remove('hiding');
        separator.classList.add('showing');
      }, 350);
    } else {
      titles.forEach(el => el.classList.remove('active'));
      subs.forEach(el => el.classList.remove('active'));
      
      const title = document.querySelector(`#hero-slider .hero-text[data-text="${slideNum}"]`);
      const sub = document.querySelector(`#hero-slider .hero-subtext[data-sub="${slideNum}"]`);
      
      if (title) title.classList.add('active');
      if (sub) sub.classList.add('active');
    }
  }

  function updateDots(slider, slideNum) {
    const dots = slider.querySelectorAll('.hero-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i + 1 === slideNum);
    });
  }

  function nextSlide(slider) {
    const next = state.current >= totalSlides ? 1 : state.current + 1;
    goToSlide(slider, next);
  }

  function startAutoPlay(slider) {
    if (state.interval) clearInterval(state.interval);
    state.interval = setInterval(() => nextSlide(slider), 5000);
  }

  return { init };
})();

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
  HeroSlider.init();
  HorarioLocal.init();

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