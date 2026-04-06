/* =============================================
   ARHICA Teams & Departments — JS
   Scroll reveal, card tilt, micro-interactions
============================================= */

// ── SCROLL REVEAL ──────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0');
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  
  
  // ── HERO PARALLAX ──────────────────────────
  window.addEventListener('scroll', () => {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
  }, { passive: true });
  
  
  // ── CARD TILT ──────────────────────────────
  document.querySelectorAll('.dept-card, .tier-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `
        perspective(800px)
        rotateX(${dy * -3.5}deg)
        rotateY(${dx *  3.5}deg)
        translateY(-6px)
      `;
      card.style.transition = 'transform 0.1s ease, box-shadow 0.4s, background 0.4s, border-color 0.4s';
    });
  
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.4,0,0.2,1)';
    });
  });
  
  
  // ── FLOW CARD STAGGER ──────────────────────
  const flowSection = document.querySelector('.flow-section');
  if (flowSection) {
    const fcObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.flow-card').forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 180);
        });
        fcObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    fcObserver.observe(flowSection);
  }
  
  
  // ── ROLE LIST HOVER RIPPLE ─────────────────
  document.querySelectorAll('.role-list li').forEach(li => {
    li.addEventListener('mouseenter', function() {
      this.style.transition = 'color 0.2s ease, padding-left 0.2s ease, background 0.2s ease';
      this.style.background  = 'rgba(11,94,62,0.04)';
      this.style.borderRadius = '6px';
      this.style.paddingLeft  = '6px';
    });
    li.addEventListener('mouseleave', function() {
      this.style.background   = '';
      this.style.paddingLeft  = '';
    });
  });
  
  
  // ── DEPT ICON SPIN ON HOVER ────────────────
  document.querySelectorAll('.dept-icon-wrap').forEach(icon => {
    let timeout;
    icon.closest('.dept-card')?.addEventListener('mouseenter', () => {
      icon.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
      icon.style.transform  = 'scale(1.1) rotate(-8deg)';
    });
    icon.closest('.dept-card')?.addEventListener('mouseleave', () => {
      icon.style.transform = '';
      icon.style.transition = 'transform 0.5s ease';
    });
  });
  
  
  // ── PAGE ENTRANCE FADE ─────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity    = '1';
    });
  });
  
  
  // ── FOOTNOTE STAGGER ──────────────────────
  const footnote = document.querySelector('.flow-footnote');
  if (footnote) {
    const fnObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.footnote-item').forEach((item, i) => {
          item.style.opacity   = '0';
          item.style.transform = 'translateY(14px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'translateY(0)';
          }, i * 140);
        });
        fnObs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    fnObs.observe(footnote);
  }
  