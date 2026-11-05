/* Link agli store. Lascia vuoto un campo finché il link non è pubblico:
   senza link la sezione download mostra «Disponibile prossimamente». */
window.PAWAY_CONFIG = {
  stores: {
    appStore: "",
    googlePlay: "",
  },
  /* Teaser: file in assets/video/ OPPURE link https (es. Google Drive uc?export=download&id=...) */
  video: {
    src: "assets/video/paway-teaser-cinematico.mp4",
    poster: "assets/img/paway-teaser-poster.webp",
    title: "PAWAY · teaser cinematico",
  },
};
