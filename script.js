/* ============================================================
   PSN Chaitanya — Portfolio (Premium Edition)
   script.js — guided story interactions
   ============================================================ */

(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Current year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Typing animation ---------- */
  const typingEl = $('#typingText');
  const roles = ['Student.', 'Developer.', 'Community Contributor.', 'Innovator.', 'Lifelong Learner.'];

  if (typingEl) {
    let roleIdx = 0, charIdx = 0, deleting = false;

    function typeLoop() {
      const current = roles[roleIdx];
      if (!deleting) {
        typingEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) { deleting = true; setTimeout(typeLoop, 1700); return; }
        setTimeout(typeLoop, 80);
      } else {
        typingEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(typeLoop, 420); return; }
        setTimeout(typeLoop, 40);
      }
    }
    typeLoop();
  }

  /* ---------- Scroll progress bar ---------- */
  const progress = $('#scrollProgress');
  function updateProgress() {
    const top = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (height > 0 ? (top / height) * 100 : 0) + '%';
  }

  /* ---------- Nav: scrolled state + active link ---------- */
  const nav = $('#nav');
  const navLinks = $$('.nav__link');
  const sections = navLinks.map((l) => $('#' + l.dataset.section)).filter(Boolean);

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const offset = window.innerHeight * 0.35;
    let active = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= offset) active = i;
    }
    navLinks.forEach((l, i) => l.classList.toggle('is-active', i === active));
  }

  /* ---------- Back to top ---------- */
  const backTop = $('#backTop');
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  function updateBackTop() { backTop.classList.toggle('visible', window.scrollY > 500); }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = $('#navToggle');
  const navLinksWrap = $('#navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinksWrap.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.forEach((l) => l.addEventListener('click', () => {
    navLinksWrap.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Timeline reveals (slide-in) + spine fill ---------- */
  const tItems = $$('.t-item');
  const tObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); tObserver.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  tItems.forEach((el) => tObserver.observe(el));

  // Animated spine fill — grows as you scroll through the timeline
  const timelineEl = $('#timeline');
  const timelineFill = $('#timelineFill');
  function updateTimelineFill() {
    if (!timelineEl || !timelineFill) return;
    const rect = timelineEl.getBoundingClientRect();
    const viewportH = window.innerHeight;
    // Progress: how far the timeline top has scrolled past the viewport top
    const start = viewportH * 0.5;
    const scrolled = start - rect.top;
    const total = rect.height;
    const pct = Math.max(0, Math.min(1, scrolled / total));
    timelineFill.style.height = (pct * 100) + '%';
  }

  /* ---------- Interactive timeline (expand/collapse) ---------- */
  tItems.forEach((item) => {
    const card = item.querySelector('.t-item__card');
    card.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      tItems.forEach((o) => o.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* ---------- Count-up stats ---------- */
  const statNums = $$('.hero__stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNums.forEach((el) => statObserver.observe(el));

  /* ---------- Certificate lightbox ---------- */
  const lightbox = $('#lightbox');
  const lightboxOverlay = $('#lightboxOverlay');
  const lightboxClose = $('#lightboxClose');
  const lightboxFrame = $('#lightboxFrame');
  const lightboxCaption = $('#lightboxCaption');

  function openLightbox(frameHTML, caption) {
    lightboxFrame.innerHTML = frameHTML;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxFrame.innerHTML = ''; lightboxCaption.textContent = ''; }, 400);
  }

  $$('.cert').forEach((cert) => {
    const trigger = () => {
      const inner = cert.querySelector('.cert__inner');
      const caption = cert.querySelector('figcaption').textContent;
      openLightbox(inner.outerHTML, caption);
    };
    cert.querySelector('.cert__frame').addEventListener('click', trigger);
    cert.querySelector('.cert__expand').addEventListener('click', (e) => { e.stopPropagation(); trigger(); });
  });
  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- ChaiBot — friendly portfolio companion ---------- */
  const chaiBot = $('#chaiBot');
  const chaiBubble = $('#chaiBotBubble');
  const chaiMsg = $('#chaiBotMsg');
  const chaiAvatar = $('#chaiBotAvatar');

  const chaiMessages = {
    hero: "Hi! I'm ChaiBot, your guide. Follow along — I'll narrate the journey as you scroll.",
    about: "Three roles, one mission. Student, developer, community contributor — each feeds the next.",
    journey: "This is the centerpiece — the full journey. Tap any milestone to unfold its story. Watch the spine light up as you scroll!",
    achievements: "The Achievement Wall — 14 wins as medal cards. The glowing green one is my proudest: Shamrocks House Captain.",
    projects: "My builds — Chai Archive is the featured one. Check the status badges to see what's live, in progress, or planned.",
    certificates: "Every certificate in one gallery. Click any frame to expand it for a closer look.",
    vision: "The journey is still being written. Here's the roadmap ahead — thanks for scrolling with me!",
  };

  let bubbleTimer = null;
  let typeTimer = null;
  let lastSection = null;

  function showChaiMsg(text, hold = 5600) {
    if (!text) return;
    clearTimeout(bubbleTimer);
    clearTimeout(typeTimer);

    // Typing dots phase
    chaiBubble.classList.add('show', 'typing');
    chaiMsg.textContent = '';

    const typeDelay = 650;
    setTimeout(() => {
      chaiBubble.classList.remove('typing');
      // Character-by-character reveal
      let i = 0;
      function typeChar() {
        if (i <= text.length) {
          chaiMsg.textContent = text.slice(0, i);
          i++;
          typeTimer = setTimeout(typeChar, 22);
        }
      }
      typeChar();
    }, typeDelay);

    bubbleTimer = setTimeout(() => chaiBubble.classList.remove('show'), hold + typeDelay);
  }

  // Section observer — ChaiBot narrates as each section enters view
  const chaiObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      if (id === lastSection) return;
      lastSection = id;
      showChaiMsg(chaiMessages[id] || "Keep scrolling — there's more to explore!");
    });
  }, { threshold: 0.4 });
  sections.forEach((s) => chaiObserver.observe(s));

  // Tap mascot to replay current section message
  chaiAvatar.addEventListener('click', () => {
    showChaiMsg(chaiMessages[lastSection || 'hero'], 6000);
  });

  // Greeting on first interaction
  let greeted = false;
  function greetOnce() {
    if (greeted) return;
    greeted = true;
    setTimeout(() => showChaiMsg(chaiMessages.hero, 6500), 1000);
    window.removeEventListener('scroll', greetOnce);
    window.removeEventListener('pointermove', greetOnce);
  }
  window.addEventListener('scroll', greetOnce, { passive: true });
  window.addEventListener('pointermove', greetOnce, { passive: true });

  /* ---------- Scroll listener (rAF throttled) ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      updateNav();
      updateBackTop();
      updateTimelineFill();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial paint
  updateProgress();
  updateNav();
  updateBackTop();
  updateTimelineFill();
})();
