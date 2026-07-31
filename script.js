/* ============================================================
   PSN Chaitanya — Portfolio
   script.js — interactions & animations
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Current year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Typing animation ---------- */
  const typingEl = $('#typingText');
  const roles = ['Student.', 'Developer.', 'Community Contributor.', 'Innovator.', 'Lifelong Learner.'];

  if (typingEl) {
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function typeLoop() {
      const current = roles[roleIdx];

      if (!deleting) {
        typingEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1700);
          return;
        }
        setTimeout(typeLoop, 80);
      } else {
        typingEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(typeLoop, 420);
          return;
        }
        setTimeout(typeLoop, 40);
      }
    }
    typeLoop();
  }

  /* ---------- Scroll progress bar ---------- */
  const progress = $('#scrollProgress');

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    progress.style.width = pct + '%';
  }

  /* ---------- Nav: scrolled state + active link ---------- */
  const nav = $('#nav');
  const navLinks = $$('.nav__link');
  const sections = navLinks
    .map((link) => $(`#${link.dataset.section}`))
    .filter(Boolean);

  function updateNav() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    const offset = window.innerHeight * 0.35;
    let activeIdx = 0;
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top <= offset) activeIdx = i;
    }
    navLinks.forEach((link, i) => {
      link.classList.toggle('is-active', i === activeIdx);
    });
  }

  /* ---------- Back to top ---------- */
  const backTop = $('#backTop');
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function updateBackTop() {
    backTop.classList.toggle('visible', window.scrollY > 500);
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = $('#navToggle');
  const navLinksWrap = $('#navLinks');

  navToggle.addEventListener('click', () => {
    const open = navLinksWrap.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinksWrap.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Goal progress bars ---------- */
  const goalBars = $$('.goal__bar span');
  const goalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const span = entry.target;
          const target = span.style.width;
          span.style.width = '0%';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              span.style.width = target;
            });
          });
          goalObserver.unobserve(span);
        }
      });
    },
    { threshold: 0.3 }
  );
  goalBars.forEach((span) => goalObserver.observe(span));

  /* ---------- Interactive timeline (expand/collapse) ---------- */
  const timelineItems = $$('.timeline__item');
  timelineItems.forEach((item) => {
    const card = item.querySelector('.timeline__card');
    card.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      timelineItems.forEach((other) => other.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* ---------- Count-up stats ---------- */
  const statNums = $$('.hero__stat-num');
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
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
    },
    { threshold: 0.5 }
  );
  statNums.forEach((el) => statObserver.observe(el));

  /* ---------- ChaiBot guide ---------- */
  const chaiBot = $('#chaiBot');
  const chaiBubble = $('#chaiBotBubble');
  const chaiMsg = $('#chaiBotMsg');

  // Messages keyed by section id. ChaiBot reacts as each section enters view.
  const chaiMessages = {
    hero: "Hi! I'm ChaiBot — your guide. Scroll down and I'll point out the highlights!",
    about: "Three roles, one mission: Student, Developer, and Community Contributor.",
    journey: "This is the journey timeline! Tap any milestone to expand its full story.",
    achievements: "The Achievement Wall — 14 wins and counting. Notice the glowing Shamrocks card!",
    projects: "Four projects built so far — Chai Archive, Chai Vault, Chai QR, and the Command Center.",
    certificates: "A gallery of every certificate. The green one is my proudest — House Captain.",
    goals: "Current goals with live progress bars. I'm always chasing the next milestone.",
    vision: "The future vision — where all this learning is headed. Thanks for scrolling with me!",
  };

  let bubbleTimer = null;
  let lastSection = null;

  function showChaiMsg(text, hold = 5200) {
    if (!text) return;
    chaiMsg.textContent = text;
    chaiBubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      chaiBubble.classList.remove('show');
    }, hold);
  }

  // Section observer for ChaiBot
  const chaiObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (id === lastSection) return;
        lastSection = id;
        showChaiMsg(chaiMessages[id] || "Keep scrolling — there's more to explore!");
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((sec) => chaiObserver.observe(sec));

  // Tap the mascot to replay the current section's message
  const chaiAvatar = chaiBot.querySelector('.chaibot__avatar');
  chaiAvatar.addEventListener('click', () => {
    const msg = chaiMessages[lastSection || 'hero'];
    showChaiMsg(msg, 6000);
  });

  // Greeting on first interaction
  let greeted = false;
  function greetOnce() {
    if (greeted) return;
    greeted = true;
    setTimeout(() => showChaiMsg(chaiMessages.hero, 6000), 900);
    window.removeEventListener('scroll', greetOnce, { once: true });
    window.removeEventListener('pointermove', greetOnce, { once: true });
  }
  window.addEventListener('scroll', greetOnce, { once: true });
  window.addEventListener('pointermove', greetOnce, { once: true });

  /* ---------- Scroll listener (throttled via rAF) ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      updateNav();
      updateBackTop();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial paint
  updateProgress();
  updateNav();
  updateBackTop();
})();
