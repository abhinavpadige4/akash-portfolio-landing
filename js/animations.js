// js/animations.js
// ------------------------------------------------------------
// Scroll‑reveal observer & hover‑parallax effects
// ------------------------------------------------------------
// This script is imported via <script src="js/animations.js"></script>
// It works with the design tokens defined in css/animations.css and
// expects elements to have the class "reveal" (or any of the specific
// animation helpers like "fade-up", "slide-in-left", etc.). When an
// element becomes visible the class "is-visible" is added, triggering
// the CSS animation defined in css/animations.css.
// ------------------------------------------------------------

(() => {
  // Respect prefers‑reduced‑motion – if the user prefers reduced motion,
  // we skip all animations and simply make elements visible.
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // -----------------------------------------------------------------
  // 1️⃣ Scroll‑reveal IntersectionObserver
  // -----------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px', // start revealing a bit before fully in view
      threshold: 0.1,
    };

    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animation only once
        }
      });
    };

    const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

    revealElements.forEach(el => {
      // If reduced motion, just show immediately
      if (prefersReduced.matches) {
        el.classList.add('is-visible');
      } else {
        revealObserver.observe(el);
      }
    });
  }

  // -----------------------------------------------------------------
  // 2️⃣ Hover‑parallax for hero background & project cards
  // -----------------------------------------------------------------
  // Hero background: we use an inline SVG gradient that moves slightly
  // based on mouse position. The hero section must have id="hero".
  const hero = document.getElementById('hero');
  if (hero) {
    const bg = hero.querySelector('.hero-bg'); // element that holds the gradient
    if (bg) {
      hero.addEventListener('mousemove', e => {
        const { width, height, left, top } = hero.getBoundingClientRect();
        const x = ((e.clientX - left) / width - 0.5) * 10; // -5 to +5
        const y = ((e.clientY - top) / height - 0.5) * 10;
        bg.style.transform = `translate(${x}px, ${y}px)`;
      });
      hero.addEventListener('mouseleave', () => {
        bg.style.transform = 'translate(0, 0)';
      });
    }
  }

  // Project cards parallax on hover – each card should have class "project-card"
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const inner = card.querySelector('.card-inner');
    if (!inner) return;
    card.addEventListener('mousemove', e => {
      const { width, height, left, top } = card.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 8; // subtle tilt
      const y = ((e.clientY - top) / height - 0.5) * 8;
      inner.style.transform = `rotateX(${ -y }deg) rotateY(${ x }deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  // -----------------------------------------------------------------
  // 3️⃣ Expose a tiny API for potential external calls (optional)
  // -----------------------------------------------------------------
  window.scrollReveal = {
    observe: (el) => {
      if (prefersReduced.matches) {
        el.classList.add('is-visible');
        return;
      }
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { root: null, threshold: 0.1, rootMargin: '0px' });
      observer.observe(el);
    }
  };
})();
