/* ─────────────────────────────────────────────
   JUSTSITES — JavaScript
   • Mesh Gradient Canvas Animation
   • Navbar scroll behavior
   • Scroll-triggered card animations
   • Pricing cards reveal
───────────────────────────────────────────── */

/* ═══════════════════════════════════════════
   1. MESH GRADIENT — Paper Design WebGL Shader
══════════════════════════════════════════ */
import {
  ShaderMount,
  meshGradientFragmentShader,
  getShaderColorFromString,
} from '@paper-design/shaders';
(function initMeshGradient() {
  const container = document.getElementById('meshCanvas');

  new ShaderMount(
    container,
    meshGradientFragmentShader,
    {
      u_colors: [
        getShaderColorFromString('#70B9E8'),
        getShaderColorFromString('#A887FF'),
        getShaderColorFromString('#E06BD9'),
        getShaderColorFromString('#0a0a1a'),
      ],
      u_colorsCount: 4,
      u_distortion:  0.9,
      u_swirl:       0.38,
      u_scale:       1,
      u_fit:         2,
    },
    undefined,
    0.7,
    0
  );
})();


/* ══════════════════════════════════════════
   2. NAVBAR SCROLL BEHAVIOR
══════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
})();


/* ══════════════════════════════════════════
   3. SCROLL REVEAL — PROJECT CARDS (stacked file feel)
══════════════════════════════════════════ */
(function initCardReveal() {
  const cards = document.querySelectorAll('.project-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger cards when multiple enter at once
          const card = entry.target;
          const delay = parseInt(card.dataset.index || 0) * 80;
          setTimeout(() => {
            card.classList.add('in-view');
          }, delay);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  cards.forEach(card => observer.observe(card));
})();


/* ══════════════════════════════════════════
   4. SCROLL REVEAL — PRICING CARDS
══════════════════════════════════════════ */
(function initPricingReveal() {
  const priceCards = document.querySelectorAll('.price-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  priceCards.forEach(card => observer.observe(card));
})();


/* ══════════════════════════════════════════
   5. SMOOTH PARALLAX on hero headline
══════════════════════════════════════════ */
(function initParallax() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const offset = Math.min(y * 0.25, 160);
    headline.style.transform = `translateY(${offset}px)`;
    headline.style.opacity = Math.max(0, 1 - y / 550);
  }, { passive: true });
})();


/* ══════════════════════════════════════════
   6. CARD HOVER — 3D tilt effect
══════════════════════════════════════════ */
(function initTilt() {
  // Full-width cards: only subtle lift, no perspective tilt
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ══════════════════════════════════════════
   7. PRICE CARD TILT
══════════════════════════════════════════ */
(function initPriceTilt() {
  const cards = document.querySelectorAll('.price-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);

      const featured = card.classList.contains('featured');
      const baseY = featured ? -12 : -8;

      card.style.transform = `
        translateY(${baseY}px)
        rotateX(${dy * -4}deg)
        rotateY(${dx * 4}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      const featured = card.classList.contains('featured');
      card.style.transform = featured ? 'translateY(-12px)' : '';
    });
  });
})();
