// ========================================
// SENTINELA DIGITAL - JS FINAL ESTÁVEL
// ========================================

/* ================= HEADER SCROLL ================= */

const header = document.querySelector('.header');

if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 12px rgba(0,0,0,.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

/* ================= MOBILE MENU ================= */

const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileToggle.classList.remove('active');
    });
  });
}

/* ================= NUMBER ANIMATION ================= */

const animateNumber = (el, target, suffix = '', prefix = '') => {
  let current = 0;
  const duration = 1500;
  const step = target / (duration / 16);

  const timer = setInterval(() => {
    current += step;

    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    el.textContent = `${prefix}${Math.floor(current)}${suffix}`;
  }, 16);
};

const numberObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const original = el.textContent.trim();

    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    if (original.includes('%')) {
      animateNumber(el, parseInt(original), '%');
    }
    else if (original.includes('R$') && original.includes('B')) {
      animateNumber(el, parseInt(original.replace(/[^\d]/g, '')), 'B', 'R$ ');
    }
    else if (original.includes('M')) {
      animateNumber(el, parseInt(original), 'M');
    }
    else {
      animateNumber(el, parseInt(original));
    }

    numberObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-number').forEach(el => {
  numberObserver.observe(el);
});

/* ================= CONSOLE SIGNATURE ================= */

console.log(
  '%cSentinela Digital 🛡️',
  'font-size:18px;font-weight:800;color:#2563eb'
);
console.log(
  '%cProjeto Acadêmico | AWS Serverless + IA',
  'font-size:12px;color:#6b7280'
);
