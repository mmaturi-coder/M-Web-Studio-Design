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

function initFilm() {
  const cfg = window.PAWAY_CONFIG && window.PAWAY_CONFIG.video;
  const wrap = $("[data-film]");
  const video = $("[data-film-video]");
  if (!wrap || !video || !cfg || !String(cfg.src || "").trim()) {
    wrap?.closest(".film")?.remove();
    $$('a[href="#presentazione"]').forEach((a) => a.remove());
    return;
  }
  const src = String(cfg.src).trim();
  const poster = String(cfg.poster || "").trim();
  const source = $("source", video);
  if (source) source.src = src;
  else video.src = src;
  if (/^https?:\/\//i.test(src)) video.crossOrigin = "anonymous";
  if (poster) video.poster = poster;
  if (cfg.title) video.setAttribute("aria-label", String(cfg.title));
  video.load();
}

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
let smooth = null;

function initSmoothScroll() {
  if (!window.Lenis) return null;
  const lenis = new Lenis({ lerp: 0.1 });
  smooth = lenis;
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
    smooth = null;
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


/* ── Mappa interattiva: la cartografia della schermata «mappa», i tre punti e la scheda del prototipo ── */
const MAP_W = 830.8;
const MAP_H = 1150;
const METERS_PER_PX = 500 / 70.8; // la scala della schermata: 500 m = 70,8 px
const YOU = { x: 205, y: 488 }; // Campo de’ Fiori
const PLACES = {
  enpa: { name: "ENPA Roma", short: "ENPA Roma", kind: "Associazione · Cani e gatti", address: "Via Terni 42", zone: "San Giovanni", x: 792.4, y: 642.8 },
  vigili: { name: "Vigili del Fuoco", short: "Vigili del Fuoco", kind: "Comando · Roma", address: "Via Genova 3/A", zone: "Monti", x: 444.2, y: 413.2 },
  polizia: { name: "Polizia Locale", short: "Polizia Locale", kind: "Comando generale · Roma", address: "Via della Consolazione 4", zone: "Campitelli", x: 360.3, y: 545.6 },
  lndc: { name: "LNDC · Ostia", short: "LNDC", kind: "Associazione · Cani e gatti", address: "Sezione di Ostia · Roma", zone: "Ostia", time: "35 min", distance: "5,0 km · auto", navigate: "LNDC Lega Nazionale per la Difesa del Cane, Ostia, Roma" },
};

function initMap() {
  const map = $("[data-map]");
  if (!map) return;
  const world = $("[data-map-world]", map);
  const img = $(".map__img", map);
  const route = $("[data-map-route] path", map);
  const routeSvg = $("[data-map-route]", map);
  const you = $("[data-map-you]", map);
  const pins = $$("[data-map-pin]", map);
  const sheet = $("[data-map-sheet]", map);
  const dir = $("[data-map-dir]", map);
  const dirBtn = $("[data-map-directions]", map);
  const navigate = $("[data-map-navigate]", map);
  const scale = $("[data-map-scale]", map);
  const expand = $("[data-map-expand]", map);
  const zoomBtns = $$("[data-map-zoom]", map);
  const motion = window.matchMedia(MOTION_QUERY).matches && window.gsap;

  const view = { z: 1, tx: 0, ty: 0 };
  let current = null;

  const size = () => ({ w: map.clientWidth, h: map.clientHeight });

  const clamp = (v) => {
    const { w, h } = size();
    const ww = MAP_W * v.z;
    const wh = MAP_H * v.z;
    v.tx = ww <= w ? (w - ww) / 2 : Math.min(0, Math.max(w - ww, v.tx));
    v.ty = wh <= h ? (h - wh) / 2 : Math.min(0, Math.max(h - wh, v.ty));
    return v;
  };

  const render = () => {
    const z = view.z;
    world.style.transform = `translate3d(${view.tx}px, ${view.ty}px, 0)`;
    img.style.width = `${MAP_W * z}px`;
    img.style.height = `${MAP_H * z}px`;
    routeSvg.style.width = `${MAP_W * z}px`;
    routeSvg.style.height = `${MAP_H * z}px`;
    pins.forEach((pin) => {
      const p = PLACES[pin.dataset.mapPin];
      if (!p || p.x === undefined) return;
      pin.style.left = `${p.x * z}px`;
      pin.style.top = `${p.y * z}px`;
    });
    you.style.left = `${YOU.x * z}px`;
    you.style.top = `${YOU.y * z}px`;
    const metres = [1000, 500, 250, 100].find((m) => (m / METERS_PER_PX) * z <= 120) || 100;
    scale.style.width = `${(metres / METERS_PER_PX) * z}px`;
    scale.firstElementChild.textContent = metres >= 1000 ? `${metres / 1000} km` : `${metres} m`;
  };

  const goTo = (next, animate = true) => {
    clamp(next);
    if (motion && animate) {
      gsap.to(view, { ...next, duration: 0.5, ease: "power3.out", onUpdate: render, overwrite: true });
    } else {
      Object.assign(view, next);
      render();
    }
  };

  const centerOn = (x, y, z = view.z) => {
    const { w, h } = size();
    return { z, tx: w / 2 - x * z, ty: h / 2 - y * z };
  };

  /* Stato iniziale: Centro storico, Monti e San Giovanni in vista */
  const initial = () => {
    const { w } = size();
    return centerOn(w < 600 ? 520 : 585, 500, 1);
  };
  goTo(initial(), false);
  new ResizeObserver(() => goTo({ ...view }, false)).observe(map);

  /* Trascina per esplorare */
  let drag = null;
  map.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("button, a, .map__sheet")) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty, moved: false };
    map.setPointerCapture(e.pointerId);
    if (motion) gsap.killTweensOf(view);
  });
  map.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 4) {
      drag.moved = true;
      map.classList.add("is-dragging", "is-touched");
    }
    if (!drag.moved) return;
    Object.assign(view, clamp({ z: view.z, tx: drag.tx + dx, ty: drag.ty + dy }));
    render();
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag = null;
    map.classList.remove("is-dragging");
  };
  map.addEventListener("pointerup", endDrag);
  map.addEventListener("pointercancel", endDrag);

  /* Zoom 1× · 2× · 3× attorno al centro della vista */
  const setZoom = (z) => {
    const { w, h } = size();
    const cx = (w / 2 - view.tx) / view.z;
    const cy = (h / 2 - view.ty) / view.z;
    zoomBtns.forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.mapZoom) === z)));
    map.classList.add("is-touched");
    goTo(centerOn(cx, cy, z));
  };
  zoomBtns.forEach((b) => b.addEventListener("click", () => setZoom(Number(b.dataset.mapZoom))));

  /* Scheda del punto */
  const fill = (place) => {
    $$("[data-card]", sheet).forEach((el) => {
      const key = el.dataset.card;
      if (key in place) el.textContent = place[key];
    });
  };
  const drawRoute = (place) => {
    if (place.x === undefined) {
      map.classList.remove("has-route");
      return;
    }
    const mx = (YOU.x + place.x) / 2;
    const my = (YOU.y + place.y) / 2;
    const bend = place.y > YOU.y ? -70 : 70;
    route.setAttribute("d", `M${YOU.x} ${YOU.y} Q${mx + bend} ${my - bend} ${place.x} ${place.y}`);
    map.classList.add("has-route");
  };
  const estimate = (place) => {
    if (place.time) return { time: place.time, distance: place.distance };
    const metres = Math.hypot(place.x - YOU.x, place.y - YOU.y) * METERS_PER_PX * 1.35;
    const km = Math.max(0.5, Math.round(metres / 100) / 10);
    const minutes = Math.max(5, Math.round((km / 18) * 60 / 5) * 5);
    return { time: `${minutes} min`, distance: `${km.toFixed(1).replace(".", ",")} km · auto` };
  };
  const openCard = (key) => {
    const place = PLACES[key];
    if (!place) return;
    current = key;
    fill({ ...place, ...estimate(place) });
    dir.hidden = true;
    dirBtn.setAttribute("aria-pressed", "false");
    map.classList.remove("has-route");
    pins.forEach((p) => p.classList.toggle("is-active", p.dataset.mapPin === key));
    sheet.hidden = false;
    map.classList.add("is-touched");
    if (place.x !== undefined) {
      const { w, h } = size();
      const target = centerOn(place.x, place.y);
      const visibleX = place.x * view.z + view.tx;
      const visibleY = place.y * view.z + view.ty;
      if (visibleX < 40 || visibleX > w - 40 || visibleY < 60 || visibleY > h - 40) goTo(target);
    }
    dirBtn.focus({ preventScroll: true });
  };
  const closeCard = () => {
    sheet.hidden = true;
    map.classList.remove("has-route");
    pins.forEach((p) => p.classList.remove("is-active"));
    const pin = pins.find((p) => p.dataset.mapPin === current);
    current = null;
    if (pin) pin.focus({ preventScroll: true });
  };
  pins.forEach((pin) => pin.addEventListener("click", () => openCard(pin.dataset.mapPin)));
  $("[data-map-close]", map).addEventListener("click", closeCard);
  dirBtn.addEventListener("click", () => {
    const place = PLACES[current];
    const open = dir.hidden;
    dir.hidden = !open;
    dirBtn.setAttribute("aria-pressed", String(open));
    if (open) {
      drawRoute(place);
      const dest = place.navigate || `${place.address}, Roma`;
      navigate.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
      if (place.x !== undefined) goTo(centerOn((YOU.x + place.x) / 2, (YOU.y + place.y) / 2));
    } else {
      map.classList.remove("has-route");
    }
  });

  /* Schermo intero, come il tasto «espandi» del prototipo */
  const setExpanded = (on) => {
    map.classList.toggle("is-expanded", on);
    root.classList.toggle("map-open", on);
    expand.setAttribute("aria-pressed", String(on));
    expand.setAttribute("aria-label", on ? "Chiudi la mappa a schermo intero" : "Apri la mappa a schermo intero");
    if (smooth) on ? smooth.stop() : smooth.start();
    goTo({ ...view }, false);
  };
  expand.addEventListener("click", () => setExpanded(!map.classList.contains("is-expanded")));
  map.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!sheet.hidden) closeCard();
    else if (map.classList.contains("is-expanded")) setExpanded(false);
  });
}

$("[data-year]").textContent = String(new Date().getFullYear());
initFilm();
renderStores();
focusDownloadOnJump();
initHeader();
initOrb();
initMap();
initMotion();
