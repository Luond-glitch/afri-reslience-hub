const tips = [
    "ARHICA empowers youth and women across the Lake Victoria Basin",
    "Over 1000+ youth engaged in climate action initiatives",
    "SamakiLog app digitizes fisheries management",
    "Sustainable fish cage enterprises create decent jobs",
    "Environmental restoration partnerships rebuild ecosystems",
    "Gender Equality & Social Inclusion is at our core",
    "Working across 7+ Sustainable Development Goals",
    "Building climate resilience in Kisumu City and beyond"
  ];

  let currentTip = 0;
  let progress = 0;
  const totalDuration = 2500; // 2.5 seconds total loading time
  const intervalTime = 30; // Update every 30ms for smooth animation
  const steps = totalDuration / intervalTime;
  const increment = 100 / steps;

  // Rotate tips every 2 seconds
  setInterval(() => {
    currentTip = (currentTip + 1) % tips.length;
    const tipElement = document.getElementById('tipText');
    if (tipElement) {
      tipElement.style.opacity = '0';
      setTimeout(() => {
        tipElement.textContent = tips[currentTip];
        tipElement.style.opacity = '1';
      }, 300);
    }
  }, 2000);

  // Create floating particles
  function createParticles() {
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 60 + 10;
      const duration = Math.random() * 15 + 8;
      const delay = Math.random() * 10;
      const left = Math.random() * 100;
      
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${Math.random() * 0.3 + 0.1};
      `;
      
      document.body.appendChild(particle);
    }
  }

  // Animate progress bar
  function animateProgress() {
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        // Store loading complete flag
        sessionStorage.setItem('arhicaLoaded', 'true');
        
        // Redirect to main page
        setTimeout(() => {
          window.location.href = 'main.html';
        }, 300);
      }
      
      // Update UI
      const percentageElement = document.getElementById('percentage');
      const progressFill = document.getElementById('progressFill');
      
      if (percentageElement) {
        percentageElement.textContent = Math.floor(currentProgress) + '%';
      }
      if (progressFill) {
        progressFill.style.width = currentProgress + '%';
      }
    }, intervalTime);
  }

  // Handle page visibility and preload
  function preloadMainPage() {
    // Preload critical resources for main page
    const links = [
      'style.css',
      'pop.css',
      'script.js',
      'pop.js'
    ];
    
    links.forEach(link => {
      if (link.endsWith('.css')) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'style';
        preloadLink.href = link;
        document.head.appendChild(preloadLink);
      } else if (link.endsWith('.js')) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'script';
        preloadLink.href = link;
        document.head.appendChild(preloadLink);
      }
    });
  }

  // Handle responsive particle regeneration on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const particles = document.querySelectorAll('.particle');
      particles.forEach(p => p.remove());
      createParticles();
    }, 250);
  });

  // Initialize
  createParticles();
  preloadMainPage();
  animateProgress();

  // Fallback: Ensure redirect happens even if something goes wrong
  setTimeout(() => {
    if (progress < 100) {
      window.location.href = 'main.html';
    }
  }, 5000);