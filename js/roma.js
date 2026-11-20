(() => {
  const slider = document.querySelector('[data-roma-slider]');
  const image = document.querySelector('[data-roma-image]');
  if (!slider || !image) return;

  const slides = [
    { file: 'slide-01.jpg', alt: 'Copertina: il Colosseo emerge da una trama di punti luminosi su fondo scuro.' },
    { file: 'slide-02.jpg', alt: 'Claim del progetto: La memoria si fa eterna.' },
    { file: 'slide-03.jpg', alt: 'Indice della presentazione: concept, processo creativo, strumenti e mockup.' },
    { file: 'slide-04.jpg', alt: 'Concept: il Colosseo, in parte ricostruito da linee luminose, tra passato e futuro.' },
    { file: 'slide-05.jpg', alt: 'Apertura della sezione sul processo creativo.' },
    { file: 'slide-06.jpg', alt: 'Processo creativo e sviluppo del manifesto del Colosseo.' },
    { file: 'slide-07.jpg', alt: 'Apertura della sezione dedicata agli strumenti.' },
    { file: 'slide-08.jpg', alt: 'Strumenti utilizzati: ChatGPT, Kling, Illustrator e After Effects.' },
    { file: 'slide-09.jpg', alt: 'Apertura della sezione dedicata ai mockup.' },
    { file: 'slide-10.jpg', alt: 'Mockup del manifesto in una pensilina pubblicitaria notturna.' },
    { file: 'slide-11.jpg', alt: 'Mockup del manifesto in una pensilina davanti al Colosseo.' },
    { file: 'slide-12.jpg', alt: 'Mockup del manifesto in una fermata urbana illuminata di notte.' },
  ];

  const previous = document.querySelector('[data-roma-prev]');
  const next = document.querySelector('[data-roma-next]');
  const current = document.querySelector('[data-roma-current]');
  const progress = document.querySelector('[data-roma-progress]');
  const dots = [...document.querySelectorAll('[data-roma-dot]')];
  const status = document.querySelector('[data-roma-status]');
  const fullscreen = document.querySelector('[data-roma-fullscreen]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let touchStart = null;

  const preload = (index) => {
    if (index < 0 || index >= slides.length) return;
    const nextImage = new Image();
    nextImage.src = `assets/roma/slides/${slides[index].file}`;
  };

  const showSlide = (index) => {
    if (!Number.isInteger(index) || index < 0 || index >= slides.length) return;
    activeIndex = index;
    image.src = `assets/roma/slides/${slides[index].file}`;
    image.alt = slides[index].alt;
    current.textContent = String(index + 1).padStart(2, '0');
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    dots.forEach((dot, dotIndex) => {
      dot.setAttribute('aria-current', String(dotIndex === index));
    });
    preload(index - 1);
    preload(index + 1);
  };

  previous.addEventListener('click', () => showSlide(activeIndex - 1));
  next.addEventListener('click', () => showSlide(activeIndex + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));

  slider.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(activeIndex + 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      showSlide(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      showSlide(slides.length - 1);
    }
  });

  slider.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') touchStart = { x: event.clientX, y: event.clientY };
  });
  slider.addEventListener('pointerup', (event) => {
    if (!touchStart || event.pointerType !== 'touch') return;
    const deltaX = event.clientX - touchStart.x;
    const deltaY = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
      showSlide(activeIndex + (deltaX < 0 ? 1 : -1));
    }
  });
  slider.addEventListener('pointercancel', () => { touchStart = null; });

  document.querySelectorAll('[data-roma-jump]').forEach((button) => {
    button.addEventListener('click', () => {
      showSlide(Number(button.dataset.romaJump));
      slider.focus({ preventScroll: true });
      slider.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
    });
  });

  if (fullscreen && typeof slider.requestFullscreen === 'function') {
    fullscreen.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement === slider) {
          await document.exitFullscreen();
        } else {
          await slider.requestFullscreen();
        }
      } catch {
        status.textContent = 'La modalità schermo intero non è disponibile.';
      }
    });
    document.addEventListener('fullscreenchange', () => {
      const isFullscreen = document.fullscreenElement === slider;
      fullscreen.setAttribute('aria-pressed', String(isFullscreen));
      fullscreen.querySelector('span').textContent = isFullscreen ? '×' : '⛶';
      fullscreen.lastChild.textContent = isFullscreen ? ' Esci dallo schermo intero' : ' Schermo intero';
    });
  } else if (fullscreen) {
    fullscreen.hidden = true;
  }

  const year = document.querySelector('[data-roma-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  showSlide(0);
})();
