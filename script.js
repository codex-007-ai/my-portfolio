/* ============================================================
   PSN Chaitanya — The Journey
   script.js — cinematic story engine
   ============================================================ */

(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Typing animation ---------- */
  const typingEl = $('#typingText');
  const roles = ['Student.', 'Developer.', 'Builder.', 'Future Engineer.'];

  if (typingEl) {
    let r = 0, c = 0, del = false;
    (function loop() {
      const cur = roles[r];
      if (!del) {
        typingEl.textContent = cur.slice(0, c + 1);
        c++;
        if (c === cur.length) { del = true; setTimeout(loop, 1700); return; }
        setTimeout(loop, 85);
      } else {
        typingEl.textContent = cur.slice(0, c - 1);
        c--;
        if (c === 0) { del = false; r = (r + 1) % roles.length; setTimeout(loop, 420); return; }
        setTimeout(loop, 40);
      }
    })();
  }

  /* ---------- Scroll progress ---------- */
  const progress = $('#scrollProgress');
  function updateProgress() {
    const top = window.scrollY || document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (top / h) * 100 : 0) + '%';
  }

  /* ---------- Nav ---------- */
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

  /* ---------- Mobile nav ---------- */
  const navToggle = $('#navToggle');
  const navWrap = $('#navLinks');
  navToggle.addEventListener('click', () => {
    const open = navWrap.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.forEach((l) => l.addEventListener('click', () => {
    navWrap.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- Back to top ---------- */
  const backTop = $('#backTop');
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  function updateBackTop() { backTop.classList.toggle('visible', window.scrollY > 500); }

  /* ---------- Reveal observer (words, moment, floats) ---------- */
  const revealEls = $$('.reveal-word, .reveal-moment, .reveal-float');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => revealObs.observe(el));

  /* ---------- Timeline reveals + spine fill ---------- */
  const tlNodes = $$('.tl-node');
  const tlObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); tlObs.unobserve(e.target); }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
  tlNodes.forEach((n) => tlObs.observe(n));

  // Spine fill across both timeline segments
  const timelineEl = $('#timeline');
  const timelineResume = $('#timelineResume');
  const fill = $('#timelineFill');
  function updateSpine() {
    if (!timelineEl || !fill) return;
    // Combine both segments: full journey from first timeline to end of resume
    const startRect = timelineEl.getBoundingClientRect();
    const endEl = timelineResume || timelineEl;
    const endRect = endEl.getBoundingClientRect();
    const totalH = (endRect.bottom) - (startRect.top);
    const viewportMid = window.innerHeight * 0.5;
    const scrolled = viewportMid - startRect.top;
    const pct = Math.max(0, Math.min(1, scrolled / totalH));
    fill.style.height = (pct * 100) + '%';
  }

  /* ---------- Shamrocks moment trigger + particles ---------- */
  const momentEl = $('#shamrockMoment');
  const particleHost = $('#shamrockParticles');
  if (momentEl && particleHost) {
    // Spawn drifting shamrock particles
    const count = 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'moment__particle';
      p.textContent = '🍀';
      p.style.left = (Math.random() * 90 + 5) + '%';
      p.style.bottom = (Math.random() * 30) + '%';
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.animationDuration = (6 + Math.random() * 5) + 's';
      p.style.fontSize = (0.9 + Math.random() * 1.1) + 'rem';
      particleHost.appendChild(p);
    }
    const momentObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { momentEl.classList.add('in'); momentObs.unobserve(momentEl); }
      });
    }, { threshold: 0.35 });
    momentObs.observe(momentEl);
  }

  /* ---------- Cursor spotlight ---------- */
  const spotlight = $('#spotlight');
  let spotlightOn = false;
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      spotlight.style.left = e.clientX + 'px';
      spotlight.style.top = e.clientY + 'px';
      if (!spotlightOn) { spotlight.classList.add('on'); spotlightOn = true; }
    }, { passive: true });
  }

  /* ---------- Mouse parallax (hero chips, orbs, cards) ---------- */
  const parallaxEls = $$('[data-parallax]');
  let mouseX = 0, mouseY = 0;
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  /* ---------- Scroll parallax ---------- */
  function applyScrollParallax() {
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = center - window.innerHeight / 2;
      const ty = -dist * speed;
      el.style.transform = `translateY(${ty}px)`;
    });
  }

  /* ============================================================
     ChaiBot — scroll-position guide
     ============================================================ */
  const chaiBot = $('#chaiBot');
  const chaiBubble = $('#chaiBotBubble');
  const chaiMsg = $('#chaiBotMsg');
  const chaiAvatar = $('#chaiBotAvatar');

  // Section-level messages
  const sectionMsgs = {
    hero: "Welcome. I'm ChaiBot — your guide through this journey. Scroll to begin.",
    prologue: "Every journey starts somewhere. Let's walk through mine.",
    journey: "This is the heart of it all — the milestones that shaped me. Watch the path light up as you scroll.",
    builds: "From ideas to products. These are the things I've built so far.",
    future: "The journey is still being written. Here's where it's heading next.",
  };

  // Milestone-triggered messages (by timeline node index, 0-based within .timeline)
  const milestoneMsgs = [
    { idx: 0, msg: "It started with gold. 🥇 Two years, back to back." },
    { idx: 1, msg: "Science talent recognized. The curiosity was growing." },
    { idx: 2, msg: "Words have power too. Silver, but the lesson was golden." },
    { idx: 3, msg: "A national stage. Pariksha Pe Charcha, 2023. 🇮🇳" },
    { idx: 4, msg: "Innovation in action — Scaler YIIC 7. 💡" },
    { idx: 5, msg: "Effort, recognized. Sometimes showing up is the win." },
    { idx: 6, msg: "This was a turning point. Captain era unlocked 🍀" },
    { idx: 7, msg: "Named after a Nobel laureate. Science excellence. 🏅" },
    { idx: 8, msg: "88.67% — a strong foundation laid." },
    { idx: 9, msg: "88.9% — stepping closer to the future." },
    { idx: 10, msg: "The journey continues. Developer mode: ON. 💻" },
  ];

  let bubbleTimer = null, typeTimer = null;
  let currentMsg = null;
  let milestoneShown = new Set();

  function showChaiMsg(text, hold = 5600) {
    if (!text || text === currentMsg) return;
    currentMsg = text;
    clearTimeout(bubbleTimer);
    clearTimeout(typeTimer);

    chaiBubble.classList.add('show', 'typing');
    chaiMsg.textContent = '';

    setTimeout(() => {
      chaiBubble.classList.remove('typing');
      let i = 0;
      (function typeChar() {
        if (i <= text.length) {
          chaiMsg.textContent = text.slice(0, i);
          i++;
          typeTimer = setTimeout(typeChar, 24);
        }
      })();
    }, 650);

    bubbleTimer = setTimeout(() => {
      chaiBubble.classList.remove('show');
      currentMsg = null;
    }, hold + 650);
  }

  // Track all timeline nodes (both segments) in order
  const allTlNodes = $$('.tl-node');

  // Observe each milestone for ChaiBot narration
  allTlNodes.forEach((node, i) => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (milestoneShown.has(i)) return;
        milestoneShown.add(i);
        // Map to milestone message; the Shamrocks moment sits between segments
        const match = milestoneMsgs.find((m) => m.idx === i);
        if (match) showChaiMsg(match.msg, 5000);
      });
    }, { threshold: 0.6 });
    obs.observe(node);
  });

  // Section messages
  const chaiSectionObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      if (sectionMsgs[id]) showChaiMsg(sectionMsgs[id], 5600);
    });
  }, { threshold: 0.4 });
  sections.forEach((s) => chaiSectionObs.observe(s));
  const prologueEl = $('#prologue');
  if (prologueEl) chaiSectionObs.observe(prologueEl);

  // Also trigger Shamrocks message when the moment enters view
  if (momentEl) {
    const shamrockObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        showChaiMsg("This was a turning point. Captain era unlocked 🍀", 6000);
        shamrockObs.unobserve(momentEl);
      });
    }, { threshold: 0.4 });
    shamrockObs.observe(momentEl);
  }

  // Tap mascot to replay
  chaiAvatar.addEventListener('click', () => {
    showChaiMsg("Let's continue. Scroll to keep walking the journey.", 5000);
  });

  // Greeting
  let greeted = false;
  function greet() {
    if (greeted) return;
    greeted = true;
    setTimeout(() => showChaiMsg(sectionMsgs.hero, 6500), 1200);
    window.removeEventListener('scroll', greet);
    window.removeEventListener('pointermove', greet);
  }
  window.addEventListener('scroll', greet, { passive: true });
  window.addEventListener('pointermove', greet, { passive: true });

  /* ---------- Scroll loop (rAF throttled) ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      updateNav();
      updateBackTop();
      updateSpine();
      applyScrollParallax();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mouse parallax loop ---------- */
  let pTicking = false;
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', () => {
      if (pTicking) return;
      pTicking = true;
      requestAnimationFrame(() => {
        $$('[data-drift]').forEach((el) => {
          const depth = parseFloat(el.dataset.parallax) || 0.05;
          el.style.marginLeft = (mouseX * depth * 40) + 'px';
          el.style.marginTop = (mouseY * depth * 40) + 'px';
        });
        pTicking = false;
      });
    }, { passive: true });
  }

  // Initial paint
  updateProgress();
  updateNav();
  updateBackTop();
  updateSpine();
})();
