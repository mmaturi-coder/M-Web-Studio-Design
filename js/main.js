/* PAWAY — motion sulla presentazione del servizio.
   GSAP per ingressi, scorrimento e passaggi del percorso.
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
      note: "Esempio completo disegnato nella guida: gatto abbandonato.",
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
  initDemo();
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
    .from(".hero__copy .kicker, .hero__copy .lead, .hero__actions, .pills", {
      y: 18, autoAlpha: 0, stagger: 0.06, duration: 0.55,
    }, "-=0.45")
    .from(".hero__device", { y: 40, autoAlpha: 0, duration: 0.8 }, "-=0.6");

  gsap.to(".hero__device", {
    y: -12, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.6,
  });
}

function initScroll() {
  gsap.to(".progress__bar", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
  });

  $$("[data-reveal]").forEach((el) => {
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

function initDemo() {
  const root = $("[data-demo]");
  const panels = $$("[data-panel]", root);
  const dots = $$(".demo__dots span", root);
  const live = $(".demo__live", root);
  let step = 0;

  const value = (name) => $(`input[name="${name}"]:checked`, root)?.value || "";

  const go = (next) => {
    if (next === step) return;
    const current = panels[step];
    const target = panels[next];
    const apply = () => {
      current.hidden = true;
      current.classList.remove("is-on");
      target.hidden = false;
      target.classList.add("is-on");
      dots.forEach((d, i) => d.classList.toggle("is-on", i === next));
      step = next;
      const labels = ["Scegli la situazione", "Scegli l’animale", "Riepilogo dell’anteprima"];
      live.textContent = labels[next];
    };
    if (next === 2) {
      $("[data-recap-what]", root).textContent = value("situazione");
      $("[data-recap-who]", root).textContent = value("animale");
    }
    if (REDUCE) {
      gsap.set(target, { autoAlpha: 1, y: 0 });
      apply();
      return;
    }
    gsap.to(current, {
      autoAlpha: 0, y: -10, duration: 0.22, ease: "power2.in",
      onComplete: () => {
        apply();
        gsap.fromTo(target, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" });
      },
    });
  };

  const requireChoice = (name, panel) => {
    if (value(name)) {
      $(".demo__error", panel).hidden = true;
      return true;
    }
    const err = $(".demo__error", panel);
    err.hidden = false;
    if (!REDUCE) gsap.fromTo(panel.querySelector(".choices"), { x: 0 }, { x: 7, duration: 0.07, yoyo: true, repeat: 5 });
    return false;
  };

  $$("[data-next]", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      if (step === 0 && !requireChoice("situazione", panels[0])) return;
      if (step === 1 && !requireChoice("animale", panels[1])) return;
      go(step + 1);
    });
  });
  $("[data-back]", root).addEventListener("click", () => go(0));
  $("[data-reset]", root).addEventListener("click", () => {
    $$("input", root).forEach((input) => { input.checked = false; });
    go(0);
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
    $$(".guide-card", host).forEach((card, i) => {
      const body = $(".guide-card__body", card);
      const item = GUIDES[i];
      if (!item.detail) {
        body.innerHTML = `<p>Nell’app questa scheda dice come muoverti per un ${species}. ${item.text}</p>`;
        return;
      }
      if (species === "cane") {
        body.innerHTML = `<p>I passaggi pratici cambiano con l’animale. L’esempio completo di questa presentazione è quello del gatto abbandonato, come nella guida disegnata.</p>`;
        return;
      }
      body.innerHTML = `
        <p>${item.detail.lead}</p>
        <p class="guide-label">Segnali comuni</p>
        <ul class="chips">${item.detail.signals.map((s) => `<li>${s}</li>`).join("")}</ul>
        <p class="guide-label">Cosa fare subito</p>
        <ul class="steps-list">${item.detail.steps.map((s) => `<li>${s}</li>`).join("")}</ul>
        <p class="guide-label">${item.detail.note}</p>
      `;
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

  const filter = () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    $$(".guide-card", host).forEach((card) => {
      const ok = !q || card.dataset.keys.includes(q);
      card.hidden = !ok;
      if (ok) shown += 1;
    });
    count.textContent = shown === 1 ? "1 indicazione" : `${shown} indicazioni`;
    empty.hidden = shown !== 0;
  };

  search.addEventListener("input", filter);
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
