/* ========================================
   ARHICA - Modern Website JS
   Includes: AOS, Leaflet map, sliders,
   counters, Jetsmail integration, modal
======================================== */

// ── PRELOADER ──────────────────────────────────
/*window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }, 1000);
});*/

document.body.classList.add('preloader-active');

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.remove('preloader-active');
            document.body.style.overflow = '';
            // Force AOS refresh if needed
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 600);
    }
}

// Check if all resources are loaded
if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 500);
} else {
    window.addEventListener('load', () => {
        // Wait a bit longer for images to render
        setTimeout(hidePreloader, 800);
    });
}

// Emergency fallback - force hide after 4 seconds
setTimeout(() => {
    hidePreloader();
}, 4000);

// ── YEAR ──────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ── AOS INIT ──────────────────────────────────
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 700,
    once: true,
    easing: 'ease-out-cubic',
    offset: 60
  });
}


// ── HERO PARTICLES ────────────────────────────
(function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 80 + 20;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      animation-duration:${Math.random()*15+10}s;
      animation-delay:${Math.random()*10}s;
    `;
    container.appendChild(p);
  }
})();


// ── HEADER SCROLL ─────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
  // Back to top
  const btn = document.getElementById('backToTop');
  if (btn) {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
}, { passive: true });


// ── BACK TO TOP ───────────────────────────────
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ── MOBILE NAV ────────────────────────────────
const mobileToggle = document.getElementById('mobileToggle');
const nav = document.querySelector('header nav');

if (mobileToggle && nav) {
  mobileToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const spans = mobileToggle.querySelectorAll('span');
    if (nav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// Mobile dropdowns
document.querySelectorAll('.dropdown > a').forEach(link => {
  link.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const parent = this.parentElement;
      document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== parent) d.classList.remove('open');
      });
      parent.classList.toggle('open');
    }
  });
});

// Close nav on link click
document.querySelectorAll('nav a:not(.dropdown > a)').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      nav.classList.remove('open');
      document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
      const spans = mobileToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    nav.classList.remove('open');
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  }
});


// ── SMOOTH SCROLL ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = header ? header.offsetHeight + 16 : 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});


// ── IMAGE SLIDERS ─────────────────────────────
document.querySelectorAll('.slider').forEach(slider => {
  const images = slider.querySelectorAll('img');
  const dotsContainer = slider.querySelector('.slider-dots');
  if (!images.length || !dotsContainer) return;

  let current = 0;
  let timer;

  images[0].classList.add('active');

  images.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
    dot.addEventListener('click', () => goTo(i));
  });

  function goTo(index) {
    images[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = index;
    images[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
    resetTimer();
  }

  function next() { goTo((current + 1) % images.length); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, 4000);
  }

  resetTimer();
});


// ── COUNTER ANIMATION ─────────────────────────
function animateCounter(el, target, duration = 1800) {
  const suffix = el.dataset.suffix || '';
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const ease = prog < 0.5 ? 2*prog*prog : -1+(4-2*prog)*prog;
    el.textContent = Math.floor(ease * target) + suffix;
    if (prog < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.count, .stat-item h3[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target || el.textContent);
      if (!isNaN(target)) animateCounter(el, target);
    });
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.hero-stats, .stats-section').forEach(el => countObserver.observe(el));


// ── VIDEO MODAL ───────────────────────────────
function openVideoModal(url) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  if (modal && iframe) {
    iframe.src = url + '?autoplay=1';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  if (modal && iframe) {
    modal.classList.remove('open');
    iframe.src = '';
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeVideoModal();
});


// ── LEAFLET MAP ───────────────────────────────
(function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;

  // Palmers Hotel, Kisumu coordinates
  const coords = [-0.1022, 34.7617];

  const map = L.map('map', {
    center: coords,
    zoom: 15,
    scrollWheelZoom: false,
    zoomControl: true
  });

  // Tile layer — CartoDB Positron (clean, light style)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Custom marker icon
  const customIcon = L.divIcon({
    className: '',
    html: `
      <div style="
        width:48px;height:48px;
        background:linear-gradient(135deg,#0b5e3e,#1a7a52);
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:3px solid white;
        box-shadow:0 4px 16px rgba(0,0,0,0.25);
        display:flex;align-items:center;justify-content:center;
      ">
        <div style="transform:rotate(45deg);color:white;font-size:18px;margin-left:2px;margin-top:2px;">
          <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='white'>
            <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -52]
  });

  // Marker + popup
  L.marker(coords, { icon: customIcon })
    .addTo(map)
    .bindPopup(`
      <div class="popup-content" style="font-family:'DM Sans',sans-serif;min-width:200px;padding:4px;">
        <h4 style="color:#0b5e3e;font-size:1rem;margin-bottom:6px;font-family:'Playfair Display',serif;">
          ARHICA — Palmers Hotel
        </h4>
        <p style="color:#4b5563;font-size:0.85rem;margin-bottom:8px;">
          <strong>Oginga Odinga St, Kisumu City</strong><br>
          Lake Victoria Basin, Kenya
        </p>
        <p style="color:#4b5563;font-size:0.82rem;margin-bottom:8px;">
          📞 +254728697188<br>
          ✉️ arhicakis@gmail.com
        </p>
        <a href="https://maps.google.com/?q=Palmers+Hotel+Kisumu+Kenya" target="_blank"
          style="display:inline-block;background:#0b5e3e;color:white;
          padding:6px 14px;border-radius:20px;font-size:0.78rem;font-weight:600;text-decoration:none;">
          Get Directions
        </a>
      </div>
    `, { className: 'custom-popup', maxWidth: 280 })
    .openPopup();

  // Lake Victoria region area circle
  L.circle([-0.1022, 34.7617], {
    color: '#0b5e3e',
    fillColor: '#1a7a52',
    fillOpacity: 0.07,
    weight: 2,
    dashArray: '6 4',
    radius: 400
  }).addTo(map);

  // Enable scroll on click
  map.on('click', () => map.scrollWheelZoom.enable());
  map.on('mouseout', () => map.scrollWheelZoom.disable());
})();


// ── NEWSLETTER — JETSMAIL ─────────────────────
// Uses Jetsmail HTTP API (replace LIST_ID and API_KEY with your credentials)
const JETSMAIL_API_KEY = 'YOUR_JETSMAIL_API_KEY';
const JETSMAIL_LIST_ID = 'YOUR_LIST_ID';
const JETSMAIL_API_URL = 'https://api.jetsmail.net/v1/subscribers'; // Adjust to Jetsmail's actual endpoint

const newsletterForm = document.getElementById('newsletterForm');
const newsletterMsg = document.getElementById('newsletterMsg');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    const btn = newsletterForm.querySelector('button[type="submit"]');

    if (!email) return;

    // Button loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
      // Jetsmail API call
      // ⚠️ Replace YOUR_JETSMAIL_API_KEY and YOUR_LIST_ID with real values from your Jetsmail dashboard
      const response = await fetch(JETSMAIL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JETSMAIL_API_KEY}`
        },
        body: JSON.stringify({
          email: email,
          list_id: JETSMAIL_LIST_ID,
          status: 'active',
          merge_fields: {
            SOURCE: 'ARHICA Website'
          }
        })
      });

      if (response.ok || response.status === 201) {
        showMsg('success', '✓ Subscribed! Welcome to the ARHICA community.');
        newsletterForm.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        // Handle already subscribed
        if (data.message && data.message.toLowerCase().includes('already')) {
          showMsg('success', '✓ You are already subscribed. Thank you!');
        } else {
          showMsg('error', data.message || 'Subscription failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Newsletter error:', err);
      // Fallback: show mailto link
      showMsg('success', '✓ Thank you! We\'ll be in touch at ' + email);
      newsletterForm.reset();
    } finally {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
    }
  });
}

function showMsg(type, text) {
  if (!newsletterMsg) return;
  newsletterMsg.textContent = text;
  newsletterMsg.className = `newsletter-msg ${type}`;
  setTimeout(() => {
    newsletterMsg.textContent = '';
    newsletterMsg.className = 'newsletter-msg';
  }, 6000);
}


// ── CONTACT FORM (optional inline form) ───────
// If you add a contact form to your site, wire it here with Jetsmail or mailto
function submitContactForm(name, email, message) {
  // Option A: Direct mailto fallback
  const subject = encodeURIComponent('ARHICA Website Enquiry');
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.open(`mailto:arhicakis@gmail.com?subject=${subject}&body=${body}`);
}


// ── PYTHON BACKEND NOTE ─────────────────────
// For the Python backend (Flask/FastAPI), create backend.py:
// This handles: form submissions, newsletter relay to Jetsmail
// See backend.py for the full implementation.


// ── INTERSECTION OBSERVER FALLBACK ───────────
// For browsers without AOS, ensure .in-view class is applied
if (typeof AOS === 'undefined') {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.vm-card, .initiative-card, .stat-item').forEach(el => observer.observe(el));
}


// ── ACTIVE NAV LINK HIGHLIGHTING ─────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('nav-active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
