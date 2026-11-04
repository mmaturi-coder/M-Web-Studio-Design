/* PAWAY — parallax di cane e gatto nell’apertura, una dissolvenza per sezione.
   Senza JavaScript o con movimento ridotto tutto resta visibile e fermo. */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

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

function initMotion() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 760px) and (prefers-reduced-motion: no-preference)",
    },
    (ctx) => {
      const { desktop } = ctx.conditions;
      const travel = desktop ? { cat: -28, dog: -16 } : { cat: -10, dog: -6 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      tl.to(".hero__cat", { y: travel.cat, ease: "none" }, 0)
        .to(".hero__dog", { y: travel.dog, ease: "none" }, 0);

      $$("[data-reveal]").forEach((section) => {
        gsap.from(section.children, {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        });
      });
    }
  );
}

function focusDownloadOnJump() {
  const target = $("#download");
  $$('a[href="#download"]').forEach((link) => {
    link.addEventListener("click", () => {
      window.setTimeout(() => target.focus({ preventScroll: true }), 0);
    });
  });
}

$("[data-year]").textContent = String(new Date().getFullYear());
renderStores();
focusDownloadOnJump();
initMotion();
