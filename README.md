# M — Web Design Studio · Landing Page

Landing page cinematica per il brand **M** di Maria Maturi. Vanilla HTML/CSS/JS + GSAP (ScrollSmoother, ScrollTrigger, SplitText, DrawSVG, MotionPath), tutto in locale — nessun CDN.

## Avvio

Serve un web server statico qualsiasi (font e video richiedono `http://`, non `file://`):

```bash
python3 -m http.server 4173
# → http://localhost:4173
```

## Struttura

```
index.html          markup di tutte le sezioni
css/style.css       identità visiva, layout, stati hover
js/main.js          coreografia GSAP, un blocco commentato per effetto
vendor/             gsap.min.js + ScrollSmoother/ScrollTrigger/SplitText/DrawSVG/MotionPath (v3.15)
assets/logo.png     logo ufficiale (navbar, loader, favicon, footer)
assets/showreel.mp4 clone APFS di "portfolio esame Maria_Maturi.mp4" (originale intatto)
assets/showreel-poster.jpg  poster frame estratto a 3s
roma.html           presentazione interattiva del progetto Roma città eterna
css/roma.css        layout dedicato alla pagina Roma
js/roma.js          navigazione accessibile delle 12 slide
assets/roma/        PDF originale, video, poster e slide JPEG
paway.html          case study PAWAY con slide esportate e video
css/paway.css       layout responsive della pagina PAWAY
js/paway.js         presentazione dei video e delle 15 slide PAWAY
assets/vodka-festival/ video MP4 Absolut Vodka Festival e poster per la card
assets/fonts/       AllRound Gothic 500/600 (otf) · Manrope 400/500 · Poppins (fallback)
```

## Sezioni

Loader (logo reveal + counter) → Hero (**motion curve**: una curva di easing blu con keyframe a rombo e label `cubic-bezier`, disegnata al load; il playhead la percorre con lo scroll; hover su "IN MOTION" = flood blu fluido con stroke che si dissolve) → 01 Studio/Manifesto → ticker cinetico → **02 Portfolio: showreel con zoom parallax pinnato + carosello di progetti in card 16:9** → 03 Process (indici "/ 01 — Phase", righe che si allagano d'inchiostro all'hover full-bleed) → 04 CV (download PDF) → 05 Contact (headline outline con flood fluido per riga, email magnetica) → footer ricco (giant "Let's talk" con flood, sitemap/social, back-to-top, orologio live, watermark parallax). Hairline blu di progresso pagina in alto (film scrubber).

La card **Roma città eterna** apre `roma.html`: overview del concept, riconoscimento di seconda classificata, poster statico e video verticale affiancati, scorciatoie ai capitoli e viewer 16:9 per tutte le 12 slide (frecce, punti, tastiera, swipe e schermo intero). Il PDF originale è scaricabile dalla pagina.

La card **PAWAY** apre `paway.html`: case study con teaser e prototipo video all'inizio, seguiti dalle 15 slide esportate nell'ordine visivo del canvas Figma. La GIF dell'assistente AI è nella sua slide e in piccolo nella tessera Bentobox, senza coprirne il bordo; la slide Soluzione usa l'animazione del logo. Tutte le tavole hanno proporzioni uniformi.

Il microsito PAWAY autonomo già pubblicato in `paway/` resta disponibile in parallelo.

La card **Absolut Vodka Festival** apre il film in una finestra modale e avvia la riproduzione; la chiusura ferma e riporta il video all'inizio.

## Personalizzazione

- **Video**: sostituisci `assets/showreel.mp4` (e rigenera il poster: `ffmpeg -ss 3 -i showreel.mp4 -frames:v 1 showreel-poster.jpg`).
- **Palette**: variabili in `:root` (`--bg #F7F7F5`, `--ink #111111`, `--blue #1A46FF`).
- **Portfolio**: il carosello centra una card 16:9 alla volta. La sequenza delle slide PAWAY è in `js/paway.js`; aggiorna la lista e i file in `assets/paway/slides/` per sostituire le tavole.
- **Roma città eterna**: aggiorna le immagini in `assets/roma/slides/`, il video `assets/roma/roma-video.mp4`, il poster `assets/roma/roma-poster.jpeg` e il PDF `assets/roma/presentazione-roma.pdf`; `js/roma.js` gestisce la navigazione delle slide.
- **CV**: il pulsante scarica il PDF e apre anche l'anteprima; sostituisci `assets/cv-maria-maturi.pdf` e `assets/cv-maria-maturi-preview.png` per aggiornare il documento.
- **Logo**: `assets/logo.png` usato ovunque as-is; nei contesti scuri viene mostrato in negativo via `filter: invert(1)` (il file non viene toccato).
- **Email/social**: cerca `webstudiodesign.m@gmail.com` e i link `#` nel footer.

## Note tecniche

- **ScrollSmoother** avvolge `#smooth-wrapper > #smooth-content` (solo `<main>`; header/menu/cursor/pill restano fuori per il position:fixed). Scroll inerziale `smooth: 1.4` — anche lo zoom del video e i parallax leggono la posizione smussata, quindi risultano fluidi. Gli anchor `#` usano `smoother.scrollTo`.
- **Motion curve nell'hero**: SVG inline (viewBox 1440×800, slice) con path bezier blu disegnato via DrawSVG al load, keyframe a rombo che "poppano", label `cubic-bezier(0.16, 1, 0.3, 1)` e un playhead che percorre la curva in scrub via MotionPathPlugin (`immediateRender: true` per partire sull'inizio del path).
- **Flood fluido delle lettere** (`fluidFill` in main.js): hover su una headline outline → i char si riempiono in sequenza (stagger 0.03) mentre lo stroke si dissolve verso alpha 0 — un'onda liquida, non un fill per-lettera. Applicato a hero "IN MOTION" (blu #1A46FF, stroke nero rimosso), righe CTA e footer "Let's talk".
- **Interattività diffusa**: righe Process che si allagano d'inchiostro (banda full-bleed `scaleX`), bottoni magnetici, cursore custom con stati, orologio live nel footer, back-to-top sullo scroll smussato; blu dedicato `--blue-bright` per la leggibilità su fondo scuro.
- **Velocity skew**: la velocità di scroll inclina leggermente i blocchi `[data-skew]` (manifesto, lista Process), con ritorno morbido a riposo — elasticità cinematica.
- **Ticker cinetico**: loop infinito la cui `timeScale` è pilotata dalla velocità di scroll (`smoother.getVelocity()`), inverte direzione scrollando su, torna a velocità di crociera a scroll fermo.
- I titoli usano AllRound Gothic reale (`@font-face`, copie in assets/fonts da ~/Library/Fonts); Poppins resta come fallback nello stack.
- `prefers-reduced-motion`: niente smoother/zoom/autoplay, il video mostra i controlli nativi, shader in un unico frame statico; contenuti sempre visibili.
