// js/main.js
// Navigation toggle, smooth scrolling, active link highlighting,
// form handling with toast, and initialization of scroll‑reveal animations.

(() => {
  // ----- Utility -----
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const $ = (sel) => document.querySelector(sel);

  // ----- Navigation -----
  const navToggle = $('#nav-toggle');
  const navMenu = $('#nav-menu');
  const navLinks = $$('nav a[href^="#"]');
  const header = $('header'); // sticky header

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
    });
  }

  // Close mobile menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const headerHeight = header ? header.offsetHeight : 0;
        const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // hide mobile menu after navigation
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ----- Active link highlighting on scroll -----
  const sections = $$('section[id]');
  const setActiveLink = () => {
    const scrollPos = window.pageYOffset + (header ? header.offsetHeight : 0) + 2;
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.pageYOffset;
      const bottom = top + sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = $(`nav a[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', setActiveLink);
  // initial call
  setActiveLink();

  // ----- Form handling & toast -----
  const form = $('#contact-form');
  const toast = $('#toast');
  if (form && toast) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // In a real app you would send data via fetch/AJAX.
      // Here we just show a success toast.
      toast.textContent = '✅ Message sent! Thank you.';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
      form.reset();
    });
  }

  // ----- Initialize scroll‑reveal animations -----
  // The animations module exposes a global initAnimations function.
  if (typeof window.initAnimations === 'function') {
    window.initAnimations();
  }
})();
