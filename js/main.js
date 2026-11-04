/* PAWAY — un solo parallax tra apertura e «Come funziona»:
   la mezzaluna corallo scorre più lenta della schermata, che si ferma accanto ai passaggi.
   Senza JavaScript, su mobile o con movimento ridotto la pagina resta statica. */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

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

function initStage() {
  const root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove("is-stage");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  gsap.matchMedia().add(STAGE_QUERY, () => {
    root.classList.add("is-stage");
    ScrollTrigger.refresh();

    const device = $("[data-device]");
    const centerShift = () => {
      const col = device.parentElement.getBoundingClientRect().width;
      return -(col - device.offsetWidth) / 2;
    };

    gsap.timeline({
      scrollTrigger: {
        start: 0,
        end: () => window.innerHeight * 0.9,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    })
      .to("[data-crescent]", { y: () => window.innerHeight * 0.55, ease: "none" }, 0)
      .to(device, { x: centerShift, ease: "power1.inOut" }, 0);

    const steps = $$("[data-step]");
    steps.forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => showScreen(i + 1),
        onEnterBack: () => showScreen(i + 1),
        onLeaveBack: i === 0 ? () => showScreen(0) : undefined,
      });
    });

    return () => {
      root.classList.remove("is-stage");
      showScreen(0);
    };
  });
}

$("[data-year]").textContent = String(new Date().getFullYear());
renderStores();
focusDownloadOnJump();
initStage();
