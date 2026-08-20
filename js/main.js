/* Compass Marketing — main.js */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('done'), 350);
  });
  // Safety: never trap the user behind the loader
  setTimeout(() => loader.classList.add('done'), 2500);

  /* ---------- Nav ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const onScrollNav = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scrollProgress');
  const onScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  onScrollProgress();
  window.addEventListener('scroll', onScrollProgress, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------- Count-up numbers ---------- */
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = String(el.dataset.target).includes('.') ? 1 : 0;
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const val = target * easeOutExpo(p);
      el.textContent = val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    if (prefersReducedMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
    } else {
      requestAnimationFrame(tick);
    }
  };

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll('.count').forEach((el) => countObserver.observe(el));

  /* ---------- Hero compass needle follows scroll ---------- */
  const needle = document.getElementById('compassNeedle');
  if (needle && !prefersReducedMotion) {
    let settled = false;
    setTimeout(() => { settled = true; }, 3800); // wait for settle animation
    window.addEventListener(
      'scroll',
      () => {
        if (!settled) return;
        const rot = Math.min(window.scrollY * 0.08, 50);
        needle.style.animation = 'none';
        needle.style.transform = `rotate(${rot}deg)`;
      },
      { passive: true }
    );
  }

  /* ---------- Service card cursor glow ---------- */
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - r.left + 'px');
      card.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  /* ---------- Hero particles ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h, raf;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    };

    const spawn = () => {
      const count = Math.min(Math.floor(w / 22), 70);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        o: Math.random() * 0.5 + 0.1,
        orange: Math.random() < 0.28,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.orange
          ? `rgba(255, 107, 26, ${p.o})`
          : `rgba(247, 244, 239, ${p.o * 0.6})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };

    resize();
    spawn();
    step();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      resize();
      spawn();
      step();
    });

    // Pause when hero is off-screen to save battery
    new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) step();
      },
      { threshold: 0 }
    ).observe(canvas);
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Hook up your form backend here (Formspree, Netlify Forms, own API, ...)
    success.hidden = false;
    form.reset();
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
