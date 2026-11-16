/* ════════════════════════════════════════════════════════════
   M — Web Design Studio
   Motion choreography · GSAP + ScrollTrigger + SplitText + DrawSVG

   Keyword → effect map
   ─ Dinamicità   → section depth/scale exits, never hard cuts
   ─ Fluidità     → scrub-based parallax, soft expo easings
   ─ Fiducia      → predictable, consistent motion (one ease family)
   ─ Modernità    → custom cursor, animated loader, pill nav
   ─ Minimalismo  → every tween guides attention, none decorate
   ─ Interattività→ magnetic buttons, cinematic project hovers
   ─ Cinematicità → multi-layer parallax, char/line reveals
   ─ Precision    → animated counters, progressively drawn rules
════════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin);

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE = window.matchMedia('(max-width: 900px)').matches;
const FINE   = window.matchMedia('(pointer: fine)').matches;

/* Parallax intensity: reduced on mobile, never disabled */
const PX = MOBILE ? 0.35 : 1;

/* One shared ease family — motion stays predictable (Fiducia) */
const EASE = 'power4.out';

/* ScrollSmoother instance — created first, everything reads from it */
let smoother = null;

let initialized = false;
function initApp() {
  if (initialized) return;
  initialized = true;

  if (REDUCE) { initReducedMotion(); return; }

  initSmoother();      // inertial scroll: the whole page becomes fluid
  initLoader();        // → calls initHeroIntro() on completion
  initCursor();
  initMagnetic();
  initMenu();
  initPillNav();
  initProgress();      // film-scrubber hairline, page as a timeline
  initParallax();
  initVelocitySkew();  // scroll speed bends the type — cinematic elasticity
  initRules();
  initLineReveals();
  initFillables();     // outline headlines flood fluidly on hover
  initTicker();
  initReel();
  initServices();
  initSectionDepth();
  initHeroScrollCue();
  initClocks();        // live local time + current year
  initBackToTop();
}

if (document.fonts) {
  document.fonts.ready.then(initApp);
}
window.addEventListener('load', initApp);
// Fallback timeout to prevent stuck loader on mobile if fonts load slowly
setTimeout(initApp, 1200);

/* ════════════════════════════════════════════════════════════
   SCROLL SMOOTHER — one inertial clock for the whole film
════════════════════════════════════════════════════════════ */
function initSmoother() {
  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.4,             // desktop inertia
    smoothTouch: false,      // native feel on touch, parallax stays reduced
    effects: false,          // parallax is choreographed manually below
  });

  /* in-page anchors ride the smoothed scroll instead of jumping */
  $$('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href.length < 2) return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      smoother.scrollTo(target, true, 'top top');
    });
  });
}

/* ════════════════════════════════════════════════════════════
   REDUCED MOTION — everything static, everything visible
════════════════════════════════════════════════════════════ */
function initReducedMotion() {
  $$('[data-rule], .section-head__rule, .service__rule')
    .forEach(el => (el.style.transform = 'scaleX(1)'));
  $$('.service [data-num]').forEach(el => (el.textContent = el.closest('.service').dataset.count));
  const video = $('.reel__video');
  if (video) video.controls = true;   // no auto-zoom/play: manual controls instead
  /* outline headlines are filled so they stay legible without hover */
  ['.cta__title', '.footer__lead'].forEach(s => { const el = $(s); if (el) el.style.color = '#F7F7F5'; });
  initClocks();
  initBackToTop();
  initMenu(true); // menu still works, without theatrics
}

/* ════════════════════════════════════════════════════════════
   LOADER — "M" stroke draw + counter + progress line
════════════════════════════════════════════════════════════ */
function initLoader() {
  const loader = $('.loader');
  const num    = $('.loader__num');
  const state  = { p: 0 };

  /* freeze the smoothed scroll while the curtain is up */
  if (smoother) smoother.paused(true);
  document.body.classList.add('no-scroll');

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onComplete: () => {
      loader.remove();
      document.body.classList.remove('no-scroll');
      if (smoother) smoother.paused(false);
    },
  });

  tl
    // the brand logo settles in — calm, precise
    .fromTo('.loader__logo', { autoAlpha: 0, y: 26, scale: .96 },
                             { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: EASE }, .15)
    // progress counter + accent line, perfectly in sync
    .to(state, {
      p: 100, duration: 1.5,
      onUpdate: () => (num.textContent = String(Math.round(state.p)).padStart(2, '0')),
    }, 0)
    .fromTo('.loader__bar-fill', { scaleX: 0 }, { scaleX: 1, duration: 1.5 }, 0)
    // micro-pause on the full logo, then curtain up → into the hero
    .to(loader, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, 1.95)
    .add(initHeroIntro, 1.75);
}

/* ════════════════════════════════════════════════════════════
   HERO INTRO — char-by-char title, drawn orbit
════════════════════════════════════════════════════════════ */
function initHeroIntro() {
  const title = new SplitText('.hero__title .hero__line', { type: 'chars', mask: 'chars' });
  const claim = new SplitText('.hero__claim', { type: 'lines', mask: 'lines' });

  const motionChars = title.chars.filter(c => c.closest('.hero__line--outline'));

  gsap.timeline({ defaults: { ease: EASE } })
    .fromTo(title.chars, { yPercent: 115 },
                         { yPercent: 0, duration: 1.2, stagger: 0.028 }, 0)
    .fromTo(claim.lines, { yPercent: 110 },
                         { yPercent: 0, duration: 1, stagger: .09 }, .5)
    .fromTo('.hero__watermark', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.6 }, .6)
    .fromTo('.hero__foot', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.1)
    /* entrance done → "in motion" starts moving and never stops */
    .call(() => startMotionWave(motionChars), null, 1.5);

  /* the outlined "in motion" floods fluidly on hover — no black stroke left */
  fluidFill($('.hero__line--outline'), motionChars, 'rgba(26,70,255,1)', 'rgba(17,17,17,1)');

  /* typewriter effect on hover for "Design" */
  const designLine = $('.hero__title .hero__line:not(.hero__line--outline)');
  const designChars = title.chars.filter(c => c.closest('.hero__line:not(.hero__line--outline)'));
  if (designLine && designChars.length) {
    let typewriterTl = null;
    designLine.addEventListener('pointerenter', () => {
      if (typewriterTl) typewriterTl.kill();
      typewriterTl = gsap.timeline()
        .set(designChars, { opacity: 0 })
        .to(designChars, {
          opacity: 1,
          stagger: 0.08,
          duration: 0.05,
          ease: "none"
        });
    });
  }
}

/* ════════════════════════════════════════════════════════════
   "IN MOTION" — a slow, endless wave rolls through the glyphs
════════════════════════════════════════════════════════════ */
function startMotionWave(chars) {
  /* free the glyphs from their reveal masks so the wave can breathe */
  chars.forEach((c) => { if (c.parentElement) c.parentElement.style.overflow = 'visible'; });
  chars.forEach((c, i) => {
    gsap.to(c, {
      yPercent: -9,
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.14,
    });
  });
}

/* ════════════════════════════════════════════════════════════
   FLUID LETTER FLOOD — hover a headline and the fill sweeps
   through the word like liquid; the stroke dissolves with it
════════════════════════════════════════════════════════════ */
function fluidFill(container, chars, fillColor, strokeColor) {
  if (!container || !chars.length) return;
  const fill0   = fillColor.replace(/,\s*1\)$/, ',0)');    // transparent twin
  const stroke0 = strokeColor.replace(/,\s*1\)$/, ',0)');
  gsap.set(chars, { color: fill0 });
  if (!FINE) return;                                       // hover-only delight

  const tl = gsap.timeline({ paused: true, defaults: { duration: .45, ease: 'power2.out' } })
    .to(chars, { color: fillColor, stagger: .03 }, 0)
    .to(chars, { webkitTextStrokeColor: stroke0, stagger: .03 }, 0);

  container.addEventListener('pointerenter', () => tl.timeScale(1).play());
  container.addEventListener('pointerleave', () => tl.timeScale(1.4).reverse());
}

function initFillables() {
  const LIGHT = 'rgba(247,247,245,1)';
  const BLUE  = 'rgba(110,134,255,1)';

  /* CTA headline — reveal char by char, then each line floods on hover */
  const ctaTitle = $('.cta__title');
  if (ctaTitle) {
    const s = new SplitText(ctaTitle, { type: 'chars', mask: 'chars' });
    gsap.fromTo(s.chars, { yPercent: 120 }, {
      yPercent: 0, duration: 1, ease: EASE, stagger: .015,
      scrollTrigger: { trigger: ctaTitle, start: 'top 82%' },
    });
    $$('.cta__line', ctaTitle).forEach((line) => {
      const em = line.classList.contains('cta__line--em');
      fluidFill(line, s.chars.filter(c => line.contains(c)),
                em ? BLUE : LIGHT, em ? BLUE : 'rgba(247,247,245,1)');
    });
  }

  /* eyebrow — quiet fade in */
  const eyebrow = $('.cta__eyebrow');
  if (eyebrow) gsap.fromTo(eyebrow, { autoAlpha: 0, y: 16 }, {
    autoAlpha: 1, y: 0, duration: .9, ease: EASE,
    scrollTrigger: { trigger: eyebrow, start: 'top 88%' },
  });

  /* giant footer "Let's talk" */
  const lead = $('.footer__lead-line');
  if (lead) {
    const s = new SplitText(lead, { type: 'chars', mask: 'chars' });
    gsap.fromTo(s.chars, { yPercent: 120 }, {
      yPercent: 0, duration: 1.1, ease: EASE, stagger: .04,
      scrollTrigger: { trigger: '.footer__lead', start: 'top 88%' },
    });
    fluidFill($('.footer__lead'), s.chars, LIGHT, 'rgba(247,247,245,1)');
  }
}

/* ════════════════════════════════════════════════════════════
   FILM SCRUBBER — the whole page reads as one timeline
════════════════════════════════════════════════════════════ */
function initProgress() {
  gsap.fromTo('.progress__bar', { scaleX: 0 }, {
    scaleX: 1, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: true },
  });
}

/* ════════════════════════════════════════════════════════════
   LIVE CLOCK + YEAR — a small "real" signal (Digital Precision)
════════════════════════════════════════════════════════════ */
function initClocks() {
  $$('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
  const clocks = $$('[data-clock]');
  if (!clocks.length) return;
  const tick = () => {
    let t;
    try {
      t = new Date().toLocaleTimeString('en-GB',
        { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      t = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    clocks.forEach(c => (c.textContent = t));
  };
  tick();
  setInterval(tick, 1000);
}

/* ════════════════════════════════════════════════════════════
   BACK TO TOP — rides the smoothed scroll
════════════════════════════════════════════════════════════ */
function initBackToTop() {
  $$('[data-top]').forEach(btn => btn.addEventListener('click', () => {
    if (smoother) smoother.scrollTo(0, true);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
}

/* ════════════════════════════════════════════════════════════
   VELOCITY SKEW — scroll speed shears the type, eases back to rest
════════════════════════════════════════════════════════════ */
function initVelocitySkew() {
  const els = $$('[data-skew]');
  if (!els.length || !smoother) return;
  const setters = els.map(el => gsap.quickSetter(el, 'skewY', 'deg'));
  let cur = 0;
  gsap.ticker.add(() => {
    const target = gsap.utils.clamp(-3, 3, smoother.getVelocity() / -360);
    cur += (target - cur) * 0.1;
    if (Math.abs(cur) < 0.001) cur = 0;
    for (const s of setters) s(cur);
  });
}

/* ════════════════════════════════════════════════════════════
   CUSTOM CURSOR — dot + lagging ring (desktop only)
════════════════════════════════════════════════════════════ */
function initCursor() {
  if (!FINE) return;
  const dot  = $('.cursor-dot');
  const ring = $('.cursor-ring');

  gsap.set([dot, ring], { xPercent: 0, yPercent: 0, autoAlpha: 0 });

  /* quickTo = 60fps updates, the ring lags behind the dot */
  const dx = gsap.quickTo(dot,  'x', { duration: .12, ease: 'power3.out' });
  const dy = gsap.quickTo(dot,  'y', { duration: .12, ease: 'power3.out' });
  const rx = gsap.quickTo(ring, 'x', { duration: .45, ease: 'power3.out' });
  const ry = gsap.quickTo(ring, 'y', { duration: .45, ease: 'power3.out' });

  let shown = false;
  window.addEventListener('mousemove', (e) => {
    if (!shown) { gsap.to([dot, ring], { autoAlpha: 1, duration: .3 }); shown = true; }
    dx(e.clientX); dy(e.clientY);
    rx(e.clientX); ry(e.clientY);
  }, { passive: true });

  /* context-aware states */
  document.addEventListener('mouseover', (e) => {
    ring.classList.toggle('is-view', !!e.target.closest('[data-cursor="view"]'));
    ring.classList.toggle('is-link',
      !e.target.closest('[data-cursor="view"]') &&
      !!e.target.closest('a, button'));
  });
}

/* ════════════════════════════════════════════════════════════
   MAGNETIC ELEMENTS — pulled toward the cursor, spring back
════════════════════════════════════════════════════════════ */
function initMagnetic() {
  if (!FINE) return;
  $$('.magnetic').forEach((el) => {
    const strength = el.classList.contains('cta__btn') ? .45 : .35;
    el.addEventListener('mousemove', (e) => {
      const hero = $('.hero');
      const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
      const scrollY = window.scrollY || (smoother ? smoother.scrollTop() : 0);
      if (el.closest('.site-head') && scrollY < heroHeight) {
        return;
      }
      const b = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - b.left - b.width / 2) * strength,
        y: (e.clientY - b.top - b.height / 2) * strength,
        duration: .5, ease: 'power3.out',
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ════════════════════════════════════════════════════════════
   FULLSCREEN MENU — clip-path curtain + staggered line reveal
════════════════════════════════════════════════════════════ */
function initMenu(reduced = false) {
  const menu     = $('.menu');
  const triggers = $$('.menu-trigger');
  const links    = $$('.menu__link');
  let   open     = false;

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power4.inOut' },
    onReverseComplete: () => gsap.set(menu, { visibility: 'hidden' }),
  });

  if (!reduced) {
    tl
      .set(menu, { visibility: 'visible' })
      .fromTo(menu, { clipPath: 'inset(0 0 100% 0)' },
                    { clipPath: 'inset(0 0 0% 0)', duration: .85 }, 0)
      // links reveal line by line, top → bottom
      .fromTo(links.map(l => l.children), { yPercent: 130 },
              { yPercent: 0, duration: .9, ease: EASE, stagger: .07 }, .4)
      .fromTo('.menu__foot', { autoAlpha: 0, y: 16 },
              { autoAlpha: 1, y: 0, duration: .6, ease: EASE }, .75)
      // trigger morphs: ≡ → ✕
      .to('.trigger__bar--a', { y: 0, rotation: 45,  duration: .5 }, 0)
      .to('.trigger__bar--b', { y: 0, rotation: -45, duration: .5 }, 0);
  } else {
    tl.set(menu, { visibility: 'visible', clipPath: 'inset(0 0 0% 0)' });
  }

  const setOpen = (v) => {
    open = v;
    document.body.classList.toggle('menu-open', v);
    menu.setAttribute('aria-hidden', String(!v));
    triggers.forEach(t => t.setAttribute('aria-expanded', String(v)));
    if (v) { tl.timeScale(1).play(); }
    else   { tl.timeScale(1.5).reverse(); }
  };

  triggers.forEach(t => t.addEventListener('click', () => setOpen(!open)));
  links.forEach(l => l.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) setOpen(false); });
}

/* ════════════════════════════════════════════════════════════
   FLOATING PILL NAV — appears scrolling up, hides scrolling down
════════════════════════════════════════════════════════════ */
function initPillNav() {
  const pill = $('.nav-pill');
  /* x/y:0 wipes the pixel offsets GSAP parses from the CSS fallback
     transform (a matrix), so the percent-based tweens own the position */
  gsap.set(pill, { x: 0, y: 0, xPercent: -50, yPercent: -180 });

  const show = () => gsap.to(pill, { yPercent: 0,    duration: .6, ease: EASE, overwrite: 'auto' });
  const hide = () => gsap.to(pill, { yPercent: -180, duration: .5, ease: 'power3.in', overwrite: 'auto' });

  ScrollTrigger.create({
    start: 160,
    end: 'max',
    onUpdate: (self) => (self.direction === -1 ? show() : hide()),
    onLeaveBack: hide,   // back at the very top → full header takes over
  });
}

/* ════════════════════════════════════════════════════════════
   MULTI-LAYER PARALLAX — every [data-speed] element
   speed < 1 → drifts slower (background depth)
   speed > 1 → drifts faster (foreground)
   Scrubbed 1:1 to the scrollbar. Intensity reduced on mobile.
════════════════════════════════════════════════════════════ */
function initParallax() {
  $$('[data-speed]').forEach((el) => {
    const speed   = parseFloat(el.dataset.speed);
    const section = el.closest('[data-section]') || el.closest('section') || el;
    const isHero  = section.classList.contains('hero');
    const shift   = (1 - speed) * 420 * PX;

    gsap.fromTo(el, { y: isHero ? 0 : -shift * .4 }, {
      y: shift,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: isHero ? 'top top' : 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  /* manifesto watermark M draws itself while the section passes */
  gsap.fromTo('.manifesto__bg path', { drawSVG: '0%' }, {
    drawSVG: '100%',
    ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top 90%', end: 'center center', scrub: true },
  });
}

/* ════════════════════════════════════════════════════════════
   RULES — hairlines draw in progressively (Digital Precision)
════════════════════════════════════════════════════════════ */
function initRules() {
  $$('[data-rule]').forEach((el) => {
    gsap.to(el, {
      scaleX: 1, duration: 1.4, ease: EASE,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
}

/* ════════════════════════════════════════════════════════════
   LINE REVEALS — manifesto & CTA copy, masked line by line
════════════════════════════════════════════════════════════ */
function initLineReveals() {
  $$('[data-lines]').forEach((el) => {
    const split = new SplitText(el, { type: 'lines', mask: 'lines' });
    gsap.fromTo(split.lines, { yPercent: 110 }, {
      yPercent: 0, duration: 1.1, ease: EASE, stagger: .09,
      scrollTrigger: { trigger: el, start: 'top 82%' },
    });
  });
}

/* ════════════════════════════════════════════════════════════
   KINETIC TICKER — endless drift, accelerated by scroll velocity
════════════════════════════════════════════════════════════ */
function initTicker() {
  const track = $('.ticker__track');
  if (!track) return;

  /* endless loop: the track is two identical halves, -50% = seamless */
  const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 26, repeat: -1 });

  /* scroll velocity bends time: faster scroll = faster type,
     scrolling up plays the strip backwards */
  ScrollTrigger.create({
    trigger: '.ticker',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate(self) {
      const v = smoother ? smoother.getVelocity() : self.getVelocity();
      const boost = gsap.utils.clamp(1, 4.5, 1 + Math.abs(v) / 800);
      gsap.to(loop, { timeScale: (v < 0 ? -1 : 1) * boost, duration: .25, overwrite: true });
    },
  });
  /* ease back to cruise speed once the scroll settles */
  ScrollTrigger.addEventListener('scrollEnd', () =>
    gsap.to(loop, { timeScale: 1, duration: 1.4, ease: 'power2.out', overwrite: true }));
}

/* ════════════════════════════════════════════════════════════
   SHOWREEL — pinned zoom parallax
   The frame zooms from a floating card to full screen while the
   stage is pinned; the film starts the instant the zoom lands.
════════════════════════════════════════════════════════════ */
function initReel() {
  const stage = $('.reel__stage');
  const frame = $('.reel__frame');
  const video = $('.reel__video');
  const sound = $('.reel__sound');
  if (!stage || !video) return;

  const startScale = MOBILE ? .68 : .52;
  let zoomDone = false;

  /* on arrival the film restarts from frame 0, every time */
  const playFromStart = () => { try { video.currentTime = 0; } catch (e) {} video.play().catch(() => {}); };
  const play  = () => video.play().catch(() => {});
  const pause = () => video.pause();

  /* zoom timeline, scrubbed 1:1 with the scroll */
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: '+=160%',
      pin: true,
      scrub: true,
      onUpdate(self) {
        const arrived = self.progress >= .96;
        if (arrived && !zoomDone) { zoomDone = true; playFromStart(); }  // start from the beginning
        if (!arrived && zoomDone) { zoomDone = false; pause(); }
      },
    },
  });

  tl
    // the frame takes over the screen
    .fromTo(frame, { scale: startScale, borderRadius: MOBILE ? 14 : 20 },
                   { scale: 1, borderRadius: 0, duration: 1 }, 0)
    // inner counter-zoom: the film settles as the frame expands
    .fromTo(video, { scale: 1.18 }, { scale: 1, duration: 1 }, 0)
    // the giant word drifts up and gives way (slower layer)
    .to('.reel__bigtitle', { yPercent: -60 * PX, autoAlpha: 0, duration: .55 }, 0)
    .to(['.reel__side--l', '.reel__side--r', '.reel__hint'], { autoAlpha: 0, duration: .3 }, 0)
    // scrim, caption + sound control land with the full frame
    .to(['.reel__shade', '.reel__caption', '.reel__sound'], { opacity: 1, duration: .12 }, .88)
    .set(sound, { pointerEvents: 'auto' }, .88);

  /* pause the film once the section is fully out of view */
  ScrollTrigger.create({
    trigger: $('.reel'),
    start: 'top bottom',
    end: 'bottom top',
    onLeave: pause,
    onLeaveBack: pause,
    onEnterBack: () => { if (zoomDone) play(); },
  });

  /* sound toggle — the reel has its own soundtrack */
  sound.addEventListener('click', () => {
    video.muted = !video.muted;
    sound.classList.toggle('is-on', !video.muted);
    sound.setAttribute('aria-pressed', String(!video.muted));
    if (!video.muted && video.paused) play();
  });
}

/* ════════════════════════════════════════════════════════════
   SERVICES — counters tick up, rows rise, rules draw
════════════════════════════════════════════════════════════ */
function initServices() {
  $$('.service').forEach((row) => {
    const numEl  = $('[data-num]', row);
    const target = parseInt(row.dataset.count, 10);
    const state  = { n: 0 };

    gsap.timeline({
      scrollTrigger: { trigger: row, start: 'top 85%' },
      defaults: { ease: EASE },
    })
      .fromTo([$('.service__index', row), $('.service__name', row), $('.service__desc', row)],
              { y: 54, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 1, stagger: .09 }, 0)
      .to(state, {
        n: target, duration: 1.1, ease: 'power2.out',
        onUpdate: () => (numEl.textContent = String(Math.round(state.n)).padStart(2, '0')),
      }, 0);
  });
}

/* ════════════════════════════════════════════════════════════
   SECTION DEPTH — blocks settle back as they exit (no hard cuts)
════════════════════════════════════════════════════════════ */
function initSectionDepth() {
  $$('[data-section]').forEach((sec) => {
    /* skip the finale (cta + footer), and the reel: a transform on
       the pinned stage's ancestor would break ScrollTrigger's pinning */
    if (sec.classList.contains('cta') || sec.classList.contains('reel')
        || sec.classList.contains('footer')) return;
    gsap.fromTo(sec, { scale: 1, opacity: 1 }, {
      scale: .965, opacity: .45,
      transformOrigin: 'center 20%',
      ease: 'none',
      scrollTrigger: { trigger: sec, start: 'bottom 55%', end: 'bottom top', scrub: true },
    });
  });
}

/* ════════════════════════════════════════════════════════════
   HERO SCROLL CUE — a quiet, looping pulse
════════════════════════════════════════════════════════════ */
function initHeroScrollCue() {
  gsap.timeline({ repeat: -1, repeatDelay: .6 })
    .fromTo('.hero__scroll-line', { scaleY: 0, transformOrigin: 'top' },
                                  { scaleY: 1, duration: .7, ease: 'power2.inOut' })
    .to('.hero__scroll-line',     { scaleY: 0, transformOrigin: 'bottom', duration: .7, ease: 'power2.inOut' }, '+=.15');
}
