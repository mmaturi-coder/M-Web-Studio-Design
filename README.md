# PAWAY

Landing page di **PAWAY**, il servizio che aiuta chi incontra un cane o un gatto in difficoltà a capire come agire e a inviare una segnalazione.

Tre sezioni: apertura, come funziona, download. Fondo `#F2F5EF`, inchiostro `#171717`, corallo `#DB766B` (per i testi `#C6695F`). Bagel Fat One solo per il titolo d’apertura e «Scarica PAWAY», Nunito Sans per il resto.

## Avvio

```bash
python3 -m http.server 4173
```

Apri `http://localhost:4173`.

## Link agli store

I link stanno in `js/config.js`. Un badge compare solo quando il campo contiene un URL `https://`; se sono tutti vuoti la sezione mostra «Disponibile prossimamente».

## Immagini

- `assets/img/boxer*.webp`, `assets/img/gatto*.webp`: cane e gatto scontornati dal file Figma, in due misure.
- `assets/img/app-home*.webp`: la schermata Home dell’app, a 1× e 2×.

## Movimento

GSAP con ScrollTrigger. Nell’apertura cane e gatto si spostano a velocità diverse durante il primo tratto di scroll (16 e 28 px su desktop, 6 e 10 px su mobile); titolo e pulsante restano fermi. Le altre sezioni compaiono con una breve dissolvenza, una sola volta. Con `prefers-reduced-motion` non si muove nulla e senza JavaScript tutto resta visibile.
