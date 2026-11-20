(() => {
  const container = document.querySelector('[data-paway-case]');
  if (!container) return;

  const slides = [
    { file: 'slide-09.jpg', title: 'Problema' },
    { file: 'slide-08.jpg', title: 'User research · Il triplo blocco del soccorso' },
    { file: 'slide-03.jpg', title: 'La sfida' },
    { file: 'slide-16.jpg', title: 'Competitor · Matrice UX' },
    { file: 'slide-14.jpg', title: 'La soluzione', animation: 'solution-logo' },
    { file: 'slide-04.jpg', title: 'Target personas · Chiara' },
    { file: 'slide-17.jpg', title: 'Target personas · Andrea' },
    { file: 'slide-11.jpg', title: 'Target personas · Cani e gatti' },
    { file: 'slide-13.jpg', title: 'Bentobox brand', overlayAnimation: 'ai' },
    { file: 'slide-18.jpg', title: 'Assistente AI', animation: 'ai' },
    { file: 'slide-15.jpg', title: 'Palette colori · Slide 16:9 - 4' },
    { file: 'slide-05.jpg', title: 'Logo · Slide 16:9 - 5' },
    { file: 'slide-01.jpg', title: 'Bagel Fat One · Slide 16:9 - 7' },
    { file: 'slide-10.jpg', title: 'Nunito Sans · Slide 16:9 - 8' },
    { file: 'slide-07.jpg', title: 'Campagna · Mockup' },
  ];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const teaser = document.createElement('figure');
  teaser.className = 'paway-case__media paway-case__media--cover';
  teaser.id = 'paway-teaser';
  teaser.innerHTML = `
    <span class="paway-case__index">Teaser</span>
    <video controls playsinline preload="metadata" poster="assets/paway/paway-teaser-poster.jpg"
      aria-label="PAWAY — Teaser cinematico">
      <source src="assets/paway/paway-teaser.mp4" type="video/mp4" />
    </video>
  `;
  container.append(teaser);

  const prototype = document.createElement('figure');
  prototype.className = 'paway-case__media paway-case__media--prototype';
  prototype.id = 'paway-prototype';
  prototype.innerHTML = `
    <span class="paway-case__index">Prototype</span>
    <video controls autoplay muted loop playsinline preload="metadata"
      poster="assets/paway/paway-prototype-poster.jpg"
      aria-label="PAWAY — Prototipo animato dell'app">
      <source src="assets/paway/paway-prototype.mp4" type="video/mp4" />
    </video>
  `;
  container.append(prototype);

  slides.forEach(({ file, title, animation, overlayAnimation }, index) => {
    const figure = document.createElement('figure');
    figure.className = 'paway-case__slide';
    figure.id = `paway-slide-${index + 1}`;
    const animated = Boolean(animation);
    const hasMotion = animated || Boolean(overlayAnimation);
    const visualFile = animated
      ? `assets/paway/paway-${animation}-motion.gif?v=20261118-11`
      : `assets/paway/slides/${file}`;
    if (animated) {
      figure.classList.add('paway-case__slide--animated', `paway-case__slide--animated-${animation}`, 'is-visible');
    }
    if (overlayAnimation) {
      figure.classList.add('paway-case__slide--has-animation-overlay', 'is-visible');
    }
    const overlayFile = overlayAnimation
      ? `assets/paway/paway-${overlayAnimation}-motion.gif?v=20261118-11`
      : '';
    figure.innerHTML = `
      <span class="paway-case__index">${String(index + 1).padStart(2, '0')} / ${slides.length} · ${title}</span>
      <img class="paway-case__visual" src="${visualFile}" alt="PAWAY — ${title}" loading="${index < 2 || hasMotion ? 'eager' : 'lazy'}" />
      ${overlayAnimation ? `<img class="paway-case__overlay" src="${overlayFile}" alt="" aria-hidden="true" loading="eager" />` : ''}
    `;
    container.append(figure);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    container.querySelectorAll('.paway-case__slide, .paway-case__media').forEach((slide) => observer.observe(slide));
  } else {
    container.querySelectorAll('.paway-case__slide, .paway-case__media').forEach((slide) => slide.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-paway-jump]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.pawayJump);
      const target = document.querySelector(`#paway-slide-${index + 1}`);
      target?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const year = document.querySelector('[data-paway-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
