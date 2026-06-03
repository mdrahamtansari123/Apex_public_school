/* ═══════════════════════════════════════════════════
   APEX PUBLIC SCHOOL — MAIN JS
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────── NAVBAR ─────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu  = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* Active link on scroll */
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observer.observe(s));

  /* ─────────────────────────── HERO SLIDER ─────────────────────── */
  const slides      = document.querySelectorAll('.slide');
  const dots        = document.querySelectorAll('.dot');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  let   current     = 0;
  let   sliderTimer = null;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAutoPlay() {
    sliderTimer = setInterval(() => goToSlide(current + 1), 5000);
  }

  function resetAutoPlay() {
    clearInterval(sliderTimer);
    startAutoPlay();
  }

  prevBtn.addEventListener('click', () => { goToSlide(current - 1); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { goToSlide(current + 1); resetAutoPlay(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goToSlide(+dot.dataset.index); resetAutoPlay(); });
  });
  startAutoPlay();

  /* Touch/swipe on slider */
  const sliderEl = document.querySelector('.hero-slider');
  let touchStartX = 0;
  sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  sliderEl.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) { dx > 0 ? goToSlide(current + 1) : goToSlide(current - 1); resetAutoPlay(); }
  });

  /* ─────────────────────────── STATS COUNTER ──────────────────── */
  const statNums = document.querySelectorAll('.stat-num');
  let counted = false;

  function animateCounters() {
    if (counted) return;
    counted = true;
    statNums.forEach(el => {
      const target = +el.dataset.target;
      const duration = 1800;
      const step = target / (duration / 16);
      let val = 0;
      const timer = setInterval(() => {
        val = Math.min(val + step, target);
        el.textContent = Math.floor(val).toLocaleString();
        if (val >= target) clearInterval(timer);
      }, 16);
    });
  }

  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) animateCounters();
  }, { threshold: 0.4 });
  const statsBand = document.querySelector('.stats-band');
  if (statsBand) statsObserver.observe(statsBand);

  /* ─────────────────────────── GALLERY FILTER ─────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
        if (show) {
          item.style.animation = 'fadeScale .35s ease both';
        }
      });
    });
  });

  /* Inject fade-scale keyframe */
  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes fadeScale { from { opacity:0; transform:scale(.92); } to { opacity:1; transform:scale(1); } }`;
  document.head.appendChild(styleTag);

  /* ─────────────────────────── LIGHTBOX ───────────────────────── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img').src;
      const alt = item.querySelector('img').alt;
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ─────────────────────────── TESTIMONIALS CAROUSEL ──────────── */
  const track          = document.getElementById('testimonialsTrack');
  const testimonials   = track ? track.querySelectorAll('.testimonial-card') : [];
  const prevTest       = document.getElementById('prevTestimonial');
  const nextTest       = document.getElementById('nextTestimonial');
  let   testIndex      = 0;

  function getVisible() {
    return window.innerWidth < 640 ? 1 : 2;
  }

  function updateCarousel() {
    const cardW = testimonials[0] ? testimonials[0].offsetWidth + 24 : 0;
    track.style.transform = `translateX(-${testIndex * cardW}px)`;
  }

  if (prevTest && nextTest) {
    nextTest.addEventListener('click', () => {
      const max = Math.max(0, testimonials.length - getVisible());
      testIndex = Math.min(testIndex + 1, max);
      updateCarousel();
    });
    prevTest.addEventListener('click', () => {
      testIndex = Math.max(testIndex - 1, 0);
      updateCarousel();
    });
    window.addEventListener('resize', updateCarousel);
  }

  /* ─────────────────────────── CONTACT FORM ───────────────────── */
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        contactForm.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1200);
    });
  }

  /* ─────────────────────────── SCROLL TO TOP ─────────────────── */
  const scrollTopBtn = document.getElementById('scrollTop');
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─────────────────────────── SCROLL REVEAL ─────────────────── */
  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .reveal { opacity:0; transform:translateY(30px); transition:opacity .6s ease, transform .6s ease; }
    .reveal.in-view { opacity:1; transform:translateY(0); }
  `;
  document.head.appendChild(revealStyle);

  const revealElements = document.querySelectorAll(
    '.facility-card, .activity-card, .leader-card-sm, .protection-card, .life-card, .gallery-item, .testimonial-card'
  );
  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(el => revealObserver.observe(el));

});
