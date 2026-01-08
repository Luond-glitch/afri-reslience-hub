document.getElementById('year').textContent = new Date().getFullYear();
// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobileToggle');
const mainNav = document.getElementById('mainNav');

mobileToggle.addEventListener('click', () => {
  mainNav.classList.toggle('active');
  mobileToggle.innerHTML = mainNav.classList.contains('active') 
    ? '<i class="fas fa-times"></i>' 
    : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('active');
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Scroll animations using Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-image, .vm-card, .initiative-card, .stat-item').forEach(el => {
  observer.observe(el);
});

// Animate stats counting
const animateCounter = (element, start, end, duration) => {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statItems = entry.target.querySelectorAll('.stat-item');
      const values = [1000, 3, 10, 7];
      
      statItems.forEach((item, index) => {
        const numberElement = item.querySelector('h3');
        const targetValue = values[index];
        
        // Check if the element contains a number
        if (!isNaN(parseInt(numberElement.textContent))) {
          animateCounter(numberElement, 0, targetValue, 1500);
        }
      });
      
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Observe stats section
const statsSection = document.querySelector('.stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// Newsletter form submission
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    if (email) {
      alert(`Thank you for subscribing with ${email}! We'll keep you updated on ARHICA's initiatives.`);
      newsletterForm.reset();
    }
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Logo hover effect enhancement
const logoContainer = document.querySelector('.logo-container');
const logoImg = document.querySelector('.logo-img');

if (logoContainer && logoImg) {
  // Preload logo hover effect
  logoImg.addEventListener('mouseenter', () => {
    logoImg.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
  
  logoImg.addEventListener('mouseleave', () => {
    logoImg.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.1)';
  });
}
// Image slider with dots (reusable)
document.querySelectorAll(".slider").forEach(slider => {
  const images = slider.querySelectorAll("img");
  const dotsContainer = slider.querySelector(".slider-dots");

  // Safety check
  if (!images.length || !dotsContainer) return;

  let current = 0;

  // Activate first image
  images[0].classList.add("active");

  // Create dots
  images.forEach((_, index) => {
    const dot = document.createElement("span");
    if (index === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);

    dot.addEventListener("click", () => {
      images[current].classList.remove("active");
      dotsContainer.children[current].classList.remove("active");

      current = index;

      images[current].classList.add("active");
      dotsContainer.children[current].classList.add("active");
    });
  });

  // Auto slide
  setInterval(() => {
    images[current].classList.remove("active");
    dotsContainer.children[current].classList.remove("active");

    current = (current + 1) % images.length;

    images[current].classList.add("active");
    dotsContainer.children[current].classList.add("active");
  }, 3500);
});

