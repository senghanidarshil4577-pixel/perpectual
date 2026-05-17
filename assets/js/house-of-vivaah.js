/* ============================================================
   HOUSE OF VIVAAH — DS Labs Luxury Events
   Main JavaScript
   ============================================================ */

'use strict';

/* ===================== LOADER ===================== */
window.addEventListener('load', () => {
  const loader = document.getElementById('hov-loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('loaded');
    setTimeout(() => loader.remove(), 900);
  }, 2200);
});

/* ===================== CURSOR ===================== */
(function initCursor() {
  const dot   = document.getElementById('hov-cursor');
  const trail = document.getElementById('hov-trail');
  if (!dot || !trail) return;

  let mx = 0, my = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.querySelectorAll('a, button, .gallery-item, .service-card, .testi-card, .package-card').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('expand'));
    el.addEventListener('mouseleave', () => dot.classList.remove('expand'));
  });
})();

/* ===================== PARTICLES ===================== */
(function initParticles() {
  const container = document.getElementById('hov-particles');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      --dur: ${6 + Math.random() * 10}s;
      --delay: ${-Math.random() * 12}s;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
      opacity: ${0.2 + Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
})();

/* ===================== NAVBAR ===================== */
(function initNavbar() {
  const nav = document.getElementById('hov-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile menu
  const burger = document.getElementById('hov-burger');
  const menu   = document.getElementById('hov-mobile-menu');
  const close  = document.getElementById('hov-menu-close');
  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.add('open'));
  }
  if (close && menu) {
    close.addEventListener('click', () => menu.classList.remove('open'));
  }

  // Close on outside click
  document.addEventListener('click', e => {
    if (menu && !menu.contains(e.target) && !burger.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
})();

/* ===================== SCROLL REVEAL ===================== */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ===================== STAT COUNTERS ===================== */
(function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const duration = 2000;
      const step = target / (duration / 16);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }, 16);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
})();

/* ===================== GALLERY TABS ===================== */
(function initGallery() {
  const tabs  = document.querySelectorAll('.gallery-tab');
  const items = document.querySelectorAll('.gallery-item');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.style.display = '';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = ''; }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => { item.style.display = 'none'; }, 380);
        }
      });
    });
  });
})();

/* ===================== CONTACT FORM ===================== */
(function initForm() {
  const form    = document.getElementById('hov-form');
  const popup   = document.getElementById('form-success');
  const closeBtn = document.getElementById('success-close');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Send Inquiry';
      btn.disabled = false;
      form.reset();
      if (popup) popup.classList.add('show');
    }, 1600);
  });

  if (closeBtn && popup) {
    closeBtn.addEventListener('click', () => popup.classList.remove('show'));
  }
  if (popup) {
    popup.addEventListener('click', e => {
      if (e.target === popup) popup.classList.remove('show');
    });
  }
})();

/* ===================== SCROLL TO TOP ===================== */
(function initScrollTop() {
  const btn = document.getElementById('hov-scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===================== PARALLAX HERO ===================== */
(function initParallax() {
  const hero = document.getElementById('hov-hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      const bg = hero.querySelector('.hero-bg');
      if (bg) bg.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
})();

/* ===================== ACTIVE NAV LINK ===================== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));
})();
