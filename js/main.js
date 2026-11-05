/* PAWAY — ingresso dell’apertura, un solo parallax tra apertura e «Come funziona»,
   schermata che cambia a ogni passaggio, reveal una tantum delle sezioni in basso.
   Senza JavaScript, su mobile o con movimento ridotto la pagina resta statica e visibile. */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const root = document.documentElement;

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
const STAGE_QUERY = "(min-width: 900px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)";

const STORES = [
  {
    key: "appStore",
    small: "Scarica su",
    label: "App Store",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.8-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.2-1.2 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.8-1-2.8-4.3zM14 5.3c.7-.8 1.2-2 1-3.2-1 .1-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3.1 1.1.1 2.2-.6 2.9-1.4z"/></svg>',
  },
  {
    key: "googlePlay",
    small: "Disponibile su",
    label: "Google Play",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M4 2.6c-.3.3-.4.7-.4 1.2v16.4c0 .5.1.9.4 1.2l9.2-9.4L4 2.6zm10.6 10.8 2.6 2.6-11.6 6.6c-.3.2-.7.2-1 .1l10-9.3zm0-2.8L4.6 1.3c.3-.1.7-.1 1 .1l11.6 6.6-2.6 2.6zm3.9 1.3 2.6 1.5c.8.5.8 1.3 0 1.8l-2.6 1.5-2.9-2.9 2.9-1.9z"/></svg>',
  },
];

function renderStores() {
  const host = $("[data-stores]");
  const links = (window.PAWAY_CONFIG && window.PAWAY_CONFIG.stores) || {};
  const available = STORES.filter((s) => /^https:\/\/\S+$/.test(String(links[s.key] || "").trim()));
  if (!available.length) return;
  host.innerHTML = available.map((s) => `
    <a class="store" href="${links[s.key].trim()}" rel="noopener">
      ${s.icon}
      <span><small>${s.small}</small><strong>${s.label}</strong></span>
    </a>
  `).join("");
}

function focusDownloadOnJump() {
  const target = $("#download");
  $$('a[href="#download"]').forEach((link) => {
    link.addEventListener("click", () => {
      window.setTimeout(() => target.focus({ preventScroll: true }), 0);
    });
  });
}

function initHeader() {
  const head = $("[data-head]");
  const update = () => head.classList.toggle("is-scrolled", window.scrollY > 12);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function showScreen(index) {
  $$("[data-screen]").forEach((img) => {
    const on = Number(img.dataset.screen) === index;
    img.classList.toggle("is-active", on);
    img.setAttribute("aria-hidden", on ? "false" : "true");
  });
  $$("[data-step]").forEach((step) => {
    step.classList.toggle("is-active", Number(step.dataset.step) === index);
  });
}

/* Ingresso dell’apertura: testo dall’alto verso il basso, poi telefono e chip */
function playIntro() {
  root.classList.add("is-ready");
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from("[data-intro]", { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.09 }, 0)
    .from("[data-device]", { y: 70, autoAlpha: 0, duration: 1.1 }, 0.3)
    .from("[data-chip]", { y: 18, scale: 0.94, autoAlpha: 0, duration: 0.7, stagger: 0.12, ease: "back.out(1.6)" }, 0.9);
  return tl;
}

/* Il telefono segue appena il puntatore (solo desktop) */
function initTilt(device) {
  const rx = gsap.quickTo(device, "rotationX", { duration: 0.8, ease: "power3.out" });
  const ry = gsap.quickTo(device, "rotationY", { duration: 0.8, ease: "power3.out" });
  const onMove = (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    ry(nx * 6);
    rx(-ny * 4);
  };
  const onLeave = () => { rx(0); ry(0); };
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  return () => {
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", onLeave);
    gsap.set(device, { rotationX: 0, rotationY: 0 });
  };
}

/* La sfera di Helpaw si muove solo con movimento consentito e solo quando è in vista */
function initOrb() {
  const orb = $("[data-orb]");
  if (!orb || !window.matchMedia(MOTION_QUERY).matches) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting }) => {
      if (isIntersecting) orb.play().catch(() => {});
      else orb.pause();
    });
  }, { rootMargin: "120px" });
  io.observe(orb);
}

/* Scorrimento morbido: Lenis interpola la posizione, ScrollTrigger si aggiorna sul suo tick.
   Lo scroll resta nativo (niente wrapper trasformati), quindi il telefono sticky continua a funzionare. */
function initSmoothScroll() {
  if (!window.Lenis) return null;
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  /* I link interni passano da Lenis: niente salto nativo, stesso margine della scroll-padding */
  const onClick = (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
    const hash = link.getAttribute("href");
    const target = hash === "#top" ? 0 : $(hash);
    if (target === null) return;
    e.preventDefault();
    history.pushState(null, "", hash);
    const headH = $("[data-head]").offsetHeight + 8;
    const y = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY - headH;
    lenis.scrollTo(Math.max(0, y));
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}

function initMotion() {
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove("is-stage", "has-motion");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add(MOTION_QUERY, () => {
    root.classList.add("has-motion");
    const stopSmooth = initSmoothScroll();
    playIntro();

    $$("[data-reveal]").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => el.classList.add("is-in"),
      });
    });

    return () => {
      if (stopSmooth) stopSmooth();
      root.classList.remove("has-motion", "is-ready");
    };
  });

  mm.add(STAGE_QUERY, () => {
    root.classList.add("is-stage");
    ScrollTrigger.refresh();

    const device = $("[data-device]");
    const centerShift = () => {
      const col = device.parentElement.getBoundingClientRect().width;
      return -(col - device.offsetWidth) / 2;
    };

    /* Un solo parallax: le chip scorrono più lente della pagina e svaniscono
       mentre il telefono si assesta al centro della colonna. */
    gsap.timeline({
      scrollTrigger: {
        start: 0,
        end: () => window.innerHeight * 0.9,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    })
      .to(".chip--map", { y: () => window.innerHeight * 0.4, autoAlpha: 0, ease: "none" }, 0)
      .to(".chip--sent", { y: () => window.innerHeight * 0.3, autoAlpha: 0, ease: "none" }, 0)
      .to(device, { x: centerShift, ease: "power1.inOut" }, 0);

    $$("[data-step]").forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => showScreen(i + 1),
        onEnterBack: () => showScreen(i + 1),
        onLeaveBack: i === 0 ? () => showScreen(0) : undefined,
      });
    });

    const stopTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches ? initTilt(device) : null;

    return () => {
      root.classList.remove("is-stage");
      showScreen(0);
      if (stopTilt) stopTilt();
    };
  });
}

$("[data-year]").textContent = String(new Date().getFullYear());
renderStores();
focusDownloadOnJump();
initHeader();
initOrb();
initMotion();
