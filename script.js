// ========================================
// SENTINELA DIGITAL - INTERACTIVE FEATURES
// ========================================

// Header scroll effect
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Smooth reveal on scroll
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after animation (performance)
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .stat-card, .tech-card, .team-member, .conf-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(el);
});

// Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
  });
  
  // Close menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileToggle.classList.remove('active');
    });
  });
}

// Add mobile menu styles dynamically
const mobileStyles = document.createElement('style');
mobileStyles.innerHTML = `
  @media (max-width: 768px) {
    .nav-links {
      position: fixed;
      top: 85px;
      right: -100%;
      width: 250px;
      height: calc(100vh - 85px);
      background: white;
      flex-direction: column;
      padding: 40px 24px;
      gap: 24px;
      box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
      transition: right 0.3s ease;
      z-index: 999;
    }
    
    .nav-links.active {
      right: 0;
    }
    
    .mobile-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(7px, 7px);
    }
    
    .mobile-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    
    .mobile-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }
  }
`;
document.head.appendChild(mobileStyles);

// Animate numbers on scroll
const animateNumber = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    // Format number
    const text = element.dataset.originalText || element.textContent;
    
    if (text.includes('%')) {
      element.textContent = Math.floor(current) + '%';
    } else if (text.includes('M+') || text.includes('M')) {
      element.textContent = (current / 1000000).toFixed(text.includes('+') ? 0 : 1) + 'M' + (text.includes('+') ? '+' : '');
    } else if (text.includes('K')) {
      element.textContent = (current / 1000).toFixed(0) + 'K';
    } else if (text.includes('B')) {
      element.textContent = 'R$ ' + (current / 1000000000).toFixed(0) + 'B';
    } else if (text.includes('s')) {
      element.textContent = current.toFixed(1) + 's';
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
};

// Trigger number animations when visible
const numberObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numberEl = entry.target;
      const text = numberEl.textContent;
      
      // Store original text
      if (!numberEl.dataset.originalText) {
        numberEl.dataset.originalText = text;
      }
      
      // Extract number from text
      let target;
      if (text.includes('%')) {
        target = parseInt(text);
      } else if (text.includes('M+')) {
        target = parseFloat(text) * 1000000;
      } else if (text.includes('M')) {
        target = parseFloat(text) * 1000000;
      } else if (text.includes('K')) {
        target = parseFloat(text) * 1000;
      } else if (text.includes('B')) {
        target = parseFloat(text.replace('R$ ', '')) * 1000000000;
      } else if (text.includes('s')) {
        target = parseFloat(text);
      } else {
        target = parseFloat(text);
      }
      
      if (!isNaN(target)) {
        numberEl.textContent = '0';
        animateNumber(numberEl, target, 1500);
      }
      
      numberObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Observe stat numbers
document.querySelectorAll('.stat-number, .mini-number, .impact-number').forEach(el => {
  numberObserver.observe(el);
});

// Console easter egg for developers
console.log(
  '%cSentinela Digital 🛡️',
  'font-size: 24px; font-weight: bold; color: #3b82f6;'
);
console.log(
  '%cArquitetura AWS Serverless | Bedrock + Textract + Lambda',
  'font-size: 14px; color: #475569;'
);
console.log(
  '%cGitHub: https://github.com/seu-user/sentinela-digital',
  'font-size: 12px; color: #94a3b8;'
);