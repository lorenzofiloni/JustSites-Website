/* ─────────────────────────────────────────────
   JUSTSITES — JavaScript
   • Mesh Gradient Canvas Animation
   • Navbar scroll behavior
   • Scroll-triggered card animations
   • Pricing cards reveal
───────────────────────────────────────────── */

/* ══════════════════════════════════════════
   1. MESH GRADIENT CANVAS
══════════════════════════════════════════ */
(function initMeshGradient() {
  const canvas = document.getElementById('meshCanvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Control points for the mesh
  const colors = [
    { r: 112, g: 185, b: 232 },   // #70B9E8 — sky blue
    { r: 168, g: 135, b: 255 },   // #A887FF — violet
    { r: 224, g: 107, b: 217 },   // #E06BD9 — magenta
    { r:  30, g:  20, b:  60 },   // deep purple (dark anchor)
  ];

  // Animated blobs
  const blobs = [
    { x: 0.2, y: 0.2, vx: 0.00035, vy: 0.00055, ci: 0, r: 0.68 },
    { x: 0.7, y: 0.3, vx: -0.0004, vy: 0.00045, ci: 1, r: 0.72 },
    { x: 0.5, y: 0.7, vx: 0.00028, vy: -0.0005, ci: 2, r: 0.65 },
    { x: 0.1, y: 0.8, vx: 0.00042, vy: -0.0003, ci: 3, r: 0.55 },
  ];

  let frame = 0;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function draw() {
    frame++;
    const W = canvas.width;
    const H = canvas.height;

    // Move blobs
    blobs.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -0.1 || b.x > 1.1) b.vx *= -1;
      if (b.y < -0.1 || b.y > 1.1) b.vy *= -1;
    });

    // Build image pixel by pixel (using offscreenCanvas for perf)
    // Instead: composite radial gradients
    ctx.fillStyle = '#08080f';
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'screen';

    blobs.forEach((b, i) => {
      const c = colors[b.ci];
      const cx = b.x * W;
      const cy = b.y * H;
      const radius = b.r * Math.max(W, H);

      // Slight pulsing
      const pulse = 1 + 0.06 * Math.sin(frame * 0.012 + i * 1.3);

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * pulse);
      grd.addColorStop(0,   `rgba(${c.r},${c.g},${c.b}, 0.85)`);
      grd.addColorStop(0.4, `rgba(${c.r},${c.g},${c.b}, 0.35)`);
      grd.addColorStop(1,   `rgba(${c.r},${c.g},${c.b}, 0)`);

      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.ellipse(
        cx, cy,
        radius * pulse * 1.2,
        radius * pulse,
        frame * 0.003 + i * 0.7,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';

    // Overlay dark vignette to center text
    const vignette = ctx.createRadialGradient(
      W * 0.5, H * 0.5, 0,
      W * 0.5, H * 0.5, Math.max(W, H) * 0.75
    );
    vignette.addColorStop(0,   'rgba(8,8,15,0)');
    vignette.addColorStop(0.6, 'rgba(8,8,15,0.25)');
    vignette.addColorStop(1,   'rgba(8,8,15,0.72)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(draw);
  }

  draw();
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
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const rotX  =  dy * -5;
      const rotY  =  dx *  5;

      card.style.transform = `
        translateY(-6px)
        scale(1.005)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
      `;
    });

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
