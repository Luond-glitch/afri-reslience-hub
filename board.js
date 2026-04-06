/* ============================================
   ARHICA Board of Directors — JS
   Scroll reveal, staggered animations,
   parallax hero, micro-interactions
============================================ */

// ── SCROLL REVEAL ──────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0');
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });
  
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  
  
  // ── HERO PARALLAX ──────────────────────────
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.board-hero');
    if (hero && scrollY < window.innerHeight) {
      hero.style.backgroundPositionY = `calc(center + ${scrollY * 0.35}px)`;
    }
  }, { passive: true });
  
  
  // ── BREADCRUMB HIDE ON HERO, SHOW ON SCROLL ─
  const breadcrumb = document.querySelector('.breadcrumb-nav');
  const heroHeight = document.querySelector('.board-hero')?.offsetHeight || 0;
  
  window.addEventListener('scroll', () => {
    if (!breadcrumb) return;
    if (window.scrollY > 60) {
      breadcrumb.style.transform = 'translateY(0)';
      breadcrumb.style.opacity = '1';
    }
  }, { passive: true });
  
  
  // ── CARD PHOTO TILT EFFECT ──────────────────
  document.querySelectorAll('.board-card').forEach(card => {
    const inner = card.querySelector('.card-inner');
    if (!inner) return;
  
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -4;
      const tiltY = dx *  4;
      inner.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
    });
  
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
      inner.style.transition = 'transform 0.5s ease';
    });
  
    card.addEventListener('mouseenter', () => {
      inner.style.transition = 'transform 0.1s ease, background 0.42s, box-shadow 0.42s';
    });
  });
  
  
  // ── HERO STATS COUNT-UP ─────────────────────
  function countUp(el, target, duration = 1200, suffix = '') {
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3); // easeOutCubic
      el.textContent = Math.round(ease * target) + suffix;
      if (prog < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.hstat span').forEach(span => {
        const raw = span.textContent.trim();
        const num = parseInt(raw);
        const suffix = raw.replace(String(num), '');
        if (!isNaN(num)) countUp(span, num, 1400, suffix);
      });
      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.8 });
  
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);
  
  
  // ── SECTION EYEBROW LINE ANIMATION ──────────
  const eyebrowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.eyebrow-line').forEach((line, i) => {
          line.style.animation = `growLine 0.8s ease ${i * 0.15}s forwards`;
        });
        eyebrowObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.section-eyebrow').forEach(el => {
    // Set initial state
    el.querySelectorAll('.eyebrow-line').forEach(line => {
      line.style.transform = 'scaleX(0)';
      line.style.transformOrigin = line.classList.contains('eyebrow-line:last-child') ? 'right' : 'left';
    });
    eyebrowObserver.observe(el);
  });
  
  // Add the growLine keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes growLine {
      from { transform: scaleX(0); opacity: 0; }
      to   { transform: scaleX(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  
  // ── SMOOTH ACTIVE SECTION INDICATOR ─────────
  const sections = document.querySelectorAll('.board-section');
  const observer = new IntersectionObserver((entries) => {
    // Future: update navigation pill if added
  }, { threshold: 0.3 });
  sections.forEach(s => observer.observe(s));
  
  
  // ── CARD BIO SCROLL GRADIENT FADE ───────────
  document.querySelectorAll('.card-bio').forEach(bio => {
    function checkScroll() {
      const atBottom = bio.scrollHeight - bio.scrollTop <= bio.clientHeight + 4;
      bio.style.WebkitMaskImage = atBottom
        ? ''
        : 'linear-gradient(to bottom, black 70%, transparent 100%)';
      bio.style.maskImage = bio.style.WebkitMaskImage;
    }
    checkScroll();
    bio.addEventListener('scroll', checkScroll, { passive: true });
  
    // Auto-apply only if content overflows
    if (bio.scrollHeight <= bio.clientHeight + 8) {
      bio.style.WebkitMaskImage = '';
      bio.style.maskImage = '';
    }
  });
  
  
  // ── PHOTO RING INTERACTION ──────────────────
  document.querySelectorAll('.board-card').forEach(card => {
    const ring = card.querySelector('.photo-ring');
    if (!ring) return;
    card.addEventListener('mouseenter', () => {
      ring.style.animationDuration = '4s';
    });
    card.addEventListener('mouseleave', () => {
      ring.style.animationDuration = '12s';
    });
  });
  
  
  // ── PAGE ENTRANCE STAGGER ───────────────────
  // Small delay to ensure all resources are parsed
  window.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    });
  });
  