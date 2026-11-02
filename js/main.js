/* PAWAY — presentazione del servizio.
   GSAP: ingresso del marchio, comparsa allo scorrimento, nastro.
   prefers-reduced-motion: tutto fermo e già visibile. */

gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const GUIDES = [
  {
    title: "Abbandonati",
    text: "Come aiutare e segnalare un ritrovamento.",
    keys: "abbandono abbandonati ritrovamento solo",
    detail: {
      lead: "Un gatto è considerato abbandonato se è solo, senza proprietario, in difficoltà e senza cure, cibo e riparo.",
      signals: ["Sembra solo", "Sembra spaesato", "Affamato", "Disidratato", "Ferito", "Malato", "Luogo insolito", "Luogo pericoloso"],
      steps: ["Mantenere la calma", "Mettilo in sicurezza", "Usa un asciugamano", "Idratalo", "Chiama i numeri di emergenza", "Segnala la posizione"],
    },
  },
  {
    title: "Maltrattati",
    text: "A chi rivolgerti per segnalare la situazione.",
    keys: "maltrattamento maltrattati segnalare",
  },
  {
    title: "Feriti",
    text: "Chi chiamare e cosa fare prima dei soccorsi.",
    keys: "ferita feriti soccorso",
  },
  {
    title: "Randagi",
    text: "Come avvicinarli e capire se serve aiuto.",
    keys: "randagio randagi avvicinare",
  },
];

let species = "gatto";
let started = false;

function init() {
  if (started) return;
  started = true;
  $("[data-year]").textContent = String(new Date().getFullYear());
  initNav();
  initGuide();
  if (REDUCE) return;
  initLoader();
  initScroll();
}

function initNav() {
  const btn = $(".nav-toggle");
  const nav = $(".nav");
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.querySelector(".visually-hidden").textContent = open ? "Chiudi il menu" : "Apri il menu";
  };
  btn.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  $$(".nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
}

function initLoader() {
  document.body.classList.add("nav-open");
  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      $(".loader").remove();
      document.body.classList.remove("nav-open");
    },
  });
  tl.from(".loader__logo", { scale: 0.86, autoAlpha: 0, duration: 0.7 })
    .to(".loader", { yPercent: -100, duration: 0.75, ease: "power4.inOut", delay: 0.25 })
    .from(".hero__title span", { y: 36, autoAlpha: 0, stagger: 0.08, duration: 0.7 }, "-=0.45")
    .from(".hero__copy .kicker, .hero__copy .lead, .hero__actions", {
      y: 18, autoAlpha: 0, stagger: 0.06, duration: 0.55,
    }, "-=0.45")
    .from(".promises li", { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, "-=0.4");
}

function initScroll() {
  gsap.to(".progress__bar", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
  });

  $$("[data-reveal]").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.from(el, {
      y: 28,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  gsap.to(".marquee__track", {
    xPercent: -50,
    duration: 16,
    ease: "none",
    repeat: -1,
  });
}

function initGuide() {
  const host = $("[data-guide]");
  const search = $("[data-search]");
  const count = $("[data-count]");
  const empty = $("[data-empty]");

  host.innerHTML = GUIDES.map((item, i) => `
    <article class="guide-card" data-keys="${item.keys} ${item.title.toLowerCase()} ${item.text.toLowerCase()}">
      <p class="kicker">0${i + 1}</p>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      <button class="guide-card__open" type="button" aria-expanded="false">Cosa fare</button>
      <div class="guide-card__more"><div><div class="guide-card__body"></div></div></div>
    </article>
  `).join("");

  const paint = () => {
    const who = species === "gatto" ? "un gatto" : "un cane";
    $$(".guide-card", host).forEach((card, i) => {
      const body = $(".guide-card__body", card);
      const item = GUIDES[i];
      if (item.detail && species === "gatto") {
        body.innerHTML = `
          <p>${item.detail.lead}</p>
          <p class="guide-label">Segnali comuni</p>
          <ul class="chips">${item.detail.signals.map((s) => `<li>${s}</li>`).join("")}</ul>
          <p class="guide-label">Cosa fare subito</p>
          <ul class="steps-list">${item.detail.steps.map((s) => `<li>${s}</li>`).join("")}</ul>
        `;
        return;
      }
      if (item.detail) {
        body.innerHTML = `<p>Per ${who} i passaggi cambiano. L’esempio completo di questa guida è quello del gatto abbandonato: solo, senza cure, cibo e riparo.</p>`;
        return;
      }
      body.innerHTML = `<p>Per ${who}: ${item.text.charAt(0).toLowerCase()}${item.text.slice(1)}</p>`;
    });
  };

  $$(".guide-card__open", host).forEach((btn) => {
    btn.addEventListener("click", () => {
      const more = btn.nextElementSibling;
      const open = !more.classList.contains("is-open");
      $$(".guide-card__more", host).forEach((el) => el.classList.remove("is-open"));
      $$(".guide-card__open", host).forEach((el) => el.setAttribute("aria-expanded", "false"));
      if (open) {
        more.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    $$(".guide-card", host).forEach((card) => {
      const ok = !q || card.dataset.keys.includes(q);
      card.hidden = !ok;
      if (ok) shown += 1;
    });
    count.textContent = shown === 1 ? "1 indicazione" : `${shown} indicazioni`;
    empty.hidden = shown !== 0;
  });

  $$("[data-species]").forEach((btn) => {
    btn.addEventListener("click", () => {
      species = btn.dataset.species;
      $$("[data-species]").forEach((el) => {
        const on = el === btn;
        el.classList.toggle("is-on", on);
        el.setAttribute("aria-pressed", String(on));
      });
      paint();
    });
  });

  paint();
}

if (document.fonts) document.fonts.ready.then(init);
else init();
window.addEventListener("load", init, { once: true });
