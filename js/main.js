// ========== HEADER SCROLL EFFECT ==========
const mainHeader = document.querySelector('.main-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    mainHeader.classList.add('scrolled');
  } else {
    mainHeader.classList.remove('scrolled');
  }
});

// ========== MOBILE MENU ==========
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    menuToggle.innerHTML = navMenu.classList.contains('show') ? '✕' : '☰';
  });
}

// ========== SCROLL REVEAL ==========
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .jurusan-card, .blog-card, .stat-card, .testimonial-card').forEach(el => {
  observer.observe(el);
});

// ========== COUNTER ANIMATION ==========
const counters = document.querySelectorAll('.stat-number[data-count]');

const animateCounter = (counter) => {
  const target = parseInt(counter.getAttribute('data-count'));
  const duration = 2000;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;
  
  const updateCounter = () => {
    current += step;
    if (current >= target) {
      counter.textContent = target.toLocaleString();
      return;
    }
    counter.textContent = current.toLocaleString();
    requestAnimationFrame(updateCounter);
  };
  
  updateCounter();
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ========== ACTIVE NAVIGATION ==========
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a').forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === currentPage) {
    link.classList.add('active');
  }
});

// ========== SET CURRENT YEAR ==========
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});