/* ─────────────────────────────────────────────
   JUSTSITES — JavaScript
   • Mesh Gradient Canvas Animation
   • Navbar scroll behavior
   • Scroll-triggered card stack (Full Screen + Peeking Edges)
───────────────────────────────────────────── */

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
   3. SCROLL REVEAL CARD STACK
══════════════════════════════════════════ */
(function initCardStack() {
  const slides = Array.from(document.querySelectorAll('.card-slide'));
  if (!slides.length) return;

  const PEEK_STEP = 40; // visible edge at the bottom for each waiting card

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function updateCards() {
    const vh = window.innerHeight;
    const scrollY = window.scrollY;

    slides.forEach((slide, i) => {
      const card = slide.querySelector('.project-card') || slide.querySelector('.final-wrapper');
      if (!card) return;

      // The point in scroll where this slide reaches the top of the viewport
      let slideTop = slide.offsetTop;
      
      // Calculate how far we are from pinning this slide
      let delta = slideTop - scrollY;
      
      // Calculate how many px this card should peek from the bottom
      // So Card 1 peeks highest, Card 4 peeks lowest
      // actually: Card 0 doesn't wait, Card 1 waits at PEEK*3, Card 2 at PEEK*2 etc.
      const cardsRemaining = slides.length - 1 - i;
      const peekFromBottom = cardsRemaining * PEEK_STEP + 20; 
      
      const startViewportY = vh - peekFromBottom;

      let y = 0;
      if (delta >= vh) {
        // We are more than 100vh away from this slide pinning.
        // It should rest peeking at the bottom of the viewport.
        y = startViewportY - delta;
      } else if (delta > 0) {
        // We are within 100vh of this slide pinning! It slides up over the previous pinned slide.
        const progress = 1 - (delta / vh); // 0 to 1
        const eased = easeOutQuad(progress); 
        const currentViewportY = startViewportY * (1 - eased);
        y = currentViewportY - delta;
      } else {
        // Fully pinned!
        y = 0;
      }

      card.style.transform = `translateY(${y}px)`;
    });
  }

  // Use RequestAnimationFrame for silky smooth 60fps scrolling
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateCards();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateCards, { passive: true });
  
  // Initial frame
  updateCards();
})();

/* ══════════════════════════════════════════
   4. SMOOTH PARALLAX on hero headline
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
   5. PRICE CARD TILT
══════════════════════════════════════════ */
(function initPriceTilt() {
  const cards = document.querySelectorAll('.price-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

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
